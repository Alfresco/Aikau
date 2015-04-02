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
 *
 * @module alfresco/lists/AlfFilteredList
 * @extends module:alfresco/core/ProcessWidgets
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/AlfSortablePaginatedList",
        "alfresco/core/ObjectProcessingMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class"], 
        function(declare, AlfSortablePaginatedList, ObjectProcessingMixin, lang, array, domConstruct, domClass) {
   
   return declare([AlfSortablePaginatedList, ObjectProcessingMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfFilteredList.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfFilteredList.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfFilteredList.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfFilteredList.css"}],

      /**
       * @instance
       */
      postCreate: function alfresco_lists_AlfFilteredList__postCreate() {
         domClass.add(this.domNode, "alfresco-lists-AlfFilteredList");
         this.filtersNode = domConstruct.create("div", {}, this.domNode, "first");
         if (this.widgetsForFilters)
         {
            // Process the widget model for the filtered widgets...
            var filtersModel = lang.clone(this.widgetsForFilters);
            this.processObject(["processInstanceTokens"], filtersModel);
            this.processWidgets(filtersModel, this.filtersNode);

            // Setup the filtering topics based on the filter widgets configured...
            array.forEach(this.widgetsForFilters, lang.hitch(this, this.setupFilteringTopics, this.filteringTopics));
         }
         this.inherited(arguments);
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfList#hideChildren} to ensure that the 
       * filter controls aren't hid.
       *
       * @instance
       * @param {object} targetNode The node to hide the children of
       */
      hideChildren: function alfresco_lists_AlfList__hideChildren(/*jshint unused:false*/targetNode) {
         this.inherited(arguments);
         domClass.remove(this.filtersNode, "share-hidden");
      },

      /**
       * Setups up the [filteringTopics]{@link module:alfresco/lists/AlfList#filteringTopics} for the encapsulated
       * [list]{@link module:alfresco/lists/AlfSortablePaginatedList}.
       *
       * @instance
       * @param {type} filteringTopics The array that each topic will be added to
       * @param {object} filter The widget to find a topic from (expected to be a form control)
       */
      setupFilteringTopics: function alfresco_lists_AlfFilteredList__setupFilteringTopics(filteringTopics, filter) {
         if (filter && filter.config && filter.config.fieldId)
         {
            filteringTopics.push("_valueChangeOf_" + filter.config.fieldId);
         }
         else
         {
            this.alfLog("warn", "A configured filter control did not have a fieldId attribute configured", filter, this);
         }
      },

      /**
       * If the [widgetsForFilters]{@link module:alfresco/lists/AlfFilteredList#widgetsForFilters} attribute is not overridden
       * then then this is the value that will be assigned to the [name]{@link module:alfresco/forms/controls/BaseFormControl#name}
       * attribute of the [TextBox]{@link module:alfresco/forms/controls/TextBox} that is rendered as the default filter control.
       *
       * @instance
       * @type {string}
       * @default "name"
       */
      filterName: "name",

      /**
       * If the [widgetsForFilters]{@link module:alfresco/lists/AlfFilteredList#widgetsForFilters} attribute is not overridden
       * then then this is the value that will be assigned to the [name]{@link module:alfresco/forms/controls/BaseFormControl#label}
       * attribute of the [TextBox]{@link module:alfresco/forms/controls/TextBox} that is rendered as the default filter control.
       *
       * @instance
       * @type {string}
       * @default "filtered.list.filter.label"
       */
      filterLabel: "filtered.list.filter.label",

      /**
       * If the [widgetsForFilters]{@link module:alfresco/lists/AlfFilteredList#widgetsForFilters} attribute is not overridden
       * then then this is the value that will be assigned to the [name]{@link module:alfresco/forms/controls/BaseFormControl#description}
       * attribute of the [TextBox]{@link module:alfresco/forms/controls/TextBox} that is rendered as the default filter control.
       *
       * @instance
       * @type {string}
       * @default "filtered.list.filter.description"
       */
      filterDescription: "filtered.list.filter.description",

      /**
       * If the [widgetsForFilters]{@link module:alfresco/lists/AlfFilteredList#widgetsForFilters} attribute is not overridden
       * then then this is the value that will be assigned to the [name]{@link module:alfresco/forms/controls/BaseFormControl#placeHolder}
       * attribute of the [TextBox]{@link module:alfresco/forms/controls/TextBox} that is rendered as the default filter control.
       *
       * @instance
       * @type {string}
       * @default "filtered.list.filter.placeholder"
       */
      filterPlaceholder: "filtered.list.filter.placeholder",

      /**
       * If the [widgetsForFilters]{@link module:alfresco/lists/AlfFilteredList#widgetsForFilters} attribute is not overridden
       * then then this is the value that will be assigned to the [name]{@link module:alfresco/forms/controls/BaseFormControl#unitsLabel}
       * attribute of the [TextBox]{@link module:alfresco/forms/controls/TextBox} that is rendered as the default filter control.
       *
       * @instance
       * @type {string}
       * @default "filtered.list.filter.unitsLabel"
       */
      filterUnitsLabel: "filtered.list.filter.unitsLabel",

      /**
       * This is the default widget model for the filters and defines a single text box that can be
       * used as a filter. This can be overridden with any number of filters that are required.
       *
       * @instance
       * @type {array}
       */
      widgetsForFilters: [
         {
            id: "{id}_TEXTBOX",
            name: "alfresco/forms/controls/TextBox",
            config: {
               fieldId: "FILTER",
               name: "{filterName}",
               placeHolder: "{filterPlaceholder}",
               label: "{filterLabel}",
               description: "{filterDescription}",
               unitsLabel: "{filterUnitsLabel}"
            }
         }
      ]
   });
});