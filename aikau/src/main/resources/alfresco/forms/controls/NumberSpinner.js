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
 * @module alfresco/forms/controls/NumberSpinner
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "alfresco/forms/controls/utilities/TextBoxValueChangeMixin",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dijit/form/NumberSpinner",
        "alfresco/core/ObjectTypeUtils"], 
        function(BaseFormControl, TextBoxValueChangeMixin, declare, lang, NumberSpinner, ObjectTypeUtils) {
   
   return declare([BaseFormControl, TextBoxValueChangeMixin], {
      
      /**
       * This is the amount the value will be changed when using the "spin" controls
       * 
       * @instance
       * @type {number}
       * @default 1
       */
      delta: 1,

      /**
       * This is the minimum allowed number
       *
       * @instance
       * @type {number}
       * @default 0
       */
      min: null,

      /**
       * This is the maximum allowed number
       *
       * @instance
       * @type {number}
       * @default null
       */
      max: null,

      /**
       * Returns the configuration for the widget ensuring that it is valid, in that
       * [min]{@link module:alfresco/forms/controls/NumberSpinner#min} and 
       * [max]{@link module:alfresco/forms/controls/NumberSpinner#max} but both be numerical values and
       * that [min]{@link module:alfresco/forms/controls/NumberSpinner#min} cannot be greater
       * than [max]{@link module:alfresco/forms/controls/NumberSpinner#max}.
       * 
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_NumberSpinner__getWidgetConfig() {
         if (isNaN(this.min))
         {
            this.min = null;
         }
         if (isNaN(this.max))
         {
            this.max = null;
         }
         if ((this.min || this.min === 0) && (this.max || this.max === 0) && (this.max < this.min))
         {
            this.alfLog("warn", "The minimum allowed value is larger than the maxium allowed value, so constraints will be ignored", this);
            this.max = null;
            this.min = null;
         }
         this.configureValidation();
         return {
            id : this.generateUuid(),
            intermediateChanges: true,
            name: this.name,
            smallDelta: this.delta,
            constraints: {
               min: this.min,
               max: this.max,
               places: 0
            }
         };
      },
      
      /**
       * This validator checks that the value provided is a number
       *
       * @instance
       * @param {object} validationConfig The configuration for this validator
       */
      isNumberValidator: function alfresco_forms_controls_FormControlValidationMixin__isNumberValidator(validationConfig) {
         var isValid = !isNaN(this.wrappedWidget.textbox.value);
         this.reportValidationResult(validationConfig, isValid);
      },

      /**
       * This function is used to set or update the validationConfig as required based on the
       * [min]{@link module:alfresco/forms/controls/NumberSpinner#min} and 
       * [max]{@link module:alfresco/forms/controls/NumberSpinner#max} configuration.
       * 
       * @instance
       */
      configureValidation: function alfresco_forms_controls_NumberSpinner__configureValidation() {
         if (!this.validationConfig || ObjectTypeUtils.isObject(this.validationConfig))
         {
            this.validationConfig = [];
         }
         this.validationConfig.push({
            validation: "isNumberValidator",
            errorMessage: this.message("formValidation.numerical.error")
         });
         if (this.min || this.min === 0 || this.max || this.max === 0)
         {
            var errorMessage;
            if (!this.max && this.max !== 0)
            {
               errorMessage = this.message("formValidation.numericalRange.min.error", { 0: this.min });
            }
            else if (!this.min && this.min !== 0)
            {
               errorMessage = this.message("formValidation.numericalRange.max.error", { 0: this.max });
            }
            else
            {
               errorMessage = this.message("formValidation.numericalRange.error", { 0: this.min, 1: this.max });
            }
            this.validationConfig.push({
               validation: "numericalRange",
               min: this.min,
               max: this.max,
               errorMessage: errorMessage
            });
         }
      },

      /**
       * Creates a new instance of a dijit/form/NumberSpinner as the wrapped form control.
       * 
       * @instance
       */
      createFormControl: function alfresco_forms_controls_NumberSpinner__createFormControl(config, /*jshint unused:false*/ domNode) {
         var ns = new NumberSpinner(config);
         // We'll take care of the validation thanks very much!
         ns.isValid = function() {
            return true;
         };
         ns.onChange = lang.hitch(this, this.validate);
         return ns;
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#setValue} to ensure
       * that only valid values can be set. Values must be numbers and must not be less than the minimum allowed
       * value nor greater than the maximum allowed value.
       *
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function alfresco_forms_controls_NumberSpinner__setValue(value) {
         if (isNaN(value))
         {
            value = 0;
         }
         if ((this.min || this.min === 0) && value < this.min)
         {
            value = this.min;
         }
         if ((this.max || this.max === 0) && value > this.max)
         {
            value = this.max;
         }
         this.inherited(arguments);
      }
   });
});