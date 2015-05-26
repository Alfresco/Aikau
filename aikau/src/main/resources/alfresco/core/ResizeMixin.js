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
 * This provides functions for both publishing resize payloads and handling resize subscriptions. Widgets that
 * need to publish information about being resized (such as the [AlfSideBarContainer]{@link module:alfresco/layout/AlfSideBarContainer})
 * should call the [alfPublishResizeEvent function]{@link module:alfresco/core/ResizeMixin#alfPublishResizeEvent} passing
 * the node that has been resized. Widgets that need to handle either window or containing node resize events 
 * (such as the [Grid]{@link module:alfresco/lists/views/layouts/Grid} and the [Carousel]{@link module:alfresco/lists/views/layouts/Carousel}
 * should call the 
 * call the [alfSetupResizeSubscriptions function]{@link module:alfresco/core/ResizeMixin#alfSetupResizeSubscriptions} passing
 * the handler and scope to use when resize events occur.
 * 
 * @module alfresco/core/ResizeMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/dom"], 
        function(declare, lang, on, dom) {
   
   return declare(null, {
      
      /**
       * The topic to use for publishing and subscribing to node resize events
       *
       * @event
       * @instance
       * @type {string}
       * @default "ALF_NODE_RESIZED"
       */
      alfResizeNodeTopic: "ALF_NODE_RESIZED",

      /**
       * Publishes on a topic that indicates that the supplied node has been resized.
       *
       * @instance
       * @param {object} resizedNode The node that has been resized
       * @fires module:alfresco/core/ResizeMixin#alfResizeNodeTopic
       */
      alfPublishResizeEvent: function alfresco_core_ResizeMixin__alfPublishResizeEvent(resizedNode) {
         // Fire a custom event to let contained objects know that the node has been resized.
         this.alfPublish(this.alfResizeNodeTopic, {
            node: resizedNode
         }, true);
      },

      /**
       * Sets up common subscriptions for handling resize events.
       *
       * @instance
       * @param {function} resizeHandler
       * @param {object} resizeHandlerCallScope The "this" object to use with the supplied resize handler
       * @listens module:alfresco/core/ResizeMixin#alfResizeNodeTopic
       */
      alfSetupResizeSubscriptions: function alfresco_core_ResizeMixin__alfSetupResizeSubscriptions(resizeHandler, resizeHandlerCallScope) {
         if (typeof resizeHandler !== "function")
         {
            this.alfLog("warn", "A request was made to setup subscriptions for resize events but the handler supplied was not a function", resizeHandler, this);
         }
         else
         {
            var scope = (resizeHandlerCallScope != null) ? resizeHandlerCallScope : this,
               resizeListener = on(window, "resize", lang.hitch(scope, resizeHandler));
            if(typeof this.own === "function") { // If we're in a widget, use it to handle cleaning up the listener
               this.own(resizeListener);
            }
            this.alfSubscribe(this.alfResizeNodeTopic, lang.hitch(this, this.alfOnNodeResized, resizeHandler, scope), true);
         }
      },

      /**
       * This is the handler for node resize events. If the resized node is an ancestor of the DOM node
       * then the supplied handler will be called.
       * 
       * @instance
       * @param {function} resizeHandler
       * @param {object} resizeHandlerCallScope The "this" object to use with the supplied resize handler
       * @param {object} payload The details of the node that has been resized.
       */
      alfOnNodeResized: function alfresco_core_ResizeMixin__alfOnNodeResized(resizeHandler, resizeHandlerCallScope, payload) {
         if (this.domNode && dom.isDescendant(this.domNode, payload.node))
         {
            resizeHandler.apply(resizeHandlerCallScope, [payload.node]);
         }
      }
   });
});