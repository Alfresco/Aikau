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
 * A mixin that provides functions for displaying messages and dialog popups to the user.
 *
 * @module alfresco/core/NotificationUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/dialogs/AlfDialog",
        "dojo/dom-construct"],
        function(declare, AlfCore, AlfDialog, domConstruct) {

   return declare([AlfCore], {

      /**
       * This function handles displaying popup messages. It currently uses the legacy YUI functions that are defined
       * in alfresco.js and are expected to be available in the JavaScript global namespace until Share is merged
       * completely to the new UI framework. At some point in time this function should be updated to use alternative
       * means of displaying a message.
       *
       * @instance
       * @param msg {String} The message to be displayed.
       */
      displayMessage: function alfresco_core_Core__displayMessage(msg) {
         if (Alfresco && Alfresco.util && Alfresco.util.PopupManager)
         {
            Alfresco.util.PopupManager.displayMessage({
               text: msg
            });
         }
         else
         {
            this.alfLog("error", "Alfresco.util.PopupManager not available for handling displayMessage requests.");
         }
      },

      /**
       * This function handles displaying popup messages that require some acknowledgement.
       * It currently uses the legacy YUI functions that are defined
       * in alfresco.js and are expected to be available in the JavaScript global namespace until Share is merged
       * completely to the new UI framework. At some point in time this function should be updated to use alternative
       * means of displaying a message.
       *
       * @instance
       * @param msg {String} The message to be displayed.
       */
      displayPrompt: function alfresco_core_Core__displayPrompt(config) {
         var dialog = new AlfDialog(config);
         dialog.show();
      }
   });
});