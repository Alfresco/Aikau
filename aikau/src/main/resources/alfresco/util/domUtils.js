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
 * Utility object for dom-related utilities. Note that this is not a Class, and so does
 * not need to be instantiated before use.
 *
 * @module alfresco/util/domUtils
 * @author Martin Doyle
 * @since 1.0.42
 */
define([
      "alfresco/util/functionUtils",
      "dojo/_base/array",
      "dojo/_base/lang",
      "dojo/dom-style",
      "dojo/dom-class",
      "dojo/on",
      "dojo/sniff"
   ],
   function(funcUtils, array, lang, domStyle, domClass, on, has) {

      // An object for containing resize-monitoring state information
      var resizeMonitor = {
         nodes: {},
         removeObj: null
      };

      // Define the class to decorate a node with when resizes on it should be ignored
      var ignoreResizeClass = "dom-utils--ignore-resize",
         ignoreResizeRegexp = new RegExp("\\b" + ignoreResizeClass + "\\b");

      // The private container for the functionality and properties of the util
      var util = {

         // See API below
         addObjectResizeListener: function alfresco_util_domUtils__addObjectResizeListener(node, resizeHandler) {

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
         },

         // See API below
         addPollingResizeListener: function alfresco_util_domUtils__addPollingResizeListener(nodeToMonitor, resizeHandler) {

            // Add the new monitoring nodes
            var nodes = resizeMonitor.nodes,
               monitorKey = Date.now();
            while (nodes.hasOwnProperty(monitorKey)) {
               monitorKey = Date.now();
            }
            nodes[monitorKey] = {
               domNode: nodeToMonitor,
               height: nodeToMonitor.offsetHeight,
               width: nodeToMonitor.offsetWidth,
               callbackFunc: resizeHandler
            };

            // If there is no monitoring running, start it up
            if (!resizeMonitor.removeObj) {
               resizeMonitor.removeObj = funcUtils.addRepeatingFunction(this._checkNodesForResize, "SHORT");
            }

            // Pass back the removal object
            return {
               remove: function() {
                  delete nodes[monitorKey]; // Remove this monitored node
                  if (resizeMonitor.removeObj && !Object.keys(nodes).length) {
                     resizeMonitor.removeObj.remove(); // If no nodes are monitored, remove the monitoring function
                     resizeMonitor.removeObj = null;
                  }
               }
            };
         },

         // See API below
         describeNode: function alfresco_util_domUtils__describeNode(node, includeAttrs) {

            // If we have a falsy node, just pass it straight back
            if (!node) {
               return node;
            }

            // Initialise description as for text nodes
            var description = "\"" + node.textContent + "\"";

            // We only deal with text nodes (already done) and element nodes
            if (node.nodeType === 1) {

               // Start with the tag name
               description = node.tagName;

               // Add the ID
               if (node.id) {
                  description += "#" + node.id;
               }

               // Add the classes
               var classes = (node.className && node.className.split(" ")) || [];
               array.forEach(classes, function(clazz) {
                  description += "." + clazz;
               });

               // Optionally add the attributes
               var nextAttr, i;
               if (includeAttrs && node.attributes.length) {
                  for (i = 0; i < node.attributes.length; i++) {
                     nextAttr = node.attributes[i];
                     description += "[" + nextAttr.name + "=\"" + nextAttr.value + "\"]";
                  }
               }

            } else if (node.nodeType !== 3) {

               // Not text or element node!
               console.warn("[alfresco_util_domUtils__describeNode] Unhandle node type (" + node.nodeType + "): ", node);
            }

            // Pass back the constructed description
            return description;
         },

         // See API below
         noticeResizes: function alfresco_util_domUtils__noticeResizes(nodes) {
            this._setResizeIgnored(nodes, false);
         },

         // See API below
         ignoreResizes: function alfresco_util_domUtils__ignoreResizes(nodes) {
            this._setResizeIgnored(nodes, true);
         },

         // Run through the nodes registered to notify on resize, calling the function if necessary
         // NOTE: All of the size-checks are completed before any callback functions are called because
         // if the callbacks cause any redraws then each access of offsetXXX will cause another re-calculation
         // of the current layout (i.e. it could be wildly inefficient if we don't do all the size-checking first)
         _checkNodesForResize: function alfresco_util_domUtils___checkNodesForResize() {
            var resizedNodeKeys = [],
               nodeKeys = Object.keys(resizeMonitor.nodes);
            array.forEach(nodeKeys, function(nodeKey) {
               var node = resizeMonitor.nodes[nodeKey],
                  newWidth = node.domNode.offsetWidth,
                  newHeight = node.domNode.offsetHeight,
                  sizeChanged = node.width !== newWidth || node.height !== newHeight,
                  notificationDisabled = ignoreResizeRegexp.test(node.domNode.className);
               if (sizeChanged) {
                  node.width = newWidth;
                  node.height = newHeight;
                  if (!notificationDisabled) {
                     resizedNodeKeys.push(nodeKey);
                  }
               }
            });
            array.forEach(resizedNodeKeys, function(nodeKey) {
               try {
                  resizeMonitor.nodes[nodeKey].callbackFunc();
               } catch (e) {
                  console.error("Error occurred while executing resize-callback (node will no longer be monitored): ", resizeMonitor.nodes[nodeKey], e);
                  delete resizeMonitor.nodes[nodeKey];
               }
            });
         },

         // See API below
         _setResizeIgnored: function alfresco_util_domUtils___setResizeIgnored(nodeOrNodes, doIgnore) {
            var nodes = nodeOrNodes.constructor === Array ? nodeOrNodes : [nodeOrNodes];
            array.forEach(nodes, function(node) {
               domClass[doIgnore ? "add" : "remove"](node, ignoreResizeClass);
            });
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
          * <p><strong>WARNING:</strong> This is NOT scalable, as it adds approx 500KB to the page's memory usage every time it's used, however
          * it has been left here in case it's more suitable than polling, which might be the case for very limited usage as there's no polling
          * overhead associated with this technique.</p>
          *
          * @instance
          * @function
          * @param {object} node The node to monitor
          * @param {function} resizeHandler The function to call on resize
          * @returns {object} A pointer to the listener, with a remove function on it (i.e. it can be passed to this.own)
          * @since 1.0.43
          */
         addObjectResizeListener: lang.hitch(util, util.addObjectResizeListener),

         /**
          * Setup a listener on a specific node that will call the supplied handler-function whenever that node resizes. This works
          * by having a single "process" polling every 100ms and then checking all registered nodes for size-changes.
          *
          * @instance
          * @function
          * @param {object} node The node to monitor
          * @param {function} resizeHandler The function to call on resize
          * @returns {object} A pointer to the listener, with a remove function on it (i.e. it can be passed to this.own)
          * @since 1.0.43
          */
         addPollingResizeListener: lang.hitch(util, util.addPollingResizeListener),

         /**
          * See the replacement [addPollingResizeListener]{@link module:alfresco/util/domUtils#addPollingResizeListener} for more
          * information.
          *
          * @instance
          * @function
          * @param {object} node The node to monitor
          * @param {function} resizeHandler The function to call on resize
          * @returns {object} A pointer to the listener, with a remove function on it (i.e. it can be passed to this.own)
          * @deprecated Since 1.0.43 - Use [addPollingResizeListener]{@link module:alfresco/util/domUtils#addPollingResizeListener} instead
          */
         addResizeListener: lang.hitch(util, util.addPollingResizeListener),

         /**
          * Given a node in the document, return a string that identifies that node as much as possible.
          *
          * @instance
          * @function
          * @param {object} node The node to describe
          * @param {boolean} [includeAttrs=false] Include the attributes in the description
          * @returns {string} The description of the node, e.g. 'div#myId.class1.class2[tabindex=0]' or "my string"
          * @since 1.0.48
          */
         describeNode: lang.hitch(util, util.describeNode),

         /**
          * Given a domNode, disable resize listening on that node temporarily.
          *
          * @instance
          * @function
          * @param {object|object[]} nodes The node or nodes to disable resize-listening on.
          * @since 1.0.46
          */
         ignoreResizes: lang.hitch(util, util.ignoreResizes),

         /**
          * Given a domNode, re-enable resize listening on that node. Note that this will not add a new resize listener
          * to a node, merely re-enable an existing, disabled one.
          *
          * @instance
          * @function
          * @param {object|object[]} nodes The node or nodes to re-enable resize-listening on.
          * @since 1.0.46
          */
         noticeResizes: lang.hitch(util, util.noticeResizes)
      };
   });