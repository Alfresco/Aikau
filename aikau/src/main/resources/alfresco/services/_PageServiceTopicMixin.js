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
 * This should be mixed into any widgets or services that need to either create remote page definitions
 * or query the remote page definitions that are available. A remote page definition is a JSON model
 * that is created and stored on the Alfresco Repository. It allows new pages to be created and rendered
 * without needing to restart the server.
 * 
 * @module alfresco/services/_PageServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare"], 
        function(declare) {
   
   return declare(null, {

      /**
       * This topic is used to request that a new page definition be saved to the repository
       * 
       * @instance
       * @type {string}
       * @default "ALF_CREATE_PAGE_DEFINITION"
       */
      createPageTopic: "ALF_CREATE_PAGE_DEFINITION",
      
      /**
       * This topic is used to indicate that a new page definition has been successfully saved to 
       * the repository.
       * 
       * @instance
       * @type {string}
       * @default "ALF_CREATE_PAGE_DEFINITION_SUCCESS"
       */
      createPageSuccessTopic: "ALF_CREATE_PAGE_DEFINITION_SUCCESS",
      
      /**
       * This topic is used to indicate that a new page definition could not be saved to the repository
       * 
       * @instance
       * @type {string}
       * @default "ALF_CREATE_PAGE_DEFINITION_FAILURE"
       */
      createPageFailureTopic: "ALF_CREATE_PAGE_DEFINITION_FAILURE",
      
      /**
       * This topic is used to request that an existing page definition be updated
       * 
       * @instance
       * @type {string}
       * @default "ALF_UPDATE_PAGE_DEFINITION"
       */
      updatePageTopic: "ALF_UPDATE_PAGE_DEFINITION",
      
      /**
       * This topic is used to indicate that an existing page definition has been successfully saved to 
       * the repository.
       * 
       * @instance
       * @type {string}
       * @default "ALF_UPDATE_PAGE_DEFINITION_SUCCESS"
       */
      updatePageSuccessTopic: "ALF_UPDATE_PAGE_DEFINITION_SUCCESS",
      
      /**
       * This topic is used to indicate that an existing page definition could not be saved to the repository
       * 
       * @instance
       * @type {string}
       * @default "ALF_UDPATE_PAGE_DEFINITION_FAILURE"
       */
      updatePageFailureTopic: "ALF_UDPATE_PAGE_DEFINITION_FAILURE",
      
      /**
       * This topic is used to request the publication of the currently defined pages
       * 
       * @instance
       * @type {string}
       * @default "ALF_REQUEST_PAGE_DEFINITIONS"
       */
      availablePagesRequestTopic: "ALF_REQUEST_PAGE_DEFINITIONS",
      
      /**
       * This topic is used to publish the details of the pages saved to the repository.
       * 
       * @instance
       * @type {string}
       * @default "ALF_AVAILABLE_PAGE_DEFINITIONS"
       */
      availablePagesTopic: "ALF_AVAILABLE_PAGE_DEFINITIONS",
      
      /**
       * This topic is used to indicate that an attempt to load the details of the available pages succeeded.
       * 
       * @instance
       * @type {string}
       * @default "ALF_AVAILABLE_PAGE_DEFINITIONS_LOAD_SUCCESS"
       */
      availablePagesLoadSuccess: "ALF_AVAILABLE_PAGE_DEFINITIONS_LOAD_SUCCESS",

      /**
       * This topic is used to indicate that an attempt to load the details of the available pages failed.
       * 
       * @instance
       * @type {string}
       * @default "ALF_AVAILABLE_PAGE_DEFINITIONS_LOAD_FAILURE"
       */
      availablePagesLoadFailure: "ALF_AVAILABLE_PAGE_DEFINITIONS_LOAD_FAILURE"
   });
});