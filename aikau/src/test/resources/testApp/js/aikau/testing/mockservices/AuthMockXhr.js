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
 * Mock XHR that returns 200 OK for all requests, with one exception that it will
 * respond with a 401 from a POST to '/authfail' for testing authentication and timeouts.
 * 
 * @module aikauTesting/mockservices/AuthMockXhr
 * @author Kevin Roast
 */
define([
      "alfresco/testing/MockXhr",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "alfresco/core/CoreXhr"],
      function(MockXhr, declare, lang, CoreXhr) {

   return declare([MockXhr, CoreXhr], {

      /**
       * Sets up subscriptions.
       *
       * @instance
       */
      constructor: function aikauTesting_mockservices_AuthMockXhr__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_AUTHENTICATION_FAIL", lang.hitch(this, "doAuthFail"));
      },

      /**
       * Set up the fake server
       *
       * @instance
       */
      setupServer: function aikauTesting_mockservices_AuthMockXhr__setupServer() {
         try {
            this.server.respondWith([200, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify({
               result: "OK"
            })]);
            
            this.server.respondWith("POST", "/authfail", [401, {
               "Content-Type": "application/json;charset=UTF-8"
            }, JSON.stringify({
               result: "FAILURE"
            })]);
            
            this.alfPublish("ALF_MOCK_XHR_SERVICE_READY");
         } catch (e) {
            this.alfLog("error", "The following error occurred setting up the mock server", e);
         }
      },
      
      /**
       * Perform a failed authenticated call through the CoreXHR handler
       * 
       * @instance
       */
      doAuthFail: function aikauTesting_mockservices_AuthMockXhr__doAuthFail() {
          // Attempt the request that should handle the 401 successfully
         this.serviceXhr({
            url: "/authfail",
            method: "POST",
            data: {},
            successCallback: function aikauTesting_mockservices_AuthMockXhr__doAuthFail_success() {
               // this shouldn't happen!
               throw new Error("401 not handled correctly");
            },
            authenticationFailureCallback: function aikauTesting_mockservices_AuthMockXhr__doAuthFail_failure() {
               // this is the correct handler that should be called if a 401 is detected and handler is provided
               console.log("401 correctly handled.");
            },
            callbackScope: this
         });
      }
   });
});