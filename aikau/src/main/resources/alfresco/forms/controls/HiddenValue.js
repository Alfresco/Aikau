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
 * <p>This can be used in forms where it is necessary to set hidden values that are not relevant
 * for the user to see but need to be included in form posts. It was written with the intention
 * of working with the [autoSetConfig]{@link module:alfresco/forms/controls/BaseFormControl#autoSetConfig}
 * capabilities of form controls so that additional data can be set as other fields are updated.</p>
 * <p>This widget should only be used in a [Form]{@link module:alfresco/forms/Form} where either the value of 
 * field is simply fixed (in which case you should just consider including that value in the
 * [form confirmation button payload]{@link module:alfresco/forms/Form#okButtonPublishPayload})) or where
 * it is the target of some [auto-set configuration rules]{@link module:alfresco/forms/controls/BaseFormControl#autoSetConfig}.
 * This widget can also be used programmatically in other widget (e.g. see how it is used in the 
 * [InlineEditProperty renderer]{@link module:alfresco/renderers/InlineEditProperty}).</p>
 * <p>If your intention is to be able to see an assigned value in the browser DOM model then you should consider just using
 * a [TextBox]{@link module:alfresco/forms/controls/TextBox} with the 
 * [visibilityConfig]{@link module:alfresco/forms/controls/BaseFormControl#visibilityConfig} configured
 * such that the "initialValue" attribute is set to be false so that the TextBox is hidden.</p>
 *
 * @example <caption>Example usage:</caption>
 * {
 *    id: "SOURCE",
 *    name: "alfresco/forms/controls/Select", 
 *    config: {
 *       fieldId: "SOURCE_FIELD",
 *       label: "Choose whether to set a hidden value",
 *       name: "choice",
 *       value: "1",
 *       optionsConfig: {
 *          fixed: [
 *             { label: "Don't set hidden value", value: "1"},
 *             { label: "Set hidden value", value: "2"}
 *         ]
 *       }
 *    }
 * },
 * {
 *    id: "TARGET",
 *    name: "alfresco/forms/controls/HiddenValue",
 *    config: {
 *       name: "hidden",
 *       autoSetConfig: [
 *          {
 *             rulePassValue: "VALUE_SET",
 *             ruleFailValue: "",
 *             rules: [
 *                {
 *                   targetId: "SOURCE_FIELD",
 *                   is: ["2"]
 *                }
 *             ]
 *          }
 *       ]
 *    }
 * }
 *
 * @module alfresco/forms/controls/HiddenValue
 * @extends module:alfresco/forms/controls/TextBox
 * @author Dave Draper
 */
define(["alfresco/forms/controls/TextBox",
        "dojo/_base/declare"], 
        function(TextBox, declare) {
   
   return declare([TextBox], {
      
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
         return {
            id : this.generateUuid(),
            name: this.name
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
         // this.___hiddenValue = value;
         if (this.deferValueAssigment)
         {
            this.inherited(arguments);
         }
         else
         {
            this.___hiddenValue = value;
         }
      }
   });
});