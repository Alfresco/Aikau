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
 * @module alfresco/services/LoginService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/enums/urlTypes",
        "alfresco/util/urlUtils",
        "dojo/_base/lang",
        "service/constants/Default"],
        function(declare, BaseService, CoreXhr, urlTypes, urlUtils, lang, AlfConstants) {
   
   return declare([BaseService, CoreXhr], {
      
      /**
       * Sets up the subscriptions for the LoginService
       * 
       * @instance
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_LoginService__registerSubscriptions() {
         this.alfSubscribe("ALF_DOLOGIN", lang.hitch(this, "doLogin"));
      },
      
      /**
       * Perform a login POST operation.
       * 
       * @instance
       */
      doLogin: function alfresco_services_LoginService__doLogout(payload) {
         /*jshint eqnull:true*/
         // Publish an event to indicate that a login attempt is about to begin, this is done so that
         // the login page has the opportunity to clear previously displayed messages and display
         // an indication that login has begun...
         this.alfPublish("ALF_LOGIN_STATUS", {
            status: "IN_PROGRESS"
         });

         // Determine the URL to use if login is successful, this is included in the payload...
         var url = AlfConstants.URL_SERVICECONTEXT + "dologin?username=" + payload.username + "&password=" + payload.password;
         if (payload.successUrl == null || lang.trim(payload.successUrl) === "")
         {
            payload.successful = urlUtils.convertUrl(this.defaultLoginPage, urlTypes.PAGE_RELATIVE);
         }

         // Attempt the login for the supplied credentials...
         this.serviceXhr({
            url: url,
            method: "POST",
            data: payload,
            successCallback: this.onLoginSuccess,
            authenticationFailureCallback: this.onLoginFailure,
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
         /*jshint eqnull:true*/
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
      onLoginFailure: function alfresco_services_LoginService__onLoginFailure(/*jshint unused:false*/ response, /*jshint unused:false*/ originalRequestConfig) {
         this.alfLog("info", "Login failure");
         this.alfPublish("ALF_LOGIN_STATUS", {
            status: "FAILURE"
         });
      }
   });
});