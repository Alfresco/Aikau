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
 * @module aikauTesting/SiteMockXhr
 * @author Richard Smith
 */
define(["dojo/_base/declare",
        "aikauTesting/MockXhr",
        "dojo/text!./responseTemplates/SiteTest/GetSites.json",
        "dojo/text!./responseTemplates/SiteTest/GetAdminSites.json",
        "dojo/text!./responseTemplates/SiteTest/GetSite.json",
        "dojo/text!./responseTemplates/SiteTest/PutSite.json",
        "dojo/text!./responseTemplates/SiteTest/DeleteSite.json",
        "dojo/text!./responseTemplates/SiteTest/PostSiteAsFavourite.json",
        "dojo/text!./responseTemplates/SiteTest/DeleteSiteAsFavourite.json",
        "dojo/text!./responseTemplates/SiteTest/GetSiteMemberships.json",
        "dojo/text!./responseTemplates/SiteTest/PostBecomeSiteManager.json",
        "dojo/text!./responseTemplates/SiteTest/PostRequestSiteMembership.json",
        "dojo/text!./responseTemplates/SiteTest/PutJoinSite.json",
        "dojo/text!./responseTemplates/SiteTest/DeleteLeaveSite.json",
        "dojo/text!./responseTemplates/SiteTest/GetRecentSites.json",
        "dojo/text!./responseTemplates/SiteTest/GetFavouriteSites.json"
        ], 
        function(declare, MockXhr, getSites, getAdminSites, getSite, putSite, deleteSite, postSiteAsFavourite, 
         deleteSiteAsFavourite, getSiteMemberships, postBecomeSiteManager, postRequestSiteMembership, putJoinSite, 
         deleteLeaveSite, getRecentSites, getFavouriteSites) {
   
   return declare([MockXhr], {

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_MockXhr__setupServer() {
         try
         {

            this.server.respondWith(
               "GET",
               /\/aikau\/proxy\/alfresco\/api\/sites[^\/]*/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  getSites
               ]
            );

            this.server.respondWith(
               "GET",
               /\/aikau\/proxy\/alfresco\/api\/admin-sites[^\/]*/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  getAdminSites
               ]
            );

            this.server.respondWith(
               "GET",
               /\/aikau\/proxy\/alfresco\/api\/sites\/[^\/]*/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  getSite
               ]
            );

            this.server.respondWith(
               "PUT",
               /\/aikau\/proxy\/alfresco\/api\/sites\/(.*)/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  putSite
               ]
            );

            this.server.respondWith(
               "DELETE",
               /\/aikau\/proxy\/alfresco\/api\/sites\/(.*)/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  deleteSite
               ]
            );

            this.server.respondWith(
               "POST",
               /\/aikau\/proxy\/alfresco\/api\/people\/(.*)\/preferences/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  postSiteAsFavourite
               ]
            );

            this.server.respondWith(
               "DELETE",
               /\/aikau\/proxy\/alfresco\/api\/people\/(.*)\/preferences?pf=org.alfresco.share.sites.favourites.(.*)/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  deleteSiteAsFavourite
               ]
            );

            this.server.respondWith(
               "GET",
               /\/aikau\/proxy\/alfresco\/api\/sites\/(.*)\/memberships/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  getSiteMemberships
               ]
            );

            this.server.respondWith(
               "POST",
               /\/aikau\/proxy\/alfresco\/api\/sites\/(.*)\/memberships/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  postBecomeSiteManager
               ]
            );

            this.server.respondWith(
               "POST",
               /\/aikau\/proxy\/alfresco\/api\/sites\/(.*)\/invitations/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  postRequestSiteMembership
               ]
            );

            this.server.respondWith(
               "PUT",
               /\/aikau\/proxy\/alfresco\/api\/sites\/(.*)\/memberships/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  putJoinSite
               ]
            );

            this.server.respondWith(
               "DELETE",
               /\/aikau\/proxy\/alfresco\/api\/sites\/(.*)\/memberships\/(.*)/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  deleteLeaveSite
               ]
            );

            this.server.respondWith(
               "GET",
               /\/aikau\/proxy\/alfresco\/api\/people\/(.*)\/sites\/recent/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  getRecentSites
               ]
            );

            this.server.respondWith(
               "GET",
               /\/aikau\/proxy\/alfresco\/api\/people\/(.*)\/sites\/favourites/,
               [
                  200,
                  {"Content-Type":"application/json;charset=UTF-8"},
                  getFavouriteSites
               ]
            );

         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      }
   });
});
