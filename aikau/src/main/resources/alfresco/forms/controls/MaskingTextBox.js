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
 * where the value is "masked" by a Regular Expressions defined in the 
 * [replacements]{@link module:alfresco/forms/controls/MaskingTextBox#replacements} array. 
 * This widget was written explicitly to address a requirement in the 
 * [SiteService]{@link module:alfresco/services/SiteService} where it was necessary for a "shortName" 
 * field to automatically be updated with the value of the "title" field but with certain characters 
 * and white space removed.
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
 *              replacements: [
 *                 {
 *                    regex: "[^a-z0-9\\-\\s]",
 *                    flags: "gi"
 *                 },
 *                 {
 *                    regex: "\\s+",
 *                    replacement: "-"
 *                 }
 *              ],
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
        "dojo/_base/array",
        "dojo/_base/lang"], 
        function(declare, TextBox, array, lang) {
   
   return declare([TextBox], {
      
      /**
       * An object defining the how to target characters in the supplied value and how they should be replaced.
       * 
       * @typedef {Replacement}
       * @property {string} regex A Regular Expression to match characters in the text that should be replaced
       * @property {string} [flags=""] Flags to apply to the Regular Expression (defaults to "g" for global replacement)
       * @property {string} [replacement=""] The text to replace the matched characters with
       */
      
      /**
       * This should be configured to be an object array containing the 
       * 
       * @instance
       * @type {Replacement[]}
       * @default
       */
      replacements: null,

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
      handleKeyUp: function alfresco_forms_controls_MaskingTextBox__handleKeyUp(/*jshint unused:false*/ evt) {
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
       */
      postCreate: function alfresco_forms_controls_MaskingTextBox__postCreate() {
         this.inherited(arguments);
         if (this.replacements)
         {
            array.forEach(this.replacements, function(replacement) {
               if (replacement.regex)
               {
                  try
                  {
                     var re = new RegExp(replacement.regex, replacement.flags || "");
                     replacement._re = re;
                  }
                  catch(e)
                  {
                     this.alfLog("error", "The following error occurred generating a Regular Expression from: " + replacement.regex, this);
                  }
               }
            });
         }

         this._maskUpdateSubscription = this.alfSubscribe("_valueChangeOf_" + this.targetId, lang.hitch(this, this.setMaskedValue));
      },

      /**
       * This function sets the value of the form control by applying each valid entry 
       * in the [replacements]{@link module:alfresco/forms/controls/MaskingTextBox#replacements} array.
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
            if (this.toLowerCase)
            {
               maskedValue = maskedValue.toLowerCase();
            }
            if (this.trim)
            {
               maskedValue = lang.trim(maskedValue);
            }
            array.forEach(this.replacements, function(replacement) {
               if (replacement._re)
               {
                  maskedValue = maskedValue.replace(replacement._re, replacement.replacement || "");
               }
            });
            this.setValue(maskedValue);

            if (payload.value)
            {
               this._hadFocus = true;
            }
         }
      }
   });
});