/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * This service should be used in conjunction with the [Like renderer]{@link module:alfresco/renderers/Like}
 * to handle requests for liking and unliking nodes.
 *
 * @module alfresco/services/RatingsService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/services/_RatingsServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "alfresco/services/_RatingsServiceTopicMixin",
        "dojo/_base/lang",
        "service/constants/Default"],
        function(declare, AlfCore, CoreXhr, _RatingsServiceTopicMixin, lang, AlfConstants) {
   
   return declare([AlfCore, CoreXhr, _RatingsServiceTopicMixin], {
      
      /**
       * Sets up the subscriptions for the RatingsService
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_RatingsService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe(this.addRatingTopic, lang.hitch(this, this.onAddRating));
         this.alfSubscribe(this.removeRatingTopic, lang.hitch(this, this.onRemoveRating));
      },
      
      /**
       * Returns a URL for adding and removing ratings for a node.
       * 
       * @instance
       * @param {string} nodeRefUri The nodeRef URI fragment representation
       */
      getAddRatingsUrl: function alfresco_services_RatingsService__getRatingsUrl(nodeRefUri) {
         return AlfConstants.PROXY_URI + "api/node/" + nodeRefUri + "/ratings";
      },
      
      /**
       * Returns a URL for adding and removing ratings for a node.
       * 
       * @instance
       * @param {string} nodeRefUri The nodeRef URI fragment representation
       */
      getRemoveRatingsUrl: function alfresco_services_RatingsService__getRatingsUrl(nodeRefUri) {
         return AlfConstants.PROXY_URI + "api/node/" + nodeRefUri + "/ratings/likesRatingScheme";
      },
      
      /**
       * Adds a rating
       * 
       * @instance
       * @param {object} payload
       */
      onAddRating: function alfresco_services_RatingsService__onAddRating(payload) {
         var alfTopic = (payload.alfResponseTopic != null) ? payload.alfResponseTopic : this.addRatingTopic;
         var nodeRefUri = lang.getObject("node.jsNode.nodeRef.uri", false, payload);
         if (nodeRefUri)
         {
            var url = this.getAddRatingsUrl(nodeRefUri);
            var data = {
               rating: 1,
               ratingScheme: "likesRatingScheme"
            };
            
            this.serviceXhr({url : url,
                             alfTopic: alfTopic,
                             data: data,
                             method: "POST"});
         }
      },
      
      /**
       * Removes a rating
       * 
       * @instance
       * @param {object} payload
       */
      onRemoveRating: function alfresco_services_RatingsService__onRemoveRating(payload) {
         var alfTopic = (payload.alfResponseTopic != null) ? payload.alfResponseTopic : this.onRemoveRating;
         var nodeRefUri = lang.getObject("node.jsNode.nodeRef.uri", false, payload);
         if (nodeRefUri)
         {
            var url = this.getRemoveRatingsUrl(nodeRefUri);
            this.serviceXhr({url : url,
                             alfTopic: alfTopic,
                             data: null,
                             method: "DELETE"});
         }
      }
   });
});