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
 * @module alfresco/lists/utilities/FilterSummary
 * 
 * @author Dave Draper
 * @since 1.0.54
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "alfresco/core/Core",
        "alfresco/forms/controls/utilities/ChoiceMixin",
        "dojo/text!./templates/FilterSummary.html",
        "alfresco/core/topics",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-construct"], 
        function(declare, _WidgetBase, _TemplatedMixin, AlfCore, ChoiceMixin, template, topics, array, lang, domConstruct) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, ChoiceMixin], {

      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#getItemValue}
       * to return the filter value.
       *
       * @instance
       * @return {object} The [search box]{@link module:alfresco/forms/controls/MultiSelect#searchBox} element.
       */
      // getItemValue: function alfresco_forms_controls_utilities_ChoiceMixin__getItemValue(item) {
      //    return item.name + "=" + item.value;
      // },

      /**
       * 
       * @instance
       * @listens module:alfresco/core/topics#FILTERS_APPLIED
       */
      postCreate: function alfresco_lists_utilities_FilterSummary__postCreate() {
         this.inherited(arguments);
         this.alfSubscribe(topics.FILTERS_APPLIED, lang.hitch(this, this.onFiltersApplied));
      },

      /**
       * 
       * @instance
       * @param  {object} payload A payload containing the applied filters.
       */
      onFiltersApplied: function alfresco_lists_utilities_FilterSummary__onFiltersApplied(payload) {
         this.alfLog("info", "Filters applied", payload);

         this._choices = [];
         this._storeItems = {};

         domConstruct.empty(this.domNode);

         array.forEach(payload, function(filter) {
            this._addChoice(filter);
         }, this);

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
            choice: item.name + ": " + item.value,
            full: item.name + ": " + item.value
         };
      },

      /**
       * This extends the [inherited function]{@link module:alfresco/forms/controls/utilities/ChoiceMixin#_removeChoice}
       * to publish updated filter data.
       *
       * @instance
       * @param  {object} choiceToRemove The choice removed.
       */
      _removeChoice: function alfresco_forms_controls_MultiSelect___removeChoice(choiceToRemove) {
         this.inherited(arguments);

         this.alfLog("info", "Remove choice", choiceToRemove);
         this.alfPublish(topics.FILTER_REMOVED, choiceToRemove.item);

         this.alfPublish("FILTER_VALUE_CHANGED", {
            value: "",
            name: choiceToRemove.item.name
         });
      }
   });
});