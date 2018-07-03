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
 * A specialization of the [AlfMenuBarSelect]{@link module:alfresco/menus/AlfMenuBarSelect} that should
 * be used for selecting the field on which an
 * [AlfSortablePaginatedList]{@link module:alfresco/lists/AlfSortablePaginatedList} should be sorted.
 *
 * @example <caption>Example showing the configuration of a couple of sort options</caption>
 * {
 *   name: "alfresco/lists/SortFieldSelect",
 *   config: {
 *     sortFieldOptions: [
 *       { 
 *         label: "Display Name", 
 *         value: "fullName" 
 *       },
 *       {
 *         label: "User Name", 
 *         value: "userName"
 *       }
 *     ]
 *   }
 * }
 *
 * @module alfresco/lists/SortFieldSelect
 * @extends module:alfresco/menus/AlfMenuBarSelect
 * @author Dave Draper
 * @since 1.0.75
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBarSelect",
        "alfresco/core/topics",
        "dojo/_base/array",
        "dojo/_base/lang",
        "alfresco/menus/AlfCheckableMenuItem"], 
        function(declare, AlfMenuBarToggle, topics, array, lang) {

   return declare([AlfMenuBarToggle], {
      
      /**
       * @instance
       * @typedef {object} SortFieldOption
       * @property {id} [propName=null] An to give the menu item for the option
       * @property {string} label The label to render for the option
       * @property {string} value The value of the option
       * @property {boolean} [selected=false] Indicates whether or not the option should be initially selected
       * @property {string} [direction=null] The direction to sort in when the option is used (either "ascending" or "descending").
       */

      /**
       * An array of the sort options to be rendered.
       * 
       * @instance
       * @type {SortFieldOption[]}
       * @default
       */
      sortFieldOptions: null,

      /**
       * Overrides the default [selectionTopic]{@link module:alfresco/menus/AlfMenuBarSelect#selectionTopic} 
       * attribute to be the expected sort topic.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      selectionTopic: topics.UPDATE_LIST_SORT_FIELD,
      
      /**
       * 
       * @instance
       */
      getSortFieldOptions: function alfresco_lists_SortFieldSelect__getSortFieldOptions() {
         var sortFieldOptions = [];

         array.forEach(this.sortFieldOptions, lang.hitch(this, function(option) {
            if (option.label && option.value)
            {
               var label = this.message(option.label);
               sortFieldOptions.push({
                  id: option.id || null,
                  name: "alfresco/menus/AlfCheckableMenuItem",
                  config: {
                     label: label,
                     value: option.value,
                     group: "ALF_SORT_FIELD_SELECTION_GROUP",
                     publishTopic: this.selectionTopic,
                     checked: option.selected || false,
                     publishPayload: {
                        label: label,
                        direction: option.direction || null
                     }
                  }
               });

               if (option.selected)
               {
                  this.label = option.label;
               }
            }
         }));

         return sortFieldOptions;
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/menus/AlfMenuBarSelect#postCreate}
       * to call [getSortFieldOptions]{@link module:alfresco/lists/SortFieldSelect#getSortFieldOptions}
       * to generate the [AlfCheckableMenuItems]{@link module:alfresco/menus/AlfCheckableMenuItem}
       * to populate the menu with.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_lists_SortFieldSelect__postMixInProperties() {
         this.widgets = [
            {
               name: "alfresco/menus/AlfMenuGroup",
               config: {
                  widgets: this.getSortFieldOptions()
               }
            }
         ];
         this.inherited(arguments);
      }
   });
});