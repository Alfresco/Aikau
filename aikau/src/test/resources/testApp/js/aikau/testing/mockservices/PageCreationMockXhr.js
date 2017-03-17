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
      setupServer: function alfresco_testing_PageCreationMockXhr__setupServer() {
         try
         {
            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/remote-share/page-definition",
                                    lang.hitch(this, this.createPage));
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/remote-share/pages",
                                    lang.hitch(this, this.getPages));
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
      items: {},

      /**
       * Adds a new item
       *
       * @instance
       */
      createPage: function alfresco_testing_PageCreationMockXhr__createPage(request) {
         var item = JSON.parse(request.requestBody);
         var name = item.name;
         this.items[name] = item.json;

         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(this.items));
      },

      /**
       * Returns all the items 
       * NOTE: This is geared up just for returning data in a response that would be suitable
       *       for viewing items in the drag-and-drop palette. The Repo API doesn't support this
       *       so we're going to need to move the JSON restructing into a client side service
       *
       * @instance
       */
      getPages: function alfresco_testing_PageCreationMockXhr__getPages(request) {
         var items = [];
         Object.keys(this.items).forEach(function(key) {
            items.push({
               name: key,
               nodeRef: key,
               content: JSON.stringify(this.items[key])
            });
         }, this);

         var response = {
            items: items
         };

         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      }
   });
});
