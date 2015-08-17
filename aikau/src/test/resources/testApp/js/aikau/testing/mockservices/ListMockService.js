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
 * @module aikauTesting/mockservices/ListMockService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 * @author Martin Doyle
 */
define([
      "alfresco/core/Core",
      "alfresco/core/CoreXhr",
      "dojo/_base/array",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "dojo/io-query",
      "service/constants/Default"
   ],
   function(AlfCore, CoreXhr, array, declare, lang, ioQuery, AlfConstants) {

      return declare([AlfCore, CoreXhr], {

         /**
          * Constructor
          * 
          * @instance 
          */
         constructor: function alfresco_testing_mockservices_ListMockService__constructor() {
            this.alfSubscribe("ALF_RETRIEVE_DOCUMENTS_REQUEST", lang.hitch(this, this.onRetrieveDocumentsRequest));
         },

         /**
          * Handle document retrieval requests
          * 
          * @instance
          */
         onRetrieveDocumentsRequest: function alfresco_testing_mockservices_ListMockService__onRetrieveDocumentsRequest(payload) {

            // Setup the request parameters object
            var filterKeys = (payload.dataFilters && Object.keys(payload.dataFilters)) || [],
               filters = filterKeys.map(function(filterKey) {
                  var filter = payload.dataFilters[filterKey];
                  return filter.name + "|" + filter.value;
               }).join(),
               pageNum = payload.page || 1,
               pageSize = payload.pageSize || 0,
               startIndex = (pageNum - 1) * pageSize;

            // Setup request params
            var requestParams = {};
            if (startIndex) {
               requestParams.startIndex = startIndex;
            }
            if (pageSize) {
               requestParams.pageSize = pageSize;
            }
            if (filters) {
               requestParams.filters = filters;
            }

            // Make an XHR
            var serviceUrl = AlfConstants.URL_SERVICECONTEXT + "mockdata/list";
            if (Object.keys(requestParams).length) {
               serviceUrl += "?" + ioQuery.objectToQuery(requestParams);
            }
            this.serviceXhr({
               alfTopic: payload.alfResponseTopic,
               url: serviceUrl,
               method: "GET",
               callbackScope: this
            });
         }
      });
   });