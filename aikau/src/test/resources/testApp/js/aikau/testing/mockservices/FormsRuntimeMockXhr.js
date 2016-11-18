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
 * @since 1.0.76
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "webscripts/defaults",
        "dojo/_base/lang",
        "dojo/text!./responseTemplates/FormsRuntime/Authorities.json",
        "dojo/text!./responseTemplates/FormsRuntime/EditDocLibSimpleMetadata.json",
        "dojo/text!./responseTemplates/FormsRuntime/ViewNodeDefault.json",
        "dojo/text!./responseTemplates/FormsRuntime/CreateWorkflow.json",
        "dojo/text!./responseTemplates/FormsRuntime/CreateWorkflowSuccess.json",
        "dojo/text!./responseTemplates/FormsRuntime/EditTask.json",
        "dojo/text!./responseTemplates/FormsRuntime/EditDataListItem.json",
        "dojo/text!./responseTemplates/previews/PDF.json"], 
        function(declare, MockXhr, webScriptDefaults, lang, Authorities, EditDocLibSimpleMetadata, ViewNodeDefault, 
                 CreateWorkflow, CreateWorkflowSuccess, EditTask, EditDataListItem, pdfNodeData) {
   
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
                                    "/aikau/proxy/alfresco/api/forms/picker/authority/children?searchTerm=&selectableType=cm:person&size=1000",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     Authorities]);

            this.server.respondWith("GET",
                                    "/aikau/service/aikau/" + webScriptDefaults.WEBSCRIPT_VERSION + "/form?itemKind=node&itemId=some://dummy/node&formId=doclib-simple-metadata&mode=edit",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     EditDocLibSimpleMetadata]);

            this.server.respondWith("GET",
                                    "/aikau/service/aikau/" + webScriptDefaults.WEBSCRIPT_VERSION + "/form?itemKind=node&itemId=some://dummy/node&formId=null&mode=view",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     ViewNodeDefault]);

            this.server.respondWith("GET",
                                    "/aikau/service/aikau/" + webScriptDefaults.WEBSCRIPT_VERSION + "/form?itemKind=workflow&itemId=activiti%24activitiAdhoc&formId=null&mode=create",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     CreateWorkflow]);

            this.server.respondWith("POST",
                                    "/share/proxy/alfresco/api/workflow/activiti%24activitiAdhoc/formprocessor",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     CreateWorkflowSuccess]);

            this.server.respondWith("GET",
                                    "/aikau/service/aikau/" + webScriptDefaults.WEBSCRIPT_VERSION + "/form?itemKind=task&itemId=activiti$79&formId=null&mode=edit",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     EditTask]);

            this.server.respondWith("GET",
                                    "/aikau/service/aikau/" + webScriptDefaults.WEBSCRIPT_VERSION + "/form?itemKind=node&itemId=workspace://SpacesStore/7778cf88-836f-4833-a0df-3056d2b20e7a&formId=null&mode=edit",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     EditDataListItem]);

            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/1a0b110f-1e09-4ca2-b367-fe25e4964a4e(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     pdfNodeData]);
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
