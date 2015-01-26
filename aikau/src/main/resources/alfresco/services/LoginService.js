/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * @module alfresco/services/LoginService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "dojo/_base/lang",
        "service/constants/Default"],
        function(declare, AlfCore, CoreXhr, lang, AlfConstants) {
   
   return declare([AlfCore, CoreXhr], {
      
      /**
       * Sets up the subscriptions for the LoginService
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_LoginService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_DOLOGIN", lang.hitch(this, "doLogin"));
      },
      
      /**
       * Perform a login POST operation.
       * 
       * @instance
       */
      doLogin: function alfresco_services_LoginService__doLogout(payload) {
         // Publish an event to indicate that a login attempt is about to begin, this is done so that
         // the login page has the opportunity to clear previously displayed messages and display
         // an indication that login has begun...
         this.alfPublish("ALF_LOGIN_STATUS", {
            status: "IN_PROGRESS"
         });

         // Determine the URL to use if login is successful, this is included in the payload...
         var url = AlfConstants.URL_PAGECONTEXT + "dologin?username=" + payload.username + "&password=" + payload.password;
         if (payload.successUrl == null || lang.trim(payload.successUrl) === "")
         {
            payload.successful = AlfConstants.URL_PAGECONTEXT + this.defaultLoginPage;
         }

         // Attempt the login for the supplied credentials...
         this.serviceXhr({
            url: url,
            method: "POST",
            data: payload,
            successCallback: this.onLoginSuccess,
            failureCallback: this.onLoginFailure,
            callbackScope: this
         });
      },

      /**
       * Handles the successful logins.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      onLoginSuccess: function alfresco_services_LoginService__onLoginSuccess(response, originalRequestConfig) {
         this.alfLog("info", "Login success");
         var url = lang.getObject("data.successUrl", false, originalRequestConfig);
         if (url != null)
         {
            this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
               type: "FULL_PATH",
               target: "CURRENT",
               url: originalRequestConfig.data.successUrl
            });
         }
      },

      /**
       * Handles failed logins.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      onLoginFailure: function alfresco_services_LoginService__onLoginFailure(response, originalRequestConfig) {
         this.alfLog("info", "Login failure");
         this.alfPublish("ALF_LOGIN_STATUS", {
            status: "FAILURE"
         });
      }
   });
});