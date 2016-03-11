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
 * This is the unit test for the alfresco/menus/AlfMenuBarSelectItems widget.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "AlfMenuBarSelectItems Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuBarSelectItems", "AlfMenuBarSelectItems Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "A subscription for the widget could not be found": function () {
         return browser.findByCssSelector(TestCommon.topicSelector("MENU_BAR_SELECT_ITEMS"))
               .then(null, function() {
                  assert.isFalse(false, "A subscription for the widget could not be found");
               });
      },

      "There should be nothing selected on page load": function() {
         return browser.execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
            .then(function(result) {
               assert.equal(result, "0", "There should be nothing selected on page load");
            });
      },

      "Click ALL": function() {
         return browser.findByCssSelector("#MENU_BAR_SELECT_ITEMS")
            .click()
         .end()
         .findByCssSelector("#SELECT_ALL")
            .click()
            .end()
         .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
            .then(function(result) {
               assert.equal(result, "2", "Items selected should be 2 after clicking on ALL");
            })
         .end()
         .getLastPublish("MENU_BAR_SELECT_ITEMS", "Mouse selection of ALL didn't publish correctly (missing publish topic)")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "selectAll", "Mouse selection of ALL didn't publish correctly");
            })
         .end()
         .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-allselected-icon")
            .then(null, function() {
               assert(false, "Expected CSS class not found on checkbox");
            });
      },

      "Click checkbox to deselect everything": function() {
            // Clicking on the "checkbox" should now deselect everything...
         return browser.findByCssSelector("#MENU_BAR_SELECT_ITEMS>img")
            .click()
         .end()
         .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
            .then(function(result) {
               assert.equal(result, "0", "Items selected should be 0 after clicking on checkbox image");
            })
         .end()
         .getLastPublish("ITEMS_SELECTED")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "selectNone", "Mouse selection of NONE didn't publish correctly");
            })
         .end()
         .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-noneselected-icon")
            .then(null, function() {
               assert(false, "Expected CSS class not found on checkbox");
            });
      },

      "Click 'Some (by Items)' menu item": function() {
         return browser.findById("MENU_BAR_SELECT_ITEMS_text")
            .click()
         .end()
         .findById("SELECT_SOME_BY_ITEMS_text")
            .click()
         .end()
         .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
            .then(function(result) {
               assert.equal(result, "1", "Items selected should be 1 after clicking on SOME");
            })
         .end()
         .getLastPublish("MENU_BAR_SELECT_ITEMS")
            .then(function(payload) {
               assert.propertyVal(payload, "availableItemCount", "2", "Incorrect availableItemCount");
               assert.propertyVal(payload, "selectedItemCount", "1", "Incorrect selectedItemCount");
            })
         .end()
         .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-someselected-icon")
            .then(null, function() {
               assert(false, "Expected CSS class not found on checkbox");
            })
            .getAttribute("alt")
               .then(function(text) {
                  assert.equal(text, "Some of the items are currently selected, click this icon to select all items");
               });
      },
            
      "Click checkbox to go from some to all": function() {
         return browser.findByCssSelector("#MENU_BAR_SELECT_ITEMS>img")
            .click()
         .end()
         .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
            .then(function(result) {
               assert.equal(result, "2", "ItemsSelected should be 2 after clicking on the SOME checkbox image");
            })
         .end()
         .getLastPublish("ITEMS_SELECTED")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "selectAll", "Clicking on checkbox didn't publish correctly");
            })
         .end()
         .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-allselected-icon")
            .then(null, function() {
               assert(false, "Expected CSS class not found on checkbox");
            });
      },
            
      "Click 'None (by Items)' menu item": function() {
         return browser.findById("MENU_BAR_SELECT_ITEMS_text")
            .click()
         .end()
         .findById("SELECT_NONE_BY_ITEMS_text")
            .click()
         .end()
         .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
            .then(function(result) {
               assert.equal(result, "0", "Items selected should be 0 after clicking on NONE (by items)");
            })
         .end()
         .getLastPublish("MENU_BAR_SELECT_ITEMS")
            .then(function(payload) {
               assert.propertyVal(payload, "availableItemCount", "2", "Incorrect availableItemCount");
               assert.propertyVal(payload, "selectedItemCount", "0", "Incorrect selectedItemCount");
            })
         .end()
         .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-noneselected-icon")
            .then(null, function() {
               assert(false, "Expected CSS class not found on checkbox");
            });
      },

      "Click 'All (by Items)' menu item": function() {
         return browser.findById("MENU_BAR_SELECT_ITEMS_text")
            .click()
         .end()
         .findById("SELECT_ALL_BY_ITEMS_text")
            .click()
         .end()
         .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
            .then(function(result) {
               assert.equal(result, "2", "Items selected should be 2 after clicking on NONE (by items)");
            })
         .end()
         .getLastPublish("MENU_BAR_SELECT_ITEMS")
            .then(function(payload) {
               assert.propertyVal(payload, "availableItemCount", "2", "Incorrect availableItemCount");
               assert.propertyVal(payload, "selectedItemCount", "2", "Incorrect selectedItemCount");
            })
         .end()
         .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-allselected-icon")
            .then(null, function() {
               assert(false, "Expected CSS class not found on checkbox");
            })
            .getAttribute("alt")
               .then(function(text) {
                  assert.equal(text, "All of the items are currently selected, click this icon remove all selections");
               });
      },

      "Click 'Select None' menu item": function() {
         return browser.findById("MENU_BAR_SELECT_ITEMS_text")
            .click()
         .end()
         .findById("SELECT_NONE_text")
            .click()
         .end()
         .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
            .then(function(result) {
               assert.equal(result, "0", "Items selected should be 0 after clicking on NONE (by items)");
            })
         .end()
         .getLastPublish("MENU_BAR_SELECT_ITEMS")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "selectNone", "Clicking on checkbox didn't publish correctly");
            })
         .end()
         .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-noneselected-icon")
            .then(null, function() {
               assert(false, "Expected CSS class not found on checkbox");
            })
            .getAttribute("alt")
               .then(function(text) {
                  assert.equal(text, "None of the items are currently selected, click this icon to select all of the items");
               });
      },

      "Click checkbox to go from none to all": function() {
         return browser.findByCssSelector("#MENU_BAR_SELECT_ITEMS>img")
            .click()
         .end()
         .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
            .then(function(result) {
               assert.equal(result, "2", "ItemsSelected should be 2 after clicking on the SOME checkbox image");
            })
         .end()
         .getLastPublish("ITEMS_SELECTED")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "selectAll", "Clicking on checkbox didn't publish correctly");
            })
         .end()
         .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-allselected-icon")
            .then(null, function() {
               assert(false, "Expected CSS class not found on checkbox");
            });
      },
      
      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});