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
 * This module extends the standard [Carousel]{@link module:alfresco/lists/views/layouts/Carousel} to 
 * ensure that only one item is shown at a time in the carousel (regardless of available horizontal space). It 
 * was written to display [document]{@link module:module alfresco/documentlibrary/views/layouts/AlfFilmStripViewDocument}
 * modules that can render previews of individual items.
 * 
 * @module alfresco/documentlibrary/views/layouts/DocumentCarousel
 * @extends module:alfresco/lists/views/layouts/Carousel
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/layouts/Carousel",
        "alfresco/core/topics",
        "alfresco/enums/urlTypes",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/dom-geometry",
        "dojo/query", 
        "dojo/NodeList-dom"], 
        function(declare, Carousel, topics, urlTypes, lang, domClass, domConstruct, domStyle, domGeom, query, /*jshint unused:false*/ nodeListDom) {

   return declare([Carousel], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/DocumentCarousel.css"}]
       */
      cssRequirements: [{cssFile:"./css/DocumentCarousel.css"}],

      /**
       * This is the default next arrow for the DocumentCarousel. It can be overridden using the
       * [nextArrow property]{@link module:alfresco/lists/views/Carousel#nextArrow}. It should
       * not be used directly.
       *
       * @instance
       * @type {object}
       * @readonly
       * @since 1.0.41
       */
      defaultNextArrow: {
         altText: "next-arrow.alt-text",
         src: "alfresco/documentlibrary/views/layouts/css/images/filmstrip-main-nav-next.png",
         srcType: urlTypes.REQUIRE_PATH,
         width: 29,
         height: 74
      },

      /**
       * This is the default previous arrow for the DocumentCarousel. It can be overridden using the
       * [previousArrow property]{@link module:alfresco/lists/views/Carousel#previousArrow}. It should
       * not be used directly.
       *
       * @instance
       * @type {object}
       * @readonly
       * @since 1.0.41
       */
      defaultPrevArrow: {
         altText: "prev-arrow.alt-text",
         src: "alfresco/documentlibrary/views/layouts/css/images/filmstrip-main-nav-prev.png",
         srcType: urlTypes.REQUIRE_PATH,
         width: 29,
         height: 74
      },

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * 
       * @instance postCreate
       */
      postCreate: function alfresco_documentlibrary_views_layouts_DocumentCarousel__postCreate() {
         domClass.add(this.domNode, "alfresco-documentlibrary-views-layouts-DocumentCarousel");
         this.inherited(arguments);
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/views/layouts/Carousel#resize}
       * to set the width of each item DOM node to the viewing frame.
       *
       * @instance
       */
      resize: function alfresco_documentlibrary_views_layouts_DocumentCarousel__resize() {
         this.inherited(arguments);
         this.resizeContainer();
         query(".items li", this.domNode).style({width: this.itemsNodeWidth + "px"});
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/views/layouts/Carousel#calculateSizes}
       * to ensure that only 1 item is shown at a time.
       *
       * @instance
       */
      calculateSizes: function alfresco_documentlibrary_views_layouts_DocumentCarousel__calculateSizes() {
         this.inherited(arguments);
         this.numberOfItemsShown = 1;
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/views/layouts/Carousel#onPrevClick}
       * to publish the current item index. This is done so that when used in the 
       * [filmstrip view]{@link module:alfresco/documentlibrary/views/AlfFilmStripView} the content carousel
       * is kept up-to-date.
       *
       * @instance
       */
      onPrevClick: function alfresco_documentlibrary_views_layouts_DocumentCarousel__onPrevClick(/*jshint unused:false*/ evt) {
         this.inherited(arguments);
         this.alfPublish("ALF_FILMSTRIP_ITEM_CHANGED", {
            index: this.firstDisplayedIndex
         });
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/views/layouts/Carousel#onNextClick}
       * to publish the current item index. This is done so that when used in the 
       * [filmstrip view]{@link module:alfresco/documentlibrary/views/AlfFilmStripView} the content carousel
       * is kept up-to-date.
       *
       * @instance
       */
      onNextClick: function alfresco_documentlibrary_views_layouts_DocumentCarousel__onNextClick(/*jshint unused:false*/ evt) {
         this.inherited(arguments);
         this.alfPublish("ALF_FILMSTRIP_ITEM_CHANGED", {
            index: this.firstDisplayedIndex
         });
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/views/layouts/Carousel#renderDisplayedItems}
       * to publish a topic indicating that the items being played should be stopped.
       * 
       * @instance
       * @since 1.0.51
       * @fires module:alfresco/core/topics#PREVIEWS_SHOWN
       */
      renderDisplayedItems: function alfresco_documentlibrary_views_layouts_DocumentCarousel__renderDisplayedItems() {
         this.inherited(arguments);
         this.alfPublish(topics.PREVIEWS_SHOWN, {
            items: this.currentData.items.slice(this.firstDisplayedIndex, this.lastDisplayedIndex + 1)
         });
      }
   });
});