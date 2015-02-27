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
 * This is the unit test for the alfresco/menus/AlfMenuBarSelectItems widget.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "AlfMenuBarSelectItems Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuBarSelectItems", "AlfMenuBarSelectItems Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Tests": function () {
         // Test #1
         // Check that the subscription is set-up correctly
         return browser.findByCssSelector(TestCommon.topicSelector("MENU_BAR_SELECT_ITEMS"))
               .then(null, function() {
                  assert(false, "Test #1 - A subscription for the widget could not be found");
               })
               .end()

            // Test #2
            // Check that nothing is selected on page load...
            .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
               .then(function(result) {
                  assert(result === "0", "Test #2 - There should be nothing selected on page load");
               })
               .end()

            // Test #3
            // Check clicking on the "Select All" item...
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS")
               .click()
               .end()
            .findByCssSelector("#SELECT_ALL")
               .click()
               .end()
            .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
               .then(function(result) {
                  assert(result === "2", "Test #3 - _itemsSelected should be 2 after clicking on ALL");
               })

            .findByCssSelector(TestCommon.topicSelector("MENU_BAR_SELECT_ITEMS", "publish", "last"))
               .then(null, function() {
                  assert(false, "Test #3 - Mouse selection of ALL didn't publish correctly (missing publish topic)");
               })
               .end()

            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "selectAll"))
               .then(null, function() {
                  assert(false, "Test #3 - Mouse selection of ALL didn't publish correctly (incorrect \"value\" payload attribute");
               })
               .end()
            
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-allselected-icon")
               .then(null, function() {
                  assert(false, "Test #3 - Mouse selection of ALL set the correct CSS class.");
               })
               .end()

            // Test #4
            // Clicking on the "checkbox" should now deselect everything...
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img")
               .click()
               .end()

            .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
               .then(function(result) {
                  assert(result === "0", "Test #4 - _itemsSelected should be 0 after clicking on checkbox image");
               })
               .end()

            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "selectNone"))
               .then(null, function() {
                  assert(false, "Test #4 - Mouse click on ALL checkbox image didn't publish correctly (incorrect \"value\" payload attribute");
               })
               .end()

            .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-noneselected-icon")
               .then(null, function() {
                  assert(false, "Test #4 - Mouse click on ALL checkbox didn't set the correct CSS class.");
               })
               .end()
            
            // Test #5
            // Check clicking on the "Some" menu item...
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS")
               .click()
               .end()
            .findByCssSelector("#SELECT_SOME_BY_ITEMS")
               .click()
               .end()
            .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
               .then(function(result) {
                  assert(result === "1", "Test #5 - _itemsSelected should be 1 after clicking on SOME");
               })
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "availableItemCount", "2"))
               .then(null, function() {
                  assert(false, "Test #5 - Mouse selection of SOME didn't publish correctly (incorrect \"availableItemCount\" payload attribute");
               })
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "selectedItemCount", "1"))
               .then(null, function() {
                  assert(false, "Test #5 - Mouse selection of SOME didn't publish correctly (incorrect \"selectedItemCount\" payload attribute");
               })
               .end()
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-someselected-icon")
               .then(null, function() {
                  assert(false, "Test #5 - Mouse selection of SOME set the correct CSS class.");
               })
               .end()

            // Test #6
            // Clicking on the "checkbox" should move "SOME" to "ALL"...
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img")
               .click()
               .end()
            .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
               .then(function(result) {
                  assert(result === "2", "Test #6 - _itemsSelected should be 2 after clicking on the SOME checkbox image");
               })
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "selectAll"))
               .then(null, function() {
                  assert(false, "Test #6 - Mouse click on SOME checkbox image didn't publish correctly (incorrect \"value\" payload attribute");
               })
               .end()
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-allselected-icon")
               .then(null, function() {
                  assert(false, "Test #6 - Mouse click on SOME checkbox didn't set the correct CSS class.");
               })
               .end()

            // Test #7
            // Check clicking on the "None (by Items)" menu item will set the none state...
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS")
               .click()
               .end()
            .findByCssSelector("#SELECT_NONE_BY_ITEMS")
               .click()
               .end()
            .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
               .then(function(result) {
                  assert(result === "0", "Test #7 - _itemsSelected should be 0 after clicking on NONE (by items)");
               })
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "availableItemCount", "2"))
               .then(null, function() {
                  assert(false, "Test #7 - Mouse selection of NONE (by items) didn't publish correctly (incorrect \"availableItemCount\" payload attribute");
               })
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "selectedItemCount", "0"))
               .then(null, function() {
                  assert(false, "Test #7 - Mouse selection of NONE (by items) didn't publish correctly (incorrect \"selectedItemCount\" payload attribute");
               })
               .end()
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-noneselected-icon")
               .then(null, function() {
                  assert(false, "Test #7 - Mouse selection of NONE (by items) set the correct CSS class.");
               })
               .end()

            // Test #8
            // Check clicking on the "All (by Items)" menu item will set the all state...
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS")
               .click()
               .end()
            .findByCssSelector("#SELECT_ALL_BY_ITEMS")
               .click()
               .end()
            .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
               .then(function(result) {
                  assert(result === "2", "Test #8 - _itemsSelected should be 2 after clicking on ALL (by items)");
               })
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "availableItemCount", "2"))
               .then(null, function() {
                  assert(false, "Test #8 - Mouse selection of ALL (by items) didn't publish correctly (incorrect \"availableItemCount\" payload attribute");
               })
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "selectedItemCount", "2"))
               .then(null, function() {
                  assert(false, "Test #8 - Mouse selection of ALL (by items) didn't publish correctly (incorrect \"selectedItemCount\" payload attribute");
               })
               .end()
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-allselected-icon")
               .then(null, function() {
                  assert(false, "Test #8 - Mouse selection of ALL (by items) set the correct CSS class.");
               })
               .end()

            // Test #9
            // Check clicking on the "Select None" item...
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS")
               .click()
               .end()
            .findByCssSelector("#SELECT_NONE")
               .click()
               .end()
            .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
               .then(function(result) {
                  assert(result === "0", "Test #9 - _itemsSelected should be 0 after clicking on NONE");
               })
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "selectNone"))
               .then(null, function() {
                  assert(false, "Test #9 - Mouse selection of NONE didn't publish correctly (incorrect \"value\" payload attribute");
               })
               .end()
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-noneselected-icon")
               .then(null, function() {
                  assert(false, "Test #9 - Mouse selection of NONE set the correct CSS class.");
               })
               .end()

            // Test #10
            // Clicking on the "checkbox" should move "NONE" to "ALL"...
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img")
               .click()
               .end()
            .execute("return dijit.registry.byId(\"MENU_BAR_SELECT_ITEMS\")._itemsSelected.toString()")
               .then(function(result) {
                  assert(result === "2", "Test #10 - _itemsSelected should be 2 after clicking on the NONE checkbox image");
               })
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "selectAll"))
               .then(null, function() {
                  assert(false, "Test #10 - Mouse click on NONE checkbox image didn't publish correctly (incorrect \"value\" payload attribute");
               })
               .end()
            .findByCssSelector("#MENU_BAR_SELECT_ITEMS>img.alf-allselected-icon")
               .then(null, function() {
                  assert(false, "Test #10 - Mouse click on NONE checkbox didn't set the correct CSS class.");
               });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});