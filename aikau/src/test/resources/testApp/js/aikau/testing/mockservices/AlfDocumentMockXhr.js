/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
        "aikauTesting/MockXhr",
        "dojo/text!./responseTemplates/Document/DocumentAsObject.json"], 
        function(declare, MockXhr, DocumentAsObject) {
   
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
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/some\/dummy\/node\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":7962},
                                     DocumentAsObject]);
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
