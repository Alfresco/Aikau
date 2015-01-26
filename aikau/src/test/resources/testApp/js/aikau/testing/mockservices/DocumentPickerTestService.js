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
 * @module aikauTesting/mockservices/DocumentPickerTestService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/json",
        "dojo/text!./responseTemplates/DocumentPickerTest/RecentSites.json",
        "dojo/text!./responseTemplates/DocumentPickerTest/FavouriteSites.json"],
        function(declare, AlfCore, AlfConstants, lang, dojoJson, recentSites, favouriteSites) {
   
   return declare([AlfCore], {
      
      /**
       *
       * 
       * @instance 
       * @param {array} args The constructor arguments.
       */
      constructor: function alfresco_testing_mockservices_DocumentPickerTestService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_RETRIEVE_DOCUMENTS_REQUEST", lang.hitch(this, "onRetrieveDocumentsRequest"));
         this.alfSubscribe("ALF_GET_RECENT_SITES", lang.hitch(this, "getRecentSites"));
         this.alfSubscribe("ALF_GET_FAVOURITE_SITES", lang.hitch(this, "getFavouriteSites"));

      },

      /**
       * @instance
       */
      onRetrieveDocumentsRequest: function alfresco_testing_mockservices_DocumentPickerTestService__onRetrieveDocumentsRequest(payload) {
         var _this = this;
         var alfTopic = (payload.alfResponseTopic != null) ? (payload.alfResponseTopic + "_SUCCESS") : "ALF_RETRIEVE_DOCUMENTS_REQUEST_SUCCESS";
         // var alfTopic = payload.alfResponseTopic + "_SUCCESS";
         var template = payload.nodeRef.replace(/\//g, "_").replace(/:/g, "");
         var url = dojo.moduleUrl("aikauTesting/mockservices/responseTemplates/DocumentPickerTest/" + template).slice(0, -1) + ".json";
         require(["dojo/text!" + url], function(responseTemplate) {
            _this.alfPublish(alfTopic, {
               response: dojoJson.parse(responseTemplate)
            });
         });
      },
      
      /**
       * Handles requests to retrieve the current users list of recently visited sites.
       *
       * @instance
       * @param {object} payload
       */
      getRecentSites: function alfresco_testing_mockservices_DocumentPickerTestService__getRecentSites(payload) {
         var alfTopic = payload.alfResponseTopic + "_SUCCESS";
         this.alfPublish(alfTopic, {
            response: dojoJson.parse(recentSites)
         });
      },

      /**
       * Handles requests to retrieve the current users list of favourite sites.
       *
       * @instance
       * @param {object} payload
       */
      getFavouriteSites: function alfresco_testing_mockservices_DocumentPickerTestService__getFavouriteSites(payload) {
         var alfTopic = payload.alfResponseTopic + "_SUCCESS";
         this.alfPublish(alfTopic, {
            response: dojoJson.parse(favouriteSites)
         });
      }
   });
});
