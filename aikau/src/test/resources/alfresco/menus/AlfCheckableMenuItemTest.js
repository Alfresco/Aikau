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
 * This is the unit test for the alfresco/menus/AlfCheckableMenuItem widget.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

   registerSuite({
      name: 'AlfCheckableMenuItem Test',
      'alfresco/menus/AlfCheckableMenuItem': function () {

         var browser = this.remote;
         var testName = "Checkable Menu Item Test";
         return TestCommon.loadTestWebScript(this.remote, "/AlfCheckableMenuItem", testName)

            // Test #1
            // Count the number of subscriptions to for the grouped checkable items, there should be 
            // 3 subscriptions - one for each item in the group...
            .findAllByCssSelector(TestCommon.topicSelector("ALF_CHECKABLE_MENU_ITEM__CHECKABLE_GROUP"))
               .then(function(elements) {
                  assert(elements.length == 3, "Test #1 - A subscription for each grouped checkable menu item was expected. There should be 3 but only " + elements.length + " were found.");
               })
               .end()

            // Test #2
            // Check that there is a subscription for checkable items with a publishTopic
            // (this is so that they can respond to external publications)
            .findByCssSelector(TestCommon.topicSelector("CHECKABLE_1"))
               .then(null, function() {
                  assert(false, "Test #2 - A subcription could not be found for a checkable menu item with a publish topic");
               })
               .end()

            // Test #3
            // Check that there is NOT a subcription for checkable items WITHOUT a publishTopic
            .findByCssSelector(TestCommon.topicSelector("CHECKABLE_3"))
               .then(
                  function() {
                     // FOUND (error)
                     assert(false, "Test #3 - An unexpected subcription was found for a checkable menu item");
                  },
                  function() {
                     // DIDN'T FIND (success)
                     assert(true, "Test #3 - Did NOT find menu item as expected");
                  })
               .end()

            // Test #4
            // Check that the first checkable item is NOT checked by default...
            .execute('return dijit.registry.byId("CHECKABLE_1").checked.toString()')
            .then(function(result) {
               assert(result == "false", "Test #4 - The menu item was NOT checked on page load");
            })

            // Test #5
            // Check that the SECOND checkable item IS checked by default...
            .execute('return dijit.registry.byId("CHECKABLE_2").checked.toString()')
            .then(function(result) {
               assert(result == "true", "Test #5 - The menu item SHOULD HAVE BEEN checked on page load");
            })

            // Test #6
            // Check that the first grouped checkable item IS checked and the other two aren't...
            .execute('return dijit.registry.byId("GROUPED_CHECKABLE_1").checked.toString()')
            .then(function(result) {
               assert(result == "true", "Test #6 - The first GROUPED menu item SHOULD HAVE BEEN checked on page load");
            })
            .execute('return dijit.registry.byId("GROUPED_CHECKABLE_2").checked.toString()')
            .then(function(result) {
               assert(result == "false", "Test #6 - The second GROUPED menu item was NOT checked on page load");
            })
            .execute('return dijit.registry.byId("GROUPED_CHECKABLE_3").checked.toString()')
            .then(function(result) {
               assert(result == "false", "Test #6 - The first GROUPED menu item was NOT checked on page load");
            })

            // Test #7
            // Check that a checked menu item has a tick displayed
            .findByCssSelector("tr#CHECKABLE_2>td.alf-selected-icon")
               .then(null, function() {
                  assert(false, "Test #7 - A checked menu item should have the alf-selected-icon class applied to it");
               })
               .end()

            // Test #8
            // Check that an UNCHECKED menu item does NOT have tick displayed
            .findByCssSelector("tr#CHECKABLE_1>td.alf-selected-icon")
               .then(
                  function() {
                     // FOUND == ERROR
                     assert(false, "Test #8 - An UNCHECKED menu item should NOT have the alf-selected-icon class applied to it");
                  },
                  function() {
                     // NOT FOUND == SUCCESS
                     assert(true, "Not found as expected");
                  })
               .end()

            // Test #9
            // Check that an externally published topic can set a check box...
            .findByCssSelector("#SET_CHECKABLE_1_label")
               .click()
               .end()
            .execute('return dijit.registry.byId("CHECKABLE_1").checked.toString()')
               .then(function(result) {
                  assert(result == "true", "Test #9 - The first menu item have been CHECKED following an external publish");
               })
               .end()

            // Test #10
            // Check that an externally published topic can unset a check box...
            .findByCssSelector("#UNSET_CHECKABLE_1_label")
               .click()
               .end()
            .execute('return dijit.registry.byId("CHECKABLE_1").checked.toString()')
               .then(function(result) {
                  assert(result == "false", "Test #10 - The first menu item have been UNCHECKED following an external publish");
               })
               .end()

            // Test #11
            // Check that an externally published topic updates a group accordingly...
            .findByCssSelector("#SET_GROUPED_CHECKABLE_2_label")
               .click()
               .end()
            .execute('return dijit.registry.byId("GROUPED_CHECKABLE_1").checked.toString()')
               .then(function(result) {
                  assert(result == "false", "Test #11 - The first GROUPED menu item have been UNCHECKED following an external publish");
               })
               .end()
            .execute('return dijit.registry.byId("GROUPED_CHECKABLE_2").checked.toString()')
               .then(function(result) {
                  assert(result == "true", "Test #11 - The second GROUPED menu item have been CHECKED following an external publish");
               })
               .end()

            // Test #12
            // Use mouse navigation to drive the checkable menu items...
            .findByCssSelector("#CHECKABLE_MENU_ITEMS_DROPDOWN")
               .click()
               .end()
            .findByCssSelector("#CHECKABLE_1")
               .click()
               .end()
            .findByCssSelector(TestCommon.topicSelector("CHECKABLE_1", "publish", "last"))
               .then(null, function() {
                  assert(false, "Test #12 - Mouse selection of CHECKABLE_1 didn't publish correctly (missing publish topic)");
               })
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "selected", "true"))
               .then(null, function() {
                  assert(false, "Test #12 - Mouse selection of CHECKABLE_1 didn't publish correctly (incorrect 'selected' payload attribute");
               })
               .end()
            .findByCssSelector("#CHECKABLE_MENU_ITEMS_DROPDOWN")
               .click()
               .end()
            .findByCssSelector("#CHECKABLE_1")
               .click()
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "selected", "false"))
               .then(null, function() {
                  assert(false, "Test #12 - Mouse de-selection of CHECKABLE_1 didn't publish correctly (incorrect 'selected' payload attribute");
               })
               .end()

            // Test #13
            // Use keyboard navigation to drive the checkable menu items...
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(1000)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.topicSelector("CHECKABLE_2", "publish", "last"))
               .then(null, function() {
                  assert(false, "Test #13 - Keyboard selection of CHECKABLE_2 didn't publish correctly");
               })
               .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "selected", "false"))
               .then(null, function() {
                  assert(false, "Test #13 - Keyboard selection of CHECKABLE_2 didn't publish correctly (incorrect 'selected' payload attribute");
               })
               .end()
            
            // The second checkable item has some additional data in the payload, check that it has also been published...
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "clicked", "CHECKABLE_2"))
               .then(null, function() {
                  assert(false, "Test #13 - Keyboard selection of CHECKABLE_2 didn't publish additional payload attribute");
               })
               .end()
            
            // Test #14
            // Use keyboard navigation to drive the grouped checkable menu items...
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(1000)
            .pressKeys(keys.RETURN)
            .findByCssSelector(TestCommon.topicSelector("ALF_CHECKABLE_MENU_ITEM__CHECKABLE_GROUP", "publish"))
               .then(null, function() {
                  assert(false, "Test #14 - Keyboard selection of grouped item didn't publish to group");
               })
               .end()
            .execute('return dijit.registry.byId("GROUPED_CHECKABLE_1").checked.toString()')
               .then(function(result) {
                  assert(result == "true", "Test #14 - The first GROUPED menu item should have been CHECKED following keyboard navigation");
               })
               .end()
            .execute('return dijit.registry.byId("GROUPED_CHECKABLE_2").checked.toString()')
               .then(function(result) {
                  assert(result == "false", "Test #14 - The second GROUPED menu item should have been UNCHECKED following keyboard navigation");
               })
               .end()
            .execute('return dijit.registry.byId("GROUPED_CHECKABLE_3").checked.toString()')
               .then(function(result) {
                  assert(result == "false", "Test #14 - The third GROUPED menu item should have been UNCHECKED following keyboard navigation");
               })
               .end()

            // Test #15
            // Use mouse navigation to drive the grouped checkable menu items...
            .findByCssSelector("#CHECKABLE_MENU_ITEMS_DROPDOWN")
               .click()
               .end()
            .findByCssSelector("#GROUPED_CHECKABLE_3")
               .click()
               .end()
            .findByCssSelector(TestCommon.topicSelector("ALF_CHECKABLE_MENU_ITEM__CHECKABLE_GROUP", "publish"))
               .then(null, function() {
                  assert(false, "Test #15 - Mouse selection of grouped item didn't publish to group");
               })
               .end()
            .execute('return dijit.registry.byId("GROUPED_CHECKABLE_1").checked.toString()')
               .then(function(result) {
                  assert(result == "false", "Test #15 - The first GROUPED menu item should have been UNCHECKED following mouse navigation");
               })
               .end()
            .execute('return dijit.registry.byId("GROUPED_CHECKABLE_2").checked.toString()')
               .then(function(result) {
                  assert(result == "false", "Test #15 - The second GROUPED menu item should have been UNCHECKED following mouse navigation");
               })
               .end()
            .execute('return dijit.registry.byId("GROUPED_CHECKABLE_3").checked.toString()')
               .then(function(result) {
                  assert(result == "true", "Test #15 - The third GROUPED menu item should have been CHECKED following mouse navigation");
               })
               .end()

            .alfPostCoverageResults(browser);
      }
   });
});