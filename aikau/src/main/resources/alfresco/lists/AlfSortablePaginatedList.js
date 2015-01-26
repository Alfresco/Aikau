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
 * This extends the [hash list]{@link module:alfresco/lists/AlfHashList} to provide support
 * for common pagination and sorting behaviour.
 *
 * @module alfresco/lists/AlfSortablePaginatedList
 * @extends module:alfresco/lists/AlfHashList
 * @mixes module:alfresco/services/_PreferenceServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/AlfHashList",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "dojo/_base/lang",
        "dojo/hash",
        "dojo/io-query"],
        function(declare, AlfHashList, _PreferenceServiceTopicMixin, lang, hash, ioQuery) {

   return declare([AlfHashList, _PreferenceServiceTopicMixin], {

      /**
       * Indicates whether pagination should be used when requesting documents (e.g. include the page number and the number of
       * results per page)
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      usePagination: true,

      /**
       * The current page number being shown.
       *
       * @instance
       * @type {number}
       * @default 1
       */
      currentPage: 1,

      /**
       * The size (or number of items) to be shown on each page.
       *
       * @instance
       * @type {number}
       * @default 25
       */
      currentPageSize: 25,

      /**
       * The inital sort order.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      sortAscending: true,

      /**
       * The initial field to sort results on. For historical reasons the default is the "cm:name"
       * property (because the DocumentLibrary was the first implementation of this capability.
       *
       * @instance
       * @type {string}
       * @default "cm:name"
       */
      sortField: "cm:name",

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfList#postMixInProperties}
       * to request the users documents per page preference.
       *
       * @instance
       */
      postMixInProperties: function alfresco_lists_AlfSortablePaginatedList__postMixInProperties() {
         this.inherited(arguments);
         this.alfPublish(this.getPreferenceTopic, {
            preference: "org.alfresco.share.documentList.documentsPerPage",
            callback: this.setPageSize,
            callbackScope: this
         });
      },

      /**
       * Sets the number of documents per page
       *
       * @instance
       * @param {number} value The number of documents per page.
       */
      setPageSize: function alfresco_lists_AlfSortablePaginatedList__setPageSize(value) {
         if (value == null)
         {
            value = 25;
         }
         this.currentPageSize = value;
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfList#setupSubscriptions}
       * to add in additional subscriptions for the common sorting and pagination topics.
       *
       * @instance
       */
      setupSubscriptions: function alfresco_lists_AlfSortablePaginatedList__setupSubscriptions() {
         this.inherited(arguments);
         this.alfSubscribe(this.sortRequestTopic, lang.hitch(this, this.onSortRequest));
         this.alfSubscribe(this.sortFieldSelectionTopic, lang.hitch(this, this.onSortFieldSelection));
         this.alfSubscribe(this.pageSelectionTopic, lang.hitch(this, this.onPageChange));
         this.alfSubscribe(this.docsPerpageSelectionTopic, lang.hitch(this, this.onItemsPerPageChange));
      },

      /**
       * @instance
       * @param {object} payload The details of the request
       */
      onSortRequest: function alfresco_lists_AlfSortablePaginatedList__onSortRequest(payload) {
         this.alfLog("log", "Sort requested: ", payload);
         if (payload && (payload.direction != null || payload.value != null))
         {
            if (payload.direction)
            {
               this.sortAscending = (payload.direction == "ascending");
            }
            if (payload.value)
            {
               this.sortField = payload.value;
            }
            if (this._readyToLoad === true)
            {
               if (this.useHash === true)
               {
                  var currHash = ioQuery.queryToObject(hash());
                  if (this.sortField != null)
                  {
                     currHash.sortField = this.sortField;
                  }
                  if (this.sortAscending != null)
                  {
                     currHash.sortAscending = this.sortAscending;
                  }
                  this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
                     url: ioQuery.objectToQuery(currHash),
                     type: "HASH"
                  }, true);
               }
               else
               {
                  this.loadData();
               }
            }
         }
      },

      /**
       * @instance
       * @param {object} payload The details of the request
       */
      onSortFieldSelection: function alfresco_lists_AlfSortablePaginatedList__onSortFieldSelection(payload) {
         this.alfLog("log", "Sort field selected: ", payload);
         if (payload && payload.value != null)
         {
            this.sortField = payload.value;
            if (payload.direction)
            {
               this.sortAscending = (payload.direction == "ascending");
            }
            if (this._readyToLoad === true)
            {
               if (this.useHash === true)
               {
                  var currHash = ioQuery.queryToObject(hash());
                  if (this.sortField != null)
                  {
                     currHash.sortField = this.sortField;
                  }
                  if (this.sortAscending != null)
                  {
                     currHash.sortAscending = this.sortAscending;
                  }
                  this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
                     url: ioQuery.objectToQuery(currHash),
                     type: "HASH"
                  }, true);
               }
               else
               {
                  this.loadData();
               }
            }
         }
      },

      /**
       * @instance
       * @param {object} payload The details of the new page number
       */
      onPageChange: function alfresco_lists_AlfSortablePaginatedList__onPageChange(payload) {
         if (payload && payload.value != null && payload.value != this.currentPage)
         {
            this.currentPage = payload.value;
            if (this._readyToLoad) this.loadData();
         }
      },

      /**
       * @instance
       * @param {object} payload The details of the new page size
       */
      onItemsPerPageChange: function alfresco_lists_AlfSortablePaginatedList__onItemsPerPageChange(payload) {
         if (payload && payload.value != null && payload.value != this.currentPageSize)
         {
            // Set the new page size...
            this.currentPageSize = payload.value;

            if (this._readyToLoad === true)
            {
               // Need to check that there is enough data available for the current page!!! e.g. if we're on page 3 and requesting page 3 will not return any results
               // Is the total number of records less than the requested docs per page multiplied by 1 less than the current page...
               var totalRecords = lang.getObject("currentData.totalRecords", false, this);
               if (totalRecords != null)
               {
                  // If the total records available minus the requested page size is LESS than the current page size
                  // multiplied by the requested page size then we need to display the LAST page of data, e.g:
                  // 
                  // Previous page size is 25 
                  // Current page = 3
                  // Requested page size is 50
                  // Total records is 52
                  // So that: (52 - 50 = 2) < (3 * 50 = 75) = TRUE
                  if ((totalRecords - payload.value) < (this.currentPage * payload.value))
                  {
                     // The current page should be 2 and not 3.
                     // E.g. 52/50 = 1.04, round up to 2...
                     this.currentPage = Math.ceil(this.currentData.totalRecords/payload.value);
                  }
               }
               else
               {
                  // No need to worry. The current page is fine for the new page size so it can be set safely...
               }
               this.loadData();
            }
         }
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/AlfList#onScrollNearBottom} to request
       * more data when the user scrolls to the bottom of the browser page.
       *
       * @instance
       * @param payload
       */
      onScrollNearBottom: function alfresco_lists_AlfSortablePaginatedList__onScrollNearBottom(payload) {
         // Process Infinite Scroll, if enabled & if we've not hit the end of the results
         if(this.useInfiniteScroll && this.currentData.totalRecords < this.currentData.numberFound)
         {
            this.currentPage++;
            this.loadData();
         }
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfList#updateLoadDataPayload} to
       * add the additional pagination and sorting data to the supplied payload object.
       *
       * @instance
       * @param {object} payload The payload object to update
       */
      updateLoadDataPayload: function alfresco_lists_AlfSortablePaginatedList__updateLoadDataPayload(payload) {
         this.inherited(arguments);

         payload.sortAscending = this.sortAscending;
         payload.sortField = this.sortField;
         if (this.usePagination || this.useInfiniteScroll)
         {
            payload.page = this.currentPage;
            payload.pageSize = this.currentPageSize;
         }
      },

      /**
       * Reset the pagination data.
       *
       * This method is useful, e.g., when navigation between different list views.
       *
       */
      resetPaginationData: function alfresco_lists_AlfSortablePaginatedList__resetPaginationData()
      {
         // This intentionally doesn't trigger an onPageChange event (we don't want to cause a data reload event).
         this.alfLog("info", "Resetting currentPage to 1");
         this.currentPage = 1;
      }
   });
});