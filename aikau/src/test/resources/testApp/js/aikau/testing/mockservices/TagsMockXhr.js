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
 * tests' requirements for mock data.
 * 
 * @module aikauTesting/mockservices/TagsMockXhr
 * @author Martin Doyle
 */
define([
      "alfresco/testing/MockXhr",
      "dojo/_base/declare",
      "dojo/_base/lang"
   ],
   function(MockXhr, declare, lang) {

      return declare([MockXhr], {

         /**
          * Mock data to return to a tags request
          *
          * @instance
          * @type {Object[]}
          */
         _mockTags: [{
            "name": "Somewhere over",
            "count": 27
         }, {
            "name": "the rainbow",
            "count": 14
         }, {
            "name": "skies are blue",
            "count": 9
         }, {
            "name": "and the",
            "count": 5
         }, {
            "name": "dreams",
            "count": 2
         }, {
            "name": "that you dare",
            "count": 2
         }, {
            "name": "to dream",
            "count": 1
         }, {
            "name": "really do",
            "count": 1
         }, {
            "name": "come true",
            "count": 1
         }],

         /**
          * Set up the fake server
          *
          * @instance
          */
         setupServer: function aikauTesting_mockservices_TagsMockXhr__setupServer() {
            try {
               this.server.respondWith(
                  /.*\/aikau\/proxy\/alfresco\/api\/tagscopes\/site\/eng\/documentLibrary\/tags.*/,
                  lang.hitch(this, this.respondToTagsRequest)
               );
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
          */
         respondToTagsRequest: function aikauTesting_mockservices_TagsMockXhr__respondToTagsRequest(request) {

            // Setup response
            var responseData = {
                  tags: this._mockTags
               },
               jsonResponse = JSON.stringify(responseData);

            // Send it
            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, jsonResponse);
         }
      });
   });