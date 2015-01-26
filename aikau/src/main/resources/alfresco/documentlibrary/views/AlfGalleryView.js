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
 * This defines the widget model for rendering the gallery view. This is a grid based layout of thumbnails
 * that can be scaled using a slider control.
 * 
 * @module alfresco/documentlibrary/views/AlfGalleryView
 * @extends module:alfresco/documentlibrary/views/AlfDocumentListView
 * @mixes module:alfresco/documentlibrary/views/layouts/Grid
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/views/AlfDocumentListView",
        "dojo/text!./templates/AlfGalleryView.html",
        "alfresco/documentlibrary/views/layouts/Grid",
        "alfresco/documentlibrary/AlfGalleryViewSlider",
        "dojo/_base/lang",
        "dojo/dom-construct"], 
        function(declare, AlfDocumentListView, template, Grid, AlfGalleryViewSlider, lang, domConstruct) {
   
   return declare([AlfDocumentListView], {
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Returns the name of the view that is used when saving user view preferences.
       * 
       * @instance
       * @returns {string} "gallery"
       */
      getViewName: function alfresco_documentlibrary_views_AlfDocumentListView__getViewName() {
         return "gallery";
      },
      
      /**
       * The configuration for selecting the view (configured the menu item)
       * @instance
       * @type {object}
       * @property {string|null} label The label or message key for the view (as appears in the menus)
       * @property {string|null} iconClass The class to place next to the label
       */
      viewSelectionConfig: {
         label: "doclist.view.gallery.label",
         iconClass: "alf-gallery-icon"
      },

      /**
       * Subscribes to a topic to that sets the number of columns for the gallery. This topic is
       * published on by the slider control and which calls the 
       * [updateColumns]{@link module:alfresco/documentlibrary/views/AlfGalleryView#updateColumns} function
       * 
       * @instance
       */
      postCreate: function alfresco_documentlibrary_views_AlfGalleryView__postCreate() {
         this.inherited(arguments);
         this.alfSubscribe("ALF_DOCLIST_SET_GALLERY_COLUMNS", lang.hitch(this, "updateColumns"));
      },

      /**
       * This is the number of columns to use in the grid.
       * 
       * @instance
       * @type {number}
       * @default 4
       */
      columns: 4,

      /**
       * This function updates the [columns]{@link module:alfresco/documentlibrary/views/AlfGalleryView#columns}
       * attribute with the value attribute of the payload argument and then calls the
       * [renderView]{@link module:alfresco/documentlibrary/views/AlfGalleryView#renderView} function followed by the
       * [resizeCells]{@link module:alfresco/documentlibrary/views/AlfGalleryView#resizeCells} function
       * 
       * @instance
       * @param {object}
       */
      updateColumns: function alfresco_documentlibrary_views_AlfGalleryView__updateColumns(payload) {
         if (this.docListRenderer != null && 
             payload != null && 
             payload.value != null &&
             !isNaN(payload.value) &&
             this.columns != payload.value)
         {
            this.alfLog("log", "Update column count to: ", payload.value);
            this.columns = payload.value;

            // In the case of infinite scroll, we need to ensure that we reset the count for rendering
            // data so that all the items are re-rendered and sized appropriately...
            if (lang.exists("docListRenderer.currentData.previousItemCount"), this)
            {
               this.docListRenderer.currentData.previousItemCount = 0;
            }
            this.renderView(false);
         }
      },
      
      /**
       * Overridden to return a new instance of "alfresco/documentlibrary/AlfGalleryViewSlider" to control the 
       * number of columns that should be displayed in the gallery.
       * 
       * @instance
       * @returns {object} A new slider control {@link module:alfresco/documentlibrary/AlfGalleryViewSlider}
       */
      getAdditionalControls: function alfresco_documentlibrary_views_AlfGalleryView__getAdditionalControls() {
         return [new AlfGalleryViewSlider({
            relatedViewName: this.getViewName(),
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.parentPubSubScope
         })];
      },
      
      /**
       * Extends the default implementation to resize the cells in the gallery.
       * 
       * @instance
       * @param {boolean} preserveCurrentData This should be set to true when you don't want to clear the old data, the
       * most common example of this is when infinite scroll is being used.
       */
      renderView: function alfresco_documentlibrary_views_AlfGalleryView__renderView(preserveCurrentData) {
         this.inherited(arguments);
         if (this.docListRenderer != null)
         {
            this.docListRenderer.resizeCells();
         }
      },
      
      /**
       * When set to true this will show a link for requesting more data (if available). This should be used when
       * the grid is rendering data in an infinite scroll view. It is required because when the grid cells are small
       * the data may not be sufficient to allow the scrolling events to occur that will request more data.
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      showNextLink: false,

      /**
       * The label to use for the next link. This defaults to null, so MUST be set for the next link to be displayed.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      nextLinkLabel: null,

      /**
       * The topic to publish when the next link is clicked.
       * 
       * @instance
       * @type {string}
       * @default "ALF_SCROLL_NEAR_BOTTOM"
       */
      nextLinkPublishTopic: "ALF_SCROLL_NEAR_BOTTOM",

      /**
       * Creates a new [DocumentListRenderer]{@link module:alfresco/documentlibrary/views/DocumentListRenderer}
       * which is used to render the actual items in the view. This function can be overridden by extending views
       * (such as the [Film Strip View]{@link module:alfresco/documentlibrary/views/AlfFilmStripView}) to create
       * alternative widgets applicable to that view.
       * 
       * @instance
       * @returns {object} A new [DocumentListRenderer]{@link module:alfresco/documentlibrary/views/DocumentListRenderer}
       */
      createDocumentListRenderer: function alfresco_documentlibrary_views_AlfGalleryView__createDocumentListRenderer() {
         var dlr = new Grid({
            id: this.id + "_ITEMS",
            widgets: lang.clone(this.widgets),
            currentData: this.currentData,
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.parentPubSubScope,
            columns: this.columns,
            showNextLink: this.showNextLink,
            nextLinkLabel: this.nextLinkLabel,
            nextLinkPublishTopic: this.nextLinkPublishTopic
         });
         return dlr;
      },

      /**
       * Called after the view has been shown (note that [renderView]{@link module:alfresco/documentlibrary/views/AlfDocumentListView#renderView}
       * does not mean that the view has been displayed, just that it has been rendered. 
       * @instance
       */
      onViewShown: function alfresco_documentlibrary_views_AlfGalleryView__onViewShown() {
         if (this.docListRenderer != null)
         {
            this.docListRenderer.resizeCells();
         }
      },
      
      /**
       * The definition for rendering an item in the view.
       * 
       * @instance
       * @type {object[]}
       */
      widgets: [
         {
            name: "alfresco/renderers/GalleryThumbnail"
         }
      ]
   });
});