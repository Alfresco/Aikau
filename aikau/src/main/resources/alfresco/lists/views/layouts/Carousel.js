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
 * This module can be used to display multiple items in a horizontal strip that can be scrolled through use
 * previous and next buttons. It was written to support the [filmstrip view]{@link module:alfresco/documentlibrary/views/AlfFilmStripView}
 * which uses both this module (and the extending module [DocumentCarousel]{@link module:alfresco/documentlibrary/views/layouts/DocumentCarousel}
 * to show both the entire contents of a folder and a preview of the currently selected item.
 *
 * @module alfresco/lists/views/layouts/Carousel
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/ResizeMixin
 * @mixes module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "alfresco/core/Core",
        "alfresco/core/ResizeMixin",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin",
        "dojo/text!./templates/Carousel.html",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-style",
        "dojo/dom-geometry",
        "dojo/window"],
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, AlfCore, ResizeMixin, _MultiItemRendererMixin, template,
                 lang, array, domClass, domConstruct, domStyle, domGeom, win) {

   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, ResizeMixin, _MultiItemRendererMixin, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Carousel.css"}]
       */
      cssRequirements: [{cssFile:"./css/Carousel.css"}],

      /**
       * The HTML template to use for the widget.
       *
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * Sets up image source files, etc.
       *
       * @instance postCreate
       */
      postMixInProperties: function alfresco_lists_views_layouts_Carousel__postMixInProperties() {
         this.contentNavNextArrowImgSrc = require.toUrl("alfresco/documentlibrary/views/layouts") + "/css/images/filmstrip-content-nav-next.png";
         this.contentNavPrevArrowImgSrc = require.toUrl("alfresco/documentlibrary/views/layouts") + "/css/images/filmstrip-content-nav-prev.png";
      },

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       *
       * @instance postCreate
       */
      postCreate: function alfresco_lists_views_layouts_Carousel__postCreate() {
         if (this.currentItem)
         {
            if (this.widgets)
            {
               this.processWidgets(this.widgets, this.containerNode);
            }
         }

         // Subscribe to selection topics...
         if (this.itemSelectionTopics)
         {
            array.forEach(this.itemSelectionTopics, function(topic) {
               this.alfSubscribe(topic, lang.hitch(this, this.selectItem));
            }, this);
         }

         // Subscibe to the page widgets ready topic to ensure that sizing occurs...
         this.alfSubscribe("ALF_WIDGETS_READY", lang.hitch(this, this.resize), true);

         // Handle resize events...
         this.alfSetupResizeSubscriptions(this.resize, this);
      },

      /**
       * Sets the width of each item (in pixels)
       *
       * @instance
       * @type {number}
       * @default 100
       */
      itemWidth: 100,

      /**
       * Sets the width to allow for the next and previous buttons
       *
       * @instance
       * @type {number}
       * @default 40
       */
      navigationMargin: 40,

      /**
       * This function is called once all widgets have been added onto the page. At this point it can be
       * assumed that the widget has been placed into the DOM model and has some dimensions to work with
       *
       * @instance
       */
      resize: function alfresco_lists_views_layouts_Carousel__resize() {
         this.calculateSizes();
         domStyle.set(this.itemsNode, "width", this.itemsNodeWidth + "px");
         domStyle.set(this.itemsNode, "height", this.height);

         this.resizeContainer();

         // Set the range of displayed items...
         this.lastDisplayedIndex = this.firstDisplayedIndex + (this.numberOfItemsShown - 1);
         this.renderDisplayedItems();
      },

      /**
       * Resizes the container that holds all the items (some of which may be hidden from view). It
       * sets the width by multiplying the number of items by the item width. This specific resizing
       * has been abstracted to it's own function so that it can be easily re-used by extending widgets
       * that may wish to call it (such as the [DocumentCarousel]{@link module:alfresco/documentlibrary/views/layouts/DocumentCarousel})
       *
       * @instance
       */
      resizeContainer: function alfresco_lists_views_layouts_Carousel__resizeContainer() {
         var itemsCount = lang.getObject("currentData.items.length", false, this);
         if (itemsCount !== null)
         {
            var totalWidth = (itemsCount * this.itemsNodeWidth) + "px";
            domStyle.set(this.containerNode, "width", totalWidth);
         }
      },

      /**
       * This can be set to a value (in pixels) to fix the height. If this is left as null then
       * a suitable height will attempt to be calculated
       *
       * @instance
       * @type {string}
       * @default null
       */
      height: null,

      /**
       * Gets the available dimensions of the DOM node in preparation for resizing the widget components.
       * This also works out how many items should be shown within the current viewing frame.
       *
       * @instance
       */
      calculateSizes: function alfresco_lists_views_layouts_Carousel__calculateSizes() {
         if (this.domNode)
         {
            // Get the available width of the items node...
            var computedStyle = domStyle.getComputedStyle(this.domNode);
            var output = domGeom.getMarginBox(this.domNode, computedStyle);

            // The width to use is the node width minus the space reserved for the navigation controls...
            var overallWidth = output.w - (2 * this.navigationMargin);

            // For now assume that the width of each item will be 100px....
            // Divide the itemsNode width by 100 to get the number of items
            this.numberOfItemsShown = Math.floor(overallWidth/this.itemWidth);
            this.itemsNodeWidth = this.numberOfItemsShown * this.itemWidth;

            if (this.fixedHeight != null)
            {
               // Use the configured height...
               this.height = this.fixedHeight;
            }
            else
            {
               // Calculate a suitable height...
               // We're going to set the height to be as big as the viewing port allows
               // from the starting vertical position of the node
               var position = domGeom.position(this.domNode);
               var viewPort = win.getBox();
               this.height = viewPort.h - position.y;
               this.height += "px";
            }
         }
      },

      /**
       * Extends the inherited function to add an additional li element for each item.
       *
       * @instance
       * @param {array} widgets The widgets to create
       * @param {element} rootNode The DOM element to add them into.
       */
      processWidgets: function alfresco_lists_views_layouts_Carousel__processWidgets(widgets, rootNode) {
         var nodeToAdd = nodeToAdd = domConstruct.create("li", {}, rootNode);
         this.inherited(arguments, [widgets, nodeToAdd]);
      },

      /**
       * This keeps track of the current left position (e.g. the setting that controls what items you can see
       * within the clipped frame). This value is updated by the
       * [onPrevClick]{@link module:alfresco/lists/views/layouts/Carousel#onPrevClick} and
       * [onNextClick]{@link module:alfresco/lists/views/layouts/Carousel#onNextClick} functions.
       *
       * @instance
       * @type {number}
       * @default 0
       */
      currentLeftPosition: 0,

      /**
       * This keeps track of the first displayed item in the currently visible frame.
       *
       * @instance
       * @type {number}
       * @default 0
       */
      firstDisplayedIndex: 0,

      /**
       * This keeps track of the lasts displayed item in the currently visible frame
       *
       * @instance
       * @type {number}
       * @default null
       */
      lastDisplayedIndex: null,

      /**
       * Handles the user clicking on the previous items navigation control.
       *
       * @instance
       * @param {object} evt The click event
       */
      onPrevClick: function alfresco_lists_views_layouts_Carousel__onPrevClick(evt) {
         if (this.currentLeftPosition > 0)
         {
            this.currentLeftPosition -= this.itemsNodeWidth;

            // Update the displayed range...
            this.firstDisplayedIndex -= this.numberOfItemsShown;
            this.lastDisplayedIndex -= this.numberOfItemsShown;
            this.renderDisplayedItems();
         }
      },

      /**
       * Handles the user clicking on the previous items navigation control.
       *
       * @instance
       * @param {object} evt The click event
       */
      onNextClick: function alfresco_lists_views_layouts_Carousel__onNextClick(evt) {
         this.currentLeftPosition += this.itemsNodeWidth;

         // Update the displayed range...
         this.firstDisplayedIndex += this.numberOfItemsShown;
         this.lastDisplayedIndex += this.numberOfItemsShown;

         this.renderDisplayedItems();
      },

      /**
       * Iterates over the [processed widgets]{@link module:alfresco/lists/views/layouts/_MultiItemRendererMixin#_renderedItemWidgets}
       * between the [first]{@link module:alfresco/lists/views/layouts/Carousel#firstDisplayedIndex} and
       * [last]{@link module:alfresco/lists/views/layouts/Carousel#lastDisplayedIndex} indices calling
       * the render function on each to ensure they display themselves correctly
       *
       * @instance
       */
      renderDisplayedItems: function alfresco_lists_views_layouts_Carousel__renderDisplayedItems() {
         for (var i=this.firstDisplayedIndex; i<=this.lastDisplayedIndex; i++)
         {
            if (this._renderedItemWidgets)
            {
               var widgets = this._renderedItemWidgets[i];
               array.forEach(widgets, lang.hitch(this, this.renderDisplayedItem));

            }
         }

         // Make sure the frame is aligned correctly...
         this.currentLeftPosition = (this.firstDisplayedIndex / this.numberOfItemsShown) * this.itemsNodeWidth;
         var left = "-" + this.currentLeftPosition + "px";
         domStyle.set(this.containerNode, "left", left);

         var itemsCount = lang.getObject("currentData.items.length", false, this);
         domStyle.set(this.prevNode, "visibility", (this.firstDisplayedIndex == 0) ? "hidden": "visible");
         domStyle.set(this.nextNode, "visibility", (this.firstDisplayedIndex <= itemsCount-1 && this.lastDisplayedIndex >= itemsCount-1) ? "hidden": "visible");

      },

      /**
       * Attempts to render a widget that is currently displayed in the viewing frame.
       *
       * @instance
       * @param {object} widget The widget to render
       * @param {number} index The index of the widget within the array
       */
      renderDisplayedItem: function alfresco_lists_views_layouts_Carousel__renderDisplayedItem(widget, index) {
         if (widget && typeof widget.render === "function")
         {
            widget.render();
         }
      },

      /**
       * Handles requests to select an item
       *
       * @instance
       * @param {object} payload
       */
      selectItem: function alfresco_lists_views_layouts_Carousel__item(payload) {
         if (payload.index != null && !isNaN(parseInt(payload.index)))
         {
            var targetIndex = parseInt(payload.index);
            if (targetIndex >= this.firstDisplayedIndex && targetIndex <= this.lastDisplayedIndex)
            {
               // The requested item is currently displayed, no action necessary...
            }
            else if (targetIndex > this.lastDisplayedIndex)
            {
               // Start navigating back to find the item
               while(targetIndex > this.lastDisplayedIndex)
               {
                  // this.onNextClick();
                  this.firstDisplayedIndex += this.numberOfItemsShown;
                  this.lastDisplayedIndex += this.numberOfItemsShown;
               }
               this.renderDisplayedItems();
            }
            else
            {
               // Start navigating forward to find the item
               while(targetIndex < this.firstDisplayedIndex)
               {
                  // this.onPrevClick();
                  this.firstDisplayedIndex -= this.numberOfItemsShown;
                  this.lastDisplayedIndex -= this.numberOfItemsShown;
               }
               this.renderDisplayedItems();
            }
         }
      }
   });
});