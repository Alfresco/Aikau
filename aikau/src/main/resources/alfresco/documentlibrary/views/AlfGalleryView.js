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
 * <p>This defines the widget model for rendering the gallery view. By default this is a grid based layout 
 * of thumbnails that can be scaled using a slider control. There are a number of ways in which this can
 * be configured to obtain alternative rendering.</p>
 * <p>By default the thumbnail size will be determined by the
 * available horizontal space for the configured number of 
 * [columns]{@link module:alfresco/documentlibrary/views/AlfGalleryView#columns} however it is possible to 
 * configure [resizeByColumnCount]{@link module:alfresco/documentlibrary/views/AlfGalleryView#resizeByColumnCount}
 * to be false such that the thumbnails will have a constant width defined by the configured
 * [thumbnailSize]{@link module:alfresco/documentlibrary/views/AlfGalleryView#thumbnailSize}.</p>
 * <p>When used in a [list]{@link module:alfresco/lists/AlfList} that is configured for
 * [infinite scrolling]{@link module:alfresco/lists/AlfList#useInfiniteScroll} it is sensible to
 * configure [showNextLink]{@link module:alfresco/documentlibrary/views/AlfGalleryView#showNextLink} to be true
 * such that a link is provided when the scrolling is not available when the thumbnails are so small
 * that an entire page of data fits within the browser window.</p>
 * <p>If something other than [thumbnails]{@link module:alfresco/renderers/GalleryThumbnail} needs to be
 * displayed then it is possible to 
 * [enable highlighting]{@link module:alfresco/documentlibrary/views/AlfGalleryView#enableHighlighting} so that
 * it is clear what item is currently focused - this will help greatly with keyboard navigation.</p>
 * <p>If more information needs to be displayed for an individual cell then it is possible to configure
 * one or more [expandTopics]{@link module:alfresco/documentlibrary/views/AlfGalleryView#expandTopics} that 
 * when published will reveal a panel in which additional data can be rendered.</p>
 *
 * @example <caption>A document list (for a site with name "site1") containing the default gallery view (rendering thumbnails).
 * The number of thumbnails rendered per row is determined by the "columns" attribute.</caption>
 * {
 *   name: "alfresco/documentlibrary/AlfDocumentList",
 *   config: {
 *     siteId: "site1",
 *     containerId: "documentLibrary",
 *     widgets: [
 *       {
 *         name: "alfresco/documentlibrary/views/AlfGalleryView",
 *         config: {
 *           columns: 8
 *         }
 *       }
 *     ]
 *   }
 * }
 *
 * @example <caption>A document list (for a site with name "site1") containing the default gallery view (rendering thumbnails).
 * Each thumbnail will be 200 pixels wide and as many as possible will be fit into each row depending upon the browser window
 * size.</caption>
 * {
 *   name: "alfresco/documentlibrary/AlfDocumentList",
 *   config: {
 *     siteId: "site1",
 *     containerId: "documentLibrary",
 *     widgets: [
 *       {
 *         name: "alfresco/documentlibrary/views/AlfGalleryView",
 *         config: {
 *           resizeByColumnCount: false,
 *           thumbnailSize: 200
 *         }
 *       }
 *     ]
 *   }
 * }
 * 
 * @example <caption>A document list (for a site with the name "site1") containing the default gallery view (rendering thumbnails). The slider will be
 * displayed in the toolbar.</caption>
 * {
 *   id: "TOOLBAR",
 *   name: "alfresco/documentlibrary/AlfToolbar"
 * },
 * {
 *   name: "alfresco/documentlibrary/AlfDocumentList",
 *   config: {
 *     additionalControlsTarget: "TOOLBAR",
 *     siteId: "site1",
 *     containerId: "documentLibrary",
 *     widgets: [
 *       {
 *         name: "alfresco/documentlibrary/views/AlfGalleryView"
 *       }
 *     ]
 *   }
 * }
 *
 * @example <caption>A document list (for a site with the name "site1") containing an alternative rendering to show the name
 * of each document.</caption>
 * {
 *   name: "alfresco/documentlibrary/AlfDocumentList",
 *   config: {
 *     siteId: "site1",
 *     containerId: "documentLibrary",
 *     widgets: [
 *       {
 *         name: "alfresco/documentlibrary/views/AlfGalleryView",
 *         config: {
 *           widgets: [
 *             {
 *               name: "alfresco/lists/views/layouts/CellContainer",
 *               config: {
 *                 widgets: [
 *                   {
 *                     name: "alfresco/renderers/Property",
 *                     config: {
 *                       propertyToRender: "displayName"
 *                     }
 *                   }
 *                 ]
 *               }
 *             }
 *           ]
 *         }
 *       }
 *     ]
 *   }
 * }
 *
 * @example <caption>A document list (for a site with the name "site1") containing an alternative rendering to show the name
 * of each document. When the CellContainer is clicked it will reveal an expanded section showing a ClassicWindow with the
 * name as it's title.</caption>
 * {
 *   name: "alfresco/documentlibrary/AlfDocumentList",
 *   config: {
 *     siteId: "site1",
 *     containerId: "documentLibrary",
 *     widgets: [
 *       {
 *         name: "alfresco/documentlibrary/views/AlfGalleryView",
 *         config: {
 *           enableHighlighting: true,
 *           itemKeyProperty: "nodeRef",
 *           expandTopics: ["EXPAND"],
 *           widgets: [
 *             {
 *               name: "alfresco/lists/views/layouts/CellContainer",
 *               config: {
 *                 publishTopic: "EXPAND",
 *                 publishPayloadType: "PROCESS",
 *                 publishPayloadModifiers: ["processCurrentItemTokens"],
 *                 publishPayloadItemMixin: true,
 *                 publishPayload: {
 *                   widgets: [
 *                     {
 *                       name: "alfresco/layout/ClassicWindow",
 *                       config: {
 *                         title: "{displayName}"
 *                       }
 *                     }
 *                   ]
 *                 },
 *                 widgets: [
 *                   {
 *                     name: "alfresco/renderers/Property",
 *                     config: {
 *                       propertyToRender: "displayName"
 *                     }
 *                   }
 *                 ]
 *               }
 *             }
 *           ]
 *         }
 *       }
 *     ]
 *   }
 * }
 * 
 * @module alfresco/documentlibrary/views/AlfGalleryView
 * @extends module:alfresco/lists/views/AlfListView
 * @mixes module:alfresco/lists/SelectedItemStateMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/AlfListView",
        "alfresco/lists/SelectedItemStateMixin",
        "dojo/text!./templates/AlfGalleryView.html",
        "alfresco/lists/views/layouts/Grid",
        "alfresco/documentlibrary/AlfGalleryViewSlider",
        "alfresco/documentlibrary/ThumbnailSizeSlider",
        "dojo/_base/lang",
        "dojo/dom-style",
        "dojo/dom-geometry",
        "alfresco/core/topics"], 
        function(declare, AlfListView, SelectedItemStateMixin, template, Grid, AlfGalleryViewSlider, ThumbnailSizeSlider, 
                 lang, domStyle, domGeom, topics) {
   
   return declare([AlfListView, SelectedItemStateMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfGalleryView.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfGalleryView.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * This is the number of columns to use in the grid.
       * 
       * @instance
       * @type {number}
       * @default
       */
      columns: 4,

      /**
       * The preference property to use for retrieving and setting the users preferred number of columns
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.35
       */
      columnsPreferenceProperty: "org.alfresco.share.documentList.galleryColumns",

      /**
       * Indicates whether or not highlighting should be enabled. If this is configured to be
       * true then highlighting of focus and expansion will be handled.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.44
       */
      enableHighlighting: false,

      /**
       * This is an array of optional topics that can be subscribed to to create a panel within the 
       * [grid]{@link module:alfresco/lists/views/layouts/Grid} for showing additional data about a 
       * particular cell in the grid. The payload should contain a "widgets" attribute that represents the model 
       * to render within the panel.
       * 
       * @instance
       * @type {string[]}
       * @default
       * @since 1.0.44
       */
      expandTopics: null,

      /**
       * This is the property that is used to uniquely identify each 
       * [item]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} rendered in the
       * [grid]{@link module:alfresco/lists/views/layouts/Grid}. It is used
       * as the key in the [gridCellMapping]{@link module:alfresco/lists/views/layouts/Grid#gridCellMapping}
       * to map each item to the cell that it is rendered in. This is required in order to know where to 
       * exand the grid when the 
       * [expandTopics]{@link module:alfresco/lists/views/layouts/Grid#expandTopics} is
       * published.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.44
       */
      itemKeyProperty: null,

      /**
       * This enables the mixed in [SelectedItemStateMixin]{@link module:alfresco/lists/SelectedItemStateMixin}
       * capabilities to track items as they are selected and deselected. This should only be changed from the
       * default when the view is not used within a [list]{@link module:alfresco/lists/AlfList} (as lists will
       * track selected items). This also ensures that when used outside of a list that the selected item 
       * state will be maintained when the thumbnails are resized.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.39
       */
      manageSelectedItemState: false,

      /**
       * The label to use for the next link. This defaults to null, so MUST be set for the next link to be displayed.
       * 
       * @instance
       * @type {string}
       * @default
       */
      nextLinkLabel: null,

      /**
       * The topic to publish when the next link is clicked.
       * 
       * @instance
       * @type {string}
       * @default [topics.SCROLL_NEAR_BOTTOM]{@link module:alfresco/core/topics#SCROLL_NEAR_BOTTOM}
       * @event
       */
      nextLinkPublishTopic: topics.SCROLL_NEAR_BOTTOM,

      /**
       * Indicates whether resizing of thumbnails should be done by setting the number of columns to be
       * displayed (the number of columns will remain constant and the thumbnail size will change as
       * the size of the view changes). If this is configured to be false then a 
       * [thumbnailSize]{@link module:alfresco/documentlibrary/views/AlfGalleryView#thumbnailSize}
       * will be used and the number of columns will change as the size of the view changes.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      resizeByColumnCount: true,

      /**
       * When set to true this will show a link for requesting more data (if available). This should be used when
       * the grid is rendering data in an infinite scroll view. It is required because when the grid cells are small
       * the data may not be sufficient to allow the scrolling events to occur that will request more data.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      showNextLink: false,

      /**
       * This is the size in pixels to set thumbnails initially. This only applies when 
       * [resizeByColumnCount]{@link module:alfresco/documentlibrary/views/AlfGalleryView#resizeByColumnCount}
       * is configured to be false.
       * 
       * @instance
       * @type {number}
       * @default
       * @since 1.0.40
       */
      thumbnailSize: 400,

      /**
       * The preference property to use for retrieving and setting the users preferred 
       * thumbnail size. This only applies when 
       * [resizeByColumnCount]{@link module:alfresco/documentlibrary/views/AlfGalleryView#resizeByColumnCount}
       * is configured to be false.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.40
       */
      thumbnailSizePreferenceProperty: "org.alfresco.share.documentList.thumbnailSize",

      /**
       * Returns the name of the view that is used when saving user view preferences.
       * 
       * @instance
       * @returns {string} "gallery"
       */
      getViewName: function alfresco_documentlibrary_views_AlfGalleryView__getViewName() {
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
       * <p>If [resizeByColumnCount]{@link module:alfresco/documentlibrary/views/AlfGalleryView#resizeByColumnCount}
       * is configured to be true this will subscribe to the
       * [SET_COLUMNS]{@link module:alfresco/core/topics#SET_COLUMNS} topic and each time the column count
       * is changed the [updateColumns]{@link module:alfresco/documentlibrary/views/AlfGalleryView#updateColumns}
       * function will be called.</p>
       * <p>If resizeByColumnCount]{@link module:alfresco/documentlibrary/views/AlfGalleryView#resizeByColumnCount}
       * is configured to be false this will subscribe to the
       * [SET_THUMBNAIL_SIZE]{@link module:alfresco/core/topics#SET_THUMBNAIL_SIZE} topic and each time the 
       * thumbnail size is changed the 
       * [updateThumbnailSize]{@link module:alfresco/documentlibrary/views/AlfGalleryView#updateThumbnailSize} function 
       * will be called.</p>
       * 
       * @instance
       * @listens module:alfresco/core/topics#SET_COLUMNS
       * @listens module:alfresco/core/topics#SET_THUMBNAIL_SIZE
       */
      postCreate: function alfresco_documentlibrary_views_AlfGalleryView__postCreate() {
         this.inherited(arguments);

         if (this.resizeByColumnCount)
         {
            this.alfSubscribe(topics.SET_COLUMNS, lang.hitch(this, this.updateColumns));
         }
         else
         {
            this.alfSubscribe(topics.SET_THUMBNAIL_SIZE, lang.hitch(this, this.updateThumbnailSize));
         }
         
         if (this.manageSelectedItemState)
         {
            this.createSelectedItemSubscriptions();
         }
      },

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
         var newNumCols = payload && !isNaN(payload.value) && payload.value;
         if (newNumCols && newNumCols !== this.columns)
         {
            this.columns = payload.value;
            if (this.docListRenderer)
            {
               // In the case of infinite scroll, we need to ensure that we reset the count for rendering
               // data so that all the items are re-rendered and sized appropriately...
               if (lang.exists("docListRenderer.currentData.previousItemCount"), this)
               {
                  this.docListRenderer.currentData.previousItemCount = 0;
               }
               this.renderView(false);
            }
         }
      },

      /**
       * Updates the [thumbnailSize]{@link module:alfresco/documentlibrary/views/AlfGalleryView#thumbnailSize}
       * to of each displayed item.
       * 
       * @instance
       * @param  {object} payload A payload where the value is the new thumbnail size.
       * @since 1.0.40
       */
      updateThumbnailSize: function alfresco_documentlibrary_views_AlfGalleryView__updateThumbnailSize(payload) {
         var thumbnailSize = payload && !isNaN(payload.value) && payload.value;
         if (thumbnailSize && thumbnailSize !== this.thumbnailSize)
         {
            this.thumbnailSize = thumbnailSize;
            if (this.docListRenderer)
            {
               // In the case of infinite scroll, we need to ensure that we reset the count for rendering
               // data so that all the items are re-rendered and sized appropriately...
               if (lang.exists("docListRenderer.currentData.previousItemCount"), this)
               {
                  this.docListRenderer.currentData.previousItemCount = 0;
               }
               this.renderView(false);
            }
         }
      },
      
      /**
       * Overridden to return a new instance of [AlfGalleryViewSlider]{@link module:alfresco/documentlibrary/AlfGalleryViewSlider} to control the 
       * number of columns that should be displayed in the gallery.
       * 
       * @instance
       * @returns {object} A new slider control [AlfGalleryViewSlider]{@link module:alfresco/documentlibrary/AlfGalleryViewSlider}
       */
      getAdditionalControls: function alfresco_documentlibrary_views_AlfGalleryView__getAdditionalControls() {
         if (this.resizeByColumnCount)
         {
            // NOTE: Can't call createWidget because it is overridden by the MultiItemMixinRenderer...
            return [new AlfGalleryViewSlider({
               relatedViewName: this.getViewName(),
               pubSubScope: this.pubSubScope,
               parentPubSubScope: this.parentPubSubScope,
               columns: this.columns,
               columnsPreferenceProperty: this.columnsPreferenceProperty
            })];
            
         }
         else
         {
            // NOTE: Can't call createWidget because it is overridden by the MultiItemMixinRenderer...
            return [new ThumbnailSizeSlider({
               relatedViewName: this.getViewName(),
               pubSubScope: this.pubSubScope,
               parentPubSubScope: this.parentPubSubScope,
               value: this.thumbnailSize,
               preferenceProperty: this.thumbnailSizePreferenceProperty
            })];
         }
      },
      
      /**
       * Extends the default implementation to resize the cells in the gallery.
       * 
       * @instance
       * @param {boolean} preserveCurrentData This should be set to true when you don't want to clear the old data, the
       * most common example of this is when infinite scroll is being used.
       */
      renderView: function alfresco_documentlibrary_views_AlfGalleryView__renderView(preserveCurrentData) {
         // jshint unused:false
         if (this._renderingView)
         {
            // If currently rendering a view, then indicate that a request to re-render is pending...
            this._pendingViewRendering = true;
         }
         else
         {
            this.alfLog("log", "Rendering view for " + this.columns + " columns");
            
            // Set a flag to indicate that view rendering has started (so that we don't re-start rendering 
            // before the current render completes)...
            this._renderingView = true;
            this.inherited(arguments);
            if (this.docListRenderer)
            {
               this.docListRenderer.resizeCells();
            }
            if (this.manageSelectedItemState)
            {
               this.publishSelectedItems();
            }
            this._renderingView = false;

            // Once the current render has finished, check to see if there is pending render request to fulfil...
            if (this._pendingViewRendering)
            {
               this._pendingViewRendering = false;
               this.renderView(preserveCurrentData);
            }
         }
      },
      
      /**
       * Creates a new [ListRenderer]{@link module:alfresco/lists/views/ListRenderer}
       * which is used to render the actual items in the view. This function can be overridden by extending views
       * (such as the [Film Strip View]{@link module:alfresco/documentlibrary/views/AlfFilmStripView}) to create
       * alternative widgets applicable to that view.
       * 
       * @instance
       * @returns {object} A new [ListRenderer]{@link module:alfresco/lists/views/ListRenderer}
       */
      createListRenderer: function alfresco_documentlibrary_views_AlfGalleryView__createListRenderer() {
         var dlr = new Grid({
            id: this.id + "_ITEMS",
            widgets: lang.clone(this.widgets),
            currentData: this.currentData,
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.parentPubSubScope,
            columns: this.columns,
            fixedColumns: this.resizeByColumnCount,
            showNextLink: this.showNextLink,
            nextLinkLabel: this.nextLinkLabel,
            nextLinkPublishTopic: this.nextLinkPublishTopic,
            thumbnailSize: this.thumbnailSize,
            itemKeyProperty: this.itemKeyProperty,
            expandTopics: this.expandTopics,
            enableHighlighting: this.enableHighlighting,
            widgetsForAppendix: this.widgetsForAppendix
         });
         return dlr;
      },

      /**
       * Called after the view has been shown (note that [renderView]{@link module:alfresco/lists/views/AlfListView#renderView}
       * does not mean that the view has been displayed, just that it has been rendered. 
       * @instance
       */
      onViewShown: function alfresco_documentlibrary_views_AlfGalleryView__onViewShown() {
         if (this.docListRenderer)
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