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
 * @module aikauTesting/ViewBuilderMockXhr
 * @author Dave Draper
 * @since 1.0.102
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/io-query",
        "alfresco/testing/MockXhr"], 
        function(declare, lang, array, ioQuery, MockXhr) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_TaggingMockXhr__setupServer() {
         try
         {
            this.views = [];
            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/aikau/view",
                                    lang.hitch(this, this.addView));
            this.server.respondWith("DELETE",
                                    /\/proxy\/alfresco\/aikau\/view\/(.*)/,
                                    lang.hitch(this, this.deleteView));
            this.server.respondWith("GET",
                                    /\/proxy\/alfresco\/aikau\/view\/(.*)/,
                                    lang.hitch(this, this.getView));
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/aikau/views",
                                    lang.hitch(this, this.getAllViews));
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
         this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
      },

      /**
       * An array of views managed in memory by this mock XHR handler.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      views: null,

      /**
       *
       *
       * @instance
       */
      addView: function alfresco_testing_ViewBuilderMockXhr__addView(request) {
         var viewName = JSON.parse(request.requestBody).name;
         var model = JSON.parse(request.requestBody).model;
         var nodeRef = "workspace://SpacesStore/" + this.generateUuid();
         var view = {
            name: viewName,
            model: model,
            nodeRef: nodeRef
         };
         this.views.push(view);

         var response = {
            name: viewName,
            nodeRef: nodeRef
         };
         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      },

      /**
       * 
       *
       * @instance
       */
      deleteView: function alfresco_testing_ViewBuilderMockXhr__deleteView(request, queryString) {
         // var filter = queryString.substring(queryString.lastIndexOf("searchTerm=") + 11);

         // var filteredTags = array.filter(this.tags, function(tag) {
         //    return tag.name.indexOf(filter) === 0;
         // });

         // var response = {
         //    data: {
         //       parent: {
         //          type: "cm:category",
         //          isContainer: false,
         //          name: "Tags",
         //          title: "",
         //          description: "",
         //          modified: "2015-06-02T09:42:42.369+01:00",
         //          modifier: "System",
         //          displayPath: "\/categories",
         //          nodeRef: "workspace://SpacesStore/tag:tag-root"
         //       },
         //       items: filteredTags
         //    }
         // };

         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      },

      /**
       * 
       *
       * @instance
       */
      getView: function getView(request) {
         var response = {
            items: this.views
         };
         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      },

      /**
       * 
       *
       * @instance
       */
      getAllViews: function getAllViews(request) {
         var response = {
            items: this.views
         };
         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      }
   });
});
