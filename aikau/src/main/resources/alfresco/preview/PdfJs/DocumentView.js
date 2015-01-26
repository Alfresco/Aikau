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
 * <p>This module was extracted from the PdfJs previewer plugin that was originally a Share Extras
 * (http://share-extras.github.io/) project and later integrated into Alfresco Share 5.0. It was 
 * created exclusively to support the [Aikau PdfJs module]{@link module:alfresco/preview/PdfJs/PdfJs}.</p>
 * <p>This module is responsible for rendering the overall view of a PDF document where each individual
 * page is an instance of a [DocumentPage]{@link module:alfresco/preview/PdfJs/DocumentPage}. It is used
 * to render both the main view and the thumbnail view in the PDF previewer plugin.</p>
 * 
 * @module alfresco/preview/PdfJs/DocumentView
 * @extends dijit/_WidgetBase
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 * @author Will Abson
 * @auther Peter Löfgren
 * @author Kevin Roast
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "alfresco/core/Core",
        "alfresco/preview/PdfJs/DocumentPage",
        "alfresco/preview/PdfJs/PdfJsConstants",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/dom-geometry", 
        "dojo/dom-class",
        "dojo/dom-style",
        "jquery"], 
        function(declare, _WidgetBase, AlfCore, DocumentPage, PdfJsConstants, lang, on, domGeom, domClass, domStyle, $) {
   
   return declare([_WidgetBase, AlfCore], {

      /**
       * Currently active page
       * 
       * @instance
       * @default null
       */
      activePage : null,
      
      /**
       * Name of last scale to be auto-selected or selected by the user. This is the value which will be persisted when the
       * document is unloaded and used to set up the same view the next time it is loaded.
       * 
       * @instance
       * @default null
       */
      lastScale : null,

      /**
       * Counter for viewer scroll events - incremented on event, decremented some time later. Rendering will occur only when counter reaches zero.
       * 
       * @instance
       * @type {int}
       * @default 0
       */
      renderOnScrollZero : 0,

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_preview_PdfJs_DocumentView__postCreate() {
         this.viewer = this.domNode;
         var computedStyle = domStyle.getComputedStyle(this.viewer);
         this.viewerRegion = domGeom.getContentBox(this.viewer, computedStyle);
         this.currentScale = this.currentScale || PdfJsConstants.K_UNKNOWN_SCALE;
         this.name = this.name || "";

         // Used for setupRenderLayoutTimer in TextLayerbuilder
         this.lastScroll = 0;
         var self = this;
         // TODO: Replace with Dojo equivilant...
         this.viewer.addEventListener('scroll', function()
         {
            self.lastScroll = Date.now();
         }, false);

         this.addScrollListener();
         
         this.pages = [];
         if (this.pagesToAdd)
         {
            this.addPages(this.pagesToAdd);
         }
      },

      /**
       * Add a single page from a PDF document to this view
       * 
       * @instance
       */
      addPage: function alfresco_preview_PdfJs_DocumentView__addPage(id, content) {
         var page = new DocumentPage(id, content, this, {}, this.pdfJsPlugin);
         this.pages.push(page);
      },

      /**
       * Add pages from a PDF document to this view
       * 
       * @instance
       */
      addPages: function alfresco_preview_PdfJs_DocumentView__addPages(pages) {
         for ( var i = 0; i < pages.length; i++)
         {
            var page = pages[i];
            this.addPage(i + 1, page);
         }
      },

      /**
       * Render page containers and set their sizes. This does not render the page content itself, neither canvas or text layers.
       * 
       * @instance
       */
      render : function alfresco_preview_PdfJs_DocumentView__render() {
         // Render each page (not canvas or text layers)
         for ( var i = 0; i < this.pages.length; i++)
         {
            this.alfLog("log", "Rendering " + this.name + " page container " + (i+1));
            this.pages[i].render();
         }

         // Set scale, if not already set
         if (this.currentScale === PdfJsConstants.K_UNKNOWN_SCALE)
         {
            // Scale was not initialized: invalid bookmark or scale was not specified.
            // Setting the default one.
            this.setScale(this.parseScale(this.defaultScale));
         }
         else
         {
            this.alignRows();
         }
      },

      /**
       * Remove all existing canvas content
       * 
       * @instance
       */
      reset : function alfresco_preview_PdfJs_DocumentView__reset() {
         // Remove all the existing canvas elements
         for ( var i = 0; i < this.pages.length; i++)
         {
            this.pages[i].reset();
         }

         // Now redefine the row margins
         this.alignRows();
      },

      /**
       * Centre the rows of pages horizontally  within their parent viewer element by adding the correct amount of left padding
       * 
       * @instance
       */
      alignRows : function alfresco_preview_PdfJs_DocumentView__alignRows() {
         var rowPos = -1, rowWidth = 0, largestRow = 0, scrollY = $(document).scrollTop();
         if (this.pageLayout == "multi")
         {
            domStyle.set(this.viewer, "padding-left", "0px");
            for (var i = 0; i < this.pages.length; i++)
            {
               var page = this.pages[i],
                   container = page.container,
                   containerBounds = container.getBoundingClientRect(),
                   vpos = containerBounds.top + scrollY - page.parent.viewerRegion.t,
                   marginLeft = parseInt(domStyle.get(container, "margin-left"));
               // If multi-page mode is on, we need to add custom extra margin to the LHS of the 1st item in the row to make it centred
               if (vpos != rowPos)
               {
                  rowWidth = marginLeft; // Rather than start from zero assume equal right padding on last row item
               }
               rowWidth += containerBounds.width + marginLeft;
               largestRow = Math.max(largestRow, rowWidth);
               rowPos = vpos;
            }
            domStyle.set(this.viewer, "padding-left", Math.floor((this.viewer.clientWidth - largestRow) / 2) + "px");
         }
      },

      /**
       * Render pages in the visible area of the viewer (or near it) given the current scroll position
       * 
       * @instance
       */
      renderVisiblePages : function alfresco_preview_PdfJs_DocumentView__renderVisiblePages() {
         // region may not be populated properly if the div was hidden
         var computedStyle = domStyle.getComputedStyle(this.viewer);
         this.viewerRegion = domGeom.getContentBox(this.viewer, computedStyle);
         // this.viewerRegion = Dom.getRegion(this.viewer);
         
         var vheight = this.viewerRegion.h, vtop = this.viewerRegion.t, scrollY = $(document).scrollTop();
         this.alfLog("log", "Render " + this.name + " visible pages: viewer height " + this.viewerRegion.h + "px");

         // Render visible pages
         for (var i = 0; i < this.pages.length; i++)
         {
            var page = this.pages[i];
            if (!page.canvas)
            {
               var pregion = page.container.getBoundingClientRect(),
                   top = pregion.top + scrollY - vtop,
                   bottom = top + pregion.height,
                   vicinity = 1.5;
               
               // WA - improve algorithm for selecting which pages to render, based on the following criteria
               // Page top is above the viewer top edge, bottom below the bottom edge OR
               // Bottom is within half the viewer height of the top edge OR
               // Top is within half the viewer height of the bottom edge
               if (top < 0 && 0 < bottom ||
                   -vheight * vicinity < bottom && bottom < vheight ||
                   0 < top && top < vheight * (vicinity + 1))
               {
                  this.alfLog("log", "Rendering " + this.name + " page " + (i+1) + " content (page top:" + top + ", bottom:" + bottom + ")");
                  page.renderContent();
               }
            }
         }
      },

      /**
       * Scroll the viewer to the given page number
       * 
       * @instance
       * @param n {int} Number of the page to scroll to, 1 or greater.
       */
      scrollTo : function alfresco_preview_PdfJs_DocumentView__scrollTo(n, offsetY) {
         var newPos = this.pages[n - 1].getVPos(),
            firstPos = this.pages[0].getVPos();

         this.alfLog("log", "Scrolling " + this.name + " to page " + n + 
               ". New page top is " + newPos + "px" + 
               ". First page top is " + firstPos + "px");

         var scrollTop = newPos - firstPos;
         if (offsetY)
         {
            scrollTop += offsetY;
         }

         this.alfLog("log", "Old scrollTop was " + this.viewer.scrollTop + "px");
         this.alfLog("log", "Set scrollTop to " + scrollTop + "px");
         this.alfLog("log", "scrollTop offsetY " + offsetY);

         this.viewer.scrollTop = scrollTop;
         this.pageNum = n;

         // Render visible pages
         this.renderVisiblePages();
      },

      /**
       * Set the scale of the view and remove all previously-rendered document content
       * 
       * @instance
       * @param value {float} numerical scale value
       */
      setScale : function alfresco_preview_PdfJs_DocumentView__setScale(value) {
         if (value == this.currentScale)
         {
            return;
         }
         this.alfLog("log", "Scale is now " + value);
         this.currentScale = value;

         // Remove all the existing canvas elements
         this.reset();

         // Now redefine the row margins
         this.alignRows();
      },

      /**
       * Calculate page zoom level based on the supplied value. Recognises numerical values and special string constants, e.g. 'page-fit'.
       * Normally used in conjunction with setScale(), since this method does not set the current value.
       * 
       * @instance
       * @return {float} Numerical scale value
       */
      parseScale : function alfresco_preview_PdfJs_DocumentView__parseScale(value) {
         var scale = parseFloat(value);
         if (scale)
         {
            this.lastScale = value;
            return scale;
         }

         if (this.pages.length !== 0)
         {
            var currentPage = this.pages[0],
                container = currentPage.container,
                hmargin = parseInt(domStyle.get(container, "margin-left")) + parseInt(domStyle.get(container, "margin-right")),
                vmargin = parseInt(domStyle.get(container, "margin-top")),
                contentWidth = parseInt(currentPage.content.pageInfo.view[2]),
                contentHeight = parseInt(currentPage.content.pageInfo.view[3]),
                rotation = currentPage.content.pageInfo.rotate,
                clientWidth = this.fullscreen ? window.screen.width : this.viewer.clientWidth - 1, // allow an extra pixel in width otherwise 2-up view wraps
                clientHeight = this.fullscreen ? window.screen.height : this.viewer.clientHeight;
            
            this.alfLog("log", "Client height: " + this.viewer.clientHeight);
            if (rotation === 90 || rotation === 270)
            {
               var temp = contentWidth;
               contentWidth = contentHeight;
               contentHeight = temp;
            }

            var pageWidthScale, pageHeightScale;
            switch (value)
            {
               case PdfJsConstants.ZOOM_LEVEL_PAGE_WIDTH:
               {
                  pageWidthScale = (clientWidth - hmargin * 2) / contentWidth;
                  scale = pageWidthScale;
                  break;
               }
               case PdfJsConstants.ZOOM_LEVEL_TWO_PAGE_WIDTH:
               {
                  pageWidthScale = (clientWidth - hmargin * 3) / contentWidth;
                  scale = pageWidthScale / 2;
                  break;
               }
               case PdfJsConstants.ZOOM_LEVEL_PAGE_HEIGHT:
               {
                  pageHeightScale = (clientHeight - vmargin * 2) / contentHeight;
                  scale = pageHeightScale;
                  break;
               }
               case PdfJsConstants.ZOOM_LEVEL_PAGE_FIT:
               {
                  pageWidthScale = (clientWidth - hmargin*2) / contentWidth;
                  pageHeightScale = (clientHeight - vmargin*2) / contentHeight;
                  scale = Math.min(pageWidthScale, pageHeightScale);
                  break;
               }
               case PdfJsConstants.ZOOM_LEVEL_TWO_PAGE_FIT:
               {
                  pageWidthScale = (clientWidth - hmargin*3) / contentWidth;
                  pageHeightScale = (clientHeight - vmargin*2) / contentHeight;
                  scale = Math.min(pageWidthScale / 2, pageHeightScale);
                  break;
               }
               case PdfJsConstants.ZOOM_LEVEL_AUTO:
               {
                  var tpf = this.parseScale(PdfJsConstants.ZOOM_LEVEL_TWO_PAGE_FIT),
                      opf = this.parseScale(PdfJsConstants.ZOOM_LEVEL_PAGE_FIT),
                      opw = this.parseScale(PdfJsConstants.ZOOM_LEVEL_PAGE_WIDTH),
                      tpw = this.parseScale(PdfJsConstants.ZOOM_LEVEL_TWO_PAGE_WIDTH),
                      minScale = this.autoMinScale,
                      maxScale = this.autoMaxScale;
                  if (tpf > minScale && this.numPages > 1)
                  {
                     scale = tpf;
                  }
                  else if (opf > minScale)
                  {
                     scale = opf;
                  }
                  else if (tpw > minScale && this.numPages > 1)
                  {
                     scale = tpw;
                  }
                  else if (opw > minScale)
                  {
                     scale = opw;
                  }
                  else
                  {
                     scale = minScale;
                  }
                  // Make sure that the page is not zoomed in *too* far. 
                  // A limit of 125% max zoom is the default for the main view.
                  if (maxScale)
                  {
                     scale = Math.min(scale, maxScale);
                  }
                  break;
               }
               default:
               {
                  throw "Unrecognised zoom level '" + value + "'";
               }
            }
         }
         else
         {
            throw "Unrecognised zoom level - no pages";
         }
         
         this.lastScale = value;
         return Math.abs(scale); // Make sure of positive value!
      },

      /**
       * Return the number of the page (1 or greater) that should be considered the 'current' page given the scroll position.
       * 
       * @instance
       * @returns {int} Number of the current page, 1 or greater
       */
      getScrolledPageNumber : function alfresco_preview_PdfJs_DocumentView__getScrolledPageNumber() {
         // Calculate new page number
         for (var i = 0; i < this.pages.length; i++)
         {
            var page = this.pages[i],
                vpos = page.getVPos();
            if (vpos + parseInt(page.container.style.height) / 2 > 0)
            {
               return i + 1;
            }
         }
         return this.pages.length;
      },

      /**
       * Set the currently-active page number
       * 
       * @instance
       */
      setActivePage : function alfresco_preview_PdfJs_DocumentView__setActivePage(n) {
         if (this.activePage)
         {
            domClass.remove(this.activePage.container, "activePage");
         }
         domClass.add(this.pages[n - 1].container, "activePage");
         this.activePage = this.pages[n - 1];
      },
      
      /**
       *
       * 
       * @instance
       */
      onResize: function onResize() {
         // TODO viewerRegion should be populated by an event?
         var computedStyle = domStyle.getComputedStyle(this.viewer);
         this.viewerRegion = domGeom.getContentBox(this.viewer, computedStyle);
      },

      /**
       * Sets up a scroll event listener on the main viewer window. This allows rendering and publication
       * of state to be performed as the user scrolls through the PDF.
       * 
       * @instance
       */
      addScrollListener: function alfresco_preview_PdfJs_DocumentView__addScrollListener() {
         this.viewerScrollEventListener = on(this.viewer, "scroll", lang.hitch(this, this.onScrollEvent));
      },

      /**
       * Removes the scroll event listener created by the [addScrollListener]
       * {@link module:alfresco/preview/PdfJs/DocumentView#addScrollListener} function.
       * 
       * @instance
       */
      removeScrollListener: function alfresco_preview_PdfJs_DocumentView__addScrollListener() {
         if (this.viewerScrollEventListener != null)
         {
            this.viewerScrollEventListener.remove();
         }
      },

      /**
       * This function handles scroll events and calls the [onScroll]
       * {@link module:alfresco/preview/PdfJs/DocumentView#onScroll} if a short timeout is reached
       * before another scroll event occurs. This is done to prevent to many scroll publications
       * being generated unnecessarily.
       * 
       * @instance
       * @param {event} evt The scroll event object.
       */
      onScrollEvent: function alfresco_preview_PdfJs_DocumentView__onScrollEvent(evt) {
         // this.renderOnScrollZero++;
         if (this.scrollEventTimeout != null)
         {
            clearTimeout(this.scrollEventTimeout);
         }
         // Set timeout to call onScroll if another scroll event isn't detected very soon...
         this.scrollEventTimeout = setTimeout(lang.hitch(this, this.onScroll), 50);
      },

      /**
       * Event handler for scroll event within the view area this will publish on a topic that
       * the [PdfJs plugin]{@link module:alfresco/preview/PdfJs/PdfJs} should subscribe to so that
       * it can update the active page and set the current page number.
       * 
       * @instance
       */
      onScroll: function alfresco_preview_PdfJs_DocumentView__onScroll(evt) {
         // Render visible pages
         this.renderVisiblePages();
         this.alfPublish(PdfJsConstants.VIEWER_SCROLL_TOPIC, {});
      }
   });
});