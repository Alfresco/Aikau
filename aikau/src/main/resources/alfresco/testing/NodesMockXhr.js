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
 * Generic mock XHR that can be configured to support multiple
 * tests' requirements for mock data. This is provided for testing purposes
 * 
 * @module alfresco/testing/NodesMockXhr
 * @author Martin Doyle
 * @since 1.0.50
 */
define(["alfresco/testing/MockXhr",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/io-query",
        "./templates/seedData"],
        function(MockXhr, declare, lang, ioQuery, seedData) {

   return declare([MockXhr], {

      /**
       * <p>How many folders to display in a list, as a percentage of the total number of
       * items. This can be supplied either as a fixed number, or as an array that will
       * correspond to the folder depth (i.e. root level would take the first array
       * item as the ratio). If the current folder depth is greater than the length of
       * the array, then the ratio used will be 0%.</p>
       * 
       * <p>Calculated ratios are always Math.ceil'd, so only a zero will ever
       * provide no folders at all.</p>
       *
       * <p>The number of folders is determined before filters are applied, so filters
       * may alter the ratio of folders to files</p>
       *
       * @instance
       * @type {int|int[]}
       * @default [80, 20]
       */
      folderRatio: [80, 20],

      /**
       * <p>The total number of items in the dataset. The maximum allowed is 1000.</p>
       *
       * @type {number}
       * @default
       */
      totalItems: 15,

      /**
       * <p>Regular expression used to match doclist requests. Currently only works
       * for share clients (i.e. not standalone ones).</p>
       *
       * <p>NOTE: Uses RegExp object rather than a literal to make it easier to
       * read without lots of escaped slashes!</p>
       *
       * @instance
       * @type {RegExp}
       */
      _docListRegex: new RegExp(".+/service/components/documentlibrary/data/doclist/(all|documents|folders)/node((?:/[^/?]+){3})((?:/[^/?]+)*)/?(?:\\?(.*))?"),

      /**
       * <p>Regular expression used to match node requests. Currently only works
       * for share clients (i.e. not standalone ones).</p>
       *
       * <p>NOTE: Uses RegExp object rather than a literal to make it easier to
       * read without lots of escaped slashes!</p>
       *
       * @instance
       * @type {RegExp}
       */
      _nodeRegex: new RegExp(".+/service/components/documentlibrary/data/node/workspace/SpacesStore/((?:-?\\w{4,12}){5}).*"),

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_mockservices_NodesMockXhr__setupServer() {
         try {
            this.server.respondWith(this._docListRegex, lang.hitch(this, this.respondToListRequest));
            this.server.respondWith(this._nodeRegex, lang.hitch(this, this.respondToNodeRequest));
            this.alfPublish("ALF_MOCK_XHR_SERVICE_READY");
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
      respondToListRequest: function alfresco_testing_mockservices_NodesMockXhr__respondToListRequest(request, fileType, root, path, queryString) {
         /*jshint maxcomplexity:false*/

         // Analyse the query and extract separate variables
         var queryObj = ioQuery.queryToObject(queryString || ""),
            filtersParam = queryObj.filters,
            decodedPath = decodeURIComponent(path),
            pathParts = (decodedPath && decodedPath.substr(1).split("/")) || [],
            locationPath = "/" + pathParts.join("/"),
            folderDepth = pathParts.length;

         // Determine how many folders to include
         var folderRatio = (fileType === "documents") ? 0 : (fileType === "folders") ? 100 : this.folderRatio,
            percentFolders = folderRatio.length ? (folderRatio[folderDepth] || 0) : folderRatio,
            numFolders = Math.ceil(percentFolders / 100 * this.totalItems);

         // "Generate" the data
         var seedDataOffset = folderDepth * 50,
            seedItems = seedData.items,
            items = seedItems.slice(seedDataOffset, seedDataOffset + Math.min(this.totalItems, seedItems.length)),
            dataDeficit;
         while ((dataDeficit = this.totalItems - items.length)) {
            items = items.concat(seedItems.slice(0, Math.min(dataDeficit, seedItems.length)));
         }
         items = items.map(function(item) {
            var isFolder = (numFolders-- > 0),
               template = isFolder ? seedData.folderTemplate : seedData.nodeTemplate,
               templateJson = JSON.stringify(template, null, 2),
               itemJson = templateJson.replace(/\{([a-zA-Z0-9.]+)\}/g, function(match, propertyPath) {
                  return lang.getObject(propertyPath, false, item);
               }),
               realItem = JSON.parse(itemJson);
            lang.setObject("location.path", locationPath, realItem);
            return realItem;
         });

         // Apply the filters
         var filters = (!filtersParam && []) || filtersParam.split(",").map(function(filter) {
               var parts = filter.split("|");
               return {
                  name: parts[0],
                  value: parts[1]
               };
            }),
            filteredItems = items.filter(function(item) {
               return filters.every(function(filter) {
                  var itemProperty = lang.getObject(filter.name, false, item),
                     propertyExists = typeof itemProperty !== "undefined",
                     filterMatches = propertyExists && itemProperty === filter.value;
                  if (typeof itemProperty === "string") {
                     filterMatches = itemProperty.indexOf(filter.value) !== -1;
                  }
                  return filterMatches;
               });
            });

         // TODO - Apply sorting (query params for sorting = "sortAsc" and "sortField")

         // Apply pagination
         var pageSize = queryObj.size ? parseInt(queryObj.size, 10) : 0,
            pageNum = queryObj.pos ? parseInt(queryObj.pos, 10) : 1,
            startIndex = (pageNum - 1) * pageSize,
            endIndex = startIndex + pageSize,
            responseData = filteredItems;
         if (endIndex) {
            responseData = responseData.slice(startIndex, Math.min(endIndex, responseData.length));
         }

         // Construct the response
         var response = {
            totalRecords: filteredItems.length,
            startIndex: startIndex,
            items: responseData,
            // TODO: Add metadata from seed data, this is sufficient for current testing requirements 
            metadata: {
               parent: {
                  nodeRef: "parent://node/ref",
                  node: {
                     nodeRef: "parent://node/ref"
                  }
               }
            }
         };

         // Send the response
         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      },

      /**
       * Respond to a request for a specific node
       *
       * @instance
       * @param {Object} request The request object
       * @param {string} nodeGuid The GUID of the node's nodeRef
       */
      respondToNodeRequest: function alfresco_testing_mockservices_NodesMockXhr__respondToNodeRequest(request, nodeGuid) {

         // Get the seed item
         var seedItems = seedData.items.filter(function(item) {
               return item.nodeRef.indexOf(nodeGuid) !== -1;
            }),
            chosenItem;
         if (seedItems.length === 0) {
            throw new Error("No item found with specified GUID (" + nodeGuid + ")");
         } else if (seedItems.length > 1) {
            throw new Error("Found multiple items with specified GUID (" + nodeGuid + ")");
         } else {
            chosenItem = seedItems[0];
         }

         // Populate the data
         var templateJson = JSON.stringify(seedData.nodeTemplate, null, 2),
            itemJson = templateJson.replace(/\{([a-zA-Z0-9.]+)\}/g, function(match, propertyPath) {
               return lang.getObject(propertyPath, false, chosenItem);
            }),
            item = JSON.parse(itemJson);

         // Send the response
         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(item));
      }
   });
});