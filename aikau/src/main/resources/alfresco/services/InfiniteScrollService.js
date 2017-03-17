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
 * This service should be included on a page whenever you want to configure an
 * [AlfSortablePaginatedList]{@link module:alfresco/lists/AlfSortablePaginatedList} to be
 * configured to use infinite scrolling for handling pagination.
 * 
 * @module alfresco/services/InfiniteScrollService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @mixes module:alfresco/core/_EventsMixin
 * @author david.webster@alfresco.com
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang",
        "alfresco/core/_EventsMixin",
        "alfresco/core/DomElementUtils"],
        function(declare, BaseService, _AlfDocumentListTopicMixin, lang, _EventsMixin, AlfDomUtils) {

   return declare([BaseService, _AlfDocumentListTopicMixin, _EventsMixin, AlfDomUtils], {

      /**
       * Used to keep track of the current status of the InfiniteScroll
       *
       * @instance
       * @type {boolean}
       * @default
       */
      dataloadInProgress: false,

      /**
       * Scroll tolerance in pixels.
       *
       * How close to the bottom of the page do we want to get before we request the next items?
       *
       * @instance
       * @type {int}
       * @default
       */
      scrollTolerance: 500,

      /**
       * By default, the [publishScrollEvents function]{@link module:alfresco/core/_EventsMixin#publishScrollEvents}
       * will be called in the constructor. If overridden and set to false then it will not, and should instead be
       * called manually later on.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      _registerScrollListenerImmediately: true,

      /**
       * @instance
       * @listens scrollReturn
       * @listens requestFinishedTopic
       * @listens eventsScrollTopic
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_InfiniteScrollService__registerSubscriptions() {
         // Register the events listeners...
         if (this._registerScrollListenerImmediately)
         {
            this.publishScrollEvents();
         }
         
         // hook point to allow other widgets to let us know when they're done processing a scroll request.
         this.alfSubscribe(this.scrollReturn, lang.hitch(this, this.onScrollReturn));

         // Bind to this explicitly to reduce duplication in other widgets
         this.alfSubscribe(this.requestFinishedTopic, lang.hitch(this, this.onScrollReturn));

         // tie in to the events scroll module.
         this.alfSubscribe(this.eventsScrollTopic, lang.hitch(this, this.onEventsScroll));
      },

      /**
       * When the scroll event triggers, check location and pass on the warning that we're near the bottom of the page
       * sets dataloadInProgress to prevent duplicated triggers when the page is scrolled slowly.
       *
       * @instance
       * @param {object} payload
       */
      onEventsScroll: function alfresco_services_InfiniteScrollService__onEventsScroll(payload) {
         if (this.nearBottom(payload.node) && !this.dataloadInProgress) {
            this.dataloadInProgress = true;
            this.alfPublish(this.scrollNearBottom);
         }
      },

      /**
       * Called when infinite scroll request has been processed and allows us to trigger further scroll events
       *
       * @instance
       * @param {object} payload
       */
      onScrollReturn: function alfresco_services_InfiniteScrollService__onScrollReturn(/*jshint unused:false*/ payload) {
         this.dataloadInProgress = false;
      },

      /**
       * Determine if we're at or close to the bottom of the monitored node as defined by the
       * [scrollTolerance variable]{@link module:alfresco/services/InfiniteScrollService#scrollTolerance}.
       *
       * @instance
       * @param {Object} scrollNode The node being scrolled
       * @returns {boolean}
       */
      nearBottom: function alfresco_services_InfiniteScrollService__nearBottom(scrollNode) {
         var scrollHeight,
            clientHeight,
            scrollTop;
         if(scrollNode === window) {
            scrollHeight = document.body.scrollHeight;
            clientHeight = window.innerHeight;
            scrollTop = window.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
         } else {
            scrollHeight= scrollNode.scrollHeight;
            clientHeight= scrollNode.clientHeight;
            scrollTop= scrollNode.scrollTop;
         }
         return (scrollHeight - clientHeight - scrollTop) < this.scrollTolerance;
      }
   });
});