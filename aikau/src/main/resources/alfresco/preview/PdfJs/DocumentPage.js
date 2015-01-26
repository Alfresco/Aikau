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
 * 
 * @module alfresco/preview/PdfJs/DocumentPage
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 * @author Will Abson
 * @auther Peter Löfgren
 * @author Kevin Roast
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/preview/PdfJs/TextLayerBuilder",
        "dojo/_base/lang",
        "dojo/dom-geometry", 
        "dojo/dom-class",
        "dojo/dom-style",
        "jquery"], 
        function(declare, AlfCore, TextLayerBuilder, lang, domGeom, domClass, domStyle, $) {
   
   return declare([AlfCore], {

      /**
       * Instantiates a new page, ready to be rendered.
       * 
       * @instance
       */
      constructor: function alfresco_preview_PdfJs_DocumentPage__constructor(id, content, parent, config, pdfJsPlugin) {
         this.id = id;
         this.content = content;
         this.parent = parent;
         this.canvas = null;
         this.container = null;
         this.loadingIconDiv = null;
         this.textLayerDiv = null;
         this.config = config || {};
         this.textContent = null;
         this.textLayerDiv = null;
         this.pdfJsPlugin = pdfJsPlugin;
      },

      /**
       * Render a specific page in the container. This does not render the content of the page itself, just the container divs.
       * 
       * @instance
       */
      render: function alfresco_preview_PdfJs_DocumentPage__render() {
         var div = document.createElement('div');
         div.id = this.parent.id + '-pageContainer-' + this.id;
         domClass.add(div, "page");
         this.parent.viewer.appendChild(div);

         // Create the loading indicator div
         var loadingIconDiv = document.createElement('div');
         domClass.add(loadingIconDiv, 'loadingIcon');
         div.appendChild(loadingIconDiv);

         this.container = div;
         this.loadingIconDiv = loadingIconDiv;

         this._setPageSize();
      },
      
      /**
       * Get the region in the document taken by this page
       * 
       * @instance
       * @returns {object} Object containing region dimensions
       */
      getRegion: function alfresco_preview_PdfJs_DocumentPage__getRegion() {
         var computedStyle = domStyle.getComputedStyle(this.container);
         var output = domGeom.getContentBox(this.container, computedStyle);
         return output;
      },

      /**
       * Get the vertical position of the page relative to the top of the parent element. A negative number
       * means that the page is above the current scroll position, a positive number means it is below.
       * 
       * @instance
       * @returns The vertical position of the page relative to the top of the parent element
       */
      getVPos: function alfresco_preview_PdfJs_DocumentPage__getVPos(page) {
         return this.container.getBoundingClientRect().top + $(document).scrollTop() - this.parent.viewerRegion.t;
      },

      /**
       * Render page content
       * 
       * @instance
       */
      renderContent: function alfresco_preview_PdfJs_DocumentPage__renderContent() {
         var region = this.getRegion(),
             canvas = document.createElement('canvas');
         canvas.id = this.container.id.replace('-pageContainer-', '-canvas-');
         canvas.mozOpaque = true;
         this.container.appendChild(canvas);

         this.canvas = canvas;
         
         // Hide the canvas until we've finished drawing the content, so the loading spinner shows through
         domStyle.set(canvas, "visibility", "hidden");

         canvas.width = region.w;
         canvas.height = region.h;

         // Add text layer
         var viewport = this.content.getViewport(this.parent.currentScale);
         var textLayerDiv = null;
         if (!this.parent.disableTextLayer)
         {
            textLayerDiv = document.createElement('div');
            textLayerDiv.className = 'textLayer';
            this.container.appendChild(textLayerDiv);
         }
         this.textLayerDiv = textLayerDiv;
         this.textLayer = textLayerDiv ? new TextLayerBuilder(textLayerDiv, this.id - 1, this.pdfJsPlugin, viewport) : null;

         var content = this.content,
             // view = content.view,
             ctx = canvas.getContext('2d');

         // Render the content itself
         var renderContext = {
            canvasContext : ctx,
            viewport : viewport,
            textLayer : this.textLayer
         };
         content.render(renderContext).promise.then(lang.hitch(this, this.renderFn, Date.now()));
      },

      /**
       * 
       * 
       * @instance
       */
      renderFn: function alfresco_preview_PdfJs_DocumentPage__render(startTime) {
         if (this.textLayer)
         {
            this.getTextContent().then(lang.hitch(this, function(textContent) {
               this.textLayer.setTextContent(textContent);
            }));
         }
         
         // Hide the loading icon and make the canvas visible again
         if (this.loadingIconDiv)
         {
            domStyle.set(this.loadingIconDiv, "display", "none");
         }
         domStyle.set(this.canvas, "visibility", "visible");
         
         // Log time taken to draw the page
         this.alfLog("log", "Rendered " + this.parent.name + " page " + this.id + " in " + (Date.now() - startTime) + "ms");
      },

      /**
       * Set page container size
       * 
       * @instance
       */
      _setPageSize: function alfresco_preview_PdfJs_DocumentPage___setPageSize() {
         var viewPort = this.content.getViewport(this.parent.currentScale);
         domStyle.set(this.container, "height", Math.floor(viewPort.height) + "px");
         domStyle.set(this.container, "width", Math.floor(viewPort.width) + "px");
      },

      /**
       * Remove page canvas and reset dimensions
       * 
       * @instance
       */
      reset: function alfresco_preview_PdfJs_DocumentPage__reset() {
         this._setPageSize();

         // Remove any existing page canvas
         if (this.canvas)
         {
            this.container.removeChild(this.canvas);
            delete this.canvas;
            this.canvas = null;
         }

         if (this.loadingIconDiv)
         {
            domStyle.set(this.loadingIconDiv, "display", "block");
         }
      },

      /**
       * Get the text content of the page. Used by find
       * 
       * @instance
       */
      getTextContent: function alfresco_preview_PdfJs_DocumentPage__pageviewGetTextContent() {
         if (!this.textContent)
         {
            this.textContent = this.content.getTextContent();
         }
         return this.textContent;
      },

      /**
       * Scroll the page into view
       * 
       * @instance
       */
      scrollIntoView: function alfresco_preview_PdfJs_DocumentPage__scrollIntoView(el, spot) {
         var offsetY = 0;
         this.alfLog("log", "Page Scroll");
         if (el)
         {
            offsetY += el.offsetTop;
            this.alfLog("log", "Page Scroll offsetTop " + el.offsetTop);
         }
         if (spot)
         {
            this.alfLog("log", "Page Scroll spot " + spot.top);
            offsetY += spot.top;
         }
         this.alfLog("log", "Page Scroll " + offsetY);
         this.parent.scrollTo(this.id, offsetY);
      }
   });
});