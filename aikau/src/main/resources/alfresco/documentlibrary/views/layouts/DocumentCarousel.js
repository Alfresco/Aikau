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
 * This module extends the standard [Carousel]{@link module:alfresco/documentlibrary/views/layouts/Carousel} to 
 * ensure that only one item is shown at a time in the carousel (regardless of available horizontal space). It 
 * was written to display [document]{@link module:module alfresco/documentlibrary/views/layouts/AlfFilmStripViewDocument}
 * modules that can render previews of individual items.
 * 
 * @module alfresco/documentlibrary/views/layouts/DocumentCarousel
 * @extends module:alfresco/documentlibrary/views/layouts/Carousel
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/documentlibrary/views/layouts/Carousel",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/dom-geometry",
        "dojo/query", 
        "dojo/NodeList-dom"], 
        function(declare, Carousel, lang, domClass, domConstruct, domStyle, domGeom, query, nodeListDom) {

   return declare([Carousel], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Carousel.css"}]
       */
      cssRequirements: [{cssFile:"./css/DocumentCarousel.css"}],

      /**
       * Sets up image source files, etc.
       * 
       * @instance postCreate
       */
      postMixInProperties: function alfresco_documentlibrary_views_layouts_DocumentCarousel__postMixInProperties() {
         this.contentNavNextArrowImgSrc = require.toUrl("alfresco/documentlibrary/views/layouts") + "/css/images/filmstrip-main-nav-next.png";
         this.contentNavPrevArrowImgSrc = require.toUrl("alfresco/documentlibrary/views/layouts") + "/css/images/filmstrip-main-nav-prev.png";
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
       * Extends the [inherited function]{@link module:alfresco/documentlibrary/views/layouts/Carousel#resize}
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
       * Extends the [inherited function]{@link module:alfresco/documentlibrary/views/layouts/Carousel#calculateSizes}
       * to ensure that only 1 item is shown at a time.
       *
       * @instance
       */
      calculateSizes: function alfresco_documentlibrary_views_layouts_DocumentCarousel__calculateSizes() {
         this.inherited(arguments);
         this.numberOfItemsShown = 1;
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/documentlibrary/views/layouts/Carousel#onPrevClick}
       * to publish the current item index. This is done so that when used in the 
       * [filmstrip view]{@link module:alfresco/documentlibrary/views/AlfFilmStripView} the content carousel
       * is kept up-to-date.
       *
       * @instance
       */
      onPrevClick: function alfresco_documentlibrary_views_layouts_DocumentCarousel__onPrevClick(evt) {
         this.inherited(arguments);
         this.alfPublish("ALF_FILMSTRIP_ITEM_CHANGED", {
            index: this.firstDisplayedIndex
         });
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/documentlibrary/views/layouts/Carousel#onNextClick}
       * to publish the current item index. This is done so that when used in the 
       * [filmstrip view]{@link module:alfresco/documentlibrary/views/AlfFilmStripView} the content carousel
       * is kept up-to-date.
       *
       * @instance
       */
      onNextClick: function alfresco_documentlibrary_views_layouts_DocumentCarousel__onNextClick(evt) {
         this.inherited(arguments);
         this.alfPublish("ALF_FILMSTRIP_ITEM_CHANGED", {
            index: this.firstDisplayedIndex
         });
      }
   });
});