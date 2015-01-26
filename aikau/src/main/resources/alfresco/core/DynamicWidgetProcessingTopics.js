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
 * This should be mixed into any widgets or services that need to request that additional widgets
 * be added to them. 
 * 
 * @module alfresco/core/DynamicWidgetProcessingTopics
 * @author Dave Draper
 */

define(["dojo/_base/declare"], 
        function(declare) {
   
   return declare(null, {

      /**
       * This topic is used to publish a request to add a widget dynamically to a previously
       * processed widget container.
       *
       * @event dynamicallyAddWidgetTopic
       * @instance
       * @type {string}
       * @default "ALF_DYNAMICALLY_ADD_WIDGET"
       */
      dynamicallyAddWidgetTopic: "ALF_DYNAMICALLY_ADD_WIDGET"
   });
});