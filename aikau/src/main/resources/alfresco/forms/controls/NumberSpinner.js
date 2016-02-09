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
 * <p>This control is for the entry of numbers, while additionally allowing
 * "spinning" to adjust the number value (by scrolling or spinner-buttons).</p>
 *
 * @example <caption>Minimum configuration</caption>
 * {
 *    name: "alfresco/forms/controls/NumberSpinner", 
 *    config: {
 *       name: "one"
 *    }
 * }
 *
 * @example <caption>Full configuration</caption>
 * {
 *    name: "alfresco/forms/controls/NumberSpinner", 
 *    config: {
 *       name: "two",
 *       value: 3,
 *       min: 5,
 *       max: 10,
 *       requirementConfig: {
 *          initialValue: true
 *       },
 *       permitEmpty: true,
 *       permittedDecimalPlaces: 1
 *    }
 * },
 * 
 * @module alfresco/forms/controls/NumberSpinner
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "alfresco/forms/controls/utilities/TextBoxValueChangeMixin",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dijit/form/NumberSpinner",
        "dojo/number",
        "alfresco/core/ObjectTypeUtils"], 
        function(BaseFormControl, TextBoxValueChangeMixin, declare, lang, domClass, NumberSpinner, number, ObjectTypeUtils) {
   
    /**
    * This extension of NumberSpinner is to "fix" certain inconsistencies
    * when working with non-integer numbers and different locales.
    *
    * @instance
    * @since 1.0.54
    */
   var DijitNumberSpinner = declare([NumberSpinner], {

      /**
       * Override the standard format method to avoid rounding decimals.
       *
       * @instance
       * @override
       * @param {number} value The number to format
       * @param {object} [constraints] The constraints
       * @returns {string} The formatted number
       */
      format: function alfresco_forms_controls_NumberSpinner__DijitNumberSpinner__format(value, constraints) {
         constraints = lang.mixin({}, constraints, {
            places: undefined
         });
         return this.inherited(arguments);
      },

      /**
       * Override the standard value-getter to always return a number if one is provided.
       *
       * @instance
       * @override
       * @returns {number} The value, as a number, or null if NaN
       */
      _getValueAttr: function alfresco_forms_controls_NumberSpinner__DijitNumberSpinner___getValueAttr() {
         var rawValue = this.textbox.value,
             numberValue = number.parse(rawValue),
             value = null;
         if (!isNaN(numberValue)) {
            value = numberValue;
            if (value === Math.round(value)) {
               value = Math.round(value);
            }
         }
         return value;
      },

      /**
       * Override the standard value-setter to correctly locale-format the content
       *
       * @instance
       * @override
       * @param {number} newValue The new value to set
       */
      _setValueAttr: function alfresco_forms_controls_NumberSpinner__DijitNumberSpinner___setValueAttr(newValue) {
         if (newValue !== null && !isNaN(newValue)) 
         {
            if (typeof newValue === "string") 
            {
               newValue = parseFloat(newValue);
            }
            this.textbox.value = number.format(newValue);
         }
      }
   });
   
   return declare([BaseFormControl, TextBoxValueChangeMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/NumberSpinner.css"}]
       */
      cssRequirements: [{cssFile:"./css/NumberSpinner.css"}],
      
      /**
       * This is the amount the value will be changed when using the "spin" controls
       * 
       * @instance
       * @type {number}
       * @default
       */
      delta: 1,

      /**
       * This is the minimum allowed number
       *
       * @instance
       * @type {number}
       * @default
       */
      min: null,

      /**
       * This is the maximum allowed number
       *
       * @instance
       * @type {number}
       * @default
       */
      max: null,

      /**
       * By default, this control can only be valid when it contains a numerical value. If this configuration
       * property is set to true, then it will be possible to submit a form without any value in this control,
       * at which point its value will be submitted as null.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      permitEmpty: false,

      /**
       * How many decimal places are permitted in a valid value for this control
       *
       * @type {number}
       * @default
       */
      permittedDecimalPlaces: 0,

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
               places: this.permittedDecimalPlaces
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
         var isValid = false;
         try 
         {
            var textBoxValue = this.wrappedWidget.textbox.value;
            var parsed = number.parse(textBoxValue);
            isValid = !isNaN(parsed) || (this.permitEmpty && textBoxValue === "");
         }
         catch (e) 
         {
            this.alfLog("warn", "Error validating number: ", e);
         }
         this.reportValidationResult(validationConfig, isValid);
      },

      /**
       * This validator checks that the value has no more than the specified number of decimal places (or isn't a number!)
       *
       * @instance
       * @param {object} validationConfig The configuration for this validator
       */
      decimalPlacesValidator: function alfresco_forms_controls_FormControlValidationMixin__decimalPlacesValidator(validationConfig) {
         var isValid = true;
         try 
         {
            // Get the raw value of the number box (for locales that use the "," for a decimal place, then the value will include
            // the ",")...
            var textBoxValue = this.wrappedWidget.textbox.value;

            // Parse the number (this will convert the "," to ".")...
            var parsed = number.parse(textBoxValue);
            if (isNaN(parsed))
            {
               // Can't do anything with a value that isn't a number - it should have been picked up by the "isNumberValidator" anyway
            }
            else
            {
               // Convert to a string... regardless of locale, the decimal place will be "." - we can use this to reliably work out
               // the number of decimal places specified...
               var string = parsed.toString();
               var decimalIndex = string.lastIndexOf(".");
               if (decimalIndex === -1)
               {
                  // There is no decimal place, nothing to validate...
               }
               else
               {
                  // Workout the decimal places...
                  var decimalPlaces = string.length - decimalIndex - 1; // Deduct additional one for index/length conversion
                  isValid = decimalPlaces <= this.permittedDecimalPlaces;
               }
            }
         } 
         catch (e) 
         {
            this.alfLog("warn", "Error validating number of decimal places: ", e);
         }
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
         /*jshint maxcomplexity:false*/

         // Initialise validationConfig
         if (!this.validationConfig || ObjectTypeUtils.isObject(this.validationConfig))
         {
            this.validationConfig = [];
         }

         // Configure isNumber validation
         this.validationConfig.push({
            validation: "isNumberValidator",
            errorMessage: this.message("formValidation.numerical.error")
         });

         // Setup decimal places validation
         var decimalPlacesError = "formValidation.numerical.decimalPlaces0.error";
         if(this.permittedDecimalPlaces === 1) {
            decimalPlacesError = "formValidation.numerical.decimalPlaces1.error";
         } else if(this.permittedDecimalPlaces > 1) {
            decimalPlacesError = "formValidation.numerical.decimalPlacesN.error";
         }
         this.validationConfig.push({
            validation: "decimalPlacesValidator",
            errorMessage: this.message(decimalPlacesError, {
               0: this.permittedDecimalPlaces
            })
         });
         
         // Handle min/max validation
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
               permitEmpty: this.permitEmpty,
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
         var additionalCssClasses = "";
         if (this.additionalCssClasses !== null)
         {
            additionalCssClasses = this.additionalCssClasses;
         }
         domClass.add(this.domNode, "alfresco-forms-controls-NumberSpinner " + additionalCssClasses);
         
         var ns = new DijitNumberSpinner(config);
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
      },

      /**
       * Remove commas and spaces from a string value, ready for number parsing<br />
       * <br />
       * NOTE: See AKU-341 for details of why we handle commas and spaces
       *
       * @instance
       * @param {string} value The value to parse
       * @returns {string} The cleaned value
       * @deprecated Since 1.0.54 - No longer required - extending modules should prepare for the removal of this function
       */
      _removeCommasAndSpaces: function alfresco_forms_controls_NumberSpinner___removeCommasAndSpaces(value) {
         return value && value.replace(/,|\s/g, "");
      },

      /**
       * Determine whether the supplied value string is a number.
       *
       * @instance
       * @param {string} value The value to check (should already be trimmed)
       * @returns {boolean} true if the value is a number
       * @deprecated Since 1.0.54 - No longer required - extending modules should prepare for the removal of this function
       */
      _valueIsNumber: function alfresco_forms_controls_NumberSpinner___valueIsNumber(value) {
         var isValidNumber = /^-?\d+(\.\d+)?$/.test(value);
         var parsedValue = parseFloat(value);
         return isValidNumber && !isNaN(parsedValue);
      }
   });
});