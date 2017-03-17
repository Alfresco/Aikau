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
 * This module provides a view intended for use in [Document Lists]{@link module:alfresco/documentlibrary/AlfDocumentList}
 * and allows users to quickly scan through previews of documents without needing to go to a specific page.
 *
 * @module alfresco/documentlibrary/views/AlfFilmStripView
 * @extends module:alfresco/lists/views/AlfListView
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/AlfListView",
        "alfresco/core/ObjectProcessingMixin",
        "dojo/text!./templates/AlfFilmStripView.html",
        "alfresco/documentlibrary/AlfDocument",
        "alfresco/preview/AlfDocumentPreview",
        "alfresco/documentlibrary/views/layouts/DocumentCarousel",
        "alfresco/lists/views/layouts/Carousel",
        "dojo/_base/lang",
        "dojo/dom-construct"], 
        function(declare, AlfListView, ObjectProcessingMixin, template, AlfDocument, AlfDocumentPreview, 
                 DocumentCarousel, Carousel, lang, domConstruct) {
   
   return declare([AlfListView, ObjectProcessingMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfFilmStripView.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfFilmStripView.css"}],

      /**
       * <p>This property can be used to customise the arrows used in the carousels. The four properties
       * (contentPrev, contentNext, listPrev, listNext) correspond to the previous and next arrows in the
       * content carousel and the item-list carousel respectively.</p>
       *
       * <p>The value of each property should correspond to the properties of an
       * [Image]{@link module:alfresco/html/Image} widget, which should be used as a reference of
       * available properties.</p>
       *
       * <p><strong>NOTE:</strong> All defaults are as they are in the Image widget, apart from srcType
       * which instead defaults to [FULL_PATH]{@link module:alfresco/enums/urlTypes#FULL_PATH}.</p>
       *
       * @instance
       * @type {object}
       * @property {object} [contentPrev] The replacement [Image]{@link module:alfresco/html/Image} config
       *                                  for the previous-arrow in the content carousel
       * @property {object} [contentNext] The replacement [Image]{@link module:alfresco/html/Image} config
       *                                  for the next-arrow in the content carousel
       * @property {object} [listPrev]    The replacement [Image]{@link module:alfresco/html/Image} config
       *                                  for the previous-arrow in the item-list carousel
       * @property {object} [listNext]    The replacement [Image]{@link module:alfresco/html/Image}
       *                                  config for the next-arrow in the item-list carousel
       * @see module:alfresco/html/Image
       * @default
       * @since 1.0.41
       */
      arrows: null,

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * This is used to set the [heightAdjustment]{@link module:alfresco/layout/HeightMixin#heightAdjustment}
       * of the [AlfFilmStripViewDocument]{@link module:alfresco/documentlibrary/views/layouts/AlfFilmStripViewDocument}
       * that is rendered by default.
       * 
       * @instance
       * @type {number}
       * @default
       * @since 1.0.41
       */
      heightAdjustment: 0,

      /**
       * This is used to set the [heightMode]{@link module:alfresco/layout/HeightMixin#heightMode}
       * of the [AlfFilmStripViewDocument]{@link module:alfresco/documentlibrary/views/layouts/AlfFilmStripViewDocument}
       * that is rendered by default.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.41
       */
      heightMode: "AUTO",

      /**
       * Override the default selector to match items in the FilmStrip view. This is required because the view
       * doesn't render table rows.
       *
       * @instance
       * @type {string}
       * @default
       */
      renderFilterSelectorQuery: "div.items ol li",

      /**
       * The height in pixels to make the item carousel. This can be configured to adjust the size of the 
       * thumbnails that are displayed.
       * 
       * @instance
       * @type {number}
       * @default
       * @since 1.0.51
       */
      itemCarouselHeight: 112,

      /**
       * The value configured is passed to the 
       * [previewerPluginOverrides]{@link module:alfresco/documentlibrary/views/layouts/AlfFilmStripViewDocument#previewerPluginOverrides}
       * which is then passed to the 
       * [widgetsForPluginsOverrides]{@link module:alfresco/preview/AlfDocumentPreview#widgetsForPluginsOverrides}
       * of the [widgetsForPluginsOverrides]{@link module:alfresco/preview/AlfDocumentPreview} that is rendered
       * by default. Configuring or overriding 
       * [widgetsForContent]{@link module:alfresco/documentlibrary/views/AlfFilmStripView#widgetsForContent}
       * can potentially change this depending upon the change made.
       * 
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.51
       */
      previewerPluginOverrides: null,

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
       * Extends the [inherited function]{@link module:alfresco/lists/views/AlfListView#renderView}
       * to publish a request to get the details of the first item (if available). This request is intended to be 
       * serviced by the [DocumentService]{@link module:alfresco/services/DocumentService} and the published response
       * should be picked up the [AlfDocument]{@link module:alfresco/documentlibrary/AlfDocument} to render the
       * preview as appropriate
       *
       * @instance
       * @param {boolean} preserveCurrentData
       */
      renderView: function alfresco_documentlibrary_views_AlfFilmStripView__renderView(/*jshint unused:false*/ preserveCurrentData) {
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
       * Extends the [inherited function]{@link module:alfresco/lists/views/AlfListView#onViewShown}
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
       * Creates a new [ListRenderer]{@link module:alfresco/lists/views/ListRenderer}
       * which is used to render the actual items in the view. This function can be overridden by extending views
       * (such as the [Film Strip View]{@link module:alfresco/documentlibrary/views/AlfFilmStripView}) to create
       * alternative widgets applicable to that view.
       * 
       * @instance
       * @returns {object} A new [ListRenderer]{@link module:alfresco/lists/views/ListRenderer}
       */
      createListRenderer: function alfresco_documentlibrary_views_AlfFilmStripView__createListRenderer() {
         // NOTE: Any previous previews should have been destroyed, but empty the previewNode just to be on the safe side
         //       TODO: Possible memory leak to investigate here, because the call to empty the node *is* required.
         domConstruct.empty(this.previewNode);

         // Set the height appropriately if it explicitly defined. Make sure that the height of the 
         // previewer inside the filmstrip view accommodates the requested height of the item carousel...
         var heightMode = this.heightMode;
         switch(this.heightMode) {
            case "auto": // Included for backwards compatibility
            case "AUTO":
            case "PARENT":
            case "DIALOG":
               // Add the item carousel height to the height adjustment to ensure it appears on the
               // screen...
               this.heightAdjustment = this.heightAdjustment + this.itemCarouselHeight;
               break;
            default:
               if (!isNaN(this.heightMode) && 
                   !isNaN(this.itemCarouselHeight) &&
                   this.heightMode > this.itemCarouselHeight)
               {
                  heightMode = this.heightMode - this.itemCarouselHeight;
               }
         }

         var clonedWidgetsForContent = lang.clone(this.widgetsForContent);
         this.processObject(["processInstanceTokens"], clonedWidgetsForContent);
         this.contentCarousel = this.createWidget({
            id: (this._alfPreferredWidgetId || this.id) + "_PREVIEWS",
            name: "alfresco/documentlibrary/views/layouts/DocumentCarousel",
            config: {
               widgets: clonedWidgetsForContent,
               currentData: this.currentData,
               pubSubScope: this.pubSubScope,
               parentPubSubScope: this.parentPubSubScope,
               heightAdjustment: this.heightAdjustment,
               heightMode: heightMode,
               itemSelectionTopics: ["ALF_FILMSTRIP_SELECT_ITEM"],
               nextArrow: this.arrows && this.arrows.contentNext,
               prevArrow: this.arrows && this.arrows.contentPrev
            }
         }, null, null, null, null, "CONTENT_CAROUSEL");
         this.contentCarousel.placeAt(this.previewNode);
         this.contentCarousel.resize();

         var dlr = this.createWidget({
            id: (this._alfPreferredWidgetId || this.id) + "_ITEMS",
            name: "alfresco/lists/views/layouts/Carousel",
            config: {
               widgets: lang.clone(this.widgets),
               currentData: this.currentData,
               pubSubScope: this.pubSubScope,
               parentPubSubScope: this.parentPubSubScope,
               fixedHeight: this.itemCarouselHeight + "px",
               useInfiniteScroll: this.useInfiniteScroll,
               itemSelectionTopics: ["ALF_FILMSTRIP_ITEM_CHANGED"],
               nextArrow: this.arrows && this.arrows.listNext,
               prevArrow: this.arrows && this.arrows.listPrev
            }
         }, null, null, null, null, "ITEMS_CAROUSEL");
         return dlr;
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/views/AlfListView#destroyRenderer}
       * to destroy the content carousel.
       *
       * @instance
       * @since 1.0.32
       */
      destroyRenderer: function alfresco_documentlibrary_views_AlfFilmStripView__destroyRenderer() {
         if (this.contentCarousel)
         {
            this.contentCarousel.destroyRecursive();
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
                     align: "left",
                     config: {
                        itemKey: "node.nodeRef"
                     }
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
            name: "alfresco/documentlibrary/views/layouts/AlfFilmStripViewDocument",
            config: {
               heightAdjustment: 0,
               heightMode: "PARENT",
               previewerPluginOverrides: "{previewerPluginOverrides}"
            }
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
               isDraggable: false,
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