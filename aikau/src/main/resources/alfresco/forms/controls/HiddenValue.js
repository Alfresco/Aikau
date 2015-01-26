/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * This can be used in forms where it is necessary to set hidden values that are not relevant
 * for the user to see but need to be included in form posts. It was written with the intention
 * of working with the [autoSetConfig]{@link module:alfresco/forms/controls/BaseFormControl#autoSetConfig}
 * capabilities of form controls so that additional data can be set as other fields are updated.
 *
 * @module alfresco/forms/controls/HiddenValue
 * @extends module:alfresco/forms/controls/DojoValidationTextBox
 * @author Dave Draper
 */
define(["alfresco/forms/controls/DojoValidationTextBox",
        "dojo/_base/declare"], 
        function(DojoValidationTextBox, declare) {
   
   return declare([DojoValidationTextBox], {
      
      /**
       * Overrides the [inherited attribute]{@link module:alfresco/forms/controls/BaseFormControl#visibilityConfig} 
       * to ensure the field is invisible.
       * 
       * @instance
       * @returns {object} The current value of the field.
       */
      visibilityConfig: {
         initialValue: false
      },

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_HiddenValue__getWidgetConfig() {
         this.setValue(this.value);
         return {
            id : this.generateUuid(),
            name: this.name,
            value: ""
         };
      },

      /**
       * The hidden value attribute. Used by the [getValue]{@link module:alfresco/forms/controls/HiddenValue#getValue}
       * and [setValue]{@link module:alfresco/forms/controls/HiddenValue#setValue} functions.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      ___hiddenValue: null,

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#getValue} to
       * return the [hiddenValue]{@link module:alfresco/forms/controls/HiddenValue#___hiddenValue} attribute.
       * 
       * @instance
       * @returns {object} The current value of the field.
       */
      getValue: function alfresco_forms_controls_HiddenValue__getValue() {
         return this.___hiddenValue;
      },
      
      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#getValue} to
       * set the [hiddenValue]{@link module:alfresco/forms/controls/HiddenValue#___hiddenValue} attribute.
       *
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function alfresco_forms_controls_HiddenValue__setValue(value) {
         this.___hiddenValue = value;
      },
   });
});