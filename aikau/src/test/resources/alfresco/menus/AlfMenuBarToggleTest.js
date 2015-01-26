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
 * The purpose of this test is to ensure that keyboard accessibility is possible between the header and the 
 * main table. It should be possible to use the tab/shift-tab keys to navigate along the headers (and the enter/space key
 * to make requests for sorting) and then the cursor keys to navigate around the table itself.
 * 
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
      name: 'AlfMenuBarToggle Test',
      'Basic tests': function () {

         var browser = this.remote;
         var testName = "Menu Bar Toggle Test (basic)";
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuBarToggle", testName)

         // Check the initial labels are correctly displayed...
         .findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function (initialValue) {
               expect(initialValue).to.equal("Off", "Test #1a - The inital label of the basic toggle was not correct: " + initialValue);
            })
            .end()

         .findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function (initialValue) {
               expect(initialValue).to.equal("On (Custom Label)", "Test #1b - The inital label of the custom toggle was not correct: " + initialValue);
            })
            .end()

         .findAllByCssSelector("#MENU_BAR_SELECT_WITH_ICON_text")
            .then(function(results) {
               expect(results).to.have.length(0, "Test #1c - Label for icon toggle was displayed and it shouldn't be");
            })
            .end()

         .findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-descending-icon")
            .then(function(element){}, function(err) {
               assert(false, "Test #1d - Image for icon toggle had wrong or missing CSS class");
            })
            .end()

         .alfPostCoverageResults(browser);

      },

      'Mouse tests': function () {

         var browser = this.remote;
         var testName = "Menu Bar Toggle Test (mouse)";
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuBarToggle", testName)

         .findById("BASIC_MENU_BAR_TOGGLE_text")
            .click()
            .end()

         .findByCssSelector(TestCommon.topicSelector("ALF_WIDGETS_READY", "publish", "last"))
            .then(function(element){}, function(err) {
               assert(false, "Test #1a - Mouse selection of basic toggle published unexpectedly (although it has no publishTopic)");
            })
            .end()

         .findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function(resultText) {
               expect(resultText).to.equal("On", "Test #1b - The label was not updated after toggle by mouse: " + resultText);
            })
            .end()

         .findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .click()
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "OFF"))
            .then(function(element){}, function(err) {
               assert(false, "Test #1c - Mouse selection of custom toggle didn't publish value correctly");
            })
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "clicked", "TOGGLE_WITH_LABEL"))
            .then(function(element){}, function(err) {
               assert(false, "Test #1d - Mouse selection of custom toggle didn't publish id correctly");
            })
            .end()

         .findByCssSelector("#MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function(resultText) {
               expect(resultText).to.equal("Off (Custom Label)", "Test #1e - The label was not updated after toggle by mouse: " + resultText);
            })
            .end()

         .findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img")
            .click()
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "ON"))
            .then(function(element){}, function(err) {
               assert(false, "Test #1f - Mouse selection of icon toggle didn't publish value correctly");
            })
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "clicked", "TOGGLE_WITH_ICON"))
            .then(function(element){}, function(err) {
               assert(false, "Test #1g - Mouse selection of icon toggle didn't publish id correctly");
            })
            .end()

         .findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-ascending-icon")
            .then(function(element){}, function(err) {
               assert(false, "Test #1h - Image for icon toggle had wrong or missing CSS class after update by mouse");
            })
            .end()

         .alfPostCoverageResults(browser);

      },

      'Keyboard tests': function () {
         var alfPause = 200;
         var browser = this.remote;
         var testname = "AlfMenuBarToggle Test - Keyboard tests";
         var testName = "Menu Bar Toggle Test (Keyboard)";
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuBarToggle", testName)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .end()

         .findByCssSelector(TestCommon.topicSelector("ALF_WIDGETS_READY", "publish", "last"))
            .then(function(element){}, function(err) {
               assert(false, "Test #1a - Keyboard selection of basic toggle published unexpectedly (although it has no publishTopic)");
            })
            .end()

         .findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function(resultText) {
               TestCommon.log(testname,"Check basic toggle text is changed after keyboard selection");
               expect(resultText).to.equal("On", "Test #1b - The label was not updated after toggle by keyboard: " + resultText);
            })
            .end()

         .pressKeys(keys.ARROW_RIGHT)
         .sleep(alfPause)
         .pressKeys(keys.RETURN)
         .end()

         .findByCssSelector(TestCommon.topicSelector("CLICK", "publish", "last"))
            .then(function(element){}, function(err) {
               assert(false, "Test #1c - Keyboard selection of custom toggle didn't publish topic as expected");
            })
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "OFF"))
            .then(function(element){}, function(err) {
               assert(false, "Test #1d - Keyboard selection of custom toggle didn't publish value correctly");
            })
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "clicked", "TOGGLE_WITH_LABEL"))
            .then(function(element){}, function(err) {
               assert(false, "Test #1e - Keyboard selection of custom toggle didn't publish id correctly");
            })
            .end()

         .findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function(resultText) {
               TestCommon.log(testname,"Check custom toggle text is changed after keyboard selection");
               expect(resultText).to.equal("Off (Custom Label)", "Test #1f - The custom toggle label was not updated after toggle by keyboard: " + resultText);
            })
            .end()

         .pressKeys(keys.ARROW_RIGHT)
         .sleep(alfPause)
         .pressKeys(keys.RETURN)

         .findByCssSelector(TestCommon.topicSelector("CLICK", "publish", "last"))
            .then(function(element){}, function(err) {
               assert(false, "Test #1g - Keyboard selection of icon toggle didn't publish topic as expected");
            })
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "ON"))
            .then(function(element){}, function(err) {
               assert(false, "Test #1h - Keyboard selection of icon toggle didn't publish value correctly");
            })
            .end()

         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "clicked", "TOGGLE_WITH_ICON"))
            .then(function(element){}, function(err) {
               assert(false, "Test #1i - Keyboard selection of icon toggle didn't publish id correctly");
            })
            .end()

         .findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-ascending-icon")
            .then(function(element){}, function(err) {
               assert(false, "Test #1j - Image for icon toggle had wrong or missing CSS class after keyboard toggle");
            })
            .end()

         .alfPostCoverageResults(browser);

      },

      'Set state tests': function () {

         var browser = this.remote;
         var testname = "AlfMenuBarToggle Test - Set state tests";
         var testName = "Menu Bar Toggle Test (Set State)";
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuBarToggle", testName)
            .findById("TEST_BUTTON_ASC")
               .click()
               .end()

         .findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function (initialValue) {
               TestCommon.log(testname,"Check basic toggle label asc");
               expect(initialValue).to.equal("On", "Test #1a - The asc label of the basic toggle was not correct: " + initialValue);
            })
            .end()

         .findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function (initialValue) {
               TestCommon.log(testname,"Check custom toggle label asc");
               expect(initialValue).to.equal("On (Custom Label)", "Test #1b - The asc label of the custom toggle was not correct: " + initialValue);
            })
            .end()

         .findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-ascending-icon")
            .then(function(element){}, function(err) {
               assert(false, "Test #1c - Image for asc icon toggle had wrong or missing CSS class");
            })
            .end()

         .findById("TEST_BUTTON_DESC")
            .click()
            .end()

         .findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function (initialValue) {
               TestCommon.log(testname,"Check basic toggle label desc");
               expect(initialValue).to.equal("Off", "Test #1d - The desc label of the basic toggle was not correct: " + initialValue);
            })
            .end()

         .findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function (initialValue) {
               TestCommon.log(testname,"Check custom toggle label desc");
               expect(initialValue).to.equal("Off (Custom Label)", "Test #1e - The desc label of the custom toggle was not correct: " + initialValue);
            })
            .end()

         .findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-descending-icon")
            .then(function(element){}, function(err) {
               assert(false, "Test #1f - Image for desc icon toggle had wrong or missing CSS class");
            })
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});