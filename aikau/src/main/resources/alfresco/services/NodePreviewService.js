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
 * This service can be included in pages to handle the displaying previews of Nodes. By default the
 * [LightboxService]{@link module:alfresco/services/LightboxService} will be used to preview images
 * and all other Nodes will be shown using the 
 * [AlfDocumentPreview]{@link module:alfresco/preview/AlfDocumentPreview} via the
 * [DialogService]{@link module:alfresco/services/DialogService}. It is possible to override the 
 * services used through the configuration of this service to publish alternative 
 * [payloads]{@link module:alfresco/preview/AlfDocumentPreview#publishPayload} on
 * alternative [topics]{@link module:alfresco/preview/AlfDocumentPreview#publishTopic}. It is also 
 * possible to pass additional configuration to the 
 * [AlfDocumentPreview]{@link module:alfresco/preview/AlfDocumentPreview} widget.
 * 
 * @module alfresco/services/NodePreviewService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 * @since 1.0.59
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/ObjectProcessingMixin",
        "alfresco/core/topics",
        "dojo/window",
        "dojo/_base/lang",
        "service/constants/Default"],
        function(declare, BaseService, ObjectProcessingMixin, topics, win, lang, AlfConstants) {
   
   return declare([BaseService, ObjectProcessingMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/NodePreviewService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/NodePreviewService.properties"}],

      /**
       * The property to use for the image title. This will be displayed on lightboxes or dialogs used
       * to show previews by default.
       *
       * @instance
       * @type {string}
       * @default
       */
      imageTitleProperty: "displayName",

      /**
       * Defines any condition overrides for the previewer. This data is passed directly to the 
       * [previewer configuration]{@link module:alfresco/preview/AlfDocumentPreview#pluginConditionsOverrides}.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      pluginConditionsOverrides: null,

      /**
       * The proxy to use for the rest api call for the node's content or thumbnails. This is passed
       * directly to the [previewer configuration]{@link module:alfresco/preview/AlfDocumentPreview#proxy}.
       *
       * @instance
       * @type {string}
       * @default
       */
      proxy: "alfresco",

      /**
       * This is an alternative payload that will be published when showing a preview. This is the payload
       * that will be published on the [topic]{@link module:alfresco/services/NodePreviewService#publishTopic}
       * published by [showPreview]{@link module:alfresco/services/NodePreviewService#showPreview}.
       *
       * @instance
       * @type {object}
       * @default
       */
      publishPayload: null,

      /**
       * The topic to publish when displaying a preview. By default this publishes a request that is expected to
       * be handled by the [DialogService]{@link module:alfresco/services/DialogService}, however this could be
       * configured to be an alternative topic to ensure that previews are displayed differently. If this configuration
       * is changed from the default then it is likely that the 
       * [publishPayload]{@link module:alfresco/services/NodePreviewService#publishPayload} will also need to be
       * configured for the new topic.
       * 
       * @instance
       * @type {string}
       * @default [CREATE_DIALOG]{@link module:alfresco/topics#CREATE_DIALOG}
       */
      publishTopic: topics.CREATE_DIALOG,

      /**
       * Indicates whether or not XHR requests should be rooted directly to the Alfresco Repository
       * and bypass the Share web-tier.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      rawData: true,
      
      /**
       * Indicates whether or not the [LightboxService]{@link module:alfresco/services/LightboxService} (or
       * equivalent service) should be used for displaying image previews (i.e. Nodes that have a MIME
       * type that contains the text "image/").
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      useLightboxForImages: true,

      /**
       * Defines any plugin overrides for the previewer. This data is passed directly to the 
       * [previewer configuration]{@link module:alfresco/preview/AlfDocumentPreview#widgetsForPluginsOverrides}.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgetsForPluginsOverrides: null, 

      /**
       * Sets up the subscriptions for the TagService
       * 
       * @instance 
       * @listens module:alfresco/core/topics#SHOW_NODE_PREVIEW
       */
      registerSubscriptions: function alfresco_services_NodePreviewService__registerSubscriptions() {
         this.alfSubscribe(topics.SHOW_NODE_PREVIEW, lang.hitch(this, this.checkNodeMetadata));
      },

      /**
       * Checks the node provided in the payload argument. If no "node.mimetype" attribute is provided then
       * is will be necessary to load the full metadata for the Node (assuming that a "nodeRef" attribute
       * has been provided.)
       *
       * @instance
       * @param {object} payload The payload for the show preview request.
       */
      checkNodeMetadata: function alfresco_services_NodePreviewService__checkNodeMetadata(payload) {
         var nodeRef = payload.nodeRef;
         if (!nodeRef && payload.node)
         {
            // Check the node in the payload for a nodeRef if not specifically requested in the 
            // payload - this is useful when working against APIs that do not provide a separate
            // nodeRef attribute on the item...
            nodeRef = payload.node.nodeRef;
         }
         var node = payload.node;
         var mimetype;
         if (node)
         {
            mimetype = lang.getObject("mimetype", false, node);
         }
         if (nodeRef && mimetype)
         {
            var title = lang.getObject(this.imageTitleProperty, false, payload);
            this.showPreview({
               item: payload,
               nodeRef: nodeRef, 
               mimetype: mimetype,
               title: title
            });
         }
         else if (nodeRef)
         {
            this.onLoadNode(nodeRef);
         }
         else
         {
            this.alfLog("warn", "A request was made to show the preview for a node, but no 'nodeRef' was provided", payload, this);
         }
      },

      /**
       * Makes a request to load full metadata for the node. This is required for preview actions when MIME type
       * data is not available in the currentItem object.
       *
       * @instance
       * @param {string} nodeRef The nodeRef to reqeuest the details for
       * @fires module:alfresco/core/topics#GET_DOCUMENT
       */
      onLoadNode: function alfresco_services_NodePreviewService__onLoadNode(nodeRef) {
         if (nodeRef)
         {
            var responseTopic = this.generateUuid();
            var subscriptionHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onNodeLoaded), true);
            this.alfPublish(topics.GET_DOCUMENT, {
               subscriptionHandle: subscriptionHandle,
               alfResponseTopic: responseTopic,
               nodeRef: nodeRef,
               rawData: this.rawData
            }, true);
         }
         else
         {
            this.alfLog("warn", "No nodeRef supplied to use to retrieve all data.", this);
         }
      },

      /**
       * Handles the loading of the complete node metadat issued from 
       * [onLoadNode]{@link module:alfresco/services/NodePreviewService#onLoadNode}.
       * 
       * @instance
       * @param {object} payload 
       */
      onNodeLoaded: function alfresco_services_NodePreviewService__onNodeLoaded(payload) {
         this.alfUnsubscribe(payload.requestConfig.subscriptionHandle);
         var item = lang.getObject("response.item", false, payload);
         if (item) 
         {
            var nodeRef = lang.getObject("node.nodeRef", false, item);
            var mimetype = lang.getObject("node.mimetype", false, item);
            var title = lang.getObject(this.imageTitleProperty, false, item);
            if (nodeRef && mimetype)
            {
               this.showPreview({
                  item: item,
                  nodeRef: nodeRef, 
                  mimetype: mimetype,
                  title: title
               });
            }
            else
            {
               this.alfLog("warn", "A request was made to show a preview for a Node that has no MIME type", nodeRef, mimetype, this);
            }
         }
         else
         {
            this.alfLog("warn", "Node data was provided but the 'response.item' attribute was not found", payload, this);
         }
      },

      /**
       * Shows the preview of the Node.
       *
       * @instance
       * @param {object} previewData The data object for showing the preview
       * @param {object} previewData.item The item to be previewed (used for custom payloads)
       * @param {string} previewData.nodeRef The nodeRef of the node to preview
       * @param {string} previewData.mimetype The mimetype of the node
       * @param {string} previewData.title The mimetype of the node
       * @fires module:alfresco/core/topics#SHOW_LIGHTBOX
       * @fires module:alfresco/core/topics#CREATE_DIALOG
       */
      showPreview: function alfresco_services_NodePreviewService__showPreview(previewData) {
         // Ensure the current item is set from latest data before processing and publishing
         this.currentItem = previewData.item;
         
         // Since we're going to be publishing to services we need to publish globally...
         var publishPayload;
         if (this.useLightboxForImages && previewData.mimetype && previewData.mimetype.indexOf("image/") === 0)
         {
            // get last modified for image preview if present in the metadata
            var lastModified = 1;
            if (this.currentItem && this.lastThumbnailModificationProperty)
            {
               lastModified = lang.getObject(this.lastThumbnailModificationProperty, false, this.currentItem) || 1;
            }
            if (previewData.nodeRef)
            {
               publishPayload = {
                  src: AlfConstants.PROXY_URI + "api/node/" + previewData.nodeRef.replace(":/", "") +
                       "/content/thumbnails/imgpreview?c=force&lastModified=" + encodeURIComponent(lastModified),
                  title: previewData.title
               };
               this.alfServicePublish(topics.SHOW_LIGHTBOX, publishPayload);
            }
            else
            {
               this.alfLog("warn", "Could not find a nodeRef to process", this.currentItem, this);
            }
         }
         else if (this.publishPayload)
         {
            // Use a custom payload for displaying the preview.
            publishPayload = lang.clone(this.publishPayload);
            this.processObject(["processCurrentItemTokens","setCurrentItem"], publishPayload);
            this.alfServicePublish(this.publishTopic, publishPayload);
         }
         else
         {
            // Because the content of the previewer will load asynchronously it's important that 
            // we set some dimensions for the dialog body, otherwise it will appear off-center
            var vs = win.getBox();
            publishPayload = {
               contentWidth: (vs.w*0.7) + "px",
               contentHeight: (vs.h-250) + "px",
               handleOverflow: false,
               dialogId: "NODE_PREVIEW_SERVICE_DIALOG",
               dialogTitle: previewData.title,
               additionalCssClasses: "no-padding",
               widgetsContent: [
                  {
                     name: "alfresco/documentlibrary/AlfDocument",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/preview/AlfDocumentPreview",
                              config: {
                                 heightMode: (vs.h-250),
                                 pluginConditionsOverrides: this.pluginConditionsOverrides,
                                 proxy: this.proxy,
                                 widgetsForPluginsOverrides: this.widgetsForPluginsOverrides
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
                        label: this.message("close.node.preview.dialog"),
                        publishTopic: "NO_OP",
                        additionalCssClasses: "call-to-action"
                     }
                  }
               ],
               publishOnShow: [
                  {
                     publishTopic: topics.GET_DOCUMENT,
                     publishPayload: {
                        rawData: true,
                        nodeRef: previewData.nodeRef
                     }
                  }
               ]
            };
            this.alfServicePublish(this.publishTopic, publishPayload);
         }
      }
   });
});
