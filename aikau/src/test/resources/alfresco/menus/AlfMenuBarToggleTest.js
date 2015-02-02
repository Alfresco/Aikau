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

   var alfPause = 200;
   var browser;
   registerSuite({
      name: "AlfMenuBarToggle Test",
      "Test label of basic toggle": function () {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuBarToggle", "AlfMenuBarToggle").findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function (initialValue) {
               expect(initialValue).to.equal("Off", "The inital label of the basic toggle was not correct: " + initialValue);
            })
         .end();
      },
      "Test label of custom toggle": function() {
         this.remote.findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function (initialValue) {
               expect(initialValue).to.equal("On (Custom Label)", "The inital label of the custom toggle was not correct: " + initialValue);
            })
         .end();
      },
      "Test label for icon toggle is not displayed": function() {
         this.remote.findAllByCssSelector("#MENU_BAR_SELECT_WITH_ICON_text")
            .then(function(results) {
               expect(results).to.have.length(0, "Label for icon toggle was displayed and it shouldn't be");
            })
         .end();
      },
      "Test image for icon toggle is correct": function() {
         this.remote.findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-descending-icon")
            .then(function(){}, function() {
               assert(false, "Image for icon toggle had wrong or missing CSS class");
            })
            .end();
      },
      "Test mouse click on basic toggle": function () {
         return this.remote.findById("BASIC_MENU_BAR_TOGGLE_text")
            .click()
         .end()
         .findByCssSelector(TestCommon.topicSelector("ALF_WIDGET_PROCESSING_COMPLETE", "publish", "last"))
            .then(function(){}, function() {
               assert(false, "Mouse selection of basic toggle published unexpectedly (although it has no publishTopic)");
            })
         .end();
      },
      "Test label updated after toggle after mouse": function () {
         return this.remote.findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function(resultText) {
               expect(resultText).to.equal("On", "The label was not updated after toggle by mouse: " + resultText);
            })
         .end();
      },
      "Test value publication of custom toggle after mouse click": function () {
         return this.remote.findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "OFF"))
            .then(function(){}, function() {
               assert(false, "Mouse selection of custom toggle didn't publish value correctly");
            })
         .end();
      },
      "Test id publication of custom toggle after mouse click": function () {
         return this.remote.findByCssSelector(TestCommon.pubSubDataCssSelector("last", "clicked", "TOGGLE_WITH_LABEL"))
            .then(function(){}, function() {
               assert(false, "Mouse selection of custom toggle didn't publish id correctly");
            })
         .end();
      },
      "Test label update of custom toggle after mouse click": function () {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function(resultText) {
               expect(resultText).to.equal("Off (Custom Label)", "The label was not updated after toggle by mouse: " + resultText);
            })
         .end();
      },
      "Test value publication of icon toggle after mouse click": function () {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "ON"))
            .then(function(){}, function() {
               assert(false, "Mouse selection of icon toggle didn't publish value correctly");
            })
         .end();
      },
      "Test id publication of icon toggle after mouse click": function () {
         return this.remote.findByCssSelector(TestCommon.pubSubDataCssSelector("last", "clicked", "TOGGLE_WITH_ICON"))
            .then(function(){}, function() {
               assert(false, "Mouse selection of icon toggle didn't publish id correctly");
            })
         .end();
      },
      "Test CSS of icon toggle after mouse click": function () {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-ascending-icon")
            .then(function(){}, function() {
               assert(false, "Test #1h - Image for icon toggle had wrong or missing CSS class after update by mouse");
            })
            .end().alfPostCoverageResults(browser);
      },
      "Test basic toggle publication by keyboard": function () {
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuBarToggle", "AlfMenuBarToggle Keyboard Tests").sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
         .end()
         .findByCssSelector(TestCommon.topicSelector("ALF_WIDGET_PROCESSING_COMPLETE", "publish", "last"))
            .then(function(){}, function() {
               assert(false, "Keyboard selection of basic toggle published unexpectedly (although it has no publishTopic)");
            })
         .end();
      },
      "Test label update after basic toggle by keyboard": function () {
         return this.remote.findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function(resultText) {
               expect(resultText).to.equal("On", "The label was not updated after toggle by keyboard: " + resultText);
            })
         .end();
      },
      "Test publication of basic toggle by keyboard": function () {
         return this.remote.pressKeys(keys.ARROW_RIGHT)
         .sleep(alfPause)
         .pressKeys(keys.RETURN)
         // .end()
         .findByCssSelector(TestCommon.topicSelector("CLICK", "publish", "last"))
            .then(function(){}, function() {
               assert(false, "Keyboard selection of custom toggle didn't publish topic as expected");
            })
         .end();
      },
      "Test value publication update after custom toggle by keyboard": function () {
         return this.remote.findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "OFF"))
            .then(function(){}, function() {
               assert(false, "Keyboard selection of custom toggle didn't publish value correctly");
            })
         .end();
      },
      "Test id publication update after custom toggle by keyboard": function () {
         return this.remote.findByCssSelector(TestCommon.pubSubDataCssSelector("last", "clicked", "TOGGLE_WITH_LABEL"))
            .then(function(){}, function() {
               assert(false, "Keyboard selection of custom toggle didn't publish id correctly");
            })
         .end();
      },
      "Test label update after custom toggle by keyboard": function () {
         return this.remote.findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function(resultText) {
               expect(resultText).to.equal("Off (Custom Label)", "The custom toggle label was not updated after toggle by keyboard: " + resultText);
            })
            .end();
      },
      "Test topic publication after icon toggle by keyboard": function () {
         return this.remote.pressKeys(keys.ARROW_RIGHT)
         .sleep(alfPause)
         .pressKeys(keys.RETURN)
         .findByCssSelector(TestCommon.topicSelector("CLICK", "publish", "last"))
            .then(function(){}, function() {
               assert(false, "Keyboard selection of icon toggle didn't publish topic as expected");
            })
         .end();
      },
      "Test value publication after icon toggle by keyboard": function () {
         return this.remote.findByCssSelector(TestCommon.pubSubDataCssSelector("last", "value", "ON"))
            .then(function(){}, function() {
               assert(false, "Keyboard selection of icon toggle didn't publish value correctly");
            })
         .end();
      },
      "Test id publication after icon toggle by keyboard": function () {
         return this.remote.findByCssSelector(TestCommon.pubSubDataCssSelector("last", "clicked", "TOGGLE_WITH_ICON"))
            .then(function(){}, function() {
               assert(false, "Keyboard selection of icon toggle didn't publish id correctly");
            })
         .end();
      },
      "Test CSS after icon toggle by keyboard": function () {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-ascending-icon")
            .then(function(){}, function() {
               assert(false, "Image for icon toggle had wrong or missing CSS class after keyboard toggle");
            })
         .end().alfPostCoverageResults(browser);
      },
      "Test external publication updates label (basic toggle) ON": function () {
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuBarToggle", "AlfMenuBarToggle Set State Tests").findById("TEST_BUTTON_ASC")
            .click()
         .end()
         .findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function (initialValue) {
               expect(initialValue).to.equal("On", "The asc label of the basic toggle was not correct: " + initialValue);
            })
         .end();
      },
      "Test external publication updates label (custom toggle) ON": function () {
         return this.remote.findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function (initialValue) {
               expect(initialValue).to.equal("On (Custom Label)", "The asc label of the custom toggle was not correct: " + initialValue);
            })
         .end();
      },
      "Test external publication updates label (icon toggle) ON": function () {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-ascending-icon")
            .then(function(){}, function() {
               assert(false, "Image for asc icon toggle had wrong or missing CSS class");
            })
         .end();
      },
      "Test external publication updates label (basic toggle) OFF": function () {
         return this.remote.findById("TEST_BUTTON_DESC")
            .click()
         .end()
         .findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function (initialValue) {
               expect(initialValue).to.equal("Off", "Test #1d - The desc label of the basic toggle was not correct: " + initialValue);
            })
         .end();
      },
      "Test external publication updates label (custom toggle) OFF": function () {
         return this.remote.findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function (initialValue) {
               expect(initialValue).to.equal("Off (Custom Label)", "Test #1e - The desc label of the custom toggle was not correct: " + initialValue);
            })
            .end();
      },
      "Test external publication updates label (icon toggle) OFF": function () {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-descending-icon")
            .then(function(){}, function() {
               assert(false, "Test #1f - Image for desc icon toggle had wrong or missing CSS class");
            })
         .end().alfPostCoverageResults(browser);
      }
   });
});