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
 * A mixin that provides functions for displaying messages and dialog popups to the user.
 *
 * @module alfresco/core/NotificationUtils
 * @author Dave Draper
 * @deprecated Since 1.0.17 - use the [NotificationService]{@link module:alfresco/services/NotificationService} instead.
 */
define(["dojo/_base/declare",
        "alfresco/core/Core"],
        function(declare, AlfCore) {

   return declare([AlfCore], {

      /**
       * This function handles displaying popup messages. 
       *
       * @instance
       * @param msg {String} The message to be displayed.
       */
      displayMessage: function alfresco_core_Core__displayMessage(msg) {
         this.alfPublish("ALF_DISPLAY_NOTIFICATION", {
            message: msg
         });
      },

      /**
       * This function handles displaying popup messages that require some acknowledgement.
       *
       * @instance
       * @param msg {String} The message to be displayed.
       */
      displayPrompt: function alfresco_core_Core__displayPrompt(config) {
         this.alfPublish("ALF_DISPLAY_PROMPT", config);
      }
   });
});