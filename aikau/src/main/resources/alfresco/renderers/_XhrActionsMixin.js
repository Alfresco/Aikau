/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
 *
 * This file is part of Alfresco
 *
 * Alfresco is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Alfresco is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with Alfresco. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * <p>This mixin extends the standard [actions mixin]{@link alfresco/renderers/_ActionsMixin}
 * to allow Alfresco folder or document actions to be asynchronously retrieved when only the 
 * NodeRef is known.</p>
 * 
 * @module alfresco/renderers/_XhrActionsMixin
 * @extends module:alfresco/renderers/_ActionsMixin
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/_ActionsMixin",
        "alfresco/menus/AlfMenuGroup",
        "dojo/_base/array",
        "dojo/_base/lang",
        "service/constants/Default",
        "dijit/popup"], 
        function(declare, _ActionsMixin, AlfMenuGroup, array, lang, AlfConstants, popup) {

   return declare([_ActionsMixin], {
      
      /**
       * The JSON model for controlling the widgets that are displayed whilst waiting for the
       * XHR request to complete.
       *
       * @instance
       * @type {array}
       */
      widgetsForLoading: [
         {
            name: "alfresco/header/AlfMenuItem",
            config: {
               iconClass: "alf-loading-icon",
               label: "loading.label"
            }
         }
      ],

      /**
       *
       * @instance
       */
      addActions: function alfresco_renderers_XhrActions__postCreate() {

         // Pass the loading JSON model to the actions menu group to be displayed...
         this.actionsGroup.processWidgets(this.widgetsForLoading);

         if (this.actionsMenu.popup)
         {
            // Load the actions only when the user opens the Actions menu...
            this.actionsMenu.popup.onOpen = dojo.hitch(this, this.loadActions);
         }
         else
         {
            this.alfLog("log", "No Sites Menu popup - something has gone wrong!");
         }
      },

      /**
       * A boolean flag indicating whether or not the actions have been loaded yet.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      _actionsLoaded: false,

      /**
       * @instance
       */
      loadActions: function alfresco_renderers_XhrActions__loadActions() {
         if (this._actionsLoaded)
         {
            this.alfLog("log", "Actions already loaded");
         }
         else
         {
            this.alfLog("log", "Loading actions");
            this.getXhrData();
         }
      },

      /**
       * 
       * @instance
       */
      getXhrData: function alfresco_renderers_XhrActions__getXhrData() {
         var nodeRef = lang.getObject("nodeRef", false, this.currentItem);
         if (nodeRef != null)
         {
            // Generate a UUID for the response to the publication to ensure that only this widget
            // handles to the XHR data...
            var responseTopic = this.generateUuid();
            this._xhrDataRequestHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, "onXhrData"), true);
            this.alfPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST", {
               alfResponseTopic: responseTopic,
               nodeRef: nodeRef
            }, true);
         }
         else
         {
            this.alfLog("warn", "No nodeRef attribute available to use to retrieve all data.", this);
         }
      },

      /**
       * Handles the processing of the asynchronously requested data. It will attempt to render the returned
       * data item using the attribute "widgetsForXhrData".
       * 
       * @instance
       * @param {object} payload 
       */
      onXhrData: function alfresco_renderers_XhrActions__onXhrData(payload) {
         this.alfUnsubscribeSaveHandles([this._xhrDataRequestHandle]);
         if (lang.exists("response.item", payload)) 
         {
            this._actionsLoaded = true;
            this.currentItem = payload.response.item;

            this.clearLoadingItem();
            this.addXhrItems();

            // When we add in the XHR data there is a good chance that the new menu items will be wider
            // that the original "Loading..." message, this can result in the popup being poorly placed,
            // an example of this is on the search results page where the loaded actions are initially
            // shown slightly off-screen. To work around this issue we will immediately close and then
            // re-open the popup and leave dijit/popup to place the menu sensibly...

            // PLEASE NOTE: Temporarily commented out as although this performs the re-draw admirably,
            //              the first time the menu items are clicked they have no effect
            //              See: https://issues.alfresco.com/jira/browse/ACE-1865
            // popup.close(this.actionsMenu.popup);
            // popup.open({popup:this.actionsMenu.popup,around:this.actionsMenu.domNode});
         }
         else
         {
            this.alfLog("warn", "Document data was provided but the 'response.item' attribute was not found", payload, this);
         }
      },

      /**
       * Removes the "Loading..." place holder menu item.
       * 
       * @instance
       */
      clearLoadingItem: function alfresco_renderers_XhrActions__clearLoadingItem() {
         array.forEach(this.actionsMenu.popup.getChildren(), function(widget, index) {
            this.actionsMenu.popup.removeChild(widget);
         }, this);
      },

      /**
       * Adds the menu items for the asynchronously retrieved data.
       *
       * @instance
       */
      addXhrItems: function alfresco_renderers_XhrActions__addXhrItems() {
         this.actionsGroup = new AlfMenuGroup({});
         this.actionsMenu.popup.addChild(this.actionsGroup);
         array.forEach(this.currentItem.actions, lang.hitch(this, "addAction"));
      }
   });
});