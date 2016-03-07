/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * A mixin that provides functions for displaying messages and dialog popups to the user.
 *
 * @module alfresco/core/NotificationUtils
 * @author Dave Draper
 * @deprecated Since 1.0.17 - use the [NotificationService]{@link module:alfresco/services/NotificationService} instead.
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "alfresco/core/topics",
        "alfresco/core/Core"],
        function(declare, lang, topics, AlfCore) {

   return declare([AlfCore], {

      /**
       * This function handles displaying popup messages. 
       *
       * @instance
       * @param {string} msg The message to be displayed.
       * @param {object} postMessagePublish A publication to occur after the message has displayed, provided as a mixin to the payload.
       * @param {string} postMessagePublish.publishTopic The topic to publish
       * @param {string} postMessagePublish.publishPayload The payload to publish
       * @param {string} postMessagePublish.publishGlobal Whether to publish globally
       * @param {string} postMessagePublish.publishToParent Whether to publish to parent
       * @fires module:alfresco/core/topics#DISPLAY_NOTIFICATION
       */
      displayMessage: function alfresco_core_Core__displayMessage(msg, postMessagePublish) {
         var payload = {
            message: msg
         };
         if (postMessagePublish) {
            lang.mixin(payload, postMessagePublish);
         }
         this.alfServicePublish(topics.DISPLAY_NOTIFICATION, payload);
      },

      /**
       * This function handles displaying popup messages that require some acknowledgement.
       *
       * @instance
       * @param msg {String} The message to be displayed.
       */
      displayPrompt: function alfresco_core_Core__displayPrompt(config) {
         // See AKU-400 - support changes to Dojo dialog following upgrade to 1.10.0
         if (config.textContent)
         {
            config.message = config.textContent;
         }
         this.alfPublish("ALF_DISPLAY_PROMPT", config);
      }
   });
});