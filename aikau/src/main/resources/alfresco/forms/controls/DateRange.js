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
 * Extends the [DateTextBox]{@link module:alfresco/forms/controls/DateTextBox} widget to
 * add an additional date picker to allow the user to select a date range.
 * 
 * @module alfresco/forms/controls/DateRange
 * @extends module:alfresco/forms/controls/DateTextBox
 * @author Dave Draper
 * @since 1.0.91
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/DateTextBox",
        "dijit/form/DateTextBox",
        "dojo/aspect",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/dom-construct"],
        function(declare, DateTextBox, DojoDateTextBox, aspect, lang, domClass, domConstruct) {

   return declare([DateTextBox], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/DateRange.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/DateRange.css"}],

      /**
       * The prefix to all CSS classes used for BEM implementation to avoid
       * duplicate declaration of strings.
       * 
       * @instance
       * @type {string}
       * @default
       */
      baseCssClass: "alfresco-forms-controls-DateRange",

      /**
       * This is the string used to separate the to and from values. 
       *
       * @instance
       * @type {string}
       * @default
       */
      dateSeparator: "|",

      /**
       * The error message to display when the user selects a "from" date after the 
       * the "to" date.
       *
       * @instance
       * @type {string}
       * @default
       */
      toBeforeFromErrorMessage: "daterange.toBeforeFrom.error",

      /**
       * This is a validation callback function that is always applied to ensure that the
       * "from" date is before the "to" date.
       * 
       * @instance
       * @param {object} validationConfig The configuration for the requested validation
       */
      validateFromIsBeforeTo: function alfresco_forms_controls_DateRange__validateFromIsBeforeTo(validationConfig) {
         var isValid = true;
         var value = this.getValue();
         if (value)
         {
            var valueTokens = value.split(this.dateSeparator);
            var fromValue = "";
            var toValue = "";
            if (valueTokens.length === 2)
            {
               fromValue = valueTokens[0];
               toValue = valueTokens[1];
            }
            if (fromValue !== "" && toValue !== "") 
            {
               // If both pickers have a date, compare the values...
               isValid = new Date(fromValue) < new Date(toValue);
            }
            else if (fromValue === "" && toValue === "")
            {
               // If neither picker has a value, it's fine...
               isValid = true;
            }
            else
            {
               // ...but if one picker has a value, then it's in the invalid state...
               isValid = false;
            }
         }
         this.reportValidationResult(validationConfig, isValid);
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#postMixInProperties}
       * to setup validation for any configured 
       * [confirmationTargetId]{@link module:alfresco/forms/controls/Password#confirmationTargetId}
       * 
       * @instance
       * @since 1.0.87
       */
      postMixInProperties: function alfresco_forms_controls_DateRange__postMixInProperties() {
         this.inherited(arguments);

         if (!this.validationConfig)
         {
            this.validationConfig = [];
         }
         this.validationConfig.push({
            validation: "validateFromIsBeforeTo",
            errorMessage: this.toBeforeFromErrorMessage
         });
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/DateTextBox#placeWidget}
       * to create an additional Date selector to complete the range selection options.
       * 
       * @instance
       */
      placeWidget: function alfresco_forms_controls_DateRange__placeWidget() {
         this.inherited(arguments);
         domClass.add(this.wrappedWidget.domNode, this.baseCssClass + "__from");

         // Update the DOM node to include a specific class that we can anchor styles off...
         domClass.add(this.domNode, this.baseCssClass);

         this.separatorNode = domConstruct.create("span", {
            className: this.baseCssClass + "__separator",
            textContent: this.message("daterange.to.label")
         }, this._controlNode);

         this.toDateNode = domConstruct.create("div", { 
            className: this.baseCssClass + "__to"
         }, this._controlNode);

         this.toDate = new DojoDateTextBox({
            id: this.id + "_TO_DATE_CONTROL"
         });
         this.toDate.validate = lang.hitch(this, function(){
            setTimeout(lang.hitch(this, this.validate), 0);
            return true;
         });
         this.toDate.placeAt(this.toDateNode);
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/DateTextBox#getValue}
       * to combine the to and from dates to create a range value.
       * 
       * @instance
       * @returns {object} The current value of the field
       */
      getValue: function alfresco_forms_controls_DateRange__getValue() {
         // Get the from value...
         var fromValue = this.inherited(arguments);
         
         // Get the to value...
         var toValue = this.toDate.getValue();
         toValue = this.convertStringValuesToBoolean(toValue);
         toValue = this.processDateValue(toValue);

         // Convert "null" to empty string...
         !fromValue && (fromValue = "");
         !toValue && (toValue = "");

         // Concatenate them together...
         var value = fromValue + this.dateSeparator + toValue;
         (value === "|") && (value = "");

         return value;
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#setValue}
       * to split the value into the to and from data and set the widget values appropriately.
       * 
       * @instance
       * @param {object} value The value to set
       */
      setValue: function alfresco_forms_controls_DateRange__setValue(value) {
         if (value)
         {
            var valueTokens = value.split(this.dateSeparator);
            this.inherited(arguments, [valueTokens[0]]);
            this.toDate.setValue(valueTokens[1]);
         }
         else
         {
            this.inherited(arguments);
         }
      }
   });
});
