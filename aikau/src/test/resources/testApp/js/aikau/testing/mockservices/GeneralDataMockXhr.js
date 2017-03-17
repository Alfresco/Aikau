/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/io-query",
        "alfresco/testing/MockXhr",
        "alfresco/core/Core"],
        function(declare, lang, array, ioQuery, MockXhr, Core) {

   return declare([MockXhr, Core], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_GeneralDataMockXhr__setupServer() {
         try
         {
            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/add",
                                    lang.hitch(this, this.addItem));
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/get",
                                    lang.hitch(this, this.getItems));
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
         this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
      },

      /**
       * The items
       *
       * @instance
       * @type {object[]}
       */
      items: [],

      /**
       * Adds a new item
       *
       * @instance
       */
      addItem: function alfresco_testing_GeneralDataMockXhr__addItem(request) {
         var item = JSON.parse(request.requestBody);
         item.id = this.generateUuid();
         this.items.push(item);

         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(this.items));
      },

      /**
       * Returns all the items
       *
       * @instance
       */
      getItems: function alfresco_testing_GeneralDataMockXhr__getItems(request) {
         var response = {
            items: this.items
         };

         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      }
   });
});
