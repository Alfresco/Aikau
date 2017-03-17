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
 * @module aikauTesting/mockservices/ManageAspectsMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/ManageAspects/ConfiguredAspects.json",
        "dojo/text!./responseTemplates/ManageAspects/UpdateSuccess.json"], 
        function(declare, MockXhr, ConfiguredAspects, UpdateSuccess) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_mockservices_ManageAspectsMockXhr__setupServer() {
         try
         {
            // Request for configured aspects
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/doclib/aspects/node/workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":7962},
                                     ConfiguredAspects]);

            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/doclib/aspects/node/fail/to/save",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":7962},
                                     ConfiguredAspects]);

            // Request to successfully update aspects...
            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/slingshot/doclib/action/aspects/node/workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":7962},
                                     UpdateSuccess]);

            // TODO: Add failure to update? Or leave as 404?
            
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
