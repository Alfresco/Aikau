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
 * @module aikauTesting/mockservices/PaginationService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang"],
         function(declare, AlfCore, lang) {

   return declare([AlfCore], {

      loadDataSubscriptionTopic: null,

      /**
       *
       *
       * @instance
       * @param {array} args The constructor arguments.
       */
      constructor: function alfresco_testing_mockservices_PaginationService__constructor(args) {
         lang.mixin(this, args);
         if (this.loadDataSubscriptionTopic)
         {
            this.alfSubscribe(this.loadDataSubscriptionTopic, lang.hitch(this, this.onLoadDataRequest));
         }
      },

      onLoadDataRequest: function alfresco_testing_mockservices_PaginationService__onLoadDataRequest(payload) {
         var totalRecords = 243;
         var pageSize = payload.pageSize !== null ? payload.pageSize: 25;
         var page = payload.page !== null ? payload.page: 1;
         var items = [];
         var startIndex = (page - 1) * pageSize;
         var stopIndex = startIndex + pageSize;
         stopIndex = stopIndex > totalRecords ? totalRecords : stopIndex;
         for (var i=startIndex; i<stopIndex; i++)
         {
            items.push({
               index: i+1
            });
         }
         var responsePayload = {
            response: {
               totalRecords: totalRecords,
               startIndex: startIndex,
               items: items
            }
         };

         var alfTopic = payload.alfResponseTopic ? payload.alfResponseTopic : "ALF_RETRIEVE_DOCUMENTS_REQUEST";
         this.alfPublish(alfTopic + "_SUCCESS", responsePayload);
      }
   });
});
