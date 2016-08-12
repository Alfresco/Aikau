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
      name: "Selected Items Menu Test",
      testPage: "/SelectedItemsMenu",

      "Test Menu Initially Disabled": function() {
         return this.remote.findByCssSelector("#SELECTED_ITEMS.dijitDisabled");
      },

      "Test Selecting Item Enables Menu": function() {
         // Simulate selection of an item...
         return this.remote.findByCssSelector("#SELECT_ITEM_1_label")
            .click()
            .end()

         // Wait until publication of the selected items occurs...
         .getLastPublish("ALF_DOCLIST_FILE_SELECTION")
            .clearLog()

         // Check that the menu item is no longer disabled...
         .findAllByCssSelector("#SELECTED_ITEMS.dijitDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The menu was not disabled");
            });
      },

      "Test De-Selecting Item Disables Menu": function() {
         // Simulate de-selection of an item...
         return this.remote.findByCssSelector("#DESELECT_ITEM_1_label")
            .click()
            .end()

         // Wait until publication of the selected items occurs...
         .getLastPublish("ALF_DOCLIST_FILE_SELECTION")
            .clearLog()

         // Check that the menu item is now disabled again...
         .findByCssSelector("#SELECTED_ITEMS.dijitDisabled");
      },

      "Test Items Not Cleared": function() {
         // Add the item again...
         return this.remote.findByCssSelector("#SELECT_ITEM_1_label")
            .click()
            .end()

         // Wait until publication of the selected items occurs...
         .getLastPublish("ALF_DOCLIST_FILE_SELECTION")
            .clearLog()

         // Open the menu...
         .findByCssSelector("#SELECTED_ITEMS_text")
            .click()
            .end()

         // Click the second menu item (which is configured to NOT clear selected items)
         .findByCssSelector("#MENU_ITEM_NO_CLEAR_text")
            .click()
            .end()

         .getAllPublishes("ALF_CLEAR_SELECTED_ITEMS")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "The topic to clear selected items should NOT have been published");
            })
            .getAllPublishes("ALF_DOCLIST_FILE_SELECTION")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "Item selection topic should NOT have been published");
            })
            .clearLog();
      },

      "Test Menu Item Contains Selected Item": function() {
         // Add the item again...
         return this.remote.findByCssSelector("#SELECT_ITEM_1_label")
            .click()
            .end()

         // Wait until publication of the selected items occurs...
         .getLastPublish("ALF_DOCLIST_FILE_SELECTION")
            .clearLog()

         // Open the menu...
         .findByCssSelector("#SELECTED_ITEMS_text")
            .click()
            .end()

         // Click the menu item...
         .findByCssSelector("#MENU_ITEM_text")
            .click()
            .end()

         .getLastPublish("TEST_ITEMS")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "selectedItems.0.data", "item_one", "Didn't find selected item in publication payload");
            })
            .getLastPublish("ALF_CLEAR_SELECTED_ITEMS", "The topic to clear selected items was not published")
            .getLastPublish("ALF_DOCLIST_FILE_SELECTION", "The topic to clear selected items was not published")
            .clearLog();
      },

      "Test Menu Disabled After Item Click": function() {
         // Check that after the previous click the menu is disabled again...
         return this.remote.findByCssSelector("#SELECTED_ITEMS.dijitDisabled");
      },

      "Test Multiple Item Selection": function() {
         // Simulate selection of an item...
         return this.remote.findByCssSelector("#SELECT_ITEM_1_label")
            .click()
            .end()

         .findByCssSelector("#SELECT_ITEM_2_label")
            .click()
            .end()

         // Wait until publication of the selected items occurs...
         .getLastPublish("ALF_DOCLIST_FILE_SELECTION")
            .clearLog()

         .findByCssSelector("#SELECTED_ITEMS_text")
            .click()
            .end()

         // Click the menu item...
         .findByCssSelector("#MENU_ITEM_text")
            .click()
            .end()

         .getLastPublish("TEST_ITEMS")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "selectedItems.0.data", "item_one", "Didn't find first selected item in publication payload");
               assert.deepPropertyVal(payload, "selectedItems.1.data", "item_two", "Didn't find second selected item in publication payload");
            });
      }
   });

   defineSuite(module, {
         name: "Selected Items Menu Test (Passive)",
         testPage: "/SelectedItemsMenu?passive=true",

         "Test Menu Initially Disabled": function() {
            return this.remote.findByCssSelector("#SELECTED_ITEMS.dijitDisabled");
         },

         "Select items menu initially disabled": function() {
            return this.remote.findByCssSelector("#UPDATE_SELECTED_ITEMS.dijitDisabled");
         }
   });

});