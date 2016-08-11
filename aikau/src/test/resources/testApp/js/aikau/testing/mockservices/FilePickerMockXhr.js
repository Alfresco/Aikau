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
 * @module aikauTesting/FilePickerMockXhr
 * @author Dave Draper
 * @since 1.0.81
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/_base/lang",
        "dojo/io-query",
        "dojo/text!./responseTemplates/SearchService/alternative.json",
        "dojo/text!./responseTemplates/SearchService/original.json",
        "dojo/text!./responseTemplates/SearchService/default.json",
        "dojo/text!./responseTemplates/SearchTest/XhrSearchResponse.json",
        "dojo/text!./responseTemplates/SearchService/suggestions.json",
        "dojo/text!./responseTemplates/FilePicker/AllSites.json",
        "dojo/text!./responseTemplates/FilePicker/RecentSites.json",
        "dojo/text!./responseTemplates/FilePicker/FavouriteSites.json",
        "dojo/text!./responseTemplates/FilePicker/Documents.json",
        "dojo/text!./responseTemplates/previews/Image.json",
        "dojo/text!./responseTemplates/previews/Video.json"], 
        function(declare, MockXhr, lang, ioQuery, alternative, original, base, xhrSearchResponse, suggestions, 
                 AllSites, RecentSites, FavouriteSites, Documents, Image, Video) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_FilePickerMockXhr__setupServer() {
         try
         {
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/api/sites",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     AllSites]);
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/api/people/guest/sites/recent",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     RecentSites]);
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/api/people/guest/sites/favourites",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     FavouriteSites]);

            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     Documents]);

            this.server.respondWith("GET",
                                    /(.*)proxy\/alfresco\/slingshot\/search(.*)/,
                                    lang.hitch(this, this.onSearch));

            this.server.respondWith("GET",
                                    /(.*)proxy\/alfresco\/slingshot\/auto-suggest(.*)/,
                                    lang.hitch(this, this.onAutoSuggest));

            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":7962},
                                     Image]);
            this.server.respondWith("GET",
                                    /\/aikau\/service\/components\/documentlibrary\/data\/node\/workspace\/SpacesStore\/a4fc4392-27f6-49fd-8b6e-20b953c59ff5\?(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":5520127},
                                     Video]);
            this.alfPublish("ALF_MOCK_XHR_SERVICE_READY");
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      },

      /**
       * @instance
       */
      onSearch: function alfresco_testing_FilePickerMockXhr__onSearch(request) {
         var url = request.url;
         var query = url.substring(url.indexOf("?") + 1);
         var queryObj = ioQuery.queryToObject(query);
         if (queryObj.term === "hame" && queryObj.spellcheck === "false")
         {
            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, original);
         }
         else if (queryObj.term === "hame" && queryObj.spellcheck === "true")
         {
            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, alternative);
         }
         else if (queryObj.term === "" || queryObj.term === "home")
         {
            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, base);
         }
         else
         {
            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, xhrSearchResponse);
         }
      },

      /**
       * Simulates getting the tags based on a supplied filter
       *
       * @instance
       */
      onAutoSuggest: function alfresco_testing_FilePickerMockXhr__onAutoSuggest(request) {
         request.respond(200, {
            "Content-Type": "application/json;charset=UTF-8"
         }, suggestions);
      }
   });
});
