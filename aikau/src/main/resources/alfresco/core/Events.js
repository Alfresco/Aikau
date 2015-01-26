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
 * Provides Core event handlers for other widgets to use.
 *
 * Scroll and Resize events are rate limited: handlers listening to those emitted events
 * will not be triggered every time the browser triggers the corresponding event. This is to
 * provide optimised handlers that don't run too frequently.
 *
 * Usage (remember to mixin alfresco/core/EventsTopicMixin):
 * this.alfSubscribe(this.eventsScrollTopic, lang.hitch(this, "onEventsScroll"));
 *
 * If your handler needs EVERY browser event, then you're best off subscribing to those
 * events directly, e.g.:
 * on(window, "scroll", lang.hitch(this, "onScroll"));
 *
 * @module alfresco/core/Events
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/EventsTopicMixin
 * @author David.Webster@alfresco.com
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/on",
        "dojo/_base/lang",
        "alfresco/core/EventsTopicMixin"],
        function(declare, AlfCore, on, lang, EventsTopicMixin) {

      return declare([AlfCore, EventsTopicMixin], {

         /**
          * How frequently do we want rate limited events to trigger?
          *
          * @instance
          * @type {int}
          * @default 300
          */
         triggerInterval: 300,

         /**
          * Used to store a handle to cancel the scroll timeout.
          *
          * @instance
          * @type {int}
          * @default: null
          */
         scrollTimeout: null,

         /**
          * Used to store a handle to cancel the resize timeout.
          *
          * @instance
          * @type {int}
          * @default: null
          */
         resizeTimeout: null,

         /**
          * The scroll event triggers once when the page had loaded. Generally we don't need this.
          * Should we ignore it?
          *
          * @instance
          * @type Boolean
          * @default true
          */
         ignoreInitialScroll: true,

         /**
          *  Has the initial scroll event as specified in ignoreInitialScroll happened yet?
          */
         hasInitialScrollHappened: false,

         /**
          * Constructor - called when module is mixed in. Registers the listeners.
          *
          * @instance
          * @param {object} args modules to mixin
          */
         constructor: function alfresco_core_Events_constructor(args) {
            lang.mixin(this, args);
            this.alfLog('log', 'alfresco/core/Events Registering');

            on(window, "scroll", lang.hitch(this, "onScroll"));
            // TODO: Sweep through modules and replace individual resize listeners with this?
            on(window, "resize", lang.hitch(this, "onResize"));
         },

         /**
          * The limit function. Prevents multiple events triggering in very quick succession.
          *
          * In Throttle mode:
          * Triggers once per triggerInterval for as long as the event keeps being fired.
          * TODO: In throttle mode should event trigger before or after delay? (currently after)
          *
          * In debounce mode:
          * Triggers only once there is a gap of triggerInterval in the event being fired.
          *
          * @instance
          * @param {string} timeout variable name containing timeout.
          * @param {string} topic event to trigger
          * @param {int} triggerInterval Optional override for this.triggerInterval
          * @param {bool} throttle switches to throttle mode.
          */
         _limit: function alfresco_core_Events__debounce(timeout, topic, triggerInterval, throttle) {
            // If we've already got a timeout, we need to rate limit
            if (this[timeout]) {
               if (throttle) {
                  // In throttle mode, ignore subsequent events while timeout exists
                  return;
               }
               // In debounce mode, clear timeout and let a new one get set.
               clearTimeout(this[timeout]);
            }

            var timer = triggerInterval || this.triggerInterval;

            // set a timeout, storing a reference to allow us to check status/cancel later.
            this[timeout] = setTimeout(lang.hitch(this, "onTimeout", topic, timeout), timer);
         },

         /**
          * Calls [_limit]{@link module:alfresco/core/Events#_limit} in debounce mode.
          * @instance
          * @param {int} timeout
          * @param {string} topic
          * @param {int} triggerInterval
          */
         _debounce: function alfresco_core_Events__debounce(timeout, topic, triggerInterval) {
            this._limit(timeout, topic, triggerInterval, false);
         },

         /**
          * Calls [_limit]{@link module:alfresco/core/Events#_limit} in throttle mode.
          * @instance
          * @param {int} timeout
          * @param {string} topic
          * @param {int} triggerInterval
          */
         _throttle: function alfresco_core_Events__throttle(timeout, topic, triggerInterval) {
            this._limit(timeout, topic, triggerInterval, true);
         },

         /**
          * Called by _limit once the event triggers.
          * Publishes the requested topic & clears any timeout.
          *
          * @instance
          * @param {string} topic
          * @param {string} timeout variable name for var containing the timeout ref.
          */
         onTimeout: function alfresco_core_Events_onTimeout(topic, timeout) {
            this.alfPublish(topic);
            // clear the timeout so events can trigger again.
            this[timeout] = false;
         },

         /**
          * Throttles browser scroll events.
          * The event only triggers every [triggerInterval]{@link module:alfresco/core/Events#triggerInterval} ms.
          *
          * @instance
          * @fires eventsScrollTopic
          */
         onScroll: function alfresco_core_Events_onScroll() {
            // TODO: For performance, the throttle call probably shouldn't happen in an if statement.
            if (this.ignoreInitialScroll && !this.hasInitialScrollHappened)
            {
               this.hasInitialScrollHappened = true;
            }
            else
            {
               this._throttle("scrollTimeout", this.eventsScrollTopic);
            }
         },

         /**
          * Debounces browser resize events.
          * Event triggers once the user stops resizing for [triggerInterval]{@link module:alfresco/core/Events#triggerInterval} ms.
          *
          * @instance
          * @fires eventsResizeTopic
          */
         onResize: function alfresco_core_Events_onResize() {
            this._debounce("resizeTimeout", this.eventsResizeTopic);
         }

      });
   });