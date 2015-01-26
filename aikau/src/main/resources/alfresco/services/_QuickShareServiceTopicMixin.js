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
 * @module alfresco/services/_QuickShareServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare"], 
        function(declare) {
   
   return declare(null, {

      /**
       * 
       * @instance
       * @type {string}
       * @default "ALF_ADD_QUICKSHARE"
       */
      addQuickShareTopic: "ALF_ADD_QUICKSHARE",
      
      /**
       * 
       * @instance
       * @type {string}
       * @default "ALF_REMOVE_QUICKSHARE"
       */
      removeQuickShareTopic: "ALF_REMOVE_QUICKSHARE",
      
      /**
       * 
       * @instance
       * @type {string}
       * @default "ALF_ADD_QUICKSHARE_SUCCESS"
       */
      addQuickShareSuccessTopic: "ALF_ADD_QUICKSHARE_SUCCESS",
      
      /**
       * 
       * @instance
       * @type {string}
       * @default "ALF_REMOVE_QUICKSHARE_SUCCESS"
       */
      removeQuickShareSuccessTopic: "ALF_REMOVE_QUICKSHARE_SUCCESS",
      
      /**
       * 
       * @instance
       * @type {string}
       * @default "ALF_ADD_QUICKSHARE_FAILURE"
       */
      addQuickShareFailureTopic: "ALF_ADD_QUICKSHARE_FAILURE",
      
      /**
       * 
       * @instance
       * @type {string}
       * @default "ALF_REMOVE_QUICKSHARE_FAILURE"
       */
      removeQuickShareFailureTopic: "ALF_REMOVE_QUICKSHARE_FAILURE",
      
      /**
       * @instance
       * @type {string}
       * @default "ALF_GET_QUICKSHARE_LINK"
       */
      getQuickShareLinkTopic: "ALF_GET_QUICKSHARE_LINK",
      
      /**
       * @instance
       * @type {string}
       * @default "ALF_GET_SOCIAL_LINKS"
       */
      getSocialLinksTopic: "ALF_GET_SOCIAL_LINKS"
   });
});