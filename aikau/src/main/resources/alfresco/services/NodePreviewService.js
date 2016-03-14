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
 * @module alfresco/services/NodePreviewService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 * @since 1.0.59
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "dojo/window",
        "dojo/_base/lang",
        "service/constants/Default"],
        function(declare, BaseService, AlfXhr, topics, win, lang, AlfConstants) {
   
   return declare([BaseService, AlfXhr], {
      
      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/NodePreviewService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/NodePreviewService.properties"}],

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
       * Sets up the subscriptions for the TagService
       * 
       * @instance 
       * @listens module:alfresco/core/topics#SHOW_NODE_PREVIEW
       */
      registerSubscriptions: function alfresco_services_NodePreviewService__registerSubscriptions() {
         this.alfSubscribe(topics.SHOW_NODE_PREVIEW, lang.hitch(this, this.checkNodeMetadata));
      },

      /**
       * 
       * @instance
       */
      checkNodeMetadata: function alfresco_services_NodePreviewService__checkNodeMetadata(payload) {
         var nodeRef = payload.nodeRef;
         var node = payload.node;
         var mimetype;
         if (node)
         {
            mimetype = lang.getObject("node.mimetype", false, node);
         }
         if (nodeRef && mimetype)
         {
            this.showPreview(nodeRef, mimetype);
         }
         else
         {
            this.onLoadNode(nodeRef);
         }
      },

      /**
       * Makes a reqeust to load all the data for the node. This is required for preview actions when data
       * is not available in the currentItem object.
       *
       * @instance
       * @param {string} nodeRef The nodeRef to reqeuest the details for
       *
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
       * Handles the loading of the complete node data.
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
            if (nodeRef && mimetype)
            {
               this.showPreview(nodeRef, mimetype);
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
       * Handles requests to show a preview of a node.
       *
       * @instance
       * @param {string} nodeRef The nodeRef of the node to preview
       * @param {string} mimetype The mimetype of the node
       */
      showPreview: function alfresco_services_NodePreviewService__showPreview(nodeRef, mimetype) {
         // Since we're going to be publishing to services we need to publish globally...
         this.publishGlobal = true;
         if (mimetype && mimetype.indexOf("image/") === 0)
         {
            // get last modified for image preview if present in the metadata
            var lastModified = lang.getObject(this.lastThumbnailModificationProperty, false, this.currentItem) || 1;
            this.publishTopic = topics.SHOW_LIGHTBOX;
            if (nodeRef)
            {
               this.publishPayload = {
                  src: AlfConstants.PROXY_URI + "api/node/" + nodeRef.replace(":/", "") +
                       "/content/thumbnails/imgpreview?c=force&lastModified=" + encodeURIComponent(lastModified),
                  title: this.imgTitle
               };
            }
            else
            {
               this.alfLog("warn", "Could not find a nodeRef to process", this.currentItem, this);
            }
         }
         else
         {
            // Because the content of the previewer will load asynchronously it's important that 
            // we set some dimensions for the dialog body, otherwise it will appear off-center
            var vs = win.getBox();
            this.publishTopic = topics.CREATE_DIALOG;
            this.publishPayload = {
               contentWidth: (vs.w*0.7) + "px",
               contentHeight: (vs.h-250) + "px",
               handleOverflow: false,
               dialogTitle: this.imgTitle,
               additionalCssClasses: "no-padding",
               widgetsContent: [
                  {
                     name: "alfresco/documentlibrary/AlfDocument",
                     config: {
                        widgets: [
                           {
                              name: "alfresco/preview/AlfDocumentPreview",
                              config: {
                                 heightMode: "DIALOG"
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
                        nodeRef: nodeRef
                     }
                  }
               ]
            };
         }
         this.alfPublish(this.publishTopic, this.publishPayload, this.publishGlobal, this.publishToParent);
      }
   });
});
