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
 * Sets up a mock server for List testing
 * 
 * @module aikauTesting/mockservices/ListMockXhr
 * @author Martin Doyle
 */
define([
      "alfresco/testing/MockXhr",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "dojo/io-query"
   ],
   function(MockXhr, declare, lang, ioQuery) {

      return declare([MockXhr], {

         /**
          * Setup the data
          *
          * @instance
          * @type {Object}
          */
         data: [{
            name: "one",
            description: "moo"
         }, {
            name: "two",
            description: "moo"
         }, {
            name: "three",
            description: "moo"
         }, {
            name: "four",
            description: "moo"
         }, {
            name: "five",
            description: "woof"
         }, {
            name: "five and a half",
            description: "woof"
         }, {
            name: "six",
            description: "woof"
         }, {
            name: "six and a half",
            description: "woof"
         }],

         /**
          * This sets up the fake server with all the responses it should provide.
          *
          * @instance
          */
         setupServer: function alfresco_testing_mockservices_ListMockXhr__setupServer() {
            try {
               this.server.respondWith(/.+\/list(?:\??(.+))?/, lang.hitch(this, this.respond));
               this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
            } catch (e) {
               this.alfLog("error", "The following error occurred setting up the mock server", e);
            }
         },

         /**
          * Respond to the supplied request
          *
          * @instance
          * @param {Object} request The request object
          * @param {string} queryString The query string from the request URL
          */
         respond: function alfresco_testing_mockservices_ListMockXhr__respond(request, queryString) {

            // Analyse the query
            var queryObj = ioQuery.queryToObject(queryString || ""),
               filtersParam = queryObj.filters || "",
               filters = filtersParam.split(",").map(function(filter) {
                  var parts = filter.split("|");
                  return {
                     name: parts[0],
                     value: parts[1]
                  };
               });

            // Apply the filters
            var filteredData = this.data.filter(function(item) {
               return Object.keys(item).every(function(propName) {
                  var propValue = item[propName];
                  return filters.every(function(filter) {
                     return filter.name !== propName || propValue.indexOf(filter.value) !== -1;
                  });
               });
            });

            // Apply pagination
            var pageSize = queryObj.pageSize ? parseInt(queryObj.pageSize, 10) : 0,
               startIndex = queryObj.startIndex ? parseInt(queryObj.startIndex, 10) : 0,
               endIndex = startIndex + pageSize,
               responseData = filteredData.slice();
            if (endIndex) {
               responseData = responseData.slice(startIndex, Math.min(endIndex, responseData.length));
            }

            // Construct the response
            var response = {
               totalRecords: filteredData.length,
               startIndex: startIndex,
               items: responseData
            };

            // Send the response
            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify(response));
         }
      });
   });