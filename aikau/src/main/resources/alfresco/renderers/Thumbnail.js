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
 * <p>Renders a thumbnail rendition of a node. This widget was originally written to support the
 * Alfresco Share Document Library but has been expanded to be the base module for all thumbnail
 * widgets. It attempts to make it possible to render thumbnails renditions or action them 
 * even when all that is available is the nodeRef of the node.</p>
 * <p>As well as providing basic actions for navigating a Document Library (e.g. clicking a folder
 * requests to display the content of that folder and clicking on a document links to the details
 * page that renders the document) it is also possible to configure custom actions along with the
 * ability to request a preview of the node be displayed.</p>
 *
 * @example <caption>Example configuration for use in Document Library:</caption>
 * {
 *    "name": "alfresco/renderers/Thumbnail"
 * }
 *
 * @example <caption>Example setting a fixed width for the imgpreview rendition:</caption>
 * {
 *    "name": "alfresco/renderers/Thumbnail",
 *    "config": {
 *       "renditionName": "imgpreview",
 *       "width": "200px"
 *    }
 * }
 *
 * @example <caption>Example requesting a preview when only nodeRef available:</caption>
 * {
 *    "name": "alfresco/renderers/Thumbnail",
 *    "config": {
 *       "assumeRendition": true,
 *       "showDocumentPreview": true
 *    }
 * }
 * 
 * @module alfresco/renderers/Thumbnail
 * @extends external:dijit/_WidgetBase
 * @mixes external:dijit/_TemplatedMixin
 * @mixes module:alfresco/renderers/_JsNodeMixin
 * @mixes module:alfresco/node/DraggableNodeMixin
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @mixes module:alfresco/node/NodeDropTargetMixin
 * @mixes module:dijit/_OnDijitClickMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "alfresco/renderers/_JsNodeMixin",
        "alfresco/node/DraggableNodeMixin",
        "alfresco/node/NodeDropTargetMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./templates/Thumbnail.html",
        "alfresco/core/Core",
        "alfresco/renderers/_ItemLinkMixin",
        "alfresco/documentlibrary/_AlfDndDocumentUploadMixin",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/_base/event",
        "dojo/dom-style",
        "alfresco/core/NodeUtils",
        "dojo/window",
        "dojo/Deferred",
        "dojo/when"], 
        function(declare, _WidgetBase, _TemplatedMixin, _JsNodeMixin, DraggableNodeMixin, NodeDropTargetMixin, 
                 _PublishPayloadMixin, _OnDijitClickMixin, template, AlfCore, _ItemLinkMixin, _AlfDndDocumentUploadMixin, 
                 AlfConstants, lang, event, domStyle, NodeUtils, win, Deferred, when) {

   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _JsNodeMixin, DraggableNodeMixin, NodeDropTargetMixin, AlfCore, _ItemLinkMixin, _AlfDndDocumentUploadMixin, _PublishPayloadMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Thumbnail.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Thumbnail.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Thumbnail.css"}]
       */
      cssRequirements: [{cssFile:"./css/Thumbnail.css"}],
      
      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * Additional CSS classes to apply to the main DOM node defined in the template
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      customClasses: "",
      
      /**
       * This allows a tokenized template to be defined where the tokens will be populated from
       * values in the "currentItem" attribute using the 
       * [processCurrentItemTokens function]{@link module:alfresco/core/ObjectProcessingMixin#processCurrentItemTokens}
       * from the [ObjectProcessingMixin]{@link module:alfresco/core/ObjectProcessingMixin} module. Note that the
       * thumbnail URL template is expected to be appended to the PROXY_URI for accessing an Alfresco Repository.
       * 
       * @instance
       * @type {string}
       * @default
       */
      thumbnailUrlTemplate: null,

      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Thumbnail__postMixInProperties() {
         this.imgId = "";
         this.thumbnailUrl = "";
         this.imgAltText = "";
         this.imgTitle = "";

         if (this.currentItem && this.thumbnailUrlTemplate)
         {
            // If we have an explicitly decared thumbnail URL template then use that initially, this
            // is used by the avatar thumbnail for example...
            this.thumbnailUrl = AlfConstants.PROXY_URI + this.processCurrentItemTokens(this.thumbnailUrlTemplate);
         }
         else if (this.currentItem && this.currentItem.jsNode)
         {
            var jsNode = this.currentItem.jsNode;
            this.thumbnailUrl = this.generateThumbnailUrl();

            var imageTitle = lang.getObject(this.imageTitleProperty, false, this.currentItem);
            if (!imageTitle)
            {
               this.currentItem.displayName = jsNode.properties["cm:name"];
            }
         }
         else if (this.currentItem && this.currentItem.nodeRef)
         {
            this.imageIdProperty = "nodeRef";

            // Fallback to just having a nodeRef available... this has been added to handle rendering of 
            // thumbnails in search results where full node information may not be available...
            var nodeRef = NodeUtils.processNodeRef(this.currentItem.nodeRef);
            if (this.currentItem.type === "folder")
            {
               this.thumbnailUrl = require.toUrl("alfresco/renderers") + "/css/images/" + this.folderImage;
            }
            else if (this.currentItem.type === "document" && nodeRef.uri)
            {
               this.thumbnailUrl = this.generateRenditionSpecificThumbnailUrl(nodeRef.uri);
               if (!this.thumbnailUrl)
               {
                  this.thumbnailUrl = AlfConstants.PROXY_URI + "api/node/" + nodeRef.uri + "/content/thumbnails/" + this.renditionName + "/?c=queue&ph=true&lastModified=" + this.currentItem.modifiedOn;
               }
            }
            else if (nodeRef && this.assumeRendition)
            {
               this.thumbnailUrl = AlfConstants.PROXY_URI + "api/node/" + nodeRef.uri + "/content/thumbnails/" + this.renditionName + "/?c=queue&ph=true";
            }
            else
            {
               this.thumbnailUrl = this.generateFallbackThumbnailUrl();
            }
         }
         else
         {
            this.thumbnailUrl = this.generateFallbackThumbnailUrl();
         }

         // Ensure that image title attributes, etc are set
         this.setImageTitle();
      },

      /**
       * The property to use for the image title. Defaults to "displayName"
       *
       * @instance
       * @type {string}
       * @default "displayName"
       */
      imageTitleProperty: "displayName",

      /**
       * The property to use for the image id. Defaults to "jsNode.nodeRef.nodeRef"
       * 
       * @instance
       * @type {string}
       * @default "jsNode.nodeRef.nodeRef"
       */
      imageIdProperty: "jsNode.nodeRef.nodeRef",

      /**
       * Indicates whether or not a preview of the node represented by the thumbnail should be
       * displayed when it is clicked. If this is set to true and there is not enough information
       * to determine whether or not the the node can be previewed then a request will be published
       * to retrieve that information.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      showDocumentPreview: false,

      /**
       * Some APIs provide very little information other than the nodeRef, however if we really
       * believe that the thumbnails are only going to be of something that has a rendition then
       * we can just "go for it" (all bets are really off though as to what we get back though
       * so this should only set to true when you're confident that a valid thumbnail rendition
       * will be available.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      assumeRendition: false,

      /**
       * The width to render the thumbnail. Units of measurement need to be provided, e.g.
       * "100px" for 100 pixels. The default is null, and if left as this the thumbnail will
       * be rendered at the original image size.
       *
       * @instance
       * @type {string}
       * @default null
       */
      width: null,

      /**
       * Sets the title to display over the thumbnail
       *
       * @instance
       */
      setImageTitle: function alfresco_renderers_Thumbnail__setImageTitle() {
         var title = lang.getObject(this.imageTitleProperty, false, this.currentItem);
         if (title)
         {
            this.imgTitle = this.encodeHTML(title);
            this.imgAltText = title ? title.substring(title.lastIndexOf(".")) : "";
         }
         var id = lang.getObject(this.imageIdProperty, false, this.currentItem);
         if (id)
         {
            this.imgId = id;
         }
      },

      /**
       * If a thumbnail URL cannot be determined then fallback to a standard image.
       *
       * @instance
       * @returns {string} The URL for the thumbnail.
       */
      generateFallbackThumbnailUrl: function alfresco_renderers_Thumbnail__generateFallbackThumbnailUrl() {
         return require.toUrl("alfresco/renderers") + "/css/images/filetypes/generic-file-48.png";
      },
      
      /**
       * The name of the folder image to use. Valid options are: "folder-32.png", "folder-48.png", "folder-64.png"
       * and "folder-256.png". The default is "folder-64.png".
       *
       * @instance
       * @type {string}
       * @default "folder-64.png"
       */
      folderImage: "folder-64.png",

      /**
       * Returns a URL to the image to use when rendering a folder
       * 
       * @instance
       */
      getFolderImage: function alfresco_renderers_Thumbnail__getDefaultFolderImage() {
         return require.toUrl("alfresco/renderers") + "/css/images/" + this.folderImage;
      },
      
      /**
       * The type of rendition to use for the thumbnail.
       * 
       * @instance
       * @type {string} 
       * @default "doclib"
       */
      renditionName: "doclib",
      
      /**
       * This property is used to determine whether or not a new version of the thumbnail needs
       * to be generated or if the cached version can be used.
       *
       * @instance
       * @type {string}
       * @default "jsNode.properties.cm:lastThumbnailModification"
       */
      lastThumbnailModificationProperty: "jsNode.properties.cm:lastThumbnailModification",

      /**
       * Generates the URL to use as the source of the thumbnail.
       * 
       * @instance
       * @param renditionName
       * @returns {string}
       */
      generateThumbnailUrl: function alfresco_renderers_Thumbnail__generateThumbnailUrl() {
         var url = null;
         if (!this.renditionName)
         {
            this.renditionName = "doclib";
         }
         if (this.currentItem && this.currentItem.jsNode)
         {
            var jsNode = this.currentItem.jsNode;
            if (jsNode.isContainer || (jsNode.isLink && jsNode.linkedNode.isContainer))
            {
               url = this.getFolderImage();
            }
            else
            {
               var nodeRef = jsNode.isLink ? jsNode.linkedNode.nodeRef : jsNode.nodeRef;
               url = this.generateRenditionSpecificThumbnailUrl(nodeRef.uri);
            }
         }
         if (!url)
         {
            url = AlfConstants.PROXY_URI + "api/node/" + nodeRef.uri + "/content/thumbnails/" + this.renditionName + "?c=queue&ph=true";
         }
         return url;
      },
      
      /**
       * Attempts to retrieve a thumbnail URL for a specific rendition. It ensures that the rendition has been
       * generated by inspecting that there is a timestamp for the [renditionName]{@link module:alfresco/renderers/Thumbnail#renditionName}
       * in the [modification property]{@link module:alfresco/renderers/Thumbnail#lastThumbnailModificationProperty}
       *
       * @instance
       * @param {string} nodeRefUri The URI compatible nodeRef value
       * @returns {string} The URL of the thumbnail if available
       */
      generateRenditionSpecificThumbnailUrl: function alfresco_renderers_Thumbnail__generateRenditionSpecificThumbnailUrl(nodeRefUri) {
         var url = null;
         var thumbnailModData = lang.getObject(this.lastThumbnailModificationProperty, false, this.currentItem);
         if (thumbnailModData)
         {
            for (var i = 0; i < thumbnailModData.length; i++)
            {
               if (thumbnailModData[i].indexOf(this.renditionName) !== -1)
               {
                  url = AlfConstants.PROXY_URI + "api/node/" + nodeRefUri + "/content/thumbnails/" + this.renditionName + "?c=queue&ph=true&lastModified=" + thumbnailModData[i];
                  break;
               }
            }
         }
         return url;
      },

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_Thumbnail__postCreate() {
         this.inherited(arguments);
         if (this.width)
         {
            domStyle.set(this.imgNode, "width", this.width);
         }
         if (this.hasUploadPermissions() === true)
         {
            this.addUploadDragAndDrop(this.imgNode);
            this.addNodeDropTarget(this.imgNode);
         }
      },

      /**
       * Handles the property being clicked. This stops the click event from propogating
       * further through the DOM (to prevent any wrapping anchor elements from triggering
       * browser navigation) and then publishes the configured topic and payload.
       *
       * @instance
       * @param {object} evt The details of the click event
       */
      onLinkClick: function alfresco_renderers_Thumbnail__onLinkClick(evt) {
         event.stop(evt);

         // TODO: Need to use a nodeRef property attribute that can be configured
         var nodeRef = lang.getObject("nodeRef", false, this.currentItem);
         if (!nodeRef)
         {
            nodeRef = lang.getObject("node.nodeRef", false, this.currentItem);
         }

         // Check to see if the thumbnail is configured to display previews when clicked,
         // this particular type of action could require an XHR request of the full node
         // data so it needs to be handled in a specific way...
         if (this.showDocumentPreview)
         {
            this.nodePromise = this.currentItem;
            var type = lang.getObject("node.type", false, this.currentItem),
                mimetype = lang.getObject("node.mimetype", false, this.currentItem);
            if (!type || !mimetype)
            {
               this.nodePromise = new Deferred();
               this.onLoadNode(nodeRef);
            }
            when(this.nodePromise, lang.hitch(this, this.onNodePromiseResolved, nodeRef));
         }
         else
         {
            this.onNonPreviewAction();
         }
      },

      /**
       * Handles non-preview related actions. Non-preview actions are encapsulated in their own function 
       * as requests for a preview might need to fallback to use them when an XHR request to obtain the
       * full node data reveals that a preview cannot be supported.
       *
       * @instance
       */
      onNonPreviewAction: function alfresco_renderers_Thumbnail__onNonPreviewAction() {
         if (!this.publishTopic)
         {
            // If no topic has been provided then set up a default one (presumed to be for use
            // in a document library)...
            this.publishPayload = {};
            this.publishTopic = this.generateFileFolderLink(this.publishPayload);
            this.publishGlobal = true;
         }
         else if (this.publishPayload)
         {
            // If a payload has been provided then use it...
            this.publishPayload = this.getGeneratedPayload(false, null);
         }

         // ...then do it.
         if (!this.publishTopic || lang.trim(this.publishTopic) === "")
         {
            this.alfLog("warn", "No publishTopic provided for PropertyLink", this);
         }
         else
         {
            var publishGlobal = this.publishGlobal !== false;
            var publishToParent = this.publishToParent !== false;
            this.alfPublish(this.publishTopic, this.publishPayload, publishGlobal, publishToParent);
         }
      },

      /**
       * This handles the resolution of the complete node data. This then inspects the node data to see
       * whether or not it is possible to display a preview.
       *
       * @instance
       * @param  {string} nodeRef  The nodeRef of the node to preview
       * @param  {object} nodeData The resolved node data.
       */
      onNodePromiseResolved: function alfresco_renderers_Thumbnail__onNodePromiseResolved(nodeRef, nodeData) {
         // First of all, update the currentItem with the full node data that has been resolved...
         this.currentItem = nodeData;

         // Now check to see whether or not the preview can be shown...
         var type = lang.getObject("node.type", false, this.currentItem),
             mimetype = lang.getObject("node.mimetype", false, this.currentItem);
         if (type === "cm:content")
         {
            this.onShowPreview(nodeRef, mimetype);
         }
         else
         {
            // Fallback to standard actions
            this.onNonPreviewAction();
         }
      },

      /**
       * Makes a reqeust to load all the data for the node. This is required for preview actions when data
       * is not available in the currentItem object.
       *
       * @instance
       * @param {string} nodeRef The nodeRef to reqeuest the details for
       */
      onLoadNode: function alfresco_renderers_Thumbnail__onLoadNode(nodeRef) {
         if (nodeRef)
         {
            // Generate a UUID for the response to the publication to ensure that only this widget
            // handles to the XHR data...
            var responseTopic = this.generateUuid();
            var subscriptionHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onNodeLoaded), true);
            this.alfPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST", {
               subscriptionHandle: subscriptionHandle,
               alfResponseTopic: responseTopic,
               nodeRef: nodeRef,
               rawData: true
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
      onNodeLoaded: function alfresco_renderers_Thumbnail__onNodeLoaded(payload) {
         this.alfUnsubscribe(payload.requestConfig.subscriptionHandle);
         if (lang.exists("response.item", payload)) 
         {
            if (this.nodePromise && typeof this.nodePromise.resolve === "function")
            {
               this.nodePromise.resolve(payload.response.item);
            }
         }
         else
         {
            this.alfLog("warn", "Node data was provided but the 'response.item' attribute was not found", payload, this);
         }
      },

      /**
       * Handles requests to show a preview of the node represented by the Thumbnail. By default this will only
       * show a lightbox image for image mimetypes and display a dialog containing a preview for all other mime types
       *
       * @instance
       * @param {string} nodeRef The nodeRef of the node to preview
       * @param {string} mimetype The mimetype of the node
       */
      onShowPreview: function alfresco_renderers_Thumbnail__onShowPreview(nodeRef, mimetype) {
         // Since we're going to be publishing to services we need to publish globally...
         this.publishGlobal = true;
         if (mimetype && mimetype.indexOf("image/") === 0)
         {
            // get last modified for image preview if present in the metadata
            var lastModified = lang.getObject(this.lastThumbnailModificationProperty, false, this.currentItem) || 1;
            this.publishTopic = "ALF_DISPLAY_LIGHTBOX";
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
            this.publishTopic = "ALF_CREATE_DIALOG_REQUEST";
            this.publishPayload = {
               contentWidth: (vs.w*0.7) + "px",
               contentHeight: (vs.h-64) + "px",
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
                        label: this.message("thumbnail.preview.dialog.close"),
                        publishTopic: "NO_OP"
                     }
                  }
               ],
               publishOnShow: [
                  {
                     publishTopic: "ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST",
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