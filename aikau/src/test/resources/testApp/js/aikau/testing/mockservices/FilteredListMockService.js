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
 * @module aikauTesting/mockservices/FilteredListMockService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["alfresco/core/Core", 
        "dojo/_base/array", 
        "dojo/_base/declare", 
        "dojo/_base/lang"], 
        function(AlfCore, array, declare, lang) {

   return declare([AlfCore], {

      data: [
         {
            name: "one",
            description: "moo"
         },
         {
            name: "two",
            description: "moo"
         },
         {
            name: "three",
            description: "moo"
         },
         {
            name: "four",
            description: "moo"
         },
         {
            name: "five",
            description: "woof"
         },
         {
            name: "five and a half",
            description: "woof"
         },
         {
            name: "six",
            description: "woof"
         },
         {
            name: "six and a half",
            description: "woof"
         }
      ],

      /**
       * Constructor
       * 
       * @instance 
       */
      constructor: function alfresco_testing_mockservices_FilteredListMockService__constructor() {
         this.alfSubscribe("ALF_RETRIEVE_DOCUMENTS_REQUEST", lang.hitch(this, this.onRetrieveDocumentsRequest));
      },

      /**
       * Handle document retrieval requests
       * 
       * @instance
       */
      onRetrieveDocumentsRequest: function alfresco_testing_mockservices_FilteredListMockService__onRetrieveDocumentsRequest(payload) {

         // Setup variables
         var data = this.data,
            hasFilters = payload.dataFilters && payload.dataFilters.length,
            pageNum = payload.page || 1,
            pageSize = payload.pageSize || 0,
            startIndex = (pageNum - 1) * pageSize,
            endIndex = startIndex + pageSize,
            totalRecords,
            responseTopic;

         // Apply filters
         hasFilters && array.forEach(payload.dataFilters, function(filter) {
            if (filter.name) {
               data = array.filter(data, function(item) {
                  var itemName = lang.getObject(filter.name, false, item);
                  return (itemName && itemName.indexOf(filter.value) !== -1);
               }, this);
            }
         }, this);
         totalRecords = data.length;

         // Apply pagination
         if (endIndex) {
            data = data.slice(startIndex, Math.min(endIndex, data.length));
         }

         // Create and publish response
         this.alfPublish(payload.alfResponseTopic + "_SUCCESS", {
            response: {
               totalRecords: totalRecords,
               startIndex: startIndex,
               items: data
            }
         });
      }
   });
});