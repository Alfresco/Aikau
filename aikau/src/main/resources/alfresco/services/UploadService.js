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
 * This service can be used to control the uploading of content as well as the updating the content 
 * of existing nodes on an Alfresco Repository.
 * 
 * @module alfresco/services/UploadService
 * @extends module:alfresco/services/_BaseUploadService
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/_BaseUploadService",
        "alfresco/core/topics",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "dojo/Deferred"],
        function(declare, _BaseUploadService, topics, lang, array, on, Deferred) {

   return declare([_BaseUploadService], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/UploadService.properties"}]
       */
      i18nRequirements: [{
         i18nFile: "./i18n/UploadService.properties"
      }],

      /**
       * An internal reference to the progress dialog button
       *
       * @instance
       * @type {object}
       * @default
       * @since 1.0.52
       */
      dialogButton: null,

      /**
       * This is the default title key for the progress dialog.
       * 
       * @instance
       * @type {string}
       * @default
       * @deprecated since 1.0.52 - Use [uploadsContainerTitle]{@link module:alfresco/services/_BaseUploadService#uploadsContainerTitle} instead
       */
      progressDialogTitleKey: null,

      /**
       * This is the default title for the uploads container.
       *
       * @instance
       * @override
       * @type {string}
       * @default
       */
      uploadsContainerTitle: "progress-dialog.title",

      /**
       * This is the topic on which to publish updates to the title container.
       *
       * @instance
       * @override
       * @type {string}
       * @default
       */
      uploadsContainerTitleUpdateTopic: topics.DIALOG_CHANGE_TITLE,

      /**
       * The buttons to use in the dialog. Note that if this is overridden then be cautious of re-using
       * the "assignTo/assignToScope" properties, and to only use them if you fully understand their
       * purpose.
       *
       * @instance
       * @type {object[]}
       * @since 1.0.57
       */
      widgetsButtons: [
         {
            id: "ALF_UPLOAD_PROGRESS_DIALOG_CANCELLATION",
            name: "alfresco/buttons/AlfButton",
            assignTo: "dialogButton",
            config: {
               label: "progress-dialog.cancel-button.label",
               publishTopic: topics.UPLOAD_CANCELLATION,
               additionalCssClasses: "call-to-action"
            }
         }
      ],

      /**
       * This defines the JSON structure for the widgets to be displayed in the progress dialog. This
       * can be overridden by extending widgets to render a different display in the dialog
       *
       * @instance
       * @type {object}
       * @default
       * @deprecated since 1.0.52 - Use [widgetsForUploadDisplay]{@link module:alfresco/services/UploadService#widgetsForUploadDisplay} instead
       */
      widgetsForProgressDialog: null,

      /**
       * The widget definition that displays the uploads' progress. This should
       * be a single widget that implements the interface defined by
       * [_UploadsDisplayMixin]{@link module:alfresco/services/_UploadsDisplayMixin}.
       *
       * @instance
       * @override
       * @type {object[]}
       * @default [{name: "alfresco/upload/AlfUploadDisplay"}]
       * @since 1.0.52
       */
      widgetsForUploadDisplay: [{
         name: "alfresco/upload/AlfUploadDisplay"
      }],

      /**
       * If a service needs to act upon its post-mixed-in state before registering subscriptions then
       * this is where it should be done. It is comparable to postMixInProperties in a widget in the
       * class lifecycle.
       *
       * @instance
       * @override
       * @since 1.0.52
       */
      initService: function alfresco_services_UploadService__initService() {
         if (!this.widgetsForUploadDisplay && this.widgetsForProgressDialog) {
            this.alfLog("warn", "'widgetsForProgressDialog' in UploadService has been deprecated - use 'widgetsForUploadDisplay' instead");
            this.widgetsForUploadDisplay = this.widgetsForProgressDialog;
         }
         if (this.progressDialogTitleKey) {
            this.alfLog("warn", "'progressDialogTitleKey' in UploadService has been deprecated - use 'uploadsContainerTitle' instead");
            this.uploadsContainerTitle = this.progressDialogTitleKey;
         }
         if (this.widgetsButtons && this.widgetsButtons.length) {
            array.forEach(this.widgetsButtons, function(dialogButton) {
               if(dialogButton.assignTo) {
                  dialogButton.assignToScope = this;
               }
            }, this);
         }
         this.inherited(arguments);
      },

      /**
       * This function generates the title for the progress dialog. By default it simply displays the
       * localized value of the [uploadsContainerTitle]{@link module:alfresco/upload/AlfUpload#uploadsContainerTitle}
       *
       * @instance
       * @return {string} The localized title for the progress dialog
       */
      createProgressDialogTitle: function alfresco_services_UploadService__createProgressDialogTitle() {
         return this.message(this.uploadsContainerTitle);
      },

      /**
       * Handles the user clicking on the "OK" button in the dialog.
       *
       * @instance
       * @param {object} payload The details of the button click.
       */
      onProgressDialogOkClick: function alfresco_services_UploadService__onProgressDialogOkClick( /*jshint unused:false*/ payload) {
         this.onUploadsContainerClosed();
      },

      /**
       * Handles the user clicking on the "Cancel" button in the dialog.
       *
       * @instance
       * @param {object} payload The details of the button click.
       */
      onProgressDialogCancelClick: function alfresco_services_UploadService__onProgressDialogCancelClick( /*jshint unused:false*/ payload) {
         var fileIds = Object.keys(this.fileStore);
         array.forEach(fileIds, function(fileId) {
            var fileInfo = this.fileStore[fileId];
            if (fileInfo && fileInfo.state === this.STATE_UPLOADING) {
               fileInfo.request.abort();
            }
         }, this);
         this.onUploadsContainerClosed();
      },

      /**
       * This listener will be called each time a batch of uploads (grouped by upload request) completes.
       *
       * @instance
       * @override
       * @param {object} payload The payload containing the original upload request
       * @since 1.0.52
       */
      onUploadsBatchComplete: function alfresco_services__BaseUploadService__onUploadsBatchComplete( /*jshint unused:false*/ payload) {
         this.inherited(arguments);
         if (this.dialogButton) {
            this.dialogButton.setLabel(this.message("progress-dialog.ok-button.label"));
            this.dialogButton.publishTopic = topics.UPLOAD_COMPLETION_ACKNOWLEDGEMENT;
         }
      },

      /**
       * Register this service's subscriptions.
       * 
       * @instance
       * @override
       * @listens module:alfresco/core/topics#UPLOAD_COMPLETION_ACKNOWLEDGEMENT
       * @listens module:alfresco/core/topics#UPLOAD_CANCELLATION
       */
      registerSubscriptions: function alfresco_services_FileUploadService__registerSubscriptions() {
         this.inherited(arguments);
         this.alfSubscribe(topics.UPLOAD_COMPLETION_ACKNOWLEDGEMENT, lang.hitch(this, this.onProgressDialogOkClick));
         this.alfSubscribe(topics.UPLOAD_CANCELLATION, lang.hitch(this, this.onProgressDialogCancelClick));
      },

      /**
       * Ensure the uploads display widget is available
       *
       * @instance
       * @returns {object} A promise, that will resolve when the widget is ready to accept upload information.
       * @listens module:alfresco/core/topics#UPLOAD_COMPLETION_ACKNOWLEDGEMENT
       * @listens module:alfresco/core/topics#UPLOAD_CANCELLATION
       */
      showUploadsWidget: function alfresco_services_UploadService__showUploadsWidget() {
         var dfd = new Deferred(),
             dialogDisplayedTopic = "PROGRESS_DIALOG_DISPLAYED",
             displayedSubHandle = this.alfSubscribe(dialogDisplayedTopic, lang.hitch(this, function() {
               this.alfUnsubscribe(displayedSubHandle);
               dfd.resolve();
             }));

         var widgetsForUploadDisplay = this.processWidgetsForUploadDisplay();
         this.alfServicePublish(topics.CREATE_DIALOG, {
            dialogId: "ALF_UPLOAD_PROGRESS_DIALOG",
            dialogTitle: this.createProgressDialogTitle(),
            publishOnShow: [{
               publishTopic: dialogDisplayedTopic
            }],
            widgetsContent: widgetsForUploadDisplay,
            widgetsButtons: this.widgetsButtons
         });
         return dfd.promise;
      }
   });
});