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
 * This mixin used to be used to contain the topics used by the tag service, however it has now been superseded by the global topics module.
 * 
 * @module alfresco/services/_TagServiceTopics
 * @deprecated Since 1.0.37 - Use [global topics module]{@link module:alfresco/core/topics} instead.
 * @deprecated [description]
 * @author Dave Draper
 */
define([], 
       function() {
   
   return {

      /**
       * This topic is used to request that a node should be rated (the details should be supplied
       * as the publication payload).
       * 
       * @instance
       * @deprecated Since 1.0.37 - Use [topics.TAG_QUERY]{@link module:alfresco/core/topics#TAG_QUERY} instead.
       * @type {string}
       * @default
       */
      tagQueryTopic: "ALF_TAG_QUERY"
   };
});