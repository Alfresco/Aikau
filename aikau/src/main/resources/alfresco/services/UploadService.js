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
 * @extends module:alfresco/services/BaseService
 * @extends module:alfresco/services/BaseServiceXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "dojo/json",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "alfresco/dialogs/AlfDialog",
        "alfresco/buttons/AlfButton",
        "service/constants/Default",
        "alfresco/core/ObjectTypeUtils"], 
        function(declare, BaseService, CoreXhr, topics, dojoJson, lang, array, on, AlfDialog, AlfButton, AlfConstants, ObjectTypeUtils) {
   
   return declare([BaseService, CoreXhr], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/UploadService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/UploadService.properties"}],

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
       * The current amount of data that has been uploaded.
       *
       * @instance
       * @type {number}
       * @default
       */
      aggregateUploadCurrentSize: 0,

      /**
       * This is the total size of data expected to be uploaded
       *
       * @instance
       * @type {number}
       * @default
       */
      aggregateUploadTargetSize: 0,

      /**
       * Stores references and state for each file that is in the file list.
       * The fileId parameter from the YAHOO.widget.Uploader is used as the key
       * and the value is an object that stores the state and references.
       *       The object literal is of the form:
       *       {
       *          contentType: {HTMLElement},        // select, hidden input or null (holds the chosen contentType for the file).
       *          fileButton: {YAHOO.widget.Button}, // Will be disabled on success or STATE_FAILURE
       *          state: {int},                      // Keeps track if the individual file has been successfully uploaded or failed
       *                                             // (state flow: STATE_BROWSING > STATE_ADDED > STATE_UPLOADING > STATE_SUCCESS or STATE_FAILURE)
       *          progress: {HTMLElement},           // span that is the "progress bar" which is moved during progress
       *          progressInfo: {HTMLElement},       // span that displays the filename and the state
       *          progressPercentage: {HTMLElement}, // span that displays the upload percentage for the individual file
       *          fileName: {string},                // filename
       *          nodeRef: {string}                  // nodeRef if the file has been uploaded successfully
       *       }
       *
       * @instance
       * @type {object}
       */
      fileStore: null,

      /**
       * Holds a reference to an [AlfDialog]{@link module:alfresco/dialogs/AlfDialog} used to display
       * the upload progress. This is initialised to null and created the first time it is required.
       *
       * @instance
       * @type {object}
       * @default
       */
      progressDialog: null,

      /**
       * This is the default title key for the progress dialog.
       * @instance
       */
      progressDialogTitleKey: "progress-dialog.title",

      /**
       * This will be populated with the NodeRefs of the last few locations that the user has previously
       * uploaded to. The number of NodeRefs that are stored are determined by the 
       * [uploadHistorySize]{@link module:alfresco/services/UploadService#uploadHistorySize}.
       * 
       * @instance
       * @type {string[]}
       * @default
       * @since 1.0.34
       */
      uploadHistory: null,

      /**
       * The preference name to use for storing and retrieving upload location history.
       * In order for this preference to be used it will also be necessary to ensure that the 
       * [PreferenceService]{@link module:alfresco/services/PreferenceService} is included on the page.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.34
       */
      uploadHistoryPreferenceName: "org.alfresco.share.upload.destination.history",

      /**
       * The number of nodes previously uploaded to that should be stored in the user preferences as their 
       * upload history. This defaults to 3 but can be overridden through configuration if required.
       *
       * @instance
       * @type {number}
       * @default
       * @since 1.0.34
       */
      uploadHistorySize: 3,

      /**
       * @instance
       * @type {string}
       * @default
       */
      uploadTopic: topics.UPLOAD_REQUEST,
      
      /**
       * This defines the JSON structure for the widgets to be displayed in the progress dialog. This
       * can be overridden by extending widgets to render a different display in the dialog
       *
       * @instance
       * @type {object}
       */
      widgetsForProgressDialog: [
         {
            name: "alfresco/upload/AlfUploadDisplay",
            assignTo: "uploadDisplayWidget"
         }
      ],

      /**
       * Resets the widget
       *
       * @instance
       */
      reset: function alfresco_services_UploadService__reset() {
         // Initialise the fileStore attribute so that it is empty...
         this.fileStore = {};
         this.aggregateUploadTargetSize = 0;
         this.aggregateUploadCurrentSize = 0;
      },

      /**
       * 
       * @instance
       * @param {string} value The preference value containing the nodeRefs last uploaded to
       * @since 1.0.34
       */
      setUploadHistory: function alfresco_services_UploadService__setUploadHistory(value) {
         if (value)
         {
            this.uploadHistory = value.split(",");
         }
      },

      /**
       * @instance
       * @since 1.0.32
       * @listens module:alfresco/core/topics#UPLOAD_COMPLETION_ACKNOWLEDGEMENT
       * @listens module:alfresco/core/topics#UPLOAD_CANCELLATION
       * @listens module:alfresco/core/topics#UPLOAD_REQUEST
       */
      registerSubscriptions: function alfresco_services_UploadService__registerSubscriptions() {
         this.reset();
         this.alfSubscribe(this.uploadTopic, lang.hitch(this, this.onUploadRequest));

         // Set up the upload history array from the user preferences
         this.uploadHistory = [];
         this.alfPublish(topics.GET_PREFERENCE, {
            preference: this.uploadHistoryPreferenceName,
            callback: this.setUploadHistory,
            callbackScope: this
         });
         
         // Set up template?
         if (this.progressDialog === null || this.progressDialog === undefined)
         {
            // Create topics to give to the dialog buttons, then subscribe to them to handle the
            // events...
            this.alfSubscribe(topics.UPLOAD_COMPLETION_ACKNOWLEDGEMENT, lang.hitch(this, this.onProgressDialogOkClick));
            this.alfSubscribe(topics.UPLOAD_CANCELLATION, lang.hitch(this, this.onProgressDialogCancelClick));

            // Create a new dialog... the content is variable, but the widgets are fixed...
            this.progressDialog = new AlfDialog({
               id: "ALF_UPLOAD_PROGRESS_DIALOG",
               title: this.createProgressDialogTitle(),
               widgetsContent: this.widgetsForProgressDialog,
               widgetsButtons: [
                  {
                     id: "ALF_UPLOAD_PROGRESS_DIALOG_CANCELLATION",
                     name: "alfresco/buttons/AlfButton",
                     assignTo: "_uploadDialogButton",
                     config: {
                        label: this.message("progress-dialog.cancel-button.label"),
                        publishTopic: topics.UPLOAD_CANCELLATION,
                        additionalCssClasses: "call-to-action"
                     }
                  }
               ]
            });
            this.getUploadDisplayWidget();
         }
      },
      
      /**
       * @instance
       */
      onUploadRequest: function alfresco_services_UploadService(payload) {
         this.alfLog("log", "Upload request received: ", payload);
         
         // Check whether or not a files reference has been provided,
         // this takes precedence over actual files in the payload...
         if (lang.exists("filesRefs", payload))
         {
            var files = this.alfGetData(payload.filesRefs);
            if (files !== null && files !== undefined)
            {
               payload.files = files;
            }
         }

         if (lang.exists("files", payload) && lang.exists("targetData", payload))
         {
            // Store a response topic to publish on when the upload is complete...
            // This allows for scoped responses to be processed without pollution...
            this.currentResponseTopic = payload.alfResponseTopic;
            this.currentResponseScope = payload.alfResponseScope;

            this.filesToUpload = [];
            this.validateRequestedFiles(payload.files);
            this.startFileUploads(payload.targetData);
         }
         else
         {
            this.alfLog("warn", "A request was received to upload files but either no 'files' attribute or no 'targetData' attribute was defined", payload, this);
         }
      },
      
      /**
       * Iterates over the supplied array of files to determine whether any of them are not valid. By default
       * this will check for 0kb sized files as thesse are not supported and on some browsers these represent
       * a folder.
       *
       * @instance
       * @param {object[]} files The array of files that have been requested to be uploaded
       */
      validateRequestedFiles: function alfresco_services_UploadService__validateRequestedFiles(files) {
         array.forEach(files, lang.hitch(this, this.validateRequestedFile));
      },

      /**
       * Validates that the supplied file is a valid candidate for upload. By default this will simply check that
       * the file is not 0kb in size.
       *
       * @instance
       * @param {object} file The file to validate
       * @param {number} index The index of the file in the list
       */
      validateRequestedFile: function alfresco_services_UploadService__validateRequestedFile(file, /*jshint unused:false*/ index) {
         // Validation could possibly moved out to another method, but would this be overkill?
         if (file.size === 0)
         {
            // 0kb file upload is not supported
            this.addInvalidFile(file);
         }
         else
         {
            // Valid file, start processing...
            this.addFileForUpload(file);
         }
      },

      /**
       * Adds an invalid file to the list of files that cannot be uploaded.
       *
       * @instance
       * @param {object} file The invalid file that cannot be uploaded
       */
      addInvalidFile: function alfresco_services_UploadService__addInvalidFile(file) {
         // Add the file to the displayed list of failed files
         this.alfLog("log", "Adding invalid file: ", file, this);
         if (this.uploadDisplayWidget !== null &&
             this.uploadDisplayWidget !== undefined && 
             typeof this.uploadDisplayWidget.addFailedFile === "function")
         {
            this.uploadDisplayWidget.addFailedFile(file.name, { reason: "0kb files cannot be uploaded"});
         }
         else
         {
            this.alfLog("warn", "Either the 'uploadDisplayWidget' is null or it has no 'addFailedFile' function", this);
         }
      },

      /**
       * Commences uploading the supplied file.
       *
       * @instance
       * @param {object} file The file to start uploading
       */
      addFileForUpload: function alfresco_services_UploadService__startFileUpload(file) {
         this.alfLog("log", "Adding file for upload", file, this);
         if (this.filesToUpload === null || this.filesToUpload === undefined)
         {
            // Create a new array for the files to upload if it hasn't already been instantiated
            // This might occur the first time a request is made...#
            this.filesToUpload = [];
         }

         // Add the file to the list to be uploaded...
         this.filesToUpload.push(file);
      },

      /**
       * Starts the process of uploading files.
       *
       * @instance
       * @param {object} targetData The data that identifies where to upload the files to.
       */
      startFileUploads: function alfresco_services_UploadService__startFileUploads(targetData) {
         // Calculate the total amount of data to upload...
         var aggregateSize = 0;
         array.forEach(this.filesToUpload, function(file) {
            aggregateSize += file.size;
         }, this);

         this.aggregateUploadTargetSize = aggregateSize;
         
         // Recursively add files to the queue
         array.forEach(this.filesToUpload, function(file, index) {

            var fileId = "file" + index;
            
            // Get the name of the file (note that we use ".name" and NOT ".fileName" which is non-standard and it's use 
            // will break FireFox 7)...
            var fileName = file.name;
            
            // Add the event listener functions to the upload properties of the XMLHttpRequest object...
            var request = new XMLHttpRequest();
                  
            // Add the data to the upload property of XMLHttpRequest so that we can determine which file each
            // progress update relates to (the event argument passed in the progress function does not contain
            // file name details)...
            request.upload._fileData = fileId;
            on(request.upload, "progress", lang.hitch(this, "uploadProgressListener", fileId));
            on(request.upload, "load", lang.hitch(this, "successListener", fileId));
            on(request.upload, "error", lang.hitch(this, "failureListener", fileId));
            
            // Construct an object containing the data required for file upload...
            var uploadData = this.constructUploadData(file, fileName, targetData);
            
            // Add the upload data to the file store. It is important that we don't initiate the XMLHttpRequest
            // send operation before the YUI DataTable has finished rendering because if the file being uploaded
            // is small and the network is quick we could receive the progress/completion events before we're
            // ready to handle them.
            this.fileStore[fileId] =
            {
               state: this.STATE_ADDED,
               fileName: fileName,
               // nodeRef: updateNodeRef,
               uploadData: uploadData,
               request: request,
               lastProgress: 0
            };

            // Update the display widget with the details of the file that will be uploaded...
            if(this.uploadDisplayWidget === null || this.uploadDisplayWidget === undefined)
            {
               this.alfLog("warn", "No widget has been defined to handle the file upload display - 'uploadDisplayWidget' is null", this);
            }
            else if (typeof this.uploadDisplayWidget.addInProgressFile !== "function")
            {
               this.alfLog("warn", "The 'uploadDisplayWidget' does not have an 'addInProgressFile' function", this.uploadDisplayWidget);
            }
            else
            {
               this.uploadDisplayWidget.addInProgressFile(fileId, file);
            }
         }, this);

         // Start uploads
         this.spawnFileUploads();
         this.progressDialog.show();
      },

      /**
       * This updates the [upload history]{@link module:alfresco/services/UploadService#uploadHistory} with the
       * supplied NodeRef. If the NodeRef is already in the history then it will not be added again. If the history
       * already contains the [maximum number of entries]{@link module:alfresco/services/UploadService#uploadHistorySize}
       * then the earliest used NodeRef in the history will be removed and the latest added.
       *
       * @instance
       * @param {string} nodeRef The NodeRef to add to the upload history
       * @since 1.0.34
       */
      updateUploadHistory: function alfresco_services_UploadService__updateUploadHistory(nodeRef) {
         // Iterate over the previous upload history and if the NodeRef being uploaded to already
         // exists in the history then move it to the first element.
         var alreadyInHistory = false;
         var processedUploadHistory = [];
         array.forEach(this.uploadHistory, function(d) {
            if (d === nodeRef)
            {
               processedUploadHistory.unshift(d);
               alreadyInHistory = true;
            }
            else
            {
               processedUploadHistory.push(d);
            }
         });
         this.uploadHistory = processedUploadHistory;

         if (!alreadyInHistory)
         {
            if (this.uploadHistory.length === this.uploadHistorySize)
            {
               this.uploadHistory.pop();
            }
            this.uploadHistory.unshift(nodeRef);
         }
         // Always update the latest history, even if no new NodeRef has been added then the previous
         // NodeRefs may have been re-ordered...
         this.alfPublish(topics.SET_PREFERENCE, {
            preference: this.uploadHistoryPreferenceName,
            value: this.uploadHistory.join(",")
         });
      },

      /**
       * Constructs the upload payload object to be added to the fileStore object for each file. 
       * The object constructed is designed to work with the Alfresco REST service for uploading
       * documents. This function can be overridden to support different APIs
       *
       * @instance
       * @param {object} file The file being uploaded
       * @param {object} fileName The name of the file being uploaded
       * @param {object} targetData
       */
      constructUploadData: function alfresco_services_UploadService__constructUploadData(file, fileName, targetData) {
         // NOTE: This is to work around the fact that pickers always return an array, even in
         //       single item mode - that needs to be better resolved at some point
         var destination = ObjectTypeUtils.isArray(targetData.destination) ? targetData.destination[0] : targetData.destination;
         this.updateUploadHistory(destination);
         
         // TODO: NEED TO UPDATE THIS OBJECT AND INCLUDE DEFAULTS, ETC AS INSTANCE VARIABLES...
         // The object should take the values passed in the upload request rather than having statically
         // defined data created when the widget is instantiated (e.g. this should be able to respond to
         // to allow uploads to varying locations)...
         var uploadData =
         {
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
         return uploadData;
      },

      /**
       * Find file(s) to start upload for.
       *
       * @instance
       */
      spawnFileUploads: function alfresco_services_UploadService__spawnFileUploads() {
         var uploadStarted = false;
         for (var key in this.fileStore)
         {
            if (this.fileStore.hasOwnProperty(key))
            {
               var fileInfo = this.fileStore[key];
               if (fileInfo.state === this.STATE_ADDED)
               {
                  // Start upload
                  this.startFileUpload(fileInfo);
                  uploadStarted = true;

                  // For now only allow 1 upload at a time
                  break;
               }
            }
         }

         if (!uploadStarted)
         {
            // No-more uploads to begin, this is called at the end of every upload
            // regardless of success or failure...
            var button = this.progressDialog._uploadDialogButton;
            button.setLabel(this.message("progress-dialog.ok-button.label"));
            button.publishTopic = topics.UPLOAD_COMPLETION_ACKNOWLEDGEMENT;
            this.progressDialog.titleNode.innerHTML = this.message("progress-dialog-complete.title");
         }
      },

      /**
       * Starts the actual upload for a file
       *
       * @instance
       * @param {object} Contains info about the file and its request.
       */
      startFileUpload: function alfresco_services_UploadService__startFileUpload(fileInfo) {
         // Mark file as being uploaded
         fileInfo.state = this.STATE_UPLOADING;

         var url;
         if (this.uploadURL === null || this.uploadURL === undefined)
         {
            url = AlfConstants.PROXY_URI + "api/upload";
         }
         else
         {
            url = AlfConstants.PROXY_URI + this.uploadURL;
         }
         if (this.isCsrfFilterEnabled())
         {
            url += "?" + this.getCsrfParameter() + "=" + encodeURIComponent(this.getCsrfToken());
         }

         if (this.uploadMethod === this.FORMDATA_UPLOAD)
         {
            // TODO: This should be able to respond to variable uploadData (to support overridden constructUploadData functions)...
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
            
            if (fileInfo.uploadData.updateNodeRef)
            {
               formData.append("updateNodeRef", fileInfo.uploadData.updateNodeRef);
            }
            if (fileInfo.uploadData.description)
            {
               formData.append("description", fileInfo.uploadData.description);
            }
            fileInfo.request.open("POST",  url, true);
            fileInfo.request.send(formData);
         }
      },

      /**
       * This function listens for upload progress events retured from the XMLHttpRequest object and
       * adjusts the display to give a visual indication of how the upload for the related file is
       * progressing.
       * 
       * @instance
       * @param {string} fileId The unique id of the file being uploaded
       * @param {object} evt The progress update event
       */
      uploadProgressListener: function alfresco_services_UploadService__uploadProgressListener(fileId, evt) {
         this.alfLog("log", "File upload progress update received", evt);
         if (evt.lengthComputable)
         {
            try
            {
               var percentage = Math.round((evt.loaded * 100) / evt.total),
                   fileInfo = this.fileStore[fileId];
               
               this.alfLog("log", "File: " + fileId + ", uploaded: " + percentage + "%");
   
               // Upload file progress...
               if (this.uploadDisplayWidget !== null && 
                   this.uploadDisplayWidget !== undefined && 
                   typeof this.uploadDisplayWidget.updateUploadProgress === "function")
               {
                  this.uploadDisplayWidget.updateUploadProgress(fileId, percentage, evt);
               }
               else
               {
                  this.alfLog("warn", "Either the 'uploadDisplayWidget' is null or it has no 'updateUploadProgress' function", this);
               }

               if (fileInfo.lastProgress === null || fileInfo === undefined)
               {
                  // This is the first progress update, set the last progress as 0...
                  fileInfo.lastProgress = 0;
                  fileInfo.currentProgress = evt.loaded;
               }

               // Set the current progress...
               fileInfo.currentProgress = evt.loaded;

               if (fileInfo.state === this.STATE_UPLOADING)
               {
                  // Update the overall progress of all the uploads...
                  this.updateAggregateProgress(fileInfo);

                  // Save value of how much has been loaded for the next iteration
                  fileInfo.lastProgress = evt.loaded;
               }
               
            }
            catch(exception)
            {
               this.alfLog("error", "The following error occurred processing an upload progress event: ", exception, evt);
            }
         }
         else
         {
            this.alfLog("log", "File upload progress not computable", evt, this);
         }
      },

      /**
       * Calculates the overall progress of all the uploads and calls the display widget with the data.
       *
       * @instance
       * @param {object} fileInfo The data about the file being uploaded.
       */
      updateAggregateProgress: function alfresco_services_UploadService__updateAggregateProgress(fileInfo) {
         // Update the aggregate progress of all the files uploaded...
         if (this.uploadDisplayWidget !== null && 
             this.uploadDisplayWidget !== undefined && 
             typeof this.uploadDisplayWidget.updateAggregateProgress === "function")
         {
            // Deduct the last loaded about from the overall loaded value, then add the full
            // file size. This can then be used to calculate the overall progress and set the
            // style of the progress bar...
            this.aggregateUploadCurrentSize -= fileInfo.lastProgress;
            if (fileInfo.state !== this.STATE_UPLOADING)
            {
               // The upload has now completed, deduct the previous amount from the total upload completed
               // and then add that to the overall progress...
               this.aggregateUploadCurrentSize += fileInfo.uploadData.filedata.size;
            }
            else
            {
               this.aggregateUploadCurrentSize += fileInfo.currentProgress;
            }
            
            // this.aggregateUploadCurrentSize += fileInfo.uploadData.filedata.size;
            var overallProgress = this.aggregateUploadCurrentSize / this.aggregateUploadTargetSize;
            this.uploadDisplayWidget.updateAggregateProgress(overallProgress);
         }
         else
         {
            this.alfLog("warn", "Either the 'uploadDisplayWidget' is null or it has no 'updateAggregateProgress' function", this);
         }
      },

      /**
       * 
       * @instance
       * @param {string} fileId The unique id of the file being uploaded
       * @param {object} evt The success event
       */
      successListener: function alfresco_services_UploadService__successListener(fileId, evt) {
         try
         {
            this.alfLog("log", "File upload completion notification received", evt);

            // The individual file has been transfered completely
            // Now adjust the gui for the individual file row
            var fileInfo = this.fileStore[fileId];
            if (fileInfo.request.readyState !== 4)
            {
               // There is an occasional timing issue where the upload completion event fires before
               // the readyState is correctly updated. This means that we can't check the upload actually
               // completed successfully, if this occurs then we'll attach a function to the onreadystatechange
               // extension point and things to catch up before we check everything was ok...
               var _this = this;
               fileInfo.request.onreadystatechange = function alfresco_services_UploadService__onreadystatechange()
               {
                  if (fileInfo.request.readyState === 4)
                  {
                     _this.processUploadCompletion(fileId, evt);
                  }
               };
            }
            else
            {
               // If the request correctly indicates that the response has returned then we can process
               // it to ensure that files have been uploaded correctly.
               this.processUploadCompletion(fileId, evt);
            }
         }
         catch(exception)
         {
            this.alfLog("error", "The following error occurred processing an upload completion event: ", exception, evt);
         }
      },

     /**
       * Called from show when an upload complete event fires.
       *
       * @instance
       * @param {object} fileId The unique identifier of the file
       * @param {object} evt The completion event
       */
      processUploadCompletion: function alfresco_services_UploadService__processUploadCompletion(fileId, evt) {
         var fileInfo = this.fileStore[fileId];
         if (fileInfo.request.status === 200)
         {
            // TODO: SWAP THIS OUT FOR DOJO CODE
            var response = dojoJson.parse(fileInfo.request.responseText);

            // update noderef and filename from response
            fileInfo.nodeRef = response.nodeRef;
            fileInfo.fileName = response.fileName;
            fileInfo.state = this.STATE_SUCCESS;

            if (this.uploadDisplayWidget !== null && 
                this.uploadDisplayWidget !== undefined && 
                typeof this.uploadDisplayWidget.handleCompletedUpload === "function")
            {
               this.uploadDisplayWidget.handleCompletedUpload(fileId, evt, fileInfo.request);
            }
            else
            {
               this.alfLog("warn", "Either the 'uploadDisplayWidget' is null or it has no 'handleCompletedUpload' function", this);
            }

            // Update the overall progress of all the uploads...
            this.updateAggregateProgress(fileInfo);

            // Upload remaining files
            this.spawnFileUploads();
         }
         else
         {
            // Process the upload failure...
            this.processUploadFailure(fileId, evt, fileInfo.request);
         }
      },

      /**
       *
       * @instance
       * @param {string} fileId The unique id of the file being uploaded
       * @param {object} evt The failure event
       */
      failureListener: function alfresco_services_UploadService__failureListener(fileId, evt) {
         try
         {
            var fileInfo = this.fileStore[fileId];
   
            // This sometimes gets called twice, make sure we only adjust the gui once
            if (fileInfo.state !== this.STATE_FAILURE)
            {
               this.processUploadFailure(fileId, evt);
            }
         }
         catch(exception)
         {
            this.alfLog("error", "The following error occurred processing an upload failure event: ", exception, evt);
         }
      },

      /**
       * Called from show if an XMLHttpRequest.send() operation fails or completes but returns an HTTP status code of anything
       * other than 200.
       *
       * @instance 
       * @param {object} fileId The unique identifier of the file
       * @param {object} evt The completion event
       */
      processUploadFailure: function alfresco_services_UploadService__processUploadFailure(fileId, evt) {
         var fileInfo = this.fileStore[fileId];
         fileInfo.state = this.STATE_FAILURE;

         // Update the display with the details of the upload failure...
         if (this.uploadDisplayWidget !== null && 
             this.uploadDisplayWidget !== undefined && 
             typeof this.uploadDisplayWidget.handleFailedUpload === "function")
         {
            this.uploadDisplayWidget.handleFailedUpload(fileId, evt, fileInfo.request);
         }
         else
         {
            this.alfLog("warn", "Either the 'uploadDisplayWidget' is null or it has no 'handleFailedUpload' function", this);
         }

         // Update the overall progress of all the uploads...
         this.updateAggregateProgress(fileInfo);

         // Upload remaining files
         this.spawnFileUploads();
      },

      /**
       * This function generates the title for the progress dialog. By default it simply displays the
       * localized value of the [progressDialogTitleKey]{@link module:alfresco/upload/AlfUpload#progressDialogTitleKey}
       *
       * @instance
       * @return {string} The localized title for the progress dialog
       */
      createProgressDialogTitle: function alfresco_services_UploadService__createProgressDialogTitle() {
         return this.message(this.progressDialogTitleKey);
      },

      /**
       * Sets the 'uploadDisplayWidget' attribute with a reference to the uploadDisplayWidget from the
       * progress dialog.
       *
       * @instance
       * @return {object} A reference to the widget used for displaying progress.
       */
      getUploadDisplayWidget: function alfresco_services_UploadService__getUploadDisplayWidget() {
         if (this.progressDialog && 
             this.progressDialog._dialogPanel && 
             this.progressDialog._dialogPanel.uploadDisplayWidget)
         {
            this.uploadDisplayWidget = this.progressDialog._dialogPanel.uploadDisplayWidget;
         }
         else
         {
            this.alfLog("warn", "Could not find 'uploadDisplayWidget' in dialog content", this);
         }
      },

      /**
       * Handles the user clicking on the "OK" button in the dialog.
       *
       * @instance
       * @param {object} payload The details of the button click.
       */
      onProgressDialogOkClick: function alfresco_services_UploadService__onProgressDialogOkClick(/*jshint unused:false*/ payload) {
         // TODO: Close the dialog (this should be all?) - what about post upload actions? Set metadata, etc?
         this.alfLog("log", "Upload progress dialog 'ok' button clicked");
         this.reset();
         if (this.uploadDisplayWidget !== null && 
             this.uploadDisplayWidget !== undefined && 
             typeof this.uploadDisplayWidget.reset === "function")
         {
            this.resetDialog();
            this.uploadDisplayWidget.reset();
         }
         else
         {
            this.alfLog("warn", "Either the 'uploadDisplayWidget' is null or it has no 'reset' function", this);
         }
         if (this.currentResponseTopic !== null && this.currentResponseTopic !== undefined)
         {
            this.alfPublish(this.currentResponseTopic, {
               responseScope: this.currentResponseScope
            }, true);
         }
      },

      /**
       * Handles the user clicking on the "Cancel" button in the dialog.
       *
       * @instance
       * @param {object} payload The details of the button click.
       */
      onProgressDialogCancelClick: function alfresco_services_UploadService__onProgressDialogCancelClick(/*jshint unused:false*/ payload) {
         this.alfLog("log", "Upload progress dialog 'cancel' button clicked");

         for (var key in this.fileStore)
         {
            if (this.fileStore.hasOwnProperty(key))
            {
               var fileInfo = this.fileStore[key];
               if (fileInfo.state === this.STATE_UPLOADING)
               {
                   // We will only attempt an upload abort if the file is still being uploaded (there is
                   // no point in aborting if the file has completed or failed)
                   fileInfo.request.abort();
               }
            }
         }

         this.reset();
         if (this.uploadDisplayWidget !== null && 
             this.uploadDisplayWidget !== undefined && 
             typeof this.uploadDisplayWidget.reset === "function")
         {
            this.resetDialog();
            this.uploadDisplayWidget.reset();
         }
         else
         {
            this.alfLog("warn", "Either the 'uploadDisplayWidget' is null or it has no 'reset' function", this);
         }
         if (this.currentResponseTopic !== null && this.currentResponseTopic !== undefined)
         {
            this.alfPublish(this.currentResponseTopic, {
               responseScope: this.currentResponseScope
            }, true);
         }
      },

      /**
       * Resets the title and button labels of the dialog to indicate that upload is in progress
       * (ready for start of the next upload).
       * 
       * @instance
       * @since 1.0.43
       */
      resetDialog: function alfresco_services_UploadService__resetDialog() {
         var button = this.progressDialog._uploadDialogButton;
         button.setLabel(this.message("progress-dialog.cancel-button.label"));
         button.publishTopic = topics.UPLOAD_COMPLETION_ACKNOWLEDGEMENT;
         this.progressDialog.titleNode.innerHTML = this.message("progress-dialog.title");
      }
   });
});