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
 * @module aikauTesting/SmartDownloadMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikauTesting/mockservices/DownloadArchiveMockXhr",
        "dojo/text!./responseTemplates/previews/PDF.json"], 
        function(declare, DownloadArchiveMockXhr, PdfNode) {
   
   return declare([DownloadArchiveMockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_DownloadArchiveMockXhr__setupServer() {
         try
         {
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/f8394454-0651-48a5-b583-d067c7d03339(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     PdfNode]);
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
         this.inherited(arguments);
      }
   });
});
