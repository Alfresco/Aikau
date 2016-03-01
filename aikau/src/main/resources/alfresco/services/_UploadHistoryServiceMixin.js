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
 * This mixin acts to group the upload-history handling of the [FileUploadService]{@link module:alfresco/services/FileUploadService}.
 * 
 * @module alfresco/services/_UploadHistoryServiceMixin
 * @author Martin Doyle
 * @since 1.0.52
 */
define(["dojo/_base/declare", 
        "alfresco/core/topics", 
        "dojo/_base/array"], 
        function(declare, topics, array) {

   return declare(null, {

      /**
       * This will be populated with the NodeRefs of the last few locations that the user has previously
       * uploaded to. The number of NodeRefs that are stored are determined by the 
       * [uploadHistorySize]{@link module:alfresco/services/_UploadHistoryServiceMixin#uploadHistorySize}.
       * 
       * @instance
       * @type {string[]}
       * @default
       */
      uploadHistory: null,

      /**
       * The preference name to use for storing and retrieving upload location history.
       * In order for this preference to be used it will also be necessary to ensure that the 
       * [PreferenceService]{@link module:alfresco/services/PreferenceService} is included on the page.
       * 
       * @instance
       * @type {string}
       * @default
       */
      uploadHistoryPreferenceName: "org.alfresco.share.upload.destination.history",

      /**
       * The number of nodes previously uploaded to that should be stored in the user preferences as their 
       * upload history. This defaults to 3 but can be overridden through configuration if required.
       *
       * @instance
       * @type {number}
       * @default
       */
      uploadHistorySize: 3,

      /**
       * If a service needs to act upon its post-mixed-in state before registering subscriptions then
       * this is where it should be done. It is comparable to postMixInProperties in a widget in the
       * class lifecycle.
       *
       * @instance
       * @override
       */
      initService: function alfresco_services_FileUploadService__initService() {
         this.inherited(arguments);
         this.initUploadHistory();
      },

      /**
       * Initialise the upload-history
       * 
       * @instance
       * @fires module:alfresco/core/topics#GET_PREFERENCE
       */
      initUploadHistory: function alfresco_services__UploadHistoryServiceMixin__initUploadHistory() {
         this.uploadHistory = [];
         this.alfServicePublish(topics.GET_PREFERENCE, {
            preference: this.uploadHistoryPreferenceName,
            callback: this.setUploadHistory,
            callbackScope: this
         });
      },

      /**
       * Set the current history.
       * 
       * @instance
       * @param {string} value The preference value containing the nodeRefs last uploaded to
       */
      setUploadHistory: function alfresco_services__UploadHistoryServiceMixin__setUploadHistory(value) {
         this.uploadHistory = value && value.split(",");
      },

      /**
       * This updates the [upload history]{@link module:alfresco/services/FileUploadService#history}
       * with the supplied NodeRef. If the NodeRef is already in the history then it will not be added
       * again, but will be re-ordered to be at the beginning of the history. If the history already
       * contains the [maximum number of entries]{@link module:alfresco/services/_UploadHistoryServiceMixin#uploadHistorySize}
       * then the earliest used NodeRef in the history will be removed and the latest added.
       *
       * @instance
       * @param {string} nodeRef The NodeRef to add to the upload history
       * @fires module:alfresco/core/topics#SET_PREFERENCE
       */
      updateUploadHistory: function alfresco_services__UploadHistoryServiceMixin__updateUploadHistory(nodeRef) {

         // Iterate over the previous upload history and if the NodeRef being uploaded to already
         // exists in the history then move it to the first element.
         var alreadyInHistory = false,
            processedHistory = [];
         array.forEach(this.uploadHistory, function(entry) {
            if (entry === nodeRef) {
               processedHistory.unshift(entry);
               alreadyInHistory = true;
            } else {
               processedHistory.push(entry);
            }
         });
         this.uploadHistory = processedHistory;

         // Add to the history (dropping one off the end if necessary)
         if (!alreadyInHistory) {
            if (this.uploadHistory.length === this.uploadHistorySize) {
               this.uploadHistory.pop();
            }
            this.uploadHistory.unshift(nodeRef);
         }

         // Always update the latest history, even if no new NodeRef has
         // been added as it may have been re-ordered
         this.alfServicePublish(topics.SET_PREFERENCE, {
            preference: this.uploadHistoryPreferenceName,
            value: this.uploadHistory.join(",")
         });
      }
   });
});
