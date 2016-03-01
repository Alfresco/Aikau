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
 * This mock XHR server has been written to unit test the [AlfDocument]{@Link module:alfresco/documentlibrary/AlfDocument},
 * [AlfDocumentPreview]{@link module:alfresco/preview/AlfDocumentPreview}
 * 
 * @module sandpit/mockdata/PreviewMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/image.json",
        "dojo/text!./responseTemplates/landscape.json",
        "dojo/text!./responseTemplates/video.json",
        "dojo/text!./responseTemplates/audio.json",
        "dojo/text!./responseTemplates/pdf.json"], 
        function(declare, MockXhr, imageNode, landscapeNode, videoNode, audioNode, pdfNode) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function sandpit_mockdata_PreviewMockXhr__setupServer() {
         try
         {
            // This filter allows the actual PDF file to be downloaded and previewed...
            this.server.xhr.addFilter(function(method, url) {
               return !!url.match(/(.*)\/72df08f7-f13d-4fda-93f9-8e8ce85998c5\/content\/PDF.pdf\?c=force(.*)/);
            });

            this.server.respondWith("GET",
                                    /\/(.*)\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/image\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":7962},
                                     imageNode]);
            this.server.respondWith("GET",
                                    /\/(.*)\/proxy\/alfresco\/slingshot\/doclib2\/node\/workspace\/SpacesStore\/Landscape\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":7962},
                                     landscapeNode]);
            this.server.respondWith("GET",
                                    /\/(.*)\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/video\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":5520127},
                                     videoNode]); 
            this.server.respondWith("GET",
                                    /\/(.*)\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/audio\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":2947517},
                                     audioNode]);
            this.server.respondWith("GET",
                                    /\/(.*)\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/pdf\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     pdfNode]);
            
            this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
