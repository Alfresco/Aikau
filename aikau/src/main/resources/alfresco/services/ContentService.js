/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * @module alfresco/services/ContentService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang",
        "alfresco/core/NodeUtils",
        "alfresco/dialogs/AlfFormDialog"],
        function(declare, AlfCore, CoreXhr, AlfConstants, _AlfDocumentListTopicMixin, lang, NodeUtils, AlfFormDialog) {
   
   return declare([AlfCore, CoreXhr, _AlfDocumentListTopicMixin], {
      
      /**
       * Re-use the old Alfresco.DocListToolbar scope. This could be replaced with a custom scope if the i18nRequirements file is also changed.
       * @instance
       * @type {string}
       * @default "Alfresco.DocListToolbar"
       */
      i18nScope: "Alfresco.DocListToolbar",
      
      /**
       * Re-use the toolbar properties for the DocumentList - this gives us access to the same labels for folders, etc.
       * @instance
       * @type {object[]}
       */
      i18nRequirements: [{i18nFile: "../../../WEB-INF/classes/alfresco/site-webscripts/org/alfresco/components/documentlibrary/toolbar.get.properties"}],
      
      /**
       * Sets up the subscriptions for the ContentService
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_ContentService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_CURRENT_NODEREF_CHANGED", lang.hitch(this, this.handleCurrentNodeChange));
         this.alfSubscribe("ALF_SHOW_UPLOADER", lang.hitch(this, this.showUploader));
         this.alfSubscribe("ALF_CONTENT_SERVICE_UPLOAD_REQUEST_RECEIVED", lang.hitch(this, this.onFileUploadRequest));
         this.alfSubscribe("ALF_CREATE_NEW_FOLDER", lang.hitch(this, this.createNewFolder));
         this.alfSubscribe("ALF_CREATE_CONTENT_REQUEST", lang.hitch(this, this.onCreateContent));
         this.alfSubscribe("ALF_UPDATE_CONTENT_REQUEST", lang.hitch(this, this.onUpdateContent));
      },
      
      /**
       * This handles requests to create content.
       *
       * @instance
       * @param {object} payload The details of the content to create
       */
      onCreateContent: function alfresco_services_ContentService__onCreateFolder(payload) {

         if (payload.alf_destination == null || payload.alf_destination === "")
         {
            payload.alf_destination = this._currentNode.parent.nodeRef;
         }
         var type = null;
         if (payload.type == null)
         {
            type = "cm%3acontent";
         }
         else
         {
            type = payload.type;
         }
         var url = AlfConstants.PROXY_URI + "api/type/" + type + "/formprocessor";
         this.serviceXhr({url : url,
                          data: payload,
                          method: "POST",
                          successCallback: this.contentCreationSuccess,
                          callbackScope: this});
      },

      /**
       * This handles requests to update content
       *
       * @instance
       * @param {object} payload The details of the content to update
       */
      onUpdateContent: function alfresco_services_ContentService__onUpdateContent(payload) {

         if (payload.nodeRef == null)
         {
            this.alfLog("warn", "A request was made to update content but no 'nodeRef' attribute was provided", payload, this);
         }
         else
         {
            var nodeRef = NodeUtils.processNodeRef(payload.nodeRef);
            var url = AlfConstants.PROXY_URI + "api/node/" + nodeRef.uri + "/formprocessor";
            delete payload["nodeRef"];
            this.serviceXhr({url : url,
                             data: payload,
                             method: "POST",
                             successCallback: this.contentCreationSuccess,
                             callbackScope: this});
         }
      },

      /**
       * This is a generic success callback handler for content creation that simply publishes a request to
       * reload the current data.
       *
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      contentCreationSuccess: function alfresco_services_ContentService__contentCreationSuccess(response, originalRequestConfig) {
         this.alfPublish(this.reloadDataTopic, {});
      },

      /**
       * The current Node that content will be worked relative to.
       * @instance
       * @type {object}
       * @default null
       */
      _currentNode: null,
      
      /**
       *
       * @instance
       */
      handleCurrentNodeChange: function alfresco_services_ContentService__handleCurrentNodeRefChange(payload) {
         if (payload && payload.node)
         {
            this.alfLog("log", "Updating current nodeRef to: ", payload.node);
            this._currentNode = payload.node;
         }
         else
         {
            this.alfLog("error", "A request was made to update the current NodeRef, but no 'node' property was provided in the payload: ", payload);
         }
      },
      
      /**
       * This function will open a [AlfFormDialog]{@link module:alfresco/forms/AlfFormDialog} containing a 
       * [file select form control]{@link module:alfresco/forms/controls/FileSelect} so that the user can 
       * select one or more files to upload. When the dialog is confirmed the 
       * [onFileUploadRequest]{@link module:alfresco/services/ContentService#onFileUploadRequest}
       * function will be called to destroy the dialog and pass the upload request on.
       * 
       * @instance
       * @param {object} payload
       */
      showUploader: function alfresco_services_ContentService__showUploader(payload) {

         this.uploadDialog = new AlfFormDialog({
            dialogTitle: "Select files to upload",
            dialogConfirmationButtonTitle: "Upload",
            dialogCancellationButtonTitle: "Cancel",
            formSubmissionTopic: "ALF_CONTENT_SERVICE_UPLOAD_REQUEST_RECEIVED",
            formSubmissionPayload: {
               targetData: {
                  destination: this._currentNode.parent.nodeRef,
                  siteId: null,
                  containerId: null,
                  uploadDirectory: null,
                  updateNodeRef: null,
                  description: "",
                  overwrite: false,
                  thumbnails: "doclib",
                  username: null
               }
            },
            widgets: [
               {
                  name: "alfresco/forms/controls/FileSelect",
                  config: {
                     label: "Select files to upload...",
                     name: "files"
                  }
               }
            ]
         });
         this.uploadDialog.show();
      },

      /**
       * This function will be called whenever the [AlfFormDialog]{@link module:alfresco/forms/AlfFormDialog} created
       * by the [showUploader function]{@link module:alfresco/services/ContentService#showUploader} is confirmed to
       * trigger a dialog. This will destroy the dialog and pass the supplied payload onto the [AlfUpload]{@link module:alfresco/upload/AlfUpload}
       * module to actually perform the upload. It is necessary to destroy the dialog to ensure that all the subscriptions
       * are removed to prevent subsequent upload requests from processing old data.
       *
       * @instance
       * @param {object} payload The file upload data payload to pass on
       */
      onFileUploadRequest: function alfresco_services_ContentService__onFileUploadRequest(payload) {
         if (this.uploadDialog != null)
         {
            this.uploadDialog.destroyRecursive();
         }
         var responseTopic = this.generateUuid();
         this._uploadSubHandle = this.alfSubscribe(responseTopic, lang.hitch(this, "onFileUploadComplete"), true);
         payload.alfResponseTopic = responseTopic;
         this.alfPublish("ALF_UPLOAD_REQUEST", payload);
      },

      /**
       * This function is called once the document upload is complete. It publishes a request to reload the
       * current document list data.
       * 
       * @instance
       */
      onFileUploadComplete: function alfresco_services_ContentService__onFileUploadComplete() {
         this.alfLog("log", "Upload complete");
         this.alfUnsubscribeSaveHandles([this._uploadSubHandle]);
         this.alfPublish(this.reloadDataTopic, {});
      },
      
      /**
       * @instance
       */
      createNewFolder: function alfresco_services_ContentService__createNewFolder(payload) {
         var destination = this._currentNode.parent.nodeRef;

         // Intercept before dialog show
         var doBeforeDialogShow = function DLTB_onNewFolder_doBeforeDialogShow(p_form, p_dialog)
         {
            Dom.get(p_dialog.id + "-dialogTitle").innerHTML = this.message("label.new-folder.title");
            Dom.get(p_dialog.id + "-dialogHeader").innerHTML = this.message("label.new-folder.header");
         };
         
         var templateUrl = YAHOO.lang.substitute(AlfConstants.URL_SERVICECONTEXT + "components/form?itemKind={itemKind}&itemId={itemId}&destination={destination}&mode={mode}&submitType={submitType}&formId={formId}&showCancelButton=true",
         {
            itemKind: "type",
            itemId: "cm:folder",
            destination: destination,
            mode: "create",
            submitType: "json",
            formId: "doclib-common"
         });

         // Using Forms Service, so always create new instance
         var createFolder = new Alfresco.module.SimpleDialog(this.id + "-createFolder");

         createFolder.setOptions(
         {
            width: "33em",
            templateUrl: templateUrl,
            actionUrl: null,
            destroyOnHide: true,
            doBeforeDialogShow:
            {
               fn: doBeforeDialogShow,
               scope: this
            },
            onSuccess:
            {
               fn: function DLTB_onNewFolder_success(response)
               {
                  var activityData;
                  var folderName = response.config.dataObj["prop_cm_name"];
                  var folderNodeRef = response.json.persistedObject;
                  
//                  activityData =
//                  {
//                     fileName: folderName,
//                     nodeRef: folderNodeRef,
//                     path: this.currentPath + (this.currentPath !== "/" ? "/" : "") + folderName
//                  };
//                  this.modules.actions.postActivity(this.options.siteId, "folder-added", "documentlibrary", activityData);
                  
                  YAHOO.Bubbling.fire("folderCreated",
                  {
                     name: folderName,
                     parentNodeRef: destination
                  });
                  this.alfPublish(this.reloadDataTopic, {});
                  Alfresco.util.PopupManager.displayMessage(
                  {
                     text: this.message("message.new-folder.success", {"0": folderName})
                  });
               },
               scope: this
            },
            onFailure:
            {
               fn: function DLTB_onNewFolder_failure(response)
               {
                  if (response)
                  {
                     var folderName = response.config.dataObj["prop_cm_name"];
                     Alfresco.util.PopupManager.displayMessage(
                     {
                        text: this.message("message.new-folder.failure", {"0": folderName})
                     });
                  }
                  else
                  {
                     Alfresco.util.PopupManager.displayMessage(
                     {
                        text: this.message("message.failure")
                     });
                  }
               },
               scope: this
            }
         }).show();
      }
   });
});