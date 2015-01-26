/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * @module aikauTesting/HeaderMockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikauTesting/MockXhr",
        "dojo/text!./responseTemplates/HeaderTest/SitesRequest_NonSite.json",
        "dojo/text!./responseTemplates/HeaderTest/SitesRequest_FavouriteSite.json",
        "dojo/text!./responseTemplates/HeaderTest/SitesRequest_NonFavouriteSite.json",
        "dojo/text!./responseTemplates/HeaderTest/Favourites.json",
        "dojo/text!./responseTemplates/HeaderTest/SiteDetails.json"], 
        function(declare, MockXhr, sitesTemplate, favouriteSiteTemplate, nonFavouriteSiteTemplate, favouritesTemplate, siteDetailsTemplate) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_MockXhr__setupServer() {
         try
         {
            var siteTemplateToUse;
            if (this.location === "NON_SITE")
            {
               siteTemplateToUse = sitesTemplate;
            }
            else if (this.location === "FAVOURITE_SITE")
            {
               siteTemplateToUse = favouriteSiteTemplate;
            }
            else
            {
               siteTemplateToUse = nonFavouriteSiteTemplate;
            }

            this.server.respondWith("GET",
                                    /\/aikau\/service\/header\/sites-menu\/recent(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     siteTemplateToUse]);
            this.server.respondWith("GET",
                                    "/aikau/service/header/sites-menu/favourites",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     favouritesTemplate]);
            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/api/sites/site1",
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8"},
                                     siteDetailsTemplate]);
         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
