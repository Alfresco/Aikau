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
 * @module aikauTesting/mockservices/PdfJsMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/previews/PDF.json",
        "dojo/text!./responseTemplates/previews/PDF_with_outline.json",
        "dojo/text!./responseTemplates/previews/PDF_password.json",
        "dojo/text!./responseTemplates/previews/PDF_missing.json",
        "dojo/text!./responseTemplates/previews/PDF_faulty.json"], 
        function(declare, MockXhr, PdfNode, PdfWithOutlineNode, PdfPasswordNode, PdfMissing, PdfFaulty) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_mockservices_PreviewMockXhr__setupServer() {
         try
         {

            // PDF
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/f8394454-0651-48a5-b583-d067c7d03339(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     PdfNode]);

            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/site\/normalResult\/node\/workspace\/SpacesStore\/f8394454-0651-48a5-b583-d067c7d03339(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     PdfNode]);

            // PDF with outline
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/4ac29928-4ce3-4526-a5ca-3be256220663(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     PdfWithOutlineNode]);

            // PDF with password
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/3ca89be9-b08e-4de4-aab7-5e421924472e(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     PdfPasswordNode]);

            // Missing node
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/3da05fa7-c9c2-44f5-b5a1-820ae2774760(.*)/,
                                    [404, {}, ""]);

            // Missing PDF
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/c5d115de-d5c5-446a-b4a3-f3dae1705876(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     PdfMissing]);

            // Faulty PDF
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/6f4c9f59-7804-475e-b9d0-72387b40eaa6(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     PdfFaulty]);

         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
