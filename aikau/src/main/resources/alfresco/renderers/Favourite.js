/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * @module alfresco/renderers/Favourite
 * @extends module:alfresco/renderers/Toggle
 * @mixes module:alfresco/services/_PreferenceServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Toggle",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "dojo/_base/lang"], 
        function(declare, Toggle, _PreferenceServiceTopicMixin, lang) {

   return declare([Toggle, _PreferenceServiceTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Favourite.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Favourite.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Favourite.css"}]
       */
      cssRequirements: [{cssFile:"./css/Favourite.css"}],
      
      /**
       * The label to show when the toggle is on
       * @instance
       * @type {string} 
       * @default
       */
      onLabel: "",
      
      /**
       * The label to show when the toggle is on
       * @instance
       * @type {string} 
       * @default
       */
      offLabel: "favourite.add.label",
      
      /**
       * The tooltip to show when the toggle is on
       * @instance
       * @type {string}
       * @default
       */
      onTooltip: "favourite.remove.tooltip",
      
      /**
       * Override this to add a specific image for the "on" state.
       *
       * @instance
       * @type {string}
       * @default
       */
      offTooltip: "favourite.add.tooltip",
      
      /**
       * The CSS class to apply for the on display
       * @instance
       * @type {string}
       * @default
       */
      toggleClass: "favourite",
      
      /**
       * Extends to add the count of all likes.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Favourite__postMixInProperties() {
         this.toggleOnTopic = this.toggleOnTopic || this.addFavouriteDocumentTopic;
         this.toggleOffTopic = this.toggleOffTopic || this.removeFavouriteDocumentTopic;
         this.inherited(arguments);
      },

      /**
       * Extends the [inherted function]{@link module:alfresco/renderers/Toggle#postCreate} to
       * create additional subscriptions to the [toggleOnSuccessTopic]{@link module:alfresco/renderers/Toggle#toggleOnSuccessTopic}
       * and [toggleOffSuccessTopic]{@link module::alfresco/renderers/Toggle#toggleOffSuccessTopic} in order
       * to track bulk adding and removing of favourites.
       * 
       * @instance
       * @since 1.0.38
       * @listens alfresco/renderers/Toggle#toggleOnSuccessTopic
       * @listens alfresco/renderers/Toggle#toggleOffSuccessTopic
       */
      postCreate: function alfresco_renderers_Favourite__postCreate() {
         this.inherited(arguments);
         this.alfSubscribe(this.toggleOnSuccessTopic, lang.hitch(this, this.onBulkUpdate, true), true);
         this.alfSubscribe(this.toggleOffSuccessTopic, lang.hitch(this, this.onBulkUpdate, false), true);
      },

      /**
       * This function evaluates whether or not a bulk add or remove favourite operation effects the 
       * Node rendered by the current instance and if so, calls the appropriate functions to update
       * the rendering accordingly.
       * 
       * @param {boolean} add Indicates whether or not the bulk change was to add favourites
       * @param {object}  payload The payload from the bulk update publication.
       * @since 1.0.38
       */
      onBulkUpdate: function alfresco_renderers_Favourite__onBulkUpdate(add, payload) {
         this.alfLog("log", "Favourites added", payload);
         var updatedNodes = lang.getObject("requestConfig.updatedValue", false, payload);
         var currentNodeRef = lang.getObject("node.nodeRef", false, this.currentItem);
         if (updatedNodes && currentNodeRef && updatedNodes.indexOf(currentNodeRef) !== -1)
         {
            if (add)
            {
               this.renderToggledOn();
               this.onToggleOnSuccess();
            }
            else
            {
               this.renderToggledOff();
               this.onToggleOffSuccess();
            }
         }
      },
      
      /**
       * Sets a default dot-notation property in the current item to use to render the initial state.
       *
       * @instance
       * @type {string}
       * @default
       */
      propertyToRender: "isFavourite"
   });
});