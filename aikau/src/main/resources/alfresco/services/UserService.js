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
 * <p>This service has been provided for working with users. Currently it provides the capability to
 * list users (either in an [AlfList]{@link module:alfresco/lists/AlfList} or as options in a
 * [form control]{@link module:alfresco/forms/controls/BaseFormControl} that supports options, such
 * as a [Select control]{@link module:alfresco/forms/controls/Select}). It also provides the ability
 * to set the preferred home page of a user as well as their current status.<p>
 * <p>It is likely that this service does not yet provide all user related capabilities that may be
 * required - if a capability is missing then please raise a feature request as an issue on
 * the [GitHub project]{@link https://github.com/Alfresco/Aikau/issues}</p>
 * 
 * @module alfresco/services/UserService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/core/NotificationUtils
 * @mixes module:alfresco/services/_UserServiceTopicMixin
 * @mixes module:alfresco/services/_PreferenceServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/NotificationUtils",
        "alfresco/services/_UserServiceTopicMixin",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "alfresco/core/topics",
        "alfresco/util/urlUtils",
        "dojo/request/xhr",
        "dojo/json",
        "dojo/_base/lang",
        "dojo/_base/array",
        "service/constants/Default"],
        function(declare, BaseService, AlfXhr, NotificationUtils, 
              _UserServiceTopicMixin, _PreferenceServiceTopicMixin, topics, urlUtils, xhr, JSON, lang, array, AlfConstants) {
   
   return declare([BaseService, AlfXhr, NotificationUtils, _UserServiceTopicMixin, _PreferenceServiceTopicMixin], {
      
      /**
       * This is the dot-notation preferences property address for the user's home page
       *
       * @instance
       * @type {string}
       * @default
       */
      PREF_KEY_USER_HOME_PAGE: "org.alfresco.share.user.homePage",
      
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
       * @since 1.0.32
       * @listens module:alfresco/core/topics#GET_USERS
       * @listens module:alfresco/core/topics#GET_AUTHORITIES
       * @listens module:alfresco/core/topics#GET_FOLLOWED_USERS
       * @listens module:alfresco/core/topics#GET_FOLLOWING_USERS
       * @listens module:alfresco/core/topics#FOLLOW_USERS
       * @listens module:alfresco/core/topics#UNFOLLOW_USERS
       */
      registerSubscriptions: function alfresco_services_UserService__registerSubscriptions() {
         this.alfSubscribe(this.updateUserStatusTopic, lang.hitch(this, this.updateUserStatus));
         this.alfSubscribe(this.setUserHomePageTopic, lang.hitch(this, this.onSetUserHomePage));
         this.alfSubscribe(this.setUserHomePageSuccessTopic, lang.hitch(this, this.onSetUserHomePageSuccess));
         this.alfSubscribe(this.setUserHomePageFailureTopic, lang.hitch(this, this.onSetUserHomePageFailure));
         this.alfSubscribe(topics.GET_USERS, lang.hitch(this, this.onGetUsers));
         this.alfSubscribe(topics.GET_AUTHORITIES, lang.hitch(this, this.onGetAuthorities));
         this.alfSubscribe(topics.GET_FOLLOWED_USERS, lang.hitch(this, this.onGetFollowedUsers));
         this.alfSubscribe(topics.GET_FOLLOWING_USERS, lang.hitch(this, this.onGetFollowingUsers));
         this.alfSubscribe(topics.FOLLOW_USERS, lang.hitch(this, this.onFollowUsers));
         this.alfSubscribe(topics.UNFOLLOW_USERS, lang.hitch(this, this.onUnfollowUsers));
         this.alfSubscribe(topics.GET_USER, lang.hitch(this, this.onGetUser));
      },

      /**
       * Handles requests to retrieve a single user.
       * 
       * @instance
       * @param {object} payload The published payload with the userName of the user to retrieve
       * @since 1.0.86
       */
      onGetUser: function alfresco_services_UserService__onGetUser(payload) {
         if (payload.userName)
         {
            var url = AlfConstants.PROXY_URI + "api/people?filter=" + payload.userName;
            var config = {
               userName: payload.userName,
               url: url,
               method: "GET",
               successCallback: this.onUserSuccess,
               failureCallback: this.onUserFailure,
               callbackScope: this
            };
            this.mergeTopicsIntoXhrPayload(payload, config);
            this.serviceXhr(config);
         }
         else
         {
            this.alfLog("warn", "A request was made to retrieve the details for a user, but no 'userName' attribute was provided in the payload", payload, this);
         }
      },

      /**
       * Handles successful requests to get users filtered by the supplied user name. Makes an additional
       * XHR request to determine whether or not the user is being followed by the current user.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       * @since 1.0.86
       */
      onUserSuccess: function alfresco_services_UserService__onUserSuccess(response, originalRequestConfig) {
         var items = lang.getObject("people", false, response);
         if (items)
         {
            var targetUser;
            array.some(items, function(item) {
               if (item.userName === originalRequestConfig.userName)
               {
                  targetUser = item;
                  if (item.firstName && item.lastName)
                  {
                     targetUser.displayName = item.firstName + " " + item.lastName;
                  }
                  else if (item.firstName)
                  {
                     targetUser.displayName = item.firstName;
                  }
                  else if (item.lastName)
                  {
                     targetUser.displayName = item.lastName;
                  }
                  else
                  {
                     targetUser.displayName = "";
                  }

                  var url = AlfConstants.PROXY_URI + "api/subscriptions/" + AlfConstants.USERNAME + "/follows";
                  var config = {
                     url: url,
                     userData: targetUser,
                     initialRequestConfig: originalRequestConfig,
                     data: [targetUser.userName],
                     method: "POST",
                     successCallback: this.publishUser,
                     failureCallback: this.onUserFailure,
                     callbackScope: this
                  };
                  this.serviceXhr(config);
               }
               return targetUser;
            }, this);
         }
      },

      /**
       * This is the success callback for the [onGetUser]{@link module:alfresco/services/UserService#onGetUser} function.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       * @since 1.0.86
       */
      publishUser: function alfresco_services_UserService__publishUser(response, originalRequestConfig) {
         var user = originalRequestConfig.userData;
         user.following = (response && response.length && response[0][user.userName]) || false;

         var topic = lang.getObject("initialRequestConfig.alfSuccessTopic", false, originalRequestConfig);
         if (!topic)
         {
            topic = lang.getObject("initialRequestConfig.alfResponseTopic", false, originalRequestConfig);
         }
         if (topic)
         {
            this.alfPublish(topic, {
               user: user
            });
         }
      },

      /**
       * This is the failure callback for the [onGetUser]{@link module:alfresco/services/UserService#onGetUser} function.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       * @since 1.0.86
       */
      onUserFailure: function alfresco_services_UserService__onUserFailure(response, originalRequestConfig) {
         this.alfLog("error", "It was not possible to retrieve the user", response, originalRequestConfig, this);
      },

      /**
       * Handles requests to follow users.
       * 
       * @instance
       * @param {object} payload The details of the users to follow
       * @since 1.0.86
       */
      onFollowUsers: function alfresco_services_UserService__onFollowUsers(payload) {
         if (payload.userNames)
         {
            var url = AlfConstants.PROXY_URI + "api/subscriptions/" + AlfConstants.USERNAME + "/follow";
            var config = {
               url: url,
               data: payload.userNames,
               method: "POST"
            };
            this.mergeTopicsIntoXhrPayload(payload, config);
            this.serviceXhr(config);
         }
         else
         {
            this.alfLog("warn", "A request was made to follow users, but no 'userName' attribute was provided in the payload", payload, this);
         }
      },

      /**
       * Handles requests to unfollow users.
       * 
       * @instance
       * @param {object} payload The details of the users to follow
       * @since 1.0.86
       */
      onUnfollowUsers: function alfresco_services_UserService__onUnfollowUsers(payload) {
         if (payload.userNames)
         {
            var url = AlfConstants.PROXY_URI + "api/subscriptions/" + AlfConstants.USERNAME + "/unfollow";
            var config = {
               url: url,
               data: payload.userNames,
               method: "POST"
            };
            this.mergeTopicsIntoXhrPayload(payload, config);
            this.serviceXhr(config);
         }
         else
         {
            this.alfLog("warn", "A request was made to unfollow users, but no 'userName' attribute was provided in the payload", payload, this);
         }
      },

      /**
       * Handles requests to retrieve authorities (users or groups).
       * 
       * @instance
       * @param {object} payload The request details
       * @since 1.0.77
       */
      onGetAuthorities: function alfresco_services_UserService__onGetAuthorities(payload) {
         var topic;
         if (payload.alfResponseTopic)
         {
            topic = (payload.alfResponseScope || "") + payload.alfResponseTopic;
         }
         else
         {
            topic = payload.responseTopic;
         }

         var url = AlfConstants.PROXY_URI + "api/forms/picker/authority/children";
         
         var searchTerm = payload.query || "";
         url = urlUtils.addQueryParameter(url, "searchTerm", searchTerm);

         var selectableType = payload.selectableType || "cm:person";
         url = urlUtils.addQueryParameter(url, "selectableType", selectableType);

         var size = payload.size || 1000;
         url = urlUtils.addQueryParameter(url, "size", size);
         
         this.serviceXhr({
            url: url,
            method: "GET",
            alfTopic: topic,
            alfResponseTopic: topic,
            alfSuccessTopic: payload.alfSuccessTopic,
            alfFailureTopic: payload.alfFailureTopic
         });
      },

      /**
       * 
       * @instance
       * @param  {object} payload Additional details for the request.
       * @since 1.0.86
       */
      onGetFollowedUsers: function alfresco_services_UserService__onGetFollowedUsers(payload) {
         var url = AlfConstants.PROXY_URI + "api/subscriptions/" + AlfConstants.USERNAME + "/following";
         var config = {
            url: url,
            method: "GET"
         };
         this.mergeTopicsIntoXhrPayload(payload, config);
         this.serviceXhr(config);
      },

      /**
       * 
       * @instance
       * @param  {object} payload Additional details for the request.
       * @since 1.0.86
       */
      onGetFollowingUsers: function alfresco_services_UserService__onGetFollowingUsers(payload) {
         var url = AlfConstants.PROXY_URI + "api/subscriptions/" + AlfConstants.USERNAME + "/followers";
         var config = {
            url: url,
            method: "GET"
         };
         this.mergeTopicsIntoXhrPayload(payload, config);
         this.serviceXhr(config);
      },

      /**
       * Handles requests to retrieve all users from the Alfresco Repository.
       * 
       * @instance
       * @param  {object} payload The payload for the request
       * @since 1.0.60
       */
      onGetUsers: function alfresco_services_UserService__onGetUsers(payload) {
         var topic;
         if (payload.alfResponseTopic)
         {
            topic = (payload.alfResponseScope || "") + payload.alfResponseTopic;
         }
         else
         {
            topic = payload.responseTopic;
         }

         var url = AlfConstants.PROXY_URI + "api/people";
         if (payload.dataFilters)
         {
            url = urlUtils.addFilterQueryParameters(url, payload);
         }
         else if (payload.filter)
         {
            url = urlUtils.addQueryParameter(url, "filter", payload.filter);
         }

         if (payload.sortField)
         {
            url = urlUtils.addQueryParameter(url, "sortBy", payload.sortField);
         }

         url = urlUtils.addQueryParameter(url, "dir", (payload.sortAscending !== false) ? "asc" : "desc");
         
         if (payload.pageSize)
         {
            url = urlUtils.addQueryParameter(url, "pageSize", payload.pageSize);
         }
         if (payload.page && payload.pageSize)
         {
            var startIndex = (payload.page - 1) * payload.pageSize;
            url = urlUtils.addQueryParameter(url, "startIndex", startIndex);
         }
         
         this.serviceXhr({
            url: url,
            method: "GET",
            alfResponseTopic: topic,
            alfSuccessTopic: payload.alfSuccessTopic,
            alfFailureTopic: payload.alfFailureTopic,
            successCallback: this.onUsersSuccess,
            failureCallback: this.onUsersFailure,
            callbackScope: this
         });
      },

      /**
       * This is the success callback for the [onGetUsers]{@link module:alfresco/services/UserService#onGetUsers} function.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       * @since 1.0.60
       */
      onUsersSuccess: function alfresco_services_UserService__onUsersSuccess(response, originalRequestConfig) {
         var items = lang.getObject("people", false, response);
         if (items)
         {
            array.forEach(items, function(item) {
               if (item.firstName && item.lastName)
               {
                  item.displayName = item.firstName + " " + item.lastName;
               }
               else if (item.firstName)
               {
                  item.displayName = item.firstName;
               }
               else if (item.lastName)
               {
                  item.displayName = item.lastName;
               }
               else
               {
                  item.displayName = "";
               }
            });

            this.alfPublish(originalRequestConfig.alfSuccessTopic || originalRequestConfig.alfResponseTopic, {
               items: items
            });
         }
      },

      /**
       * This is the failure callback for the [onGetUsers]{@link module:alfresco/services/UserService#onGetUsers} function.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       * @since 1.0.60
       */
      onUsersFailure: function alfresco_services_UserService__onUsersFailure(response, originalRequestConfig) {
         this.alfLog("error", "It was not possible to retrieve the list of users", response, originalRequestConfig, this);
      },
      
      /**
       * Handles XHR posting to a new user status mesage to the server. 
       * 
       * @instance
       * @param {object} data The payload containing the user status to post.
       */
      updateUserStatus: function alfresco_services_UserService__updateUserStatus(data) {
         var url = AlfConstants.URL_SERVICECONTEXT + "components/profile/userstatus";
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
      userStatusUpdateSuccess: function alfresco_services_UserService__userStatusUpdateSuccess(response, originalRequestConfig) {
         // NOTE: The current update status API does NOT include the updated status message in the
         //       response. Ideally it would be nice to change this such that it does to ensure
         //       that the users status is correctly reflected. However, we will include the user
         //       status property here in the publication payload and set it to null to indicate
         //       that it is unknown. This is done because the UserStatus widget (at the time of 
         //       writing the only subscriber to this publication is coded to handle status updates
         //       that DO include a status message.
         this.alfLog("log", "User Status Update Success", response);
         if (typeof response === "string")
         {
            response = JSON.parse(this.cleanupJSONResponse(response));
         }

         // Display a success message...
         this.displayMessage(this.message("message.status.success"));

         this.alfPublish(this.updateUserStatusSuccessTopic, {
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
      userStatusUpdateFailure: function alfresco_services_UserService__userStatusUpdateFailure(response, /*jshint unused:false*/ originalRequestConfig) {
         this.alfLog("log", "User Status Update Failure", response);
         if (typeof response === "string")
         {
            response = JSON.parse(this.cleanupJSONResponse(response));
         }
         
         // Display a failure message...
         this.displayMessage(this.message("message.status.failure"));
         
         this.alfPublish(this.updateUserStatusFailureTopic, response);
      },
      
      /**
       * Sets the user's home page.
       * 
       * @instance
       * @param {object} payload
       */
      onSetUserHomePage: function alfresco_services_UserService__onSetUserHomePage(payload) {
         if (payload && payload.homePage)
         {
            this.alfPublish(this.setPreferenceTopic,{
               preference: this.PREF_KEY_USER_HOME_PAGE,
               value: payload.homePage,
               alfResponseTopic: this.setUserHomePageTopic
            });
         }
      },
      
      /**
       * Displays a message indicating successful save of user's home page.
       * 
       * @instance
       * @listens setUserHomePageTopicSuccess
       */
      onSetUserHomePageSuccess: function alfresco_services_UserService__onSetUserHomePageSuccess() {
         // Display a success message...
         this.displayMessage(this.message("message.homePage.success"));
      },
      
      /**
       * Displays a message indicating failure to save of user's home page.
       * 
       * @instance
       * @listens setUserHomePageTopicFailure
       */
      onSetUserHomePageFailure: function alfresco_services_UserService__onSetUserHomePageFailure() {
         // Display a failure message...
         this.displayMessage(this.message("message.homePage.failure"));
      }
   });
});
