/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 * This mixin is intended to contain ALL topics used by the Aikau framework. It is a mixin rather than
 * a constants file, because occasionally it is necessary to override certain values due to the manner
 * in which certain files have been constructed, however it is strongly discouraged to do so.<br />
 * <br />
 * NOTE: The TOPIC_ prefix is used because these items will be referenced as instance variables, and
 * so makes it easier to effortlessly determine what the variable is when reading code.
 * 
 * @module alfresco/core/TopicsMixin
 * @author Martin Doyle
 */
define(["dojo/_base/declare"],
   function(declare) {

      // NOTE: Please keep every value alphabetically sorted, in order
      //       to help manage the large number of topics used in Aikau
      return declare(null, {

         /**
          * This topic is fired automatically whenever a notification is destroyed.
          *
          * @instance
          * @type {string}
          * @default
          */
         TOPIC_NOTIFICATION_CLOSED: "ALF_NOTIFICATION_CLOSED"
      });
   });