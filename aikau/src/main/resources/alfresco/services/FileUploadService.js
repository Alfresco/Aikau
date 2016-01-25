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
 * <p>This service can be used to control the uploading of content as well as
 * the updating the content of existing nodes on an Alfresco Repository.</p>
 * 
 * @module alfresco/services/FileUploadService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/services/_UploadHistoryMixin
 * @author Martin Doyle
 * @since 1.0.52
 */
define(["alfresco/buttons/AlfButton", 
        "alfresco/core/CoreXhr", 
        "alfresco/core/ObjectTypeUtils", 
        "alfresco/core/topics", 
        "alfresco/dialogs/AlfDialog", 
        "alfresco/services/_UploadHistoryMixin", 
        "alfresco/services/BaseService", 
        "dojo/_base/array", 
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/Deferred", 
        "dojo/on", 
        "dojo/promise/all", 
        "service/constants/Default"], 
        function(AlfButton, CoreXhr, ObjectTypeUtils, topics, AlfDialog, _UploadHistoryMixin, BaseService, array, declare, lang, Deferred, on, all, AlfConstants) {

   // Declare and return the class
   return declare([BaseService, CoreXhr, _UploadHistoryMixin], {

      /**
       * The File object (referenced in other JSDoc comments)
       *
       * @instance
       * @typedef {object} File
       * @property {num} progress The current upload-progress as a percentage
       * @property {string} fileName The name of the file
       * @property {string} nodeRef The nodeRef that this file was uploaded to (if successful)
       * @property {object} request The request object used to upload the file
       * @property {num} state The state as per [FileUploadService.state]{@link module:alfresco/services/FileUploadService#state}
       * @property {object} uploadData Information pertaining to the upload itself
       *                               (see [constructUploadData]{@link module:alfresco/services/FileUploadService#constructUploadData})
       * @property {object} _dfd An internal deferred object that is auto-generated and
       *                         will resolve once the upload has finished (successfully
       *                         or unsuccessfully)
       */

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/FileUploadService.properties"}]
       */
      i18nRequirements: [{
         i18nFile: "./i18n/FileUploadService.properties"
      }],

      /**
       * Stores references and state for each file that is in the file list. The fileId
       * parameter from the YAHOO.widget.Uploader is used as the key and the value is a
       * [File object]{@link module:alfresco/FileUploadService#File}.
       *
       * @instance
       * @type {object}
       * @default
       */
      fileStore: null,

      /**
       * The maximum quantity of simultaneous uploads.
       *
       * @instance
       * @type {number}
       * @default
       */
      maxSimultaneousUploads: 1,

      /**
       * A counter for the currently uploading files.
       *
       * @instance
       * @type {number}
       * @default
       */
      numUploadsInProgress: 0,

      /**
       * Enum of upload states (BROWSING not used, but indexes not changed to avoid
       * unexpected reliance errors).
       *
       * @instance
       * @readOnly
       * @type {Object}
       * @property {num} ADDED File has been queued for upload
       * @property {num} UPLOADING File being uploaded
       * @property {num} FINISHED Uploading has finished
       * @property {num} FAILURE Uploading failed
       * @property {num} SUCCESS Uploading succeeded
       */
      state: {
         ADDED: 2,
         UPLOADING: 3,
         FINISHED: 4,
         FAILURE: 5,
         SUCCESS: 6
      },

      /**
       * This state-variable is used to track the current overall progress, and is equal to
       * the number of queued uploads multiplied by 100. This is reset to zero every time
       * all of the queued uploads complete.
       *
       * @instance
       * @type {number}
       * @default
       */
      totalProgressPercent: 0,

      /**
       * The widget that displays the uploads' progress.
       *
       * @instance
       * @type {object}
       * @default
       */
      uploadDisplayWidget: null,

      /**
       * The widget that contains the uploads display widget.
       *
       * @instance
       * @type {object}
       * @default
       */
      uploadsContainer: null,

      /**
       * This is the default title for the uploads container.
       *
       * @instance
       * @type {string}
       * @default
       */
      uploadsContainerTitle: "uploads-container.title",

      /**
       * This is the default title for the uploads container.
       *
       * @instance
       * @type {string}
       * @default
       */
      uploadsContainerTitleComplete: "uploads-container-complete.title",

      /**
       * This is the topic on which to publish updates to the title container.
       *
       * @instance
       * @type {string}
       * @default
       */
      uploadsContainerUpdateTopic: topics.STICKY_PANEL_SET_TITLE,

      /**
       * The topic that this service will listen to, to initiate a file upload.
       * 
       * @instance
       * @type {string}
       * @listens module:alfresco/core/topics#UPLOAD_REQUEST
       * @default
       */
      uploadTopic: topics.UPLOAD_REQUEST,

      /**
       * The widget definition that displays the uploads' progress. This should
       * be a single widget that implements the interface defined by
       * [_UploadsDisplayMixin]{@link module:alfresco/services/_UploadsDisplayMixin}.
       *
       * @instance
       * @type {object[]}
       * @default [{name: "alfresco/upload/UploadMonitor"}]
       */
      widgetsForUploadDisplay: [{
         name: "alfresco/upload/UploadMonitor"
      }],

      /**
       * Check to see whether there are any waiting uploads that can be started (up to the
       * [maxSimultaneousUploads]{@link module:alfresco/services/FileUploadService#maxSimultaneousUploads}).
       *
       * @instance
       */
      checkForWaitingUploads: function alfresco_services_FileUploadService__checkForWaitingUploads() {
         array.forEach(Object.keys(this.fileStore), function(fileId) {
            var fileInfo = this.fileStore[fileId];
            if (fileInfo.state === this.state.ADDED) {
               this.startFileUpload(fileInfo);
            }
         }, this);
      },

      /**
       * Constructs the upload payload object to be added to the fileStore object for each file. 
       * The object constructed is designed to work with the Alfresco REST service for uploading
       * documents. This function can be overridden to support different APIs
       *
       * @instance
       * @param {object} file The file being uploaded
       * @param {object} fileName The name of the file being uploaded
       * @param {object} targetData Information about where and how to upload the data
       */
      constructUploadData: function alfresco_services_FileUploadService__constructUploadData(file, fileName, targetData) {

         // This is to work around the fact that pickers always return an array, even in
         // single item mode - that needs to be better resolved at some point
         var destination = targetData.destination;
         if (destination.constructor === Array) {
            destination = destination[0];
         }
         this.updateHistory(destination);

         // Create object using information defined in payload
         return {
            filedata: file,
            filename: fileName,
            destination: destination,
            siteId: targetData.siteId,
            containerId: targetData.containerId,
            uploaddirectory: targetData.uploadDirectory,
            majorVersion: targetData.majorVersion ? targetData.majorVersion : "true",
            updateNodeRef: targetData.updateNodeRef,
            description: targetData.description,
            overwrite: targetData.overwrite,
            thumbnails: targetData.thumbnails,
            username: targetData.username
         };
      },

      /**
       * Create the file-upload requests.
       *
       * @instance
       * @param {object[]} filesToUpload The files to be uploaded
       * @param {object} targetData The data that identifies where to upload the files to.
       */
      createFileUploadRequests: function alfresco_services_FileUploadService__createFileUploadRequests(filesToUpload, targetData) {

         // Recursively add files to the queue
         var nextFile;
         while ((nextFile = filesToUpload.shift())) {

            // Ensure a unique file ID
            var fileId = "file" + Date.now();
            while (this.fileStore.hasOwnProperty(fileId)) {
               fileId = "file" + Date.now();
            }

            // Add the data to the upload property of XMLHttpRequest so that we can determine which file each
            // progress update relates to (the event argument passed in the progress function does not contain
            // file name details)
            var request = new XMLHttpRequest();
            request.upload._fileData = fileId;

            // Add the event listener functions to the upload properties of the XMLHttpRequest object
            on(request.upload, "progress", lang.hitch(this, this.onUploadProgress, fileId));
            on(request.upload, "load", lang.hitch(this, this.onUploadRequestComplete, fileId));
            on(request.upload, "error", lang.hitch(this, this.onUploadError, fileId));
            on(request.upload, "abort", lang.hitch(this, this.onUploadCancelled, fileId));

            // Construct an object containing the data required for file upload
            // Note that we use .name and NOT .fileName which is non-standard and will break FireFox 7
            var fileName = nextFile.name,
               uploadData = this.constructUploadData(nextFile, fileName, targetData);

            // Add the upload data to the file store
            this.fileStore[fileId] = {
               state: this.state.ADDED,
               fileName: fileName,
               uploadData: uploadData,
               request: request,
               progress: 0
            };

            // Update the display widget with the details of the file that will be uploaded
            this.uploadDisplayWidget.addInProgressFile(fileId, nextFile);

            // Update the total progress percentage
            this.totalProgressPercent += 100;
         }

         // Start uploads
         this.checkForWaitingUploads();
      },

      /**
       * If a service needs to act upon its post-mixed-in state before registering subscriptions then
       * this is where it should be done. It is comparable to postMixInProperties in a widget in the
       * class lifecycle.
       *
       * @instance
       * @override
       */
      initService: function alfresco_services_FileUploadService__initService() {
         var widgets = this.widgetsForUploadDisplay;
         if (widgets && widgets.constructor === Array && widgets.length === 1) {
            lang.mixin(widgets[0], {
               assignTo: "uploadDisplayWidget",
               assignToScope: this
            });
         } else {
            this.alfLog("error", "Must define a widget for displaying upload progress in property 'widgetsForUploadDisplay'");
         }
         this.reset();
      },

      /**
       * Notifies the uploads-display widget that a file could not be uploaded.
       *
       * @instance
       * @param {object} file The invalid file
       */
      notifyOfInvalidFile: function alfresco_services_FileUploadService__notifyOfInvalidFile(file, reason) {
         this.uploadDisplayWidget.addFailedFile(file.name, {
            reason: reason
         });
      },

      /**
       * Handle cancelled upload requests.
       *
       * @instance
       * @param {string} fileId The unique id of the file being uploaded
       * @param {object} evt The cancellation event
       */
      onUploadCancelled: function alfresco_services_FileUploadService__onUploadCancelled( /*jshint unused:false*/ fileId, /*jshint unused:false*/ evt) {
         this.alfLog("warn", "Not yet implemented");
         this.onUploadFinished(fileId);
      },

      /**
       * Handle an error occurring during the upload.
       *
       * @instance
       * @param {string} fileId The unique id of the file being uploaded
       * @param {object} evt The failure event
       */
      onUploadError: function alfresco_services_FileUploadService__onUploadError(fileId, evt) {
         var fileInfo = this.fileStore[fileId];
         if (fileInfo) {
            // Make sure we only update the UI once
            if (fileInfo.state !== this.state.FAILURE) {
               this.processUploadFailure(fileId, evt);
            }
         }
      },

      /**
       * Handler that's called after an upload has finished (in any state)
       *
       * @instance
       * @param {string} fileId The unique id of the file being uploaded
       */
      onUploadFinished: function alfresco_services_FileUploadService__onUploadFinished( /*jshint unused:false*/ fileId) {

         // Resolve the deferred object on the file (used for firing requested topic when uploads complete)
         var fileInfo = this.fileStore[fileId],
            dfd = fileInfo && lang.getObject("uploadData.filedata._dfd", false, fileInfo);
         dfd && dfd.resolve();

         // Update the progress information in the UI
         this.updateAggregateProgress();

         // Decrement the in-progress counter and see if there are more to upload
         this.numUploadsInProgress--;
         this.checkForWaitingUploads();
      },

      /**
       * Handler for the upload request completing.
       * 
       * @instance
       * @param {string} fileId The unique id of the file being uploaded
       * @param {object} evt The success event
       */
      onUploadRequestComplete: function alfresco_services_FileUploadService__onUploadRequestComplete(fileId, evt) {
         var fileInfo = this.fileStore[fileId];
         if (fileInfo) {
            // NOTE: There is an occasional timing issue where the upload completion event fires before the
            // readyState is correctly updated. This means that we can't check the upload actually completed
            // successfully, if this occurs then we'll attach a function to the onreadystatechange extension
            // point and things to catch up before we check everything was ok.
            if (fileInfo.request.readyState !== 4) {
               fileInfo.request.onreadystatechange = lang.hitch(this, function() {
                  if (fileInfo.request.readyState === 4) {
                     this.processUploadCompletion(fileId, evt);
                  }
               });
            } else {
               this.processUploadCompletion(fileId, evt);
            }
         }
      },

      /**
       * This function listens for upload progress events retured from the XMLHttpRequest object and
       * adjusts the display to give a visual indication of how the upload for the related file is
       * progressing.
       * 
       * @instance
       * @param {string} fileId The unique id of the file being uploaded
       * @param {object} evt See [ProgressEvent on MDN]{@link https://developer.mozilla.org/en-US/docs/Web/API/ProgressEvent}
       */
      onUploadProgress: function alfresco_services_FileUploadService__onUploadProgress(fileId, evt) {
         var fileInfo = this.fileStore[fileId];
         if (fileInfo && evt.lengthComputable) {
            var progress = Math.round(evt.loaded / evt.total * 100);
            this.uploadDisplayWidget.updateUploadProgress(fileId, progress, evt);
            fileInfo.progress = progress;
            this.updateAggregateProgress();
         } else {
            this.alfLog("warn", "Unable to update upload progress for file (evt,file)", evt, fileInfo);
         }
      },

      /**
       * The main handler for an upload request.
       * 
       * @instance
       * @param {object} payload The publication payload
       */
      onUploadRequest: function alfresco_services_FileUploadService__onUploadRequest(payload) {

         // A files reference will take precedence over actual files in the payload
         if (lang.exists("filesRefs", payload)) {
            var files = this.alfGetData(payload.filesRefs);
            if (files) {
               payload.files = files;
            }
         }

         // Make sure we have enough information to continue
         if (payload.files && payload.targetData) {

            // Make sure the upload display widget is present
            this.showUploadsWidget().then(lang.hitch(this, function() {

               // Validate the files
               var filesToUpload = this.validateFiles(payload.files);

               // If a response is requested, set it up to fire after all valid uploads finish
               if (payload.alfResponseTopic) {
                  var filePromises = array.map(filesToUpload, function(file) {
                     return (file._dfd = new Deferred()).promise;
                  });
                  all(filePromises).then(lang.hitch(this, function() {
                     this.alfPublish(payload.alfResponseTopic, {}, false, false, payload.alfResponseScope);
                  }));
               }

               // Update the total progress
               this.updateAggregateProgress();

               // Start the uploads
               this.createFileUploadRequests(filesToUpload, payload.targetData);
            }));

         } else {
            this.alfLog("warn", "A request was received to upload files but either no 'files' attribute or no 'targetData' attribute was defined", payload, this);
         }
      },

      /**
       * Handles the closing of the uploads container.
       *
       * @instance
       */
      onUploadsContainerClosed: function alfresco_services_FileUploadService__onUploadsContainerClosed() {
         this.reset();
      },

      /**
       * Called when an upload "load" event fires. This merely means that the
       * server has responded though, so it could still be an error.
       *
       * @instance
       * @param {object} fileId The unique identifier of the file
       * @param {object} evt The completion event
       */
      processUploadCompletion: function alfresco_services_FileUploadService__processUploadCompletion(fileId, evt) {

         // Check the response code
         var fileInfo = this.fileStore[fileId],
            responseCode = fileInfo.request.status,
            successful = responseCode >= 200 && responseCode < 300;

         // Handle according to success
         if (successful) {

            // Get the response and update the file-info object
            var response = JSON.parse(fileInfo.request.responseText);
            fileInfo.nodeRef = response.nodeRef;
            fileInfo.fileName = response.fileName;
            fileInfo.state = this.state.SUCCESS;

            // Notify uploads-display widget of completion
            this.uploadDisplayWidget.handleCompletedUpload(fileId, evt, fileInfo.request);

            // Execute post-upload actions
            this.onUploadFinished(fileId);

         } else {
            this.processUploadFailure(fileId, evt);
         }
      },

      /**
       * Called if a request fails or completes with a non-success status code.
       *
       * @instance 
       * @param {object} fileId The unique identifier of the file
       * @param {object} evt The completion event
       */
      processUploadFailure: function alfresco_services_FileUploadService__processUploadFailure(fileId, evt) {
         var fileInfo = this.fileStore[fileId];
         if (fileInfo) {
            fileInfo.state = this.state.FAILURE;
            this.uploadDisplayWidget.handleFailedUpload(fileId, evt, fileInfo.request);
            this.onUploadFinished(fileId);
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
         this.alfSubscribe(this.uploadTopic, lang.hitch(this, this.onUploadRequest));
         this.alfSubscribe(topics.STICKY_PANEL_CLOSED, lang.hitch(this, this.onUploadsContainerClosed));
      },

      /**
       * <p>Reset the state of the service.</p>
       *
       * <p><strong>NOTE:</strong> This does not cancel any in-progress uploads.</p>
       *
       * @instance
       */
      reset: function alfresco_services_FileUploadService__reset() {
         this.fileStore = {};
      },

      /**
       * Ensure the uploads display widget is available
       *
       * @instance
       */
      showUploadsWidget: function alfresco_services_FileUploadService__showUploadsWidget() {
         var dfd = new Deferred();
         this.alfServicePublish(topics.DISPLAY_STICKY_PANEL, {
            title: this.message(this.uploadsContainerTitle, 0),
            padding: 0,
            widgets: this.widgetsForUploadDisplay,
            callback: lang.hitch(this, function(panel) {
               this.uploadsContainer = panel;
               dfd.resolve();
            })
         });
         return dfd.promise;
      },

      /**
       * Starts the actual upload for a file
       *
       * @instance
       * @param {object} Contains info about the file and its request.
       */
      startFileUpload: function alfresco_services_FileUploadService__startFileUpload(fileInfo) {

         // Ensure we only upload the maximum allowed at a time
         if (this.numUploadsInProgress === this.maxSimultaneousUploads) {
            return;
         }

         // Increment uploads counter
         this.numUploadsInProgress++;

         // Mark file as being uploaded
         fileInfo.state = this.state.UPLOADING;

         var url = AlfConstants.PROXY_URI + (this.uploadURL || "api/upload");
         if (this.isCsrfFilterEnabled()) {
            url += "?" + this.getCsrfParameter() + "=" + encodeURIComponent(this.getCsrfToken());
         }

         // Setup the form data object
         // NOTE: This is IE10+ but code is unchanged from existing UploadService, so maybe there's a hidden polyfill somewhere
         var formData = new FormData();
         formData.append("filedata", fileInfo.uploadData.filedata);
         formData.append("filename", fileInfo.uploadData.filename);
         formData.append("destination", fileInfo.uploadData.destination);
         formData.append("siteId", fileInfo.uploadData.siteId);
         formData.append("containerId", fileInfo.uploadData.containerId);
         formData.append("uploaddirectory", fileInfo.uploadData.uploaddirectory);
         formData.append("majorVersion", fileInfo.uploadData.majorVersion ? fileInfo.uploadData.majorVersion : "false");
         formData.append("username", fileInfo.uploadData.username);
         formData.append("overwrite", fileInfo.uploadData.overwrite);
         formData.append("thumbnails", fileInfo.uploadData.thumbnails);
         if (fileInfo.uploadData.updateNodeRef) {
            formData.append("updateNodeRef", fileInfo.uploadData.updateNodeRef);
         }
         if (fileInfo.uploadData.description) {
            formData.append("description", fileInfo.uploadData.description);
         }

         // Open and send the request
         fileInfo.request.open("POST", url, true);
         fileInfo.request.send(formData);
      },

      /**
       * Calculates the overall progress of all the uploads and calls the display widget with the data.
       *
       * @instance
       */
      updateAggregateProgress: function alfresco_services_FileUploadService__updateAggregateProgress() {

         // Setup variables
         var fileIds = Object.keys(this.fileStore),
            stillUploading = false,
            cumulativeProgress = 0;

         // Run through all uploads, calculating total and current progress
         // NOTE: We don't include failed/completed uploads
         array.forEach(fileIds, function(fileId) {
            var fileInfo = this.fileStore[fileId];
            switch (fileInfo.state) {
               case this.state.ADDED:
               case this.state.UPLOADING:
                  cumulativeProgress += fileInfo.progress;
                  stillUploading = true;
                  break;
               default:
                  cumulativeProgress += 100;
            }
         }, this);

         // Calculate total percentage and send to widget
         var currentProgress = (cumulativeProgress / this.totalProgressPercent * 100) % 100, // Using modulus to cope with multiple batches
            currentProgressPercent = stillUploading ? Math.round(currentProgress) : 100;
         this.uploadDisplayWidget.updateAggregateProgress(currentProgressPercent);

         // If no longer have uploads pending, reset the total progress counter
         if (!stillUploading) {
            this.totalProgressPercent = 0;
         }

         // Update the container title with the aggregate progress if possible
         var title = this.message(this.uploadsContainerTitle, currentProgressPercent);
         if (currentProgressPercent === 100) {
            title = this.message(this.uploadsContainerTitleComplete);
         }
         this.uploadsContainerUpdateTopic && this.alfPublish(this.uploadsContainerUpdateTopic, {
            title: title
         });
      },

      /**
       * Validate a single file, throwing an exception if it fails.
       *
       * @instance
       * @param {object} file The file
       */
      validateFile: function alfresco_services_FileUploadService__validateFile(file) {
         if (file.size === 0) {
            throw new Error(this.message("upload.error.empty-file"));
         }
      },

      /**
       * Validate the supplied collection of files, sending a notification of any invalid ones, and returning the valid ones.
       *
       * @instance
       * @param {object[]} files The files
       * @returns {object[]} The valid files
       */
      validateFiles: function alfresco_services_FileUploadService__validateFiles(files) {
         return array.filter(files, function(file) {
            try {
               this.validateFile(file);
               return true;
            } catch (e) {
               this.notifyOfInvalidFile(file, e.message);
            }
         }, this);
      }
   });
});