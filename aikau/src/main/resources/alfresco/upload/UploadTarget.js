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
 * @module alfresco/upload/UploadTarget
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 * @since 1.0.34
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/UploadTarget.html",
        "alfresco/documentlibrary/_AlfDndDocumentUploadMixin",
        "alfresco/node/NodeDropTargetMixin",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ObjectProcessingMixin",
        "alfresco/core/Core",
        "alfresco/core/topics",
        "dojo/_base/lang"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, _AlfDndDocumentUploadMixin, NodeDropTargetMixin,
                 CoreWidgetProcessing, ObjectProcessingMixin, Core, topics, lang) {

   return declare([_WidgetBase, _TemplatedMixin, _AlfDndDocumentUploadMixin, NodeDropTargetMixin, ObjectProcessingMixin, 
                   CoreWidgetProcessing, Core], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/UploadTarget.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/UploadTarget.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/UploadTarget.css"}]
       */
      cssRequirements: [{cssFile:"./css/UploadTarget.css"}],
         
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * Override the [inherited function]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#getUploadConfig}
       * to return a configuration object that indicates an overwrite action is required. This will cause the 
       * [onDndUploadDrop]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#onDndUploadDrop} function 
       * to call [publishUpdateRequest]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#publishUpdateRequest}.
       * 
       * @instance
       */
      getUploadConfig: function alfresco_upload_UploadTarget__getUploadConfig() {
         return {
            overwrite: true
         };
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#publishUpdateRequest}
       * to change that publication that is made when files are dragged and dropped onto the widget to render
       * the [widgetsForLocationSelection]{@link module:alfresco/upload/UploadTarget#widgetsForLocationSelection} model in 
       * a dialog.
       *
       * @instance
       * @param {object} uploadConfig The upload configuration.
       * @param {object[]} files The files that have been dragged and dropped onto the widget
       */
      publishUpdateRequest: function alfresco_documentlibrary__AlfDndDocumentUploadMixin__publishUpdateRequest(uploadConfig, files) {
         // Set up a response topic for receiving notifications that the upload has completed...
         var responseTopic = this.generateUuid();
         this._uploadSubHandle = this.alfSubscribe(responseTopic, lang.hitch(this, this.onFileUploadComplete), true);

         // To avoid the issue with processing payloads containing files with native
         // code in them, it is necessary to temporarily store the files in the data model...
         var filesRef = this.generateUuid();
         this.alfSetData(filesRef, files);

         this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
            dialogId: "ALF_UPLOAD_TARGET_DIALOG",
            dialogTitle: "upload.target.dialog.title",
            dialogConfirmationButtonTitle: "upload.target.dialog.confirmation",
            dialogCancellationButtonTitle: "upload.target.dialog.cancellation",
            formSubmissionTopic: "ALF_UPLOAD_REQUEST",
            formSubmissionPayloadMixin: {
               alfResponseTopic: responseTopic,
               filesRefs: filesRef,
               targetData: uploadConfig
            },
            fixedWidth: true,
            widgets: lang.clone(this.widgetsForLocationSelection)
         }, true);
      },

      /**
       * Sets up the widgets DOM element with file drag-and-drop upload capabilities.
       * 
       * @instance
       */
      postCreate: function alfresco_upload_UploadTarget__postCreate() {
         this.inherited(arguments);
         this.addUploadDragAndDrop(this.domNode);
         this.addNodeDropTarget(this.domNode);
         
         // NOTE: A _currentNode needs to be set in order to avoid exceptions
         this._currentNode = {
            nodeRef: null
         };

         this.processWidgets(lang.clone(this.widgetsForButton), this.buttonNode);
      },

      /**
       * The widget model for providing the user with an interface to be displayed in a form dialog
       * for selecting the location to upload files to when they are dragged and dropped onto the 
       * widget.
       * 
       * @instance
       * @type {object[]}
       */
      widgetsForLocationSelection: [
         {
            name: "alfresco/forms/controls/ContainerPicker",
            config: {
               id: "FOLDER_PICKER",
               label: "upload.target.location.picker.label",
               description: "upload.target.location.picker.description",
               name: "targetData.destination",
               requirementConfig: {
                  initialValue: true
               }
            }
         }
      ],

      /**
       * A widget model for requesting both the files to upload as well as the location to upload
       * them to. By default the widget model is just a basic [AlfButton]{@link module:alfresco/buttons/AlfButton}.
       * 
       * @instance
       * @type {object[]}
       */
      widgetsForButton: [
         {
            name: "alfresco/buttons/AlfButton",
            config: {
               label: "upload.target.show.uploader",
               publishTopic: topics.UPLOAD_TO_UNKNOWN_LOCATION,
               publishGlobal: true
            }
         }
      ]
   });
});