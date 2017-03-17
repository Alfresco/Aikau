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

/**
 * @module alfresco/services/_PreferenceServiceTopicMixin
 * @author Dave Draper
 * @deprecated Since 1.0.38 - Use [topics]{@link module:alfresco/core/topics} instead.
 */
define(["dojo/_base/declare",
        "alfresco/core/topics"], 
        function(declare, topics) {
   
   return declare(null, {

      /**
       * @instance
       * @type {string}
       * @default
       * @event
       * @property {string} preference A dot-notation property of the preference to retrieve
       * @property {function} callback The function to call when the preference has been retrieved
       * @property {object} callbackScope The scope with which to call the callback function
       */
      getPreferenceTopic: topics.GET_PREFERENCE,
      
      /**
       * @instance
       * @type {string}
       * @default
       * @event
       * @property {string} preference A dot-notation property of the preference to set
       * @property {object} value The value to set as the preference
       * @property {object} updatedValue The value that has been changed (e.g. this might be an item removed that)
       */
      setPreferenceTopic: topics.SET_PREFERENCE,
      
      /**
       * This topic is used to request that a node should be made a favourite.
       * 
       * @instance
       * @type {string}
       * @default
       */
      addFavouriteDocumentTopic: topics.ADD_FAVOURITE_NODE,
      
      /**
       * This topic is used to request that a node should be made a favourite.
       * 
       * @instance
       * @type {string}
       * @default
       */
      removeFavouriteDocumentTopic: topics.REMOVE_FAVOURITE_NODE,
      
      /**
       * This topic is used to indicate that a node was successfully made a favourite.
       * 
       * @instance
       * @type {string}
       * @default
       * @deprecated Since 1.0.38 - no longer required within main Aikau codebase.
       */
      addFavouriteDocumentSuccessTopic: "ALF_PREFERENCE_ADD_DOCUMENT_FAVOURITE_SUCCESS",
      
      /**
       * This topic is used to indicate that a node was successfully removed from being a favourite.
       * 
       * @instance
       * @type {string}
       * @default
       * @deprecated Since 1.0.38 - no longer required within main Aikau codebase.
       */
      removeFavouriteDocumentSuccessTopic: "ALF_PREFERENCE_REMOVE_DOCUMENT_FAVOURITE_SUCCESS",
      
      /**
       * This topic is used to indicate that a node could not be made a favourite
       * 
       * @instance
       * @type {string}
       * @default
       * @deprecated Since 1.0.38 - no longer required within main Aikau codebase.
       */
      addFavouriteDocumentFailureTopic: "ALF_PREFERENCE_ADD_DOCUMENT_FAVOURITE_FAILURE",
      
      /**
       * This topic is used to indicate that a node could not be removed as a favourite
       * 
       * @instance
       * @type {string}
       * @default
       * @deprecated Since 1.0.38 - no longer required within main Aikau codebase.
       */
      removeFavouriteDocumentFailureTopic: "ALF_PREFERENCE_REMOVE_DOCUMENT_FAVOURITE_FAILURE"
   });
});