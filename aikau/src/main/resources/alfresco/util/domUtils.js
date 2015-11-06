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
 * Utility object for dom-related utilities. Note that this is not a Class, and so does
 * not need to be instantiated before use.
 *
 * @module alfresco/util/domUtils
 * @author Martin Doyle
 * @since 1.0.42
 */
define([
      "dojo/_base/lang",
      "dojo/dom-style",
      "dojo/on",
      "dojo/sniff"
   ],
   function(lang, domStyle, on, has) {

      // The private container for the functionality and properties of the util
      var util = {

         // See API below
         addResizeListener: function alfresco_util_domUtils__addResizeListener(node, resizeHandler) {

            // Setup the listener-removal object
            var listenerRemovalObj = {};

            // Do the rest of the work asynchronously to prevent widget-loading problems
            setTimeout(function() {

               // Setup the resize listener function
               var resizeObj,
                  onLoadListener,
                  removeListenerFunc;

               // NOTE: Dojo IE detection not working very well here, so done manually instead
               var ieRegex = /(Trident\/)|(Edge\/)/,
                  isIE = has("IE") || ieRegex.test(navigator.userAgent);

               // Create the resize object
               resizeObj = document.createElement("object");
               resizeObj.className = "alfresco-core-ResizeMixin__resize-object";
               resizeObj.type = "text/html";
               domStyle.set(resizeObj, {
                  "display": "block",
                  "height": "100%",
                  "left": 0,
                  "overflow": "hidden",
                  "position": "absolute",
                  "top": 0,
                  "width": "100%",
                  "z-index": -1
               });

               // Setup the resize listener functionality
               onLoadListener = on(resizeObj, "load", function() {
                  resizeObj.contentDocument.defaultView.addEventListener("resize", resizeHandler);
                  removeListenerFunc = function() {
                     resizeObj.contentDocument.defaultView.removeEventListener("resize", resizeHandler);
                  };
                  onLoadListener.remove();
               });

               // Node cannot have position static
               var nodeStyle = getComputedStyle(node),
                  nodeIsStatic = nodeStyle.position === "static";
               if (nodeIsStatic) {
                  node.style.position = "relative";
               }

               // FF doesn't like visibility hidden (interferes with the resize event), Chrome doesn't care, IE needs it
               if (isIE) {
                  resizeObj.style.visibility = "hidden";
               }

               // Normal browsers do this before appending to the DOM
               if (!isIE) {
                  resizeObj.data = "about:blank";
               }

               // Add the object to the document
               if (node.hasChildNodes()) {
                  node.insertBefore(resizeObj, node.firstChild);
               } else {
                  node.appendChild(resizeObj);
               }

               // IE needs to do this after
               if (isIE) {
                  resizeObj.data = "about:blank";
               }

               // Update the listener removal object to add the remove function
               listenerRemovalObj.remove = function() {
                  /*jshint devel:true*/
                  try {
                     removeListenerFunc();
                     node.removeChild(resizeObj);
                  } catch (e) {
                     console.warn("Error attempting to remove resize listener", e);
                  }
               };
            }, 0);

            // Pass back the listener-removal object
            return listenerRemovalObj;
         }
      };

      /**
       * The public API for this utility class
       *
       * @alias module:alfresco/util/domUtils
       */
      return {

         /**
          * <p>In IE9+ and Chrome/FF, setup a listener on a specific node that will call the supplied handler-function whenever that node resizes</p>
          *
          * <p>NOTE: This is based on a technique described at
          * {@link http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection}</p>
          *
          * @instance
          * @param {object} node The node to monitor
          * @param {function} resizeHandler The function to call on resize
          * @returns {object} A pointer to the listener, with a remove function on it (i.e. it can be passed to this.own)
          */
         addResizeListener: lang.hitch(util, util.addResizeListener)
      };
   });