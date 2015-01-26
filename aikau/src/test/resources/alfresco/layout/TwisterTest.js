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
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

   registerSuite({
      name: 'Twister Tests',
      'Test Initial Rendering': function () {
         var testname = "Initial Rendering";
         return TestCommon.loadTestWebScript(this.remote, "/Twister", testname)

            .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
               .getVisibleText()
               .then(function (text) {
                  TestCommon.log(testname,"Check the first twister gets H3 element");
                  expect(text).to.equal("Twister with heading level", "Test #1a - The 1st twister did not render an H3 element");
               })
            .end()

            .findByCssSelector("#TWISTER_NO_HEADING_LEVEL > div.label")
               .getVisibleText()
               .then(function (text) {
                  TestCommon.log(testname,"Check the second twister renders without header element");
                  expect(text).to.equal("Twister with no heading level", "Test #1b - The 2n twister label was rendered incorrectly");
               })
            .end()

            .findByCssSelector("#TWISTER_BAD_HEADING_LEVEL > div.label")
               .getVisibleText()
               .then(function (text) {
                  TestCommon.log(testname,"Check that invalid heading level 'a' does not render invalid element");
                  expect(text).to.equal("Twister with faulty heading level 'a'", "Test #1c -The 3rd twister did not render correctly");
               })
            .end()

            .findByCssSelector("#TWISTER_BAD_HEADING_LEVEL_TWO > div.label")
               .getVisibleText()
               .then(function (text) {
                  TestCommon.log(testname,"Check that invalid heading level '0' does not render invalid element");
                  expect(text).to.equal("Twister with heading level 0", "Test #1d -The 4th twister did not render correctly");
               })
            .end()

            .findByCssSelector("#TWISTER_BAD_HEADING_LEVEL_THREE > div.label")
               .getVisibleText()
               .then(function (text) {
                  TestCommon.log(testname,"Check that invalid heading level '7' does not render invalid element");
                  expect(text).to.equal("Twister with heading level 7", "Test #1e -The 5th twister did not render correctly");
               })
            .end()

            .findByCssSelector("#TWISTER_NULL_LABEL")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname,"Check that null label twister is not displayed");
                  assert(result === false, "Test #1f - Twister with null label was unexpectedly displayed");
               })
            .end()

            .findByCssSelector("#TWISTER_EMPTY_LABEL")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname,"Check that empty string label twister is not displayed");
                  assert(result === false, "Test #1g - Twister with empty string label was unexpectedly displayed");
               })
            .end();
      },
      'Twister mouse tests': function () {
         var browser = this.remote;
         var testname = "Twister mouse tests";
         return browser
        
            // Click the title of twister 1
            .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
               .click()
            .end()

            // Title should still be visible
            .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
               .getVisibleText()
               .then(function (text) {
                  TestCommon.log(testname,"Check the first twister title is still visible");
                  expect(text).to.equal("Twister with heading level", "Test #2a - The first twister title is not visible");
               })
            .end()

            .findByCssSelector("#TWISTER_HEADING_LEVEL #LOGO1")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname,"Check that logo in the first twister is hidden when the twister is clicked");
                  assert(result === false, "Test #2b - The logo was unexpectedly shown");
               })
            .end()

            // Click the title of twister 1
            .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
               .click()
            .end()

            // Title should still be visible
            .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
               .getVisibleText()
               .then(function (text) {
                  TestCommon.log(testname,"Check the first twister title is still visible");
                  expect(text).to.equal("Twister with heading level", "Test #2c - The first twister title is not visible");
               })
            .end()

            .findByCssSelector("#TWISTER_HEADING_LEVEL #LOGO1")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname,"Check that logo in the first twister is hidden when the twister is clicked");
                  assert(result === true, "Test #2d - The logo was unexpectedly hidden");
               })
            .end()
            .alfPostCoverageResults(browser);
      },
      'Twister keyboard tests': function () {
         var browser = this.remote;
         var testname = "Twister keyboard tests";
         return browser

            // Clear any existing focus...
            .refresh()

            // Focus the title of twister 1
            .pressKeys(keys.TAB)
            
            // 'Click' the title with the return key
            .pressKeys(keys.RETURN)

            // Title should still be visible
            .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
               .getVisibleText()
               .then(function (text) {
                  TestCommon.log(testname,"Check the first twister title is visible after keyboard [RETURN]");
                  expect(text).to.equal("Twister with heading level", "Test #3a - The first twister title is not visible after keyboard [RETURN]");
               })
            .end()

            // Content should be hidden
            .findByCssSelector("#TWISTER_HEADING_LEVEL #LOGO1")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname,"Check that logo in the first twister is hidden after keyboard [RETURN]");
                  assert(result === false, "Test #3b - The logo was unexpectedly shown");
               })
            .end()

            // 'Click' the title with the return key again
            .pressKeys(keys.RETURN)

            // Title should still be visible
            .findByCssSelector("#TWISTER_HEADING_LEVEL > div.label > h3")
               .getVisibleText()
               .then(function (text) {
                  TestCommon.log(testname,"Check the first twister title is visible after re-pressing keyboard [RETURN]");
                  expect(text).to.equal("Twister with heading level", "Test #3c - The first twister title is not visible after re-pressing keyboard [RETURN]");
               })
            .end()

            // Facets should not be hidden
            .findByCssSelector("#TWISTER_HEADING_LEVEL #LOGO1")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname,"Check that logo in the first twister is displayed after re-pressing keyboard [RETURN]");
                  assert(result === true, "Test #3d - The logo was unexpectedly hidden");
               })
            .end()
            .alfPostCoverageResults(browser);
      }
   });
});