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
 * This widget can be used to provide a summary of filters applied to a [filtered list]{@link module:alfresco/lists/AlfFilteredList}.
 * Although this widget can be used independently it is typically rendered by configuring the
 * [showFilterSummary]{@link module:alfresco/lists/AlfFilteredList#showFilterSummary} attribute on a 
 * [filtered list]{@link module:alfresco/lists/AlfFilteredList}.
 * 
 * @module alfresco/lists/utilities/FilterSummary
 * @extends external:dijit/_WidgetBase
 * @mixes external:dijit/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/forms/controls/utilities/ChoiceMixin
 * 
 * @author Dave Draper
 * @since 1.0.54
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/forms/controls/utilities/ChoiceMixin",
        "dojo/text!./templates/FilterSummary.html",
        "alfresco/core/topics",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/when"], 
        function(declare, _WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, ChoiceMixin, template, topics, 
                 array, lang, domConstruct, when) {

   return declare([_WidgetBase, _TemplatedMixin, CoreWidgetProcessing, AlfCore, ChoiceMixin], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/FilterSummary.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/FilterSummary.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/FilterSummary.css"}]
       */
      cssRequirements: [{cssFile:"./css/FilterSummary.css"}],

      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * A label to prefix the summary with.
       *
       * @instance
       * @type {string}
       * @default
       */
      label: "filter-summary.label",

      /**
       * Processes the [label]{@link module:alfresco/lists/utilities/Label} to ensure that it is localized.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_lists_utilities_FilterSummary__postMixInProperties() {
         this.inherited(arguments);
         this.label = this.message(this.label);
      },

      /**
       * Sets up the subcription for handling filter changes.
       * 
       * @instance
       * @listens module:alfresco/core/topics#FILTERS_APPLIED
       * @listens module:alfresco/core/topics#FILTERS_CLEARED
       */
      postCreate: function alfresco_lists_utilities_FilterSummary__postCreate() {
         this.inherited(arguments);
         this.alfSubscribe(topics.FILTERS_APPLIED, lang.hitch(this, this.onFiltersApplied));
         this.alfSubscribe(topics.FILTERS_CLEARED, lang.hitch(this, this.onClearAllFilters));
      },

      /**
       * If one or more filter has been applied then the
       * [widgetsForActions]{@link module:alfresco/lists/utilities/FilterSummary#widgetsForActions} will
       * be created to provide a "Clear All" action.
       * 
       * @instance
       * @param {object[]} filters An array of the filters that have been applied.
       */
      addActions: function alfresco_lists_utilities_FilterSummary__addActions(filters) {
         if (filters && filters.length)
         {
            var actionsModel = lang.clone(this.widgetsForActions);
            this.processObject(["processInstanceTokens"], actionsModel);
            this.processWidgets(actionsModel, this.choicesNode);
         }
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#getNewChoiceTargetNode}
       * to return the appropriate node to add choices to.
       * 
       * @instance
       * @return {object} The DOM element to add choices relative to
       * @overridable
       */
      getNewChoiceTargetNode: function alfresco_lists_utilities_FilterSummary__getNewChoiceTargetNode() {
         return this.choicesNode;
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#getNewChoiceTargetNode}
       * to return the appropriate node to set the root class on.
       * 
       * @instance
       * @return {object} The target DOM element
       * @overridable
       */
      getRootClassTargetNode: function alfresco_lists_utilities_FilterSummary__getRootClassTargetNode() {
         return this.choicesNode;
      },

      /**
       * Called on requests to clear all the filters.
       * 
       * @instance
       * @param  {object} payload
       */
      onClearAllFilters: function alfresco_lists_utilities_FilterSummary__onClearAllFilters(/*jshint unused:false*/ payload) {
         array.forEach(this._choices, lang.hitch(this, this._removeChoice));
         this.reset();
      },

      /**
       * Called when the current filter data changes.
       * 
       * @instance
       * @param  {object} payload A payload containing the applied filters.
       */
      onFiltersApplied: function alfresco_lists_utilities_FilterSummary__onFiltersApplied(payload) {
         // Clear the previous filters before adding the current ones...
         this.reset();

         // Add each applied filter...
         array.forEach(payload, function(filter) {
            this._addChoice(filter);
         }, this);

         // Add any actions, by default this will add a "Clear All" action if one or more filter has been provided.
         this.addActions(payload);
      },

      /**
       * Resets the widget to its original state. Each choice is 
       * [individually removed]{@link module:alfresco/lists/utilities/FilterSummary#_removeChoice} before all the
       * [actions widgets]{@link module:alfresco/lists/utilities/FilterSummary#widgetsForActions} are destroyed.
       * 
       * @instance
       */
      reset: function alfresco_lists_utilities_FilterSummary__reset() {
         this._choices = [];
         this._storeItems = {};

         // Destroy any action widgets...
         when(this.getProcessedWidgets(), lang.hitch(this, function(widgets) {
            array.forEach(widgets, function(widget) {
               widget.destroy();
            });
         }));

         // Empty the choices...
         domConstruct.empty(this.choicesNode);
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#_getLabel} to
       * retrieve the name from the filter to return as the label.
       *
       * @instance
       * @param    {item} item The filter whose "name" attribute should be returned as the label
       * @returns {object} An object representing the filter name.
       */
      _getLabel: function alfresco_forms_controls_MultiSelect___getLabel(item) {
         return {
            choice: item.value,
            full: item.value
         };
      },

      /**
       * This extends the [inherited function]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#_removeChoice}
       * to publish information about the filter removal.
       *
       * @instance
       * @param  {object} choiceToRemove The choice removed.
       * @fires module:alfresco/core/topics#FILTER_REMOVED
       * @fires module:alfresco/core/topics#FILTER_VALUE_CHANGE
       */
      _removeChoice: function alfresco_forms_controls_MultiSelect___removeChoice(choiceToRemove) {
         this.inherited(arguments);

         // Publish information indicating that the filter has been removed and that the value of the filter has changed...
         this.alfPublish(topics.FILTER_REMOVED, choiceToRemove.item);
         this.alfPublish(topics.FILTER_VALUE_CHANGE, {
            value: "",
            name: choiceToRemove.item.name
         });
      },

      /**
       * A widget model of widgets for performing actions. By default a single [link]{@link module:alfresco/renderers/Link}
       * is defined for clearing all choices.
       * 
       * @instance
       * @type {object[]}
       */
      widgetsForActions: [
         {
            id: "{id}_CLEAR_ALL",
            name: "alfresco/renderers/Link",
            config: {
               linkLabel: "filter-summary.clear-all.action",
               publishTopic: topics.FILTERS_CLEARED
            }
         }
      ]
   });
});