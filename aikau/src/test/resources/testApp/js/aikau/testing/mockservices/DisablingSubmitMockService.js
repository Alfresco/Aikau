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
 * @module aikauTesting/mockservices/DisablingSubmitMockService
 * @author Martin Doyle
 */
define([
      "alfresco/core/Core",
      "alfresco/core/topics",
      "dojo/_base/declare",
      "dojo/_base/lang"
   ],
   function(AlfCore, topics, declare, lang) {

      return declare([AlfCore], {

         /**
          * Constructor.
          * 
          * @instance
          * @param {object[]} args Constructor arguments
          */
         constructor: function alfresco_testing_mockservices_DisablingSubmitMockService__constructor(args) {
            declare.safeMixin(this, args);
            this.alfSubscribe("MY_NAME_IS", lang.hitch(this, this.onNameReceived));
            this.alfSubscribe("ODD_OR_EVEN", lang.hitch(this, this.onOddOrEvenReceived));
         },

         /**
          * Handles the name being sent.
          * 
          * @instance
          * @param {object} payload The payload.
          */
         onNameReceived: function alfresco_testing_mockservices_DisablingSubmitMockService__onNameReceived(payload) {
            this.alfServicePublish(topics.DISPLAY_NOTIFICATION, {
               message: "Hello " + payload.name + "!",
               publishTopic: payload.alfResponseScope + "ENABLE_OK_BUTTON" // Hacky, but no time to refactor NotificationService right now
            });
         },

         /**
          * Handles the name being sent.
          * 
          * @instance
          * @param {object} payload The payload.
          */
         onOddOrEvenReceived: function alfresco_testing_mockservices_DisablingSubmitMockService__onOddOrEvenReceived(payload) {
            var reenable = false,
               parsedNum;
            try {
               parsedNum = parseInt(payload.testValue, 10);
               reenable = !isNaN(parsedNum) && (parsedNum % 2 === 0);
            } catch (e) {
               // Ignore errors
            }
            this.alfServicePublish(topics.DISPLAY_NOTIFICATION, {
               message: reenable ? "Received even number. Will re-enable!" : "Did not receive even number. Will not re-enable!",
               publishTopic: payload.alfResponseScope + "ENABLE_OK_BUTTON_IF", // Hacky, but no time to refactor NotificationService right now
               publishPayload: {
                  enable: reenable
               }
            });
         }
      });
   });
