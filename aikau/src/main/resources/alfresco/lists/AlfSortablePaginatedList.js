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
       * An array of the i18n files to use with this widget. This re-uses the 
       * [Paginator]{@link module:alfresco/lists/Paginator} i18n properties.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Paginator.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Paginator.properties"}],

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

         if (this.useHash === true)
         {
            // If using the browser URL hash, then we want to update the currentPage, currentPageSize
            // sortField, sortAscending as these are the core parameters relating to sorting and pagination
            // and they should be handled irrespective of any other hashVarsForUpdate parameters requested
            this._coreHashVars = ["currentPage","currentPageSize","sortField","sortAscending"];
         }

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
         if (value === null || value === undefined)
         {
            value = 25;
         }
         this.currentPageSize = value;
         this.alfPublish(this.docsPerpageSelectionTopic, {
            label: this.message("list.paginator.perPage.label", {0: this.currentPageSize}),
            value: this.currentPageSize,
            selected: true
         });
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
       * Extends the [inherited function]{@link module:alfresco/lists/AlfList#onFilterRequest} to ensure
       * that when a new filter is set the page is reset to the first page.
       *
       * @instance
       * @param {object} payload The filter payload
       */
      onFilterRequest: function alfresco_lists_AlfSortablePaginatedList__onFilterRequest(/*jshint unused:false*/ payload) {
         if (payload && payload.name)
         {
            this.onPageChange({
               value: 1
            });
         }
         this.inherited(arguments);
      },

      /**
       * Checks the hash for updates relating to pagination and sorting.
       *
       * @instance
       * @param {object} hashParameters An object containing the current hash parameters
       */
      _updateCoreHashVars: function alfresco_lists_AlfSortablePaginatedList___updateCoreHashVars(hashParameters) {
         if (hashParameters.currentPage) {
            var cp = parseInt(hashParameters.currentPage, 10);
            if (!isNaN(cp))
            {
               this.currentPage = cp;
            }
         }
         if (hashParameters.currentPageSize) {
            var cps = parseInt(hashParameters.currentPageSize, 10);
            if (!isNaN(cps))
            {
               this.currentPageSize = cps;
            }
         }
         if (hashParameters.sortField) {
            this.sortField = hashParameters.sortField;
         }
         if (hashParameters.sortAscending) {
            this.sortAscending = hashParameters.sortAscending;
         }
      },

      /**
       * @instance
       * @param {object} payload The details of the request
       */
      onSortRequest: function alfresco_lists_AlfSortablePaginatedList__onSortRequest(payload) {
         this.alfLog("log", "Sort requested: ", payload);
         if (payload && payload.direction !== null || payload.value !== null)
         {
            if (payload.direction)
            {
               this.sortAscending = payload.direction === "ascending";
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
                  if (this.sortField !== null)
                  {
                     currHash.sortField = this.sortField;
                  }
                  if (this.sortAscending !== null)
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
         if (payload && payload.value !== null)
         {
            this.sortField = payload.value;
            if (payload.direction)
            {
               this.sortAscending = payload.direction === "ascending";
            }
            if (this._readyToLoad === true)
            {
               if (this.useHash === true)
               {
                  var currHash = ioQuery.queryToObject(hash());
                  if (this.sortField !== null)
                  {
                     currHash.sortField = this.sortField;
                  }
                  if (this.sortAscending !== null)
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
         if (payload && payload.value !== null && payload.value !== this.currentPage)
         {
            this.currentPage = payload.value;
            if (this._readyToLoad === true) 
            {
               if (this.useHash === true)
               {
                  var currHash = ioQuery.queryToObject(hash());
                  if (this.currentPage)
                  {
                     currHash.currentPage = this.currentPage;
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
       * Handles requests to change the number of items shown for each page of data in the list. When the page
       * size is increased or decreased the current page will be adjusted to attempt to keep the items that the
       * user was looking at in the requested page. This is simple when increasing the page size, but harder when
       * decreasing the page size. When decreasing the page size the page requested will represent the beginning
       * of the larger page size of data, e.g. when going from 50 - 25 items per page, if the user was on page 2 
       * (51-100) then page 3 (51-75) would be requested.
       * 
       * @instance
       * @param {object} payload The details of the new page size
       */
      onItemsPerPageChange: function alfresco_lists_AlfSortablePaginatedList__onItemsPerPageChange(payload) {
         if (payload && payload.value !== null && payload.value !== this.currentPageSize)
         {
            // Set the new page size, and log the previous page size for some calculations we'll do in a moment...
            var previousPageSize = this.currentPageSize;
            this.currentPageSize = payload.value;
            // this.alfPublish(this.docsPerpageSelectionTopic, {
            //    value: this.currentPageSize
            // });

            if (this._readyToLoad === true)
            {
               // Need to check that there is enough data available for the current page!!! e.g. if we're on page 3 and requesting page 3 will not return any results
               // Is the total number of records less than the requested docs per page multiplied by 1 less than the current page...
               // var totalRecords = lang.getObject("currentData.totalRecords", false, this);
               if (this.totalRecords !== null)
               {
                  // Figure out which page to show...
                  // e.g. form 25 per page to 100 per page = 25/100 = 0.25
                  // or   100 per page to 25 per page = 100/25 = 4
                  var factor = previousPageSize / this.currentPageSize;
                  if (factor < 1)
                  {
                     // If the factor is less 1 then it's relatively safe to assume that the new page will have 
                     // the item that the user was looking at on the page when we apply the factor to
                     // the current page (since they'll be seeing more items)...
                     this.currentPage = Math.ceil(this.currentPage * factor);
                  }
                  else
                  {
                     // If the factor is greater than 1 then the number of items that the user is going to
                     // see will be reduced and there is a risk that the item they were looking at will be on
                     // a different page. We're going to work to the principle that we will go to the beginning
                     // of the available options... e.g. reducing page size from 75 to 25 will be the equivilent
                     // of 3 pages (at 25 items per page) compared to 1 page (of 75 items) and we will show the
                     // first of those pages.
                     this.currentPage = Math.ceil(this.currentPage * factor);
                     var offset = Math.ceil(factor - 1);
                     this.currentPage = this.currentPage - offset;
                  }

                  var firstRecordOnNewPage = ((this.currentPage - 1) * this.currentPageSize) + 1;
                  while (firstRecordOnNewPage > this.totalRecords)
                  {
                     this.currentPage--;
                     firstRecordOnNewPage = ((this.currentPage - 1) * this.currentPageSize) + 1;
                  }
               }
               else
               {
                  // No need to worry. The current page is fine for the new page size so it can be set safely...
               }
               if (this.useHash === true)
               {
                  var currHash = ioQuery.queryToObject(hash());
                  currHash.currentPage = this.currentPage;
                  currHash.currentPageSize = this.currentPageSize;
                  this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
                     url: ioQuery.objectToQuery(currHash),
                     type: "HASH"
                  }, true);
               }
               else
               {
                  this.loadData();
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
      onScrollNearBottom: function alfresco_lists_AlfSortablePaginatedList__onScrollNearBottom(/*jshint unused:false*/payload) {
         // Process Infinite Scroll, if enabled & if we've not hit the end of the results
         // NOTE: The use of the currentData.totalRecords and currentData.numberFound is only retained to support
         //       AlfSearchList and faceted search in Share - generic infinite scroll should be done via the
         //       totalRecords, startIndex and currentPageSize values...
         if(this.useInfiniteScroll && 
            ((this.totalRecords > (this.startIndex + this.currentPageSize)) ||
            (this.currentData.totalRecords < this.currentData.numberFound)))
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
         this.alfPublish(this.docsPerpageSelectionTopic, {
            label: this.message("list.paginator.perPage.label", {0: this.currentPageSize}),
            value: this.currentPageSize,
            selected: true
         });
      },

      /**
       * Reset the pagination data.
       *
       * This method is useful, e.g., when navigation between different list views.
       *
       */
      resetPaginationData: function alfresco_lists_AlfSortablePaginatedList__resetPaginationData() {
         // This intentionally doesn't trigger an onPageChange event (we don't want to cause a data reload event).
         this.alfLog("info", "Resetting currentPage to 1");
         this.currentPage = 1;
      }
   });
});