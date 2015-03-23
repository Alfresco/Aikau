/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 * @module aikauTesting/DocumentLibraryMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikauTesting/MockXhr",
        "dojo/text!./responseTemplates/FullDocLib/documents.json",
        "dojo/text!./responseTemplates/FullDocLib/tree.json"], 
        function(declare, MockXhr, documents, tree) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_mockservices_DocumentLibraryMockXhr__setupServer() {
         try
         {
            // http://localhost:8081/share/service/components/documentlibrary/data/doclist/all/site/site1/documentLibrary/?filter=path&size=50&pos=1&sortAsc=true&sortField=cm%3Aname&view=browse&noCache=1427117389685
            // // /aikau/service/components/documentlibrary/data/doclist/all/site/site1/documentlibrary?filter=path&size=25&pos=1&sortAsc=true&sortField=cm%3Aname&view=browse&noCache=1427118579802
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/doclist\/all\/site\/site1\/documentlibrary\?filter=path(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     documents]);
            this.server.respondWith("GET",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/doclib\/treenode\/site\/site1\/documentlibrary\/\?perms=false(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     tree]);

            // aikau/proxy/alfresco/slingshot/doclib/treenode/site/site1/documentlibrary/?perms=false&children=false&max=-1
            // http://localhost:8081/share/proxy/alfresco/slingshot/doclib/treenode/site/site1/documentLibrary?perms=false&children=true&max=-1
            this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
         }

         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
