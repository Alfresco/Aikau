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
 * @module aikauTesting/mockservices/DataListMockXhr
 * @author Dave Draper
 * @s
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/DataLists/DataLists.json",
        "dojo/text!./responseTemplates/DataLists/ToDoList.json",
        "dojo/text!./responseTemplates/DataLists/ToDoListData.json",
        "dojo/text!./responseTemplates/DataLists/ToDoListNewForm.json"], 
        function(declare, MockXhr, DataLists, ToDoList, ToDoListData, ToDoListNewForm) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_mockservices_ComboBoxMockXhr__setupServer() {
         try
         {
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/datalists/lists/site/site1/dataLists",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     DataLists]);

            this.server.respondWith("GET",
                                    "/aikau/service/components/data-lists/config/columns?itemType=dl:todoList",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     ToDoList]);

            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/slingshot/datalists/data/node/workspace/SpacesStore/fc50d8a0-1bac-430e-b13d-3ac271c6578e",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     ToDoListData]);

            this.server.respondWith("GET",
                                    "/aikau/service/aikau/1_0_86_SNAPSHOT/form?itemKind=type&itemId=dl:todoList&formId=null&mode=create",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     ToDoListNewForm]);

            this.server.respondWith("DELETE", /\/aikau\/proxy\/alfresco\/(.*)/, [200, {}, ""]);
            this.server.respondWith("POST", /\/aikau\/proxy\/alfresco\/api\/node\/workspace\/SpacesStore\/(.*)/, [200, {}, ""]);
            this.server.respondWith("POST", "/share/proxy/alfresco/api/type/dl%3AtodoList/formprocessor", [200, {}, ""]);

         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
