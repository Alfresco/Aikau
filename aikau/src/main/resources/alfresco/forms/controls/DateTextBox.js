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
 * Creates a date-field input box. Can be preset to today's date by passing a value of "TODAY".
 *
 * @example <caption>Sample usage:</caption>
 * {
 *    name: "alfresco/forms/controls/DateTextBox",
 *    id: "VALID_DATE_VALUE_1",
 *    config: {
 *       name: "validDate1",
 *       value: "2012-12-12",
 *       label: "Valid date #1"
 *    }
 * }
 * 
 * @module alfresco/forms/controls/DateTextBox
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @mixes module:alfresco/forms/controls/utilities/TextBoxValueChangeMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/BaseFormControl",
        "alfresco/forms/controls/utilities/TextBoxValueChangeMixin",
        "dojo/_base/lang",
        "dojo/date/stamp",
        "dijit/form/DateTextBox",
        "dojo/dom-class",
        "alfresco/core/ObjectTypeUtils"],
        function(declare, BaseFormControl, TextBoxValueChangeMixin, lang, stamp, DateTextBox, domClass, ObjectTypeUtils) {
   return declare([BaseFormControl, TextBoxValueChangeMixin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/DateTextBox.css"}]
       */
      cssRequirements: [{cssFile:"./css/DateTextBox.css"}],

      /**
       * Run after properties mixed into instance
       *
       * @instance
       */
      postMixInProperties: function(){
         if (this.value === "TODAY") { // Special case
            this.value = (new Date()).toISOString();
         } else if (!this.value || (typeof this.value === "string" && lang.trim(this.value).length === 0)) {
            this.value = null; // Falsy values and empty strings should be treated as nulls, i.e. no value (see AKU-430)
         }
         this.inherited(arguments); // Must 'clean' the empty strings before calling this
      },

      /**
       * Get the configuration for the wrapped widget
       * 
       * @instance
       * @returns {object} The configuration for the form control
       */
      getWidgetConfig: function alfresco_forms_controls_DateTextBox__getWidgetConfig() {
         this.configureValidation();
         var placeHolder = this.message(this.placeHolder || "");
         return {
            id: this.id + "_CONTROL",
            name: this.name,
            placeHolder: placeHolder,
            options: (this.options !== null) ? this.options : []
         };
      },

      /**
       * This function is used to set or update the validationConfig
       * 
       * @instance
       */
      configureValidation: function alfresco_forms_controls_DateTextBox__configureValidation() {
         if (!this.validationConfig || ObjectTypeUtils.isObject(this.validationConfig)) {
            this.validationConfig = [];
         }
         this.validationConfig.push({
            validation: "customValidator",
            errorMessage: this.message("formValidation.date.error")
         });
      },

      /**
       * Ensure value is a date
       *
       * @instance
       * @param {object} validationConfig The configuration for this validator
       */
      customValidator: function alfresco_forms_controls_DateTextBox__customValidator(validationConfig){
         var currentValue = this.getValue(),
            isValid = typeof currentValue === "string";
         if(!isValid && !this._required) {
            isValid = this.wrappedWidget.get("displayedValue") === "";
         }
         this.reportValidationResult(validationConfig, isValid);
      },

      /**
       * Get the value currently assigned to the wrapped widget
       * 
       * @instance
       * @returns {object} The current value of the field
       */
      getValue: function alfresco_forms_controls_DateTextBox__getValue() {
         var value = this.inherited(arguments);
         return value && stamp.toISOString(value, { selector: "date" });
      },

      /**
       * Create and return form control instance
       *
       * @instance
       * @param {object} config The configuration to use when instantiating the form control
       */
      createFormControl: function alfresco_forms_controls_DateTextBox__createFormControl(config) {
         domClass.add(this.domNode, "alfresco-forms-controls-DateTextBox");
         var dateTextBox = new DateTextBox(config);
         dateTextBox.validate = lang.hitch(this, function(){
            setTimeout(lang.hitch(this, this.validate), 0);
            return true;
         });
         return dateTextBox;
      }
   });
});