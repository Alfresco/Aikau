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
 * @module aikauTesting/ChangeTypeMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/io-query",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/previews/PDF.json"], 
        function(declare, lang, array, ioQuery, MockXhr, PdfNode) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_ChangeTypeMockXhr__setupServer() {
         try
         {
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/f8394454-0651-48a5-b583-d067c7d03339(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     PdfNode]);
            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/slingshot/doclib/type/node/workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e",
                                    lang.hitch(this, this.onChangeType));
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
         this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
      },

      /**
       * Simulates changing a type
       *
       * @instance
       */
      onChangeType: function alfresco_testing_TaggingMockXhr__onChangeType(request) {
         var type = JSON.parse(request.requestBody).type;
         request.respond(type === "cm:sub-content" ? 200 : 500, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify({}));
      }
   });
});
