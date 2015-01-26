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
 * @module alfresco/services/PreferenceService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/services/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang",
        "service/constants/Default"],
        function(declare, AlfCore, CoreXhr, _PreferenceServiceTopicMixin, _AlfDocumentListTopicMixin, lang, AlfConstants) {
   
   return declare([AlfCore, CoreXhr, _PreferenceServiceTopicMixin, _AlfDocumentListTopicMixin], {
      
      /**
       * Declare the dependencies on "legacy" JS files that this is wrapping.
       * @instance
       * @type {string[]}
       * @default ["/js/alfresco.js"],
       */
      nonAmdDependencies: ["/js/yui-common.js",
                           "/js/alfresco.js"],
      
      /**
       * A reference to the wrapped YUI implemented preferences service.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      _wrappedService: null,
      
      /**
       * Sets up the subscriptions for the PreferenceService
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_PreferenceService__constructor(args) {

         lang.mixin(this, args);
         
         // The preference service currently wraps the existing YUI defined service. The constructor
         // protects against the code for that wrapped service not being available. At some stage
         // in the future the old preferences service will need to be replaced with a new version
         // to avoid the wrapping step...
         if (Alfresco && Alfresco.service && typeof Alfresco.service.Preferences === "function")
         {
            this._wrappedService = new Alfresco.service.Preferences();

            // It's currently only worth subscribing to the events to capture preferences for if
            // there is a preferences service to post them to!!
            this.alfSubscribe(this.getPreferenceTopic, lang.hitch(this, this.getPreference));
            this.alfSubscribe(this.setPreferenceTopic, lang.hitch(this, this.setPreference));
            
            this.alfSubscribe(this.showFoldersTopic, lang.hitch(this, this.onShowFolders));
            this.alfSubscribe(this.showPathTopic, lang.hitch(this, this.onShowPath));
            this.alfSubscribe(this.showSidebarTopic, lang.hitch(this, this.onShowSidebar));
            this.alfSubscribe(this.viewSelectionTopic, lang.hitch(this, this.onViewSelection));
            this.alfSubscribe(this.addFavouriteDocumentTopic, lang.hitch(this, this.onAddFavouriteDocument));
            this.alfSubscribe(this.removeFavouriteDocumentTopic, lang.hitch(this, this.onRemoveFavouriteDocument));
            
            // There are other preferences that are currently handled by the wrapped DocumentList that
            // will need to be added here when a new DocumentList is created that replaces the wrapped
            // version.
         }
      },
      
      /**
       * The preferences provided at services instantiation.
       * @instance
       * @type {object} 
       * @default null
       */
      localPreferences: null,
      
      /**
       * Retrieves a preference from the [local copy]{@link module:alfresco/services/PreferenceService#localPreferences} rather than 
       * getting them remotely.
       * 
       * @instance
       * @param {{callback: function, callbackScope: object, preference: string}} payload
       */
      getPreference: function alfresco_services_PreferenceService__getPreference(payload) {
         if (!lang.exists("callback", payload) || 
             typeof payload.callback !== "function" || 
             !lang.exists("callbackScope", payload))
         {
            this.alfLog("warn", "A request was made to get a preference, but the callback information was missing", payload);
         }
         else if (!lang.exists("preference", payload))
         {
            this.alfLog("warn", "A request was made to get a preference, but no 'preference' attribute was provided", payload);
         }
         else
         {
            // Get the preference from the local store.
            payload.callback.apply(payload.callbackScope, [lang.getObject(payload.preference, false, this.localPreferences)]);
         }
      },
      
      /**
       * Sets a preference remotely.
       * 
       * @instance
       * @param {{preference: string, value: object} payload
       */
      setPreference: function alfresco_services_PreferenceService__setPreference(payload) {
         if (!lang.exists("preference", payload))
         {
            this.alfLog("warn", "A request was made to set a preference, but no 'preference' attribute was provided", payload);
         }
         else if (!lang.exists("value", payload))
         {
            this.alfLog("warn", "A request was made to set a preference, but no 'value' attribute was provided", payload);
         }
         else if (lang.getObject(payload.preference, false, this.localPreferences) == payload.value)
         {
            // Don't save a preference if it hasn't changed...
            this.alfLog("log", "Intentionally not saving a preference that hasn't changed");
         }
         else
         {
            // Set users preference url...
            var _this = this,
                url = AlfConstants.PROXY_URI + "api/people/" + encodeURIComponent(AlfConstants.USERNAME) + "/preferences";
            
            // Set the remote preference...
            var preferenceObj = {};
            lang.setObject(payload.preference, payload.value, preferenceObj);
            this.serviceXhr({url : url,
                             data: preferenceObj,
                             method: "POST"});
            
            // Set the local preference...
            lang.setObject(payload.preference, payload.value, this.localPreferences);
         }
      },
      
      /**
       * Updates the current users preference for seeing folders in the Document List
       * @instance
       * @param {object} payload 
       */
      onShowFolders: function alfresco_services_PreferenceService__onShowFolders(payload) {
         if (payload && payload.selected != null)
         {
            this.setPreference({
               preference: "org.alfresco.share.documentList.showFolders",
               value: payload.selected
            });
         } 
      },
      
      /**
       * Updates the current users preference for seeing the current path in the Document List
       * 
       * @instance
       * @param {object} payload 
       */
      onShowPath: function alfresco_services_PreferenceService__onShowPath(payload) {
         if (payload && payload.selected != null)
         {
            this.setPreference({
               preference: "org.alfresco.share.documentList.hideNavBar",
               value: !payload.selected
            });
         } 
      },
      
      /**
       * Updates the current users preference for viewing the sidebar next with the Document List
       * 
       * @instance
       * @param {object} payload 
       */
      onShowSidebar: function alfresco_services_PreferenceService__onShowSidebar(payload) {
         if (payload && payload.selected != null)
         {
            this.setPreference({
               preference: "org.alfresco.share.documentList.showSidebar",
               value: payload.selected
            });
         } 
      },
      
      /**
       * Updates the current users preferred view for Document Lists. However, this will NOT set
       * a view preference if the view provided is "Abstract".
       * 
       * @instance
       * @param {object} payload
       */
      onViewSelection: function alfresco_services_PreferenceService__onViewSelection(payload) {
         if (payload && payload.value != null && payload.value !== "Abstract")
         {
            var preference = (payload.preference != null) ? payload.preference : "org.alfresco.share.documentList.viewRendererName";
            this.setPreference({
               preference: preference,
               value: payload.value
            });
         }
      },
      
      /* IMPLEMENTATION NOTES:
       *    It would have been preferential to not wrap the existing preference service. However, due to the 
       * way in which documents/folders are made favourites (e.g. as a comma separated string as opposed to
       * a more easily managed JSON structure) it was prudent to use the existing code. Hopefully at some point
       * in the future when document favourites are maintained as a JSON structure this can be updated. 
       */
      
      /**
       * Makes the supplied node a favourite of the requesting user
       * 
       * @instance
       * @param {object} payload
       */
      onAddFavouriteDocument: function alfresco_services_PreferenceService__onAddFavouriteDocument(payload) {
         var alfTopic = (payload.alfResponseTopic != null) ? payload.alfResponseTopic : this.onAddFavouriteDocument;
         var jsNode = lang.getObject("node.jsNode", false, payload);
         if (jsNode)
         {
            var responseConfig =
            {
               successCallback: {
                  fn: this.onAddFavouriteDocumentSuccess,
                  scope: this,
                  obj: payload,
                  alfTopic: alfTopic
               },
               failureCallback: {
                  fn: this.onAddFavouriteDocumentFailure,
                  scope: this,
                  obj: payload,
                  alfTopic: alfTopic
               }
            };
            var prefKey = jsNode.isContainer ? Alfresco.service.Preferences.FAVOURITE_FOLDERS : Alfresco.service.Preferences.FAVOURITE_DOCUMENTS;
            this._wrappedService.add(prefKey, jsNode.nodeRef.nodeRef, responseConfig);
         }
      },
      
      /**
       * Removes the supplied node from being a favourite.
       * 
       * @instance
       * @param {object} payload
       */
      onRemoveFavouriteDocument: function alfresco_services_PreferenceService__onRemoveFavouriteDocument(payload) {
         var alfTopic = (payload.alfResponseTopic != null) ? payload.alfResponseTopic : this.onRemoveFavouriteDocument;
         var jsNode = lang.getObject("node.jsNode", false, payload);
         if (jsNode)
         {
            var responseConfig =
            {
               successCallback: {
                  fn: this.onRemoveFavouriteDocumentSuccess,
                  scope: this,
                  obj: payload,
                  alfTopic: alfTopic
               },
               failureCallback: {
                  fn: this.onRemoveFavouriteDocumentFailure,
                  scope: this,
                  obj: payload,
                  alfTopic: alfTopic
               }
            };
            var prefKey = jsNode.isContainer ? Alfresco.service.Preferences.FAVOURITE_FOLDERS : Alfresco.service.Preferences.FAVOURITE_DOCUMENTS;
            this._wrappedService.remove(prefKey, jsNode.nodeRef.nodeRef, responseConfig);
         }
      },
      
      /**
       * This handles successfully completed requests to add a Favourite.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      onAddFavouriteDocumentSuccess: function alfresco_services_PreferenceService__onAddFavouriteSuccess(response, originalRequestConfig) {
         this.alfLog("log", "Successfully favourited a document", response, originalRequestConfig);
         this.alfPublish(originalRequestConfig.alfResponseTopic + "_SUCCESS", {
            response: response,
            requestConfig: originalRequestConfig
         });
      },
      
      /**
       * This handles unsuccessful requests to add a Favourite.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      onAddFavouriteDocumentFailure: function alfresco_services_PreferenceService__onAddFavouriteFailure(response, originalRequestConfig) {
         this.alfLog("error", "Failed to favourite a document", response, originalRequestConfig);
         this.alfPublish(originalRequestConfig.alfResponseTopic + "_FAILURE", {
            response: response,
            requestConfig: originalRequestConfig
         });
      },
      
      /**
       * This handles successfully completed requests to remove a Favourite.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      onRemoveFavouriteDocumentSuccess: function alfresco_services_PreferenceService__onRemoveFavouriteSuccess(response, originalRequestConfig) {
         this.alfLog("log", "Successfully removed a document favourite", response, originalRequestConfig);
         this.alfPublish(originalRequestConfig.alfResponseTopic + "_SUCCESS", {
            response: response,
            requestConfig: originalRequestConfig
         });
      },
      
      /**
       * This handles unsuccessful requests to remove a Favourite.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      onRemoveFavouriteDocumentFailure: function alfresco_services_PreferenceService__onRemoveFavouriteDocumentFailure(response, originalRequestConfig) {
         this.alfLog("error", "Failed to remove a document favourite", response, originalRequestConfig);
         this.alfPublish(originalRequestConfig.alfResponseTopic + "_FAILURE", {
            response: response,
            requestConfig: originalRequestConfig
         });
      }
   });
});