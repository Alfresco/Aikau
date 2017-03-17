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
 * 
 * @module aikauTesting/mockservices/PreferenceServiceMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/Preferences/Preferences.json",
        "alfresco/services/PreferenceService"], 
        function(declare, MockXhr, Preferences, PreferenceService) {
   
   return declare([MockXhr], {

      /**
       * Extend the constructor to create a PreferenceService once the Mock Server is setup, this needs to
       * be done like this because the first thing the PreferenceService does is to make an XHR request
       * for user preferences. This means that if the PreferenceService is included as part of the test
       * page model that a 401 redirect will occur because the services are created BEFORE the widgets.
       * 
       * @instance
       * @param  {array} args Constructor arguments
       */
      constructor: function alfresco_testing_mockservices_PreferenceServiceMockXhr__constructor(args) {
         // jshint nonew:false, unused:false
         new PreferenceService();
      },

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_mockservices_PreferenceServiceMockXhr__setupServer() {
         try
         {
            this.server.respondWith("GET",
                                    /(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":7962},
                                     Preferences]);
            this.server.respondWith("POST",
                                    /(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":7962},
                                     Preferences]);

            this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
