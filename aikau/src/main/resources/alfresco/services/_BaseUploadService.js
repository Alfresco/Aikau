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
 * @module alfresco/services/_BaseUploadService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/services/_UploadHistoryServiceMixin
 * @author Martin Doyle
 * @since 1.0.52
 */
define(["alfresco/core/CoreXhr", 
        "alfresco/core/topics", 
        "alfresco/services/_UploadHistoryServiceMixin", 
        "alfresco/services/BaseService", 
        "dojo/_base/array", 
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/Deferred", 
        "dojo/on", 
        "dojo/promise/all", 
        "service/constants/Default"], 
        function(CoreXhr, topics, _UploadHistoryServiceMixin, BaseService, array, declare, lang, Deferred, on, all, AlfConstants) {

   // Declare and return the class
   return declare([BaseService, CoreXhr, _UploadHistoryServiceMixin], {

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
       * @default [{i18nFile: "./i18n/_BaseUploadService.properties"}]
       */
      i18nRequirements: [{
         i18nFile: "./i18n/_BaseUploadService.properties"
      }],

      /**
       * The Alfresco repository features multiple upload REST APIs. Up to and including version 5.1 of Alfresco
       * supports the "version zero" REST API (also known as Share Services API) for Upload. In addition post 5.1
       * there is a "version one" Public Upload API also. Set this value to 1 to use the new version one API, else
       * the classic v0 API will be used and Share Services AMP must be applied to the repository.
       *
       * @instance
       * @type {number}
       * @default
       * @since 1.0.55
       */
      apiVersion: 0,

      /**
       * Stores references and state for each file that is in the file list. The fileId is used as
       * the key and the value is a [File object]{@link module:alfresco/services/_BaseUploadService#File}.
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
       * The user is browsing and adding files to the file list
       *
       * @instance
       * @type {number}
       * @default
       */
      STATE_BROWSING: 1,

      /**
       * File(s) is been added
       *
       * @instance
       * @type {number}
       * @default
       */
      STATE_ADDED: 2,

      /**
       * File(s) is being uploaded to the server
       *
       * @instance
       * @type {number}
       * @default
       */
      STATE_UPLOADING: 3,

      /**
       * All files are processed and have either failed or been successfully
       * uploaded to the server.
       *
       * @instance
       * @type {number}
       * @default
       */
      STATE_FINISHED: 4,

      /**
       * File failed to upload.
       *
       * @instance
       * @type {number}
       * @default
       */
      STATE_FAILURE: 5,

      /**
       * File was successfully STATE_SUCCESS.
       *
       * @instance
       * @type {number}
       * @default
       */
      STATE_SUCCESS: 6,

      /**
       * This state-variable is used to track the current overall progress, and is equal to
       * the number of "in progress" uploads. This is incremented by the number of files in
       * an upload-request, and reset once all of the files have either been uploaded or
       * failed to upload.
       *
       * @instance
       * @type {number}
       * @default
       */
      totalNewUploads: 0,

      /**
       * The widget that displays the uploads' progress.
       *
       * @instance
       * @type {object}
       * @default
       */
      uploadDisplayWidget: null,

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
      uploadsContainerTitleComplete: "uploads-container.title-complete",

      /**
       * This is the topic on which to publish updates to the title container.
       *
       * @instance
       * @type {string}
       * @default
       */
      uploadsContainerTitleUpdateTopic: null,

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
       * The location of the upload endpoint, used when using an
       * [apiVersion]{@link module:alfresco/services/_BaseUploadService#apiVersion} of 0.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.55
       */
      uploadURL: "api/upload",

      /**
       * The widget definition that displays the uploads' progress. This should
       * be a single widget that implements the interface defined by
       * [_UploadsDisplayMixin]{@link module:alfresco/services/_UploadsDisplayMixin}.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgetsForUploadDisplay: null,

      /**
       * An internal counter for the currently uploading files.
       *
       * @instance
       * @type {number}
       * @default
       */
      _numUploadsInProgress: 0,

      /**
       * If a service needs to act upon its post-mixed-in state before registering subscriptions then
       * this is where it should be done. It is comparable to postMixInProperties in a widget in the
       * class lifecycle.
       *
       * @instance
       * @override
       */
      initService: function alfresco_services__BaseUploadService__initService() {
         this.inherited(arguments);
         this.reset();
      },

      /**
       * Notifies the uploads-display widget that a file could not be uploaded.
       *
       * @instance
       * @param {object} file The invalid file
       */
      addInvalidFile: function alfresco_services__BaseUploadService__addInvalidFile(file, reason) {
         var reasonMessage = reason || this.message("upload.error.reason-unknown");
         this.uploadDisplayWidget.addFailedFile(file.name, {
            reason: reasonMessage
         });
      },

      /**
       * Handle cancelled upload requests.
       *
       * @instance
       * @param {string} fileId The unique id of the file being uploaded
       * @param {object} evt The cancellation event
       */
      cancelListener: function alfresco_services__BaseUploadService__cancelListener(/*jshint unused:false*/ fileId, /*jshint unused:false*/ evt) {
         this.failureListener.apply(this, arguments); // Defer directly to the failure listener
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
      constructUploadData: function alfresco_services__BaseUploadService__constructUploadData(file, fileName, targetData) {

         // This is to work around the fact that pickers always return an array, even in
         // single item mode - that needs to be better resolved at some point
         var destination = targetData.destination;
         if (destination.constructor === Array) {
            destination = destination[0];
         }
         this.updateUploadHistory(destination);

         // Create object using information defined in payload
         return {
            filedata: file,
            filename: fileName,
            destination: destination,
            siteId: targetData.siteId,
            containerId: targetData.containerId,
            uploaddirectory: targetData.uploadDirectory || file.relativePath || null,
            majorVersion: targetData.majorVersion ? targetData.majorVersion : "true",
            updateNodeRef: targetData.updateNodeRef,
            description: targetData.description,
            overwrite: targetData.overwrite,
            thumbnails: targetData.thumbnails,
            username: targetData.username
         };
      },

      /**
       * Handle an error occurring during the upload.
       *
       * @instance
       * @param {string} fileId The unique id of the file being uploaded
       * @param {object} evt The failure event
       */
      failureListener: function alfresco_services__BaseUploadService__failureListener(fileId, evt) {
         var fileInfo = this.fileStore[fileId];
         if (fileInfo) {
            // Make sure we only update the UI once
            if (fileInfo.state !== this.STATE_FAILURE) {
               this.processUploadFailure(fileId, evt);
            }
         }
      },

      /**
       * Cancel the specified upload.
       *
       * @instance
       * @param {object} payload The publication payload
       * @since 1.0.56
       */
      onUploadCancelRequest: function alfresco_services__BaseUploadService__onUploadCancelRequest(payload) {
         var uploadId = payload && payload.uploadId,
            fileInfo = this.fileStore[uploadId];
         if (fileInfo) {
            try {
               if (fileInfo.progress === 0) {
                  fileInfo.request = { // Manually force status of 0 to notify of cancellation
                     status: 0
                  };
                  this.failureListener(uploadId); // Manually call the failure listener for this file
               } else {
                  fileInfo.request.abort();
               }
            } catch (e) {
               this.alfLog("info", "Unable to cancel upload: ", fileInfo, e);
            }
         }
      },

      /**
       * Handler that's called after an upload has finished (in any state)
       *
       * @instance
       * @param {string} fileId The unique id of the file being uploaded
       */
      onUploadFinished: function alfresco_services__BaseUploadService__onUploadFinished( /*jshint unused:false*/ fileId) {

         // Resolve the deferred object on the file (used for firing requested topic when uploads complete)
         var fileInfo = this.fileStore[fileId],
            dfd = fileInfo && lang.getObject("uploadData.filedata._dfd", false, fileInfo);
         dfd && dfd.resolve();

         // Update the progress information in the UI
         this.updateAggregateProgress();

         // Decrement the in-progress counter and see if there are more to upload
         this._numUploadsInProgress--;
         this.spawnFileUploads();
      },

      /**
       * The main handler for an upload request.
       * 
       * @instance
       * @param {object} payload The publication payload
       */
      onUploadRequest: function alfresco_services__BaseUploadService__onUploadRequest(payload) {

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

               // After the files are uploaded, call any final actions
               var filePromises = array.map(filesToUpload, function(file) {
                  return (file._dfd = new Deferred()).promise;
               });
               all(filePromises).then(lang.hitch(this, function() {
                  this.onUploadsBatchComplete(payload);
               }));

               // Update the total number of in-progress files
               this.totalNewUploads += filesToUpload.length;

               // Start the uploads
               this.startFileUploads(filesToUpload, payload.targetData);

               // Update the total progress
               this.updateAggregateProgress();
            }));

         } else {
            this.alfLog("warn", "A request was received to upload files but either no 'files' attribute or no 'targetData' attribute was defined", payload, this);
         }
      },

      /**
       * This listener will be called each time a batch of uploads (grouped by upload request) completes.
       *
       * @instance
       * @param {object} payload The payload containing the original upload request
       */
      onUploadsBatchComplete: function alfresco_services__BaseUploadService__onUploadsBatchComplete(payload) {
         if (payload.alfResponseTopic) {
            this.alfPublish(payload.alfResponseTopic, {
               responseScope: payload.alfResponseScope
            }, true);
         }
      },

      /**
       * Handles the closing of the uploads container.
       *
       * @instance
       */
      onUploadsContainerClosed: function alfresco_services__BaseUploadService__onUploadsContainerClosed() {
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
      processUploadCompletion: function alfresco_services__BaseUploadService__processUploadCompletion(fileId, evt) {

         // Check the response code
         var fileInfo = this.fileStore[fileId],
            responseCode = fileInfo.request.status,
            successful = responseCode >= 200 && responseCode < 300;

         // Handle according to success
         if (successful) {

            // Get the response and update the file-info object
            var response = JSON.parse(fileInfo.request.responseText);
            switch (this.apiVersion)
            {
               case 0:
               {
                  fileInfo.nodeRef = response.nodeRef;
                  fileInfo.fileName = response.fileName;
                  fileInfo.state = this.STATE_SUCCESS;
                  break;
               }
               case 1:
               {
                  fileInfo.nodeRef = "workspace://SpacesStore/" + response.id;
                  fileInfo.fileName = response.name;
                  fileInfo.state = this.STATE_SUCCESS;
                  break;
               }
               default:
                  this.alfLog("error", "Unknown Upload API version specified: " + this.apiVersion);
            }

            // Notify uploads-display widget of completion
            this.uploadDisplayWidget.handleCompletedUpload(fileId, evt, fileInfo.request);

            // Execute post-upload actions
            this.onUploadFinished(fileId);
         }
         else {
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
      processUploadFailure: function alfresco_services__BaseUploadService__processUploadFailure(fileId, evt) {
         var fileInfo = this.fileStore[fileId];
         if (fileInfo) {
            fileInfo.state = this.STATE_FAILURE;
            this.uploadDisplayWidget.handleFailedUpload(fileId, evt, fileInfo.request);
            this.onUploadFinished(fileId);
         }
      },

      /**
       * This function can be called when creating the upload display. It ensures that the root widget is correctly
       * configured to be assigned to the [widgetsForUploadDisplay]{@link module:alfresco/services/_BaseUploadService#widgetsForUploadDisplay}
       * reference. Care should be taken When overriding the 
       * [showUploadsWidget]{@link module:alfresco/services/_BaseUploadService#showUploadsWidget} to ensure that any model
       * is correctly setup by calling this function.
       * 
       * @return {object[]} The object model for rendering the upload display
       * @instance 1.0.57
       */
      processWidgetsForUploadDisplay: function alfresco_services__BaseUploadService__processWidgetsForUploadDisplay() {
         var widgets = lang.clone(this.widgetsForUploadDisplay);
         if (widgets && widgets.constructor === Array && widgets.length === 1) {
            lang.mixin(widgets[0], {
               assignTo: "uploadDisplayWidget",
               assignToScope: this
            });
         } 
         else {
            this.alfLog("error", "Must define a widget for displaying upload progress in property 'widgetsForUploadDisplay'");
         }
         return widgets;
      },

      /**
       * Register this service's subscriptions.
       * 
       * @instance
       * @override
       * @listens module:alfresco/core/topics#UPLOAD_REQUEST
       */
      registerSubscriptions: function alfresco_services_FileUploadService__registerSubscriptions() {
         this.alfSubscribe(topics.UPLOAD_REQUEST, lang.hitch(this, this.onUploadRequest));
         this.alfSubscribe(topics.CANCEL_INPROGRESS_UPLOAD, lang.hitch(this, this.onUploadCancelRequest));
      },

      /**
       * <p>Reset the state of the service.</p>
       *
       * <p><strong>NOTE:</strong> This does not cancel any in-progress uploads.</p>
       *
       * @instance
       */
      reset: function alfresco_services__BaseUploadService__reset() {
         this.fileStore = {};
         this.uploadDisplayWidget && this.uploadDisplayWidget.reset();
      },

      /**
       * This function is called when all uploads have completed and resets the
       * [totalNewUploads counter]{@link module:alfresco/services/_BaseUploadService#totalNewUploads}
       * to zero.
       * 
       * @instance
       * @since 1.0.54
       * @extendable
       */
      resetTotalUploads: function alfresco_services__BaseUploadService__resetTotalUploads() {
         this.totalNewUploads = 0;
      },

      /**
       * Ensure the uploads display widget is available
       *
       * @instance
       * @returns {object} A promise, that will resolve when the widget is ready to accept upload information.
       */
      showUploadsWidget: function alfresco_services__BaseUploadService__showUploadsWidget() {
         throw new Error("Method not overridden in extending class");
      },

      /**
       * Check to see whether there are any waiting uploads that can be started (up to the
       * [maxSimultaneousUploads]{@link module:alfresco/services/FileUploadService#maxSimultaneousUploads}).
       *
       * @instance
       */
      spawnFileUploads: function alfresco_services__BaseUploadService__spawnFileUploads() {
         array.forEach(Object.keys(this.fileStore), function(fileId) {
            var fileInfo = this.fileStore[fileId];
            if (fileInfo.state === this.STATE_ADDED) {
               this.startFileUpload(fileInfo);
            }
         }, this);
      },

      /**
       * Starts the actual upload for a file
       *
       * @instance
       * @param {object} Contains info about the file and its request.
       */
      startFileUpload: function alfresco_services__BaseUploadService__startFileUpload(fileInfo) {
         /*jshint maxstatements:false,maxcomplexity:false*/

         // Ensure we only upload the maximum allowed at a time
         if (this._numUploadsInProgress === this.maxSimultaneousUploads) {
            return;
         }

         // Increment uploads counter
         this._numUploadsInProgress++;

         // Mark file as being uploaded
         fileInfo.state = this.STATE_UPLOADING;

         // Setup variables
         var formData = new FormData(),
            uploadData = fileInfo.uploadData,
            url;

         // resolve final API URL and Form structure based on configuration and apiVersion setting
         switch (this.apiVersion)
         {
            case 0:
            {
               // Set-up the API URL
               url = AlfConstants.PROXY_URI + this.uploadURL;
               if (this.isCsrfFilterEnabled()) {
                  url += "?" + this.getCsrfParameter() + "=" + encodeURIComponent(this.getCsrfToken());
               }
               
               // Set-up the form data object
               formData.append("filedata", uploadData.filedata);
               formData.append("filename", uploadData.filename);
               formData.append("destination", uploadData.destination);
               formData.append("siteId", uploadData.siteId);
               formData.append("containerId", uploadData.containerId);
               formData.append("uploaddirectory", uploadData.uploaddirectory);
               formData.append("majorVersion", uploadData.majorVersion ? uploadData.majorVersion : "false");
               formData.append("username", uploadData.username);
               formData.append("overwrite", uploadData.overwrite);
               formData.append("thumbnails", uploadData.thumbnails);
               if (uploadData.updateNodeRef) {
                  formData.append("updateNodeRef", uploadData.updateNodeRef);
               }
               if (uploadData.description) {
                  formData.append("description", uploadData.description);
               }
               
               break;
            }
            
            case 1:
            {
               // Set-up the API URL
               url = AlfConstants.PROXY_URI + "public/alfresco/versions/1/nodes/{nodeId}/children";
               // extract node id only from expected NodeRef
               url = lang.replace(url, {
                  nodeId: uploadData.destination.split("/")[3]
               });
               if (this.isCsrfFilterEnabled()) {
                  url += "?" + this.getCsrfParameter() + "=" + encodeURIComponent(this.getCsrfToken());
               }
               
               // Set-up the form data object
               formData.append("fileData", uploadData.filedata);
               formData.append("fileName", uploadData.filename);
               formData.append("autoRename", !uploadData.overwrite);
               if (uploadData.thumbnails) {
                  formData.append("renditions", uploadData.thumbnails);
               }
               if (uploadData.uploaddirectory) {
                  formData.append("relativePath", uploadData.uploaddirectory);
               }
               
               break;
            }
            
            default:
               this.alfLog("error", "Unknown Upload API version specified: " + this.apiVersion);
         }
         
         // Open and send the request
         if (url)
         {
            fileInfo.request.open("POST", url, true);
            fileInfo.request.send(formData);
         }
      },

      /**
       * Create the file-upload requests.
       *
       * @instance
       * @param {object[]} filesToUpload The files to be uploaded
       * @param {object} targetData The data that identifies where to upload the files to.
       */
      startFileUploads: function alfresco_services__BaseUploadService__startFileUploads(filesToUpload, targetData) {

         // Recursively add files to the queue
         var nextFile;
         while ((nextFile = filesToUpload.shift())) {

            // Ensure a unique file ID
            var fileId = Date.now();
            while (this.fileStore.hasOwnProperty(fileId)) {
               fileId = Date.now();
            }

            // Add the data to the upload property of XMLHttpRequest so that we can determine which file each
            // progress update relates to (the event argument passed in the progress function does not contain
            // file name details)
            var request = new XMLHttpRequest();
            request.upload._fileData = fileId;

            // Add the event listener functions to the upload properties of the XMLHttpRequest object
            on(request.upload, "progress", lang.hitch(this, this.uploadProgressListener, fileId));
            on(request.upload, "load", lang.hitch(this, this.successListener, fileId));
            on(request.upload, "error", lang.hitch(this, this.failureListener, fileId));
            on(request.upload, "abort", lang.hitch(this, this.cancelListener, fileId));

            // Construct an object containing the data required for file upload
            // Note that we use .name and NOT .fileName which is non-standard and will break FireFox 7
            var fileName = nextFile.name,
               uploadData = this.constructUploadData(nextFile, fileName, targetData);

            // Add the upload data to the file store
            this.fileStore[fileId] = {
               state: this.STATE_ADDED,
               fileName: fileName,
               uploadData: uploadData,
               request: request,
               progress: 0
            };

            // Update the display widget with the details of the file that will be uploaded
            this.uploadDisplayWidget.addInProgressFile(fileId, nextFile);
         }

         // Start uploads
         this.spawnFileUploads();
      },

      /**
       * Handler for the upload request completing.
       * 
       * @instance
       * @param {string} fileId The unique id of the file being uploaded
       * @param {object} evt The success event
       */
      successListener: function alfresco_services__BaseUploadService__successListener(fileId, evt) {
         var fileInfo = this.fileStore[fileId];
         if (fileInfo) {
            // NOTE: There is an occasional timing issue where the upload completion event fires before the
            // readyState is correctly updated. This means that we can't check the upload actually completed
            // successfully, if this occurs then we'll attach a function to the onreadystatechange extension
            // point and things to catch up before we check everything was ok.
            if (fileInfo.request.readyState !== 4) {
               this.uploadDisplayWidget.updateUploadProgress(fileId, 100);
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
       * Calculates the overall progress of all the uploads and calls the display widget with the data.
       *
       * @instance
       */
      updateAggregateProgress: function alfresco_services__BaseUploadService__updateAggregateProgress() {

         // Setup variables
         var fileIds = Object.keys(this.fileStore),
            totalPercent = this.totalNewUploads * 100,
            cumulativeProgress = 0,
            inProgressFiles = 0;

         // Run through all uploads, calculating total and current progress
         array.forEach(fileIds, function(fileId) {
            var fileInfo = this.fileStore[fileId];
            if (fileInfo.state === this.STATE_ADDED || fileInfo.state === this.STATE_UPLOADING) {
               cumulativeProgress += fileInfo.progress;
               inProgressFiles++;
            }
         }, this);

         // Add completed files to the cumulative total
         cumulativeProgress += (this.totalNewUploads - inProgressFiles) * 100;

         // Calculate total percentage and send to widget
         // NOTE: If no in-progress files, or race-condition causes zero total percent, then
         // just call it 100, because it will mean that essentially there are no pending uploads
         var currentProgressPercent = (inProgressFiles && totalPercent) ? Math.floor(cumulativeProgress / totalPercent * 100) : 100;
         this.uploadDisplayWidget.updateAggregateProgress(currentProgressPercent / 100);

         // If no longer have uploads pending, update the total-completed variable
         if (currentProgressPercent === 100) {
            this.resetTotalUploads();
         }

         // Update the container title with the aggregate progress if required
         if (this.uploadsContainerTitleUpdateTopic) {
            var title = this.message(this.uploadsContainerTitle, currentProgressPercent);
            if (currentProgressPercent === 100) {
               title = this.message(this.uploadsContainerTitleComplete);
            }
            this.alfServicePublish(this.uploadsContainerTitleUpdateTopic, {
               title: title
            });
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
      uploadProgressListener: function alfresco_services__BaseUploadService__uploadProgressListener(fileId, evt) {
         var fileInfo = this.fileStore[fileId];
         if (fileInfo && evt.lengthComputable) {
            var progress = Math.min(Math.round(evt.loaded / evt.total * 100), 100);
            this.uploadDisplayWidget.updateUploadProgress(fileId, progress);
            fileInfo.progress = progress;
            this.updateAggregateProgress();
         } else {
            this.alfLog("warn", "Unable to update upload progress for file (evt,file)", evt, fileInfo);
         }
      },

      /**
       * Validate a single file, throwing an exception if it fails.
       *
       * @instance
       * @param {object} file The file
       */
      validateFile: function alfresco_services__BaseUploadService__validateFile(file) {
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
      validateFiles: function alfresco_services__BaseUploadService__validateFiles(files) {
         return array.filter(files, function(file) {
            try {
               this.validateFile(file);
               return true;
            } catch (e) {
               this.addInvalidFile(file, e.message);
            }
         }, this);
      }
   });
});
