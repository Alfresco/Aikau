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
 * This module provides display handling for file uploads. It's normally only used by the
 * [UploadService]{@link module:alfresco/services/UploadService}.
 *
 * @module alfresco/upload/UploadMonitor
 * @extends alfresco/upload/_UploadsDisplayMixin
 * @mixes alfresco/core/FileSizeMixin
 * @author Martin Doyle
 * @since 1.0.50
 */
define(["alfresco/core/FileSizeMixin",
        "alfresco/upload/_UploadsDisplayMixin", 
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/dom-class", 
        "dojo/dom-construct", 
        "dojo/text!./templates/UploadMonitor.html"], 
        function(FileSizeMixin, _UploadsDisplayMixin, declare, lang, domClass, domConstruct, template) {

   return declare([FileSizeMixin, _UploadsDisplayMixin], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/UploadMonitor.properties"}]
       */
      i18nRequirements: [{
         i18nFile: "./i18n/UploadMonitor.properties"
      }, {
         i18nFile: "alfresco/renderers/i18n/Size.properties"
      }],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/UploadMonitor.css"}]
       */
      cssRequirements: [{
         cssFile: "./css/UploadMonitor.css"
      }],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The constant representing the base BEM CSS class for this widget.
       *
       * @instance
       * @readOnly
       * @type {string}
       * @default
       */
      baseClass: "alfresco-upload-UploadMonitor",

      /**
       * Whether to display the upload percentage against each item.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      displayUploadPercentage: true,

      /**
       * The maximum length of the upload name (in characters) after which it will be truncated.
       *
       * @instance
       * @type {number}
       * @default
       */
      maxUploadNameLength: 50,

      /**
       * A map of all uploads.
       *
       * @instance
       * @type {object}
       * @default
       */
      _uploads: null,

      /**
       * Constructor
       *
       * @instance
       */
      constructor: function alfesco_upload_UploadMonitor__constructor() {
         this._uploads = {};
      },

      /**
       * This function handles displaying a file that an attempt will be made to upload. The
       * [updateUploadProgress function]{@link module:alfresco/upload/_UploadsDisplayMixin#updateUploadProgress}
       * will handle updating the upload progress.
       *
       * @instance
       * @override
       * @param {string} fileId The unique id of the file
       * @pararm {object} file The file requested to be uploaded
       */
      addInProgressFile: function alfesco_upload_UploadMonitor__addInProgressFile(fileId, file) {

         // Add new row
         var itemRow = domConstruct.create("tr", {
               className: this.baseClass + "__item"
            }, this.inProgressItemsNode, "first"),
            itemName = domConstruct.create("td", {
               className: this.baseClass + "__item__name"
            }, itemRow),
            itemNameContent = domConstruct.create("div", {
               className: this.baseClass + "__item__name__content",
               textContent: this.getDisplayText(file)
            }, itemName),
            itemNameError = domConstruct.create("div", {
               className: this.baseClass + "__item__name__error"
            }, itemName),
            itemProgress = domConstruct.create("td", {
               className: this.baseClass + "__item__progress"
            }, itemRow),
            itemProgressContent = domConstruct.create("span", {
               className: this.baseClass + "__item__progress__content",
               textContent: this.displayUploadPercentage ? "0%" : ""
            }, itemProgress),
            itemStatus = domConstruct.create("td", {
               className: this.baseClass + "__item__status"
            }, itemRow);

         // Add localised status messages
         domConstruct.create("span", {
            className: this.baseClass + "__item__status__in-progress",
            textContent: this.message("upload.status.in-progress")
         }, itemStatus);
         domConstruct.create("span", {
            className: this.baseClass + "__item__status__successful",
            textContent: this.message("upload.status.successful")
         }, itemStatus);
         domConstruct.create("span", {
            className: this.baseClass + "__item__status__unsuccessful",
            textContent: this.message("upload.status.unsuccessful")
         }, itemStatus);

         // Store in uploads map
         this._uploads[fileId] = {
            id: fileId,
            file: file,
            nodes: {
               row: itemRow,
               name: itemNameContent,
               error: itemNameError,
               progress: itemProgressContent
            }
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
      addFailedFile: function alfesco_upload_UploadMonitor__addFailedFile(fileName, error) {
         var uniqueFileId = fileName + Date.now();
         while (this._uploads.hasOwnProperty(uniqueFileId)) {
            uniqueFileId = fileName + Date.now();
         }
         this.addInProgressFile(uniqueFileId, {
            name: fileName
         });
         this.handleFailedUpload(uniqueFileId, null, {
            statusText: error.reason
         });
      },

      /**
       * Create the display name of the upload, including the file size
       *
       * @instance
       * @param {object} file The upload file
       * @returns {string} The name of the upload to be deisplayed
       */
      getDisplayText: function alfesco_upload_UploadMonitor__getDisplayText(file) {

         // Create upload name as "filename.ext, xxx kB"
         var filename = file.name,
            filesize = this.formatFileSize(file.size || 0, 1),
            separator = ", ",
            uploadName = filename + separator + filesize;

         // If filename is too long, adjust
         if (uploadName.length > this.maxUploadNameLength) {

            // Calculate how long name can be
            var maxNameLength = this.maxUploadNameLength - filesize.length - separator.length;

            // Create suffix if there's a detectable extension on the filename
            var suffix = "",
               lastDotIndex;
            if ((lastDotIndex = filename.lastIndexOf(".")) !== -1) {
               suffix = filename.substring(lastDotIndex);
               filename = filename.substring(0, lastDotIndex);
               maxNameLength -= suffix.length;
            }

            // Remove the middle of the filename to meet the max length with an ellipsis in it
            var numLetters = Math.floor(maxNameLength / 2);
            filename = filename.substring(0, numLetters) + "..." + filename.substring(filename.length - numLetters);

            // Reconstruct the upload name
            uploadName = filename + suffix + separator + filesize;
         }

         // Pass back the final value
         return uploadName;
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
      handleCompletedUpload: function alfesco_upload_UploadMonitor__handleCompletedUpload(fileId, /*jshint unused:false*/ completionEvt, /*jshint unused:false*/ request) {
         var upload = this._uploads[fileId];
         if (upload) {

            // Mark as completed and move to successful section
            upload.completed = true;
            upload.nodes.progress.textContent = this.displayUploadPercentage ? "100%" : "";
            domConstruct.place(upload.nodes.row, this.successfulItemsNode, "first");

            // Parse the request to get the information about the resulting nodes that have been created
            // This information could be used to allow actions or links to be generated for the uploaded content
            // before the display is closed...
            if (request && request.responseText) {
               var jsonResponse = JSON.parse(request.responseText);
               lang.mixin(upload, {
                  nodeRef: jsonResponse.nodeRef,
                  fileName: jsonResponse.fileName
               });
            }
         } else {
            this.alfLog("warn", "Attempt to mark as complete an upload that is not being tracked (id=" + fileId + ")");
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
      handleFailedUpload: function alfesco_upload_UploadMonitor__handleFailedUpload(fileId, /*jshint unused:false*/ failureEvt, request) {
         var upload = this._uploads[fileId];
         if (upload) {
            upload.completed = true;
            domConstruct.place(upload.nodes.row, this.unsuccessfulItemsNode, "first");
            upload.nodes.error.textContent = (request && request.statusText) || this.message("upload.failure.unknown-reason");
            domClass.add(upload.nodes.row, this.baseClass + "__item--has-error");
         } else {
            this.alfLog("warn", "Attempt to mark as failed an upload that is not being tracked (id=" + fileId + ")");
         }
      },

      /**
       * Resets the display.
       *
       * @instance
       * @override
       */
      reset: function alfresco_upload_AlfUploadDisplay__reset() {
         this.uploads = {};
         domConstruct.empty(this.inProgressItemsNode);
         domConstruct.empty(this.successfulItemsNode);
         domConstruct.empty(this.unsuccessfulItemsNode);
      },

      /**
       * Displays the overall upload progress of all the files.
       *
       * @instance
       * @override
       * @param {number} aggregateProgress The aggregate progress as a decimal of 1.
       */
      updateAggregateProgress: function alfesco_upload_UploadMonitor__updateAggregateProgress( /*jshint unused:false*/ aggregateProgress) {
         // NOOP currently
      },

      /**
       * Updates the displayed progress for an individual file upload.
       *
       * @instance
       * @override
       * @param {string} fileId The unique id of the file
       * @param {number} percentageComplete The current upload progress as a percentage
       * @param {object} progressEvt The progress event
       */
      updateUploadProgress: function alfesco_upload_UploadMonitor__updateUploadProgress(fileId, percentageComplete, /*jshint unused:false*/ progressEvt) {
         if (!this.displayUploadPercentage) {
            return;
         }
         var upload = this._uploads[fileId];
         if (upload) {
            if (!upload.completed) {
               upload.nodes.progress.textContent = percentageComplete + "%";
            }
         } else {
            this.alfLog("warn", "Attempt to update upload that is not being tracked (id=" + fileId + ")");
         }
      }
   });
});