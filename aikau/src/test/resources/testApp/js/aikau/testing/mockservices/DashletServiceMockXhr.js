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
 * Provides mock-XHR support for the DashletService for use during testing
 * 
 * @module aikauTesting/mockservices/DashletServiceMockXhr
 * @author Martin Doyle
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr"],
        function(declare, MockXhr) {

   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_mockservices_DocumentLibraryMockXhr__setupServer() {
         try {
            this.server.respondWith("POST",
                                    /\/aikau\/service\/modules\/dashlet\/config\/component\.valid-dashlet/,
                                    [200, { "Content-Type": "application/json; charset=UTF-8" }, ""]);
            this.server.respondWith("POST",
                                    /\/aikau\/service\/modules\/dashlet\/config\/component\.invalid-dashlet/,
                                    [404, { "Content-Type": "application/json; charset=UTF-8" }, ""]);
            this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
         } catch (e) {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});