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
 * @module alfresco/services/_RatingsServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare"], 
        function(declare) {
   
   return declare(null, {

      /**
       * This topic is used to request that a node should be rated (the details should be supplied
       * as the publication payload).
       * 
       * @instance
       * @type {string}
       * @default "ALF_RATING_ADD"
       */
      addRatingTopic: "ALF_RATING_ADD",
      
      /**
       * This topic is used to request a node should have a rating removed.
       * 
       * @instance
       * @type {string}
       * @default "ALF_RATING_REMOVE"
       */
      removeRatingTopic: "ALF_RATING_REMOVE",
      
      /**
       * This topic is used indicate that a document has been successfully rated
       * 
       * @instance
       * @type {string}
       * @default "ALF_RATING_ADD_SUCCESS"
       */
      addRatingSuccessTopic: "ALF_RATING_ADD_SUCCESS",
      
      /**
       * This topic is used to indicate that a document has successfully had a rating removed
       * 
       * @instance
       * @type {string}
       * @default "ALF_RATING_REMOVE_SUCCESS"
       */
      removeRatingSuccessTopic: "ALF_RATING_REMOVE_SUCCESS",
      
      /**
       * This topic is used to indicate that an attempt to rate a document failed.
       * 
       * @instance
       * @type {string}
       * @default "ALF_RATING_ADD_FAILURE"
       */
      addRatingFailureTopic: "ALF_RATING_ADD_FAILURE",
      
      /**
       * This topic is used to indicate that an attempt to remove the rating from a document failed.
       * 
       * @instance
       * @type {string}
       * @default "ALF_RATING_REMOVE"
       */
      removeRatingFailureTopic: "ALF_RATING_REMOVE_FAILURE"
   });
});