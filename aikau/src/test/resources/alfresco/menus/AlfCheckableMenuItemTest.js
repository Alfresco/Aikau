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

   var browser;
   registerSuite({
      name: "Checkable Menu Item Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfCheckableMenuItem", "Checkable Menu Item Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // Count the number of subscriptions to for the grouped checkable items, there should be 
      // 3 subscriptions - one for each item in the group...
      "Test registered subscription count": function () {
         return browser.findAllByCssSelector(TestCommon.topicSelector("ALF_CHECKABLE_MENU_ITEM__CHECKABLE_GROUP"))
            .then(function(elements) {
               assert.lengthOf(elements, 3, "A subscription for each grouped checkable menu item was expected.");
            });
      },

      // Check that there is a subscription for checkable items with a publishTopic
      // (this is so that they can respond to external publications)
      "Test subscription for each checkable item with publishTopic": function() {
         return browser.findByCssSelector(TestCommon.topicSelector("CHECKABLE_1"))
            .then(null, function() {
               assert(false, "Test #2 - A subcription could not be found for a checkable menu item with a publish topic");
            });
      },

      // Check that there is NOT a subcription for checkable items WITHOUT a publishTopic
      "Test there is no subscription for checkable item WITHOUT a publishTopic": function() {
         return browser.findByCssSelector(TestCommon.topicSelector("CHECKABLE_3"))
            .then(
               function() {
                  // FOUND (error)
                  assert(false, "An unexpected subcription was found for a checkable menu item");
               },
               function() {
                  // DIDN'T FIND (success)
                  assert(true, "Did NOT find menu item as expected");
               });
      },

      "Test that first checkable item is not initially checked": function() {
         return browser.execute("return dijit.registry.byId('CHECKABLE_1').checked")
            .then(function(result) {
               assert.isFalse(result, "The menu item was NOT checked on page load");
            });
      },

      "Test that second checkable item IS initially checked": function() {
         return browser.execute("return dijit.registry.byId('CHECKABLE_2').checked")
            .then(function(result) {
               assert.isTrue(result, "The menu item SHOULD HAVE BEEN checked on page load");
            });
      },

      "Test that first grouped checkable menu item IS checked on page load": function() {
         return browser.execute("return dijit.registry.byId('GROUPED_CHECKABLE_1').checked")
            .then(function(result) {
               assert.isTrue(result, "The first GROUPED menu item SHOULD HAVE BEEN checked on page load");
            });
      },

      "Test that second grouped checkable item is NOT checked on page load": function() {
         return browser.execute("return dijit.registry.byId('GROUPED_CHECKABLE_2').checked")
            .then(function(result) {
               assert.isFalse(result, "The second GROUPED menu item was NOT checked on page load");
            });
      },

      "Test that third grouped checkable item is NOT checked on page load": function() {
         return browser.execute("return dijit.registry.byId('GROUPED_CHECKABLE_3').checked")
            .then(function(result) {
               assert.isFalse(result, "The first GROUPED menu item was NOT checked on page load");
            });
      },

      "Test that a checked menu item has a tick displayed": function() {
         return browser.findByCssSelector("tr#CHECKABLE_2 > td.alf-selected-icon")
            .then(null, function() {
               assert(false, "A checked menu item should have the alf-selected-icon class applied to it");
            });
      },

      "Test that an unchecked menu item does NOT have a tick displayed": function() {
         return browser.findByCssSelector("tr#CHECKABLE_1>td.alf-selected-icon")
            .then(
               function() {
                  // FOUND == ERROR
                  assert(false, "An UNCHECKED menu item should NOT have the alf-selected-icon class applied to it");
               },
               function() {
                  // NOT FOUND == SUCCESS
                  assert(true, "Not found as expected");
               });
      },

      "Test that an externally published topic can set a check box": function() {
         return browser.findByCssSelector("#SET_CHECKABLE_1_label")
            .click()
         .end()
         .execute("return dijit.registry.byId('CHECKABLE_1').checked")
            .then(function(result) {
               assert(result === "true", "The first menu item has not been CHECKED following an external publish");
            });
      },

      "Test than an externally published topic can unset a check box": function() {
         return browser.findByCssSelector("#UNSET_CHECKABLE_1_label")
            .click()
         .end()
         .execute("return dijit.registry.byId('CHECKABLE_1').checked")
            .then(function(result) {
               assert.isFalse(result, "The first menu item have been UNCHECKED following an external publish");
            });
      },

      "Test that externally published topic updates a group": function() {
         return browser.findByCssSelector("#SET_GROUPED_CHECKABLE_2_label")
            .click()
         .end()
         .execute("return dijit.registry.byId('GROUPED_CHECKABLE_1').checked")
            .then(function(result) {
               assert.isFalse(result, "The first GROUPED menu item have been UNCHECKED following an external publish");
            })
         .execute("return dijit.registry.byId('GROUPED_CHECKABLE_2').checked")
            .then(function(result) {
               assert.isTrue(result, "The second GROUPED menu item have been CHECKED following an external publish");
            });
      },

      "Test checking a menu item publishes topic correctly (mouse)": function() {
         return browser.findByCssSelector("#CHECKABLE_MENU_ITEMS_DROPDOWN")
            .click()
         .end()
         .findByCssSelector("#CHECKABLE_1")
            .click()
         .end()
         .findByCssSelector(TestCommon.topicSelector("CHECKABLE_1", "publish", "last"))
            .then(null, function() {
               assert(false, "Mouse selection of CHECKABLE_1 didn't publish correctly (missing publish topic)");
            })
         .end()
         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "selected", "true"))
            .then(null, function() {
               assert(false, "Mouse selection of CHECKABLE_1 didn't publish correctly (incorrect 'selected' payload attribute");
            });
      },

      "Test unchecking a menu item publishes topic correctly (mouse)": function() {
         return browser.findByCssSelector("#CHECKABLE_MENU_ITEMS_DROPDOWN")
            .click()
         .end()
         .findByCssSelector("#CHECKABLE_1")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "selected", "false"))
            .then(null, function() {
               assert(false, "Mouse de-selection of CHECKABLE_1 didn't publish correctly (incorrect 'selected' payload attribute");
            });
      },

      "Test checking a menu item publishes topic correctly (keyboard)": function() {
         return browser.pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(1000)
            .pressKeys(keys.SPACE)
            .findByCssSelector(TestCommon.topicSelector("CHECKABLE_2", "publish", "last"))
               .then(null, function() {
                  assert(false, "Keyboard selection of CHECKABLE_2 didn't publish correctly");
               })
            .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "selected", "false"))
               .then(null, function() {
                  assert(false, "Keyboard selection of CHECKABLE_2 didn't publish correctly (incorrect 'selected' payload attribute");
               })
            .end()
            .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "clicked", "CHECKABLE_2"))
               .then(null, function() {
                  assert(false, "Keyboard selection of CHECKABLE_2 didn't publish additional payload attribute");
               })
            .end();
      },

      "Test checking grouped item using keyboard": function() {
         return browser.pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(1000)
            .pressKeys(keys.RETURN)
            .findByCssSelector(TestCommon.topicSelector("ALF_CHECKABLE_MENU_ITEM__CHECKABLE_GROUP", "publish"))
               .then(null, function() {
                  assert(false, "Test #14 - Keyboard selection of grouped item didn't publish to group");
               })
         .execute("return dijit.registry.byId('GROUPED_CHECKABLE_1').checked")
            .then(function(result) {
               assert.isTrue(result, "The first GROUPED menu item should have been CHECKED following keyboard navigation");
            })
         .execute("return dijit.registry.byId('GROUPED_CHECKABLE_2').checked")
            .then(function(result) {
               assert.isFalse(result, "The second GROUPED menu item should have been UNCHECKED following keyboard navigation");
            })
         .execute("return dijit.registry.byId('GROUPED_CHECKABLE_3').checked")
            .then(function(result) {
               assert.isFalse(result, "The third GROUPED menu item should have been UNCHECKED following keyboard navigation");
            });
      },

      "Test checking groups item using mouse": function() {
         return browser.findByCssSelector("#CHECKABLE_MENU_ITEMS_DROPDOWN")
               .click()
            .end()
            .findByCssSelector("#GROUPED_CHECKABLE_3")
               .click()
            .end()
            .findByCssSelector(TestCommon.topicSelector("ALF_CHECKABLE_MENU_ITEM__CHECKABLE_GROUP", "publish"))
               .then(null, function() {
                  assert(false, "Test #15 - Mouse selection of grouped item didn't publish to group");
               })
            .execute("return dijit.registry.byId('GROUPED_CHECKABLE_1').checked")
               .then(function(result) {
                  assert.isFalse(result, "The first GROUPED menu item should have been UNCHECKED following mouse navigation");
               })
            .execute("return dijit.registry.byId('GROUPED_CHECKABLE_2').checked")
               .then(function(result) {
                  assert.isFalse(result, "The second GROUPED menu item should have been UNCHECKED following mouse navigation");
               })
            .execute("return dijit.registry.byId('GROUPED_CHECKABLE_3').checked")
               .then(function(result) {
                  assert.isTrue(result, "The third GROUPED menu item should have been CHECKED following mouse navigation");
               });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});