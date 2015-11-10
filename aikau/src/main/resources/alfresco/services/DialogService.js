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
 * <p>It is also possible to create form dialogs that follow the "Create and create again" pattern by configuring the
 * "dialogRepeats" attribute in the [ALF_CREATE_FORM_DIALOG_REQUEST]{@link module:alfresco/services/DialogService~event:ALF_CREATE_FORM_DIALOG_REQUEST}
 * to be true. This will include an additional button in the dialog that when used will publish the value of the current form
 * and then recreate a new dialog with a new copy of the form.</p>
 * <p>In order to be notified when a dialog is cancelled by either clicking on the cross in the top corner, or by pressing escape,
 * a "cancelPublishTopic" can be supplied. This will never be published by someone clicking a "cancel" button - it will only be
 * triggered using one of the two methods above. Scope can be overridden from the default response scope by providing a custom
 * "cancelPublishScope" property. This can be used on normal dialogs and form dialogs.</p>
 *
 * @example <caption>Example button that requests a form dialog</caption>
 * {
 *    name: "alfresco/buttons/AlfButton",
 *    config: {
 *       label: "Display form dialog",
 *       publishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",
 *       publishPayload: {
 *          cancelPublishScope: "",
 *          cancelPublishTopic: "DIALOG_CANCELLED",
 *          dialogId: "NAME_DIALOG",
 *          dialogTitle: "User name",
 *          dialogConfirmationButtonTitle: "Save",
 *          dialogCancellationButtonTitle: "Quit",
 *          formSubmissionTopic: "MY_CUSTOM_TOPIC",
 *          formSubmissionPayloadMixin: {
 *             extra: "bonus data"
 *          },
 *          formValue: {
 *             name: "Bob"
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
 * @extends module:alfresco/services/BaseService
 * @pageSafe
 * @author Dave Draper
 * @author David Webster
 */

/**
 * Create a dialog that contains a form
 *
 * @event module:alfresco/services/DialogService~ALF_CREATE_FORM_DIALOG_REQUEST
 * @property {string} dialogTitle - The text to set in the dialog title bar
 * @property {number} [duration=0] - The duration of the fade effect when showing or hiding the dialog
 * @property {string} formSubmissionTopic - The topic to publish when the confirmation button is used (the published payload will be the form value)
 * @property {Object} formSubmissionPayloadMixin - An additional object to "mixin" to the form value before it is published
 * @property {Object} [formValue={}] - The initial value to apply to the form when created. This should be an object with attributes mapping to the "name" attribute of each form control.
 * @property {string} [dialogId=null] The ID of the dialog to display. Only one dialog with no dialogId can exist on a page at a time, therefore it is sensible to always include an id for your dialogs to allow stacking.
 * @property {boolean} [dialogRepeats=false] Indicates that an additional button the publishes the current form and then recreates the dialog again
 * @property {string} [dialogConfirmationButtonTitle="OK"] - The label for the dialog confirmation button
 * @property {string} [dialogConfirmAndRepeatButtonTitle="OK (and repeat)"] The label for the button indicating the dialog should be repeated
 * @property {string} [dialogCancellationButtonTitle="Cancel"] - The label for the dialog cancellation button
 * @property {string} [dialogCloseTopic=null] If this is set the the dialog will not automatically be closed when the confirmation button is pressed. Instead the dialog will remain open until this topic is published on.
 * @property {array} [widgets=null] - An array of form controls to include in the dialog
 * @property {string} [dialogWidth=null] The width to make the dialog panel (needs to include units, e.g. "px")
 * @property {string} [contentWidth=null] - The width to set the dialog body (needs to include units, e.g. "px")
 * @property {string} [contentHeight=null] - The height to set the dialog body (needs to include units, e.g. "px")
 * @property {boolean} [handleOverflow=false] - Should scrollbars be added to if the content is bigger than the dialog
 * @property {boolean} [fixedWidth=false] - If set to true, prevents the dialog resizing to fit the content
 * @property {string} [hideTopic=null] - Topic to subscribe to to trigger a dialog hide. If this is set
 * @property {boolean} [fullScreenMode=false] Whether or not to create the dialog the size of the screen
 * @property {boolean} [fullScreenPadding=10] The padding to leave around the dialog when in full screen mode
 * @property {boolean} [showValidationErrorsImmediately=true] Indicates whether or not to display form errors immediately
 */

/**
 * Create a dialog containing either widgets or text with and configurable buttons.
 *
 * @event module:alfresco/services/DialogService~ALF_CREATE_DIALOG_REQUEST
 * @property {string} dialogTitle - The text to set in the dialog title bar
 * @property {string} [dialogId=null] The ID of the dialog to display. Only one dialog with no dialogId can exist on a page at a time, therefore it is sensible to always include an id for your dialogs to allow stacking.
 * @property {number} [duration=0] - The duration of the fade effect when showing or hiding the dialog
 * @property {string} [textContent=null] - Text to display in the dialog body
 * @property {array} [widgetsContent=null] - A widget model to display in the dialog body (this supercedes any textContent attribute)
 * @property {Array} [widgetsButtons=null] - A widget model of buttons to display in the dialog footer
 * @property {String} [dialogWidth=null] The width to make the dialog panel (needs to include units, e.g. "px")
 * @property {String} [contentWidth=null] - The width to set the dialog body (needs to include units, e.g. "px")
 * @property {String} [contentHeight=null] - The height to set the dialog body (needs to include units, e.g. "px")
 * @property {Boolean} [handleOverflow=false] - Should scrollbars be added to if the content is bigger than the dialog
 * @property {Boolean} [fixedWidth=false] - If set to true, prevents the dialog resizing to fit the content
 * @property {Array} [publishOnShow=null] - An array of publications objects to make when the dialog is displayed
 * @property {boolean} [fullScreenMode=false] Whether or not to create the dialog the size of the screen
 * @property {boolean} [fullScreenPadding=10] The padding to leave around the dialog when in full screen mode
 */

define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/topics",
        "alfresco/dialogs/AlfDialog",
        "alfresco/forms/Form",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/aspect",
        "dojo/on",
        "dojo/keys",
        "dojo/when",
        "jquery"],
        function(declare, BaseService, topics, AlfDialog, AlfForm, lang, array, aspect, on, keys, when, $) {

   return declare([BaseService], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/DialogService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/DialogService.properties"}],

      /**
       * The topic published when the confirmation button is used.
       * 
       * @instance
       * @type {string}
       * @default
       */
      _formConfirmationTopic: "ALF_CREATE_FORM_DIALOG_MIXIN_CONFIRMATION_TOPIC",

      /**
       * The topic published when the button confirming the current dialog, but requesting to
       * repeat the dialog is used.
       * 
       * @instance
       * @type {string}
       * @default 
       */
      _formConfirmationRepeatTopic: "ALF_CREATE_REPEATING_FORM_DIALOG_MIXIN_CONFIRMATION_TOPIC",

      /**
       * The topic published when the cancellation button is used.
       * 
       * @instance
       * @type {string}
       * @default 
       */
      _formCancellationTopic: "ALF_CLOSE_DIALOG",

      /**
       * The default configuration for form dialogs. This is used as a base when requests are received.
       *
       * @instance
       * @type {object}
       */
      defaultFormDialogConfig: {
         dialogTitle: "",
         dialogConfirmationButtonTitle: "dialogService.formDialog.ok.button.label",
         dialogCancellationButtonTitle: "dialogService.formDialog.cancel.button.label",
         dialogConfirmAndRepeatButtonTitle: "dialogService.formDialog.repeat.button.label"
      },

      /**
       * This is the topic that will be published when the dialog is "confirmed" (e.g. the "OK" button is clicked)
       *
       * @instance
       * @type {string}
       * @default
       */
      formSubmissionTopic: null,
      
      /**
       * This is used to map the dialog created on for each request against the "dialogId" associated with that request.
       * Only one instance of a dialog with the same "dialogId" can exist at one time. If a new request is made with
       * the same "dialogId" as has been used for an existing dialog, then that existing dialog will be destroyed.
       *
       * @instance
       * @type {object}
       * @default
       */
      idToDialogMap: null,

      /**
       * This us used to map all the subscription and aspect handles created for each requested dialog against the
       * "dialogId" associated with the request to create that dialog. This is done so that all handles can be removed
       * when the dialog is destroyed. Each "dialogId" is associated with an object into which handles can be mapped
       * against a specific key. This allows the service to check for an existing handle before creating duplicates
       * (e.g. when handling repeating dialog requests).
       *
       * @instance
       * @type {object}
       * @default
       */
      idToHandleMap: null,

      /**
       * The configuration for the contents of the dialog to be displayed. This should be provided either on instantiation
       * or by the widget that mixes this module in
       *
       * @instance
       * @type {object}
       * @default
       */
      widgets: null,

      /**
       * The stack of active dialogs
       *
       * @instance
       * @static
       * @type {Object[]}
       */
      _activeDialogs: [],

      /**
       * @instance
       * @listens module:alfresco/services/DialogService~event:ALF_CREATE_FORM_DIALOG_REQUEST
       * @listens module:alfresco/services/DialogService~event:ALF_CREATE_DIALOG_REQUEST
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_DialogService__registerSubscriptions() {
         // Generate a new pub/sub scope for the widget (this will intentionally override any other settings
         // to contrain communication...
         this.publishTopic = topics.CREATE_FORM_DIALOG;
         this.alfSubscribe(this.publishTopic, lang.hitch(this, this.onCreateFormDialogRequest));
         this.alfSubscribe(topics.CREATE_DIALOG, lang.hitch(this, this.onCreateDialogRequest));

         // Create a reference of IDs to dialogs...
         // The idea is that we shouldn't have multiple instances of a dialog with the same ID, but we
         // can have multiple dialogs with different IDs...
         this.idToDialogMap = {};
         this.idToHandleMap = {};

         // We need to make sure the escape key closes our last-opened dialog, so we must listen
         // at the body level
         on(document.body, "keydown", lang.hitch(this, function(evt) {
            if (evt && evt.keyCode === keys.ESCAPE) {
               this._handleEscape();
            }
         }));
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

            this.cleanUpDialogHandles(this.idToHandleMap[payload.dialogId]);
            delete this.idToHandleMap[payload.dialogId];
         }
         else if (this.idToDialogMap[null] &&
                  typeof this.idToDialogMap[null].destroyRecursive === "function")
         {
            this.idToDialogMap[null].destroyRecursive();
            delete this.idToDialogMap[null];

            this.cleanUpDialogHandles(this.idToHandleMap[null]);
            delete this.idToHandleMap[null];
         }
      },

      /**
       * Cleans up any subscription or aspect handles created for a dialog that has been destroyed.
       *
       * @instance
       * @param  {object} map A map of handles to remove
       */
      cleanUpDialogHandles: function alfresco_services_DialogService__cleanUpDialogHandles(map) {
         for (var key in map)
         {
            if (map.hasOwnProperty(key))
            {
               if (typeof map[key].remove === "function")
               {
                  // NOTE: In some respects we shouldn't do this, we should probably go via alfUnsubscribe
                  //       but in this specific case it is better to explicitly deal with the handle
                  //       Should we every swap out Dojo subscription handling then we will need to deal 
                  //       with aspects and subscription handles separately
                  map[key].remove();
               }
            }
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
       * Maps a handle against a specific handle id within the map of dialogId to handles.
       * 
       * @param  {object} payload The create dialog request payload
       * @param  {string} id The id to map the handle against
       * @param  {object} handle A subscription or aspect handle
       */
      mapRequestedIdToHandle: function alfresco_services_DialogService__mapRequestedIdToHandles(payload, id, handle) {
         var dialogId = payload.dialogId || null;
         var map = this.idToHandleMap[dialogId];
         if (!map)
         {
            map = {};
            this.idToHandleMap[dialogId] = map;
         }
         map[id] = handle;
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
            duration: payload.duration || 0,
            fullScreenMode: payload.fullScreenMode || false,
            fullScreenPadding: !isNaN(payload.fullScreenPadding) ? payload.fullScreenPadding : 10,
            widgetsContent: payload.widgetsContent,
            widgetsButtons: payload.widgetsButtons,
            additionalCssClasses: payload.additionalCssClasses ? payload.additionalCssClasses : "",
            dialogWidth: payload.dialogWidth || null,
            contentWidth: payload.contentWidth ? payload.contentWidth : null,
            contentHeight: payload.contentHeight ? payload.contentHeight : null,
            handleOverflow: handleOverflow,
            fixedWidth: fixedWidth
         };

         // Ensure that text content is center aligned (see AKU-368)...
         if (dialogConfig.content)
         {
            dialogConfig.additionalCssClasses += " alfresco-dialogs-AlfDialog--textContent";
         }

         var dialog = new AlfDialog(dialogConfig);

         if (payload.publishOnShow)
         {
            array.forEach(payload.publishOnShow, lang.hitch(this, this.publishOnShow));
         }
         this.mapRequestedIdToDialog(payload, dialog);
         this._showDialog(payload, dialog);

         if (payload.hideTopic)
         {
            var handle = this.alfSubscribe(payload.hideTopic, lang.hitch(dialog, dialog.hide));
            this.mapRequestedIdToHandle(payload, "dialog.hide", handle);
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
         // jshint maxstatements:false
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
               var confirmationHandle = this.alfSubscribe(subcriptionTopic, lang.hitch(this, this.onFormDialogConfirmation));
               this.mapRequestedIdToHandle(payload, "dialog.confirmation", confirmationHandle);

               if (payload.dialogRepeats)
               {
                  // Create a copy of the original dialog request payload, we'll need it later...
                  var repeatPayload = lang.clone(payload);
               }
               
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
               var formConfig = this.createFormConfig(config, formValue);
               if (config.showValidationErrorsImmediately === false)
               {
                  formConfig.config.showValidationErrorsImmediately = false;
               }
               var dialogConfig = this.createDialogConfig(config, formConfig);
               var dialog = new AlfDialog(dialogConfig);
               this.mapRequestedIdToDialog(payload, dialog);
               this._showDialog(payload, dialog);

               if (config.dialogCloseTopic)
               {
                  var closeHandle = this.alfSubscribe(config.dialogCloseTopic, lang.hitch(this, this.onCloseDialog, dialog));
                  this.mapRequestedIdToHandle(payload, "dialog.close", closeHandle);
               }

               if (payload.dialogRepeats)
               {
                  var repeatSubscriptionTopic = pubSubScope + this._formConfirmationRepeatTopic;
                  var repeatHandle = this.alfSubscribe(repeatSubscriptionTopic, lang.hitch(this, this.repeatFormDialogRequest, repeatPayload, dialog));
                  this.mapRequestedIdToHandle(payload, "dialog.repeat", repeatHandle);
               }
            }
            catch (e)
            {
               this.alfLog("error", "The following error occurred creating a dialog for defined configuration", e, this.dialogConfig, this);
            }
         }
      },

      /**
       * 
       * @instance
       * @param  {object} payload The original payload request
       */
      repeatFormDialogRequest: function alfresco_services_DialogService__repeatFormDialogRequest(repeatPayload, dialog, confirmationPayload) {
         if (repeatPayload.dialogCloseTopic)
         {
            // For the "error path" we want to set up a new subscription to handle the expected success publication
            // (if not previously created) and then forward the confirmationPayload on so that it can be processed...
            if (!this.idToHandleMap[repeatPayload.dialogId || null]["dialog.repeat.close"])
            {
               var handle = this.alfSubscribe(repeatPayload.dialogCloseTopic, lang.hitch(this, this._repeatFormDialogRequestAfterHide, repeatPayload, dialog));
               this.mapRequestedIdToHandle(repeatPayload, "dialog.repeat.close", handle);
            }
            this.onFormDialogConfirmation(confirmationPayload);
         }
         else
         {
            // For the "golden path" we can just publish the confirmation payload and then immediately
            // request a repeat of the dialog. It is up to the developer to ensure that they are validating
            // their form configuration to guarantee a successful publication everytime...
            this.onFormDialogConfirmation(confirmationPayload);
            this._repeatFormDialogRequestAfterHide(repeatPayload, dialog);
         }
      },

      /**
       * When repeating a request for a dialog (the "Create and then create another" paradigm) it is necessary to wait
       * until the previous dialog has been completely hidden before attempting to create another one if there is a
       * fade out animation configured on the dialog.
       *
       * @instance
       * @param {object} payload A copy of the original form dialog creation request
       * @param {object} dialog The dialog that must be fully hidden before the request for a new dialog is made.
       */
      _repeatFormDialogRequestAfterHide: function alfresco_services_DialogService___repeatFormDialogRequestAfterHide(payload, dialog) {
         if (dialog._isShown())
         {
            // If the dialog is still shown then we need to set up an aspect to wait for the dialog to be hidden
            // before we attempt to recreate a dialog with the original configuration...
            var handle = aspect.after(dialog, "onHide", lang.hitch(this, this.onCreateFormDialogRequest, payload));
            this.mapRequestedIdToHandle(payload, "dialog.repeat.hide", handle);
         }
         else
         {
            // ...but if the dialog is already hidden we can just go ahead and recreate it
            this.onCreateFormDialogRequest(payload);
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
         // jshint maxcomplexity:false
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
         var suppressCloseClasses = config.dialogCloseTopic ? ["confirmationButton","confirmAndRepeatButton"]: null,
            dialogId = config.dialogId ? config.dialogId : this.generateUuid();

         var dialogConfig = {
            id: dialogId,
            title: this.message(config.dialogTitle || ""),
            pubSubScope: config.pubSubScope, // Scope the dialog content so that it doesn't pollute any other widgets,,
            duration: config.duration || 0,
            handleOverflow: handleOverflow,
            fixedWidth: fixedWidth,
            fullScreenMode: config.fullScreenMode || false,
            fullScreenPadding: !isNaN(config.fullScreenPadding) ? config.fullScreenPadding : 10,
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
                        id: (config.dialogConfirmationButtonId) ? config.dialogConfirmationButtonId : dialogId + "_OK",
                        label: config.dialogConfirmationButtonTitle,
                        disableOnInvalidControls: true,
                        additionalCssClasses: "confirmationButton call-to-action",
                        publishTopic: this._formConfirmationTopic,
                        publishPayload: {
                           formSubmissionTopic: config.formSubmissionTopic,
                           formSubmissionPayloadMixin: config.formSubmissionPayloadMixin,
                           formSubmissionGlobal: config.formSubmissionGlobal,
                           formSubmissionScope: config.formSubmissionScope,
                           responseScope: config.alfResponseScope
                        }
                     }
                  },
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        id: (config.dialogCancellationButtonId) ? config.dialogCancellationButtonId : dialogId + "_CANCEL",
                        label: config.dialogCancellationButtonTitle,
                        additionalCssClasses: "cancellationButton",
                        publishTopic: this._formCancellationTopic
                     }
                  }
               ]
         };

         if (config.dialogRepeats)
         {
            dialogConfig.widgetsButtons.splice(1,0,{
               name: "alfresco/buttons/AlfButton",
               config: {
                  id: config.dialogConfirmAndRepeatButtonId || (dialogId + "_OK_AND_REPEAT"),
                  label: config.dialogConfirmAndRepeatButtonTitle,
                  disableOnInvalidControls: true,
                  additionalCssClasses: "confirmAndRepeatButton",
                  publishTopic: this._formConfirmationRepeatTopic,
                  publishPayload: {
                     formSubmissionTopic: config.formSubmissionTopic,
                     formSubmissionPayloadMixin: config.formSubmissionPayloadMixin,
                     formSubmissionGlobal: config.formSubmissionGlobal,
                     formSubmissionScope: config.formSubmissionScope,
                     responseScope: config.alfResponseScope
                  }
               }
            });
         }

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
      createFormConfig: function alfresco_services_DialogService__createFormConfig(config, formValue) {
         var formConfig = {
            name: "alfresco/forms/Form",
            config: {
               additionalCssClasses: "root-dialog-form",
               displayButtons: false,
               widgets: config.widgets,
               value: formValue,
               warnings: config.warnings,
               warningsPosition: config.warningsPosition
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
      onFormDialogConfirmation: function alfresco_services_DialogService__onFormDialogConfirmation(payload) {
         if (payload &&
             payload.dialogContent)
         {
            when(payload.dialogContent, lang.hitch(this, function(dialogContent) {
               if (dialogContent && dialogContent.length)
               {
                  var data = {};
                  var formData = dialogContent[0].getValue();

                  // Destroy the dialog if a reference is provided...
                  if (payload.dialogReference && typeof payload.dialogReference.destroyRecursive === "function")
                  {
                     payload.dialogReference.destroyRecursive();
                  }

                  // Mixin in any additional payload information...
                  // An alfResponseScope should always have been set on a payload so it can be set as the
                  // responseScope, but a responseScope in the formSubmissionPayloadMixin will override it
                  lang.mixin(data, {
                     responseScope: payload.alfResponseScope
                  });
                  payload.formSubmissionPayloadMixin && lang.mixin(data, payload.formSubmissionPayloadMixin);

                  // Using JQuery here in order to support deep merging of dot-notation properties...
                  $.extend(true, data, formData);

                  // Publish the topic requested for complete...
                  var customScope;
                  if (payload.formSubmissionScope || payload.formSubmissionScope === "") 
                  {
                     customScope = payload.formSubmissionScope;
                  }
                  
                  var topic = payload.formSubmissionTopic,
                     globalScope = payload.hasOwnProperty("formSubmissionGlobal") ? !!payload.formSubmissionGlobal : true,
                     toParent = false;
                  this.alfPublish(topic, data, globalScope, toParent, customScope);
               }
               else
               {
                  this.alfLog("error", "The format of the dialog content was not as expected, the 'formSubmissionTopic' will not be published", payload, this);
               }
            }));
         }
      },

      /**
       * Show the supplied dialog (also used for adding hooks to the show/hide methods)
       *
       * @instance
       * @param {Object} payload The original request payload
       * @param {Object} dialog The dialog to show
       */
      _showDialog: function alfresco_services_DialogService___showDialog(payload, dialog) {

         // Add to the stack of active dialogs
         this._activeDialogs.push(dialog);

         // Handle cancelling
         this._handleCancellation(payload, dialog);

         // Show the dialog
         dialog.show();

         // Hook up to the dialog hide event
         aspect.after(dialog, "onHide", lang.hitch(this, function() {
            
            // Remove any cancellation topic values
            dialog.cancelPublishTopic = dialog.cancelPublishScope = null;

            // Remove this dialog from the active dialogs stack
            this._activeDialogs = array.filter(this._activeDialogs, function(activeDialog) {
               return activeDialog !== dialog;
            });
         }));
      },

       /**
       * When a cancelTopic has been defined, make sure it's published when the dialog
       * is cancelled (via escape keypress or cross-button click).
       *
       * @instance
       * @param {object} payload The original payload
       * @param {object} dialog The dialog widget
       */
      _handleCancellation: function alfresco_services_DialogService___handleCancellation(payload, dialog) {
         if (payload.cancelPublishTopic) {
            dialog.cancelPublishTopic = payload.cancelPublishTopic;
            dialog.cancelPublishScope = payload.cancelPublishScope || payload.alfResponseScope;
         } else {
            dialog.cancelPublishTopic = dialog.cancelPublishScope = null;
         }
      },

      /**
       * Handle escape key being pressed at the body level
       *
       * @instance
       */
      _handleEscape: function alfresco_services_DialogService___handleEscape() {
         if (this._activeDialogs.length) {
            var lastOpenedDialog = this._activeDialogs[this._activeDialogs.length - 1];
            lastOpenedDialog.onCancel();
         }
      }
   });
});