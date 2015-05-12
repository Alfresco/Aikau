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
 * <p>This service subscribes to [ALF_CREATE_FORM_DIALOG_REQUEST]{@link module:alfresco/services/DialogService~event:ALF_CREATE_FORM_DIALOG_REQUEST}
 * and [ALF_CREATE_DIALOG_REQUEST]{@link module:alfresco/services/DialogService~event:ALF_CREATE_DIALOG_REQUEST} topics 
 * and should be used to manage [dialogs]{@link module:alfresco/dialogs/AlfDialog} displayed on Aikau pages.</p>
 * <p>When creating a form dialog the value of the form will be published on the topic set by the <b>formSubmissionTopic</b> 
 * attribute. You can include additional data in the published payload by using the <b>formSubmissionPayloadMixin</b> attribute.
 * You only need to include the form controls in the <b>widgets</b> attribute - the underlying [form]{@link module:alfresco/forms/Form} 
 * will be created automatically.</p>
 * <p>When creating a normal dialog any buttons included in the dialog will have its payload updated to include a
 * <b>dialogContent</b> attribute that will be an array containing all the root widgets that were created from the 
 * <b>widgetsContent</b> attribute.</p>
 * <p>It is strongly recommended that you include a <b>dialogId</b> attribute when requesting to create either type of dialog since
 * it is used to help the service manage the dialogs. It is only possible to stack dialogs (e.g. display one dialog on top 
 * of another) when the dialogs have different <b>dialogId</b> values. If another dialog with the same <b>dialogId</b> then any existing
 * dialog with that same <b>dialogId</b> will be destroyed. This is done to ensure that the browser DOM does not become
 * over populated with unusable elements</p>
 *
 * @example <caption>Example button that requests a form dialog</caption>
 * {
 *    name: "alfresco/buttons/AlfButton",
 *    config: {
 *       label: "Display form dialog",
 *       publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
 *       publishPayload: {
 *          dialogId: "NAME_DIALOG",
 *          dialogTitle: "User name",
 *          dialogConfirmationButtonTitle: "Save",
 *          dialogCancellationButtonTitle: "Quit",
 *          formSubmissionTopic: "MY_CUSTOM_TOPIC",
 *          formSubmissionPayloadMixin: {
 *             extra: "bonus data"
 *          },
 *          widgets: [
 *             {
 *                name: "alfresco/forms/controls/TextBox",
 *                config: {
 *                   name: "name",
 *                   label: "Name?"
 *                   description: "Please enter your name"
 *                }
 *             }
 *          ]
 *       }
 *    }
 * }
 *
 * @example <caption>Example button that requests basic status dialog</caption>
 * {
 *    name: "alfresco/buttons/AlfButton",
 *    config: {
 *       label: "Alert",
 *       publishTopic: "ALF_CREATE_DIALOG_REQUEST",
 *       publishPayload: {
 *          dialogId: "ALERT_DIALOG",
 *          dialogTitle: "Warning!",
 *          textContent: "You have been warned"
 *       }
 *    }
 * }
 *
 * @example <caption>Example button that requests a dialog with a custom widget model</caption>
 * {
 *    name: "alfresco/buttons/AlfButton",
 *    config: {
 *       label: "Show Logo",
 *       publishTopic: "ALF_CREATE_DIALOG_REQUEST",
 *       publishPayload: {
 *          dialogId: "LOGO_DIALOG",
 *          dialogTitle: "A logo",
 *          widgetsContent: [
 *             {
 *                name: "alfresco/logo/Logo"
 *             }
 *          ],
 *          widgetsButtons: [
 *             {
 *                name: "alfresco/buttons/AlfButton",
 *                config: {
 *                   label: "Close dialog",
 *                   publishTopic: "CUSTOM_TOPIC"
 *                }
 *             }
 *          ]
 *       }
 *    }
 * }
 *
 * @module alfresco/services/DialogService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 * @author David Webster
 */

/**
 * Create a dialog that contains a form
 *
 * @event module:alfresco/services/DialogService~ALF_CREATE_FORM_DIALOG_REQUEST
 * @property {string} dialogTitle - The text to set in the dialog title bar
 * @property {string} formSubmissionTopic - The topic to publish when the confirmation button is used (the published payload will be the form value)
 * @property {Object} formSubmissionPayloadMixin - An additional object to "mixin" to the form value before it is published
 * @property {string} [dialogId=null] The ID of the dialog to display. Only one dialog with no dialogId can exist on a page at a time, therefore it is sensible to always include an id for your dialogs to allow stacking.
 * @property {string} [dialogConfirmationButtonTitle="OK"] - The label for the dialog confirmation button
 * @property {string} [dialogCancellationButtonTitle="Cancel"] - The label for the dialog cancellation button
 * @property {string} [dialogCloseTopic=null] If this is set the the dialog will not automatically be closed when the confirmation button is pressed. Instead the dialog will remain open until this topic is published on.
 * @property {array} [widgets=null] - An array of form controls to include in the dialog
 * @property {string} [dialogWidth=null] The width to make the dialog panel (needs to include units, e.g. "px")
 * @property {string} [contentWidth=null] - The width to set the dialog body (needs to include units, e.g. "px")
 * @property {string} [contentHeight=null] - The height to set the dialog body (needs to include units, e.g. "px")
 * @property {boolean} [handleOverflow=false] - Should scrollbars be added to if the content is bigger than the dialog
 * @property {boolean} [fixedWidth=false] - If set to true, prevents the dialog resizing to fit the content
 * @property {string} [hideTopic=null] - Topic to subscribe to to trigger a dialog hide. If this is set
 */

/**
 * Create a dialog containing either widgets or text with and configurable buttons.
 *
 * @event module:alfresco/services/DialogService~ALF_CREATE_DIALOG_REQUEST
 * @property {string} dialogTitle - The text to set in the dialog title bar
 * @property {string} [dialogId=null] The ID of the dialog to display. Only one dialog with no dialogId can exist on a page at a time, therefore it is sensible to always include an id for your dialogs to allow stacking.
 * @property {string} [textContent=null] - Text to display in the dialog body
 * @property {array} [widgetsContent=null] - A widget model to display in the dialog body (this supercedes any textContent attribute)
 * @property {Array} [widgetsButtons=null] - A widget model of buttons to display in the dialog footer
 * @property {String} [dialogWidth=null] The width to make the dialog panel (needs to include units, e.g. "px")
 * @property {String} [contentWidth=null] - The width to set the dialog body (needs to include units, e.g. "px")
 * @property {String} [contentHeight=null] - The height to set the dialog body (needs to include units, e.g. "px")
 * @property {Boolean} [handleOverflow=false] - Should scrollbars be added to if the content is bigger than the dialog
 * @property {Boolean} [fixedWidth=false] - If set to true, prevents the dialog resizing to fit the content
 * @property {Array} [publishOnShow=null] - An array of publications objects to make when the dialog is displayed
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
       * @listens module:alfresco/services/DialogService~event:ALF_CREATE_FORM_DIALOG_REQUEST
       * @listens module:alfresco/services/DialogService~event:ALF_CREATE_DIALOG_REQUEST
       */
      constructor: function alfresco_services_DialogService__constructor(args) {
         lang.mixin(this, args);

         // Generate a new pub/sub scope for the widget (this will intentionally override any other settings
         // to contrain communication...
         this.publishTopic = "ALF_CREATE_FORM_DIALOG_REQUEST";
         this.alfSubscribe(this.publishTopic, lang.hitch(this, this.onCreateFormDialogRequest));
         this.alfSubscribe("ALF_CREATE_DIALOG_REQUEST", lang.hitch(this, this.onCreateDialogRequest));

         // Create a reference of IDs to dialogs... 
         // The idea is that we shouldn't have multiple instances of a dialog with the same ID, but we
         // can have multiple dialogs with different IDs...
         this.idToDialogMap = {};
      },

      /**
       * This deletes any previously created dialog that was requested for the same id.
       *
       * @instance
       * @param {object} payload The payload for the new dialog request.
       */
      cleanUpAnyPreviousDialog: function alfresco_services_DialogService__cleanUpPreviousDialog(payload) {
         if (this.idToDialogMap[payload.dialogId] &&
             typeof this.idToDialogMap[payload.dialogId].destroyRecursive === "function")
         {
            // We have a reference to an existing dialog, so we'll destroy it
            this.idToDialogMap[payload.dialogId].destroyRecursive();
            delete this.idToDialogMap[payload.dialogId];
         }
         else if (this.idToDialogMap[null] &&
                  typeof this.idToDialogMap[null].destroyRecursive === "function")
         {
            this.idToDialogMap[null].destroyRecursive();
            delete this.idToDialogMap[null];
         }
      },

      /**
       * Maps the id requested for the dialog to the dialog created so that it can be destroyed when a
       * request is made to create a dialog with the same id. If an id has not been requested then the
       * dialog will be mapped to null. Only one dialog is no requested id can exist at any one time.
       *
       * @instance
       * @param {object} payload The payload passed when requesting to create the dialog
       * @param {object} dialog The dialog created
       */
      mapRequestedIdToDialog: function alfresco_services_DialogService__mapRequestedIdToDialog(payload, dialog) {
         if (payload.dialogId)
         {
            // Map the dialog id to the dialog (so that it can be destroyed if another is requested)...
            this.idToDialogMap[payload.dialogId] = dialog;
         }
         else
         {
            // If no id was provided for the dialog we'll store it against null...
            this.idToDialogMap[null] = dialog;
         }
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
       * @instance
       * @param {module:alfresco/services/DialogService~event:ALF_CREATE_DIALOG_REQUEST} payload The details of the widgets and buttons for the dialog
       */
      onCreateDialogRequest: function alfresco_services_DialogService__onCreateDialogRequest(payload) {
         // jshint maxcomplexity:false
         this.cleanUpAnyPreviousDialog(payload);

         var handleOverflow = true;
         if (payload.handleOverflow === false)
         {
            handleOverflow = false;
         }
         var fixedWidth = false;
         if (payload.fixedWidth === true)
         {
            fixedWidth = true;
         }

         // TODO: Update this and other function with scroll setting...
         var dialogConfig = {
            id: payload.dialogId ? payload.dialogId : this.generateUuid(),
            title: this.message(payload.dialogTitle || ""),
            content: payload.textContent,
            widgetsContent: payload.widgetsContent,
            widgetsButtons: payload.widgetsButtons,
            additionalCssClasses: payload.additionalCssClasses ? payload.additionalCssClasses : "",
            dialogWidth: payload.dialogWidth || null,
            contentWidth: payload.contentWidth ? payload.contentWidth : null,
            contentHeight: payload.contentHeight ? payload.contentHeight : null,
            handleOverflow: handleOverflow,
            fixedWidth: fixedWidth
         };
         var dialog = new AlfDialog(dialogConfig);

         if (payload.publishOnShow)
         {
            array.forEach(payload.publishOnShow, lang.hitch(this, this.publishOnShow));
         }
         this.mapRequestedIdToDialog(payload, dialog);
         dialog.show();

         if (payload.hideTopic)
         {
            this.alfSubscribe(payload.hideTopic, lang.hitch(dialog, dialog.hide));
         }
      },

      /**
       * This function is called when the request to create a dialog includes publication data
       * to be performed when the dialog is displayed.
       *
       * @instance
       * @param {object} publication The publication configuration
       */
      publishOnShow: function alfresco_services_DialogService__publishOnShow(publication) {
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
       * @param {module:alfresco/services/DialogService~event:ALF_CREATE_FORM_DIALOG_REQUEST} payload The payload published on the request topic.
       */
      onCreateFormDialogRequest: function alfresco_services_DialogService__onCreateFormDialogRequest(payload) {
         this.cleanUpAnyPreviousDialog(payload);
         if (!payload.widgets)
         {
            this.alfLog("warn", "A request was made to display a dialog but no 'widgets' attribute has been defined", payload, this);
         }
         else if (!payload.formSubmissionTopic)
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
               var formValue = config.formValue ? config.formValue: {};
               var formConfig = this.createFormConfig(config.widgets, formValue);
               var dialogConfig = this.createDialogConfig(config, formConfig);
               var dialog = new AlfDialog(dialogConfig);
               this.mapRequestedIdToDialog(payload, dialog);
               dialog.show();

               if (config.dialogCloseTopic)
               {
                  this.alfSubscribe(config.dialogCloseTopic, lang.hitch(this, this.onCloseDialog, dialog));
               }
            }
            catch (e)
            {
               this.alfLog("error", "The following error occurred creating a dialog for defined configuration", e, this.dialogConfig, this);
            }
         }
      },

      /**
       * Closes the supplied dialog.
       *
       * @instance
       * @param {object} dialog The dialog to close.
       */
      onCloseDialog: function alfresco_services_DialogService__onCloseDialog(dialog) {
         if (typeof dialog.hide === "function")
         {
            dialog.hide();
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
      createDialogConfig: function alfresco_services_DialogService__createDialogConfig(config, formConfig) {
         var handleOverflow = true;
         if (config.handleOverflow === false)
         {
            handleOverflow = false;
         }
         var fixedWidth = false;
         if (config.fixedWidth === true)
         {
            fixedWidth = true;
         }

         // If a specific dialogCloseTopic has been requeste then add the "confirmationButton" CSS class as
         // a value that will suppress dialog closure.
         var suppressCloseClasses = config.dialogCloseTopic ? ["confirmationButton"]: null;
         
         var dialogConfig = {
            id: config.dialogId ? config.dialogId : this.generateUuid(),
            title: this.message(config.dialogTitle || ""),
            pubSubScope: config.pubSubScope, // Scope the dialog content so that it doesn't pollute any other widgets,,
            handleOverflow: handleOverflow,
            fixedWidth: fixedWidth,
            parentPubSubScope: config.parentPubSubScope,
            additionalCssClasses: config.additionalCssClasses ? config.additionalCssClasses : "",
            suppressCloseClasses: suppressCloseClasses,
            dialogWidth: config.dialogWidth || null,
            contentWidth: config.contentWidth ? config.contentWidth : null,
            contentHeight: config.contentHeight ? config.contentHeight : null,
            widgetsContent: [formConfig],
            widgetsButtons: [
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: config.dialogConfirmationButtonTitle,
                        disableOnInvalidControls: true,
                        additionalCssClasses: "confirmationButton",
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
                        additionalCssClasses: "cancellationButton",
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
      createFormConfig: function alfresco_services_DialogService__createFormConfig(widgets, formValue) {
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
      onFormDialogConfirmation: function alfresco_services_DialogService__onFormDialogConfirmation(payload) {
         if (payload &&
             payload.dialogContent &&
             payload.dialogContent.length &&
             typeof payload.dialogContent[0].getValue === "function")
         {
            var data = {};
            var formData = payload.dialogContent[0].getValue();

            if (payload.subcriptionTopic)
            {
               this.alfUnsubscribe(payload.subcriptionTopic); // Remove the subscription...
            }

            // Destroy the dialog if a reference is provided...
            if (payload.dialogReference && typeof payload.dialogReference.destroyRecursive === "function")
            {
               payload.dialogReference.destroyRecursive();
            }

            // Mixin in any additional payload information...
            if (payload.formSubmissionPayloadMixin)
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