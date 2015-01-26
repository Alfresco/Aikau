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
 * @module alfresco/services/UserService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/core/NotificationUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "alfresco/core/NotificationUtils",
        "dojo/request/xhr",
        "dojo/json",
        "dojo/_base/lang",
        "service/constants/Default"],
        function(declare, AlfCore, AlfXhr, NotificationUtils, xhr, JSON, lang, AlfConstants) {
   
   return declare([AlfCore, AlfXhr, NotificationUtils], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/UserService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/UserService.properties"}],
      
      /**
       * Sets up the subscriptions for the UserService
       * 
       * @instance 
       * @param {array} args The constructor arguments.
       */
      constructor: function alf_services_UserService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_UPDATE_USER_STATUS", lang.hitch(this, "updateUserStatus"));
      },
      
      /**
       * Handles XHR posting to a new user status mesage to the server. 
       * 
       * @instance
       * @param {object} data The payload containing the user status to post.
       */
      updateUserStatus: function alf_services_UserService__updateUserStatus(data) {
         var _this = this,
             url = AlfConstants.URL_SERVICECONTEXT + "components/profile/userstatus";
         this.serviceXhr({url : url,
                          data: data,
                          method: "POST",
                          successCallback: this.userStatusUpdateSuccess,
                          failureCallback: this.userStatusUpdateFailure,
                          callbackScope: this});
      },
      
      /**
       * This handles successfully completed requests to update the user status.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      userStatusUpdateSuccess: function alf_services_UserService__userStatusUpdateSuccess(response, originalRequestConfig) {
         // NOTE: The current update status API does NOT include the updated status message in the
         //       response. Ideally it would be nice to change this such that it does to ensure
         //       that the users status is correctly reflected. However, we will include the user
         //       status property here in the publication payload and set it to null to indicate
         //       that it is unknown. This is done because the UserStatus widget (at the time of 
         //       writing the only subscriber to this publication is coded to handle status updates
         //       that DO include a status message.
         this.alfLog("log", "User Status Update Success", response);
         if (typeof response == "string")
         {
            var response = JSON.parse(this.cleanupJSONResponse(response));
         }

         // Display a success message...
         this.displayMessage(this.message("message.status.success"));

         this.alfPublish("ALF_USER_STATUS_UPDATED", {
            userStatus: originalRequestConfig.data.status,
            userStatusTime: response.userStatusTime.iso8601
         });
      },
      
      /**
       * This handles failed attempts to update the user status.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      userStatusUpdateFailure: function alf_services_UserService__userStatusUpdateFailure(response, originalRequestConfig) {
         this.alfLog("log", "User Status Update Failure", response);
         if (typeof response == "string")
         {
            var response = JSON.parse(this.cleanupJSONResponse(response));
         }
         
         // Display a failure message...
         this.displayMessage(this.message("message.status.failure"));
         
         this.alfPublish("ALF_USER_STATUS_UPDATE_FAILURE", response);
      }
   });
});
