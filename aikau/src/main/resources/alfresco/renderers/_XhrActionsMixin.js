/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
        "dojo/aspect",
        "dojo/_base/array",
        "dojo/_base/lang"], 
        function(declare, _ActionsMixin, topics, aspect, array, lang) {

   return declare([_ActionsMixin], {
      
      /**
       * The array of file(s) containing internationalised strings.
       *
       * @instance
       * @type {object}
       * @default [{i18nFile: "./i18n/_XhrActionsMixin.properties"}]
       * @since 1.0.46
       */
      i18nRequirements: [{i18nFile: "./i18n/_XhrActionsMixin.properties"}],
      
      /**
       * The lookup key into current item to retrieve the short name of the site in which the current item is
       * located. This may be relevant to correctly obtain all item actions if evaluation of these actions is
       * dependant on the site scope.
       * 
       * @instance
       * @type {string}
       * @since 1.0.79
       */
      currentItemSiteShortNameKey : null,
      
      /**
       * The name of the view for which to load actions. Depending on the backend loading actions this may
       * allow a differentiation between various scopes that actions have been associated with.
       * 
       * @instance
       * @type {string}
       * @since 1.0.79
       */
      actionView : null,

      /**
       * Overrides the [inherited function]{@link module:alfresco/renderers/_ActionsMixin#createDropDownMenu}
       * to call [loadActions]{@link module:alfresco/renderers/_XhrActionsMixin#loadActions} to ensure that
       * the actions are loaded before the drop-down menu is displayed.
       * 
       * @instance
       * @param  {function} callback The function to call to display the drop-down
       * @since 1.0.62
       */
      createDropDownMenu: function alfresco_renderers__XhrActionsMixin__createDropDownMenu(callback) {
         this.createEmptyMenu();
         this.loadActions(callback);
      },

      /**
       * Called whenever the user opens up the actions pop-up menu. If an XHR request has not yet been made to 
       * retrieve the full Node data for the current item then the 
       * [getXhrData]{@link module:alfresco/renderers/_XhrActionsMixin#getXhrData} function will be called, otherwise 
       * the previously rendered actions will be shown.
       * 
       * @instance
       * @param  {function} callback The function to call to display the drop-down
       */
      loadActions: function alfresco_renderers__XhrActionsMixin__loadActions(callback) {
         if (this._actionsLoaded)
         {
            this.alfLog("log", "Actions already loaded");
            callback();
         }
         else
         {
            this.alfLog("log", "Loading actions");
            if (this._button)
            {
               this._button.set("label", this.message("loading.label"));
               this._button.set("disabled", true);
            }
            this.getXhrData(callback);
         }
      },

      /**
       * Publishes a request to retrieve the full Node data for the current item.
       * 
       * @instance
       * @param  {function} callback The function to call to display the drop-down
       * @fires module:alfresco/core/topics#GET_DOCUMENT
       */
      getXhrData: function alfresco_renderers__XhrActionsMixin__getXhrData(callback) {
         var nodeRef = lang.getObject("nodeRef", false, this.currentItem);
         if (nodeRef)
         {
            // depending on how item was loaded site can be coded in different ways
            var site;
            if (this.currentItemSiteShortNameKey)
            {
                site = lang.getObject(this.currentItemSiteShortNameKey, false, this.currentItem);
            }
            else
            {
                // default fallbacks for search and doclib data web scripts (JsNode vs. bare)
                site = site || lang.getObject("site.shortName", false, this.currentItem);
                site = site || lang.getObject("node.location.site.name", false, this.currentItem);
                site = site || lang.getObject("location.site.name", false, this.currentItem);
            }
            // Generate a UUID for the response to the publication to ensure that only this widget
            // handles to the XHR data...
            var responseTopic = this.generateUuid();
            this._xhrDataRequestHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onXhrData, callback), true);
            this.alfPublish(topics.GET_DOCUMENT, {
               alfResponseTopic: responseTopic,
               nodeRef: nodeRef,
               site : site,
               view : this.actionView
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
       * @param  {function} callback The function to call to display the drop-down
       * @param {object} payload 
       */
      onXhrData: function alfresco_renderers__XhrActionsMixin__onXhrData(callback, payload) {
         this.alfUnsubscribeSaveHandles([this._xhrDataRequestHandle]);
         if (lang.exists("response.item", payload)) 
         {
            this.currentItem = payload.response.item;
            this.addXhrItems();
            if (typeof callback === "function")
            {
               callback();
            }
         }
         else
         {
            this.alfLog("warn", "Node data was provided but the 'response.item' attribute was not found", payload, this);
         }
      },

      /**
       * Adds the menu items for the asynchronously retrieved data. Called from 
       * [onXhrData]{@link module:alfresco/renderers/_XhrActionsMixin#onXhrData}.
       *
       * @instance
       */
      addXhrItems: function alfresco_renderers__XhrActionsMixin__addXhrItems() {
         if (this._button)
         {
            this._button.set("label", this.message("alf.renderers.Actions.menuLabel"));
            this._button.set("disabled", false);
         }
         this.addActions();
      }
   });
});