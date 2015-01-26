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
      name: 'PublishingDropDownMenu Test',
      'alfresco/renderers/PublishingDropDownMenu': function () {

         var browser = this.remote;
         var testname = "PublishingDropDownMenuTest";
         return TestCommon.loadTestWebScript(this.remote, "/PublishingDropDownMenu", testname)

         // Check there are 3 drop down menus as described in the model
         .findAllByCssSelector("div.alfresco-renderers-PublishingDropDownMenu")
            .then(function (dropdowns) {
               TestCommon.log(testname,"Check there are 3 drop down menus as described in the model");
               expect(dropdowns).to.have.length(3, "There should be 3 dropdown menus rendered");
            })
            .end()

         // Check the start value of drop down menu 1 is 'Public'
         .findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .getVisibleText()
            .then(function (result1) {
               TestCommon.log(testname,"Check the start value of drop down menu 1 is 'Public'");
               expect(result1).to.equal("Public", "The start value of dropdown menu 1 should be 'Public'");
            })
            .end()

         // Open the menu by mouse click
         .findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .click()
            .end()
         .findByCssSelector(".dijitMenuPopup")
            .then(null,function() {
               assert(false, "The drop down menu did not appear on mouse clicks");
            })
            .end()

         // Check the menu has appeared
         .findByCssSelector(".dijitMenuPopup")
            .isDisplayed()
            .then(function(result3) {
               TestCommon.log(testname,"Check the menu has appeared");
               expect(result3).to.equal(true, "The drop down menu should be visible on mouse clicks");
             })
            .end()

         // Select a different item in the menu by mouse click
         .findByCssSelector("tr.dijitMenuItem:nth-of-type(3)")
            .click()
            .end()
         .findByCssSelector(".dijitMenuPopup")
            .then(null, function() {
                assert(false, "The menu code should not have been removed");
            })
            .end()

         // Check the menu disappeared
         .findByCssSelector(".dijitMenuPopup")
            .isDisplayed()
            .then(function(result5) {
               TestCommon.log(testname,"Check the menu disappeared");
               expect(result5).to.equal(false, "The drop down menu should be hidden after the mouse click");
            })
            .end()

         // Check the menu selection published as expected after mouse clicks
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_PUBLISHING_DROPDOWN_MENU", "alfTopic", "ALF_PUBLISHING_DROPDOWN_MENU"))
            .then(function(elements) {
               TestCommon.log(testname,"Check the menu selection published as expected after mouse clicks");
               assert(elements.length == 1, "The menu did not publish on 'ALF_PUBLISHING_DROPDOWN_MENU' after mouse clicks");
            })
            .end()

         // Refresh the page to lose all focus
         .refresh()
         .end()

         // Check the menu publish is not shown after the refresh
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_PUBLISHING_DROPDOWN_MENU", "alfTopic", "ALF_PUBLISHING_DROPDOWN_MENU"))
            .then(function(elements) {
               TestCommon.log(testname,"Check the menu publish is not shown after the refresh");
               assert(elements.length == 0, "The menu publish should have gone after a refresh", elements);
            })
            .end()

         // // Open another menu with key functions - check it is visible
         .pressKeys(keys.TAB)
         .pressKeys(keys.TAB)
         .pressKeys(keys.TAB)
         .pressKeys(keys.TAB)
         .pressKeys(keys.TAB)
         .pressKeys(keys.ARROW_DOWN)
         .sleep(500)
         .findByCssSelector(".dijitMenuPopup")
            .isDisplayed()
            .then(function(result8) {
               TestCommon.log(testname,"Open another menu with key functions - check it is visible");
               expect(result8).to.equal(true, "The drop down menu should be visible after key presses");
            })
            .end()

         // Select another item in the menu - check the menu disappears
         .pressKeys(keys.ARROW_DOWN)
         .pressKeys(keys.RETURN)
         .sleep(500)
         .findByCssSelector(".dijitMenuPopup")
            .isDisplayed()
            .then(function(elements) {
               TestCommon.log(testname,"Select another item in the menu - check the menu disappears");
               expect(elements).to.equal(false, "The drop down menu should be hidden after key presses");
            })
            .end()

         // Check the menu selection published as expected after key presses
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_PUBLISHING_DROPDOWN_MENU", "alfTopic", "ALF_PUBLISHING_DROPDOWN_MENU"))
            .then(function(elements) {
               TestCommon.log(testname,"Check the menu selection published as expected after key presses");
               assert(elements.length == 1, "The menu did not publish on 'ALF_PUBLISHING_DROPDOWN_MENU' after key presses");
            })
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});