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
 * This mixin is intended to be mixed into any buttons or menu items that require an action that creates a new
 * [dialog]{@link module:alfresco/dialogs/AlfDialog} that contains a [form]{@link module:alfresco/forms/Form}.
 *
 * Examples of use include the create content menu items in the document library.
 *
 * @module alfresco/dialogs/AlfDialogService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 * @author David Webster
 */

/**
 * Create a dialog that contains a form
 *
 * @event ALF_CREATE_FORM_DIALOG_REQUEST
 * @property {onCreateDialogRequestPayload} payload
 */

/**
 * Create a dialog.
 *
 * @event ALF_CREATE_DIALOG_REQUEST
 * @property {onCreateDialogRequestPayload} payload
 */

define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "alfresco/dialogs/AlfDialog",
        "alfresco/forms/Form",
        "dojo/_base/array",
        "jquery"],
        function(declare, AlfCore, lang, AlfDialog, AlfForm, array, $) {

   return declare([AlfCore], {

      /**
       * Create a new 'publishTopic' for the action and generates a new 'pubSubScope' and then sets
       * up subscriptions for handling show dialog and cancel dialog requests.
       *
       * @instance
       *
       * @listens ALF_CREATE_FORM_DIALOG_REQUEST
       * @listens ALF_CREATE_DIALOG_REQUEST
       */
      constructor: function alfresco_dialogs_AlfDialogService__constructor(args) {
         lang.mixin(this, args);

         // Generate a new pub/sub scope for the widget (this will intentionally override any other settings
         // to contrain communication...
         this.publishTopic = "ALF_CREATE_FORM_DIALOG_REQUEST";
         this.alfSubscribe(this.publishTopic, lang.hitch(this, "onCreateFormDialogRequest"));
         this.alfSubscribe("ALF_CREATE_DIALOG_REQUEST", lang.hitch(this, this.onCreateDialogRequest));
      },

      /**
       * @instance
       * @type {string}
       * @default "ALF_CREATE_FORM_DIALOG_MIXIN_CONFIRMATION_TOPIC"
       */
      _formConfirmationTopic: "ALF_CREATE_FORM_DIALOG_MIXIN_CONFIRMATION_TOPIC",

      /**
       * The configuration for the contents of the dialog to be displayed. This should be provided either on instantiation
       * or by the widget that mixes this module in
       *
       * @instance
       * @type {object}
       * @default null
       */
      widgets: null,

      /**
       * The default configuration for form dialogs. This is used as a base when requests are received.
       *
       * @instance
       * @type {string}
       * @default ""
       */
      defaultFormDialogConfig: {
         dialogTitle: "",
         dialogConfirmationButtonTitle: "OK",
         dialogCancellationButtonTitle: "Cancel"
      },

      /**
       * Handles requests to create basic dialogs.
       *
       * @typedef {Object} onCreateDialogRequestPayload
       * @property {string} dialogTitle - Title
       * @property {string} textContent - Any textual content for the dialog body?
       * @property {array} widgetsContent - What should go in the dialog
       * @property {Array} widgetsButtons - Any button widgets to display in the footer
       * @property {String} [contentWidth=null] -
       * @property {String} [contentHeight=null] -
       * @property {Boolean} [handleOverflow=true] - Should the dialog expand to fill the content
       * @property {Boolean} [fixedWidth=null] -
       * @property {Array} [publishOnShow]
       * @property {String} [hideTopic] - Topic to subscribe to to trigger a dialog hide.
       *
       * @todo This shouldn't destroy previous dialog, but should support stacked dialogs instead.
       * @todo This should pass an ID and keep a map of dialogs created.
       *
       * @instance
       * @param {onCreateDialogRequestPayload} payload The details of the widgets and buttons for the dialog
       */
      onCreateDialogRequest: function alfresco_dialogs_AlfDialogService__onCreateDialogRequest(payload) {
         if (this.dialog != null)
         {
            this.dialog.destroyRecursive();
         }

         // TODO: Update this and other function with scroll setting...
         var dialogConfig = {
            title: this.message(payload.dialogTitle),
            textContent: payload.textContent,
            widgetsContent: payload.widgetsContent,
            widgetsButtons: payload.widgetsButtons,
            additionalCssClasses: payload.additionalCssClasses ? payload.additionalCssClasses : "",
            contentWidth: payload.contentWidth ? payload.contentWidth : null,
            contentHeight: payload.contentHeight ? payload.contentHeight : null,
            handleOverflow: (payload.handleOverflow != null) ? payload.handleOverflow: true,
            fixedWidth: (payload.fixedWidth != null) ? payload.fixedWidth: false
         };
         this.dialog = new AlfDialog(dialogConfig);

         if (payload.publishOnShow)
         {
            array.forEach(payload.publishOnShow, lang.hitch(this, this.publishOnShow));
         }
         this.dialog.show();

         if (payload.hideTopic)
         {
            this.alfSubscribe(payload.hideTopic, lang.hitch(this.dialog, this.dialog.hide));
         }
      },

      /**
       * This function is called when the request to create a dialog includes publication data
       * to be performed when the dialog is displayed.
       *
       * @instance
       * @param {object} publication The publication configuration
       */
      publishOnShow: function alfresco_dialogs_AlfDialogService__publishOnShow(publication) {
         // TODO: Defensive coding, global/parent scope arg handling...
         if (publication.publishTopic && publication.publishPayload)
         {
            this.alfPublish(publication.publishTopic, publication.publishPayload);
         }
         else
         {
            this.alfLog("warn", "A request was made to publish data when a dialog is loaded, but either the topic or payload was missing", publication, this);
         }
      },

      /**
       * Handles requests to create the [dialog]{@link module:alfresco/dialogs/AlfDialog} containining a
       * [form]{@link module:alfresco/forms/Form}. It will delete any previously created dialog (to ensure
       * no stale data is displayed) and create a new dialog containing the form defined.
       *
       * @instance
       * @param {object} payload The payload published on the request topic.
       */
      onCreateFormDialogRequest: function alfresco_dialogs_AlfDialogService__onCreateFormDialogRequest(payload) {
         // Destroy any previously created dialog...
         if (this.dialog != null)
         {
            this.dialog.destroyRecursive();
         }

         if (payload.widgets == null)
         {
            this.alfLog("warn", "A request was made to display a dialog but no 'widgets' attribute has been defined", payload, this);
         }
         else if (payload.formSubmissionTopic == null)
         {
            this.alfLog("warn", "A request was made to display a dialog but no 'formSubmissionTopic' attribute has been defined", payload, this);
         }
         else
         {
            try
            {
               // Create a new pubSubScope just for this request (to allow multiple dialogs to behave independently)...
               var pubSubScope = this.generateUuid();
               var subcriptionTopic =  pubSubScope + this._formConfirmationTopic;
               this.alfSubscribe(subcriptionTopic, lang.hitch(this, this.onFormDialogConfirmation));

               // Take a copy of the default configuration and mixin in the supplied config to override defaults
               // as appropriate...
               var config = lang.clone(this.defaultFormDialogConfig);
               // NOTE: Ideally we'd like to avoid cloning the payload here in case it contains native code, however
               //       we need to ensure that pubSubScopes do not get baked into the payload object that will be re-used
               //       the next time the dialog is opened. We will need to explore alternative solutions in the 5.1 timeframe
               var clonedPayload = lang.clone(payload);
               lang.mixin(config, clonedPayload);
               config.pubSubScope = pubSubScope;
               config.parentPubSubScope = this.parentPubSubScope;
               config.subcriptionTopic = subcriptionTopic; // Include the subscriptionTopic in the configuration the subscription can be cleaned up

               // Construct the form widgets and then construct the dialog using that configuration...
               var formValue = (config.formValue != null) ? config.formValue: {};
               var formConfig = this.createFormConfig(config.widgets, formValue);
               var dialogConfig = this.createDialogConfig(config, formConfig);
               this.dialog = new AlfDialog(dialogConfig);
               this.dialog.show();
            }
            catch (e)
            {
               this.alfLog("error", "The following error occurred creating a dialog for defined configuration", e, this.dialogConfig, this);
            }
         }
      },

      /**
       * Creates the configuration object to pass to the dialog.
       *
       * @instance
       * @param {object} config
       * @param {object} formConfig
       * @returns {object} The dialog configuration.
       */
      createDialogConfig: function alfresco_dialogs_AlfDialogService__createDialogConfig(config, formConfig) {
         var dialogConfig = {
            title: this.message(config.dialogTitle),
            pubSubScope: config.pubSubScope, // Scope the dialog content so that it doesn't pollute any other widgets,,
            handleOverflow: (config.handleOverflow != null) ? config.handleOverflow: true,
            fixedWidth: (config.fixedWidth != null) ? config.fixedWidth: false,
            parentPubSubScope: config.parentPubSubScope,
            additionalCssClasses: config.additionalCssClasses ? config.additionalCssClasses : "",
            widgetsContent: [formConfig],
            widgetsButtons: [
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: config.dialogConfirmationButtonTitle,
                        disableOnInvalidControls: true,
                        publishTopic: this._formConfirmationTopic,
                        publishPayload: {
                           formSubmissionTopic: config.formSubmissionTopic,
                           formSubmissionPayloadMixin: config.formSubmissionPayloadMixin
                        }
                     }
                  },
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: config.dialogCancellationButtonTitle,
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
       * @param {object} formValue The initial value to set in the form.
       * @returns {object} The configuration for the form to add to the dialog
       */
      createFormConfig: function alfresco_dialogs_AlfDialogService__createFormConfig(widgets, formValue) {
         var formConfig = {
            name: "alfresco/forms/Form",
            config: {
               displayButtons: false,
               widgets: widgets,
               value: formValue
            }
         };
         return formConfig;
      },

      /**
       * This is the topic that will be published when the dialog is "confirmed" (e.g. the "OK" button is clicked)
       *
       * @instance
       * @type {string}
       * @default null
       */
      formSubmissionTopic: null,

      /**
       * This handles the user clicking the confirmation button on the dialog (typically, and by default the "OK" button). This has a special
       * handler to process the  payload and construct a simple object reqpresenting the
       * content of the inner [form]{@link module:alfresco/forms/Form}.
       *
       * @instance
       * @param {object} payload The dialog content
       */
      onFormDialogConfirmation: function alfresco_dialogs_AlfDialogService__onFormDialogConfirmation(payload) {
         if (payload != null &&
             payload.dialogContent != null &&
             payload.dialogContent.length == 1 &&
             typeof payload.dialogContent[0].getValue === "function")
         {
            var data = {};
            var formData = payload.dialogContent[0].getValue();

            if (payload.subcriptionTopic)
            {
               this.alfUnsubscribe(payload.subcriptionTopic); // Remove the subscription...
            }

            // Destroy the dialog if a reference is provided...
            if (payload.dialogReference != null)
            {
               payload.dialogReference.destroyRecursive();
            }

            // Mixin in any additional payload information...
            if (payload.formSubmissionPayloadMixin != null)
            {
               lang.mixin(data, payload.formSubmissionPayloadMixin);
            }
            // Using JQuery here in order to support deep merging of dot-notation properties...
            $.extend(true, data, formData);

            // Publish the topic requested for complete...
            this.alfPublish(payload.formSubmissionTopic, data, true);
         }
         else
         {
            this.alfLog("error", "The format of the dialog content was not as expected, the 'formSubmissionTopic' will not be published", payload, this);
         }
      }
   });
});