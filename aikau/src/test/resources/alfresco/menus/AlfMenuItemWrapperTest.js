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
 * This is the unit test for the alfresco/menus/AlfMenuItemWrapper widget.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

registerSuite(function(){
   var browser;

   return {
      name: "AlfMenuItemWrapper Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuItemWrapper", "AlfMenuItemWrapper Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Tests": function () {

         var testname = "AlfMenuItemWrapper Test";
         var alfPause = 500;
         return browser.pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.ARROW_DOWN) // Opens the drop-down
            .sleep(alfPause)
            .pressKeys(keys.ARROW_DOWN) // Skips over log to 2nd button
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "CLICKED_BUTTON_2"))
               .then(
                  function() {
                     TestCommon.log(testname, "Check that 2nd menu item is skipped down...");
                  }, 
                  function(err) {
                     assert(false, "Test #1a - The wrapped menu item without focus was not skipped on downward keyboard navigation", err);
                  }
               )
            .end()

            .pressKeys(keys.ARROW_UP) // Skips over log to 2nd button
            .sleep(alfPause)
            .pressKeys(keys.RETURN)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "CLICKED_BUTTON_1"))
               .then(
                  function() {
                     TestCommon.log(testname, "Check that 2nd menu item is skipped up...");
                  }, 
                  function(err) {
                     assert(false, "Test #1b - The wrapped menu item without focus was not skipped on upwards keyboard navigation", err);
                  }
               )
            .end()

            // Currently commented out - this works in manual testing but not in Selenium for some reason
            // .end()
            // .findByCssSelector(".alfresco-logo-large")
            //    .click()
            //    .end()
            .pressKeys(keys.ARROW_DOWN)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "CLICKED_BUTTON_2"))
               .then(
                  function() {
                     TestCommon.log(testname, "Check that 2nd menu item is skipped down again...");
                  }, 
                  function(err) {
                     assert(false, "Test #1c - The wrapped menu item without focus was not navigated away from successfully", err);
                  }
               )
            .end()

            .pressKeys(keys.ARROW_DOWN) // Skips over log to 2nd button
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
               .then(
                  function() {
                     TestCommon.log(testname, "Check that 2nd menu wraps...");
                  }, 
                  function(err) {
                     assert(false, "Test #1d - The empty wrapped menu item was not skipped on keyboard navigation", err);
                  }
               );
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});