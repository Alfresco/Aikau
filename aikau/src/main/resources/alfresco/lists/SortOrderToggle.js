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
 * A specialization of the [AlfMenubarToggle]{@link module:alfresco/menus/AlfMenuBarToggle} that should
 * be used for changing the sort order of an
 * [AlfSortablePaginatedList]{@link module:alfresco/lists/AlfSortablePaginatedList}.
 *
 * @example <caption>Simple example for sort order toggling - just include in the page model!</caption>
 * {
 *   name: "alfresco/lists/SortOrderToggle"
 * }
 * 
 * @module alfresco/lists/SortOrderToggle
 * @extends module:alfresco/menus/AlfMenuBarToggle
 * @author Dave Draper
 * @since 1.0.75
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBarToggle",
        "alfresco/core/topics"], 
        function(declare, AlfMenuBarToggle, topics) {

   return declare([AlfMenuBarToggle], {
      
      /**
       * Overrides the default [checked]{@link module:alfresco/menus/AlfMenuBarToggle#checked} value to be
       * true.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      checked: true,

      /**
       * Overrides the default [checkedValue]{@link module:alfresco/menus/AlfMenuBarToggle#checkedValue} attribute
       * to be "ascending" to match the value in sort request payloads.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      checkedValue: "ascending",

      /**
       * Overrides the default [subscriptionAttribute]{@link module:alfresco/menus/AlfMenuBarToggle#subscriptionAttribute} 
       * attribute to be "direction" to match the key in sort request payloads.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      subscriptionAttribute: "direction", 

      /**
       * Overrides the default [subscriptionTopic]{@link module:alfresco/menus/AlfMenuBarToggle#subscriptionTopic} 
       * attribute to be the expected sort topic.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      subscriptionTopic: topics.SORT_LIST,

      /**
       * Extends the [inherited function]{@link module:alfresco/menus/AlfMenuBarToggle#postMixInProperties}
       * to set the proper default [onConfig]{@link module:alfresco/menus/AlfMenuBarToggle#onConfig} and
       * [offConfig]{@link module:alfresco/menus/AlfMenuBarToggle#offConfig} values unless externally configured.
       *
       * @instance
       * @since 1.0.102
       */
      postMixInProperties : function alfresco_lists_SortOrderToggle__postMixInProperties() {
         this.inherited(arguments);

         // update default value (if not overridden via configuration) to our defaults
         // must be done in postMixInProperties instead of overriding property due to
         // dependency on subscriptionTopic which may have been configured
         if (this.onConfig === null || this.onConfig.label === "default.on.label")
         {
            this.onConfig = {
               iconClass: "alf-sort-ascending-icon",
               publishTopic: this.subscriptionTopic,
               publishPayload: {
                  direction: "ascending"
               }
            };
         }
         
         if (this.offConfig === null || this.offConfig.label === "default.off.label")
         {
            this.offConfig = {
               iconClass: "alf-sort-descending-icon",
               publishTopic: this.subscriptionTopic,
               publishPayload: {
                  direction: "descending"
               }
            };
         }
      }
   });
});