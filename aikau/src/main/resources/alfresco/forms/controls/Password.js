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
 * that sets the widget type to be of type "password". It should be used for capturing user password entry where the
 * password entered should not be visible.
 * 
 * @module alfresco/forms/controls/Password
 * @extends module:alfresco/forms/controls/TextBox
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/TextBox",
        "dojo/_base/lang"], 
        function(declare, TextBox, lang) {
   
   return declare([TextBox], {
      
      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {Array}
       * @since 1.0.87
       */
      i18nRequirements: [{i18nFile: "./i18n/Password.properties"}],

      /**
       * This can be configured to be the [fieldId]{@link module:alfresco/forms/controls/BaseFormControl#fieldId}
       * of another form control (preferably another password field!) that the value of this field should
       * match. The typical use case is when prompting a user to confirm the change of password.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.87
       */
      confirmationTargetId: null,

      /**
       * The error message to display when the entered value does not match that of the 
       * [field to compare against]{@link module:alfresco/forms/controls/Password#confirmationTargetId}
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.87
       */
      confirmationErrorMessage: "password.not.match.error",

      /**
       * This is a validation callback function that is automatically used when a
       * [confirmationTargetId]{@link module:alfresco/forms/controls/Password#confirmationTargetId}
       * is specified.
       * 
       * @instance
       * @param {object} validationConfig The configuration for the requested validation
       * @since 1.0.87
       */
      confirmMatchingPassword: function alfresco_forms_controls_Password__confirmMatchingPassword(validationConfig) {
         var isValid = this.confirmationTargetValue === this.getValue();
         this.reportValidationResult(validationConfig, isValid);
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/TextBox#getWidgetConfig}
       * to make the text box of type "password".
       *
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_Password__getWidgetConfig() {
         var config = this.inherited(arguments);
         config.type = "password";
         return config;
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#postMixInProperties}
       * to setup validation for any configured 
       * [confirmationTargetId]{@link module:alfresco/forms/controls/Password#confirmationTargetId}
       * 
       * @instance
       * @since 1.0.87
       */
      postMixInProperties: function alfresco_forms_controls_Password__postMixInProperties() {
         this.inherited(arguments);

         if (this.confirmationTargetId)
         {
            var topic = "_valueChangeOf_" + this.confirmationTargetId;
            this.alfSubscribe(topic, lang.hitch(this, function(payload) {
               this.confirmationTargetValue = payload.value;
               this.validate();
            }));

            if (!this.validationConfig)
            {
               this.validationConfig = [];
            }
            this.validationConfig.push({
               validation: "confirmMatchingPassword",
               errorMessage: this.confirmationErrorMessage
            });
         }
      }
   });
});