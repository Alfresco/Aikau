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
        "dojo/text!./responseTemplates/FullDocLib/rawDocuments.json",
        "dojo/text!./responseTemplates/FullDocLib/tree.json",
        "dojo/text!./responseTemplates/FullDocLib/favourites_filter.json"], 
        function(declare, MockXhr, documents, rawDocuments, tree, favourites) {
   
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
                                    /\/aikau\/service\/components\/documentlibrary\/data\/doclist\/all\/site\/site1\/documentlibrary\?filter=path(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     documents]);
            this.server.respondWith("GET",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/doclib2\/doclist\/all\/site\/site1\/documentlibrary\?filter=path(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     rawDocuments]);
            this.server.respondWith("GET",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/doclib\/treenode\/site\/site1\/documentlibrary\/\?perms=false(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     tree]);

            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/doclist\/all\/site\/site1\/documentlibrary\?filter=favourites(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     favourites]);

            // Just return a success message for any delete request. The data won't be updated, but we want to check for
            // the reload request on successful deletion
            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/slingshot/doclib/action/files?alf_method=delete",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"}]);

            this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
         }

         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
