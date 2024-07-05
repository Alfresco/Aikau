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
 * @module aikauTesting/ThumbnailsMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/Thumbnails/doclib.json",
        "dojo/text!./responseTemplates/Thumbnails/search.json",
        "dojo/text!./responseTemplates/Thumbnails/tasks.json",
        "dojo/text!./responseTemplates/Thumbnails/nodeData.json",
        "dojo/text!./responseTemplates/previews/PDF.json"], 
        function(declare, MockXhr, doclib, search, tasks, nodeData, pdfNodeData) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_mockservices_DocumentLibraryMockXhr__setupServer() {
         try
         {
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/site\/swsdp\/doclist\/all\/site\/swsdp\/documentlibrary\?filter=path(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     doclib]);
            this.server.respondWith("GET",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/search(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     search]);
            this.server.respondWith("GET",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/tasks(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     tasks]);
            // proxy/alfresco/slingshot/doclib2/node/workspace/SpacesStore/7bb7bfa8-997e-4c55-8bd9-2e5029653bc8
            this.server.respondWith("GET",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/doclib2\/node\/workspace\/SpacesStore\/7bb7bfa8-997e-4c55-8bd9-2e5029653bc8(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     nodeData]);
            this.server.respondWith("GET",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/doclib2\/node\/workspace\/SpacesStore\/26ae500c-91a9-496f-aca6-14101f985c28(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     pdfNodeData]);
            this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
         }

         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
