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
 * @module aikauTesting/CreateContentMockXhr
 * @author Dave Draper
 * @since 1.0.NEXT
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/_base/lang",
        "dojo/text!./responseTemplates/FormsRuntime/EditDocLibSimpleMetadata.json",
        "dojo/text!./responseTemplates/FormsRuntime/ViewNodeDefault.json"], 
        function(declare, MockXhr, lang, EditDocLibSimpleMetadata, ViewNodeDefault) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_CreateContentMockXhr__setupServer() {
         try
         {
            this.server.respondWith("GET",
                                    "/aikau/service/aikau/form?itemKind=node&itemId=some/dummy/node&formId=doclib-simple-metadata&mode=edit",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     EditDocLibSimpleMetadata]);

            this.server.respondWith("GET",
                                    "/aikau/service/aikau/form?itemKind=node&itemId=some/dummy/node&formId=null&mode=view",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     ViewNodeDefault]);
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
