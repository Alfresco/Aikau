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
 * This is a specialization of the [TextBox]{@link module:alfresco/forms/controls/TextBox}
 * that can be configured to automatically set its value to that of another form control
 * where the value is "masked" by a Regular Expression. This widget was written explicitly
 * to address a requirement in the [SiteService]{@link module:alfresco/services/SiteService}
 * where it was necessary for a "shortName" field to automatically be updated with the value
 * of the "title" field but with certain characters and white space removed.
 *
 * @example <caption>This example shows how the MaskingTextBox can be used with another TextBox</caption>
 * {
 *   name: "alfresco/forms/Form",
 *   config: {
 *     pubSubScope: "FORM",
 *     okButtonPublishTopic: "SAVE",
 *     widgets: [
 *        {
 *           name: "alfresco/forms/controls/TextBox",
 *           config: {
 *              fieldId: "TEXTBOX",
 *              label: "Seed value",
 *              description: "The value of this form control is used to set that of the MaskedTextBox",
 *              name: "text"
 *           }
 *        },
 *        {
 *           name: "alfresco/forms/controls/MaskingTextBox",
 *           config: {
 *              fieldId: "MASKEDTEXTBOX",
 *              targetId: "TEXTBOX",
 *              label: "Resulting value",
 *              description: "This value will be automatically set from the value of the other TextBox",
 *              name: "maskedText",
 *              mask: "[^0-9a-zA-Z\-\s]",
 *              trim: true,
 *              toLowerCase: true
 *           }
 *        }
 *     ]
 *   }
 * } 
 * 
 * @module alfresco/forms/controls/MaskingTextBox
 * @extends module:alfresco/forms/controls/TextBox
 * @author Dave Draper
 * @since 1.0.60
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/TextBox",
        "dojo/_base/lang"], 
        function(declare, TextBox, lang) {
   
   return declare([TextBox], {
      
      /**
       * A Regular Expression of the characters to remove from the target value.
       * 
       * @instance
       * @type {string}
       * @default
       */
      mask: null,

      /**
       * Indicates whether or not the masked value should be converted to lower case.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      toLowerCase: true,

      /**
       * Indicates whether or not the masked value should have whitespace removed from the beginning and end
       * of the value.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      trim: true,

      /**
       * This is the [fieldId]{@link module:alfresco/forms/controls/BaseFormControl#fieldId} of another control
       * in the form that this form control should use to seed its value from.
       * 
       * @instance
       * @type {string}
       * @default
       */
      targetId: null,

      /**
       * A Regular Expression compiled from [mask]{@link module:alfresco/forms/controls/MaskingTextBox#mask}}
       * 
       * @instance
       * @type {RegExp}
       * @default
       */
      _maskRe: null,

      /**
       * This will be assigned a handle for the value change subscription created by
       * [postCreate]{@link module:alfresco/forms/controls/MaskingTextBox#postCreate}. The subscription 
       * will be removed as soon as the user has manually changed the value.
       * 
       * @instance
       * @type {object}
       * @default
       */
      _maskUpdateSubscription: null,

      /**
       * This extends the [inherited function]{@link module:alfresco/forms/controls/utilities/TextBoxValueChangeMixin#handleKeyUp}
       * to remove the [_maskUpdateSubscription]{@link module:alfresco/forms/controls/MaskingTextBox#_maskUpdateSubscription}
       * when the user manually edits the field.
       *
       * @instance
       * @param  {object} evt The keyup event
       */
      handleKeyUp: function alfresco_forms_controls_TextBox__handleKeyUp(/*jshint unused:false*/ evt) {
         this.inherited(arguments);
         if (this._maskUpdateSubscription)
         {
            this.alfUnsubscribe(this._maskUpdateSubscription);
            this._maskUpdateSubscription = null;
         }
      },

      /**
       * This extends the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#postCreate}
       * to create a subscription for the changing value of the form control with the 
       * [fieldId]{@link module:alfresco/forms/controls/BaseFormControl#fieldId} of the configured
       * [targetId]{@link module:alfresco/forms/controls/MaskingTextBox#targetId}.
       * 
       * @return {[type]} [description]
       */
      postCreate: function alfresco_forms_controls_MaskingTextBox__postCreate() {
         this.inherited(arguments);
         if (this.mask)
         {
            this._maskRe = new RegExp(this.mask, "g");
         }
         this._maskUpdateSubscription = this.alfSubscribe("_valueChangeOf_" + this.targetId, lang.hitch(this, this.setMaskedValue));
      },

      /**
       *
       * @instance
       * @param {object} payload The payload containing the details of the updated value
       */
      setMaskedValue: function alfresco_forms_controls_MaskingTextBox__setMaskedValue(payload) {
         if (payload && 
             typeof payload.value !== "undefined" && 
             typeof payload.value.toString === "function")
         {
            var maskedValue = payload.value.toString();
            if (this._maskRe)
            {
               maskedValue = maskedValue.replace(this._maskRe, "");
            }
            if (this.toLowerCase)
            {
               maskedValue = maskedValue.toLowerCase();
            }
            if (this.trim)
            {
               maskedValue = lang.trim(maskedValue);
            }
            this.setValue(maskedValue);
         }
      }
   });
});