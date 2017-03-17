/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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

define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "alfresco/core/topics",
        "dojo/_base/lang"],
        function(declare, BaseService, topics, lang) {
   
   return declare([BaseService], {
      
      /**
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      
      registerSubscriptions: function alfresco_testing_mockservices_MockPreferenceService__registerSubscriptions(args) {
         lang.mixin(this, args);
         this.alfSubscribe(topics.GET_PREFERENCE, lang.hitch(this, this.onGetPreference));
         this.alfSubscribe(topics.SET_PREFERENCE, lang.hitch(this, this.onSetPreference));
      },

      /**
       *
       * @instance
       * @param {object} payload The payload defining the document to retrieve the details for.
       */
      onGetPreference: function alfresco_testing_mockservices_MockPreferenceService__onGetPreference(payload) {
         switch (payload.preference) {
            case "org.alfresco.share.documentList.galleryColumns": 
               payload.callback.apply(payload.callbackScope, [3]);
               break;

            case "org.alfresco.share.searchList.galleryColumns": 
               payload.callback.apply(payload.callbackScope, [7]);
               break;

            case "org.alfresco.share.no.prefs": 
               payload.callback.apply(payload.callbackScope, [null]);
               break;

            default:
               // No action
               break;
         }
      },

      /**
       *
       * @instance
       * @param {object} payload The payload defining the document to retrieve the details for.
       */
      onSetPreference: function alfresco_testing_mockservices_MockPreferenceService__onGetPreference(/*jshint unused:false*/ payload) {
         
      }
   });
});