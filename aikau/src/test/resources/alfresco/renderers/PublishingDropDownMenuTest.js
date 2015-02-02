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
      name: "PublishingDropDownMenu Test",
      "Test drop down menu count": function () {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/PublishingDropDownMenu", "PublishingDropDownMenuTest").findAllByCssSelector("div.alfresco-renderers-PublishingDropDownMenu")
            .then(function (dropdowns) {
               expect(dropdowns).to.have.length(3, "There should be 3 dropdown menus rendered, found: " + dropdowns.length);
            })
         .end();
      },
      "Test first drop-down value is 'Public'": function() {
         return this.remote.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .getVisibleText()
            .then(function (result1) {
               expect(result1).to.equal("Public", "The start value of dropdown menu 1 should be 'Public'");
            })
         .end();
      },
      "Test menu opens on mouse click": function() {
         return this.remote.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .click()
         .end()
         .findByCssSelector(".dijitMenuPopup")
            .then(null,function() {
               assert(false, "The drop down menu did not appear on mouse clicks");
            })
         .end();
      },
      "Test menu is visible": function() {
         return this.remote.findByCssSelector(".dijitMenuPopup")
            .isDisplayed()
            .then(function(result3) {
               expect(result3).to.equal(true, "The drop down menu should be visible on mouse clicks");
             })
         .end();
      },
      "Test menu code not removed on click": function() {
         return this.remote.findByCssSelector("tr.dijitMenuItem:nth-of-type(3)")
            .click()
         .end()
         .findByCssSelector(".dijitMenuPopup")
            .then(null, function() {
                assert(false, "The menu code should not have been removed");
            })
         .end();
      },
      "Test menu disappears after mouse click": function() {
         return this.remote.findByCssSelector(".dijitMenuPopup")
            .isDisplayed()
            .then(function(result5) {
               expect(result5).to.equal(false, "The drop down menu should be hidden after the mouse click");
            })
         .end();
      },
      "Test menu selection published on mouse click": function() {
         return this.remote.findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_PUBLISHING_DROPDOWN_MENU", "alfTopic", "ALF_PUBLISHING_DROPDOWN_MENU"))
            .then(function(elements) {
               assert(elements.length === 1, "The menu did not publish on 'ALF_PUBLISHING_DROPDOWN_MENU' after mouse clicks, expected 1 found: " + elements.length);
            })
         .end();
      },
      "Test menu publish is cleared on refresh": function() {
         return this.remote.refresh().end()
            .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_PUBLISHING_DROPDOWN_MENU", "alfTopic", "ALF_PUBLISHING_DROPDOWN_MENU"))
            .then(function(elements) {
               assert(elements.length === 0, "The menu publish should have gone after a refresh, expected 0 found: ", elements.length);
            })
         .end();
      },
      "Test menu can be opened via keyboard": function() {
         return this.remote.pressKeys(keys.TAB)
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
            })
         .end();
      },
      "Test menu hidden after keyboard selection": function() {
         return this.remote.pressKeys(keys.ARROW_DOWN)
         .pressKeys(keys.RETURN)
         .sleep(500)
         .findByCssSelector(".dijitMenuPopup")
            .isDisplayed()
            .then(function(elements) {
               expect(elements).to.equal(false, "The drop down menu should be hidden after key presses");
            })
         .end();
      },
      "Test menu published after keyboard selection": function() {
         return this.remote.findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_PUBLISHING_DROPDOWN_MENU", "alfTopic", "ALF_PUBLISHING_DROPDOWN_MENU"))
            .then(function(elements) {
               assert(elements.length === 1, "The menu did not publish on 'ALF_PUBLISHING_DROPDOWN_MENU' after key presses, expected 1, found: " + elements.length);
            })
         .end()
         .alfPostCoverageResults(browser);
      }
   });
});