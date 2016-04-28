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
        "alfresco/core/CoreWidgetProcessing", 
        "alfresco/core/topics",
        "alfresco/core/Core",
        "alfresco/upload/UploadsDisplayInterface",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin", 
        "dojo/_base/array", 
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/dom-class", 
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/when", 
        "dojo/text!./templates/UploadMonitor.html"], 
        function(FileSizeMixin, CoreWidgetProcessing, topics, AlfCore, UploadsDisplayInterface, _WidgetBase, _TemplatedMixin, array, declare, lang, domClass, domConstruct, domStyle, when, template) {

   return declare([UploadsDisplayInterface, _WidgetBase, _TemplatedMixin, AlfCore, FileSizeMixin, CoreWidgetProcessing], {

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
       * If set to true, this will override the [maxUploadNameLength property]{@see module:alfresco/upload/UploadMonitor#maxUploadNameLength}
       * and any long filenames will instead be truncated instead by the available space, with an ellipsis used at the end of the string to
       * denote any missing characters.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.66
       */
      useEllipsisForLongFilenames: false,

      /**
       * <p>This collection of [PublishAction]{@link module:alfresco/renderers/PublishAction} widgets
       * will be displayed against each inprogress item in the upload monitor. The upload item
       * (containing relevant information) will be added as the current item, and the
       * [publishPayloadType]{@link module:alfresco/renderers/_PublishPayloadMixin#publishPayloadType}
       * will default to [PayloadTypes.CURRENT_ITEM]{@link module:alfresco/renderers/_PublishPayloadMixin#PayloadTypes},
       * if not specified. In effect, this means that you should normally only need to specify the
       * [publishTopic]{@link module:alfresco/renderers/PublishAction#publishTopic} and
       * [iconClass]{@link module:alfresco/renderers/PublishAction#iconClass} in the PublishAction
       * config.</p>
       *
       * <p>The currentItem that's provided to the supplied action is an object with five properties.
       * Specifically, three simple properties of fileId, fileSize (bytes) and fileName and two additional
       * complex properties of fileObj (which is all the details of the upload object) and response
       * (which is the server response - valid for finished uploads only).</p>
       *
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.56
       */
      widgetsForInProgressActions: [
         {
            name: "alfresco/renderers/PublishAction",
            config: {
               publishTopic: topics.CANCEL_INPROGRESS_UPLOAD,
               iconClass: "cancel-16"
            }
         }
      ],

      /**
       * PublishActions for displaying against successful items. For more information on how to use this, see
       * [widgetsForInProgressActions]{@link module:alfresco/upload/UploadMonitor#widgetsForInProgressActions}.
       *
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.56
       */
      widgetsForSuccessfulActions: null,

      /**
       * PublishActions for displaying against unsuccessful items. For more information on how to use this, see
       * [widgetsForInProgressActions]{@link module:alfresco/upload/UploadMonitor#widgetsForInProgressActions}.
       *
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.56
       */
      widgetsForUnsuccessfulActions: null,

      /**
       * This defines the widget model for rendering an error icon. This is expected to be a single 
       * [SVGImage]{@link module:alfresco/html/SVGImage} but is made configurable in order to support customization
       * of dimensions and the image rendered. If a radically different widget model is provided then it may
       * be necessary to use an extension of this widget with an extension to the 
       * [handleFailedUpload]{@link module:alfresco/upload/UploadMonitor#handleFailedUpload} function.
       * 
       * @instance
       * @type {object[]}
       * @since 1.0.58
       */
      widgetsForErrorIcon: [
         {
            name: "alfresco/html/SVGImage",
            config: {
               source: "alfresco/html/svg/error.svg",
               symbolId: "error",
               height: 16,
               width: 16
            }
         }
      ],

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
       * Run after the widget has been created.
       *
       * @instance
       * @override
       * @since 1.0.65
       * @listens module:alfresco/core/topics#UPLOAD_MODIFY_ITEM
       */
      postCreate: function alfesco_upload_UploadMonitor__postCreate() {
         this.alfSubscribe(topics.UPLOAD_MODIFY_ITEM, lang.hitch(this, this.handleModifyItem));
         if (this.useEllipsisForLongFilenames) {
            domClass.add(this.domNode, this.baseClass + "--use-ellipsis");
         }
      },

      /**
       * Create the actions widgets, ensure that the default publishPayloadType is set
       * to CURRENT_ITEM, and set the current item to be the supplied upload info.
       *
       * @instance
       * @param {object} actionPayload The upload information to be used in the action payload
       * @param {object} actionsNode The node in which to place the actions
       * @since 1.0.56
       */
      addActions: function alfesco_upload_UploadMonitor__addActions(actionPayload, actionsNode) {

         // Loop through the potential states of an upload
         var propTypes = ["InProgress", "Successful", "Unsuccessful"],
            actionClass = this.baseClass + "__item__action";
         array.forEach(propTypes, function(propType) {

            // Grab the widgets property for this state
            var propName = "widgetsFor" + propType + "Actions",
               widgets = this[propName] && lang.clone(this[propName]);
            if (widgets && widgets.length) {

               // Create state-specific class
               var actionStateClass = actionClass + "__" + propType.toLowerCase();

               // Mix in the default payload type and a class to control visibility
               array.forEach(widgets, function(action) {
                  action.config = lang.mixin({
                     publishPayloadType: "PROCESS",
                     publishGlobal: true,
                     publishPayloadItemMixin: true,
                     additionalCssClasses: actionClass + " " + actionStateClass,
                     publishPayloadModifiers: ["processCurrentItemTokens"],
                     currentItem: actionPayload
                  }, action.config || {});
               }, this);

               // Create the widgets under the appropriate node
               this.processWidgets(widgets, actionsNode);
            }
         }, this);
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
            }, this.inProgressItemsNode),
            itemName = domConstruct.create("td", {
               className: this.baseClass + "__item__name"
            }, itemRow),
            itemNameContent = domConstruct.create("div", {
               className: this.baseClass + "__item__name__content",
               textContent: this.getDisplayText(file),
               title: this.getDisplayText(file, true)
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
            }, itemRow),
            itemActions = domConstruct.create("td", {
               className: this.baseClass + "__item__actions"
            }, itemRow),
            progressRow = domConstruct.create("tr", {}, this.inProgressItemsNode),
            progressCell = domConstruct.create("td", {
               colspan: 4,
               className: this.baseClass + "__item__progress-cell"
            }, progressRow),
            progressBar = domConstruct.create("div", {
               className: this.baseClass + "__item__progress-bar"
            }, progressCell);

         // Add localised status messages
         domConstruct.create("span", {
            className: this.baseClass + "__item__status__inprogress",
            textContent: this.message("upload.status.inprogress")
         }, itemStatus);
         domConstruct.create("span", {
            className: this.baseClass + "__item__status__finishing",
            textContent: this.message("upload.status.finishing")
         }, itemStatus);
         domConstruct.create("span", {
            className: this.baseClass + "__item__status__successful",
            textContent: this.message("upload.status.successful")
         }, itemStatus);
         domConstruct.create("span", {
            className: this.baseClass + "__item__status__unsuccessful",
            textContent: this.message("upload.status.unsuccessful")
         }, itemStatus);
         var errorIconNode = domConstruct.create("span", {
            className: this.baseClass + "__item__status__unsuccessful_icon"
         }, itemStatus);

         // Store in uploads map
         var upload = this._uploads[fileId] = {
            id: fileId,
            file: file,
            actionPayload: {
               uploadId: fileId,
               fileSize: file.size,
               fileName : file.name,
               fileObj: file
            },
            nodes: {
               row: itemRow,
               name: itemNameContent,
               errorIcon: errorIconNode,
               progress: itemProgressContent,
               progressRow: progressRow,
               progressBar: progressBar
            }
         };

         // Add actions
         this.addActions(upload.actionPayload, itemActions);
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
         var uniqueFileId = Date.now();
         while (this._uploads.hasOwnProperty(uniqueFileId)) {
            uniqueFileId = Date.now();
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
       * @param {boolean} [doNotTruncate=false] If true then will prevent truncating the display text
       * @returns {string} The name of the upload to be deisplayed
       */
      getDisplayText: function alfesco_upload_UploadMonitor__getDisplayText(file, doNotTruncate) {

         // Create upload name as "filename.ext, xxx kB"
         var filename = file.name,
            filesize = this.formatFileSize(file.size || 0, 1),
            separator = ", ",
            uploadName = filename + separator + filesize;

         // If filename is too long, adjust
         if (this.useEllipsisForLongFilenames) {
            uploadName = uploadName.split("").reverse().join("");
         } else if (!doNotTruncate && uploadName.length > this.maxUploadNameLength) {

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
            upload.nodes.progressBar.parentNode.removeChild(upload.nodes.progressBar);
            upload.nodes.progress.textContent = this.displayUploadPercentage ? "100%" : "";
            domConstruct.place(upload.nodes.row, this.successfulItemsNode, "first");
            domClass.remove(upload.nodes.row, this.baseClass + "__item--finishing");

            // Parse the request to get the information about the resulting nodes that have been created
            // This information could be used to allow actions or links to be generated for the uploaded content
            // before the display is closed...
            if (request && request.responseText) {
               var response = request.responseText;
               try {
                  response = JSON.parse(response);
               } catch (e) {
                  this.alfLog("debug", "Unable to parse upload response as JSON", response);
               }
               upload.actionPayload.response = response;
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

         // Get the upload
         var upload = this._uploads[fileId];
         if (upload) {

            // Get the error message
            var errorMessage = "upload.failure.unknown-reason";
            if (request) {
               if (request.status === 0) {
                  errorMessage = "upload.cancelled";
               } else if (request.statusText) {
                  errorMessage = request.statusText;
               }
            }

            errorMessage = this.message("upload.failure.icon.title", {
               "0": upload.file.name,
               "1": this.message(errorMessage)
            });

            // Move the item to the unsuccessful items section and update the properties accordingly
            upload.completed = true;
            if (upload.nodes.progressBar.parentNode) {
               upload.nodes.progressBar.parentNode.removeChild(upload.nodes.progressBar);
            }
            domConstruct.place(upload.nodes.row, this.unsuccessfulItemsNode, "first");
            upload.nodes.progress.textContent = "";
            
            var processId = Date.now() + "_actionWidgets";
            var widgets = lang.clone(this.widgetsForErrorIcon);
            array.forEach(widgets, function(widget) {
               widget.config = lang.mixin({
                  title: errorMessage,
                  description: this.message("upload.failure.icon.description")
               }, widget.config);
            }, this);
            domConstruct.empty(upload.nodes.errorIcon);
            this.processWidgets(widgets, upload.nodes.errorIcon, processId);
            
            domClass.add(upload.nodes.row, this.baseClass + "__item--has-error");

         } else {
            this.alfLog("warn", "Attempt to mark as failed an upload that is not being tracked (id=" + fileId + ")");
         }
      },

      /**
       * Handle modification requests for a specific item
       *
       * @instance
       * @param {Object} payload The published payload
       * @since 1.0.65
       */
      handleModifyItem: function alfesco_upload_UploadMonitor__handleModifyItem(payload) {
         var upload;
         if (payload && payload.uploadId && (upload = this._uploads[payload.uploadId]) && payload.action) {
            switch (payload.action) {
               case "REMOVE":
                  var uploadRow = upload.nodes.row;
                  uploadRow.parentNode.removeChild(uploadRow);
                  break;
               default:
                  this.alfLog("warn", "Invalid action requested for modifying item: ", payload.action);
                  break;
            }
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
       */
      updateUploadProgress: function alfesco_upload_UploadMonitor__updateUploadProgress(fileId, percentageComplete) {
         if (!this.displayUploadPercentage) {
            return;
         }
         var upload = this._uploads[fileId];
         if (upload) {
            if (!upload.completed) {
               domStyle.set(upload.nodes.progressBar, "width", percentageComplete + "%");
               upload.nodes.progress.textContent = percentageComplete + "%";
               if (percentageComplete === 100) {
                  domClass.add(upload.nodes.row, this.baseClass + "__item--finishing");
               }
            }
         } else {
            this.alfLog("warn", "Attempt to update upload that is not being tracked (id=" + fileId + ")");
         }
      }
   });
});