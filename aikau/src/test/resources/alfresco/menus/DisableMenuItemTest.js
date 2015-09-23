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
 * This test interrogates the enable/disable and re-labelling features provided in the _AlfMenuItemMixin.
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Disable MenuItem Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DisableMenuItemTestPage", "Disable MenuItem Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Tests": function () {
         var testname = "DisableMenuItemTests";
         return browser.findById("MENU_BAR_ITEM_1")
            .getAttribute("class")
            .then(
               function(currClasses) {
                  TestCommon.log(testname, "Checking menu item is not yet disabled");
                  expect(currClasses).to.not.contain("dijitMenuItemDisabled", "The menu item should not be disabled yet");
               })
            .end()

            // Disable menu item
            .findById("DROP_DOWN_MENU_1")
               .click()
               .end()
            .findById("MENU_ITEM_1")
               .click()
               .end()

            // Check menu item is now disabled
            .findById("MENU_BAR_ITEM_1")
               .getAttribute("class")
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking menu item is disabled");
                     expect(currClasses).to.contain("dijitMenuItemDisabled", "The menu item should be disabled");
                  })
               .end()

            // Enable menu item
            .findById("DROP_DOWN_MENU_1")
               .click()
               .end()
            .findById("MENU_ITEM_2")
               .click()
               .end()

            // Check menu item is enabled
            .findById("MENU_BAR_ITEM_1")
               .getAttribute("class")
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking menu item is enabled again");
                     expect(currClasses).to.not.contain("dijitMenuItemDisabled", "The menu item should not be disabled");
                  })
               .end()

            // Faulty payload 1
            .findById("DROP_DOWN_MENU_1")
               .click()
               .end()
            .findById("MENU_ITEM_3")
               .click()
               .end()

            // Check menu item is enabled
            .findById("MENU_BAR_ITEM_1")
               .getAttribute("class")
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking menu item is still enabled");
                     expect(currClasses).to.not.contain("dijitMenuItemDisabled", "The menu item should not be disabled");
                  })
               .end()

            // Faulty payload 2
            .findById("DROP_DOWN_MENU_1")
               .click()
               .end()
            .findById("MENU_ITEM_4")
               .click()
               .end()

            // Check menu item is enabled
            .findById("MENU_BAR_ITEM_1")
               .getAttribute("class")
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking menu item is still enabled");
                     expect(currClasses).to.not.contain("dijitMenuItemDisabled", "The menu item should not be disabled");
                  })
               .end()

            // Faulty payload 3
            .findById("DROP_DOWN_MENU_1")
               .click()
               .end()
            .findById("MENU_ITEM_5")
               .click()
               .end()

            // Check menu item is enabled
            .findById("MENU_BAR_ITEM_1")
               .getAttribute("class")
               .then(
                  function(currClasses) {
                     TestCommon.log(testname, "Checking menu item is still enabled");
                     expect(currClasses).to.not.contain("dijitMenuItemDisabled", "The menu item should not be disabled");
                  })
               .end()

            // Check menu item is label correctly
            .findById("MENU_BAR_ITEM_1")
               .getVisibleText()
               .then(
                  function(txt) {
                     TestCommon.log(testname, "Checking menu item has expected label");
                     expect(txt).to.equal("Menu Bar Item", "The menu item has the wrong label");
                  })
               .end()

            // Change label
            .findById("DROP_DOWN_MENU_1")
               .click()
               .end()
            .findById("MENU_ITEM_6")
               .click()
               .end()

            .findById("MENU_BAR_ITEM_1")
               .getVisibleText()
               .then(
                  function(txt) {
                     TestCommon.log(testname, "Checking menu item has new label");
                     expect(txt).to.equal("Thingy", "The menu item has the wrong label");
                  })
               .end()

            // Change label again
            .findById("DROP_DOWN_MENU_1")
               .click()
               .end()
            .findById("MENU_ITEM_7")
               .click()
               .end()

            .findById("MENU_BAR_ITEM_1")
               .getVisibleText()
               .then(
                  function(txt) {
                     TestCommon.log(testname, "Checking menu item has another new label");
                     expect(txt).to.equal("Wot-ya-ma-call-it", "The menu item has the wrong label");
                  })
               .end()

            // Fault - no change
            .findById("DROP_DOWN_MENU_1")
               .click()
               .end()
            .findById("MENU_ITEM_8")
               .click()
               .end()

            .findById("MENU_BAR_ITEM_1")
               .getVisibleText()
               .then(
                  function(txt) {
                     TestCommon.log(testname, "Checking menu item has not changed label");
                     expect(txt).to.equal("Wot-ya-ma-call-it", "The menu item has the wrong label");
                  });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});