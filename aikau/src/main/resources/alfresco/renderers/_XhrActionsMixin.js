/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
        "alfresco/core/topics",
        "alfresco/menus/AlfMenuGroup",
        "dojo/_base/array",
        "dojo/_base/lang"], 
        function(declare, _ActionsMixin, topics, AlfMenuGroup, array, lang) {

   return declare([_ActionsMixin], {
      
      /**
       * A boolean flag indicating whether or not the actions have been loaded yet.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      _actionsLoaded: false,

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
       * Extends the [inherited function]{@link module:alfresco/renderers/_ActionsMixin#addActions} to create place
       * holding [widgets]{@link module:alfresco/renderers/_XhrActionsMixin#widgetsForLoading} to display until the
       * XHR request to retrieve the full Node details returns. This function is subsequently called when the user
       * opens the pop-up menu to render all the actions.
       * 
       * @instance
       */
      addActions: function alfresco_renderers__XhrActionsMixin__postCreate() {
         if (this._actionsLoaded)
         {
            this.inherited(arguments);
         }
         else
         {
            // Pass the loading JSON model to the actions menu group to be displayed...
            this.actionsGroup.processWidgets(this.widgetsForLoading);
            if (this.actionsMenu.popup)
            {
               // Load the actions only when the user opens the Actions menu...
               this.actionsMenu.popup.onOpen = lang.hitch(this, this.loadActions);
            }
            else
            {
               this.alfLog("log", "No actions popup - something has gone wrong!");
            }
         }
      },

      /**
       * Called whenever the user opens up the actions pop-up menu. If an XHR request has not yet been made to 
       * retrieve the full Node data for the current item then the [getXhrData]{@link module:alfresco/renderers/_XhrActionsMixin#getXhrData}
       * function will be called, otherwise the previously rendered actions will be shown.
       * 
       * @instance
       */
      loadActions: function alfresco_renderers__XhrActionsMixin__loadActions() {
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
       * Publishes a request to retrieve the full Node data for the current item.
       * 
       * @instance
       * @fires module:alfresco/core/topics#GET_DOCUMENT
       */
      getXhrData: function alfresco_renderers__XhrActionsMixin__getXhrData() {
         var nodeRef = lang.getObject("nodeRef", false, this.currentItem);
         if (nodeRef)
         {
            // Generate a UUID for the response to the publication to ensure that only this widget
            // handles to the XHR data...
            var responseTopic = this.generateUuid();
            this._xhrDataRequestHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onXhrData), true);
            this.alfPublish(topics.GET_DOCUMENT, {
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
       * Handles the processing of the asynchronously requested data. It calls 
       * [addXhrItems]{@link module:alfresco/renderers/_XhrActionsMixin#addXhrItems} to render the actions.
       * 
       * @instance
       * @param {object} payload 
       */
      onXhrData: function alfresco_renderers__XhrActionsMixin__onXhrData(payload) {
         this.alfUnsubscribeSaveHandles([this._xhrDataRequestHandle]);
         if (lang.exists("response.item", payload)) 
         {
            this._actionsLoaded = true;
            this.currentItem = payload.response.item;
            this.clearLoadingItem();
            this.addXhrItems();
         }
         else
         {
            this.alfLog("warn", "Node data was provided but the 'response.item' attribute was not found", payload, this);
         }
      },

      /**
       * Removes the "Loading..." place holder menu item. Called from [onXhrData]{@link module:alfresco/renderers/_XhrActionsMixin#onXhrData}
       * 
       * @instance
       */
      clearLoadingItem: function alfresco_renderers__XhrActionsMixin__clearLoadingItem() {
         array.forEach(this.actionsMenu.popup.getChildren(), function(widget) {
            this.actionsMenu.popup.removeChild(widget);
         }, this);
      },

      /**
       * Adds the menu items for the asynchronously retrieved data. Called from [onXhrData]{@link module:alfresco/renderers/_XhrActionsMixin#onXhrData}
       *
       * @instance
       */
      addXhrItems: function alfresco_renderers__XhrActionsMixin__addXhrItems() {
         this.actionsGroup = new AlfMenuGroup({});
         this.actionsMenu.popup.addChild(this.actionsGroup);
         this.addActions();
      }
   });
});