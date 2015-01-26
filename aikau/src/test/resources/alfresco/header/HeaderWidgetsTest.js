/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

   registerSuite({
      name: 'Header Widgets Test',

      'Basic Test': function () {

         var browser = this.remote;
         var testname = "Header Widgets Test";
         return TestCommon.loadTestWebScript(this.remote, "/HeaderWidgets", testname)

         // Check that the header CSS is applied...
         .findByCssSelector(".alfresco-layout-LeftAndRight.alfresco-header-Header")
            .then(function(element){}, function(err) {
               assert(false, "Test #1a - The header CSS was not applied correctly");
            })
            .end()

         // Test the title text...
         .findByCssSelector(".alfresco-header-Title > .text")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "Test Title", "Test #1b - The title was not set correctly");
            })
            .end()

         // Click on the popup... 
         .findByCssSelector("#HEADER_POPUP_text")
            .click()
            .end()

         // Check the preset user status...
         .findByCssSelector("#PRESET_STATUS > div.status")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "Test Status", "Test #1c - Preset status not set correctly");
            })
            .end()

         .findByCssSelector("#PRESET_STATUS > div.lastUpdate > span")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "over 15 years ago", "Test #1d - Preset status time not displayed as expected");
            })
            .end()

         // Check the unset user status...
         .findByCssSelector("#NO_STATUS > div.status")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "What are you thinking?", "Test #1e - Unset status not displayed correctly");
            })
            .end()

         .findByCssSelector("#NO_STATUS > div.lastUpdate")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "Last updated: never", "Test #1f - Unset status time not displayed as expected");
            })
            .end()

         // Click on a status to display the update dialog...
         .findByCssSelector("#NO_STATUS > div.status")
            .click()
            .sleep(500)
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog")
            .then(function(element){}, function(err) {
               assert(false, "Test #2a - The update dialog was not displayed");
            })
            .end()
         .findByCssSelector(".alfresco-dialog-AlfDialog .dijitDialogTitleBar > span")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "What Are You Thinking?", "Test #2b - User status dialog title not set correctly");
            })
            .end()

         // Update the status...
         .findByCssSelector("#NO_STATUS_STATUS_TEXTAREA")
            .clearValue()
            .type("Status Update")
            //.sleep(500)
            .pressKeys([keys.TAB])
            .pressKeys([keys.RETURN])
            .sleep(250)
            .end()

         // Check that the status update was posted correctly...
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "status", "Status Update"))
            .then(function(elements) {
               assert(elements.length == 1, "Test #2c - User status not published correctly");
            })
            .end()

         // Use the menus to simulate a status update...
         // (with the bonus of checking the header versions of the menu items work)...
         .findByCssSelector("#HEADER_POPUP_text")
            .click()
            .end()
            .sleep(150)
         .findByCssSelector("#CASCADE_1_text")
            .click()
            .end()
            .sleep(150)
         .findByCssSelector("#MENU_ITEM_1_text")
            .click()
            .end()
            .sleep(150)

         // Open the popup again...
         .findByCssSelector("#HEADER_POPUP_text")
            .click()
            .end()

         // Check the preset user status (which should be updated)...
         .findByCssSelector("#NO_STATUS > div.status")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "Button Update", "Test #3a - Status not updated");
            })
            .end()
         .findByCssSelector("#NO_STATUS > div.lastUpdate > span")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "over 15 years ago", "Test #3b - Status time not updated");
            })
            .end()

         // Click on the sites menus...
         .findByCssSelector("#SITES_MENU_text")
            .click()
            .end()

         .findByCssSelector("#HEADER_SITES_MENU_RECENT_site1 a")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Site1", "Test #4a - First recent site not rendered correctly");
            })
            .end()
         .findByCssSelector("#HEADER_SITES_MENU_RECENT_site2 a")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Site2", "Test #4b - Sccond recent site not rendered correctly");
            })
            .end()

         .findByCssSelector("#SITES_MENU_FAVOURITES_text")
            .click()
            .end()

         .findByCssSelector("#HEADER_SITES_MENU_FAVOURITE_site1 a")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Site1", "Test #5a - First favourite site not rendered correctly");
            })
            .end()

         .findByCssSelector("#HEADER_SITES_MENU_FAVOURITE_site2 a")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Site2", "Test #5b - Second favourite site not rendered correctly");
            })
            .end()

         .alfPostCoverageResults(browser);
      },

      'Add Favourite Test': function() {
         var browser = this.remote;
         var testname = "Add Favourite";
         return TestCommon.loadTestWebScript(this.remote, "/AddFavouriteSite", testname)

            .end()

            .findByCssSelector("#SITES_MENU_text")
               .click()
               .sleep(500)
               .end()

            .findByCssSelector("#SITES_MENU_ADD_FAVOURITE_text")
               .click()
               .end()

            .findAllByCssSelector(TestCommon.topicSelector("ALF_ADD_FAVOURITE_SITE", "publish", "last"))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #1a - Add favourite topic not published");
               })
               .end()

            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "site", "site1"))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #1b - Favourite not added correctly");
               })
               .end()

            .alfPostCoverageResults(browser);
      },

      'Remove Favourite Test': function() {
         var browser = this.remote;
         var testname = "Remove Favourite";
         return TestCommon.loadTestWebScript(this.remote, "/RemoveFavouriteSite", testname)
            
            .findByCssSelector("#SITES_MENU_text")
               .click()
               .sleep(500)
               .end()

            .findByCssSelector("#SITES_MENU_REMOVE_FAVOURITE_text")
               .click()
               .end()

            .findAllByCssSelector(TestCommon.topicSelector("ALF_REMOVE_FAVOURITE_SITE", "publish", "last"))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #1a - Remove favourite topic not published");
               })
               .end()

            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "site", "site1"))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #1b - Favourite not removed correctly");
               })
               .end()
            
            .alfPostCoverageResults(browser);
      }
   });
});