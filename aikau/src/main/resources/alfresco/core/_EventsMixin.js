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
 * <p>Provides Core event handlers for other widgets to use.</p>
 *
 * <p>Scroll and Resize events are rate limited: handlers listening to those emitted events
 * will not be triggered every time the browser triggers the corresponding event. This is to
 * provide optimised handlers that don't run too frequently.</p>
 *
 * @example <caption>Sample call</caption>
 * constructor: function() {
 *    this.publishScrollEvents(this.domNode);
 *    this.alfSubscribe(this.eventsScrollTopic, lang.hitch(this, this.onScroll));
 * }
 *
 * <p>If your handler needs EVERY browser event, then you're best off subscribing to those
 * events directly</p>
 *
 * @example <caption>Manual subscription</caption>
 * on(window, "scroll", lang.hitch(this, this.onScroll));
 *
 * @module alfresco/core/_EventsMixin
 * @mixes module:alfresco/core/Core
 * @author Martin Doyle
 */
define(["alfresco/core/Core",
      "alfresco/util/functionUtils",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "dojo/on"
   ],
   function(AlfCore, funcUtils, declare, lang, on) {

      return declare([AlfCore], {

         /**
          * This topic is used to subscribe to rate limited scroll events.
          *
          * @event eventsScrollTopic
          * @instance
          * @type {String}
          * @default "ALF_EVENTS_SCROLL"
          */
         eventsScrollTopic: "ALF_EVENTS_SCROLL",

         /**
          * This topic is used to subscribe to rate limited resize events.
          *
          * @event eventsResizeTopic
          * @instance
          * @type {String}
          * @default "ALF_EVENTS_SCROLL"
          */
         eventsResizeTopic: "ALF_EVENTS_RESIZE",

         /**
          * Debounce a simple topic publish
          *
          * @instance
          * @param {String} topic The topic to be published
          * @param {Object} [args] Can take any of the optional arguments from the
          *                        [functionUtils debounce method]{@link module:alfresco/util/functionUtils#debounce}
          */
         debouncedPublish: function(topic, args) {
            var publishFunc = lang.hitch(this, this.alfPublish, topic),
               debounceArgs = lang.mixin({
                  name: topic,
                  func: publishFunc
               }, args || {});
            funcUtils.debounce(debounceArgs);
         },

         /**
          * Throttle a simple topic publish
          *
          * @instance
          * @param {String} topic The topic to be published
          * @param {Object} [args] Can take any of the optional arguments from the
          *                        [functionUtils throttle method]{@link module:alfresco/util/functionUtils#throttle}
          */
         throttledPublish: function(topic, args) {
            var publishFunc = lang.hitch(this, this.alfPublish, topic),
               throttleArgs = lang.mixin({
                  name: topic,
                  func: publishFunc
               }, args || {});
            funcUtils.throttle(throttleArgs);
         },

         /**
          * When a scroll event happens on the specified node (defaults to window), then publish
          * to the [scroll topic]{@link module:alfresco/core/_EventsMixin#eventsScrollTopic}.
          *
          * @instance
          * @param {Object} [scrollNode=window] The scroll node
          */
         publishScrollEvents: function(scrollNode) {
            var scrollListener = on(scrollNode || window, "scroll", lang.hitch(this, this.throttledPublish, this.eventsScrollTopic));
            this.own && this.own(scrollListener);
         },

         /**
          * When a resize event happens on the window, then publish
          * to the [resize topic]{@link module:alfresco/core/_EventsMixin#eventsResizeTopic}.
          *
          * @instance
          */
         publishResizeEvents: function() {
            var resizeListener = on(window, "resize", lang.hitch(this, this.throttledPublish, this.eventsResizeTopic));
            this.own && this.own(resizeListener);
         }
      });
   });