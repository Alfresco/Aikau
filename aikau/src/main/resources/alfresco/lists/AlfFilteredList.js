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
 *
 * @module alfresco/lists/AlfFilteredList
 * @extends module:alfresco/lists/AlfSortablePaginatedList
 * @mixes module:alfresco/core/ObjectProcessingMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/AlfSortablePaginatedList",
        "alfresco/core/ObjectProcessingMixin",
        "alfresco/core/topics",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dijit/registry",
        "alfresco/util/hashUtils"], 
        function(declare, AlfSortablePaginatedList, ObjectProcessingMixin, topics, lang, array, domConstruct, domClass, registry, hashUtils) {
   
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
       * Indicates whether or not all [filter widgets]{@link module:alfresco/lists/AlfFilteredList#widgetsForFilters} will have their 
       * configuration updated to set their [valueSubscriptionTopic]{@link module:alfresco/forms/controls/BaseFormControl#valueSubscriptionTopic}
       * to be a [topic]{@link module:alfresco/core/topics#FILTER_VALUE_CHANGE} dedicated to filter value changes. This is done 
       * in order to allow removal of filters from the [filter summary]{@link module:alfresco/lists/utilities/FilterSummary} to
       * reset the filter form control values.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.54
       */
      addFilterValueSubscription: true,

      /**
       * If the [widgetsForFilters]{@link module:alfresco/lists/AlfFilteredList#widgetsForFilters} attribute is not overridden
       * then then this is the value that will be assigned to the [name]{@link module:alfresco/forms/controls/BaseFormControl#description}
       * attribute of the [TextBox]{@link module:alfresco/forms/controls/TextBox} that is rendered as the default filter control.
       *
       * @instance
       * @type {string}
       * @default
       */
      filterDescription: "filtered.list.filter.description",

      /**
       * If the [widgetsForFilters]{@link module:alfresco/lists/AlfFilteredList#widgetsForFilters} attribute is not overridden
       * then then this is the value that will be assigned to the [name]{@link module:alfresco/forms/controls/BaseFormControl#label}
       * attribute of the [TextBox]{@link module:alfresco/forms/controls/TextBox} that is rendered as the default filter control.
       *
       * @instance
       * @type {string}
       * @default
       */
      filterLabel: "filtered.list.filter.label",

      /**
       * If the [widgetsForFilters]{@link module:alfresco/lists/AlfFilteredList#widgetsForFilters} attribute is not overridden
       * then then this is the value that will be assigned to the [name]{@link module:alfresco/forms/controls/BaseFormControl#name}
       * attribute of the [TextBox]{@link module:alfresco/forms/controls/TextBox} that is rendered as the default filter control.
       *
       * @instance
       * @type {string}
       * @default
       */
      filterName: "name",

      /**
       * If the [widgetsForFilters]{@link module:alfresco/lists/AlfFilteredList#widgetsForFilters} attribute is not overridden
       * then then this is the value that will be assigned to the [name]{@link module:alfresco/forms/controls/BaseFormControl#placeHolder}
       * attribute of the [TextBox]{@link module:alfresco/forms/controls/TextBox} that is rendered as the default filter control.
       *
       * @instance
       * @type {string}
       * @default
       */
      filterPlaceholder: "filtered.list.filter.placeholder",

      /**
       * If the [widgetsForFilters]{@link module:alfresco/lists/AlfFilteredList#widgetsForFilters} attribute is not overridden
       * then then this is the value that will be assigned to the [name]{@link module:alfresco/forms/controls/BaseFormControl#unitsLabel}
       * attribute of the [TextBox]{@link module:alfresco/forms/controls/TextBox} that is rendered as the default filter control.
       *
       * @instance
       * @type {string}
       * @default
       */
      filterUnitsLabel: "filtered.list.filter.unitsLabel",

      /**
       * This is the string that is used to map the call to [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * to create the defined filters to the resulting callback in [allWidgetsProcessed]{@link module:alfresco/lists/AlfFilteredList#allWidgetsProcessed}
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.35
       */
      filterWidgetsMappingId: "FILTERS",

      /**
       * If this is configured to be true then a [filter summary widget]{@link module:alfresco/lists/utilities/FilterSummary}
       * will be added above the list.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.54
       */
      showFilterSummary: false,

      /**
       * This is the string that is used to map the call to [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * to create the [filter summary widget]{@link module:alfresco/lists/utilities/FilterSummary} to the resulting callback 
       * in [allWidgetsProcessed]{@link module:alfresco/lists/AlfFilteredList#allWidgetsProcessed}
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.54
       */
      summaryWidgetsMappingId: "FILTER_SUMMARY",

      /**
       * The filter widgets
       *
       * @instance
       * @type {Object[]}
       */
      _filterWidgets: null,

      /**
       * Called after properties mixed into instance
       *
       * @instance
       */
      postMixInProperties: function alfresco_lists_AlfFilteredList__postMixInProperties() {
         this.inherited(arguments);
         if (this.useHash) {
            this.mapHashVarsToPayload = true;
         }
      },

      /**
       * @instance
       */
      postCreate: function alfresco_lists_AlfFilteredList__postCreate() {
         domClass.add(this.domNode, "alfresco-lists-AlfFilteredList");
         this.filtersNode = domConstruct.create("div", {
            className: "alfresco-lists-AlfFilteredList__filters"
         }, this.domNode, "first");

         // We need a promise here to address the scenario where XHR requests are made for filtering widgets
         // that have not had there dependencies correctly analysed by Surf. This is the case for the ComboBox
         // when used in a non-standard locale as language specific validation.js and common.js files are requested.
         // Using a promise ensures that filters are only used when they're actually available. See AKU-559 for details
         if (this.widgetsForFilters)
         {
            var filtersModel = lang.clone(this.widgetsForFilters);

            // Update the filter form control configuration to set (or override) the valueSubScriptionTopic in order
            // that filter changes can be applied to the form control (this will typically occur when a filter is
            // removed via the FilterSummary widget).
            if (this.addFilterValueSubscription)
            {
               array.forEach(filtersModel, function(widget) {
                  lang.setObject("config.valueSubscriptionTopic", topics.FILTER_VALUE_CHANGE, widget);
               }, this);
            }

            this.processObject(["processInstanceTokens"], filtersModel);
            this.processWidgets(filtersModel, this.filtersNode, this.filterWidgetsMappingId);
         }
         else
         {
            this._filterWidgets = {};
         }

         if (this.showFilterSummary)
         {
            this.summaryNode = domConstruct.create("div", {
               className: "alfresco-lists-AlfFilteredList__summary"
            }, this.filtersNode, "after");

            var summaryModel = lang.clone(this.widgetsForFilterSummary);
            this.processObject(["processInstanceTokens"], summaryModel);
            this.processWidgets(summaryModel, this.summaryNode, this.summaryWidgetsMappingId);
            
         }

         this.inherited(arguments);
         this.alfSubscribe(topics.FILTER_REMOVED, lang.hitch(this, this.onFilterRemoved));
      },

      /**
       * This function can be extended in order to perform additional actions when filters are removed.
       * 
       * @instance
       * @param  {object} payload The filter item that was removed.
       * @since 1.0.54
       * @extendable
       */
      onFilterRemoved: function alfresco_lists_AlfFilteredList__onFilterRemoved(/*jshint unused:false*/ payload) {
         // No action by default - this is just an extension point function.
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfList#allWidgetsProcessed}
       * to handle differentiate between filter widget and view widget post creation processing.
       *
       * @instance
       * @param {object[]} widgets The widgets that have been created
       * @param {string} processWidgetsId An optional ID that might have been provided to map the results of multiple calls to [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * @since 1.0.34
       */
      allWidgetsProcessed: function alfresco_lists_AlfFilteredList__allWidgetsProcessed(widgets, processWidgetsId) {
         if (processWidgetsId === "NEW_VIEW_INSTANCE")
         {
            this.handleNewViewInstances(widgets);
         }
         else if (processWidgetsId === this.filterWidgetsMappingId)
         {
            this._storeFilterWidgets(widgets);
            this._updateFilterFieldsFromHash();

            // Setup the filtering topics based on the filter widgets configured...
            array.forEach(this.widgetsForFilters, this.setupFilteringTopics, this);

            // Create the subscriptions for the filters once created...
            this.createFilterSubscriptions();
         }
         else if (processWidgetsId === this.summaryWidgetsMappingId)
         {
            // No action required for filter summary creation
         }
         else
         {
            // Only perform the inherited function (e.g. to processViews) when not processing filters
            this.registerViews(widgets);
            this.completeListSetup();
         }
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfList#hideChildren} to ensure that the 
       * filter controls aren't hid.
       *
       * @instance
       * @param {object} targetNode The node to hide the children of
       */
      hideChildren: function alfresco_lists_AlfFilteredList__hideChildren(/*jshint unused:false*/targetNode) {
         this.inherited(arguments);
         if (this.filtersNode)
         {
            domClass.remove(this.filtersNode, "share-hidden");
         }
         if (this.summaryNode)
         {
            domClass.remove(this.summaryNode, "share-hidden");
         }
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfHashList#onFiltersUpdated} to publish 
       * information about the new filters that are applied to the list.
       * 
       * @instance
       * @since 1.0.54
       */
      onFiltersUpdated: function alfresco_lists_AlfHashList__onFiltersUpdated() {
         this.inherited(arguments);
         this.alfPublish(topics.FILTERS_APPLIED, this.dataFilters);
      },


      /**
       * We need to make sure any filters in the hash are populated into the dataFilters property
       * 
       * @instance
       * @override
       * @param {object} payload The publication topic
       */
      onHashChange: function alfresco_lists_AlfFilteredList__onHashChange( /*jshint unused:false*/ payload) {
         // Only do this when we are mirroring the filters in the hash
         if (this.mapHashVarsToPayload) {

            // Initialise the data-filters to be all of the filters we have specified, without values
            this.dataFilters = array.map(Object.keys(this._filterWidgets), function(filterName) {
               return {
                  name: filterName
               };
            });

            // Filter to only include items currently in the hash and update values
            var currHash = hashUtils.getHash();
            this.dataFilters = array.filter(this.dataFilters, function(dataFilter) {
               dataFilter.value = currHash[dataFilter.name];
               return !!dataFilter.value;
            });

            // Update the filter fields
            this._updateFilterFieldsFromHash();
         }

         // Call inherited
         this.inherited(arguments);
      },

      /**
       * Build a collection of filter widgets as a property on this instance
       *
       * @instance
       */
      _storeFilterWidgets: function alfresco_lists_AlfFilteredList___storeFilterWidgets(widgets) {
         this._filterWidgets = {};
         array.forEach(this.widgetsForFilters, function(filterDef) {
            var filterName = filterDef.config.name;
            this._filterWidgets[filterName] = array.filter(widgets, function(childWidget) {
               return childWidget.name === filterName;
            })[0];
         }, this);
      },

      /**
       * Update the filter form fields using the filter values in the hash, and update the
       * [dataFilters property]{@link module:alfresco/lists/AlfList#dataFilters} at the same time.
       *
       * @instance
       */
      _updateFilterFieldsFromHash: function alfresco_lists_AlfFilteredList___updateFilterFieldsFromHash() {
         // Get the hash
         var currHash = hashUtils.getHash();

         // Run through all of the filter widgets
         array.forEach(Object.keys(this._filterWidgets), function(widgetName) {

            // Get the widget and the filter value, normalising non-values to null
            var widget = this._filterWidgets[widgetName],
               filterValue = currHash[widgetName];
            if (typeof filterValue === "undefined") {
               filterValue = null;
            }

            // Update the dataFilters
            if (filterValue === null) {
               this.dataFilters = array.filter(this.dataFilters, function(filter) {
                  return filter.name !== widgetName;
               });
            } else {
               var filterFound = array.some(this.dataFilters, function(filter) {
                  if (filter.name === widgetName) {
                     filter.value = filterValue;
                     return true;
                  }
               });
               if (!filterFound) {
                  this.dataFilters.push({
                     name: widgetName,
                     value: filterValue
                  });
               }
            }

            // Set the widget value
            widget && widget.setValue && widget.setValue(filterValue);
         }, this);

         this.alfPublish(topics.FILTERS_APPLIED, this.dataFilters || []);
      },

      /**
       * Setups up the [filteringTopics]{@link module:alfresco/lists/AlfList#filteringTopics} for the encapsulated
       * [list]{@link module:alfresco/lists/AlfSortablePaginatedList}.
       *
       * @instance
       * @param {object} filter The widget to find a topic from (expected to be a form control)
       */
      setupFilteringTopics: function alfresco_lists_AlfFilteredList__setupFilteringTopics(filter) {
         if (filter && filter.config && filter.config.fieldId)
         {
            this.filteringTopics.push("_valueChangeOf_" + filter.config.fieldId);
            if (this.mapHashVarsToPayload) 
            {
               this.hashVarsForUpdate.push(filter.config.name);
            }
         }
         else
         {
            this.alfLog("warn", "A configured filter control did not have a fieldId attribute configured", filter, this);
         }
      },

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
      ],

      /**
       * The default model for rendering a [filter summary]{@link module:alfresco/lists/utilities/FilterSummary}. This
       * will only be used if [showFilterSummary]{@link module:alfresco/lists/AlfFilteredList#showFilterSummary} is 
       * configured to be true.
       * 
       * @instance
       * @type {object[]}
       * @since 1.0.54
       */
      widgetsForFilterSummary: [
         {
            id: "{id}_FILTER_SUMMARY",
            name: "alfresco/lists/utilities/FilterSummary"
         }
      ]
   });
});