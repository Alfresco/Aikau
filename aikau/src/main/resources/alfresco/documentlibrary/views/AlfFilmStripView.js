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
 * This module provides a view intended for use in [Document Lists]{@link module:alfresco/documentlibrary/AlfDocumentList}
 * and allows users to quickly scan through previews of documents without needing to go to a specific page.
 *
 * @module alfresco/documentlibrary/views/AlfFilmStripView
 * @extends module:alfresco/documentlibrary/views/AlfDocumentListView
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/views/AlfDocumentListView",
        "dojo/text!./templates/AlfFilmStripView.html",
        "alfresco/documentlibrary/AlfDocument",
        "alfresco/preview/AlfDocumentPreview",
        "alfresco/documentlibrary/views/layouts/DocumentCarousel",
        "alfresco/documentlibrary/views/layouts/Carousel",
        "dojo/_base/lang"], 
        function(declare, AlfDocumentListView, template, AlfDocument, AlfDocumentPreview, DocumentCarousel, Carousel, lang) {
   
   return declare([AlfDocumentListView], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfFilmStripView.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfFilmStripView.css"}],
            
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The configuration for selecting the view (configured the menu item)
       * @instance
       * @type {object}
       * @property {string|null} label The label or message key for the view (as appears in the menus)
       * @property {string|null} iconClass The class to place next to the label
       */
      viewSelectionConfig: {
         label: "doclist.view.filmstrip.label",
         iconClass: "alf-filmstrip-icon"
      },
      
      /**
       * Returns the name of the view that is used when saving user view preferences.
       * 
       * @instance
       * @returns {string} "detailed"
       */
      getViewName: function alfresco_documentlibrary_views_AlfFilmStripView__getViewName() {
         return "filmstrip";
      },
      
      /**
       * Extends the [inherited function]{@link module:alfresco/documentlibrary/views/AlfDocumentListView#renderView}
       * to publish a request to get the details of the first item (if available). This request is intended to be 
       * serviced by the [DocumentService]{@link module:alfresco/services/DocumentService} and the published response
       * should be picked up the [AlfDocument]{@link module:alfresco/documentlibrary/AlfDocument} to render the
       * preview as appropriate
       *
       * @instance
       * @param {boolean} preserveCurrentData
       */
      renderView: function alfresco_documentlibrary_views_AlfFilmStripView__renderView(preserveCurrentData) {
         this.inherited(arguments);
         
         if (this.currentData && this.currentData.items && this.currentData.items.length > 0)
         {
            if (this.contentCarousel)
            {
               this.contentCarousel.renderData();
            }
         }
      },

      /**
       * Override the default selector to match items in the FilmStrip view. This is required because the view
       * doesn't render table rows.
       *
       * @instance
       * @type {string}
       * @default "tr"
       */
      renderFilterSelectorQuery: "div.items ol li",

      /**
       * Extends the [inherited function]{@link module:alfresco/documentlibrary/views/AlfDocumentListView#onViewShown}
       * to ensure that both carousels are sized appropriately after being added into the view.
       *
       * @instance
       */
      onViewShown: function alfresco_documentlibrary_views_AlfFilmStripView__onViewShown() {
         if (this.docListRenderer && typeof this.docListRenderer.resize === "function")
         {
            this.docListRenderer.resize();
         }
         if (this.contentCarousel && typeof this.contentCarousel.resize === "function")
         {
            this.contentCarousel.resize();
         }
      },

      /**
       * Creates a new [DocumentListRenderer]{@link module:alfresco/documentlibrary/views/DocumentListRenderer}
       * which is used to render the actual items in the view. This function can be overridden by extending views
       * (such as the [Film Strip View]{@link module:alfresco/documentlibrary/views/AlfFilmStripView}) to create
       * alternative widgets applicable to that view.
       * 
       * @instance
       * @returns {object} A new [DocumentListRenderer]{@link module:alfresco/documentlibrary/views/DocumentListRenderer}
       */
      createDocumentListRenderer: function alfresco_documentlibrary_views_AlfFilmStripView__createDocumentListRenderer() {
         this.contentCarousel = new DocumentCarousel({
            widgets: lang.clone(this.widgetsForContent),
            currentData: this.currentData,
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.parentPubSubScope,
            itemSelectionTopics: ["ALF_FILMSTRIP_SELECT_ITEM"]
         });
         this.contentCarousel.placeAt(this.previewNode, "last");
         this.contentCarousel.resize();

         var dlr = new Carousel({
            id: this.id + "_ITEMS",
            widgets: lang.clone(this.widgets),
            currentData: this.currentData,
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.parentPubSubScope,
            fixedHeight: "112px",
            itemSelectionTopics: ["ALF_FILMSTRIP_ITEM_CHANGED"]
         });
         return dlr;
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/documentlibrary/views/AlfDocumentListView#clearOldView}
       * to destroy the content carousel.
       *
       * @instance
       */
      clearOldView: function alfresco_documentlibrary_views_AlfFilmStripView__clearOldView() {
         if (this.contentCarousel)
         {
            this.contentCarousel.destroy();
         }
         this.inherited(arguments);
      },

      /**
       * The definition of how a single item is represented the preview.
       * 
       * @instance
       * @type {object[]}
       */
      widgetsForContent: [
         {
            name: "alfresco/layout/LeftAndRight",
            config: {
               widgets: [
                  {
                     name: "alfresco/renderers/Selector",
                     align: "left"
                  },
                  {
                     name: "alfresco/renderers/Property",
                     align: "left",
                     config: {
                        propertyToRender: "node.properties.cm:name"
                     }
                  },
                  {
                     name: "alfresco/renderers/MoreInfo",
                     align: "right"
                  }
               ]
            }
         },
         {
            name: "alfresco/documentlibrary/views/layouts/AlfFilmStripViewDocument"
         }
      ],

      /**
       * The definition of how a single item is represented in the view. 
       * 
       * @instance
       * @type {object[]}
       */
      widgets: [
         {
            name: "alfresco/renderers/GalleryThumbnail",
            config: {
               dimensions: {
                  w: "100px"
               },
               publishTopic: "ALF_FILMSTRIP_SELECT_ITEM",
               publishPayloadType: "PROCESS",
               publishPayload: {
                  index: "{index}",
                  nodeRef: "{nodeRef}"
               },
               publishPayloadModifiers: ["processCurrentItemTokens"],
               widgetsForSelectBar: null
            }
         }
      ]
   });
});