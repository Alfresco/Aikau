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
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/_base/array"],
        function(declare, AlfCore, lang, array) {
   
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
            name: "six",
            description: "woof"
         }
      ],

      /**
       *
       * 
       * @instance 
       * @param {array} args The constructor arguments.
       */
      constructor: function alfresco_testing_mockservices_FilteredListMockService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_RETRIEVE_DOCUMENTS_REQUEST", lang.hitch(this, this.onRetrieveDocumentsRequest));
      },

      /**
       * @instance
       */
      onRetrieveDocumentsRequest: function alfresco_testing_mockservices_FilteredListMockService__onRetrieveDocumentsRequest(payload) {
         var data = lang.clone(this.data);
         if (payload && payload.dataFilters)
         {
            array.forEach(payload.dataFilters, function(filter) {
               if (filter.name)
               {
                  data = array.filter(data, function(item) {
                     var x = lang.getObject(filter.name, false, item);
                     return (x && x.indexOf(filter.value) !== -1);
                  }, this);
               }
            }, this);
         }

         var alfTopic = payload.alfResponseTopic ? (payload.alfResponseTopic + "_SUCCESS") : "ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS";
         this.alfPublish(alfTopic, {
            totalRecords: data.length,
            startIndex: 0,
            items: data
         });
      }
   });
});
