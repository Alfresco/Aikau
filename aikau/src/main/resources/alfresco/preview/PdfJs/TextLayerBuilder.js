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
 * <p>This code was adapted from a Share Extras (http://share-extras.github.io/)
 * project and was then integrated into Alfresco Share for version 5.0. That code was in turn
 * originally adapted from the Mozilla pdf.js project (https://github.com/mozilla/pdf.js).</p>
 *
 * <p>TextLayerBuilder provides text-selection functionality for the PDF. It does this
 * by creating overlay divs over the PDF text. This divs contain text that matches
 * the PDF text they are overlaying. This object also provides for a way to highlight
 * text that is being searched for.</p>
 *
 * @module alfresco/preview/PdfJs/TextLayerBuilder
 * @author Dave Draper
 * @author Will Abson
 * @auther Peter Löfgren
 * @author Kevin Roast
 */
define(["dojo/_base/declare",
        "dojo/dom-style"], 
        function(declare, domStyle) {
   
   return declare([], {

      /**
       * Copied from pdf.js viewer.
       */
      FIND_SCROLL_OFFSET_TOP: -50,
      FIND_SCROLL_OFFSET_LEFT: -400,

      
      /**
       *
       * 
       * @instance
       * // TODO: Add parameters
       */
      constructor: function alfresco_preview_PdfJs_TextLayerBuilder__constructor(textLayerDiv, pageIdx, pdfJsPlugin, viewport) {
         this.textLayerFrag = document.createDocumentFragment();
         this.textDivs = [];

         // ALFRESCO CHANGES
         this.viewport = viewport;
         this.textLayerDiv = textLayerDiv;
         this.layoutDone = false;
         this.divContentDone = false;
         this.pageIdx = pageIdx;
         this.matches = [];
         this.pdfJsPlugin = pdfJsPlugin;
         this.isViewerInPresentationMode = false;
         // END ALFRESCO CHANGES

         if (typeof this.pdfJsPlugin._findController === 'undefined') {
           this.pdfJsPlugin._findController = null;
         } 

         if (typeof this.lastScrollSource === 'undefined') {
           this.lastScrollSource = null;
         }
      },

      /**
       *
       * 
       * @instance
       */
      renderLayer: function alfresco_preview_PdfJs_TextLayerBuilder__renderLayer() {
         var textDivs = this.textDivs;
         var canvas = document.createElement('canvas');
         var ctx = canvas.getContext('2d');

         // No point in rendering so many divs as it'd make the browser unusable
         // even after the divs are rendered
         var MAX_TEXT_DIVS_TO_RENDER = 100000;
         if (textDivs.length > MAX_TEXT_DIVS_TO_RENDER) {
            return;
         }

         for (var i = 0, ii = textDivs.length; i < ii; i++) {
            var textDiv = textDivs[i];
            if ('isWhitespace' in textDiv.dataset) {
               continue;
            }

            ctx.font = textDiv.style.fontSize + ' ' + textDiv.style.fontFamily;
            var width = ctx.measureText(textDiv.textContent).width;

            if (width > 0) {
               this.textLayerFrag.appendChild(textDiv);
               var textScale = textDiv.dataset.canvasWidth / width;
               var rotation = textDiv.dataset.angle;
               var transform = 'scale(' + textScale + ', 1)';
               transform = 'rotate(' + rotation + 'deg) ' + transform;

               // ALFRESCO CHANGES
               // Share extras changed to use Yahoo dom.
               // TODO: Work out some more efficient way of determining
               // prefix as original method do, instead of setting all.
               domStyle.set(textDiv, '-ms-transform', 'scale(' + textScale + ', 1)');
               domStyle.set(textDiv, '-webkit-transform', 'scale(' + textScale + ', 1)');
               domStyle.set(textDiv, '-moz-transform', 'scale(' + textScale + ', 1)');
               domStyle.set(textDiv, '-ms-transformOrigin', '0% 0%');
               domStyle.set(textDiv, '-webkit-transformOrigin', '0% 0%');
               domStyle.set(textDiv, '-moz-transformOrigin', '0% 0%');
               // END ALFRESCO CHANGES
            }
         }

         this.textLayerDiv.appendChild(this.textLayerFrag);
         this.renderingDone = true;
         this.updateMatches();
      },

      /**
       *
       * 
       * @instance
       */
      setupRenderLayoutTimer: function alfresco_preview_PdfJs_TextLayerBuilder__setupRenderLayoutTimer() {
         // Schedule renderLayout() if user has been scrolling, otherwise
         // run it right away
         var RENDER_DELAY = 200; // in ms
         var self = this;
         var lastScroll = (this.lastScrollSource === null ?
                            0 : this.lastScrollSource.lastScroll);

         if (Date.now() - lastScroll > RENDER_DELAY) 
         {
            // Render right away
            this.renderLayer();
         } 
         else 
         {
            // Schedule
            if (this.renderTimer) 
            {
              clearTimeout(this.renderTimer);
            }
            this.renderTimer = setTimeout(function() {
              self.setupRenderLayoutTimer();
            }, RENDER_DELAY);
          }
      },

      /**
       *
       * 
       * @instance
       */
      appendText: function alfresco_preview_PdfJs_TextLayerBuilder__appendText(geom, styles) {
          var style = styles[geom.fontName];
          var textDiv = document.createElement('div');
          this.textDivs.push(textDiv);
          if (!/\S/.test(geom.str)) {
            textDiv.dataset.isWhitespace = true;
            return;
          }
          var tx = PDFJS.Util.transform(this.viewport.transform, geom.transform);
          var angle = Math.atan2(tx[1], tx[0]);
          if (style.vertical) {
            angle += Math.PI / 2;
          }
          var fontHeight = Math.sqrt((tx[2] * tx[2]) + (tx[3] * tx[3]));
          var fontAscent = (style.ascent ? style.ascent * fontHeight :
            (style.descent ? (1 + style.descent) * fontHeight : fontHeight));

          textDiv.style.position = 'absolute';
          textDiv.style.left = (tx[4] + (fontAscent * Math.sin(angle))) + 'px';
          textDiv.style.top = (tx[5] - (fontAscent * Math.cos(angle))) + 'px';
          textDiv.style.fontSize = fontHeight + 'px';
          textDiv.style.fontFamily = style.fontFamily;

          textDiv.textContent = geom.str;
          textDiv.dataset.fontName = geom.fontName;
          textDiv.dataset.angle = angle * (180 / Math.PI);
          if (style.vertical) {
            textDiv.dataset.canvasWidth = geom.height * this.viewport.scale;
          } else {
            textDiv.dataset.canvasWidth = geom.width * this.viewport.scale;
          }
      },

      /**
       *
       * 
       * @instance
       */
      setTextContent: function alfresco_preview_PdfJs_TextLayerBuilder__setTextContent(textContent) {
          this.textContent = textContent;

          var textItems = textContent.items;
          for (var i = 0; i < textItems.length; i++) {
            this.appendText(textItems[i], textContent.styles);
          }
          this.divContentDone = true;

          this.setupRenderLayoutTimer();
      },

      /**
       *
       * 
       * @instance
       */
      convertMatches: function alfresco_preview_PdfJs_TextLayerBuilder__convertMatches(matches) {
          var i = 0;
          var iIndex = 0;
          var bidiTexts = this.textContent.items;
          var end = bidiTexts.length - 1;
          var queryLen = (this.pdfJsPlugin._findController === null ?
                          0 : this.pdfJsPlugin._findController.state.query.length);

          var ret = [];

          // Loop over all the matches.
          for (var m = 0; m < matches.length; m++) {
            var matchIdx = matches[m];
            // # Calculate the begin position.

            // Loop over the divIdxs.
            while (i !== end && matchIdx >= (iIndex + bidiTexts[i].str.length)) {
              iIndex += bidiTexts[i].str.length;
              i++;
            }

            // TODO: Do proper handling here if something goes wrong.
            if (i == bidiTexts.length) {
              console.error('Could not find matching mapping');
            }

            var match = {
              begin: {
                divIdx: i,
                offset: matchIdx - iIndex
              }
            };

            // # Calculate the end position.
            matchIdx += queryLen;

            // Somewhat same array as above, but use a > instead of >= to get the end
            // position right.
            while (i !== end && matchIdx > (iIndex + bidiTexts[i].str.length)) {
              iIndex += bidiTexts[i].str.length;
              i++;
            }

            match.end = {
              divIdx: i,
              offset: matchIdx - iIndex
            };
            ret.push(match);
          }

          return ret;
      },

      /**
       *
       * 
       * @instance
       */
      renderMatches: function alfresco_preview_PdfJs_TextLayerBuilder__renderMatches(matches) {
          // Early exit if there is nothing to render.
          if (matches.length === 0) {
            return;
          }

          var bidiTexts = this.textContent.items;
          var textDivs = this.textDivs;
          var prevEnd = null;
          var isSelectedPage = (this.pdfJsPlugin._findController === null ?
            false : (this.pageIdx === this.pdfJsPlugin._findController.selected.pageIdx));

          var selectedMatchIdx = (this.pdfJsPlugin._findController === null ?
                                  -1 : this.pdfJsPlugin._findController.selected.matchIdx);

          var highlightAll = (this.pdfJsPlugin._findController === null ?
                              false : this.pdfJsPlugin._findController.state.highlightAll);

          var infty = {
            divIdx: -1,
            offset: undefined
          };

          function beginText(begin, className) {
            var divIdx = begin.divIdx;
            var div = textDivs[divIdx];
            div.textContent = '';
            appendTextToDiv(divIdx, 0, begin.offset, className);
          }

          function appendText(from, to, className) {
            appendTextToDiv(from.divIdx, from.offset, to.offset, className);
          }

          function appendTextToDiv(divIdx, fromOffset, toOffset, className) {
            var div = textDivs[divIdx];

            var content = bidiTexts[divIdx].str.substring(fromOffset, toOffset);
            var node = document.createTextNode(content);
            if (className) {
              var span = document.createElement('span');
              span.className = className;
              span.appendChild(node);
              div.appendChild(span);
              return;
            }
            div.appendChild(node);
          }

          function highlightDiv(divIdx, className) {
            textDivs[divIdx].className = className;
          }

          var i0 = selectedMatchIdx, i1 = i0 + 1, i;

          if (highlightAll) {
            i0 = 0;
            i1 = matches.length;
          } else if (!isSelectedPage) {
            // Not highlighting all and this isn't the selected page, so do nothing.
            return;
          }

          for (i = i0; i < i1; i++) {
            var match = matches[i];
            var begin = match.begin;
            var end = match.end;

            var isSelected = isSelectedPage && i === selectedMatchIdx;
            var highlightSuffix = (isSelected ? ' selected' : '');
            if (isSelected && !this.isViewerInPresentationMode) {
              // ALFRESCO - change reference to select correct pageIdx
              this.pdfJsPlugin.documentView.pages[this.pageIdx].scrollIntoView(textDivs[begin.divIdx],
                  { top: this.FIND_SCROLL_OFFSET_TOP, left: this.FIND_SCROLL_OFFSET_LEFT });
              // END ALFRESCO
            }

            // Match inside new div.
            if (!prevEnd || begin.divIdx !== prevEnd.divIdx) {
              // If there was a previous div, then add the text at the end
              if (prevEnd !== null) {
                appendText(prevEnd, infty);
              }
              // clears the divs and set the content until the begin point.
              beginText(begin);
            } else {
              appendText(prevEnd, begin);
            }

            if (begin.divIdx === end.divIdx) {
              appendText(begin, end, 'highlight' + highlightSuffix);
            } else {
              appendText(begin, infty, 'highlight begin' + highlightSuffix);
              for (var n = begin.divIdx + 1; n < end.divIdx; n++) {
                highlightDiv(n, 'highlight middle' + highlightSuffix);
              }
              beginText(end, 'highlight end' + highlightSuffix);
            }
            prevEnd = end;
          }

          if (prevEnd) {
            appendText(prevEnd, infty);
          }
      },

      /**
       *
       * 
       * @instance
       */
      updateMatches: function alfresco_preview_PdfJs_TextLayerBuilder__updateMatches() {
         // Only show matches, once all rendering is done.
         if (!this.renderingDone) {
            return;
         }

         // Clear out all matches.
         var matches = this.matches;
         var textDivs = this.textDivs;
         var bidiTexts = this.textContent.items;
         var clearedUntilDivIdx = -1;

         // Clear out all current matches.
         for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            var begin = Math.max(clearedUntilDivIdx, match.begin.divIdx);
            for (var n = begin; n <= match.end.divIdx; n++) {
               var div = textDivs[n];
               div.textContent = bidiTexts[n].str;
               div.className = '';
            }
            clearedUntilDivIdx = match.end.divIdx + 1;
         }

         if (this.pdfJsPlugin._findController === null || !this.pdfJsPlugin._findController.active) {
            return;
         }

         // Convert the matches on the page controller into the match format used
         // for the textLayer.
         this.matches = matches = 
            (this.convertMatches(this.pdfJsPlugin._findController === null ? [] : (this.pdfJsPlugin._findController.pageMatches[this.pageIdx] || [])));

         this.renderMatches(this.matches);
      }
   });
});