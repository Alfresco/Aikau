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
 * @module alfresco/services/NotificationService
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang"],
        function(declare, AlfCore, lang) {
   
   return declare([AlfCore], {
      
      /**
       * Declare the dependencies on "legacy" JS files that this is wrapping.
       * 
       * @instance
       * @type {String[]}
       */
      nonAmdDependencies: ["/js/yui-common.js",
                           "/js/alfresco.js"],

      /**
       * Sets up the subscriptions for the NotificationService
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_NotificationService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_DISPLAY_NOTIFICATION", lang.hitch(this, "onDisplayNotification"));
         this.alfSubscribe("ALF_DISPLAY_PROMPT", lang.hitch(this, "onDisplayPrompt"));
      },
      
      /**
       * Displays a notification to the user
       * 
       * @instance
       * @param {object} payload The The details of the notification.
       */
      onDisplayNotification: function alfresco_services_NotificationService__onDisplayNotification(payload) {
         var message = lang.getObject("message", false, payload);
         if (message != null)
         {
            Alfresco.util.PopupManager.displayMessage({
               text: message
            });
         }
         else
         {
            this.alfLog("warn", "It was not possible to display the message because no 'message' attribute was provided", payload);
         }
      },

      /**
       * Displays a prompt to the user
       *
       * @instance
       * @param {object} payload The The details of the notification.
       */
      onDisplayPrompt: function alfresco_services_NotificationService__onDisplayPrompt(payload) {
         var message = lang.getObject("message", false, payload);
         if (message != null)
         {
            var config = {
               text: message
            };
            if (payload.title)
            {
               config.title = payload.title;
            }
            Alfresco.util.PopupManager.displayMessage(config);
         }
         else
         {
            this.alfLog("warn", "It was not possible to display the message because no 'message' attribute was provided", payload);
         }
      }
   });
});