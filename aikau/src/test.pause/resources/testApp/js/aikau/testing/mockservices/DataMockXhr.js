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
 * @module aikauTesting/mockservices/DataMockXhr
 * @author Dave Draper
 * @since 1.0.77
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/_base/lang"],
        function(declare, MockXhr, lang) {

      return declare([MockXhr], {

         data: null,

         /**
          * This sets up the fake server with all the responses it should provide.
          *
          * @instance
          */
         setupServer: function alfresco_testing_mockservices_DataMockXhr__setupServer() {

            if (!this.data)
            {
               this.data = [];
            }

            try {
               this.server.respondWith("POST", /(.*)/, lang.hitch(this, this.onCreate));
               this.server.respondWith("GET", /(.*)/, lang.hitch(this, this.onGet));
               this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
            } catch (e) {
               this.alfLog("error", "The following error occurred setting up the mock server", e);
            }
         },

         /**
          * Returns the configured data.
          * 
          * @instance
          * @param {object} request The request object
          * @since 1.0.77
          */
         onGet: function alfresco_testing_mockservices_DataMockXhr__onGet(request) {
            var response = {
               items: this.data
            };
            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify(response));
         },

         /**
          * Handles the creation of a new item and generates a new NodeRef for that item.
          * 
          * @instance
          * @param {object} request The request object
          * @since 1.0.77
          */
         onCreate: function alfresco_testing_mockservices_DataMockXhr__onCreate(request) {
            var item = JSON.parse(request.requestBody);
            var nodeRef = "workspace://SpacesStore/" + this.generateUuid();
            item.nodeRef = nodeRef;
            
            this.data.push(item);

            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify(item));
         }
      });
   });