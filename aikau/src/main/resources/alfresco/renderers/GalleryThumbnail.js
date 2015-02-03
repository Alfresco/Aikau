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
 * Extends the standard [thumbnail renderer]{@link module:alfresco/renderers/Thumbnail} to provide a scaleable
 * thumbnail for use in the [gallery view]{@link module:alfresco/documentlibrary/views/AlfGalleryView} (although
 * it could be used in other situations).
 * 
 * @module alfresco/renderers/GalleryThumbnail
 * @extends module:alfresco/renderers/Thumbnail
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Thumbnail",
        "dojo/text!./templates/GalleryThumbnail.html",
        "dojo/_base/lang",
        "dojo/dom-style",
        "dojo/dom-class",
        "alfresco/layout/LeftAndRight",
        "alfresco/renderers/Selector",
        "alfresco/renderers/MoreInfo",
        "service/constants/Default"], 
        function(declare, Thumbnail, template, lang, domStyle, domClass, LeftAndRight, Selector, MoreInfo, AlfConstants) {

   return declare([Thumbnail], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/GalleryThumbnail.css"}]
       */
      cssRequirements: [{cssFile:"./css/GalleryThumbnail.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * Adds the "gallery" CSS classes the main DOM node defined in the template
       * @instance
       * @type {string}
       * @default "gallery"
       */
      customClasses: "gallery",
      
      /**
       * @instance
       * @returns {boolean}
       */
      getFolderImage: function alfresco_renderers_GalleryThumbnail__getDefaultFolderImage() {
         return require.toUrl("alfresco/renderers") + "/css/images/folder-256.png";
      },
      
      /**
       * The type of rendition to use for the thumbnail
       * @instance
       * @type {string}
       * @default "imgpreview"
       */
      renditionName: "imgpreview",
      
      /**
       * This should be set to an object containing the starting dimensions of the thumbnail. The object needs
       * to have a "w" attribute to indicate the width and should be a string including the unit of measurement
       * (e.g. "100px").
       *  
       * @instance
       * @type {object}
       * @default null
       */
      dimensions: null,

      /**
       * @instance
       * @param {object} dimensions
       */
      resize: function alfresco_renderers_GalleryThumbnail__resize(dimensions) {
         if (this.imgNode != null && dimensions && dimensions.w)
         {
            // Set the container height AND the image height and widths...
            // Heights are set to ensure a nice square thumbnail...
            // A small deduction is made to allow for spacing...
            var w = dimensions.w;
            domStyle.set(this.thumbnailNode, "width", w);
            domStyle.set(this.thumbnailNode, "height", w);
            domStyle.set(this.imgNode, "width", w);
            domStyle.set(this.imgNode, "minHeight", w);
            
            // It's also necessary to set the width of the overlaid information...
            domStyle.set(this.selectBarNode, "width", w);
            domStyle.set(this.displayNameNode, "width", w);
         }
      },
      
      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * 
       * @instance postCreate
       */
      postCreate: function alfresco_renderers_GalleryThumbnail__postCreate() {
         this.inherited(arguments);
         if (this.widgetsForSelectBar)
         {
               this.selectBarWidget = new LeftAndRight({
               currentItem: this.currentItem,
               pubSubScope: this.pubSubScope,
               parentPubSubScope: this.parentPubSubScope,
               widgets: lang.clone(this.widgetsForSelectBar)
            }, this.selectBarNode);
         }
         else
         {
            domStyle.set(this.titleNode, "display", "none");
         }
         if (this.dimensions != null)
         {
            this.resize(this.dimensions);
         }
      },
      
      /**
       * Defines the widget definition model to include in the select bar.
       * 
       * @instance
       * @returns {object[]}
       */
      widgetsForSelectBar: [
         {
            name: "alfresco/renderers/Selector",
            align: "left"
         },
         {
            name: "alfresco/renderers/MoreInfo",
            align: "right"
         }
      ],

      /**
       * Focuses the domNode. This has been added to support the dijit/_KeyNavContainer functions mixed into 
       * the [document library views]{@link module:alfresco/lists/views/AlfListView} to 
       * allow easier keyboard navigation.
       * 
       * @instance
       */
      focus: function alfresco_renderers_GalleryThumbnail__focus() {
         this.domNode.focus();
         domClass.remove(this.titleNode, "share-hidden");
      },
      
      /**
       * @instance
       */
      blur: function alfresco_renderers_GalleryThumbnail__blur() {
         domClass.add(this.titleNode, "share-hidden");
      }
   });
});