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
 * This module was created to support both the [thumbnail]{@link module:alfresco/search/SearchThumbnail} and 
 * [gallery thumbnail]{@link module:alfresco/search/SearchGalleryThumbnail} modules that are used to
 * render thumbnails in search results. Because search results can contain any node types (e.g. blogs, wikis,
 * links, etc) rather than just documents and folders it provides the extra code for rendering the correct
 * thumbnail image for the additional types that can be displayed.
 * 
 * @module alfresco/search/SearchThumbnailMixin
 * @extends module:alfresco/renderers/_SearchResultLinkMixin
 * @mixes module:alfresco/navigation/_HtmlAnchorMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/_SearchResultLinkMixin",
        "alfresco/navigation/_HtmlAnchorMixin"], 
        function(declare, _SearchResultLinkMixin, _HtmlAnchorMixin) {

   return declare([_SearchResultLinkMixin, _HtmlAnchorMixin], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/SearchThumbnail.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/SearchThumbnailMixin.properties"}],

      /**
       * Generates the publication payload by calling the mixed in 
       * [generatePayload]{@link module:alfresco/renderers/_SearchResultLinkMixin#generatePayload}
       * function and then wraps the property in an anchor element by calling the mixed in 
       * [makeAnchor]{@link module:alfresco/navigation/_HtmlAnchorMixin#makeAnchor} function
       *
       * @instance
       */
      postCreate: function alfresco_renderers_SearchThumbnailMixin__postCreate() {
         this.inherited(arguments);
         if (!this.publishPayload)
         {
            this.publishPayload = {};
         }
         this.publishPayload = this.generateSearchLinkPayload(this.publishPayload, this.currentItem, null, this.publishPayloadType, this.publishPayloadItemMixin, this.publishPayloadModifiers);
         this.makeAnchor(this.publishPayload.url, this.publishPayload.type);
      },

      /**
       * Overrides the standard fallback to address specific site item types.
       *
       * @instance
       * @returns {string} The URL for the thumbnail.
       */
      generateFallbackThumbnailUrl: function alfresco_renderers_SearchThumbnailMixin__generateFallbackThumbnailUrl() {
         var url;
         switch (this.currentItem.type)
         {
            case "blogpost":
               url = require.toUrl("alfresco/search") + "/css/images/blog-post.png";
               break;
   
            case "forumpost":
               url = require.toUrl("alfresco/search") + "/css/images/topic-post.png";
               break;
   
            case "calendarevent":
               url = require.toUrl("alfresco/search") + "/css/images/calendar-event.png";
               break;
   
            case "wikipage":
               url = require.toUrl("alfresco/search") + "/css/images/wiki-page.png";
               break;
   
            case "link":
               url = require.toUrl("alfresco/search") + "/css/images/link.png";
               break;
   
            case "datalist":
               url = require.toUrl("alfresco/search") + "/css/images/datalist.png";
               break;
   
            case "datalistitem":
               url = require.toUrl("alfresco/search") + "/css/images/datalistitem.png";
               break;
   
            default:
               url = require.toUrl("alfresco/search") + "/css/images/generic-result.png";
               break;
         }
         return url;
      },

      /**
       * Returns an array containing the selector that identifies the span to wrap in an anchor.
       * This overrides the [mixed in function]{@link module:alfresco/navigation/_HtmlAnchorMixin}
       * that just returns an empty array.
       *
       * @instance
       */
      getAnchorTargetSelectors: function alfresco_renderers_SearchThumbnailMixin__getAnchorTargetSelectors() {
         return ["span.inner"];
      }
   });
});