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
 * This service should be included on a page whenever you want to configure an
 * [AlfSortablePaginatedList]{@link module:alfresco/lists/AlfSortablePaginatedList} to be
 * configured to use infinite scrolling for handling pagination.
 * 
 * @module alfresco/services/InfiniteScrollService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @mixes module:alfresco/core/Events
 * @mixes module:alfresco/core/AlfCoreEventsTopicMixin
 * @author david.webster@alfresco.com
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang",
        "alfresco/core/Events",
        "alfresco/core/EventsTopicMixin",
        "alfresco/core/DomElementUtils",
        "dojo/dom-geometry"],
        function(declare, AlfCore, _AlfDocumentListTopicMixin, lang, AlfCoreEvents, AlfCoreEventsTopicMixin, AlfDomUtils, domGeom) {

   return declare([AlfCore, _AlfDocumentListTopicMixin, AlfCoreEvents, AlfCoreEventsTopicMixin, AlfDomUtils], {

      /**
       * Used to keep track of the current status of the InfiniteScroll
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      dataloadInProgress: false,

      /**
       * Scroll tolerance in pixels.
       *
       * How close to the bottom of the page do we want to get before we request the next items?
       *
       * @instance
       * @type {int}
       * @default 500
       */
      scrollTolerance: 500,

      /**
       * @instance
       * @listens scrollReturn
       * @listens requestFinishedTopic
       * @listens eventsScrollTopic
       */
      constructor: function alfresco_services_InfiniteScrollService__constructor(args) {
         declare.safeMixin(this, args);

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
      onEventsScroll: function alfresco_services_InfiniteScrollService__onEventsScroll(/*jshint unused:false*/ payload) {
         if (this.nearBottom() && !this.dataloadInProgress) {
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
       * The calculation to determine if we're at or close to the bottom of the page yet or now.
       * "close to" bottom is defined by scrollTolerance var.
       *
       * @instance
       * @returns {boolean}
       */
      nearBottom: function alfresco_services_InfiniteScrollService__nearBottom() {
         var currentScrollPos = domGeom.docScroll().y,
             docHeight = this.getDocumentHeight(),
             viewport = domGeom.getContentBox(document.body).h;
         return 0 >= (docHeight - viewport - currentScrollPos - this.scrollTolerance);
      }
   });
});