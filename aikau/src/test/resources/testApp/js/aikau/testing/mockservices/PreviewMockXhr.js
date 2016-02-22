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
 * [AlfDocumentPreview]{@link module:alfresco/preview/AlfDocumentPreview} and the [Image Plugin]
 * {@link module:alfresco/preview/Image}.
 * 
 * @module aikauTesting/mockservices/PreviewMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/previews/Image.json",
        "dojo/text!./responseTemplates/previews/Video.json",
        "dojo/text!./responseTemplates/previews/Video_h264.json",
        "dojo/text!./responseTemplates/previews/Video_ogg.json",
        "dojo/text!./responseTemplates/previews/Audio.json"], 
        function(declare, MockXhr, imageNode, videoNode, videoH264Node, videoOggNode, audioNode) {
   
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
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":7962},
                                     imageNode]);
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/a4fc4392-27f6-49fd-8b6e-20b953c59ff5\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":5520127},
                                     videoNode]); 
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/8a93f2cc-5276-45b6-929a-f5112e7a645d\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":5520127},
                                     videoH264Node]); 
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/b5973042-9f07-472f-980d-940eb117524b\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":5520127},
                                     videoOggNode]); 
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/50e8fa78-86ee-4209-9de0-b5c996b7ee52\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":2947517},
                                     audioNode]); 
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
