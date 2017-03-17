/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * This extends the standard [AlfFilmStripViewDocument]{@link module:alfresco/documentlibrary/views/layouts/AlfFilmStripViewDocument}
 * to provide dedicated rendering and link handling for search results. This has been created to be used within the
 * [SearchFilmStripView]{@link module:alfresco/search/SearchFilmStripView}.
 * 
 * @module alfresco/search/FilmStripViewSearchResult
 * @extends module:alfresco/documentlibrary/AlfDocument
 * @mixes module:alfresco/core/ResizeMixin
 * @author Dave Draper
 * @since 1.0.32
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/views/layouts/AlfFilmStripViewDocument",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare, AlfFilmStripViewDocument, lang, domClass) {
   
   return declare([AlfFilmStripViewDocument], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/FilmStripViewSearchResult.css"}]
       */
      cssRequirements: [{cssFile:"./css/FilmStripViewSearchResult.css"}],
      
      /**
       * Sets up a NodeRef specific subscription if the current item is a document (such that the document data is only
       * requested if asked for by the [Film Strip View]{@link module:alfresco/documentlibrary/views/AlfFilmStripView})
       * and if the current item is a container then the standard thumbnail is rendered
       *
       * @instance
       */
      postCreate: function alfresco_search_FilmStripViewSearchResult__postCreate() {
         domClass.add(this.domNode, "alfresco-search-FilmStripViewSearchResult");
         this.nodeRef = lang.getObject("currentItem.nodeRef", false, this);
         this.type = lang.getObject("currentItem.type", false, this);
         if (this.type === "document")
         {
            // This is a document so we can subscribe to the expected request to display content
            this.widgets = [{
               name: "alfresco/preview/AlfDocumentPreview",
               config: {
                  heightMode: this.heightMode,
                  heightAdjustment: this.heightAdjustment
               }
            }];
            this.alfSubscribe("ALF_FILMSTRIP_DOCUMENT_REQUEST__" + this.nodeRef, lang.hitch(this, this.requestDocument, this.nodeRef));
         }
         else
         {
            this.processWidgets(lang.clone(this.widgetsForSearchResults), this.containerNode);
            this.alfSetupResizeSubscriptions(this.resizeThumbnails, this);
         }
      },

      /**
       * This function is provided so that explicit requests can be made to generate the preview
       *
       * @instance
       */
      render: function alfresco_search_FilmStripViewSearchResult__render() {
         if (this.type === "document" && this.nodeRef)
         {
            this.requestDocument(this.nodeRef);
         }
      },
      
      /**
       * Defines the widgets to use for non-folder, non-document search results.
       *
       * @instance
       * @type {object[]}
       */
      widgetsForSearchResults: [
         {
            name: "alfresco/search/SearchThumbnail",
            config: {
               folderImage: "folder-256.png"
            }
         }
      ]
   });
});