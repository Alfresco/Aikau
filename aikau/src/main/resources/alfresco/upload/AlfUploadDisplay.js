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
 * This module provides simple display handling for file uploads. It displays completed, in progress and failed
 * file uploads in separate sections along with a displayed value of the overall upload progress. 
 *
 * @module alfresco/upload/AlfUploadDisplay
 * @extends alfresco/upload/_UploadsDisplayMixin
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["dojo/_base/declare",
        "dojo/text!./templates/AlfUploadDisplay.html",
        "alfresco/core/Core",
        "alfresco/upload/UploadsDisplayInterface",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin", 
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "dojo/dom-construct",
        "dojo/json"], 
        function(declare, template, AlfCore, UploadsDisplayInterface, _WidgetBase, _TemplatedMixin, lang, array, on, domConstruct, dojoJson) {
   
   return declare([UploadsDisplayInterface, _WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfUpload.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfUploadDisplay.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfUpload.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfUploadDisplay.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The description to display for the upload dialog. 
       *
       * @instance
       * @type {string}
       * @default
       */     
      aggregateProgressLabel: "aggregate-progress.label",

      /**
       * The description to display for the upload dialog. 
       *
       * @instance
       * @type {string}
       * @default
       */
      description: "description.label",

      /**
       * The description to display for the upload dialog. 
       *
       * @instance
       * @type {string}
       * @default
       */
      failedUploadsLabel: "failed.label",

      /**
       * A map of file IDs to the DOM element that describes them.
       *
       * @instance
       * @type {object}
       * @default
       */
      inProgressFiles: null,

      /**
       * The description to display for the upload dialog. 
       *
       * @instance
       * @type {string}
       * @default
       */
      successfulUploadsLabel: "completed.label",

      /**
       * The title to display for upload dialog.
       * 
       * @instance
       * @type {string}
       * @default
       */
      title: "title.label",

      /**
       * The description to display for the upload dialog. 
       *
       * @instance
       * @type {string}
       * @default
       */
      uploadsInProgressLabel: "inprogress.label",

      /**
       * A map of the uploaded files.
       *
       * @instance
       * @type {object}
       * @default
       */
      uploadedFiles: null,

      /**
       * Resets the display.
       *
       * @instance
       * @override
       */
      reset: function alfresco_upload_AlfUploadDisplay__reset() {
         this.inProgressFiles = {};
         this.uploadedFiles = {};
         domConstruct.empty(this.successfulItemsNode);
         domConstruct.empty(this.inprogressItemsNode);
         domConstruct.empty(this.failedItemsNode);
      },

      /**
       * Initialise the labels of the dialog if they haven't already been set
       *
       * @instance
       */
      postMixInProperties: function alfresco_upload_AlfUploadDisplay__postMixInProperties() {
         this.title = this.message(this.title);
         this.description = this.message(this.description);
         this.successfulUploadsLabel = this.message(this.successfulUploadsLabel);
         this.uploadsInProgressLabel = this.message(this.uploadsInProgressLabel);
         this.aggregateProgressLabel = this.message(this.aggregateProgressLabel);
         this.failedUploadsLabel = this.message(this.failedUploadsLabel);
      },

      /**
       * @instance
       */
      postCreate: function alfresco_upload_AlfUploadDisplay__postCreate() {
         this.reset();
      },

      /**
       * This function handles displaying a file that an attempt will be made to upload. The
       * [updateUploadProgress]{@link module:alfresco/upload/AlfUploadDisplay#updateUploadProgress}
       * will handle updating the upload progress.
       *
       * @instance
       * @override
       * @param {string} fileId The unique id of the file
       * @pararm {object} file The file requested to be uploaded
       */
      addInProgressFile: function alfesco_upload_AlfUploadDisplay__addInProgressFile(fileId, file) {
         var inProgressFile = domConstruct.create("tr", {
            className: "file"
         }, this.inprogressItemsNode);
         var fileName = domConstruct.create("td", {
            innerHTML: file.name,
            className: "filename"
         }, inProgressFile);
         var percentage = domConstruct.create("td", {
            innerHTML: "0%",
            className: "percentage"
         }, inProgressFile);
         this.inProgressFiles[fileId] = {
            node: inProgressFile,
            fileName: file.name,
            fileNameNode: fileName,
            percentageNode: percentage
         };
      },

      /**
       * This function handles displaying a file that could not be uploaded (where the failure
       * was identified before any attempt was made to start uploading the file).
       *
       * @instance
       * @override
       * @param {string} fileName The name of the file that could not be uploaded
       * @param {object} error The details of why the file could not be uploaded.
       */
      addFailedFile: function alfresco_upload_AlfUploadDisplay__addFailedFile(fileName, error) {
         var failedFile = domConstruct.create("tr", {
            className: "file"
         }, this.failedItemsNode);
         domConstruct.create("td", {
             innerHTML: fileName,
             className: "filename"
         }, failedFile);
         domConstruct.create("td", {
             innerHTML: (error && error.reason) ? error.reason : this.message("unknown.failure.reason"),
             className: "reason"
         }, failedFile);
      },

      /**
       * Updates the displayed progress for an individual file upload.
       *
       * @instance
       * @override
       * @param {string} fileId The unique id of the file
       * @param {number} percentageComplete The current upload progress as a percentage
       */
      updateUploadProgress: function alfresco_upload_AlfUploadDisplay__updateUploadProgress(fileId, percentageComplete) {
         // Set progress position
         // var left = (-400 + ((percentage/100) * 400));
         var inProgressFile = this.inProgressFiles[fileId];
         inProgressFile.percentageNode.innerHTML = percentageComplete + "%";
      },

      /**
       * Displays the overall upload progress of all the files.
       *
       * @instance
       * @override
       * @param {number} aggregateProgress The aggregate progress as a decimal of 1.
       */
      updateAggregateProgress: function alfresco_upload_AlfUploadDisplay__updateAggregateProgress(aggregateProgress) {
         this.aggregateProgressNode.innerHTML = Math.floor(aggregateProgress * 100) + "%";
      },

      /**
       * This function handles the successful completion of a file upload. By default it moves the
       * displayed file from the "In progress" section to the "Completed" section.
       * 
       * @instance
       * @override
       * @param {string} fileId The unique id of the file
       * @param {object} completionEvt The upload completions event
       * @param {object} request The request object used to attempt to upload the file
       */
      handleCompletedUpload: function alfresco_upload_AlfUploadDisplay__handleCompletedUpload(fileId, completionEvt, request) {
         
         // Get the file and update it's progress to 100%...
         var inProgressFile = this.inProgressFiles[fileId];
         inProgressFile.percentageNode.innerHTML = "100%";

         // Move it to the completed upload table...
         domConstruct.place(inProgressFile.node, this.successfulItemsNode, "last");

         // Parse the request to get the information about the resulting nodes that have been created
         // This information could be used to allow actions or links to be generated for the uploaded content
         // before the display is closed...
         if (request && request.responseText)
         {
            var jsonResponse = dojoJson.parse(request.responseText);
            this.uploadedFiles[fileId] = {
               nodeRef: jsonResponse.nodeRef,
               fileName: jsonResponse.fileName
            };
         }
      },

      /**
       * This function handles the failure to upload a file. By default it moves the displayed file
       * from the "In Progress" section to the "Failed" section.
       *
       * @instance
       * @override
       * @param {string} fileId The unique id of the file
       * @param {object} completionEvt The upload completions event
       * @param {object} request The request object used to attempt to upload the file
       */
      handleFailedUpload: function alfresco_upload_AlfUploadDisplay__handleFailedUpload(fileId, failureEvt, request) {
         var inProgressFile = this.inProgressFiles[fileId];
         domConstruct.destroy(inProgressFile.node);

         var reason = this.message("upload.failure.reason.unknown");
         if (request && request.statusText)
         {
            reason = request.statusText;
         }
         this.addFailedFile(inProgressFile.fileName, { reason: reason});
      }
   });
});