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
 * Handles requests retrieve documents from the repository and publishes the details of them when they're
 * retrieved.
 *
 * @module alfresco/services/DocumentService
 * @extends module:alfresco/services/BaseService
 * @author Dave Draper
 * @author David Webster
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "service/constants/Default",
        "alfresco/core/PathUtils",
        "alfresco/core/NodeUtils",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/_base/array"],
        function(declare, BaseService, CoreXhr, topics, AlfConstants, PathUtils, NodeUtils, lang, domConstruct, array) {

   return declare([BaseService, CoreXhr, PathUtils], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/DocumentService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/DocumentService.properties"}],

      /**
       * Overrides the default setting for encoding URIs
       *
       * @instance
       * @type {boolean}
       * @default
       */
      encodeURIs: false,

      /**
       * The URL to the download API
       *
       * @instance
       * @type {String}
       * @default [AlfConstants.PROXY_URI + "api/internal/downloads"]
       * @todo should this be parameterised?
       */
      downloadAPI: AlfConstants.PROXY_URI + "api/internal/downloads",

      /**
       * The URL used to cancel document editing
       *
       * @instance
       * @type {String}
       * @default [AlfConstants.PROXY_URI + "cancel-checkout/node/"]
       * @todo should this be parameterised?
       */
      cancelEditAPI: AlfConstants.PROXY_URI + "slingshot/doclib/action/cancel-checkout/node/",

      /**
       * How many times should we retry a failed archive progress request?
       *
       * @instance
       * @type {int}
       * @default
       */
      maxArchiveProgressRetryCount: 6,

      /**
       * How often should we request an update on an Archive's progress?
       *
       * @instance
       * @type {int}
       * @default
       */
      archiveProgressUpdateInterval: 250,

      /**
       * How long should we wait before triggering a request on a failed progress update?
       *
       * @instance
       * @type {int}
       * @default
       */
      archiveProgressUpdateFailureInterval: 5000,

      /**
       *
       * @instance
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_DocumentService__registerSubscriptions() {
         // Bind to document topics:
         this.alfSubscribe(topics.GET_DOCUMENT, lang.hitch(this, this.onRetrieveSingleDocumentRequest));
         this.alfSubscribe(topics.GET_DOCUMENT_LIST, lang.hitch(this, this.onRetrieveDocumentsRequest));

         // Bind to archive topics:
         this.alfSubscribe(topics.REQUEST_ARCHIVE, lang.hitch(this, this.onRequestArchive));
         this.alfSubscribe(topics.REQUEST_ARCHIVE_PROGRESS, lang.hitch(this, this.onRequestArchiveProgress));
         this.alfSubscribe(topics.REQUEST_DELAYED_ARCHIVE_PROGRESS, lang.hitch(this, this.onRequestDelayedArchiveProgress));
         this.alfSubscribe(topics.DELETE_ARCHIVE, lang.hitch(this, this.onDeleteDownloadArchive));

         // Bind to download topics:
         this.alfSubscribe(topics.DOWNLOAD_AS_ZIP, lang.hitch(this, this.onDownloadAsZip));
         this.alfSubscribe(topics.DOWNLOAD_NODE, lang.hitch(this, this.onDownloadFile));
         this.alfSubscribe(topics.CANCEL_EDIT, lang.hitch(this, this.onCancelEdit));
         this.alfSubscribe(topics.GET_PARENT_NODEREF, lang.hitch(this, this.onGetParentNodeRef));
      },

      /**
       * Retrieves the details for a single document. This currently uses the Repository API and therefore won't collect any Share specific
       * information such as actions, etc. However this could be updated to use a new WebScript in the future.
       *
       * @instance
       * @param {object} payload The payload defining the document to retrieve the details for.
       */
      onRetrieveSingleDocumentRequest: function alfresco_services_DocumentService__onRetrieveSingleDocumentRequest(payload) {
         if (!payload || !payload.nodeRef)
         {
            this.alfLog("warn", "A request was made to retrieve the details of a document but no 'nodeRef' attribute was provided", payload, this);
         }
         else
         {
            var nodeRef = NodeUtils.processNodeRef(payload.nodeRef),
            targetNodeUri = nodeRef.uri;

            // Construct the URI for the request...
            var uriPart = payload.site ? "{type}/site/{site}/{container}" : "{type}/node/" + targetNodeUri;
            if (payload.filter && payload.filter.filterId === "path")
            {
               // If a path has been provided in the filter then it is necessary to perform some special
               // encoding. We need to ensure that the data is URI encoded, but we want to preserve the
               // forward slashes. We also need to "double encode" all % characters because FireFox has
               // a nasty habit of decoding them *before* they've actually been posted back... this
               // guarantees that the user will be able to bookmark valid URLs...
               var encodedPath = encodeURIComponent(payload.filter.filterData).replace(/%2F/g, "/").replace(/%25/g,"%2525");
               uriPart += this.combinePaths("/", encodedPath) + "/";
            }

            // View mode and No-cache
            var params = "?view=browse&noCache=" + new Date().getTime() + "&includeThumbnails=true";

            var alfTopic = payload.alfResponseTopic || "ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST";
            var url;
            if (payload.rawData === true)
            {
               url = AlfConstants.PROXY_URI + "slingshot/doclib2/node/" + targetNodeUri + params;
            }
            else
            {
               url = AlfConstants.URL_SERVICECONTEXT + "components/documentlibrary/data/node/" + targetNodeUri + params;
            }
            var config = {
               alfTopic: alfTopic,
               url: url,
               method: "GET",
               callbackScope: this,
               originalPayload: payload
            };
            this.serviceXhr(config);
         }
      },

      /**
       * Handles requests to retrieve documents. The payload should contain the following properties:
       *
       * path
       * type
       * site
       * container
       * filter
       * page
       * pageSize
       * sortAscending
       * sortField
       * rootNode
       *
       * @instance
       * @param {object} payload The payload published on the topic
       */
      onRetrieveDocumentsRequest: function alfresco_services_DocumentService__onRetrieveDocumentsRequest(payload) {
         // jshint maxcomplexity:false, maxstatements:false
         var targetNode = "alfresco://company/home",
             targetNodeUri = "alfresco/company/home";
         if (payload.nodeRef)
         {
            var nodeRef = NodeUtils.processNodeRef(payload.nodeRef);
            targetNode = payload.nodeRef;
            targetNodeUri = nodeRef.uri;
         }

         // Construct the URI for the request...
         var uriPart = payload.site ? "{type}/site/{site}/{container}" : "{type}/node/" + targetNodeUri;
         if (payload.filter && payload.filter.path)
         {
            // If a path has been provided in the filter then it is necessary to perform some special
            // encoding. We need to ensure that the data is URI encoded, but we want to preserve the
            // forward slashes. We also need to "double encode" all % characters because FireFox has
            // a nasty habit of decoding them *before* they've actually been posted back... this
            // guarantees that the user will be able to bookmark valid URLs...
            var encodedPath = encodeURIComponent(payload.filter.path).replace(/%2F/g, "/").replace(/%25/g,"%2525");
            uriPart += this.combinePaths("/", encodedPath);
         }

         // Unbelievably it is necessary to remove any trailing forward slashes otherwise the location
         // data set for each item will duplicate first element in the path !!!
         if (uriPart.lastIndexOf("/") === uriPart.length-1)
         {
            uriPart = uriPart.substring(0, uriPart.length-1);
         }

         // Build the URI stem
         var params = lang.replace(uriPart, {
            type: encodeURIComponent(payload.type),
            site: encodeURIComponent(payload.site),
            container: encodeURIComponent(payload.container)
         });

         if (payload.filter)
         {
            if (payload.filter.filter)
            {
               params += "?filter=" + payload.filter.filter;
            }
            else if (payload.filter.tag)
            {
               params += "?filter=tag&filterData=" + payload.filter.tag;
            }
            else if (payload.filter.category)
            {
               params += "?filter=category&filterData=" + payload.filter.category;
            }
            else
            {
               params += "?filter=path";
            }
         }

         // NOTE: It makes no sense for pageSize or page to be zero here in this if statement!
         if (payload.pageSize && payload.page)
         {
            params += "&size=" + payload.pageSize + "&pos=" + payload.page;
         }

         // Sort parameters
         params += "&sortAsc=" + payload.sortAscending + "&sortField=" + encodeURIComponent(payload.sortField);
         if (!payload.site)
         {
            if (payload.libraryRoot)
            {
               params += "&libraryRoot=" + encodeURIComponent(payload.libraryRoot);
            }
            else
            {
               // Repository mode (don't resolve Site-based folders)
               params += "&libraryRoot=" + encodeURIComponent(targetNode);
            }
         }

         // View mode and No-cache
         params += "&view=browse&noCache=" + new Date().getTime();

         var alfTopic = payload.alfResponseTopic || "ALF_RETRIEVE_DOCUMENTS_REQUEST";

         var url;
         if (payload.rawData === true)
         {
            url = AlfConstants.PROXY_URI + "slingshot/doclib2/doclist/" + params;
         }
         else
         {
            url = AlfConstants.URL_SERVICECONTEXT + "components/documentlibrary/data/doclist/" + params;
         }
         var config = {
            alfTopic: alfTopic,
            url: url,
            method: "GET",
            callbackScope: this
         };
         this.serviceXhr(config);
      },

      /**
       * 
       * @instance
       * @param {object} payload The payload containing the nodes to archive and download
       * @since 1.0.33
       */
      onDownloadAsZip: function alfresco_services_DocumentService__onDownloadAsZip(payload) {
         this.alfPublish("ALF_CREATE_DIALOG_REQUEST", {
            generatePubSubScope: true,
            dialogId: "ARCHIVING_DIALOG",
            dialogTitle: this.message("services.ActionService.ActionFolderDownload.title"),
            hideTopic: "ALF_CLOSE_DIALOG",
            widgetsContent: [
               {
                  name: "alfresco/renderers/Progress",
                  config: {
                     requestProgressTopic: topics.REQUEST_ARCHIVE,
                     progressFinishedTopic: [topics.DOWNLOAD_NODE, topics.DELETE_ARCHIVE],
                     nodes: payload.documents || [payload.document]
                  }
               }
            ],
            widgetsButtons: [
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: this.message("services.ActionService.button.cancel"),
                     additionalCssClasses: "alfresco-dialogs-AlfProgress cancellation call-to-action",
                     publishTopic: "ALF_CLOSE_DIALOG"
                  }
               }
            ],
            handleOverflow: true
         }, true);
      },

      /**
       * 
       * @instance
       * @param {object} payload
       */
      onRequestArchive: function alfresco_services_DocumentService__onRequestArchive(payload) {
         var nodes = payload.nodes,
             responseTopic = this.generateUuid();
         if (!nodes) 
         {
            this.alfLog("error", "No Nodes to generate Archive from");
         }
         else
         {
            var subscriptionHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onRequestArchiveSuccess));
            this.serviceXhr({
               alfTopic: responseTopic,
               subscriptionHandle: subscriptionHandle,
               url: this.downloadAPI,
               method: "POST",
               data: nodes,
               payload: payload
            });
         }
      },

      /**
       * Called when the initial request to create the Download Archive Succeeds.
       *
       * @instance
       * @param payload
       */
      onRequestArchiveSuccess: function alfresco_services_DocumentService__onRequestArchiveSuccess(payload) {
         this.alfLog("info", "Archive successfully requested");

         // Clean up listeners
         if (payload.subscriptionHandle) 
         {
            this.alfUnsubscribe(payload.subscriptionHandle);
         }

         var publishPayload = lang.getObject("requestConfig.payload", false, payload);
         if (!publishPayload) 
         {
            this.alfLog("error", "Unable to retrieve passed in payload from requestConfig.");
         }
         else
         {
            publishPayload.archiveNodeRef= lang.getObject("response.nodeRef", false, payload);
            if (!publishPayload.archiveNodeRef) 
            {
               this.alfLog("error", "archiveNodeRef missing from response object.");
            }
            else
            {
               // The archiving has started - now check the progress:
               this.alfPublish(topics.REQUEST_ARCHIVE_PROGRESS, publishPayload);
            }
         }
      },

      /**
       * Called when the initial request to create the Download Archive Fails.
       *
       * @instance
       * @param payload
       */
      onRequestArchiveFailure: function alfresco_services_DocumentService__onRequestArchiveFailure(payload) {
         // jshint unused:false
         this.alfLog("error", "Unable to request archive");
      },

      /**
       * Are we nearly there yet? Can we download the Archive yet?
       *
       * @instance
       * @param payload
       */
      onRequestArchiveProgress: function alfresco_services_DocumentService__onRequestArchiveProgress(payload) {
         // Payload varies depending on
         var progressRequestPayload = (payload.requestConfig) ? lang.getObject("requestConfig.progressRequestPayload", false, payload) : payload;
         // Check payload has archiveNodeRef in.
         if (!progressRequestPayload.archiveNodeRef)
         {
            this.alfLog("error", "Unable to retrieve nodeRef from payload: " + progressRequestPayload);
         }
         else
         {
            var responseTopic = this.generateUuid();
            // Remove old listeners before creating new ones.
            if (progressRequestPayload.subscriptionHandles)
            {
               this.alfUnsubscribe(progressRequestPayload.subscriptionHandles);
            }

            var subscriptionHandles = [
               this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onActionRequestArchiveProgressSuccess)),
               this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, this.onActionRequestArchiveProgressFailure))
            ];

            this.serviceXhr({
               alfTopic: responseTopic,
               subscriptionHandles: subscriptionHandles,
               progressRequestPayload: progressRequestPayload,
               url: this.downloadAPI + "/" + progressRequestPayload.archiveNodeRef.replace("://", "/") + "/status",
               method: "GET"
            });
         }
      },

      /**
       * @instance
       * @param {object} payload
       */
      onRequestDelayedArchiveProgress: function alfresco_services_DocumentService__onRequestDelayedArchiveProgress(payload) {
         this.alfPublishDelayed(topics.REQUEST_ARCHIVE_PROGRESS, payload, this.archiveProgressUpdateInterval);
      },

      /**
       * Handles the Archive progress response.
       *
       * @instance
       * @param payload
       */
      onActionRequestArchiveProgressSuccess: function alfresco_services_DocumentService__onActionRequestArchiveProgressSuccess(payload) {
         // Remove subscriptionListeners
         if (payload.subscriptionHandles)
         {
            this.alfUnsubscribe(payload.subscriptionHandles);
         }

         if (!(payload && payload.response && payload.response.status))
         {
            this.alfLog("error", "Archive Progress Response Status missing");
         }
         else
         {
            var status = payload.response.status;
            var progressRequestPayload = payload.requestConfig.progressRequestPayload;

            // Clean up the payload a little:
            payload.nodeRef = payload.requestConfig.progressRequestPayload.archiveNodeRef;
            switch (status)
            {
               case "PENDING":
                  // Check again in a little bit.
                  this.alfPublish(topics.REQUEST_DELAYED_ARCHIVE_PROGRESS, payload);
                  break;

               case "IN_PROGRESS":
                  // ok, we've got progress. Check again soon.
                  this.alfPublish(topics.REQUEST_DELAYED_ARCHIVE_PROGRESS, payload);

                  // Use the topic from the payload to notify the dialog of an update.
                  this.alfPublish(progressRequestPayload.progressUpdateTopic, payload);
                  break;

               case "DONE":
                  // Now we're ready to download.
                  this.alfPublish(progressRequestPayload.progressCompleteTopic, payload);
                  break;

               case "CANCELLED":
                  this.alfLog("info", "Archive cancelled");
                  this.alfPublish(progressRequestPayload.progressCancelledTopic, payload);
                  break;

               default:
                  // Pass on error status:
                  // e.g. status = "MAX_CONTENT_SIZE_EXCEEDED"
                  progressRequestPayload.errorMessage = status;
                  this.alfPublish(progressRequestPayload.progressErrorTopic, payload);
                  break;
            }
         }
      },

      /**
       *
       * Handles the Archive progress failure.
       *
       * @instance
       * @param payload
       */
      onActionRequestArchiveProgressFailure: function alfresco_services_DocumentService__onActionRequestArchiveProgressFailure(payload) {
         this.alfLog("warn", "Error getting archive progress: " + payload);

         // Remove subscriptionListeners
         if (payload.subscriptonHandles)
         {
            this.alfUnsubscribe(payload.subscriptionHandles);
         }

         var failureCount = payload.requestConfig.progressRequestPayload.failureCount || 0;
         if (failureCount < this.maxArchiveProgressRetryCount)
         {
            payload.requestConfig.progressRequestPayload.failureCount = ++failureCount;
            this.alfPublish(topics.REQUEST_DELAYED_ARCHIVE_PROGRESS, payload);
         }
         else
         {
            this.alfLog("warn", "Failed to get archive progress");
            this.alfPublish(topics.ARCHIVE_PROGRESS_FAILURE, payload);
         }
      },

      /**
       * Called to Delete a Download Archive, to clean up the server.
       *
       * @instance
       * @param payload
       */
      onDeleteDownloadArchive: function alfresco_services_DocumentService__onDeleteDownloadArchive(payload) {
         // TODO: Error handling? Handle Success?
         this.serviceXhr({
            url: this.downloadAPI + "/" + payload.nodeRef.replace("://", "/"),
            method: "delete"
         });
      },

      /**
       * Called to trigger an async file download.
       *
       * @instance
       * @param payload Payload supplied to the event
       */
      onDownloadFile: function alfresco_services_DocumentService__onDownloadFile(payload) {
         var nodeRefObj = NodeUtils.processNodeRef(payload.nodeRef);
         var fileName = payload.fileName || this.message("services.DocumentService.archiveName") + ".zip";
         var form = domConstruct.create("form");
         form.method = "GET";
         form.action = AlfConstants.PROXY_URI + "api/node/content/" + nodeRefObj.uri + "/" + encodeURIComponent(fileName);
         domConstruct.place(form, document.body);

         var iframe = domConstruct.create("iframe");
         iframe.style.display = "none";
         iframe.name = iframe.id = "downloadArchive_" + this.generateUuid();
         domConstruct.place(iframe, document.body);

         // makes it possible to target the frame properly in IE.
         window.frames[iframe.name].name = iframe.name;

         form.target = iframe.name;
         form.submit();
      },

      /**
       * Called to cancel the editing of a checked out file.
       *
       * @instance
       * @param {object} payload The payload supplied when the event was triggered.
       */
      onCancelEdit: function alfresco_services_DocumentService__onCancelEdit(payload) {
         if (payload.documents)
         {
            var nodes = NodeUtils.nodeRefArray(payload.documents);
            array.forEach(nodes, lang.hitch(this, this.onCancelEditNode, payload));
         }
         else if (payload.document)
         {
            this.onCancelEditNode(payload, payload.document);
         }
         else
         {
            this.alfLog("error", "Unable to cancel editing: 'documents' or 'document' missing from payload", payload, this);
         }
      },

      /**
       * Call the Alfresco Repository API to cancel the editing the node provided.
       *
       * @instance
       * @param {object} payload The original payload from the request.
       * @param {string} node The node to cancel the editing on.
       */
      onCancelEditNode: function alfresco_services_DocumentService__onCancelEditNode(payload, node) {
         if (node && node.nodeRef)
         {
            var nodeRefObj = NodeUtils.processNodeRef(node.nodeRef);
            var responseTopic = this.generateUuid();
            var subscriptionHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onCancelEditNodeSuccess));

            this.serviceXhr({
               alfTopic: responseTopic,
               responseScope: payload.alfResponseScope,
               subscriptionHandles: subscriptionHandle,
               url: this.cancelEditAPI + nodeRefObj.uri,
               method: "POST",
               data: {}
            });
         }
      },

      /**
       * Triggered when the cancel edit call succeeds.
       *
       * @instance
       * @param payload The payload from the request to cancel editing
       */
      onCancelEditNodeSuccess: function alfresco_services_DocumentService__onCancelEditNodeSuccess(payload) {
         this.alfPublish("ALF_DOCLIST_RELOAD_DATA", {}, false, false, payload.requestConfig.responseScope);
      },

      /**
       * Retrieve the nodeRef for a given node's parent, by requesting the details for that node.
       *
       * @instance
       * @param payload {Object} The publish event payload.
       */
      onGetParentNodeRef: function alfresco_services_DocumentService__onGetParentNodeRef(payload) {
         var responseTopic = this.generateUuid(),
            subscriptionHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onGetParentNodeRefSuccess));

         if (lang.isArray(payload.subscriptionHandles))
         {
            payload.subscriptionHandles.push(subscriptionHandle);
         }

         payload.alfResponseTopic = responseTopic;
         this.alfPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST", payload);
      },

      /**
       * Triggered by onGetParentNodeRef when the request returns successfully.
       * This method processes the response to pull out the parent node, then triggers the originalResponseTopic
       * that was passed into the request to get the parent nodeRef.
       *
       * @instance
       * @param payload {Object} The publish event payload.
       */
      onGetParentNodeRefSuccess: function alfresco_services_DocumentService__onGetParentNodeRefSuccess(payload) {
         var responseTopic = lang.getObject("requestConfig.originalPayload.originalResponseTopic", false, payload);
         if (responseTopic)
         {
            var parent = lang.getObject("response.item.parent", false, payload);
            if (!parent)
            {
               parent = lang.getObject("response.metadata.parent", false, payload);
            }
            if (parent)
            {
               var publishPayload = {
                  node: parent
               };
               this.alfPublish(responseTopic, publishPayload);
            }
            else
            {
               this.alfLog("error", "Could not retrieve parent node from response data.", payload, this);
            }
         }
         else
         {
            this.alfLog("error", "Unable to retrieve originalResponseTopic, so can't let the original caller know we have the parentNode Ref.", payload, this);
         }
      }
   });
});
