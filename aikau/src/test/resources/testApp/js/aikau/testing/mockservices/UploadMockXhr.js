/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 *
 * @module aikauTesting/SearchMockXhr
 * @author Richard Smith
 */
define(["dojo/_base/declare",
        "aikauTesting/MockXhr",
        "dojo/text!./responseTemplates/SearchTest/XhrSearchResponse.json"], 
        function(declare, MockXhr, xhrSearchResponse) {
   
   return declare([MockXhr], {

      /**
       * The response code to return. Default to 200 but can be overridden to test failures
       *
       * @instance
       * @type {number}
       * @default 200
       */
      responseCode: 200,

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_MockXhr__setupServer() {
         try
         {
            var responseCode = this.responseCode;
            this.server.respondWith(function(request) {
               request.uploadProgress({
                  total: 100,
                  loaded: 20
               });
               request.respond(responseCode, 
                              {"Content-Type":"application/json;charset=UTF-8"},
                              '{"nodeRef":"bob","fileName":"moomin"}');
            });
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
