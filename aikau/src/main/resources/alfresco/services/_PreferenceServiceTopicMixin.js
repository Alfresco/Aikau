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
 * @module alfresco/services/_PreferenceServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/topics"], 
        function(declare, topics) {
   
   return declare(null, {

      /**
       * @instance
       * @type {string}
       * @default
       */
      getPreferenceTopic: topics.GET_PREFERENCE,
      
      /**
       * @instance
       * @type {string}
       * @default
       */
      setPreferenceTopic: topics.SET_PREFERENCE,
      
      /**
       * This topic is used to request that a node should be made a favourite.
       * 
       * @instance
       * @type {string}
       * @default
       */
      addFavouriteDocumentTopic: "ALF_PREFERENCE_ADD_DOCUMENT_FAVOURITE",
      
      /**
       * This topic is used to request that a node should be made a favourite.
       * 
       * @instance
       * @type {string}
       * @default
       */
      removeFavouriteDocumentTopic: "ALF_PREFERENCE_REMOVE_DOCUMENT_FAVOURITE",
      
      /**
       * This topic is used to indicate that a node was successfully made a favourite.
       * 
       * @instance
       * @type {string}
       * @default
       */
      addFavouriteDocumentSuccessTopic: "ALF_PREFERENCE_ADD_DOCUMENT_FAVOURITE_SUCCESS",
      
      /**
       * This topic is used to indicate that a node was successfully removed from being a favourite.
       * 
       * @instance
       * @type {string}
       * @default
       */
      removeFavouriteDocumentSuccessTopic: "ALF_PREFERENCE_REMOVE_DOCUMENT_FAVOURITE_SUCCESS",
      
      /**
       * This topic is used to indicate that a node could not be made a favourite
       * 
       * @instance
       * @type {string}
       * @default
       */
      addFavouriteDocumentFailureTopic: "ALF_PREFERENCE_ADD_DOCUMENT_FAVOURITE_FAILURE",
      
      /**
       * This topic is used to indicate that a node could not be removed as a favourite
       * 
       * @instance
       * @type {string}
       * @default
       */
      removeFavouriteDocumentFailureTopic: "ALF_PREFERENCE_REMOVE_DOCUMENT_FAVOURITE_FAILURE"
   });
});