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
        "dojo/text!./responseTemplates/FormsRuntime/CreateWorkflowSuccess.json"], 
        function(declare, MockXhr, webScriptDefaults, lang, Authorities, EditDocLibSimpleMetadata, ViewNodeDefault, 
                 CreateWorkflow, CreateWorkflowSuccess) {
   
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
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
