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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function (registerSuite, expect, assert, require, TestCommon, keys) {

   var browser;
   registerSuite({
      name: "PublishingDropDownMenu Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/PublishingDropDownMenu", "PublishingDropDownMenu Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test drop down menu count": function () {
         return browser.findAllByCssSelector("div.alfresco-renderers-PublishingDropDownMenu")
            .then(function (dropdowns) {
               expect(dropdowns).to.have.length(3, "There should be 3 dropdown menus rendered, found: " + dropdowns.length);
            });
      },

      "Test first drop-down value is 'Public'": function() {
         return browser.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .getVisibleText()
            .then(function (result1) {
               expect(result1).to.equal("Public", "The start value of dropdown menu 1 should be 'Public'");
            });
      },

      "Test menu opens on mouse click": function() {
         return browser.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .click()
         .end()
         .findByCssSelector(".dijitMenuPopup")
            .then(null,function() {
               assert(false, "The drop down menu did not appear on mouse clicks");
            });
      },

      "Test menu is visible": function() {
         return browser.findByCssSelector(".dijitMenuPopup")
            .isDisplayed()
            .then(function(result3) {
               expect(result3).to.equal(true, "The drop down menu should be visible on mouse clicks");
             });
      },

      "Test menu code not removed on click": function() {
         // Select "Private" (should succeed)...
         return browser.findByCssSelector("tr.dijitMenuItem:nth-of-type(3)")
            .click()
         .end()
         .findByCssSelector(".dijitMenuPopup")
            .then(null, function() {
                assert(false, "The menu code should not have been removed");
            })
         .end()
         .findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .getVisibleText()
            .then(function (text) {
               assert.equal(text, "Private", "The drop-down was not reset on failure");
            });
      },

      "Test menu disappears after mouse click": function() {
         return browser.findByCssSelector(".dijitMenuPopup")
            .isDisplayed()
            .then(function(result5) {
               expect(result5).to.equal(false, "The drop down menu should be hidden after the mouse click");
            });
      },

      "Test menu selection published on mouse click": function() {
         return browser.findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_PUBLISHING_DROPDOWN_MENU", "alfTopic", "ALF_PUBLISHING_DROPDOWN_MENU"))
            .then(function(elements) {
               assert(elements.length === 1, "The menu did not publish on 'ALF_PUBLISHING_DROPDOWN_MENU' after mouse clicks, expected 1 found: " + elements.length);
            });
      },

      "Test menu success item is displayed": function() {
         return browser.findAllByCssSelector(".alfresco-renderers-PublishingDropDownMenu .indicator.success:not(.hidden)")
            .then(function(elements) {
               assert(elements.length === 1, "The success icon did not display");
            });
      },

      "Test menu failure item is displayed": function () {
         return browser.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .click()
         .end()
         // Select "Moderated" (should fail, and reset to "Private")...
         .findByCssSelector("tr.dijitMenuItem:nth-of-type(2)")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-renderers-PublishingDropDownMenu .indicator.warning:not(.hidden)")
            .then(function (elements) {
               assert(elements.length === 1, "The failure icon did not display");
            })
         .end()
         .findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .getVisibleText()
            .then(function (text) {
               assert.equal(text, "Private", "The drop-down was not reset on failure");
            });
      },

      "Test menu status icon is hidden on cancel": function () {
         return browser.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .click()
         .end()
         .findByCssSelector("tr.dijitMenuItem:nth-of-type(1)")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-renderers-PublishingDropDownMenu .indicator:not(.hidden)")
            .then(function (elements) {
               assert(elements.length === 0, "There is still a visible status icon when there shouldn't be");
            })
         .end()
         .findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .getVisibleText()
            .then(function (text) {
               assert.equal(text, "Private", "The drop-down was not reset on cancel");
            });
      },

      "Test menu spinner icon is displayed": function () {
         return browser.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .click()
         .end()
         // Select "Public" (there should be no response so the spinner will just keep spinning...)
         .findByCssSelector("tr.dijitMenuItem:nth-of-type(1)")
            .click()
         .end()
         .findAllByCssSelector(".alfresco-renderers-PublishingDropDownMenu .indicator.processing:not(.hidden)")
            .then(function (elements) {
               assert(elements.length === 1, "The spinner icon is not present");
            });
      },

      "Test escape key cancels action": function() {
         return browser.pressKeys(keys.ESCAPE)
            .findByCssSelector(".alfresco-renderers-PublishingDropDownMenu .indicator.processing")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The spinner should have been hidden on ESC");
            })
         .end()
         .findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .getVisibleText()
            .then(function (text) {
               assert.equal(text, "Private", "The drop-down was not reset on cancel");
            });
      },

      "Test menu publish is cleared on refresh": function() {
         return browser.refresh().end()
            .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_PUBLISHING_DROPDOWN_MENU", "alfTopic", "ALF_PUBLISHING_DROPDOWN_MENU"))
            .then(function(elements) {
               assert(elements.length === 0, "The menu publish should have gone after a refresh, expected 0 found: ", elements.length);
            });
      },

      "Test menu can be opened via keyboard": function() {
         return browser.pressKeys(keys.TAB)
            .pressKeys(keys.TAB)
            .pressKeys(keys.TAB)
            .pressKeys(keys.TAB)
            .pressKeys(keys.TAB)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(500)
            .findByCssSelector(".dijitMenuPopup")
               .isDisplayed()
               .then(function(result8) {
                  expect(result8).to.equal(true, "The drop down menu should be visible after key presses");
               });
      },

      "Test menu hidden after keyboard selection": function() {
         return browser.pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.RETURN)
            .sleep(500)
            .findByCssSelector(".dijitMenuPopup")
               .isDisplayed()
               .then(function(elements) {
                  expect(elements).to.equal(false, "The drop down menu should be hidden after key presses");
               });
      },

      "Test menu published after keyboard selection": function() {
         return browser.findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_PUBLISHING_DROPDOWN_MENU", "alfTopic", "ALF_PUBLISHING_DROPDOWN_MENU"))
            .then(function(elements) {
               assert(elements.length === 1, "The menu did not publish on 'ALF_PUBLISHING_DROPDOWN_MENU' after key presses, expected 1, found: " + elements.length);
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});