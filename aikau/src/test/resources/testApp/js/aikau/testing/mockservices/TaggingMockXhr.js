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
 * @module aikauTesting/TaggingMockXhr
 * @author Dave Draper
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
            this.tags = [];
            this.server.respondWith("POST",
                                    "/aikau/proxy/alfresco/api/tag/workspace/SpacesStore",
                                    lang.hitch(this, this.addTag));
            this.server.respondWith("POST",
                                    /\/proxy\/alfresco\/api\/node\/workspace\/(.*)/,
                                    lang.hitch(this, this.updateTags));
            this.server.respondWith("GET",
                                    /\/proxy\/alfresco\/api\/forms\/picker\/category\/workspace\/SpacesStore\/tag:tag-root\/(.*)/,
                                    lang.hitch(this, this.getTags));
            this.server.respondWith("POST",
                                    /.*\/aikau\/proxy\/alfresco\/api\/node\/.*\/formprocessor/,
                                    "{}");
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
         this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
      },

      /**
       * An array of tags managed in memory by this mock XHR handler.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      tags: null,

      /**
       * Simulates adding a new tag.
       *
       * @instance
       */
      addTag: function alfresco_testing_TaggingMockXhr__addTag(request) {
         var tagName = JSON.parse(request.requestBody).name;
         var tag = {
            type: "cm:category",
            parentType: "cm:cmobject",
            isContainer: false,
            name: tagName,
            title:"",
            description: "",
            modified: "2015-08-17T14:04:07.991+01:00",
            modifier: "admin",
            displayPath: "\/categories\/Tags",
            userAccess:
            {
               create: true,
               edit: true,
               "delete": true
            },
            nodeRef: "workspace://SpacesStore/6c230d08-2c31-4596-85b2-ea1626f3f0b2",
            selectable : true
         };
         this.tags.push(tag);

         var response = {
            name: tagName,
            nodeRef: "workspace://SpacesStore/6619a771-5e35-40be-8c08-2f4791d9a056",
            displayPath: "\/categories\/Tags",
            itemExists: false
         };
         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      },

      /**
       * Simulates getting the tags based on a supplied filter
       *
       * @instance
       */
      getTags: function alfresco_testing_TaggingMockXhr__getTags(request, queryString) {
         var filter = queryString.substring(queryString.lastIndexOf("searchTerm=") + 11);

         var filteredTags = array.filter(this.tags, function(tag) {
            return tag.name.indexOf(filter) === 0;
         });

         var response = {
            data: {
               parent: {
                  type: "cm:category",
                  isContainer: false,
                  name: "Tags",
                  title: "",
                  description: "",
                  modified: "2015-06-02T09:42:42.369+01:00",
                  modifier: "System",
                  displayPath: "\/categories",
                  nodeRef: "workspace://SpacesStore/tag:tag-root"
               },
               items: filteredTags
            }
         };

         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      },

      /**
       * Simulates the response when updating the tags on a node
       *
       * @instance
       */
      updateTags: function alfresco_testing_TaggingMockXhr__updateTags(request) {
         var nodeRef = JSON.parse(request.requestBody).prop_cm_taggable;
         var response = {
             persistedObject: nodeRef,
             message: "Successfully persisted form for item [node]" + nodeRef
         };
         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      }
   });
});
