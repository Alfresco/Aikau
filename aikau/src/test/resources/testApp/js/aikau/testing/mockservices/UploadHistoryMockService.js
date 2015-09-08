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
 * @module aikauTesting/mockservices/UploadHistoryMockService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 * @since 1.0.34
 */
define(["alfresco/core/Core",
        "alfresco/core/topics",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/text!./responseTemplates/UploadHistory/Document.json"],
   function(AlfCore, topics, declare, lang, doc) {

      return declare([AlfCore], {

         /**
          * Set up the subscriptions to mock preferences for upload history
          *
          * @instance
          */
         constructor: function alfresco_testing_mockservices_UploadHistoryMockService__constructor() {
            this.alfSubscribe(topics.GET_PREFERENCE, lang.hitch(this, this.getPreference));
            this.alfSubscribe(topics.SET_PREFERENCE, lang.hitch(this, this.setPreference));
            this.alfSubscribe(topics.GET_DOCUMENT, lang.hitch(this, this.getDocument));
            this.uploadHistory = "";
         },

         /**
          * Return the upload history
          *
          * @instance
          */
         getPreference: function alfresco_testing_mockservices_UploadHistoryMockService__getPreference(payload) {
            if (payload.preference === "org.alfresco.share.upload.destination.history")
            {
               payload.callback.apply(payload.callbackScope, [this.uploadHistory]);
            }
         },

         /**
          * Set the upload history
          *
          * @instance
          */
         setPreference: function alfresco_testing_mockservices_UploadHistoryMockService__setPreference(payload) {
            if (payload.preference === "org.alfresco.share.upload.destination.history")
            {
               this.uploadHistory = payload.value;
            }
         },

         /**
          * 
          * @instance
          */
         getDocument: function alfresco_testing_mockservices_UploadHistoryMockService__getDocument(/*jshint unused:false*/ payload) {
            this.alfPublish(payload.alfResponseTopic + "_SUCCESS", {
               response: JSON.parse(doc)
            });
         }
      });
   });