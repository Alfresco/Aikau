/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 * This service provides access to user preferences as a whole as well as subscribing to specific topics
 * for setting Document Library preferences (views, sidebar visibility/width, breadcrumb visibility, etc) and
 * adding and removing documents or folders from a the users favourites list.
 * 
 * @module alfresco/services/PreferenceService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/services/_PreferenceServiceTopicMixin
 * @mixes module:alfresco/services/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/core/topics",
        "dojo/_base/lang",
        "service/constants/Default",
        "alfresco/core/ArrayUtils",
        "dojo/Deferred",
        "dojo/when",
        "jquery"],
        function(declare, BaseService, CoreXhr, _PreferenceServiceTopicMixin, _AlfDocumentListTopicMixin, topics, lang, 
                 AlfConstants, ArrayUtils, Deferred, when, $) {
   
   return declare([BaseService, CoreXhr, _PreferenceServiceTopicMixin, _AlfDocumentListTopicMixin], {
      
      /**
       * This is the dot-notation preferences property address for favourite documents
       *
       * @instance
       * @type {string}
       * @default
       */
      FAVOURITE_DOCUMENTS: "org.alfresco.share.documents.favourites",

      /**
       * This is the dot-notation preferences property address for favourite folders
       *
       * @instance
       * @type {string}
       * @default
       */
      FAVOURITE_FOLDERS: "org.alfresco.share.folders.favourites",
      
      /**
       * Sets up the subscriptions for the PreferenceService
       * 
       * @instance
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_PreferenceService__registerSubscriptions() {
         this.alfSubscribe(topics.GET_PREFERENCE, lang.hitch(this, this.getPreference));
         this.alfSubscribe(topics.SET_PREFERENCE, lang.hitch(this, this.setPreference));
         this.alfSubscribe(this.showFoldersTopic, lang.hitch(this, this.onShowFolders));
         this.alfSubscribe(this.showPathTopic, lang.hitch(this, this.onShowPath));
         this.alfSubscribe(this.viewSelectionTopic, lang.hitch(this, this.onViewSelection));
         this.alfSubscribe(this.addFavouriteDocumentTopic, lang.hitch(this, this.onAddFavouriteDocument));
         this.alfSubscribe(this.removeFavouriteDocumentTopic, lang.hitch(this, this.onRemoveFavouriteDocument));

         // Load the user preferences...
         this._preferencesLoaded = new Deferred();
         var url = AlfConstants.PROXY_URI + "api/people/" + encodeURIComponent(AlfConstants.USERNAME) + "/preferences";
         this.serviceXhr({url : url,
                          successCallback: function(response) {
                              this._preferencesLoaded.resolve(response);
                          },
                          callbackScope: this,
                          method: "GET"});
      },
      
      /**
       * The preferences provided at services instantiation.
       * 
       * @instance
       * @type {object} 
       * @default
       */
      localPreferences: null,
      
      /**
       * Retrieves a preference from the [local copy]{@link module:alfresco/services/PreferenceService#localPreferences} rather than 
       * getting them remotely.
       * 
       * @instance
       * @param {object} payload
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
            when(this._preferencesLoaded, lang.hitch(this, this.setLocalPreferences, payload));
         }
      },

      /**
       * Sets the local copy of the preferences onces they've been retrieved from the Repository.
       * 
       * @param {object} payload The payload from the original request to get preferences
       * @param {object} preferences The retrieved preferences object
       */
      setLocalPreferences: function alfresco_services_PreferenceService__setLocalPreferences(payload, preferences) {
         this.localPreferences = preferences;
         payload.callback.apply(payload.callbackScope, [lang.getObject(payload.preference, false, this.localPreferences)]);
      },
      
      /**
       * Sets a preference remotely.
       * 
       * @instance
       * @param {object} payload
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
         else if (lang.getObject(payload.preference, false, this.localPreferences) === payload.value)
         {
            // Don't save a preference if it hasn't changed...
            this.alfLog("log", "Intentionally not saving a preference that hasn't changed");
         }
         else
         {
            // Set users preference url...
            var url = AlfConstants.PROXY_URI + "api/people/" + encodeURIComponent(AlfConstants.USERNAME) + "/preferences";
            
            // Set the remote preference...
            var preferenceObj = {};
            lang.setObject(payload.preference, payload.value, preferenceObj);
            var responseTopic = payload.alfTopic;
            if (payload.alfResponseTopic)
            {
               responseTopic = payload.alfResponseTopic;
            }
            this.serviceXhr({url : url,
                             alfTopic: responseTopic,
                             data: preferenceObj,
                             method: "POST"});

            // Set the local preference...
            when(this._preferencesLoaded, function(preferences) {
               this.localPreferences = preferences;
               lang.setObject(payload.preference, payload.value, this.localPreferences);
            });
         }
      },

      /**
       * This is the success callback for retrieving preferences. If a name and value are included then
       * the preferences will be updated.
       *
       * @instance
       * @param {object} response The object returned from the successful XHR request
       * @param {object} requestConfig The original configuration passed when the request was made
       */
      onPreferenceRetrieved: function alfresco_services_PreferenceService__onPreferenceRetrieved(response, requestConfig) {
         if (response && requestConfig.data && requestConfig.data.name && requestConfig.data.value)
         {
            var name = requestConfig.data.name;
            var value = requestConfig.data.value;
            var preferences = {};
            lang.setObject(name, value, preferences);
            $.extend(true, preferences, response);
            var values = lang.getObject(name, false, preferences);
            
            // Parse string to array, add the value and convert to string again
            if (typeof values === "string" || values === null)
            {
               var arrValues = values ? values.split(",") : [];

               if (requestConfig.data.add === true)
               {
                  arrValues.push(value);
               }
               else
               {
                  ArrayUtils.arrayRemove(arrValues, value);
               }
               
               // Save preference with the new value
               this.setPreference({
                  alfTopic: requestConfig.data.alfTopic,
                  preference: name, 
                  value: arrValues.join(",")
               });
            }
         }
      },

      /**
       * This is the failure callback for retrieving preferences
       *
       * @instance
       * @param {object} response The object returned from the successful XHR request
       * @param {object} requestConfig The original configuration passed when the request was made
       */
      onPreferenceRetrievalFail: function alfresco_services_PreferenceService__onPreferenceRetrieved(response, requestConfig) {
         if (requestConfig.data && requestConfig.data.alfTopic)
         {
            this.alfPublish(requestConfig.data.alfTopic + "_FAILURE", {});
         }
      },

      /**
       * This function updates and existing preference where that preference is intended to be an array
       * of items. In order to perform the update the existing preferences must be retrieved and then the
       * preference can be added or removed depending on the supplied mode.
       * 
       * @instance
       * @param {object} payload The details of the preference to add
       * @param {boolean} add Indicates whether or not the update is to add or remove a preference
       */
      update: function alfresco_services_PreferenceService__update(payload, add) {
         if (payload.name && payload.value)
         {
            var url = AlfConstants.PROXY_URI + "api/people/" + encodeURIComponent(AlfConstants.USERNAME) + "/preferences" + (name ? "?pf=" + name : "");
            this.serviceXhr({
               url: url,
               method: "GET",
               data: {
                  name: payload.name,
                  value: payload.value,
                  alfTopic: payload.alfTopic,
                  add: add
               },
               successCallback: this.onPreferenceRetrieved,
               failureCallback: this.onPreferenceRetrievalFail,
               callbackScope: this
            });
         }
         else
         {
            this.alfLog("warn", "A request was made to add a preference but either the preference name or value was missing from the payload", payload, this);
         }
      },
      
      /**
       * Updates the current users preference for seeing folders in the Document List
       * @instance
       * @param {object} payload 
       */
      onShowFolders: function alfresco_services_PreferenceService__onShowFolders(payload) {
         if (payload && (payload.selected || payload.selected === false))
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
         if (payload && (payload.selected || payload.selected === false))
         {
            this.setPreference({
               preference: "org.alfresco.share.documentList.hideNavBar",
               value: !payload.selected
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
         if (payload && payload.value && payload.value !== "Abstract")
         {
            var preference = payload.preference || "org.alfresco.share.documentList.viewRendererName";
            this.setPreference({
               preference: preference,
               value: payload.value
            });
         }
      },
      
      /**
       * Makes the supplied node a favourite of the requesting user
       * 
       * @instance
       * @param {object} payload
       */
      onAddFavouriteDocument: function alfresco_services_PreferenceService__onAddFavouriteDocument(payload) {
         var alfTopic = payload.alfResponseTopic || this.onAddFavouriteDocument;
         var jsNode = lang.getObject("node.jsNode", false, payload);
         if (jsNode)
         {
            var prefKey = jsNode.isContainer ? this.FAVOURITE_FOLDERS : this.FAVOURITE_DOCUMENTS;
            this.update({
               name: prefKey,
               value: jsNode.nodeRef.nodeRef,
               alfTopic: alfTopic
            }, true);
         }
      },
      
      /**
       * Removes the supplied node from being a favourite.
       * 
       * @instance
       * @param {object} payload
       */
      onRemoveFavouriteDocument: function alfresco_services_PreferenceService__onRemoveFavouriteDocument(payload) {
         var alfTopic = payload.alfResponseTopic || this.onRemoveFavouriteDocument;
         var jsNode = lang.getObject("node.jsNode", false, payload);
         if (jsNode)
         {
            var prefKey = jsNode.isContainer ? this.FAVOURITE_FOLDERS : this.FAVOURITE_DOCUMENTS;
            this.update({
               name: prefKey,
               value: jsNode.nodeRef.nodeRef,
               alfTopic: alfTopic
            }, false);
         }
      }
   });
});