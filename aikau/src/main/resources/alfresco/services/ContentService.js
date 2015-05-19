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
 * This service should be used for the creation, uploading, updating and deletion of nodes from an
 * Alfresco Repository. When using for deleting nodes it is important to ensure that the 
 * [DialogService]{@link module:alfresco/services/DialogService} is included on the page (or an 
 * alternative service that handles dialog creation requests). When uploading new content or updating
 * existing content then it is important to ensure that the [UploadService]{@link module:alfresco/services/UploadService}
 * is included on the page.
 * 
 * @module alfresco/services/ContentService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "service/constants/Default",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/core/NodeUtils"],
        function(declare, AlfCore, CoreXhr, AlfConstants, _AlfDocumentListTopicMixin, lang, array, NodeUtils) {
   
   return declare([AlfCore, CoreXhr, _AlfDocumentListTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/ContentService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/ContentService.properties"}],

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
         this.alfSubscribe("ALF_CREATE_CONTENT_REQUEST", lang.hitch(this, this.onCreateContent));
         this.alfSubscribe("ALF_UPDATE_CONTENT_REQUEST", lang.hitch(this, this.onUpdateContent));
         this.alfSubscribe("ALF_DELETE_CONTENT_REQUEST", lang.hitch(this, this.onDeleteContent));

         this.alfSubscribe("ALF_EDIT_BASIC_METADATA_REQUEST", lang.hitch(this, this.onEditBasicMetadataRequest));
         this.alfSubscribe("ALF_BASIC_METADATA_SUCCESS", lang.hitch(this, this.onEditBasicMetadataReceived));
         
      },
      
      /**
       * This handles requests to create content.
       *
       * @instance
       * @param {object} payload The details of the content to create
       */
      onCreateContent: function alfresco_services_ContentService__onCreateFolder(payload) {
         if (!payload.alf_destination)
         {
            payload.alf_destination = this._currentNode.parent.nodeRef;
         }
         var type = null;
         if (!payload.type)
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
                          successCallback: this.onContentCreationSuccess,
                          callbackScope: this});
      },

      /**
       * This is a generic success callback handler for content creation that simply publishes a request to
       * reload the current data.
       *
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      onContentCreationSuccess: function alfresco_services_ContentService__onContentCreationSuccess(response, originalRequestConfig) {
         // jshint unused:false
         this.alfPublish(this.reloadDataTopic, {});
      },

      /**
       * This handles requests to update content
       *
       * @instance
       * @param {object} payload The details of the content to update
       */
      onUpdateContent: function alfresco_services_ContentService__onUpdateContent(payload) {
         if (!payload.nodeRef)
         {
            this.alfLog("warn", "A request was made to update content but no 'nodeRef' attribute was provided", payload, this);
         }
         else
         {
            var nodeRef = NodeUtils.processNodeRef(payload.nodeRef);
            var url = AlfConstants.PROXY_URI + "api/node/" + nodeRef.uri + "/formprocessor";
            delete payload.nodeRef;
            this.serviceXhr({url : url,
                             data: payload,
                             method: "POST",
                             successCallback: this.contentCreationSuccess,
                             callbackScope: this});
         }
      },

      /**
       * This handles requests to delete content
       *
       * @instance
       * @param {object} payload The details of the content to update
       */
      onDeleteContent: function alfresco_services_ContentService__onDeleteContent(payload) {
         var responseTopic = this.generateUuid();
         this._actionDeleteHandle = this.alfSubscribe(responseTopic, lang.hitch(this, this.onActionDeleteConfirmation), true);

         this.alfPublish("ALF_CREATE_DIALOG_REQUEST", {
            dialogId: "ALF_DELETE_CONTENT_DIALOG",
            dialogTitle: this.message("contentService.delete.dialog.title"),
            widgetsContent: [
               {
                  name: "alfresco/lists/views/AlfListView",
                  config: {
                     additionalCssClasses: "no-highlight",
                     currentData: {
                        items: payload.nodes
                     },
                     widgets: [
                        {
                           name: "alfresco/lists/views/layouts/Row",
                           config: {
                              widgets: [
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/SmallThumbnail"
                                          }
                                       ]
                                    }
                                 },
                                 {
                                    name: "alfresco/lists/views/layouts/Cell",
                                    config: {
                                       widgets: [
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "displayName",
                                                renderFilter: [
                                                   {
                                                      property: "displayName",
                                                      values: [""],
                                                      negate: true
                                                   }
                                                ]
                                             }
                                          },
                                          {
                                             name: "alfresco/renderers/Property",
                                             config: {
                                                propertyToRender: "node.properties.cm:name",
                                                renderFilter: [
                                                   {
                                                      property: "displayName",
                                                      renderOnAbsentProperty: true
                                                   }
                                                ]
                                             }
                                          }
                                       ]
                                    }
                                 }
                              ]
                           }
                        }
                     ]
                  }
               }
            ],
            widgetsButtons: [
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: this.message("contentService.delete.confirmation"),
                     publishTopic: responseTopic,
                     publishPayload: {
                        nodes: payload.nodes
                     }
                  }
               },
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: this.message("contentService.delete.cancellation"),
                     publishTopic: "close"
                  }
               }
            ]
         });
      },

      /**
       * This function is called when the user confirms that they wish to delete a document
       *
       * @instance
       * @param {object} payload An object containing the details of the document(s) to be deleted.
       */
      onActionDeleteConfirmation: function alfresco_services_ContentService__onActionDeleteConfirmation(payload) {
         this.alfUnsubscribeSaveHandles([this._actionDeleteHandle]);

         var nodeRefs = array.map(payload.nodes, function(item) {
            return item.nodeRef || item.node.nodeRef;
         });
         var responseTopic = this.generateUuid();
         var subscriptionHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onActionDeleteSuccess), true);

         this.serviceXhr({
            alfTopic: responseTopic,
            subscriptionHandle: subscriptionHandle,
            url: AlfConstants.PROXY_URI + "slingshot/doclib/action/files?alf_method=delete",
            method: "POST",
            data: {
               nodeRefs: nodeRefs
            }
         });
      },

      /**
       * This action will be called when documents are successfully deleted
       *
       * @instance
       * @param {object} payload
       */
      onActionDeleteSuccess: function alfresco_services_ContentService__onActionDeleteSuccess(payload) {
         var subscriptionHandle = lang.getObject("requestConfig.subscriptionHandle", false, payload);
         if (subscriptionHandle)
         {
            this.alfUnsubscribe(subscriptionHandle);
         }
         this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
            message: this.message("contentService.delete.success.message")
         });
         this.alfPublish("ALF_DOCLIST_RELOAD_DATA", {});
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
       * These are the widgets to render in a dialog for basic content upload (e.g. uploading new content
       * rather than updating the content of an existing Node). By default only a basic file selection
       * control will be displayed.
       *
       * @instance
       * @type {object[]}
       */
      widgetsForUpload: [
         {
            name: "alfresco/forms/controls/FileSelect",
            config: {
               label: "contentService.uploader.dialog.fileSelect.label",
               name: "files"
            }
         }
      ],

      /**
       * These are the widgets to render in a dialog when updating an existing Node. A file selection
       * control along with version increment radio buttons and comment text box are rendered.
       *
       * @instance
       * @type {object[]}
       */
      widgetsForUpdate: [
         {
            name: "alfresco/forms/controls/FileSelect",
            config: {
               label: "contentService.updater.dialog.fileSelect.label",
               name: "files"
            }
         },
         {
            name: "alfresco/forms/controls/RadioButtons",
            config: {
               label: "contentService.updater.dialog.majorVersion.label",
               name: "targetData.majorVersion",
               value: "false",
               optionsConfig: {
                  fixed: [
                     { label: "contentService.updater.dialog.majorVersion.false.label", value: "false" },
                     { label: "contentService.updater.dialog.majorVersion.true.label", value: "true" }
                  ]
               }
            }
         },
         {
            name: "alfresco/forms/controls/TextArea",
            config: {
               label: "contentService.updater.dialog.comments",
               name: "targetData.description",
               value: ""
            }
         }
      ],

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
      showUploader: function alfresco_services_ContentService__showUploader(/*jshint unused:false*/ payload) {

         // Check to see what we're uploading, either new content to a location or updating a 
         // specific node...
         var parentNodeRef = lang.getObject("parent.nodeRef", false, this._currentNode);
         var updateNodeRef = lang.getObject("node.nodeRef", false, payload);

         this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
            dialogTitle: (updateNodeRef ? "contentService.updater.dialog.title" : "contentService.uploader.dialog.title"),
            dialogConfirmationButtonTitle: "contentService.uploader.dialog.confirmation",
            dialogCancellationButtonTitle: "contentService.uploader.dialog.cancellation",
            formSubmissionTopic: "ALF_CONTENT_SERVICE_UPLOAD_REQUEST_RECEIVED",
            formSubmissionPayloadMixin: {
               targetData: {
                  destination: parentNodeRef,
                  siteId: null,
                  containerId: null,
                  uploadDirectory: null,
                  updateNodeRef: updateNodeRef,
                  description: "",
                  overwrite: false,
                  thumbnails: "doclib",
                  username: null
               }
            },
            widgets: (updateNodeRef ? lang.clone(this.widgetsForUpdate) : lang.clone(this.widgetsForUpload))
         });
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
         var responseTopic = this.generateUuid();
         this._uploadSubHandle = this.alfSubscribe(responseTopic, lang.hitch(this, this.onFileUploadComplete), true);
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
       * Handles requests to edit the basic metadata of the node provided.
       *
       * @instance
       * @param {object} payload An object containing the node to edit
       */
      onEditBasicMetadataRequest: function alfresco_services_ContentService__onEditBasicMetadataRequest(payload) {
         if (payload.node && payload.node.node)
         {
            var node = payload.node.node;
            // Check to see if properties are already available (this would be expected when used with
            // some Alfresco APIs but not others, e.g. Document Library APIs, but not Search APIs)...
            if (node.properties)
            {
               this.onEditBasicMetadata(node);
            }
            else if (node.nodeRef)
            {
               this.alfPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST", {
                  alfResponseTopic: "ALF_BASIC_METADATA",
                  nodeRef: node.nodeRef,
                  rawData: true
               });
            }
         }
         else
         {
            this.alfLog("warn", "A request was made to edit the properties of a node but no node or 'nodeRef' was provided", payload, this);
         }
      },

      /**
       * This function will be called in response to a documents details being successfully retrieved.
       *
       * @instance
       * @param {object} payload
       */
      onEditBasicMetadataReceived: function alfresco_services_ContentService__onEditBasicMetadataReceived(payload) {
         if (lang.exists("response.item.node", payload)) 
         {
            this.onEditBasicMetadata(payload.response.item.node);
         }
         this.alfLog("Error", "This method hasn't been implemented yet.");
      },

      /**
       * 
       * @instance
       * @param {object} node The node to display the metadata for
       */
      onEditBasicMetadata: function alfresco_services_ContentService__onEditBasicMetadata(node) {
         var dialogTitle = this.message("contentService.basicMetadata.dialog.title", {
            0: node.properties["cm:name"]
         });

         this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
            dialogId: "ALF_BASIC_METADATA_DIALOG",
            dialogTitle: dialogTitle,
            dialogConfirmationButtonTitle: "contentService.basicMetadata.confirmation",
            dialogCancellationButtonTitle: "contentService.basicMetadata.cancellation",
            formSubmissionTopic: "ALF_UPDATE_CONTENT_REQUEST",
            widgets: [
               {
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     name: "nodeRef",
                     value: node.nodeRef,
                     visibilityConfig: {
                        initialValue: false
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     label: "contentService.basicMetadata.name.label",
                     description: "contentService.basicMetadata.name.description",
                     name: "prop_cm_name",
                     value: node.properties["cm:name"],
                     requirementConfig: {
                        initialValue: true
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     label: "contentService.basicMetadata.title.label",
                     description: "contentService.basicMetadata.title.description",
                     name: "prop_cm_title",
                     value: node.properties["cm:title"]
                  }
               },
               {
                  name: "alfresco/forms/controls/TextArea",
                  config: {
                     label: "contentService.basicMetadata.description.label",
                     description: "contentService.basicMetadata.description.description",
                     name: "prop_cm_description",
                     value: node.properties["cm:description"]
                  }
               }
            ]
         });
      }
   });
});