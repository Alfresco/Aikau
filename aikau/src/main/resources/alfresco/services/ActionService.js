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
 * This handles publications requesting to perform actions on documents. It instantiates a "legacy" YUI2 based
 * Alfresco.DocListToolbar widget which is delegated any actions that aren't explicitly handled by the service.
 * Over time this service should handle more and more of the core document actions as the old YUI2 code is phased
 * out. However, currently it just aliases those actions as well as any custom actions that are registered by
 * extensions.
 *
 * Custom actions prior to 4.2 were provided via the YAHOO.Bubbling.fire("registerAction" ...) event
 * where the target function accepted a single argument of the file to work with.
 *
 * "action.js" handles the registering of these functions.
 * "toolbar.js" augments its prototype with that of "action.js" to get all of the default action handlers
 * and in turn will be able to register additional handlers.
 *
 * Custom actions only supported single files in versions prior to 4.2
 *
 * @module alfresco/services/ActionService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @mixes module:alfresco/services/_NavigationServiceTopicMixin
 * @mixes module:alfresco/core/UrlUtilsMixin
 * @mixes module:alfresco/core/NotificationUtils
 * @author Dave Draper & David Webster
 */

define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "service/constants/Default",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/services/_NavigationServiceTopicMixin",
        "alfresco/core/UrlUtilsMixin",
        "alfresco/core/ArrayUtils",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/core/JsNode",
        "alfresco/core/NotificationUtils",
        "dojo/_base/lang"],
        function(declare, BaseService, AlfCoreXhr, topics, AlfConstants, _AlfDocumentListTopicMixin, _NavigationServiceTopicMixin, 
                 UrlUtilsMixin, ArrayUtils, ObjectTypeUtils, JsNode, NotificationUtils, lang) {

   // TODO: L18N sweep - lots of widgets defined with hard coded labels...

   return declare([BaseService, AlfCoreXhr, _AlfDocumentListTopicMixin, _NavigationServiceTopicMixin, UrlUtilsMixin, NotificationUtils], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/ActionService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/ActionService.properties"}],

      /**
       * This should be set when the current context is a site.
       *
       * @instance
       * @type {string}
       * @default
       */
      siteId: null,

      /**
       * This should be set when the current context is a site, typically this will be set to "documentlibrary"
       *
       * @instance
       * @type {string}
       * @default
       */
      containerId: null,

      /**
       * This can be set to either "NEW" or "CURRENT" to indicate whether or not a linked page is displayed
       * in the current or a new window/tab. This setting is only honoured if an action is not explicitly
       * configured with a target.
       * 
       * @instance
       * @type {string}
       * @default
       */
      currentTarget: "CURRENT",

      /**
       * This should be set if "siteId" is not set.
       *
       * @instance
       * @type {string}
       * @default
       */
      rootNode: null,

      /**
       * Sets up the subscriptions for the Action Service
       *
       * @instance
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_ActionService__registerSubscriptions() {
         // Normal processing...
         this.currentlySelectedDocuments = {};
         this.alfSubscribe(this.documentsLoadedTopic, lang.hitch(this, this.onDocumentsLoaded));
         this.alfSubscribe(this.metadataChangeTopic, lang.hitch(this, this.handleCurrentNodeChange));
         this.alfSubscribe(this.documentSelectedTopic, lang.hitch(this, this.onDocumentSelected));
         this.alfSubscribe(this.documentDeselectedTopic, lang.hitch(this, this.onDocumentDeselected));
         this.alfSubscribe(this.singleDocumentActionTopic, lang.hitch(this, this.handleSingleDocAction));
         this.alfSubscribe(this.syncLocationTopic, lang.hitch(this, this.onSyncLocation));
         this.alfSubscribe(this.unsyncLocationTopic, lang.hitch(this, this.onUnsyncLocation));

         this.alfSubscribe("ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST", lang.hitch(this, this.handleMultiDocLegacyAction));
         this.alfSubscribe("ALF_CREATE_CONTENT", lang.hitch(this, this.processActionObject));

         // Non-legacy action handlers...
         this.alfSubscribe("ALF_MOVE_DOCUMENTS", lang.hitch(this, this.onMoveDocuments));

         // Response handlers...
         this.alfSubscribe("ALF_ON_ACTION_EDIT_INLINE_SUCCESS", lang.hitch(this, this.onActionEditInlineSucess));
      },

      /**
       * Generic file action event handler
       *
       * @instance
       * @param layer {object} Event fired
       * @param args {array} Event parameters (depends on event type)
       */
      onFileAction: function alfresco_services_ActionService__onFileAction(layer, args) {
         var obj = args[1];
         if (obj)
         {
            if (!obj.multiple)
            {
               this.requestRefresh();
            }
         }
      },

      /**
       * @instance
       */
      requestRefresh: function alfresco_services_ActionService__requestRefresh() {
         this.alfPublish(this.reloadDataTopic, {});
      },

      /**
       * The primary purpose of this function is to reset the 'currentlySelectedDocuments' attribute.
       *
       * @instance
       * @param {object} payload The details of the documents loaded
       */
      onDocumentsLoaded: function alfresco_services_ActionService__onDocumentsLoaded(payload) {
         this.alfLog("log", "New Documents Loaded", payload);
         this.currentlySelectedDocuments = {};
         this.onSelectedFilesChanged();
      },

      /**
       * The current Node that content will be worked relative to.
       * @instance
       * @type {object}
       * @default
       */
      _currentNode: null,

      /**
       *
       * @instance
       */
      handleCurrentNodeChange: function alfresco_services_ActionService__handleCurrentNodeRefChange(payload) {
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
       * This function handles requests to perform an action on a single document. The action will be handled by the legacy action handler.
       *
       * @instance
       * @param payload
       */
      handleSingleDocAction: function alfresco_services_ActionService__handleSingleDocAction(payload) {
         this.alfLog("log", "Single document action request:", payload);
         if (payload &&
             payload.document &&
             payload.action)
         {
            if (typeof payload.action === "string")
            {
               if (typeof this[payload.action] === "function")
               {
                  // Then check the actions provided by this service...
                  this[payload.action](payload);
               }
               else
               {
                  this.alfLog("warn", "No handler implemented to handle this function", this);
               }
            }
            else if (typeof payload.action === "object")
            {
               // If the action is an object then it is assumed to contain information for processing
               // via the legacy toolbar.
               this.processActionObject(payload);
            }
         }
      },

      /**
       *
       * @instance
       * @param {object} payload The data passed in the request to perform the action.
       */
      handleMultiDocLegacyAction: function alfresco_services_ActionService__handleLegacyAction(payload) {
         this.alfLog("log", "Multiple document action request:", payload);
         if (typeof this[payload.action] === "function")
         {
            // NOTE: We want to avoid relying on the service to track currently selected documents, this
            //       is now handled AlfSelectedItemsMenuBarPopup...
            if (!payload.documents)
            {
               payload.documents = [];
               for (var nodeRef in this.currentlySelectedDocuments)
               {
                  if (this.currentlySelectedDocuments.hasOwnProperty(nodeRef))
                  {
                     payload.documents.push(this.currentlySelectedDocuments[nodeRef]);
                  }
               }
            }
            this[payload.action].call(this, payload);
         }
      },

      /**
       * This is used to keep track of the documents that are currently selected. It is initialised to an empty
       * array in the constructor, the onDocumentSelected function adds elements and the onDocumentDeselected
       * function removes them.
       *
       * @instance
       * @type {object}
       * @default
       */
      currentlySelectedDocuments: null,

      /**
       * This is used to keep a reference to a timeout that is started on the publication of a selected document
       * topic. It is important that multiple selection events can be captured so that only one publication of
       * selected items occurs. Otherwise the responsiveness ot the UI is degraded as each individual selection
       * event is processed (e.g. by [AlfDocumentActionMenuItems]{@link module:alfresco/documentlibrary/AlfDocumentActionMenuItem})
       *
       * @instance
       * @type {timeout}
       * @default
       */
      selectionTimeout: null,

      /**
       * Updates the aray of documents that are currently selected.
       * @instance
       * @param {object} payload The details of the document selected
       */
      onDocumentSelected: function alfresco_services_ActionService__onDocumentSelected(payload) {
         var payloadNoderef = payload && payload.value && payload.value.node && payload.value.node.nodeRef;
         if (payloadNoderef)
         {
            this.currentlySelectedDocuments[payloadNoderef] = payload.value;
            if (this.selectionTimeout)
            {
               clearTimeout(this.selectionTimeout);
            }
            this.selectionTimeout = setTimeout(lang.hitch(this, this.deferredSelectionHandler), 50);
         }
      },

      /**
       * This is called from [onDocumentSelected]{@link module:alfresco/services/ActionService#onDocumentSelected}
       * when the [selectionTimeout]{@link module:alfresco/services/ActionService#selectionTimeout} times out. It
       * rests the [selectionTimeout]{@link module:alfresco/services/ActionService#selectionTimeout} to null and
       * calls [onSelectedFilesChanged]{@link module:alfresco/services/ActionService#deselectionTimeout}
       *
       * @instance
       */
      deferredSelectionHandler: function alfresco_services_ActionService__deferredSelectionHandler() {
         this.onSelectedFilesChanged();
         this.selectionTimeout = null;
      },

      /**
       * Updates the array of documents that are currently selected.
       *
       * @instance
       * @param {object} payload The details of the document selected
       */
      onDocumentDeselected: function alfresco_services_ActionService__onDocumentDeselected(payload) {
         var payloadNoderef = payload && payload.value && payload.value.node && payload.value.node.nodeRef;
         if (payloadNoderef)
         {
            delete this.currentlySelectedDocuments[payloadNoderef];
            if (this.selectionTimeout)
            {
               clearTimeout(this.selectionTimeout);
            }
            this.selectionTimeout = setTimeout(lang.hitch(this, this.deferredSelectionHandler), 50);
         }
      },

      /**
       * Converts the currently selected documents object into an array for easier iteration.
       *
       * @instance
       */
      getSelectedDocumentArray: function alfresco_services_ActionService__getSelectedDocumentArray() {
         var a = [];
         for (var key in this.currentlySelectedDocuments)
         {
            if (this.currentlySelectedDocuments.hasOwnProperty(key))
            {
               a.push(this.currentlySelectedDocuments[key]);
            }
         }
         return a;
      },

      /**
       * Handle changes in file selection by updating the ActionService 'currentlySelectedDocuments' attribute
       * so that other handlers can apply actions to the appropriate files and then evaluates the permissions
       * and aspects on the selected files and publishes the details on the 'selectedDocumentsChangeTopic' attribute
       * topic to allow menus to filter actions appropriately.
       *
       * @instance
       */
      onSelectedFilesChanged: function alfresco_services_ActionService__onSelectedFilesChanged() {
         /*jshint maxcomplexity:false*/
         var files = this.getSelectedDocumentArray(), fileTypes = [], file,
             fileType, userAccess = {}, fileAccess, index,
             commonAspects = [], allAspects = [],
             i, ii, j, jj;

         var fnFileType = function(_file) {
            return (_file.node.isContainer ? "folder" : "document");
         };

         // Check each file for user permissions
         for (i = 0, ii = files.length; i < ii; i++)
         {
            file = files[i];

            // Required user access level - logical AND of each file's permissions
            fileAccess = file.node.permissions.user;
            for (index in fileAccess)
            {
               if (fileAccess.hasOwnProperty(index))
               {
                  userAccess[index] = (userAccess[index] === undefined ? fileAccess[index] : userAccess[index] && fileAccess[index]);
               }
            }

            // Make a note of all selected file types Using a hybrid array/object so we can use both array.length and "x in object"
            fileType = fnFileType(file);
            if (!(fileType in fileTypes))
            {
               fileTypes[fileType] = true;
               fileTypes.push(fileType);
            }

            // Build a list of common aspects
            if (i === 0)
            {
               // first time around fill with aspects from first node -
               // NOTE copy so we don't remove aspects from file node.
               commonAspects = lang.clone(file.node.aspects);
            } else
            {
               // every time after that remove aspect if it isn't present on the current node.
               for (j = 0, jj = commonAspects.length; j < jj; j++)
               {
                  if (!ArrayUtils.arrayContains(file.node.aspects, commonAspects[j]))
                  {
                     ArrayUtils.arrayRemove(commonAspects, commonAspects[j]);
                  }
               }
            }

            // Build a list of all aspects
            for (j = 0, jj = file.node.aspects.length; j < jj; j++)
            {
               if (!ArrayUtils.arrayContains(allAspects, file.node.aspects[j]))
               {
                  allAspects.push(file.node.aspects[j]);
               }
            }
         }

         // Publish the information about the actions so that menu items can be filtered...
         this.alfPublish(this.selectedDocumentsChangeTopic, {
            selectedFiles: files,
            userAccess: userAccess,
            commonAspects: commonAspects,
            allAspects: allAspects
         });
      },

      /**
       * This function handles requests to create new content. It handles content creation of 4 different types:
       * - pagelink (a link to another page within the application)
       * - link (a link to an external page)
       * - javascript (calls a JavaScript action handler)
       * - template (creates templated content)
       *
       * @instance
       * @param {object} payload The original payload requesting the action
       */
      processActionObject: function alfresco_services_ActionService__processActionObject(payload) {
         /*jshint maxcomplexity:false*/
         var action = payload.action;
         var document = payload.document;
         if (action && action.type)
         {
            if (action.type === "pagelink")
            {
               if (action.params.page)
               {
                  this.createPageLinkContent(action, document);
               }
               else
               {
                  this.alfLog("error", "A request was made to perform an action. The 'pagelink' type was requested, but no 'page' attribute was provided: ", action);
               }
            }
            else if (action.type === "link")
            {
               if (action.params.href)
               {
                  this.createLinkContent(action, document);
               }
               else
               {
                  this.alfLog("error", "A request was made to perform an action. The 'link' type was requested, but no 'href' attribute was provided: ", action);
               }
            }
            else if (action.type === "javascript")
            {
               if (action.params["function"])
               {
                  this.createJavaScriptContent(payload);
               }
               else
               {
                  this.alfLog("error", "A request was made to perform an action. The 'javascript' type was requested, but no 'function' attribute was provided: ", action);
               }
            }
            else if (action.type === "template")
            {
               if (action.params.sourceNodeRef)
               {
                  this.alfPublish("ALF_CREATE_TEMPLATE_CONTENT", {
                     sourceNodeRef: action.params.sourceNodeRef,
                     targetNodeRef: action.params.targetNodeRef,
                     templateType: action.params.templateType || "node",
                     name: action.params.name || "",
                     title: action.params.title || "",
                     description: action.params.description || "",
                     responseScope: payload.alfResponseScope
                  });
               }
               else
               {
                  this.alfLog("error", "A request was made to perform an action. The 'template' type was requested, but no 'nodeRef' attribute was provided: ", action);
               }
            }
            else
            {
               this.alfLog("error", "A request was made to perform an action, but an unknown 'type' was provided: ", action);
            }
         }
         else
         {
            this.alfLog("error", "A request was made to perform an action, but no 'type' was provided in the payload: ", action);
         }
      },

      /**
       * Links to another page within Share to handle the content creation.
       *
       * @instance
       * @param {object} payload
       * @param {object} document The document to perform the action using.
       */
      createPageLinkContent: function alfresco_services_ActionService__createPageLinkContent(payload, document) {
         var url = payload.params.page;
         if (document)
         {
            // TODO: Need to check other substitution points...
            url = lang.replace(url, document);
         }
         else if (this._currentNode)
         {
            url = lang.replace(url, { nodeRef: this._currentNode.parent.nodeRef});
         }

         var publishPayload = {
            type: this.pageRelativePath,
            url: url,
            target: this.currentTarget
            },
            site = lang.getObject("location.site.name", false, document);

         if (site)
         {
            publishPayload.site = site;
         }

         // Make a request to navigation to a the URL (relative to the Share page content) within the current window...
         this.alfPublish(this.navigateToPageTopic, publishPayload);
      },

      /**
       * Links to an external page to handle content creation.
       *
       * @instance
       * @param {object} payload The payload published on the requesting topic
       * @param {object} document The document to perform the action on.
       */
      createLinkContent: function alfresco_services_ActionService__createLinkContent(payload, document) {
         // Make a request to navigation to a the URL defined within the current window...
         var url = lang.replace(payload.params.href, this.getActionUrls(document, this.siteId, this.repositoryUrl, this.replicationUrlMapping));
         var indexOfTarget = url.indexOf("\" target=\"_blank");
         var target = "CURRENT";
         if (indexOfTarget !== -1)
         {
            url = url.substring(0, indexOfTarget);
            target = "NEW";
         }
         else if (this.currentTarget === "NEW")
         {
            target = "NEW";
         }
         this.alfPublish(this.navigateToPageTopic, {
            type: this.fullPath,
            url: url,
            target: target
         });
      },

      /**
       * Calls a JavaScript function to handle content creation.
       *
       * @instance
       * @param {object} payload The payload published on the requesting topic
       */
      createJavaScriptContent: function alfresco_services_ActionService__createJavaScriptContent(payload) {
         if (!payload.document)
         {
            // NOTE: Ideally we want to be avoid using a contextual _currentNode, we should be providing 
            //       all the data required by the service in the request, but this remains for legacy support
            var node = lang.clone(this._currentNode.parent);
            payload.document = {
               nodeRef: node.nodeRef,
               node: node,
               jsNode: new JsNode(node)
            };
         }

         // See if the requested function is provided by this service and if not delegate to the Alfresco.DocLibToolbar widget.
         var f = this[payload.action.params["function"]];
         if (typeof f === "function")
         {
            f.call(this, payload);
            // f.call(this, payload.action, [payload.document]);
         }
         else
         {
            this.alfLog("warn", "Could not find action handler", this, payload);
         }
      },

      /**
       * Handles requests to edit the basic metadata of the node provided.
       *
       * @instance
       * @param {object} payload The response from the request
       */
      onActionDetails: function alfresco_services_ActionService__onActionDetails(payload) {
         // Sometimes the node might be an array of nodes, can only edit the first...
         if (payload.document)
         {
            this.alfPublish("ALF_EDIT_BASIC_METADATA_REQUEST", payload);
         }
         else
         {
            this.alfLog("warn", "A request was made to edit the properties of a node but no node was provided", payload, this);
         }
      },

      /**
       * Handles requests to upload a new version of the supplied document.
       *
       * @instance
       * @param {object} payload The payload supplied on the original request
       */
      onActionUploadNewVersion: function alfresco_services_ActionService__onActionUploadNewVersion(payload) {
         // jshint unused:false
         // Call dialog service to open dialog with upload widget in.
         this.alfPublish("ALF_SHOW_UPLOADER", payload);
      },

      /**
       * Cancels Editing for checked out documents.
       *
       * @param {object} payload The payload supplied on the original request
       */
      onActionCancelEditing: function alfresco_services_ActionService__onActionCancelEditing(payload) {
         this.alfPublish("ALF_DOC_CANCEL_EDITING", payload);
      },

      /**
       * Handles requests to edit a document inline.
       *
       * @instance
       * @param {object} payload The response from the request
       * @param {object} document The document to edit.
       */
      onActionEditInline: function alfresco_services_ActionService__onActionEditInline(payload, document) {
         if (!document || !document.nodeRef)
         {
            this.alfLog("warn", "A request was made to edit the properties of a document but no document or 'nodeRef' attribute was provided", document, this);
         }
         else
         {
            // TODO: We're not yet setting up a failure response handler, this is just working on the golden path at the moment...
            this.alfPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST", {
               alfResponseTopic: "ALF_ON_ACTION_EDIT_INLINE",
               nodeRef: document.nodeRef,
               includeContent: true
            });
         }
      },

      /**
       * This function will be called in response to a documents details being successfully retrieved.
       *
       * @instance
       * @param {object} payload
       *
       * @fires ALF_CREATE_FORM_DIALOG_REQUEST
       */
      onActionEditInlineSucess: function alfresco_services_ActionService__onActionEditInlineSucess(payload) {
         if (!lang.exists("response.item.node", payload))
         {
            this.alfLog("warn", "When processing a request to display document properties, the expected 'response.item.node' attribute was not found", payload, this);
         }
         else
         {
            var node = lang.getObject("response.item.node", false, payload);
            var content = lang.getObject("response.itemContent", false, payload);

            this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
               dialogTitle: "Edit: " + node.properties["cm:name"],
               dialogConfirmationButtonTitle: "Save",
               dialogCancellationButtonTitle: "Cancel",
               formSubmissionTopic: "ALF_UPDATE_CONTENT_REQUEST",
               widgets: [
                  {
                     name: "alfresco/forms/controls/DojoValidationTextBox",
                     config: {
                        name: "nodeRef",
                        value: node.nodeRef,
                        visibilityConfig: {
                           initialValue: false
                        }
                     }
                  },
                  {
                     name: "alfresco/forms/controls/DojoValidationTextBox",
                     config: {
                        name: "prop_mimetype",
                        value: node.mimetype,
                        visibilityConfig: {
                           initialValue: false
                        }
                     }
                  },
                  {
                     name: "alfresco/forms/controls/DojoValidationTextBox",
                     config: {
                        name: "prop_app_editInline",
                        value: true,
                        visibilityConfig: {
                           initialValue: false
                        }
                     }
                  },
                  {
                     name: "alfresco/forms/controls/DojoValidationTextBox",
                     config: {
                        label: "Name",
                        description: "The name to give the new document",
                        name: "prop_cm_name",
                        value: node.properties["cm:name"],
                        requirementConfig: {
                           initialValue: true
                        }
                     }
                  },
                  {
                     name: "alfresco/forms/controls/DojoValidationTextBox",
                     config: {
                        label: "Title",
                        description: "The title to give to the new document",
                        name: "prop_cm_title",
                        value: node.properties["cm:title"]
                     }
                  },
                  {
                     name: "alfresco/forms/controls/TextArea",
                     config: {
                        label: "Description",
                        description: "A description of the folder",
                        name: "prop_cm_description",
                        value: node.properties["cm:description"]
                     }
                  },
                  {
                     name: "alfresco/forms/controls/AceEditor",
                     config: {
                        mimeType: node.mimetype,
                        label: "Content",
                        description: "The content for the document",
                        name: "prop_cm_content",
                        value: content
                     }
                  }
               ]
            });
         }
      },

      /**
       * Handles requests to edit the supplied document offline. This posts a request to the
       * "/slingshot/doclib/action/checkout/node/{store_type}/{store_id}" repository WebScript to
       * checkout the document. Successful requests are handled by the
       * [onActionEditOfflineSuccess]{@link module:alfresco/services/ActionsService#onActionEditOfflineSuccess} function
       * and failed requests are handled by the [onActionEditOfflineFailure]{@link module:alfresco/services/ActionsService#onActionEditOfflineFailure}
       * function.
       *
       * @instance
       * @param {object} payload The payload from the original action request
       */
      onActionEditOffline: function alfresco_services_ActionService__onActionEditOffline(payload) {
         // Document might be an array.
         var document = (ObjectTypeUtils.isArray(payload.document))? payload.document[0] : payload.document;
         if (document && document.node && document.node.nodeRef)
         {
            var data = {
               nodeRef: document.node.nodeRef
            };
            var config = {
               url: AlfConstants.PROXY_URI + "slingshot/doclib/action/checkout/node/" + data.nodeRef.replace("://", "/"),
               method: "POST",
               responseScope: payload.alfResponseScope,
               data: data,
               successCallback: this.onActionEditOfflineSuccess,
               failureCallback: this.onActionEditOfflineFailure,
               callbackScope: this
            };
            this.serviceXhr(config);
         }
         else
         {
            this.alfLog("error", "A request was made to edit a document offline, but the document supplied does not contain enough information", document);
         }
      },

      /**
       * This is the success callback handler from the XHR request made by [onActionEditOffline]{@link module:alfresco/services/ActionsService#onActionEditOffline}.
       * The success response should contain a download URL for the checked out document which is then passed to the browser
       * to automatically trigger a download of the document. A request is then published to reload the document list data.
       *
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      onActionEditOfflineSuccess: function alfresco_services_ActionService__onActionEditOfflineSuccess(response, originalRequestConfig) {
         this.alfLog("log", "Edit offline request success", response, originalRequestConfig);

         if (response &&
             response.results &&
             response.results.length > 0 &&
             response.results[0].downloadUrl)
         {
            this.displayMessage(this.message("message.edit-offline.success", {"0": response.results[0].id}));
            this.alfPublish(this.navigateToPageTopic, {
               url: AlfConstants.PROXY_URI + response.results[0].downloadUrl,
               type: this.fullPath
            });
            this.alfPublish(topics.RELOAD_DATA_TOPIC, {}, false, false, originalRequestConfig.responseScope);
         }
         else
         {
            this.alfLog("error", "A request to edit a document offline returned a successful response but did not provide a 'downloadUrl' attribute", response, originalRequestConfig);
         }
      },

      /**
       * This is the failure callback handler from the XHR request made by [onActionEditOffline]{@link module:alfresco/services/ActionsService#onActionEditOffline}.
       * It prompts the user with a message indicating that the document could not be checked out.
       *
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      onActionEditOfflineFailure: function alfresco_services_ActionService__onActionEditOfflineSuccess(response, originalRequestConfig) {
         this.alfLog("error", "Edit offline request failure", response, originalRequestConfig);
         this.displayMessage(this.message("message.edit-offline.failure", {"0": response.results[0].id}));
      },

      /**
       * Handles requests to copy the supplied documents to another location.
       *
       * @instance
       * @param {object} payload The payload from the original request
       */
      onActionCopyTo: function alfresco_services_ActionService__onActionCopyTo(payload) {
         this.alfPublish("ALF_COPY_OR_MOVE_REQUEST", {
            documents: payload.documents || [payload.document],
            copy: true,
            singleItemMode: true,
            responseScope: payload.alfResponseScope
         });
      },

      /**
       * Handles requests to move the supplied documents to another location.
       *
       * @instance
       * @param {object} payload The payload from the original request
       */
      onActionMoveTo: function alfresco_services_ActionService__onActionMoveTo(payload) {
         this.alfPublish("ALF_COPY_OR_MOVE_REQUEST", {
            documents: payload.documents || [payload.document],
            copy: false,
            dialogTitle: "services.ActionService.moveTo.title",
            confirmButtonLabel: "services.ActionService.moveTo.ok",
            singleItemMode: true,
            responseScope: payload.alfResponseScope
         });
      },

      /**
       * Handles requests to delete the supplied document.
       *
       * @instance
       * @param {object} payload The payload from the original request
       */
      onActionDelete: function alfresco_services_ActionService__onActionDelete(payload) {
         this.alfPublish(topics.DELETE_CONTENT, payload);
      },

      /**
       * Used by action handlers. Deletes subscription handle and reloads doclist.
       *
       * @instance
       * @param {object} payload
       */
      onActionCompleteSuccess: function alfresco_services_ActionService__onActionCompleteSuccess(payload) {
         var subscriptionHandle = lang.getObject("requestConfig.subscriptionHandle", false, payload);
         if (subscriptionHandle)
         {
            this.alfUnsubscribe(subscriptionHandle);
         }
         this.alfPublish("ALF_DOCLIST_RELOAD_DATA", {});
      },

      /**
       * Assign workflow.
       *
       * @instance
       * @param {object} payload The payload from the original request
       */
      onActionAssignWorkflow: function alfresco_services_ActionService__onActionAssignWorkflow(payload) {
         this.alfPublish("ALF_ASSIGN_WORKFLOW", {
            nodes: payload.documents || [payload.document],
            currentTarget: this.currentTarget
         });
      },

      /**
       * Handles requests to download multiple items as a single archive file. This is only expected to
       * be called as a multiple item selection action
       * 
       * @instance
       * @param {object} payload The payload from the original request
       * @since 1.0.33
       */
      onActionDownload: function alfresco_services_ActionService__onActionDownload(payload) {
         this.alfPublish(topics.DOWNLOAD_AS_ZIP, payload);
      },

      /**
       * Handles requests to start a folder download.
       *
       * @instance
       * @param {object} payload The payload from the original request
       */
      onActionFolderDownload: function alfresco_services_ActionService__onActionFolderDownload(payload) {
         this.alfPublish(topics.DOWNLOAD_AS_ZIP, payload);
      },

      /**
       *
       * @instance
       * @param {object} payload The payload from the original request
       */
      onActionManageAspects: function alfresco_services_ActionService__onActionManageAspects(payload) {
         this.alfPublish("ALF_MANAGE_ASPECTS_REQUEST", payload.document);
      },

      /**
       * Handles the "onActionSimpleRepoAction" that is used by multiple configured actions within Alfresco Share.
       * The publication that mapped to the "action" attribute is called. Currently this is only supporting the
       * "document-approve" and "document-reject" actions which are delegated to the 
       * [SimpleWorkflowService]{@link module:alfresco/services/actions/SimpleWorkflowService}.
       * 
       * @instance
       * @param {object} payload The payload from the original request
       */
      onActionSimpleRepoAction: function alfresco_services_ActionService__onActionSimpleRepoAction(payload) {
         switch (payload.action.id) {
            case "document-approve":
               this.alfPublish("ALF_APPROVE_SIMPLE_WORKFLOW", {
                  items: [payload.document],
                  action: payload.action.params.action,
                  responseScope: payload.alfResponseScope
               });
               break;
            case "document-reject":
               this.alfPublish("ALF_REJECT_SIMPLE_WORKFLOW", {
                  items: [payload.document],
                  action: payload.action.params.action,
                  responseScope: payload.alfResponseScope
               });
               break;
            default:
               this.alfLog("warn", "A simple repo action request was made but the action is unsupported", payload, this);
         }
      },

      /**
       *
       * @param {object} item The item to perform the action on
       */
      onActionLocate: function alfresco_services_ActionService__onActionLocate(payload) {
         this.alfPublish("ALF_LOCATE_DOCUMENT", {
            node: payload.document
         });
      }
   });
});