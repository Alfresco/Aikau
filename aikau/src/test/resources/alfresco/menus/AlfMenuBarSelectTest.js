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
 * This is the unit test for the alfresco/menus/AlfMenuBarSelect widget.
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
      name: "AlfMenuBarSelect Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuBarSelect", "AlfMenuBarSelect Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Tests": function () {
         // Test #1
         // Check that the subscriptions are set-up correctly
         return browser.findByCssSelector(TestCommon.topicSelector("MENU_BAR_SELECT"))
         .then(
            null,
            function(){assert(false, "Test #1 - A subscription for the basic widget could not be found");}
         )
         .end()

         .findByCssSelector(TestCommon.topicSelector("MENU_BAR_SELECT_VALUE"))
         .then(
            null,
            function(){assert(false, "Test #1 - A subcription for the widget that displays selected values could not be found");}
         )
         .end()

         .findByCssSelector(TestCommon.topicSelector("MENU_BAR_SELECT_WITH_ICONS"))
         .then(
            null,
            function(){assert(false, "Test #1 - A subcription for the widget that displays icons could not be found");}
         )
         .end()

         // Test #2
         // Check the initial labels are correctly displayed...
         .findByCssSelector("#MENU_BAR_SELECT_text")
         .getVisibleText()
         .then(function(resultText) {
            assert(resultText === "Select (label)...", "Test #2 - The inital label of the basic widget was not correct: " + resultText);
         })
         .end()

         .findByCssSelector("#MENU_BAR_SELECT_VALUE_text")
         .getVisibleText()
         .then(function(resultText) {
            assert(resultText === "Select (value)...", "Test #2 - The inital label of the basic widget was not correct: " + resultText);
         })
         .end()

         .findByCssSelector("#MENU_BAR_SELECT_WITH_ICON_text")
         .getVisibleText()
         .then(function(resultText) {
            assert(resultText === "Select (show icon)...", "Test #2 - The inital label of the basic widget was not correct: " + resultText);
         })
         .end()

         // Test #3
         // Use the keyboard to test label set (using label)...
         .pressKeys(keys.TAB)
         .pressKeys(keys.ARROW_DOWN)
         .sleep(1000)
         .pressKeys(keys.SPACE)
         .findByCssSelector(TestCommon.topicSelector("MENU_BAR_SELECT", "publish", "last"))
         .then(
            null,
            function(){assert(false, "Test #3 - Keyboard selection of 'Option 1' didn't publish correctly (missing topic)");}
         )
         .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "label", "Option 1 Selected"))
         .then(
            null,
            function(){assert(false, "Test #3 - Keyboard selection of 'Option 1' didn't publish correctly (incorrect 'label' payload attribute");}
         )
         .end()

         .findByCssSelector("#MENU_BAR_SELECT_text")
         .getVisibleText()
         .then(function(resultText) {
            assert(resultText === "Option 1 Selected", "Test #3 - The label was not updated correctly: " + resultText);
         })
         .end()

         // Test #4
         // Use the keyboard to test label set (using value)...
         .pressKeys(keys.ARROW_RIGHT)
         .sleep(1000)
         .pressKeys(keys.RETURN)
         .findByCssSelector(TestCommon.topicSelector("MENU_BAR_SELECT_VALUE", "publish", "last"))
         .then(
            null,
            function(){assert(false, "Test #4 - Keyboard selection of 'Option 1' didn't publish correctly (missing topic)");}
         )
         .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "Alpha"))
         .then(
            null,
            function(){assert(false, "Test #4 - Keyboard selection of 'Alpha' didn't publish correctly (incorrect 'value' payload attribute");}
         )
         .end()

         .findByCssSelector("#MENU_BAR_SELECT_VALUE_text")
         .getVisibleText()
         .then(function(resultText) {
            assert(resultText === "Alpha", "Test #4 - The label was not updated correctly (to use a value): " + resultText);
         })
         .end()

         // Test #5
         // Use the keyboard to test label set (using icons)...
         // TODO: This currently isn't working - ALF-20632 has been raised to capture this, when fixed this unit test should be updated

         // Test #6
         // Use the mouse to test label set (using label)...
         .findByCssSelector("#MENU_BAR_SELECT")
         .click()
         .end()

         .findByCssSelector("#SELECT_MENU_ITEM_2")
         .click()
         .end()
         
         .findByCssSelector(TestCommon.topicSelector("MENU_BAR_SELECT", "publish", "last"))
         .then(
            null,
            function(){assert(false, "Test #6 - Mouse selection of 'Option 2' didn't publish correctly (missing topic)");}
         )
         .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "label", "Option 2 Selected"))
         .then(
            null,
            function(){assert(false, "Test #6 - Mouse selection of 'Option 2' didn't publish correctly (incorrect 'label' payload attribute)");}
         )
         .end()

         .findByCssSelector("#MENU_BAR_SELECT_text")
         .getVisibleText()
         .then(function(resultText) {
            assert(resultText === "Option 2 Selected", "Test #6 - The label was not updated correctly: " + resultText);
         })
         .end()

         // Test #6
         // Use the mouse to test label set (using label)...
         .findByCssSelector("#MENU_BAR_SELECT_VALUE")
         .click()
         .end()

         .findByCssSelector("#SELECT_MENU_ITEM_4")
         .click()
         .end()

         .findByCssSelector(TestCommon.topicSelector("MENU_BAR_SELECT_VALUE", "publish", "last"))
         .then(
            null,
            function(){assert(false, "Test #6 - Mouse selection of 'Beta' didn't publish correctly (missing topic)");}
         )
         .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "Beta"))
         .then(
            null,
            function(){assert(false, "Test #6 - Mouse selection of 'Beta' didn't publish correctly (incorrect 'value' payload attribute)");}
         )
         .end()
         
         .findByCssSelector("#MENU_BAR_SELECT_VALUE_text")
         .getVisibleText()
         .then(function(resultText) {
            assert(resultText === "Beta", "Test #6 - The label was not updated correctly: " + resultText);
         })
         .end()

         // Test #7
         // Use the mouse to test label set (using icon)...
         // TODO: This currently isn't working - ALF-20632 has been raised to capture this, when fixed this unit test should be updated

         // Test #8
         // Set the label using an external publication...

         .findByCssSelector("#SET_WITH_LABEL_label")
         .click()
         .end()

         .findByCssSelector("#MENU_BAR_SELECT_text")
         .getVisibleText()
         .then(function(resultText) {
            assert(resultText === "Alternative Label", "Test #8 - The label was not updated correctly by an external publication: " + resultText);
         })
         .end()

         // Test #9
         // Set the label using an external publication...
         .findByCssSelector("#SET_WITH_VALUE_label")
         .click()
         .end()

         .findByCssSelector("#MENU_BAR_SELECT_VALUE_text")
         .getVisibleText()
         .then(function(resultText) {
            assert(resultText === "Alternative Value", "Test #9 - The label was not updated correctly by an external publication: " + resultText);
         });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});