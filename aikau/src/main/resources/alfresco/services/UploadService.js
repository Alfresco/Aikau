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
 * This service can be used to control the uploading of content as well as the updating the content 
 * of existing nodes on an Alfresco Repository.
 * 
 * @module alfresco/services/UploadService
 * @extends module:alfresco/core/Core
 * @extends module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "dojo/json",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "alfresco/dialogs/AlfDialog",
        "alfresco/buttons/AlfButton",
        "service/constants/Default"], 
        function(declare, AlfCore, CoreXhr, dojoJson, lang, array, on, AlfDialog, AlfButton, AlfConstants) {
   
   return declare([AlfCore, CoreXhr], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/UploadService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/UploadService.properties"}],

      /**
       * @instance
       * @type {string}
       * @default "ALF_UPLOAD_REQUEST"
       */
      _ALF_UPLOAD_TOPIC: "ALF_UPLOAD_REQUEST",
      
            /**
       * The user is browsing and adding files to the file list
       *
       * @instance
       * @type {number}
       * @default 1
       */
      STATE_BROWSING: 1,

      /**
       * File(s) is been added
       *
       * @instance
       * @type {number}
       * @default 2
       */
      STATE_ADDED: 2,

      /**
       * File(s) is being uploaded to the server
       *
       * @instance
       * @type {number}
       * @default 3
       */
      STATE_UPLOADING: 3,

      /**
       * All files are processed and have either failed or been successfully
       * uploaded to the server.
       *
       * @instance
       * @type {number}
       * @default 4
       */
      STATE_FINISHED: 4,

      /**
       * File failed to upload.
       *
       * @instance
       * @type {number}
       * @default 5
       */
      STATE_FAILURE: 5,

      /**
       * File was successfully STATE_SUCCESS.
       *
       * @instance
       * @type {number}
       * @default 6
       */
      STATE_SUCCESS: 6,

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
       * This is the total size of data expected to be uploaded
       *
       * @instance
       * @type {number}
       * @default 0
       */
      aggregateUploadTargetSize: 0,

      /**
       * The current amount of data that has been uploaded.
       *
       * @instance
       * @type {number}
       * @default 0
       */
      aggregateUploadCurrentSize: 0,

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
       * The constructor is extended so that we can construct an object containing all the i18n properties to 
       * be substituted by the template. This is because the template can't call functions to obtain data.
       * There are potentially better ways of doing this - but it does at least work.
       * 
       * @instance
       */
      constructor: function alfresco_services_UploadService__constructor(args) {
         lang.mixin(this, args);
         this.reset();
         this.alfSubscribe(this._ALF_UPLOAD_TOPIC, lang.hitch(this, this.onUploadRequest));

         // Set up template?
         if (this.progressDialog === null || this.progressDialog === undefined)
         {
            // Create topics to give to the dialog buttons, then subscribe to them to handle the
            // events...
            var okButtonClickTopic = "ALF_UPLOAD_DIALOG_OK_CLICK",
                cancelButtonClickTopic = "ALF_UPLOAD_DIALOG_CANCEL_CLICK";
            this.alfSubscribe(okButtonClickTopic, lang.hitch(this, "onProgressDialogOkClick"));
            this.alfSubscribe(cancelButtonClickTopic, lang.hitch(this, "onProgressDialogCancelClick"));

            // Create a new dialog... the content is variable, but the widgets are fixed...
            this.progressDialog = new AlfDialog({
               title: this.createProgressDialogTitle(),
               widgetsContent: this.widgetsForProgressDialog,
               widgetsButtons: [
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: this.message("progress-dialog.ok-button.label"),
                        publishTopic: okButtonClickTopic
                     }
                  },
                  {
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: this.message("progress-dialog.cancel-button.label"),
                        publishTopic: cancelButtonClickTopic
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
         array.forEach(files, lang.hitch(this, "validateRequestedFile"));
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
         // TODO: NEED TO UPDATE THIS OBJECT AND INCLUDE DEFAULTS, ETC AS INSTANCE VARIABLES...
         // The object should take the values passed in the upload request rather than having statically
         // defined data created when the widget is instantiated (e.g. this should be able to respond to
         // to allow uploads to varying locations)...
         var uploadData =
         {
            filedata: file,
            filename: fileName,
            destination: targetData.destination,
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
         for (var key in this.fileStore)
         {
            if (this.fileStore.hasOwnProperty(key))
            {
               var fileInfo = this.fileStore[key];
               if (fileInfo.state === this.STATE_ADDED)
               {
                  // Start upload
                  this.startFileUpload(fileInfo);

                  // For now only allow 1 upload at a time
                  return;
               }
            }
         }
      },

      /**
       * Starts the actual upload for a file
       *
       * @instance
       * @param {object} Contains info about the file and its request.
       */
      startFileUpload: function alfresco_services_UploadService__startFileUpload(fileInfo)
      {
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
       * Holds a reference to an [AlfDialog]{@link module:alfresco/dialogs/AlfDialog} used to display
       * the upload progress. This is initialised to null and created the first time it is required.
       *
       * @instance
       * @type {object}
       * @default null
       */
      progressDialog: null,

      /**
       * This is the default title key for the progress dialog.
       * @instance
       */
      progressDialogTitleKey: "progress-dialog.title",

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
       * This defines the JSON structure for the widgets to be displayed in the progress dialog. This
       * can be overridden by extending widgets to render a different display in the dialog
       *
       * @instance
       * @type {object}
       */
      widgetsForProgressDialog: [
         {
            name: "alfresco/upload/AlfUploadDisplay",
            assignTo: "uploadDisplayWidget",
            config: {

            }
         }
      ],

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
            this.uploadDisplayWidget.reset();
         }
         else
         {
            this.alfLog("warn", "Either the 'uploadDisplayWidget' is null or it has no 'reset' function", this);
         }
         if (this.currentResponseTopic !== null && this.currentResponseTopic !== undefined)
         {
            this.alfPublish(this.currentResponseTopic, {
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
         this.reset();
         if (this.uploadDisplayWidget !== null && 
             this.uploadDisplayWidget !== undefined && 
             typeof this.uploadDisplayWidget.reset === "function")
         {
            this.uploadDisplayWidget.reset();
         }
         else
         {
            this.alfLog("warn", "Either the 'uploadDisplayWidget' is null or it has no 'reset' function", this);
         }
         if (this.currentResponseTopic !== null && this.currentResponseTopic !== undefined)
         {
            this.alfPublish(this.currentResponseTopic, {
            }, true);
         }
      }
   });
});