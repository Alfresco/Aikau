/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
        "dojo/text!./responseTemplates/DocumentLibrary/rootFolderTemplate.json",
        "dojo/text!./responseTemplates/DocumentLibrary/folder1Template.json",
        "dojo/text!./responseTemplates/DocumentLibrary/folder2Template.json",
        "dojo/text!./responseTemplates/DocumentLibrary/nodeTemplate.json"], 
        function(declare, MockXhr, rootFolderTemplate, folder1Template, folder2Template, nodeTemplate) {
   
   return declare([MockXhr], {

      /**
       * Loads a JPEG image and converts it into an array.
       *
       * @instance
       */
      // loadBinaryData: function alfresco_testing_mockservices_DocumentLibraryMockXhr__loadBinaryData() {
      //    var oReq = new XMLHttpRequest();
      //    oReq.open("GET", "http://localhost:8081/share/res/js/aikauTesting/mockservices/responseTemplates/DocumentLibrary/imgpreview.png", true);
      //    oReq.responseType = "arraybuffer";

      //    var _this = this;
      //    oReq.onload = function (oEvent) {
      //       _this.alfLog("log", "Binary data received");
      //       var arrayBuffer = oReq.response;
      //       if (arrayBuffer) {
      //          _this.imageByteArray = new Uint8Array(arrayBuffer);
      //          _this.waitForServer();
               
      //       }
      //    };
      //    oReq.send(null);
      // },

      /**
       * Sets up the Sinon server to return the JPEG image when it is asked for a specific nodeRef
       *
       * @instance
       */
      // setupServerWithBinaryData: function alfresco_testing_mockservices_DocumentLibraryMockXhr__setupServerWithBinaryData() {

      //    this.alfLog("log", "Setting up server with binary data");
      //    this.server.respondWith("GET", 
      //                            /\/share\/proxy\/alfresco\/api\/node\/workspace\/SpacesStore\/(.*)\/content\/thumbnails\/imgpreview\?(.*)/,
      //                            [200,
      //                            {"Content-Type":"image/jpeg"},
      //                            this.imageByteArray]);
      //    this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
      // },

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_mockservices_DocumentLibraryMockXhr__setupServer() {
         try
         {
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/doclist\/all\/node\/alfresco\/company\/home\?filter=path(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     rootFolderTemplate]);
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/doclist\/all\/node\/alfresco\/company\/home\/Folder1\?filter=path(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     folder1Template]);
            this.server.respondWith("GET",
                                     /\/aikau\/service\/components\/documentlibrary\/data\/doclist\/all\/node\/alfresco\/company\/home\/Folder2\?filter=path(.*)/,
                                     [200,
                                      {"Content-Type":"application/json;charset=UTF-8"},
                                      folder2Template]);
            this.server.respondWith("GET",
                                     /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/(.*)/,
                                     [200,
                                      {"Content-Type":"application/json;charset=UTF-8"},
                                      nodeTemplate]);
            this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
         }

         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
