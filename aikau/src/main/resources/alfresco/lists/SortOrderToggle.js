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
       * Overrides and explicitly sets the [onConfig]{@link module:alfresco/menus/AlfMenuBarToggle#onConfig}
       * for sorting.
       * 
       * @instance
       * @type {object}
       * @default
       */
      onConfig: {
         iconClass: "alf-sort-ascending-icon",
         publishTopic: topics.SORT_LIST,
         publishPayload: {
            direction: "ascending"
         }
      },
      
      /**
       * Overrides and explicitly sets the [offConfig]{@link module:alfresco/menus/AlfMenuBarToggle#offConfig}
       * for sorting.
       * 
       * @instance
       * @type {object}
       * @default
       */
      offConfig: {
         iconClass: "alf-sort-descending-icon",
         publishTopic: topics.SORT_LIST,
         publishPayload: {
            direction: "descending"
         }
      }
   });
});