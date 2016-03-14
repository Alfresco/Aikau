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
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "NotificationUtils Mixin Tests",
      testPage: "/NotificationUtils",

      "Check that notification is displayed": function() {
         return this.remote.findAllByCssSelector(".alfresco-notifications-AlfNotification__message")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Notification not displayed");
            });
      },

      "Check that prompt is displayed": function() {
         return this.remote.findAllByCssSelector("#NOTIFICATION_PROMPT")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Notification prompt was not displayed");
            });
      }
   });
});