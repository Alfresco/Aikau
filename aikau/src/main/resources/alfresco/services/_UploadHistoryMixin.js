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
 * This mixin acts to group the upload-history handling of the [UploadService]{@link module:alfresco/services/UploadService}.
 * 
 * @module alfresco/services/_UploadHistoryMixin
 * @author Martin Doyle
 * @since 1.0.51
 */
define(["dojo/_base/declare", 
        "alfresco/core/topics", 
        "dojo/_base/array"], 
        function(declare, topics, array) {

   return declare(null, {

      /**
       * This will be populated with the NodeRefs of the last few locations that the user has previously
       * uploaded to. The number of NodeRefs that are stored are determined by the 
       * [historySize]{@link module:alfresco/services/_UploadHistoryMixin#historySize}.
       * 
       * @instance
       * @type {string[]}
       * @default
       */
      history: null,

      /**
       * The preference name to use for storing and retrieving upload location history.
       * In order for this preference to be used it will also be necessary to ensure that the 
       * [PreferenceService]{@link module:alfresco/services/PreferenceService} is included on the page.
       * 
       * @instance
       * @type {string}
       * @default
       */
      historyPreferenceName: "org.alfresco.share.upload.destination.history",

      /**
       * The number of nodes previously uploaded to that should be stored in the user preferences as their 
       * upload history. This defaults to 3 but can be overridden through configuration if required.
       *
       * @instance
       * @type {number}
       * @default
       */
      historySize: 3,

      /**
       * Constructor
       *
       * @instance
       */
      constructor: function alfresco_services_FileUploadService__constructor() {
         this.initHistory();
      },

      /**
       * Initialise the upload-history
       * 
       * @instance
       * @fires module:alfresco/core/topics#GET_PREFERENCE
       */
      initHistory: function alfresco_services_FileUploadService__initHistory() {
         this.history = [];
         this.alfPublish(topics.GET_PREFERENCE, {
            preference: this.historyPreferenceName,
            callback: this.setHistory,
            callbackScope: this
         });
      },

      /**
       * Set the current history.
       * 
       * @instance
       * @param {string} value The preference value containing the nodeRefs last uploaded to
       */
      setHistory: function alfresco_services_FileUploadService__setHistory(value) {
         this.history = value && value.split(",");
      },

      /**
       * This updates the [upload history]{@link module:alfresco/services/FileUploadService#history}
       * with the supplied NodeRef. If the NodeRef is already in the history then it will not be added
       * again, but will be re-ordered to be at the beginning of the history. If the history already
       * contains the [maximum number of entries]{@link module:alfresco/services/_UploadHistoryMixin#historySize}
       * then the earliest used NodeRef in the history will be removed and the latest added.
       *
       * @instance
       * @param {string} nodeRef The NodeRef to add to the upload history
       * @fires module:alfresco/core/topics#SET_PREFERENCE
       */
      updateHistory: function alfresco_services_FileUploadService__updateHistory(nodeRef) {

         // Iterate over the previous upload history and if the NodeRef being uploaded to already
         // exists in the history then move it to the first element.
         var alreadyInHistory = false,
            processedHistory = [];
         array.forEach(this.history, function(entry) {
            if (entry === nodeRef) {
               processedHistory.unshift(entry);
               alreadyInHistory = true;
            } else {
               processedHistory.push(entry);
            }
         });
         this.history = processedHistory;

         // Add to the history (dropping one off the end if necessary)
         if (!alreadyInHistory) {
            if (this.history.length === this.historySize) {
               this.history.pop();
            }
            this.history.unshift(nodeRef);
         }

         // Always update the latest history, even if no new NodeRef has
         // been added as it may have been re-ordered
         this.alfPublish(topics.SET_PREFERENCE, {
            preference: this.historyPreferenceName,
            value: this.history.join(",")
         });
      }
   });
});
