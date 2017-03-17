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
 * @module aikauTesting/SitesPaginationMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/SiteListTest/25Sites.json",
        "dojo/text!./responseTemplates/SiteListTest/100Sites.json"], 
        function(declare, MockXhr, _25Sites, _100Sites) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_SitesPaginationMockXhr__setupServer() {
         try
         {
            this.server.respondWith("GET",
                                    /(.*)&maxItems=25(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     _25Sites]);
            this.server.respondWith("GET",
                                    /(.*)&maxItems=100(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     _100Sites]);
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
