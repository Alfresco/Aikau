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
 * Renders a standard large thumbnail for a node.
 * 
 * @module alfresco/renderers/Thumbnail
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
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
        "dojo/window"], 
        function(declare, _WidgetBase, _TemplatedMixin, _JsNodeMixin, DraggableNodeMixin, NodeDropTargetMixin, 
                 _PublishPayloadMixin, _OnDijitClickMixin, template, AlfCore, _ItemLinkMixin, _AlfDndDocumentUploadMixin, 
                 AlfConstants, lang, event, domStyle, NodeUtils, win) {

   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _JsNodeMixin, DraggableNodeMixin, NodeDropTargetMixin, AlfCore, _ItemLinkMixin, _AlfDndDocumentUploadMixin, _PublishPayloadMixin], {
      
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
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * Additional CSS classes to apply to the main DOM node defined in the template
       * @instance
       * @type {string}
       * @default ""
       */
      customClasses: "",
      
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

         if (this.currentItem && this.currentItem.jsNode)
         {
            var jsNode = this.currentItem.jsNode;
            this.thumbnailUrl = this.generateThumbnailUrl();
            if (!this.currentItem.displayName)
            {
               this.currentItem.displayName = jsNode.properties["cm:name"];
            }
            this.setImageTitle();
         }
         else if (this.currentItem && this.currentItem.nodeRef)
         {
            this.imageIdProperty = "nodeRef";
            this.setImageTitle();

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
               if (this.thumbnailUrl === null)
               {
                  this.thumbnailUrl = AlfConstants.PROXY_URI + "api/node/" + nodeRef.uri + "/content/thumbnails/" + this.renditionName + "/?c=queue&ph=true&lastModified=" + this.currentItem.modifiedOn;
               }
            }
            else
            {
               this.thumbnailUrl = this.generateFallbackThumbnailUrl();
            }
         }
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
       * Sets the title to display over the thumbnail
       *
       * @instance
       */
      setImageTitle: function alfresco_renderers_Thumbnail__setImageTitle() {
         var title = this.currentItem[this.imageTitleProperty];
         if (title)
         {
            this.imgTitle = this.encodeHTML(title);
            this.imgAltText = title ? title.substring(title.lastIndexOf(".")) : "";
         }
         var id = this.currentItem[this.imageIdProperty];
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
       * The type of rendition to use for the thumbnail
       * @instance
       * @type {string} 
       * @default "doclib"
       */
      renditionName: "doclib",
      
      /**
       * 
       *
       * @instance
       * @type {string}
       * @default
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
         if (this.hasUploadPermissions() === true)
         {
            this.addUploadDragAndDrop(this.imgNode);
            this.addNodeDropTarget(this.imgNode);
         }

         // TODO: The following section could be somewhat refactored along with the code
         // in the SearchThumbnailMixin... this should be a task for 5.1...
         var type = lang.getObject("node.type", false, this.currentItem),
             mimetype = lang.getObject("node.mimetype", false, this.currentItem);
         if (this.showDocumentPreview && type === "cm:content")
         {
            // Since we're going to be publishing to services we need to publish globally...
            this.publishGlobal = true;

            if (mimetype && mimetype.indexOf("image/") === 0)
            {
               // get last modified for image preview if present in the metadata
               var lastModified = lang.getObject(this.lastThumbnailModificationProperty, false, this.currentItem) || 1;
               this.publishTopic = "ALF_DISPLAY_LIGHTBOX";
               var nodeRef = lang.getObject("nodeRef", false, this.currentItem);
               if (!nodeRef)
               {
                  nodeRef = lang.getObject("node.nodeRef", false, this.currentItem);
               }
               if (nodeRef)
               {
                  this.publishPayload = {
                     src: AlfConstants.PROXY_URI + "api/node/" + nodeRef.replace(":/", "") +
                          "/content/thumbnails/imgpreview?c=force&lastModified=" + encodeURIComponent(lastModified),
                     title: lang.getObject("displayName", false, this.currentItem)
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
                  dialogTitle: this.currentItem.displayName,
                  additionalCssClasses: "no-padding",
                  widgetsContent: [
                     {
                        name: "alfresco/documentlibrary/AlfDocument",
                        config: {
                           widgets: [
                              {
                                 name: "alfresco/preview/AlfDocumentPreview"
                              }
                           ]
                        }
                     }
                  ],
                  widgetsButtons: [
                     {
                        name: "alfresco/buttons/AlfButton",
                        config: {
                           label: this.message("searchThumbnail.preview.dialog.close"),
                           publishTopic: "NO_OP"
                        }
                     }
                  ],
                  publishOnShow: [
                     {
                        publishTopic: "ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST",
                        publishPayload: {
                           nodeRef: this.currentItem.nodeRef
                        }
                     }
                  ]
               };
            }
         }
         else if (!this.publishTopic)
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
         // var publishTopic = this.getPublishTopic();
         if (!this.publishTopic || lang.trim(this.publishTopic) === "")
         {
            this.alfLog("warn", "No publishTopic provided for PropertyLink", this);
         }
         else
         {
            var publishGlobal = (this.publishGlobal != null) ? this.publishGlobal : false;
            var publishToParent = (this.publishToParent != null) ? this.publishToParent : false;
            this.alfPublish(this.publishTopic, this.publishPayload, publishGlobal, publishToParent);
         }
      }
   });
});