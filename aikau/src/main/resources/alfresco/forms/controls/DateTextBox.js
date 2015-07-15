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
 * Creates a date-field input box
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
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/date/stamp",
        "dijit/form/DateTextBox",
        "dojo/dom-class"],
        function(BaseFormControl, declare, lang, stamp, DateTextBox, domClass) {
   return declare([BaseFormControl], {

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
         if(!this.value || (typeof this.value === "string" && lang.trim(this.value).length === 0)) {
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
         return {
            id : this.id + "_CONTROL",
            name: this.name,
            options: (this.options !== null) ? this.options : []
         };
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
         return new DateTextBox(config);
      }
   });
});