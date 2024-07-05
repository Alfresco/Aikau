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
 *
 * @module aikauTesting/CreateContentMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/_base/lang",
        "dojo/text!./responseTemplates/CreateContentTest/node_templates.json",
        "dojo/text!./responseTemplates/CreateContentTest/space_templates.json",
        "dojo/text!./responseTemplates/previews/PDF.json"], 
        function(declare, MockXhr, lang, nodeTemplates, spaceTemplates, PdfNode) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_CreateContentMockXhr__setupServer() {
         try
         {
            // /aikau/proxy/alfresco/slingshot/doclib2/node/workspace/SpacesStore/f8394454-0651-48a5-b583-d067c7d03339?view=browse&noCache=1429867834390&includeThumbnails=true
            this.server.respondWith("GET",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/doclib2\/node\/workspace\/SpacesStore\/f8394454-0651-48a5-b583-d067c7d03339(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     PdfNode]);

            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/slingshot/doclib/action/files?alf_method=delete",
                                    [200,
                                    {"Content-Type":"application/json;charset=UTF-8"},
                                     ""]);
            this.server.respondWith("GET",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/doclib\/node-templates/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     nodeTemplates]);
            this.server.respondWith("GET",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/doclib\/folder-templates/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     spaceTemplates]);
            this.server.respondWith("POST",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/doclib\/node-templates/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     "{\"name\":\"FAKE_NODE_NAME\",\"success\":true}"]);
            this.server.respondWith("POST",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/doclib\/folder-templates/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     "{\"name\":\"FAKE_FOLDER_NAME\",\"success\":true}"]);
            this.server.respondWith("POST",
                                    /\/aikau\/proxy\/alfresco\/api\/type\/cm:folder\/formprocessor/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     "{\"success\":true}"]);

            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/api/type/cm:content/formprocessor",
                                    lang.hitch(this, this.createContent));
            
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      },

      /**
       * Simulates creating content
       *
       * @instance
       * @since 1.0.64
       */
      createContent: function alfresco_testing_CreateContentMockXhr__createContent(request) {
         var response;
         var prop_cm_name = JSON.parse(request.requestBody).prop_cm_name;
         if (prop_cm_name !== "fail")
         {
            response = {
                "persistedObject": "workspace://SpacesStore/50fe4cea-508b-4f6d-88d4-734ff0abda44",
                "message": "Successfully persisted form for item [type]cm:content"
            };
            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify(response));
         }
         else
         {
            response = {
               status: {
                  code: 500,
                  name: "Internal Error",
                  description: "An error inside the HTTP server which prevented it from fulfilling the request."
               },
               message: "org.alfresco.service.cmr.repository.DuplicateChildNodeNameException: Duplicate child name not allowed: test",  
               exception: "",
               callstack: [],
               server: "Enterprise v5.0.3 (r123456-b0) schema 8,040",
               time: "14-Apr-2016 13:34:43"
            };
            request.respond(500, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify(response));
         }
      }
   });
});
