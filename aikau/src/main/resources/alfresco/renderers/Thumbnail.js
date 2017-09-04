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
 * <p>Renders a thumbnail rendition of a node. This widget was originally written to support the
 * Alfresco Share Document Library but has been expanded to be the base module for all thumbnail
 * widgets. It attempts to make it possible to render thumbnails renditions or action them
 * even when all that is available is the nodeRef of the node.</p>
 * <p>As well as providing basic actions for navigating a Document Library (e.g. clicking a folder
 * requests to display the content of that folder and clicking on a document links to the details
 * page that renders the document) it is also possible to configure custom actions along with the
 * ability to request a preview of the node be displayed. <b>PLEASE NOTE:</b> If previews are to
 * be shown then the [NodePreviewService]{@link module:alfresco/services/NodePreviewService} should
 * be included on the page.</p>
 * <p>A thumbnail can also be configured to perform selection/de-selection action when clicked through
 * the configuration of the [selectOnClick]{@link module:alfresco/renderers/Thumbnail#selectOnClick}
 * and [onlySelectOnClick]{@link module:alfresco/renderers/Thumbnail#onlySelectOnClick} attributes.</p>
 * <p>It is possible to configure thumbnails so that images are
 * [cropped to fit]{@link module:alfresco/renderers/Thumbnail#cropToFit} or
 * [stretched to fit]{@link module:alfresco/renderers/Thumbnail#stretchToFit} so that no white space
 * is shown within the thumbnail. When images are not cropped or stretched the position of the image
 * can be controlled by configuring the [horizontal]{@link module:alfresco/renderers/Thumbnail#horizontalAlignment}
 * and [vertical]{@link module:alfresco/renderers/Thumbnail#verticallAlignment} to control where the
 * whitespace around the image appears.</p>
 *
 * @example <caption>Example configuration for use in Document Library:</caption>
 * {
 *    name: "alfresco/renderers/Thumbnail"
 * }
 *
 * @example <caption>Example setting a fixed width for the imgpreview rendition:</caption>
 * {
 *    name: "alfresco/renderers/Thumbnail",
 *    config: {
 *       renditionName: "imgpreview",
 *       width: "200px"
 *    }
 * }
 *
 * @example <caption>Example requesting a preview when only nodeRef available:</caption>
 * {
 *    name: "alfresco/renderers/Thumbnail",
 *    config: {
 *       assumeRendition: true,
 *       showDocumentPreview: true
 *    }
 * }
 *
 * @example <caption>Example thumbnail that only performs selection/deselection actions when clicked:</caption>
 * {
 *    name: "alfresco/renderers/Thumbnail",
 *    config: {
 *       selectOnClick: true,
 *       onlySelectOnClick: true
 *    }
 * }
 *
 * @example <caption>Example configuring full dimensions with a cropped image:</caption>
 * {
 *    name: "alfresco/renderers/Thumbnail",
 *    config: {
 *       dimensions: {
 *          w: "150px",
 *          h: "150px",
 *          margins: "5px"
 *       },
 *       cropToFit: true
 *    }
 * }
 *
 * @module alfresco/renderers/Thumbnail
 * @extends module:aikau/core/BaseWidget
 * @mixes external:dijit/_OnDijitClickMixin
 * @mixes module:alfresco/renderers/_JsNodeMixin
 * @mixes module:alfresco/node/DraggableNodeMixin
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @mixes module:alfresco/node/NodeDropTargetMixin
 * @mixes module:alfresco/node/ItemSelectionMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "alfresco/renderers/_JsNodeMixin",
        "alfresco/node/DraggableNodeMixin",
        "alfresco/node/NodeDropTargetMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "dijit/_OnDijitClickMixin",
        "alfresco/lists/ItemSelectionMixin",
        "alfresco/navigation/LinkClickMixin",
        "alfresco/renderers/_ItemLinkMixin",
        "service/constants/Default",
        "alfresco/core/topics",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/_base/event",
        "dojo/dom-class",
        "dojo/dom-style",
        "alfresco/core/NodeUtils",
        "dojo/window",
        "dojo/Deferred",
        "dojo/when"],
        function(declare, BaseWidget, _JsNodeMixin, DraggableNodeMixin, NodeDropTargetMixin,
                 _PublishPayloadMixin, _OnDijitClickMixin, ItemSelectionMixin, LinkClickMixin, _ItemLinkMixin,
                 AlfConstants, topics, array, lang, event, domClass, domStyle, NodeUtils, win, Deferred, when) {

   return declare([BaseWidget, _OnDijitClickMixin, _JsNodeMixin, DraggableNodeMixin, NodeDropTargetMixin,
                   _ItemLinkMixin, _PublishPayloadMixin, ItemSelectionMixin, LinkClickMixin], {

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
       * Some APIs provide very little information other than the nodeRef, however if we really
       * believe that the thumbnails are only going to be of something that has a rendition then
       * we can just "go for it" (all bets are really off though as to what we get back though
       * so this should only set to true when you're confident that a valid thumbnail rendition
       * will be available.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      assumeRendition: false,

      /**
       * If this is configured to be true then the image will be cropped within the thumbnail.
       * It does mean that aspect ratio of the image will be maintained but that not all of
       * the image will be visible.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      cropToFit: false,

      /**
       * Additional CSS classes to apply to the main DOM node defined in the template
       *
       * @instance
       * @type {string}
       * @default
       */
      customClasses: "",

      /**
       * The Dimensions object that defines the dimension attributes of the thumbnail. This will override
       * the default CSS styling.
       *
       * @typedef {Dimensions}
       * @property {string} [w] The width of the thumbnail
       * @property {string} [h] The height of the thumbnail
       * @property {string} [margin] The padding around the image
       */

      /**
       * This should be set to an object containing the starting dimensions of the thumbnail as well as optional
       * information on padding and whether the aspect ratio of the image should be maintained.
       *
       * @instance
       * @type {Dimensions}
       * @default
       * @since 1.0.40
       */
      dimensions: null,

      /**
       * Overrides the [mixed in default]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#dndUploadHighLightImage}
       * to use the smaller image.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.41
       */
      dndUploadHighlightImage: "elipse-cross.png",

      /**
       * Overrides the [mixed in default]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#dndUploadText}
       * to hide the upload message.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.41
       */
      dndUploadHighlightText: "",

      /**
       * The name of the folder image to use. Valid options are: "folder-32.png", "folder-48.png", "folder-64.png"
       * and "folder-256.png".
       *
       * @instance
       * @type {string}
       * @default
       */
      folderImage: "folder-64.png",

      /**
       * This is a mapping of aspects to folder images. It was added to support custom folder images for
       * Smart Folders but can be reconfigured as necessary. If no configuration is provided then a default
       * set of mappings will be assigned.
       *
       * @instance
       * @type {object}
       * @default
       * @since 1.0.66
       */
      folderImageAspectMappings: null,

      /**
       * This is a suffix to append to folder images matched according to the
       * [folderImageAspectMappings]{@link module:alfresco/renderers/Thumbnails#folderImageAspectMappings}.
       * Folder image sizes are typically "32", "48", "64" and "256". For backwards compatibility reasons, this
       * will only be used when a folder is matched to an entry in the
       * [folderImageAspectMappings]{@link module:alfresco/renderers/Thumbnails#folderImageAspectMappings}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.66
       */
      folderImageSize: "64",

      /**
       * Indicates whether or not the thumbnail image should be given a shadow effect.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      hasShadow: false,

      /**
       * Indicates how the thumbnail image should be aligned horizontally, the options are "LEFT",
       * "MIDDLE" and "RIGHT".
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.40
       */
      horizontalAlignment: "MIDDLE",

      /**
       * The property to use for the image id.
       *
       * @instance
       * @type {string}
       * @default
       */
      imageIdProperty: "jsNode.nodeRef.nodeRef",

      /**
       * This will be set to the height of the image node.
       *
       * @instance
       * @type {number}
       * @default
       * @since 1.0.40
       */
      imageNodeHeight: null,

      /**
       * This will be set to the width of the image node.
       *
       * @instance
       * @type {number}
       * @default
       * @since 1.0.40
       */
      imageNodeWidth: null,

      /**
       * The property to use for the image title.
       *
       * @instance
       * @type {string}
       * @default
       */
      imageTitleProperty: "displayName",

      /**
       * Overrides the [mixed in default]{@link module:alfresco/lists/ItemSelectionMixin#itemKey} to
       * set a value suitable for use with standard Alfresco Repository APIs (the default remains the
       * same for backwards compatibility).
       *
       * @instance
       * @type {string}
       * @default
       */
      itemKey: "node.nodeRef",

      /**
       * This property is used to determine whether or not a new version of the thumbnail needs
       * to be generated or if the cached version can be used.
       *
       * @instance
       * @type {string}
       * @default
       */
      lastThumbnailModificationProperty: "jsNode.properties.cm:lastThumbnailModification",

      /**
       * This will be set to the natural height of the displayed image.
       *
       * @instance
       * @type {number}
       * @default
       * @readonly
       * @since 1.0.40
       */
      naturalImageHeight: null,

      /**
       * This will be set to the natural width of the displayed image.
       *
       * @instance
       * @type {number}
       * @default
       * @readonly
       * @since 1.0.40
       */
      naturalImageWidth: null,

      /**
       * If this is configured to be true then this will ensure that click actions only perform a
       * selection action. However, this also requires that the
       * [selectOnClick]{@link module:alfresco/renderers/Thumbnail#selectOnClick} attribute also
       * be configured to be true.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      onlySelectOnClick: false,

      /**
       * The type of rendition to use for the thumbnail.
       *
       * @instance
       * @type {string}
       * @default
       */
      renditionName: "doclib",

      /**
       * Overrides the [mixed in default]{@link module:alfresco/lists/ItemSelectionMixin#selectOnClick} to
       * disable selection on click by default.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      selectOnClick: false,

      /**
       * Indicates whether or not selection publication and subscriptions are made using the global scope.
       * This is only used when either [selectOnClick]{@link module:alfresco/renderers/Thumbnail#selectOnClick}
       * or [updateOnSelection]{@link module:alfresco/renderers/Thumbnail#updateOnSelection} are configured
       * to be true.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      selectionPublishGlobal: false,

      /**
       * Indicates whether or not selection publication and subscriptions are made using the parent scope.
       * This is only used when either [selectOnClick]{@link module:alfresco/renderers/Thumbnail#selectOnClick}
       * or [updateOnSelection]{@link module:alfresco/renderers/Thumbnail#updateOnSelection} are configured
       * to be true.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      selectionPublishToParent: false,

      /**
       * Indicates whether or not a preview of the node represented by the thumbnail should be
       * displayed when it is clicked. If this is set to true and there is not enough information
       * to determine whether or not the node can be previewed then a request will be published
       * to retrieve that information.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      showDocumentPreview: false,

      /**
       * This indicates whether or not the aspect ratio of the thumbnail will be retained. This means that
       * for images will be stretched to ensure that there is no white-space visible. However unlike
       * [cropToFit]{@link module:alfresco/renderers/Thumbnail#cropToFit} the entire image will be visible
       * although possible distorted. If no [dimensions]{@link module:alfresco/renderers/Thumbnail#dimensions}
       * are provided then the aspect ratio will always be maintained and the image will not be stretched.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      stretchToFit: false,

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
       * Overrides the [mixed in default]{@link module:alfresco/lists/ItemSelectionMixin#updateOnSelection} to
       * not set up the item selection listeners. If this is configured to be true then the thumbnail will be
       * highlighted when the item it represents is selected.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      updateOnSelection: false,

      /**
       * It is recommended that [NodePreviewService]{@link module:alfresco/services/NodePreviewService} is used
       * for displaying previews. For backwards compatibility reasons this is not the default configuration but
       * it is expected to become the default in the next major release.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.59
       */
      usePreviewService: false,

      /**
       * Indicates how the thumbnail image should be aligned vertically, the options are "TOP",
       * "MIDDLE" and "BOTTOM".
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.40
       */
      verticalAlignment: "TOP",

      /**
       * The width to render the thumbnail. Units of measurement need to be provided, e.g.
       * "100px" for 100 pixels. The default is null, and if left as this the thumbnail will
       * be rendered at the original image size. This is shorthand configuration when not
       * providing full [dimensions]{@link module:alfresco/renderers/Thumbnail#dimensions}.
       *
       * @instance
       * @type {string}
       * @default
       */
      width: null,

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_Thumbnail__createWidgetDom() {
         this.thumbnailNode = this.domNode = document.createElement("span");
         this.domNode.classList.add("alfresco-renderers-Thumbnail");
         domClass.add(this.domNode, this.customClasses);

         this.frameNode = document.createElement("span");
         this.frameNode.classList.add("alfresco-renderers-Thumbnail__frame");
         this._attach(this.frameNode, "ondijitclick", lang.hitch(this, this.onLinkClick));

         this.imgNode = document.createElement("img");
         this.imgNode.classList.add("alfresco-renderers-Thumbnail__image");
         this.imgNode.setAttribute("id", this.imgId);
         this.imgNode.setAttribute("src", this.thumbnailUrl);
         this.imgNode.setAttribute("alt", this.imgAltText);
         this.imgNode.setAttribute("title", this.imgTitle);
         this._attach(this.imgNode, "onload", lang.hitch(this, this.getNaturalImageSize));

         this.frameNode.appendChild(this.imgNode);
         this.domNode.appendChild(this.frameNode);
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/ItemSelectionMixin#getSelectionPublishGlobal}
       * to return [selectionPublishGlobal]{@link module:alfresco/renderers/Thumbnail#selectionPublishGlobal} to
       * avoid conflicts with scope configuration for other events (such as linking and showing previews).
       *
       * @instance
       * @overridable
       * @return {boolean} A boolean indicating whether or not to publish and subscribe to selection topics globally.
       */
      getSelectionPublishGlobal: function alfresco_lists_Thumbnail__getSelectionPublishGlobal() {
         return this.selectionPublishGlobal;
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/ItemSelectionMixin#getSelectionPublishToParent}
       * to return [selectionPublishToParent]{@link module:alfresco/renderers/Thumbnail#selectionPublishToParent} to
       * avoid conflicts with scope configuration for other events (such as linking and showing previews).
       *
       * @instance
       * @overridable
       * @return {boolean}  A boolean indicating whether or not to publish and subscribe to selection topics to the parent scope.
       */
      getSelectionPublishToParent: function alfresco_lists_Thumbnail__getSelectionPublishToParent() {
         return this.selectionPublishToParent;
      },

      /**
       * Set up the attributes to be used when rendering the template.
       *
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Thumbnail__postMixInProperties() {
         // jshint maxcomplexity:false
         this.imgId = "";
         this.thumbnailUrl = "";
         this.imgAltText = "";
         this.imgTitle = "";

         // See AKU-941 - support for smart folders
         if (!this.folderImageAspectMappings)
         {
            this.folderImageAspectMappings = {
               "smf:smartFolder": "alfresco/renderers/css/images/filetypes/smart-folder"
            };
         }

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
         else if (this.currentItem && (lang.getObject(this.itemKey, false, this.currentItem) || lang.getObject("nodeRef", false, this.currentItem)))
         {
            var nodeRefData = lang.getObject(this.itemKey, false, this.currentItem);
            if (!nodeRefData)
            {
               nodeRefData = lang.getObject("nodeRef", false, this.currentItem);
            }
            this.imageIdProperty = this.itemKey || "nodeRef";

            // Fallback to just having a nodeRef available... this has been added to handle rendering of
            // thumbnails in search results where full node information may not be available...
            var nodeRef = NodeUtils.processNodeRef(nodeRefData);
            if (this.currentItem.type === "folder")
            {
               this.thumbnailUrl = require.toUrl("alfresco/renderers/css/images/" + this.folderImage);
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
       * Returns a URL to the image to use when rendering a folder
       *
       * @instance
       */
      getFolderImage: function alfresco_renderers_Thumbnail__getDefaultFolderImage() {
         var url, jsNode = this.currentItem.jsNode;
         if(jsNode && jsNode.aspects)
         {
            array.some(jsNode.aspects, function(aspect) {
               var mappedImage = this.folderImageAspectMappings[aspect];
               if(mappedImage)
               {
                  var image = mappedImage + "-" + this.folderImageSize + ".png";
                  url = require.toUrl(image);
               }
               return !!mappedImage;
            }, this);

         }
         if (!url)
         {
            url = require.toUrl("alfresco/renderers/css/images/" + this.folderImage);
         }
         return url;
      },

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
         this.createItemSelectionSubscriptions();
         if (this.width)
         {
            domStyle.set(this.imgNode, "width", this.width);
         }
         if (this.hasUploadPermissions() === true)
         {
            this.addUploadDragAndDrop(this.frameNode);
            this.addNodeDropTarget(this.frameNode);
            this._currentNode = this.currentItem.node;
         }
         // If no full dimensions have been provided but a simple width has then
         // just use that to derive the full thumbnail dimensions...
         if (!this.dimensions && this.width)
         {
            this.dimensions = {
               w: this.width
            };
         }
         this.resize(this.dimensions);

         // Apply some additional styling...
         if (this.hasShadow && !lang.getObject("node.isContainer", false, this.currentItem))
         {
            domClass.add(this.domNode, "alfresco-renderers-Thumbnail--shadow");
         }
         if (this.horizontalAlignment === "LEFT")
         {
            domClass.add(this.domNode, "alfresco-renderers-Thumbnail--left");
         }
         if (this.horizontalAlignment === "RIGHT")
         {
            domClass.add(this.domNode, "alfresco-renderers-Thumbnail--right");
         }
         if (this.verticalAlignment === "MIDDLE")
         {
            domClass.add(this.domNode, "alfresco-renderers-Thumbnail--middle");
         }
         if (this.verticalAlignment === "BOTTOM")
         {
            domClass.add(this.domNode, "alfresco-renderers-Thumbnail--bottom");
         }
      },

      /**
       * This sizes the thumbnail based on the dimensions that have been provided. It is
       * entirely possible to size the thumbnail with just a width (dimensions.w) however
       * a height (dimensions.h) and margin (dimensions.margin) can also be provided.
       *
       * @instance
       * @param {Dimensions} dimensions
       * @since 1.0.40
       */
      resize: function alfresco_renderers_Thumbnail__resize(dimensions) {
         if (this.imgNode && dimensions && dimensions.w)
         {
            // Get the height and width for the outer thumbnail frame...
            var thumbnailWidth = parseInt(dimensions.w, 10);
            var thumbnailHeight = thumbnailWidth;
            if (dimensions.h)
            {
               thumbnailHeight = parseInt(dimensions.h, 10);
            }

            // Get the margin and border (in order to calculate the appropriate
            // inner image size)...
            var margin = 0;
            if (dimensions.margin)
            {
               margin = parseInt(dimensions.margin, 10);
            }

            // Calcuate the image dimensions...
            var borderThickness = 0;
            try
            {
               // See AKU-1164 - need to defensively code around this call...
               borderThickness = parseInt(domStyle.get(this.imgNode, "borderWidth"), 10);
            }
            catch (e)
            {
               // No action required, leave as default...
            }

            this.imageNodeHeight = thumbnailHeight - ((margin * 2) + borderThickness);
            this.imageNodeWidth = thumbnailWidth - ((margin * 2) + borderThickness);

            // Update the thumbnail nodes...
            domStyle.set(this.thumbnailNode, {
               "width": thumbnailWidth + "px",
               "height": thumbnailHeight + "px"
            });
            domStyle.set(this.frameNode, {
               "width": thumbnailWidth + "px",
               "height": thumbnailHeight + "px",
               "lineHeight": thumbnailHeight + "px"
            });
            domStyle.set(this.imgNode, "margin", margin + "px");

            if (this.cropToFit)
            {
               // If cropping to fit we require the natural image width and height to be available
               // (which are set on image load)...
               this.naturalImageWidth && this.naturalImageHeight && this.cropImage();
            }
            else if (this.stretchToFit)
            {
               // If stretching we use the width as the minimum height, this will stretch landscape
               // images vertically...
               domStyle.set(this.imgNode, {
                  "width": this.imageNodeWidth + "px",
                  "minHeight": this.imageNodeWidth + "px",
                  "maxHeight": "none",
                  "maxWidth": "none"
               });
            }
            else
            {
               // Otherwise just allow the image to maintain its natural aspect ratio with white
               // space showing...
               domStyle.set(this.imgNode, {
                  "maxWidth": this.imageNodeWidth + "px",
                  "maxHeight": this.imageNodeHeight + "px"
               });
            }
         }
      },

      /**
       * This function is used to configure the thumbnail DOM model so that the image is cropped and
       * centered within the thumbnail. It relies on
       * [getNaturalImageSize]{@link module:alfresco/renderers/Thumbnail#getNaturalImageSize}
       * having been called to establish the orientation of the image. Therefore it is important that
       * this is only called when the natural image dimensions have been established.
       *
       * @instance
       * @since 1.0.40
       */
      cropImage: function alfresco_renderers_Thumbnail__cropImage() {
         domStyle.set(this.frameNode, {
            position: "relative",
            overflow: "hidden",
            textAlign: "left"
         });

         // When cropping the image we need to know whether we want to crop off the top and bottom (if the image
         // is in portrait) or off the sides (if the image is in landscape)...
         if (this.naturalImageHeight > this.naturalImageWidth)
         {
            // For portrait images...
            // The offset is the half of the amount that that the image is taller than it is wide...
            var vOffset = ((this.imageNodeWidth / (this.naturalImageWidth / this.naturalImageHeight)) - this.imageNodeWidth) / 2;
            domStyle.set(this.imgNode, {
               "width": this.imageNodeWidth + "px",
               "position": "absolute",
               "margin": "auto",
               "maxHeight": "none",
               "maxWidth": "none",
               "top": "-" + vOffset + "px"
            });
         }
         else
         {
            // For landscape images...
            // The offset is half the amount that the image is wider than it is tall...
            var hOffset = ((this.imageNodeHeight / (this.naturalImageHeight / this.naturalImageWidth)) - this.imageNodeHeight) / 2;
            domStyle.set(this.imgNode, {
               "height": this.imageNodeHeight + "px",
               "position": "absolute",
               "margin": "auto",
               "maxHeight": "none",
               "maxWidth": "none",
               "left": "-" + hOffset + "px"
            });
         }
         this.croppedToFit = true;
      },

      /**
       * This function is called when the thumbnail image has been loaded and is used to store the
       * natural height and width of the image. This allows us to work out whether or not the image
       * is in portrait or landscape and allows [cropImage]{@link module:alfresco/renderers/Thumbnail#cropImage}
       * to determine the position and size of the image.
       *
       * @instance
       * @since 1.0.40
       */
      getNaturalImageSize: function alfresco_renderers_Thumbnail__getNaturalImageSize() {
         this.naturalImageHeight = this.imgNode.naturalHeight;
         this.naturalImageWidth = this.imgNode.naturalWidth;
         if (this.cropToFit === true && !this.croppedToFit)
         {
            this.alfLog("info", "Cropping on image load");
            this.cropImage();
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

         // Delegate to the ItemSelectionMixin - this will check if select on click is supported...
         this.onSelectionClick();

         // Check whether or not the thumbnail should ONLY support selection on click (because in
         // some circumstances, e.g. film strip view carousel we might want to select AND perform
         // an additinal action)...
         if (!this.onlySelectOnClick)
         {
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
               if (this.usePreviewService)
               {
                  if (mimetype)
                  {
                     // If we have a type and MIME type we can safely delegate to the NodePreviewService
                     // without needing to load the full metadata (we want to avoid requesting the full
                     // node metadata more than once)...
                     this.alfServicePublish(topics.SHOW_NODE_PREVIEW, this.currentItem);
                  }
                  else
                  {
                     // ...if we don't have a MIME type we can still safely delegate, but we should just
                     // pass the nodeRef and allow the NodePreviewService to get the full metadata
                     this.alfServicePublish(topics.SHOW_NODE_PREVIEW, {
                        nodeRef: lang.getObject(this.itemKey || "node.nodeRef", false, this.currentItem)
                     });
                  }
               }
               else
               {
                  if (!type || !mimetype)
                  {
                     this.nodePromise = new Deferred();
                     this.onLoadNode(nodeRef);
                  }
                  when(this.nodePromise, lang.hitch(this, this.onNodePromiseResolved, nodeRef));
               }
            }
            else
            {
               this.onNonPreviewAction(evt);
            }
         }
      },

      /**
       * Handles non-preview related actions. Non-preview actions are encapsulated in their own function
       * as requests for a preview might need to fallback to use them when an XHR request to obtain the
       * full node data reveals that a preview cannot be supported.
       *
       * @instance
       * @param {object} evt The click event
       */
      onNonPreviewAction: function alfresco_renderers_Thumbnail__onNonPreviewAction(evt) {
         if (!this.publishTopic)
         {
            // If no topic has been provided then set up a default one (presumed to be for use
            // in a document library)...
            this.publishPayload = {};
            this.publishTopic = this.generateFileFolderLink(this.publishPayload);
         }
         else if (this.publishPayload)
         {
            // If a payload has been provided then use it...
            this.publishPayload = this.getGeneratedPayload(true, null);
         }

         // ...then do it.
         if (!this.publishTopic || lang.trim(this.publishTopic) === "")
         {
            this.alfLog("warn", "No publishTopic provided for PropertyLink", this);
         }
         else
         {
            var publishGlobal = this.publishGlobal || false;
            var publishToParent = this.publishToParent || false;
            this.processMiddleOrCtrlClick(evt, this.publishTopic, this.publishPayload);
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
       * @deprecated Since 1.0.59 - Use [usePreviewService]{@link module:alfresco/renderers/Thumbnail#usePreviewService} instead
       */
      onNodePromiseResolved: function alfresco_renderers_Thumbnail__onNodePromiseResolved(nodeRef, nodeData) {
         // First of all, update the currentItem with the full node data that has been resolved...
         this.currentItem = nodeData;

         // Now check to see whether or not the preview can be shown...
         var mimetype = lang.getObject("node.mimetype", false, this.currentItem);
         if (mimetype)
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
       * @deprecated Since 1.0.59 - Use [usePreviewService]{@link module:alfresco/renderers/Thumbnail#usePreviewService} instead
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
       * @deprecated Since 1.0.59 - Use [usePreviewService]{@link module:alfresco/renderers/Thumbnail#usePreviewService} instead
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
       * @deprecated Since 1.0.59 - Use [usePreviewService]{@link module:alfresco/renderers/Thumbnail#usePreviewService} instead
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
                        label: this.message("thumbnail.preview.dialog.close"),
                        publishTopic: "NO_OP",
                        additionalCssClasses: "call-to-action"
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
