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
 * @module alfresco/services/_TagServiceTopics
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
       * @type {string}
       * @default "ALF_TAG_QUERY"
       */
      tagQueryTopic: "ALF_TAG_QUERY"
   };
});