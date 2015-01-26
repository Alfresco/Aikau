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
 * @module aikauTesting/mockservices/SocialTestService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/services/_RatingsServiceTopicMixin",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "service/constants/Default",
        "dojo/_base/lang"],
   function(declare, AlfCore, _RatingsServiceTopicMixin, _PreferenceServiceTopicMixin, AlfConstants, lang) {

      return declare([AlfCore, _RatingsServiceTopicMixin, _PreferenceServiceTopicMixin], {

         /**
          * Use this to determine if the service has already been called.
          *
          */
         likeServiceCount: 0,

         /**
          * Use this to determine if the service has already been called.
          *
          */
         favouritesServiceCount: 0,

         /**
          *
          *
          * @instance
          * @param {array} args The constructor arguments.
          */
         constructor: function alfresco_testing_mockservices_SocialTestService__constructor(args) {
            lang.mixin(this, args);
            this.alfSubscribe(this.addRatingTopic, lang.hitch(this, this.onLikes));
            this.alfSubscribe(this.removeRatingTopic, lang.hitch(this, this.onLikes));
            this.alfSubscribe(this.addFavouriteDocumentTopic, lang.hitch(this, this.onFavourites));
            this.alfSubscribe(this.removeFavouriteDocumentTopic, lang.hitch(this, this.onFavourites));
         },

         /**
          * @instance
          */
         onLikes: function alfresco_testing_mockservices_SocialTestService__onLikes(payload) {

            var alfTopic = (payload.alfResponseTopic != null) ? payload.alfResponseTopic : this.addRatingSuccessTopic,
                response = {};

            // Increment the likeServiceCount...
            // The test will make 3 requests... 
            //  1) add a like,
            //  2) remove a like
            //  3) simulate failed request
            this.likeServiceCount++;

            // Switch and return the correct request for these results.
            switch (this.likeServiceCount) {
               case 1:
                  alfTopic += "_SUCCESS";
                  response = {
                     data: {
                        ratingsCount: 5
                     }
                  };
                  break;
               case 2:
                  alfTopic += "_SUCCESS";
                  response = {
                     data: {
                        ratingsCount: 4
                     }
                  };
                  break;
               case 3:
                  alfTopic += "_FAILURE";
                  response = {
                     // TODO: Some kind of error message?
                  };
            }

            // Publish the response
            this.alfPublish(alfTopic, {
               response: response
            });
         },

         /**
          * @instance
          */
         onFavourites: function alfresco_testing_mockservices_SocialTestService__onFavourites(payload) {

            var alfTopic = (payload.alfResponseTopic != null) ? payload.alfResponseTopic : this.addRatingSuccessTopic,
                response = {};

            // Increment the favouritesServiceCount...
            // The test will make 3 requests... 
            //  1) add a favourite,
            //  2) remove a favourite
            //  3) simulate failed request
            this.favouritesServiceCount++;

            // Switch and return the correct request for these results.
            switch (this.favouritesServiceCount) {
               case 1:
                  alfTopic += "_SUCCESS";
                  break;
               case 2:
                  alfTopic += "_SUCCESS";
                  break;
               case 3:
                  alfTopic += "_FAILURE";
                  response = {
                     // TODO: Some kind of error message?
                  };
            }

            // Publish the response
            this.alfPublish(alfTopic, {
               response: response
            });
         }
      });
   });
