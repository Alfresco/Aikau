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
 * @module aikauTesting/SiteMockXhr
 * @author Richard Smith
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "alfresco/testing/MockXhr",
        "dojo/text!./responseTemplates/SiteTest/GetSite.json",
        "dojo/text!./responseTemplates/SiteTest/PutSite.json",
        "dojo/text!./responseTemplates/SiteTest/DeleteSite.json",
        "dojo/text!./responseTemplates/SiteTest/PostBecomeSiteManager.json",
        "dojo/text!./responseTemplates/SiteTest/PostRequestSiteMembership.json"], 
        function(declare, lang, MockXhr, getSite, putSite, deleteSite, postBecomeSiteManager, postRequestSiteMembership) {
   
   return declare([MockXhr], {

      /**
       * @instance
       */
      createSite: function alfresco_testing_SiteMockXhr__createSite(request) {
         var response;
         var shortName = JSON.parse(request.requestBody).shortName;
         if (shortName === "pass")
         {
            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify(response));
         }
         else
         {
            response = {
               callstack: [],
               exception: "",
               message: "error.duplicateShortName"
            };
            request.respond(400, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify(response));
         }
      },

      /**
       * This sets up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_SiteMockXhr__setupServer() {
         try
         {
            this.server.respondWith("POST",
                                    "/aikau/service/modules/create-site",
                                    lang.hitch(this, this.createSite));
            
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
               lang.hitch(this, this.requestSiteMembership)
            );

         }
         catch(e)
         {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      },

      /**
       * Handle site-join requests
       *
       * @instance
       * @param {object} request The request object
       * @since 1.0.58
       */
      requestSiteMembership: function alfresco_testing_SiteMockXhr__requestSiteMembership(request) {
         var body = request && request.requestBody && JSON.parse(request.requestBody),
            comments = body && body.inviteeComments;
         if (comments === "Request pending") {
            request.respond(400, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify({
               error: "A request to join this site is in pending"
            }));
         } else if (comments === "Error") {
            request.respond(500, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify({
               error: "Unexpected error occurred"
            }));
         } else {
            request.respond(200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify(postRequestSiteMembership));
         }
      }
   });
});
