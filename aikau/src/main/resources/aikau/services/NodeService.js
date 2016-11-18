/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * <p><b>This service is in the "aikau" package and does not adhere to the backwards compatibility standards
 * of the "alfresco" package. The code in this package is intended to form the basis of the next major release
 * of Aikau and will remain in an unstable state until ready for release. Please evaluate and feedback on this
 * module but do not rely on it in production!</b></p>
 *
 * @module aikau/services/NodeService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/topics",
        "service/constants/Default",
        "dojo/_base/lang"], 
        function(declare, BaseService, CoreXhr, topics, AlfConstants, lang) {
   
   return declare([BaseService, CoreXhr], {

      /**
       *
       * @instance
       */
      registerSubscriptions: function aikau_services_NodeService__registerSubscriptions() {
         this.alfSubscribe(topics.GET_DOCUMENT_LIST, lang.hitch(this, this.onRetrieveDocumentsRequest));
      },

      /**
       *
       * @instance
       */
      onRetrieveDocumentsRequest: function aikau_services_NodeService__onRetrieveDocumentsRequest(payload) {
         var url =  AlfConstants.URL_CONTEXT + 
                    "proxy/alfresco-api/-default-/public/alfresco/versions/1/nodes/-root-/children?include=path";
         
         var relativePath = payload.relativePath || "";
         url += "&relativePath=" + relativePath;

         if (payload.page && payload.pageSize)
         {
            var skipCount = --payload.page * payload.pageSize;
            url += "&skipCount=" + skipCount;
            url += "&maxItems=" + payload.pageSize;
         }

         if (payload.sortField)
         {
            url += "&orderBy=" + payload.sortField + " " + (payload.sortAscending ? "ASC" : "DESC");
         }

         var config = {
            alfSuccessTopic: payload.alfSuccessTopic,
            alfFailureTopic: payload.alfFailureTopic,
            url: url,
            method: "GET",
            callbackScope: this
         };
         this.serviceXhr(config);
      }
   });
});