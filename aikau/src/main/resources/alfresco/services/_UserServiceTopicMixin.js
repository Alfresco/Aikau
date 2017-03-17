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
 * @module alfresco/services/_UserServiceTopicMixin
 * @author Dave Draper
 * @author Ray Gauss II
 */
define(["dojo/_base/declare"], 
        function(declare) {
   
   return declare(null, {
      
      /**
       * This topic is used to set the status for the user
       * 
       * @instance
       * @type {string}
       * @default
       */
      updateUserStatusTopic: "ALF_UPDATE_USER_STATUS",
      
      /**
       * This topic is used to indicate that the user's status was saved successfully.
       * 
       * @instance
       * @type {string}
       * @default
       */
      updateUserStatusSuccessTopic: "ALF_USER_STATUS_UPDATED",
      
      /**
       * This topic is used to indicate that the user's status could not be saved.
       * 
       * @instance
       * @type {string}
       * @default
       */
      updateUserStatusFailureTopic: "ALF_USER_STATUS_UPDATE_FAILURE",
      
      /**
       * This topic is used to set the home page for the user
       * 
       * @instance
       * @type {string}
       * @default
       */
      setUserHomePageTopic: "ALF_SET_USER_HOME_PAGE",
      
      /**
       * This topic is used to indicate that the user's home page was saved successfully.
       * 
       * @instance
       * @type {string}
       * @default
       */
      setUserHomePageSuccessTopic: "ALF_SET_USER_HOME_PAGE_SUCCESS",
      
      /**
       * This topic is used to indicate that the user's home page could not be saved.
       * 
       * @instance
       * @type {string}
       * @default
       */
      setUserHomePageFailureTopic: "ALF_SET_USER_HOME_PAGE_FAILURE"
   });
});