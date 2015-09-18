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
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

registerSuite(function(){

   return {
      name: "Selected Items Menu Test",
      "Test Menu Initially Disabled": function () {

         var testname = "Selected Items Menu Test";
         return TestCommon.loadTestWebScript(this.remote, "/SelectedItemsMenu", testname)
            .findByCssSelector("#SELECTED_ITEMS.dijitDisabled")
               .then(
                  null,
                  function(){assert(false, "Test #1a - The menu was not initially disabled");}
               )
            .end();
      },
      "Test Selecting Item Enables Menu": function () {

         var browser = this.remote;

         // Simulate selection of an item...
         return browser.findByCssSelector("#SELECT_ITEM_1_label")
            .click()
         .end()

         // Sleep is required for selection timeout...
         .sleep(100)

         // Check that the menu item is no longer disabled...
         .findByCssSelector("#SELECTED_ITEMS.dijitDisabled")
            .then(
               function(){assert(false, "Test #2a - The menu was not enabled when clicking an item");},
               function() {
                  // DIDN'T FIND (success)
                  assert(true, "Test #3 - Did NOT find menu item as expected");
               }
            )
         .end();
      },
      "Test De-Selecting Item Disables Menu": function () {

         var browser = this.remote;

         // Simulate de-selection of an item...
         return browser.findByCssSelector("#DESELECT_ITEM_1_label")
            .click()
         .end()

         // Sleep is required for selection timeout...
         .sleep(100)

         // Check that the menu item is now disabled again...
         .findByCssSelector("#SELECTED_ITEMS.dijitDisabled")
            .then(
               null,
               function(){assert(false, "Test #4a - The menu was not disabled when de-selecting items");}
            )
         .end();
      },
      "Test Items Not Cleared": function () {

         var browser = this.remote;

         // Add the item again...
         return browser.findByCssSelector("#SELECT_ITEM_1_label")
            .click()
         .end()

         // Sleep is required for selection timeout...
         .sleep(100)

         // Open the menu...
         .findByCssSelector("#SELECTED_ITEMS_text")
            .click()
         .end()

         // Click the second menu item (which is configured to NOT clear selected items)
         .findByCssSelector("#MENU_ITEM_NO_CLEAR_text")
            .click()
         .end()

         .findByCssSelector(TestCommon.topicSelector("ALF_CLEAR_SELECTED_ITEMS", "publish", "any"))
            .then(
               function(){assert(false, "Test #4b - The topic to clear selected items was not published");},
               function() {
                  // DIDN'T FIND (success)
                  assert(true, "Test #3 - Did NOT find menu item as expected");
               }
            )
         .end()
         .findByCssSelector(TestCommon.topicSelector("ALF_DOCLIST_FILE_SELECTION", "publish", "any"))
            .then(
               function(){assert(false, "Test #4c - The topic to clear selected items was not published");},
               function() {
                  // DIDN'T FIND (success)
                  assert(true, "Test #3 - Did NOT find menu item as expected");
               }
            )
         .end();
      },
      "Test Menu Item Contains Selected Item": function () {

         var browser = this.remote;

         // Add the item again...
         return browser.findByCssSelector("#SELECT_ITEM_1_label")
            .click()
         .end()

         // Sleep is required for selection timeout...
         .sleep(100)

         // Open the menu...
         .findByCssSelector("#SELECTED_ITEMS_text")
            .click()
         .end()

         // Click the menu item...
         .findByCssSelector("#MENU_ITEM_text")
            .click()
         .end()

         .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("TEST_ITEMS","selectedItems","data","item_one"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Test #3a - Didn't find selected item in publication payload");
            })
         .end();
      },
      "Test Menu Disabled After Item Click": function () {
         // Check that after the previous click the menu is disabled again...
         var browser = this.remote;
         return browser.findByCssSelector("#SELECTED_ITEMS.dijitDisabled")
            .then(
               null,
               function(){assert(false, "Test #4a - The menu was not initially disabled");}
            )
         .end();
      },
      "Test Clearing Selected Items Topic Published": function () {
         var browser = this.remote;
         return browser.findByCssSelector(TestCommon.topicSelector("ALF_CLEAR_SELECTED_ITEMS", "publish", "any"))
            .then(
               null,
               function(){assert(false, "Test #4b - The topic to clear selected items was not published");}
            )
         .end();
      },
      "Test Select None Topic Published": function () {
         var browser = this.remote;
         return browser.findByCssSelector(TestCommon.topicSelector("ALF_DOCLIST_FILE_SELECTION", "publish", "any"))
            .then(
               null,
               function(){assert(false, "Test #4c - The topic to clear selected items was not published");}
            )
         .end();
      },
      "Test Multiple Item Selection": function () {

         var browser = this.remote;

         // Simulate selection of an item...
         return browser.findByCssSelector("#SELECT_ITEM_1_label")
            .click()
         .end()
         .findByCssSelector("#SELECT_ITEM_2_label")
            .click()
         .end()

         // Sleep is required for selection timeout...
         .sleep(100)

         .findByCssSelector("#SELECTED_ITEMS_text")
            .click()
         .end()

         // Click the menu item...
         .findByCssSelector("#MENU_ITEM_text")
            .click()
         .end()

         .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("TEST_ITEMS","selectedItems","data","item_one"))
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Test #5a - Didn't find selected item in publication payload");
            })
         .end()

         .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("TEST_ITEMS","selectedItems","data","item_two"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Test #6a - Didn't find selected item in publication payload");
            })
         .end()
         .alfPostCoverageResults(browser);
      }
   };
   });
});