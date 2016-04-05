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
 * <p>This module extends the standard [actions renderer]{@link module:alfresco/renderers/Actions} to 
 * provide the capability to asynchronously retrieve the actions for a specific Alfresco document or 
 * folder when only the NodeRef is known.</p>
 *
 * @module alfresco/renderers/XhrContextActions
 * @extends module:alfresco/renderers/ContextActions
 * @mixes module:alfresco/renderers/_XhrActionsMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/ContextActions",
        "alfresco/renderers/_XhrActionsMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/aspect"], 
        function(declare, ContextActions, _XhrActionsMixin, lang, array, aspect) {

   return declare([ContextActions, _XhrActionsMixin], {
      
      /**
       * A boolean flag indicating whether or not the actions have been loaded yet.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.62
       */
      _actionsLoaded: false,

      /**
       * The JSON model for controlling the widgets that are displayed whilst waiting for the
       * XHR request to complete.
       *
       * @instance
       * @type {array}
       * @since 1.0.62
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
       * Overrides the [inherited function]{@link module:alfresco/renderers/_XhrActionsMixin#onXhrData}. It calls 
       * [addXhrItems]{@link module:alfresco/renderers/_XhrActionsMixin#addXhrItems} to render the actions.
       * 
       * @instance
       * @param  {function} callback The function to call to display the drop-down (not required for context actions)
       * @param {object} payload
       * @since 1.0.62
       */
      onXhrData: function alfresco_renderers_XhrContextActions__onXhrData(callback, payload) {
         this.alfUnsubscribeSaveHandles([this._xhrDataRequestHandle]);
         if (lang.exists("response.item", payload)) 
         {
            this._actionsLoaded = true;
            this.currentItem = payload.response.item;
            this.clearLoadingItem();
            this.addActions();
         }
         else
         {
            this.alfLog("warn", "Node data was provided but the 'response.item' attribute was not found", payload, this);
         }
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/renderers/_XhrActionsMixin#addActions} to create place
       * holding [widgets]{@link module:alfresco/renderers/XhrContextActions#widgetsForLoading} to display until the
       * XHR request to retrieve the full Node details returns. This function is subsequently called when the user
       * opens the pop-up menu to render all the actions.
       * 
       * @instance
       * @since 1.0.62
       */
      addActions: function alfresco_renderers_XhrContextActions__postCreate() {
         if (this._actionsLoaded)
         {
            this.inherited(arguments);
         }
         else
         {
            this.processWidgets(this.widgetsForLoading);

            // Pass the loading JSON model to the actions menu group to be displayed...
            aspect.after(this._menu, "_scheduleOpen", lang.hitch(this, this.loadActions));
         }
      },

      /**
       * Removes the "Loading..." place holder menu item. Called from 
       * [onXhrData]{@link module:alfresco/renderers/XhrContextActions#onXhrData}
       * 
       * @instance
       * @since 1.0.62
       */
      clearLoadingItem: function alfresco_renderers_XhrContextActions__clearLoadingItem() {
         array.forEach(this._menu.getChildren(), function(widget) {
            this._menu.removeChild(widget);
         }, this);
      }
   });
});