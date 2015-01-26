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
 * This module provides a set of topics used by the Core/Events widget
 *
 * @module alfresco/core/EventsTopicMixin
 * @author David.Webster@alfresco.com
 */
define(["dojo/_base/declare"],
   function(declare) {

      return declare(null, {

         /**
          * This topic is used to subscribe to rate limited scroll events.
          *
          * @event eventsScrollTopic
          * @instance
          * @type {string}
          * @default "ALF_EVENTS_SCROLL"
          */
         eventsScrollTopic: "ALF_EVENTS_SCROLL",

         /**
          * This topic is used to subscribe to rate limited resize events.
          *
          * @event eventsResizeTopic
          * @instance
          * @type {string}
          * @default "ALF_EVENTS_SCROLL"
          */
         eventsResizeTopic: "ALF_EVENTS_RESIZE"

      });
   });