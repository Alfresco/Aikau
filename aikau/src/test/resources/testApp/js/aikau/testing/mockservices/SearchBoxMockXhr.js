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
 * @module aikauTesting/testing/mockservices/SearchBoxMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/SearchBox/pdf_docs_search.json",
        "dojo/text!./responseTemplates/SearchBox/pdf_sites_search.json",
        "dojo/text!./responseTemplates/SearchBox/pdf_people_search.json",
        "dojo/text!./responseTemplates/SearchBox/site_docs_search.json",
        "dojo/text!./responseTemplates/SearchBox/site_sites_search.json",
        "dojo/text!./responseTemplates/SearchBox/site_people_search.json",
        "dojo/text!./responseTemplates/SearchBox/site_more_docs_search.json"], 
        function(declare, MockXhr, pdf_docs_search, pdf_sites_search, pdf_people_search,
                 site_docs_search, site_sites_search, site_people_search, site_more_docs_search) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_mockservices_SearchBoxMockXhr__setupServer() {
         try
         {
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/live-search-docs?t=pdf&maxResults=5&startIndex=0",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     pdf_docs_search]);
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/live-search-sites?t=pdf&maxResults=5",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     pdf_sites_search]);
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/live-search-people?t=pdf&maxResults=5",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     pdf_people_search]);
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/live-search-docs?t=site&maxResults=5&startIndex=0",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     site_docs_search]);
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/live-search-sites?t=site&maxResults=5",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     site_sites_search]);
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/live-search-people?t=site&maxResults=5",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     site_people_search]);
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/slingshot/live-search-docs?t=site&maxResults=5&startIndex=5",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     site_more_docs_search]);
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
