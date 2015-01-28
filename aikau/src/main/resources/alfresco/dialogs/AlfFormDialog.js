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
 * <p>This extends the default [dialog]{@link module:alfresco/dialogs/AlfDialog} to set up a dialog that 
 * is specifically designed to contain form widgets (e.g. [text boxes]{@link module:alfresco/forms/controls/DojoValidationTextBox},
 * [checkboxes]{@link module:alfresco/forms/controls/CheckBox}, etc) such that when the form is 
 * confirmed a payload containing the value retrieved from the [form]{@link module:alfresco/forms/Form}
 * is published on the [formSubmissionTopic]{@link module:alfresco/dialogs/AlfFormDialog#formSubmissionTopic}.</p>
 * <p>PLEASE NOTE: There is some overlap/duplication of code with [_AlfCreateFormDialogMixin]{@link module:alfresco/forms/_AlfCreateFormDialogMixin}</p>
 * 
 * @module alfresco/dialogs/AlfFormDialog
 * @extends external:dijit/Dialog
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/dialogs/AlfDialog",
        "dojo/_base/lang",
        "alfresco/forms/Form",
        "alfresco/buttons/AlfButton"], 
        function(declare, AlfDialog, lang, Form, AlfButton) {
   
   return declare([AlfDialog], {
      
      /**
       * Sets up the form specific configuration for the dialog.
       *
       * @instance
       * @param {object} formConfig
       * @returns {object} The dialog configuration.
       */
      constructor: function alfresco_dialogs_AlfFormDialog__constructor(args) {
         declare.safeMixin(this, args);
         var createFormConfig = this.createFormConfig(this.widgets);
         var dialogConfig = this.createDialogConfig(createFormConfig);
         lang.mixin(this, dialogConfig);
         this.alfSubscribe(this._formConfirmationTopic, lang.hitch(this, "onDialogConfirmation"));
      },

      /**
       * The title for the dialog.
       *
       * @instance
       * @type {string}
       * @default ""
       */
      dialogTitle: "",

      /**
       * TODO: Default needs localizing
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      dialogConfirmationButtonTitle: "OK",

      /**
       * TODO: Default needs localizing
       *
       * @instance
       * @type {string}
       * @default ""
       */
      dialogCancellationButtonTitle: "Cancel",

      /**
       * @instance
       * @type {string}
       * @default "ALF_CREATE_FORM_DIALOG_MIXIN_CONFIRMATION_TOPIC"
       */
      _formConfirmationTopic: "ALF_CREATE_FORM_DIALOG_MIXIN_CONFIRMATION_TOPIC",

      /**
       * The topic that will be published on when the dialog is confirmed. 
       *
       * @instance
       * @type {string}
       * @default ""
       */
      formSubmissionTopic: "",

      /**
       * This provides a base payload that will be augmented with the values from the form.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      formSubmissionPayload: null,

      /**
       * Creates the configuration object to pass to the dialog.
       *
       * @instance
       * @param {object} formConfig
       * @returns {object} The dialog configuration.
       */
      createDialogConfig: function alfresco_dialogs_AlfFormDialog__createDialogConfig(formConfig) {
         var dialogConfig = {
            title: this.message(this.dialogTitle),
            pubSubScope: this.pubSubScope, // Scope the dialog content so that it doesn't pollute any other widgets
            parentPubSubScope: this.parentPubSubScope,
            widgetsContent: [formConfig],
            widgetsButtons: [
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: this.dialogConfirmationButtonTitle,
                        disableOnInvalidControls: true,
                        additionalCssClasses: "alfresco-dialogs-_AlfCreateFormDialogMixin confirmation",
                        publishTopic: this._formConfirmationTopic
                     }
                  },
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: this.dialogCancellationButtonTitle,
                        additionalCssClasses: "alfresco-dialogs-_AlfCreateFormDialogMixin cancellation",
                        publishTopic: "ALF_CLOSE_DIALOG"
                     }
                  }
               ]
         };
         return dialogConfig;
      },

      /**
       * Creates and returns the [form]{@link module:alfresco/forms/Form} configuration to be added to the [dialog]{@link module:alfresco/dialog/AlfDialog}
       *
       * @instance
       * @param {object} widgets This is the configuration of the fields to be included in the form.
       * @returns {object} The configuration for the form to add to the dialog
       */
      createFormConfig: function alfresco_dialogs_AlfFormDialog__createFormConfig(widgets) {
         var formConfig = {
            name: "alfresco/forms/Form",
            config: {
               displayButtons: false,
               widgets: widgets
            }
         };
         return formConfig;
      },

      /**
       * This handles the user clicking the confirmation button on the dialog (typically, and by default the "OK" button). This has a special
       * handler to process the  payload and construct a simple object reqpresenting the
       * content of the inner [form]{@link module:alfresco/forms/Form}.
       * 
       * @instance
       * @param {object} payload The dialog content
       */
      onDialogConfirmation: function alfresco_dialogs_AlfFormDialog__onDialogConfirmation(payload) {
         if (payload != null && 
             payload.dialogContent != null &&
             payload.dialogContent.length == 1 &&
             typeof payload.dialogContent[0].getValue === "function")
         {
            var data = payload.dialogContent[0].getValue();
            if (this.formSubmissionPayload == null)
            {
               this.formSubmissionPayload = {};
            }
            var payload = lang.mixin(data, this.formSubmissionPayload);
            this.alfPublish(this.formSubmissionTopic, payload, true);
         }
         else
         {
            this.alfLog("error", "The format of the dialog content was not as expected, the 'formSubmissionTopic' will not be published", payload, this);
         }
      }
   });
});