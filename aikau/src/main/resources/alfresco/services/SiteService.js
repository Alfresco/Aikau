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
 * @module alfresco/services/SiteService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/core/NotificationUtils",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/core/topics",
        "alfresco/enums/urlTypes",
        "dojo/_base/lang",
        "alfresco/buttons/AlfButton",
        "service/constants/Default"],
        function(declare, BaseService, CoreXhr, NotificationUtils, ObjectTypeUtils, topics, urlTypes, lang, AlfButton, AlfConstants) {

   return declare([BaseService, CoreXhr, NotificationUtils], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/SiteService.properties"}],

      /**
       * The standard home page for a user
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.39
       */
      userHomePage: "/dashboard",

      /**
       * Sets up the subscriptions for the SiteService
       *
       * @instance
       * @since 1.0.32
       * @listens module:alfresco/core/topics#DELETE_SITE
       * @listens module:alfresco/core/topics#BECOME_SITE_MANAGER
       */
      registerSubscriptions: function alfresco_services_SiteService__registerSubscriptions() {
         this.alfSubscribe("ALF_GET_SITES", lang.hitch(this, this.getSites));
         this.alfSubscribe("ALF_GET_SITES_ADMIN", lang.hitch(this, this.getAdminSites));
         this.alfSubscribe("ALF_GET_SITE_MEMBERSHIPS", lang.hitch(this, this.getSiteMemberships));
         this.alfSubscribe("ALF_GET_SITE_DETAILS", lang.hitch(this, this.getSiteDetails));
         this.alfSubscribe("ALF_UPDATE_SITE_DETAILS", lang.hitch(this, this.updateSite));
         this.alfSubscribe(topics.BECOME_SITE_MANAGER, lang.hitch(this, this.becomeSiteManager));
         this.alfSubscribe("ALF_JOIN_SITE", lang.hitch(this, this.joinSite));
         this.alfSubscribe("ALF_REQUEST_SITE_MEMBERSHIP", lang.hitch(this, this.requestSiteMembership));
         this.alfSubscribe("ALF_LEAVE_SITE", lang.hitch(this, this.leaveSiteRequest));
         this.alfSubscribe("ALF_LEAVE_SITE_CONFIRMATION", lang.hitch(this, this.leaveSite));
         this.alfSubscribe("ALF_CREATE_SITE", lang.hitch(this, this.createSite));
         this.alfSubscribe("ALF_EDIT_SITE", lang.hitch(this, this.editSite));
         this.alfSubscribe(topics.DELETE_SITE, lang.hitch(this, this.onActionDeleteSite));
         this.alfSubscribe("ALF_ADD_FAVOURITE_SITE", lang.hitch(this, this.addSiteAsFavourite));
         this.alfSubscribe("ALF_REMOVE_FAVOURITE_SITE", lang.hitch(this, this.removeSiteFromFavourites));
         this.alfSubscribe("ALF_GET_RECENT_SITES", lang.hitch(this, this.getRecentSites));
         this.alfSubscribe("ALF_GET_FAVOURITE_SITES", lang.hitch(this, this.getFavouriteSites));

         // Make sure that the edit-site.js file is loaded. This is required for as it handles legacy site
         // editing. At some stage this will not be needed when a new edit site dialog is provided.
         var _this = this;
         require([AlfConstants.URL_RESCONTEXT + "modules/edit-site.js"], function() {
            _this.alfLog("log", "Edit Site JavaScript resource loaded");
         });
      },

      /**
       *
       * @instance
       * @param {object} payload The details of the request
       */
      getSites: function alfresco_services_SiteService__getSites(payload) {
         // TODO: Clean this up. Choose on or other as the Aikau standard.
         var alfResponseTopic = payload.alfResponseTopic || payload.responseTopic;
         this.serviceXhr({
            url: AlfConstants.PROXY_URI + "api/sites",
            method: "GET",
            alfTopic: alfResponseTopic
         });
      },

      /**
       * Get sites list using the admin API - this returns ALL sites if the user is a member of the SITE_ADMINISTRATORS group.
       *
       * @instance
       * @param {object} payload The details of the request
       */
      getAdminSites: function alfresco_services_SiteService__getAdminSites(payload) {
         // skipCount is the number of entries to skip, not pages so needs some maths:
         var skipCount = (payload.page - 1) * payload.pageSize;
         this.serviceXhr({
            url: AlfConstants.PROXY_URI + "api/admin-sites?skipCount=" + skipCount + "&maxItems="+ payload.pageSize ,
            method: "GET",
            alfTopic: payload.responseTopic
         });
      },

      /**
       * This processes the results returned from the XHR request.
       *
       * @instance
       * @param {object} response
       * @param {object} originalRequestConfig
       */
      getSitesSuccess: function alfresco_services_SiteService__getSitesSuccess(response, originalRequestConfig) {
         if (ObjectTypeUtils.isArray(response))
         {
            var topic = originalRequestConfig.responseTopic || "ALF_SITES_LOADED";
            var sitesData = {
               items: response
            };
            this.alfPublish(topic, sitesData);
         }
         else
         {
            this.alfLog("error", "The request to retrieve available sites returned a response that could not be interpreted", response, originalRequestConfig, this);
         }
      },

      /**
       * This function makes a request to obtain the details of a specific site. Unlike the other functions
       * in this service it requires a specific callback function and scope to be provided in the request
       * as it doesn't make sense to just publish site information.
       *
       * @instance
       * @param {object} config An object with the details of the site to retrieve the data for.
       */
      getSiteDetails: function alfresco_services_SiteService__getSiteDetails(config) {
         if (config && config.site && config.responseTopic)
         {
            var url = AlfConstants.PROXY_URI + "api/sites/" + config.site;
            this.serviceXhr({url : url,
                             method: "GET",
                             site: config.site,
                             responseTopic: config.responseTopic,
                             successCallback: this.publishSiteDetails,
                             callbackScope: this});
         }
         else
         {
            this.alfLog("error", "A request to get the details of a site was made, but either the 'site' or 'responseTopic' attributes was not provided", config);
         }
      },

      /**
       * Publishes the details of a site on the requested topic. This is called
       *
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      publishSiteDetails: function alfresco_services_SiteService__publishSiteDetails(response, originalRequestConfig) {
         if (originalRequestConfig && originalRequestConfig.responseTopic)
         {
            this.alfLog("log", "Publishing site details", originalRequestConfig);
            this.alfPublish(originalRequestConfig.responseTopic, response);
         }
         else
         {
            this.alfLog("error", "It was not possible to publish requested site details because the 'responseTopic' attribute was not set on the original request", response, originalRequestConfig);
         }
      },

      /**
       * This function handles requests to update a specific site
       *
       * @instance
       * @param {object} payload Details of the update
       */
      updateSite: function alfresco_services_SiteService__updateSite(payload) {
         var shortName = lang.getObject("shortName", false, payload);
         if (shortName)
         {
            var url = AlfConstants.PROXY_URI + "api/sites/" + shortName;
            this.serviceXhr({
               url: url,
               method: "PUT",
               data: payload,
               alfTopic: payload.responseTopic
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to update a site but no 'shortName' attribute was provided", payload, this);
         }
      },

      /**
       * Handles requests to delete the supplied site.
       *
       * @instance
       * @param {object} payload The details of the site to delete
       */
      onActionDeleteSite: function alfresco_services_SiteService__onActionDeleteSite(payload) {
         var shortName = lang.getObject("document.shortName", false, payload) || lang.getObject("shortName", false, payload);
         if (shortName)
         {
            var responseTopic = this.generateUuid();
            this._actionDeleteHandle = this.alfSubscribe(responseTopic, lang.hitch(this, "onActionDeleteSiteConfirmation"), false);

            this.alfPublish("ALF_CREATE_DIALOG_REQUEST", {
               dialogId: "ALF_SITE_SERVICE_DIALOG",
               dialogTitle: this.message("message.delete-site-confirm-title"),
               textContent: this.message("message.delete-site-prompt", { "0": shortName}),
               widgetsButtons: [
                  {
                     id: "ALF_SITE_SERVICE_DIALOG_CONFIRMATION",
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: this.message("button.delete-site.confirm-label"),
                        publishTopic: this.pubSubScope + responseTopic,
                        publishPayload: payload
                     }
                  },
                  {
                     id: "ALF_SITE_SERVICE_DIALOG_CANCELLATION",
                     name: "alfresco/buttons/AlfButton",
                     config: {
                        label: this.message("button.delete-site.cancel-label"),
                        publishTopic: "close"
                     }
                  }
               ]
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to delete a site but no 'shortName' attribute was provided", document, this);
         }
      },

      /**
       * This function is called when the user confirms that they wish to delete a site
       *
       * @instance
       * @param {object} payload An object containing the details of the site to be deleted.
       */
      onActionDeleteSiteConfirmation: function alfresco_services_SiteService__onActionDeleteSiteConfirmation(payload) {
         this.alfUnsubscribeSaveHandles([this._actionDeleteHandle]);
         var responseTopic = this.generateUuid();
         var subscriptionHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onActionDeleteSiteSuccess), false);
         var shortName = lang.getObject("document.shortName", false, payload) || lang.getObject("shortName", false, payload);
         if (shortName)
         {
            var url = AlfConstants.PROXY_URI + "api/sites/" + shortName;
            this.serviceXhr({
               alfTopic: responseTopic,
               subscriptionHandle: subscriptionHandle,
               url: url,
               data: payload,
               method: "DELETE"
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to delete a site but no 'shortName' attribute was provided", document, this);
         }
      },

      /**
       * This action will be called when a site is successfully deleted
       *
       * @instance
       * @param {object} payload
       * @fires module:alfresco/core/topics#NAVIGATE_TO_PAGE
       * @fires module:alfresco/core/topics#RELOAD_DATA_TOPIC
       */
      onActionDeleteSiteSuccess: function alfresco_services_SiteService__onActionDeleteSiteSuccess(payload) {
         var subscriptionHandle = lang.getObject("requestConfig.subscriptionHandle", false, payload);
         if (subscriptionHandle)
         {
            this.alfUnsubscribe(subscriptionHandle);
         }

         var redirect = lang.getObject("requestConfig.data.redirect", false, payload);
         if (redirect)
         {
            this.alfServicePublish(topics.NAVIGATE_TO_PAGE, {
               url: redirect.url,
               type: redirect.type,
               target: redirect.target
            });
         }
         else
         {
            this.reloadData();
         }
      },

      /**
       * Handles requesting that a site be made a favourite.
       *
       * @instance
       * @param {object} payload The payload containing the details of the site to add to the favourites list
       */
      addSiteAsFavourite: function alfresco_services_SiteService__addSiteAsFavourite(payload) {
         if (payload.site && payload.user)
         {
            // Set up the favourites information...
            var url = AlfConstants.PROXY_URI + "api/people/" + encodeURIComponent(payload.user) + "/preferences",
                favObj = {org:{alfresco:{share:{sites:{favourites:{}}}}}};
            favObj.org.alfresco.share.sites.favourites[payload.site] = true;
            this.serviceXhr({url : url,
                             site: payload.site,
                             user: payload.user,
                             title: payload.title,
                             data: favObj,
                             method: "POST",
                             successCallback: this.favouriteSiteAdded,
                             callbackScope: this,
                             alfResponseScope: payload.alfResponseScope});
         }
         else
         {
            // Handle error conditions...
            this.alfLog("error", "A request to make a site a favourite but either the site or user was not specified", payload);
         }
      },

      /**
       * This handles successfully completed requests to remove a site from the favourites list for a user. It publishes the
       * details on "ALF_FAVOURITE_SITE_ADDED" topic.
       *
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      favouriteSiteAdded: function alfresco_services_SiteService__favouriteSiteAdded(response, originalRequestConfig) {
         this.alfLog("log", "Favourite Site Added Successfully", response, originalRequestConfig);
         this.alfPublish("ALF_FAVOURITE_SITE_ADDED", {
            site: originalRequestConfig.site,
            user: originalRequestConfig.user,
            title: originalRequestConfig.title
         }, false, false, originalRequestConfig.alfResponseScope);
      },

      /**
       * Handles requesting that a site be removed from favourites
       *
       * @instance
       * @param {object} payload The payload containing the details of the site to remove from the favourites list
       */
      removeSiteFromFavourites: function alfresco_services_SiteService__removeSiteFromFavourites(payload) {
         if (payload.site && payload.user)
         {
            // Set up the favourites information...
            var url = AlfConstants.PROXY_URI + "api/people/" + encodeURIComponent(payload.user) + "/preferences?pf=org.alfresco.share.sites.favourites." + payload.site;
            this.serviceXhr({url : url,
                             site: payload.site,
                             user: payload.user,
                             title: payload.title,
                             method: "DELETE",
                             successCallback: this.favouriteSiteRemoved,
                             callbackScope: this,
                             alfResponseScope: payload.alfResponseScope});
         }
         else
         {
            // Handle error conditions...
            this.alfLog("error", "A request to remove a site from the favourites list but either the site or user was not specified", payload);
         }
      },

      /**
       * This handles successfully completed requests to remove a site from the favourites list for a user. It publishes the
       * details on "ALF_FAVOURITE_SITE_REMOVED" topic.
       *
       * @instance
       * @param {object} response The response from the XHR request to remove the site.
       * @param {object} originalRequestConfig The original configuration passed when the request was made.
       */
      favouriteSiteRemoved: function alfresco_services_SiteService_favouriteSiteRemoved(response, originalRequestConfig) {
         this.alfLog("log", "Favourite Site Removed Successfully", response, originalRequestConfig);
         this.alfPublish("ALF_FAVOURITE_SITE_REMOVED", {
            site: originalRequestConfig.site,
            user: originalRequestConfig.user,
            title: originalRequestConfig.title
         }, false, false, originalRequestConfig.alfResponseScope);
      },

      /**
       * Retrieves the site membership data for the supplied site.
       *
       * @instance
       * @param {object} payload The details of the site to retrieve member data for
       */
      getSiteMemberships: function alfresco_services_SiteService__getSiteMemberships(payload) {
         if (payload && payload.site && payload.responseTopic)
         {
            var url = AlfConstants.PROXY_URI + "api/sites/" + payload.site + "/memberships";
            this.serviceXhr({url : url,
                             method: "GET",
                             alfTopic: payload.responseTopic});

         }
         else
         {
            this.alfLog("error", "A request to get the details of a site was made, but either the 'site' or 'responseTopic' attributes was not provided", payload);
         }
      },

      /**
       * Handles XHR posting to make a user a site manager.
       *
       * @instance
       * @param {object} data The payload containing the user status to post.
       */
      becomeSiteManager: function alfresco_services_SiteService__becomeSiteManager(config) {
         if (config.site)
         {
            this.alfLog("log", "A request has been made for a user to become the manager of a site: ", config);
            var url = AlfConstants.PROXY_URI + "api/sites/" + encodeURIComponent(config.site) + "/memberships";
            var data = {
                  role: (config.role) ? config.role : "SiteManager",
                  person: {
                     userName: (config.user) ? config.user : AlfConstants.USERNAME
                  }
            };
            this.serviceXhr({url : url,
                             data: data,
                             method: "POST",
                             successCallback: config.reloadPage ? this.reloadPage : this.reloadData,
                             callbackScope: this});
         }
         else
         {
            // Handle error conditions...
            this.alfLog("error", "A request was made for a user to become the manager of a site, but no site was specified", config);
         }
      },

      /**
       * Handles requests to request membership of a moderated site
       *
       * @instance
       * @param {object} config The configuration for the join request.
       */
      requestSiteMembership: function alfresco_services_SiteService__requestSiteMembership(config) {
         if (config.site && config.user)
         {
            // PLEASE NOTE: The default role for joining a site is "SiteConsumer", however this can be overridden
            // if a role is included in the supplied configuration...
            this.alfLog("log", "A request has been made for a user to join a site: ", config);
            var url = AlfConstants.PROXY_URI + "api/sites/" + encodeURIComponent(config.site) + "/invitations";
            var data = {
               invitationType: "MODERATED",
               inviteeRoleName: (config.role) ? config.role : "SiteConsumer",
               inviteeUserName: config.user,
               inviteeComments: (config.comments) ? config.comments : ""
            };

            // Make the XHR request...
            this.serviceXhr({url : url,
                             method: "POST",
                             site: config.site,
                             user: config.user,
                             data: data,
                             successCallback: this.siteMembershipRequestComplete,
                             callbackScope: this});
         }
         else
         {
            // Handle error conditions...
            if (!config.site)
            {
               this.alfLog("error", "A request was made to join a site but no site was specified", config);
            }
            if (!config.user)
            {
               this.alfLog("error", "A request was made to join a site but no user was specified", config);
            }
         }
      },

      /**
       * Callback that occurs after a request to join a moderated site is complete.
       *
       * @instance
       * @param {object} response The response from the XHR request to join the site.
       * @param {object} originalRequestConfig The original configuration passed when the request was made.
       */
      siteMembershipRequestComplete: function alfresco_services_SiteService__siteMembershipRequestComplete(response, originalRequestConfig) {
         this.alfLog("log", "User has successfully requested to join a moderated site", response, originalRequestConfig);
         this.alfServicePublish(topics.CREATE_DIALOG, {
            dialogTitle: this.message("message.request-join-success-title"),
            textContent: this.message("message.request-join-success", {"0": originalRequestConfig.user, "1": originalRequestConfig.site}),
            widgetsButtons: [
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: this.message("button.leave-site.confirm-label"),
                     publishTopic: "ALF_NAVIGATE_TO_PAGE",
                     publishPayload: {
                        url: "user/" + encodeURIComponent(originalRequestConfig.user) + this.userHomePage.replace(/^\/*/, "/"),
                        type: urlTypes.PAGE_RELATIVE,
                        target: "CURRENT"
                     },
                     additionalCssClasses: "call-to-action"
                  }
               }
            ]
         });
      },

      /**
       * Performs and XHR put request to make the user a member of the site. The argument supplied must include
       * the attributes "site" and "user" and can optionally include an attribute "role".
       *
       * @instance
       * @param {object} config The configuration for the join request.
       */
      joinSite: function alfresco_services_SiteService__joinSite(config) {

         if (config.site && config.user)
         {
            // PLEASE NOTE: The default role for joining a site is "SiteConsumer", however this can be overridden
            // if a role is included in the supplied configuration...
            this.alfLog("log", "A request has been made for a user to join a site: ", config);
            var url = AlfConstants.PROXY_URI + "api/sites/" + encodeURIComponent(config.site) + "/memberships";
            var data = {
               role: (config.role) ? config.role : "SiteConsumer",
               person: {
                  userName: config.user
               }
            };

            // Make the XHR request...
            this.serviceXhr({url : url,
                             method: "PUT",
                             site: config.site,
                             user: config.user,
                             data: data,
                             successCallback: this.siteJoined,
                             callbackScope: this});
         }
         else
         {
            // Handle error conditions...
            if (!config.site)
            {
               this.alfLog("error", "A request was made to join a site but no site was specified", config);
            }
            if (!config.user)
            {
               this.alfLog("error", "A request was made to join a site but no user was specified", config);
            }
         }
      },

      /**
       * This function is called when a user successfully joins a site.
       *
       * @instance
       * @param {object} response The response from the XHR request to join the site.
       * @param {object} originalRequestConfig The original configuration passed when the request was made.
       * @fires module:alfresco/core/topics#DISPLAY_NOTIFICATION
       */
      siteJoined: function alfresco_services_SiteService__siteJoined(response, originalRequestConfig) {
         this.alfLog("log", "User has successfully joined a site", response, originalRequestConfig);
         this.alfServicePublish(topics.DISPLAY_NOTIFICATION, {
            message: this.message("message.joining", {
               "0": originalRequestConfig.user,
               "1": originalRequestConfig.site
            }),
            publishTopic: "ALF_RELOAD_PAGE"
         });
      },

      /**
       * This method delegates site creation to the legacy YUI popup.
       *
       * @instance
       * @param {string} site
       */
      createSite: function alfresco_services_SiteService__editSite(config) {
         // TODO: When an edit site request is received we should display the edit site dialog.
         //       We need to wrap the existing YUI widget in a Dojo object.
         this.alfLog("log", "A request has been made to create a site: ", config);

         // Just use the old YUI popup...
         if (Alfresco && Alfresco.module && typeof Alfresco.module.getCreateSiteInstance === "function")
         {
            Alfresco.module.getCreateSiteInstance().show();
         }
         else
         {
            this.alfLog("error", "Could not find the 'Alfresco.module.getCreateSiteInstance' function - has 'create-site.js' been included in the page?");
         }
      },

      /**
       * This method delegates site editing to the legacy YUI popup.
       *
       * @instance
       * @param {string} site
       */
      editSite: function alfresco_services_SiteService__editSite(config) {
         // TODO: When an edit site request is received we should display the edit site dialog.
         //       We need to wrap the existing YUI widget in a Dojo object.
         this.alfLog("log", "A request has been made to edit a site: ", config);

         // Just use the old YUI popup...
         if (Alfresco && Alfresco.module && typeof Alfresco.module.getEditSiteInstance === "function")
         {
            Alfresco.module.getEditSiteInstance().show({
               shortName: config.site
            });
         }
         else
         {
            this.alfLog("error", "Could not find the 'Alfresco.module.getEditSiteInstance' function - has 'edit-site.js' been included in the page?");
         }
      },

      /**
       * Handles a request to leave a site.
       *
       * @instance
       * @param {object} payload
       */
      leaveSiteRequest: function alfresco_services_SiteService__leaveSiteReqest(payload) {
         this.alfPublish("ALF_CREATE_DIALOG_REQUEST", {
            dialogId: "ALF_SITE_SERVICE_DIALOG",
            dialogTitle: this.message("message.leave", { "0": payload.siteTitle}),
            textContent: this.message("message.leave-site-prompt", { "0": payload.siteTitle}),
            widgetsButtons: [
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: this.message("button.leave-site.confirm-label"),
                     publishTopic: "ALF_LEAVE_SITE_CONFIRMATION",
                     publishPayload: payload,
                     additionalCssClasses: "call-to-action"
                  }
               },
               {
                  name: "alfresco/buttons/AlfButton",
                  config: {
                     label: this.message("button.leave-site.cancel-label"),
                     publishTopic: "ALF_LEAVE_SITE_CANCELLATION",
                     publishPayload: payload
                  }
               }
            ]
         });
      },

      /**
       *
       * @instance
       * @param {string} site The name of the site to leave
       * @param {string} user The name of the user to leave the site
       */
      leaveSite: function alfresco_services_SiteService__leaveSite(config) {
         if (config.site && config.user)
         {
            this.alfLog("log", "A request has been made for a user to leave a site: ", config);
            var url = AlfConstants.PROXY_URI + "api/sites/" + encodeURIComponent(config.site) + "/memberships/" + encodeURIComponent(config.user);
            this.serviceXhr({url : url,
                             method: "DELETE",
                             site: config.site,
                             siteTitle: config.siteTitle,
                             user: config.user,
                             userFullName: config.userFullName,
                             successCallback: this.siteLeft,
                             failureCallback: this.siteLeftFailure,
                             callbackScope: this});
         }
         else
         {
            // Handle error conditions...
            if (!config.site)
            {
               this.alfLog("error", "A request was made to leave a site but no site was specified", config);
            }
            if (!config.user)
            {
               this.alfLog("error", "A request was made to leave a site but no user was specified", config);
            }
         }
      },

      /**
       * This function is called when a user has successfully left a site.
       *
       * @instance
       * @param {object} response The response from the XHR request to leave the site.
       * @param {object} originalRequestConfig The original configuration passed when the request was made.
       */
      siteLeft: function alfresco_services_SiteService__siteLeft(response, originalRequestConfig) {
         this.alfLog("log", "User has successfully left a site", response, originalRequestConfig);
         this.displayMessage(this.message("message.leaving", {"0": originalRequestConfig.userFullName, "1": originalRequestConfig.siteTitle}));
         this.alfPublish("ALF_SITE_LEFT", { site: originalRequestConfig.site, user: originalRequestConfig.user});
         this.leaveSiteSuccess(response, originalRequestConfig);
      },

      /**
       * This function is called when a user has failued to leave a site.
       *
       * @instance
       * @param {object} response The response from the XHR request to leave the site.
       * @param {object} originalRequestConfig The original configuration passed when the request was made.
       */
      siteLeftFailure: function alfresco_services_SiteService__siteLeftFailure(response, originalRequestConfig) {
         this.alfLog("log", "User has failed to leave a site", response, originalRequestConfig);
         this.displayMessage(this.message("message.leave-failure", {"0": originalRequestConfig.userFullName, "1": originalRequestConfig.siteTitle}));
      },

      /**
       * This is a catch all success handler for both the join site and become site manager. It simply reloads
       * the current page. It is ** INCORRECTLY ** assumed that the current user will always be on the site
       * referenced in the request. This method needs to be updated accordingly.
       *
       * @instance
       * @fires module:alfresco/core/topics#RELOAD_PAGE
       */
      reloadPage: function alfresco_services_SiteService__reloadPage(response, requestConfig) {
         /*jshint unused:false*/
         // TODO: Check user in request is current user and that site in request is current site
         this.alfPublish(topics.RELOAD_PAGE);
      },

      /**
       * This is a method that reloads DocList data
       *
       * @instance
       * @fires module:alfresco/core/topics#RELOAD_DATA_TOPIC
       */
      reloadData: function alfresco_services_SiteService__reloadData(response, requestConfig) {
         /*jshint unused:false*/
         this.alfPublish(topics.RELOAD_DATA_TOPIC);
      },

      /**
       * When a request is made for a user to leave a site we should determine whether or not the current user is the
       * user removed and whether or not they are currently viewing that site. If they are then we should navigate
       * them away from the site and back to their dashboard.
       *
       * In a future where notifications are generated based on events generated by other users, this would mean
       * that a user can be immediately ejected from a site as soon as they are removed from it (e.g. A Site Manager
       * removes a user from a site and if that user is viewing the site they are "ejected").
       *
       * @instance
       */
      leaveSiteSuccess: function alfresco_services_SiteService__leaveSiteSuccess(response, requestConfig) {
         this.alfServicePublish("ALF_NAVIGATE_TO_PAGE", {
            url: "user/" + encodeURIComponent(requestConfig.user) + this.userHomePage.replace(/^\/*/, "/"),
            type: urlTypes.PAGE_RELATIVE,
            target: "CURRENT"
         });
      },

      /**
       * Handles requests to retrieve the current users list of recently visited sites.
       *
       * @instance
       * @param {object} payload
       */
      getRecentSites: function alfresco_services_SiteService__getRecentSites(payload) {
         var url = AlfConstants.PROXY_URI + "api/people/" + AlfConstants.USERNAME + "/sites/recent";
         if (this.currentSite)
         {
            url = url + "/site/" + this.currentSite;
         }
         var alfTopic = payload.alfResponseTopic || "ALF_GET_RECENT_SITES";
         var config = {
            alfTopic: alfTopic,
            url: url,
            method: "GET",
            callbackScope: this
         };
         this.serviceXhr(config);
      },

      /**
       * Handles requests to retrieve the current users list of favourite sites.
       *
       * @instance
       * @param {object} payload
       */
      getFavouriteSites: function alfresco_services_SiteService__getFavouriteSites(payload) {
         var url = AlfConstants.PROXY_URI + "api/people/" + AlfConstants.USERNAME + "/sites/favourites";
         if (this.currentSite)
         {
            url = url + "/site/" + this.currentSite;
         }
         var alfTopic = payload.alfResponseTopic || "ALF_GET_FAVOURITE_SITES";
         var config = {
            alfTopic: alfTopic,
            url: url,
            method: "GET",
            callbackScope: this
         };
         this.serviceXhr(config);
      }
   });
});