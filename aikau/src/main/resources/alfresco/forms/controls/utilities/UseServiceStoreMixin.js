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
 * This mixin was created as common code was required by both the
 * [ComboBox]{@link module:alfresco/forms/controls/ComboBox} and
 * [FilteringSelect]{@link module:alfresco/forms/controls/FilteringSelect}
 * form controls. It provides functions for creating and working with
 * a [ServiceStore]{@link module:alfresco/forms/controls/utilities/ServiceStore}.
 *
 * @module alfresco/forms/controls/utilities/UseServiceStoreMixin
 * @extends module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/lang",
        "alfresco/forms/controls/utilities/ServiceStore"],
        function(declare, CoreWidgetProcessing, lang, /*jshint unused:false*/ ServiceStore) {

   return declare([CoreWidgetProcessing], {

      /**
       * Creates and returns a new service store.
       *
       * @instance
       */
      createServiceStore: function alfresco_forms_controls_utilities_UseServiceStoreMixin__createServiceStore() {
         var publishTopic = lang.getObject("optionsConfig.publishTopic", false, this);
         var publishPayload = lang.getObject("optionsConfig.publishPayload", false, this);
         var publishGlobal = lang.getObject("optionsConfig.publishGlobal", false, this);
         var queryAttribute = lang.getObject("optionsConfig.queryAttribute", false, this);
         var labelAttribute = lang.getObject("optionsConfig.labelAttribute", false, this);
         var valueAttribute = lang.getObject("optionsConfig.valueAttribute", false, this);
         var fixedOptions = lang.getObject("optionsConfig.fixed", false, this);
         var searchStartsWith = lang.getObject("optionsConfig.searchStartsWith", false, this);
         var serviceStore = this.createWidget({
            name: "alfresco/forms/controls/utilities/ServiceStore",
            config: {
               idProperty: valueAttribute || "value",
               queryAttribute: queryAttribute || "name",
               labelAttribute: labelAttribute || "label",
               valueAttribute: valueAttribute || "value",
               publishTopic: publishTopic,
               publishPayload: publishPayload,
               publishGlobal: (publishGlobal !== false), // true should be the default here
               fixed: fixedOptions,
               searchStartsWith: !!searchStartsWith // Normalises to boolean; also means that default is false as per AKU-534
            }
         });
         return serviceStore;
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#getInitialOptions}
       * to intentionally do nothing as the [ServiceStore]{@link module:alfresco/forms/controls/utilities/ServiceStore}
       * will retrieve the initial options.
       * 
       * @instance
       * @param {object} config The options configuration
       * @since 1.0.96
       */
      getInitialOptions: function alfresco_forms_controls_utilities_UseServiceStoreMixin__getInitialOptions(config) {
         // Do nothing intentionally. Do not call the inherited function.
      },

      /**
       * In vanilla Dojo, when you open either a ComboBox or FilteringSelect you will
       * get all options, not those filtered on the current form control value. This
       * function can be called to override the default _startSearchAll function
       * with one that uses the current value.
       *
       * @instance
       */
      showOptionsBasedOnValue: function alfresco_forms_controls_utilities_UseServiceStoreMixin__showOptionsBasedOnValue(control) {
         control._startSearchAll = lang.hitch(control, this.searchAll);
      },

      /**
       * This function is used to get all the available options based on the value
       * currently entered into the ComboBox. It is used when the user clicks on the
       * down arrow (without entering any text) and overrides the default Dojo ComboBox
       * implementation which searches on the empty string.
       *
       * @instance
       */
      searchAll: function alfresco_forms_controls_utilities_UseServiceStoreMixin__searchAll() {
         this._startSearch(this.getValue());
      }
   });
});