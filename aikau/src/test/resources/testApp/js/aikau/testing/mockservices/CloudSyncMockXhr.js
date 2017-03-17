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
 * @module aikauTesting/mockservices/CloudSyncMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/CloudSync/Unauthenticated.json",
        "dojo/text!./responseTemplates/CloudSync/Tenants.json",
        "dojo/text!./responseTemplates/CloudSync/Sites.json",
        "dojo/text!./responseTemplates/CloudSync/Path1.json",
        "dojo/text!./responseTemplates/CloudSync/Path2.json",
        "dojo/text!./responseTemplates/CloudSync/Path3.json",
        "dojo/text!./responseTemplates/CloudSync/Path4.json",
        "dojo/_base/lang"], 
        function(declare, MockXhr, Unauthenticated, Tenants, Sites, Path1, Path2, Path3, Path4, lang) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_mockservices_CloudSyncMockXhr__setupServer() {
         try
         {
            this.server.respondImmediately = true;
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/cloud/person/credentials",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     Unauthenticated]);

            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/cloud/person/credentials",
                                    lang.hitch(this, this.authenticate));

            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/cloud/tenant/information",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     Tenants]);

            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/cloud/people/tony@alfresco.com/sites?network=alfresco.com",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     Sites]);

            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/cloud/doclib/treenode/site/site1/documentLibrary/?children=true&max=-1&network=alfresco.com",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     Path1]);

            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/cloud/doclib/treenode/site/site1/documentLibrary/release pipeline/?children=true&max=-1&network=alfresco.com",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     Path2]);

            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/cloud/doclib/treenode/site/site1/documentLibrary/release pipeline/Release Checklist/?children=true&max=-1&network=alfresco.com",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     Path3]);

            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/cloud/doclib/treenode/site/anothersite/documentLibrary/?children=true&max=-1&network=alfresco.com",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     Path4]);

            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/enterprise/sync/syncsetdefinitions",
                                    lang.hitch(this, this.createSync));
            
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      },

      /**
       * Simulates the initialization of archive generation.
       *
       * @instance
       */
      authenticate: function alfresco_testing_mockservices_CloudSyncMockXhr__authenticate(request) {
         var body = JSON.parse(request.requestBody);

         if (body.username === "bob@alfresco.com")
         {
            request.respond(500, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify({
               loginValid: false,
               username: body.username,
               remoteSystemAvailable: true, 
               message: "Login Invalid"
            }));
         }
         else
         {
            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify({
               loginValid: true,
               username: body.username,
               remoteSystemAvailable: true
            }));
         }
      },

      /**
       * Simulates the creation of a cloud sync - only successful for certain node refs
       *
       * @instance
       */
      createSync: function alfresco_testing_mockservices_CloudSyncMockXhr__authenticate(request) {
         var body = JSON.parse(request.requestBody);

         if (body.targetFolderNodeRef === "workspace://SpacesStore/e3073965-2163-48c7-93db-c63accf68e1b")
         {
            request.respond(500, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify({
               fail: true
            }));
         }
         else
         {
            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify({
               id: "09fd66d1-46a8-450d-a6b7-4b00951743c5",
               nodeRef: "workspace:\/\/SpacesStore\/59271e05-6a9d-409e-9460-70767c414f83",
               sourceCopyLocked: false,
               includeSubFolders: true,
               remoteTenantId: "alfresco.com",
               remoteTargetFolderNodeRef: "workspace:\/\/SpacesStore\/4bd7ec23-754e-4931-ae78-76b9cea578fe",
               isDeleteOnPrem: false,
               isDeleteOnCloud: true
            }));
         }
      }
   });
});
