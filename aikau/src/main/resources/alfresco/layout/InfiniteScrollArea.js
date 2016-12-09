/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * This layout widget can be wrapped around any [paginated list]{@link module:alfresco/lists/AlfSortablePaginatedList}
 * configured to use [infinite scrolling]{@link module:alfresco/lists/AlfList#useInfiniteScroll] 
 * that is expected to grow taller than the height of its containing widget. It will automatically update its parent
 * widget to publish events as the bottom of the scrolling area is reached which will in turn cause the list to request
 * the next page of data. If the list is only constrained by the height of the browser then the
 * [InfiniteScrollService]{@link module:alfresco/services/InfiniteScrollService} should be used instead.
 *
 * @example <caption>List inside a [FixedHeaderFooter]{@link module:alfresco/layout/FixedHeaderFooter} widget</caption>
 * {
 *   name: "alfresco/layout/FixedHeaderFooter",
 *   config: {
 *     height: "200px",
 *     widgets: [
 *       {
 *         name: "alfresco/layout/InfiniteScrollArea",
 *         config: {
 *           widgets: [
 *             {
 *               name: "alfresco/lists/AlfSortablePaginatedList"
 *               config: {
 *                 useInfiniteScroll: true,
 *                 widgets: [
 *                   // Declare view here
 *                 ]
 *               }
 *             }
 *           ]
 *         }
 *       }
 *     ]
 *   }
 * }
 * 
 * @module alfresco/layout/InfiniteScrollArea
 * @extends module:alfresco/core/ProcessWidgets
 * @mixes module:alfresco/services/InfiniteScrollService
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/ProcessWidgets",
        "alfresco/services/InfiniteScrollService",
        "alfresco/core/topics",
        "dojo/_base/lang"], 
        function(declare, ProcessWidgets, InfiniteScrollService, topics, lang) {
   
   return declare([ProcessWidgets, InfiniteScrollService], {
      
      /**
       * The CSS class (or a space separated list of classes) to include in the DOM node.
       * 
       * @instance
       * @type {string}
       * @default
       */
      baseClass: "alfresco-layout-InfiniteScrollArea",

      /**
       * This overrides the [inherited default]{@link module:alfresco/services/InfiniteScrollService#_registerScrollListenerImmediately}
       * to ensure that the [publishScrollEvents function]{@link module:alfresco/core/_EventsMixin#publishScrollEvents} is NOT called
       * automatically in the constructor.
       *
       * @instance
       * @override
       * @type {boolean}
       * @default
       */
      _registerScrollListenerImmediately: false,

      /**
       * <p>The primary purpose of this widget is to support infinite scrolling of [lists]{@link module:alfresco/lists/AlfList} within a fixed 
       * height area. Loadingmore data requires that either a scroll bar is present or the area is resized. However there may be circumstances
       * where the area is too tall, and the initial [page size]{@link module:alfresco/lists/AlfSortablePaginatedList#currentPageSize} to small
       * for list data to fill. If this attribute is configured to be true then the height of the parent element will be compared against the
       * height of this widget each time list data is loaded, and if the height of this widget is not as big as that of its parent element
       * then a request for more data will be made.</p>
       *
       * <p>However, in order for this to work it is important that both the [list]{@link module:alfresco/lists/AlfList} and this
       * widget share the same pubSubScope, the same 
       * [requestFinishedTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#requestFinishedTopic} topic and the same
       * [scrollNearBottom]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#scrollNearBottom} topic. Each time the
       * [requestFinishedTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#requestFinishedTopic} is published the
       * [onDataLoaded]{@link module:alfresco/layout/InfiniteScrollArea#onDataLoaded} function will be called to compare heights and
       * request more data by publishing the [scrollNearBottom]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#scrollNearBottom}
       * topic if necessary</p>
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      fillAvailableHeight: true,

      /**
       * The constructor
       *
       * @instance
       */
      constructor: function() {
         this.alfSubscribe(this.eventsResizeTopic, lang.hitch(this, this.onEventsResize));
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/core/ProcessWidgets#postCreate} to
       * set the mixed in [element]{@link module:alfresco/core/_EventsMixin#scrollElement}
       * to detect scroll position on
       *
       * @instance
       * @listens module:alfresco/core/topics#VIEW_RENDERING_COMPLETE
       */
      postCreate: function alfresco_layout_InfiniteScrollArea__postCreate() {
         this.inherited(arguments);
         this.publishScrollEvents(this.domNode.parentNode);
         this.publishResizeEvents(this.domNode.parentNode);

         if (this.fillAvailableHeight)
         {
            this.alfSubscribe(topics.VIEW_RENDERING_COMPLETE, lang.hitch(this, this.onDataLoaded));
         }
      },

      /**
       * This function is called when data is successfully loaded by a [list]{@link module:alfresco/lists/AlfList} 
       * contained within this widget and it compares the height of the widget with that of its parent to determine
       * whether or not to make a request for more data.
       *
       * @instance
       */
      onDataLoaded: function alfresco_layout_InfiniteScrollArea__onDataLoaded() {
         if (this.domNode.clientHeight < this.domNode.parentNode.clientHeight)
         {
            this.alfPublish(this.scrollNearBottom);
         }
      },

      /**
       * Handle resize events on the parent node
       *
       * @instance
       * @param {Object} payload The payload from the resize
       */
      onEventsResize: function alfresco_layout_InfiniteScrollArea__onEventsResize(payload) {
         if (payload.node === this.domNode.parentNode) {
            this.alfPublish("ALF_EVENTS_SCROLL", {
               node: payload.node
            });
         }
      }
   });
});