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
      name: "Delete Site Tests",
      testPage: "/DeleteSite",

      "Delete with redirect": function() {
         // Open the drop-down menu...
         return this.remote.findById("MENUBAR_POPUP_text")
            .click()
            .end()

         // Click the delete with redirect menu item...
         .findById("DELETE_WITH_REDIRECT_text")
            .click()
            .end()

         // Wait for the confirmation dialog...
         .findByCssSelector("#ALF_SITE_SERVICE_DIALOG.dialogDisplayed")
            .end()

         // Confirm deletion...
         .findById("ALF_SITE_SERVICE_DIALOG_CONFIRMATION_label")
            .click()
            .end()

         // Check for redirect...
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "user/guest/dashboard", "Wrong URL");
               assert.propertyVal(payload, "type", "PAGE_RELATIVE", "Wrong type");
               assert.propertyVal(payload, "target", "CURRENT", "Wrong target");
            })

         // Clear the logs for the next test
         .clearLog();
      },

      "Delete with reload": function() {
         // Open the drop-down menu...
         return this.remote.findById("MENUBAR_POPUP_text")
            .click()
            .end()

         // Click the delete with reload menu item...
         .findById("DELETE_WITH_RELOAD_text")
            .click()
            .end()

         // Wait for the confirmation dialog...
         .findByCssSelector("#ALF_SITE_SERVICE_DIALOG.dialogDisplayed")
            .end()

         // Confirm deletion...
         .findById("ALF_SITE_SERVICE_DIALOG_CONFIRMATION_label")
            .click()
            .end()

         // Check for redirect...
         .getLastPublish("ALF_DOCLIST_RELOAD_DATA", "No reload topic published")

         // Clear the logs for the next test
         .clearLog();
      }
   });
});