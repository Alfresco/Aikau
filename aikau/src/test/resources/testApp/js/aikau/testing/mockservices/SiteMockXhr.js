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
        "dojo/text!./responseTemplates/SiteTest/GetModeratedSite.json",
        "dojo/text!./responseTemplates/SiteTest/PutSite.json",
        "dojo/text!./responseTemplates/SiteTest/DeleteSite.json",
        "dojo/text!./responseTemplates/SiteTest/PostBecomeSiteManager.json",
        "dojo/text!./responseTemplates/SiteTest/PostRequestSiteMembership.json",
        "dojo/text!./responseTemplates/Preferences/Preferences.json"], 
        function(declare, lang, MockXhr, getSite, getModeratedSite, putSite, deleteSite, postBecomeSiteManager, 
                 postRequestSiteMembership, Preferences) {
   
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
            
            this.server.respondWith("GET",
                                    /\/aikau\/proxy\/alfresco\/api\/sites\/[^\/]*/,
                                    [200,{"Content-Type":"application/json;charset=UTF-8"},getSite]);

            this.server.respondWith("GET",
                                    "/aikau/proxy/alfresco/api/sites/site2",
                                    [200,{"Content-Type":"application/json;charset=UTF-8"},getModeratedSite]);

            this.server.respondWith("PUT",
                                    /\/aikau\/proxy\/alfresco\/api\/sites\/(.*)/,
                                    [200,{"Content-Type":"application/json;charset=UTF-8"},putSite]);

            this.server.respondWith("DELETE",
                                    /\/aikau\/proxy\/alfresco\/api\/sites\/(.*)/,
                                    [200,{"Content-Type":"application/json;charset=UTF-8"},deleteSite]);

            this.server.respondWith("POST",
                                    /\/aikau\/proxy\/alfresco\/api\/sites\/(.*)\/memberships/,
                                    [200,{"Content-Type":"application/json;charset=UTF-8"},postBecomeSiteManager]);

            this.server.respondWith("POST",
                                    /\/aikau\/proxy\/alfresco\/api\/sites\/(.*)\/invitations/,
                                    lang.hitch(this, this.requestSiteMembership));

            this.server.respondWith("GET",
                                    /\/aikau\/proxy\/alfresco\/slingshot\/site-identifier-used/,
                                    lang.hitch(this, this.validateSiteIdentifier));

            this.server.respondWith("POST",
                                    /\/aikau\/proxy\/alfresco\/api\/people\/guest\/preferences(.*)/,
                                    [200,
                                     {"Content-Type":"application/json;charset=UTF-8",
                                     "Content-Length":7962},
                                     Preferences]);

            this.alfSubscribe("ALF_WIDGETS_READY", lang.hitch(this, function() {
               this.alfPublish("UPDATE_CREATE_SITE_VALUES", {
                  tb4: "Value Set"
               }, true);
            }));

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
      },

      /**
       * Handles site identifier validation.
       *
       * @instance
       * @param  {object} request The request object
       * @since 1.0.89
       */
      validateSiteIdentifier: function alfresco_testing_SiteMockXhr__validateSiteIdentifier(request) {
         var url = request.url;
         var id = (url.indexOf("shortName=") !== -1 && url.substring(url.lastIndexOf("shortName=") + 10)) ||
                  (url.indexOf("title=") !== -1 && url.substring(url.lastIndexOf("title=") + 6));

         var used = false;
         switch(id) {
            case "used": 
               used = true;
               break;

            default:
               used = false;
         }

         var response = {
            used: used
         };

         var statusCode = 200;
         if (id === "500")
         {
            statusCode = 500;
         }
         request.respond(statusCode, {
            "Content-Type": "application/json;charset=UTF-8"
         }, JSON.stringify(response));
      }
   });
});
