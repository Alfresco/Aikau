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
 * Provides XHR responses for the Search List
 * 
 * @module aikauTesting/mockservices/PaginatedSearchListMockXhr
 * @author Martin Doyle
 */
define(["dojo/_base/declare",
      "dojo/json",
      "alfresco/testing/MockXhr",
      "dojo/text!./responseTemplates/PaginatedSearchList/results.json"
   ],
   function(declare, JSON, MockXhr, itemsJson) {

      return declare([MockXhr], {

         /**
          * This sets up the fake server with all the responses it should provide
          *
          * @instance
          */
         setupServer: function alfresco_testing_PaginatedSearchListMockXhr__setupServer() {
            try {
               this.server.respondWith("GET", /.*startIndex=(\d+).*pageSize=(\d+).*/, this.createResponse);
            } catch (e) {
               this.alfLog("error", "The following error occurred setting up the mock server", e);
            }
         },

         /**
          * Create the response
          *
          * @instance
          * @param {Object} request The intial request object
          * @param {int} startIndex Start index
          * @param {int} pageSize Page size
          * @returns {String} The JSON response
          */
         createResponse: function alfresco_testing_PaginatedSearchListMockXhr__createResponse(request, startIndex, pageSize) {
            var items = JSON.parse(itemsJson),
               startNum = parseInt(startIndex, 10),
               pageSizeNum = parseInt(pageSize, 10),
               slicedItems = items.slice(startNum, startNum + pageSizeNum),
               responseObject = {
                  totalRecords: slicedItems.length,
                  totalRecordsUpper: items.length,
                  startIndex: startIndex,
                  numberFound: items.length,
                  items: slicedItems
               };

            request.respond(200, {
               "Content-Type": "application/json"
            }, JSON.stringify(responseObject));
         }
      });
   });