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
 * This mock XHR server has been written to unit test the [PathTree]{@Link module:alfresco/navigation/PathTree} widget.
 * 
 * @module aikauTesting/mockservices/PathTreeMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/PathTree/Site.json",
        "dojo/text!./responseTemplates/PathTree/DocumentLibrary.json",
        "dojo/text!./responseTemplates/PathTree/BudgetFiles.json"], 
        function(declare, MockXhr, Site, DocumentLibrary, BudgetFiles) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_mockservices_PreviewMockXhr__setupServer() {
         try
         {
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/doclib/treenode/node/alfresco/company/home/?perms=false&children=false&max=500&libraryRoot=workspace%3A%2F%2FSpacesStore%2Fb4cff62a-664d-4d45-9302-98723eac1319",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":2565},
                                     Site]);
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/doclib/treenode/node/alfresco/company/home/documentLibrary/?perms=false&children=false&max=500&libraryRoot=workspace%3A%2F%2FSpacesStore%2Fb4cff62a-664d-4d45-9302-98723eac1319",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":2565},
                                     DocumentLibrary]);
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/doclib/treenode/node/alfresco/company/home/documentLibrary/Budget Files/?perms=false&children=false&max=500&libraryRoot=workspace%3A%2F%2FSpacesStore%2Fb4cff62a-664d-4d45-9302-98723eac1319",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":829},
                                     BudgetFiles]); 
            this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
            
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
