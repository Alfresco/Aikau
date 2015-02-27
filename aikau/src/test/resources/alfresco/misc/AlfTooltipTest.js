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
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

   var browser;
   registerSuite({
      name: "AlfTooltip Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfTooltip", "AlfTooltip Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Tests": function () {

         var testname = "AlfTooltipTest";
         return browser.findById("TEST_BUTTON")
         .then(function(el1) {
            TestCommon.log(testname,"Does the test button exist?");
            expect(el1).to.be.an("object", "The Test Button could not be found");
         })
         .end()

         // Tool tip should be missing to begin with
         .hasElementByCss(".dijitTooltip")
         .then(function(result1) {
            TestCommon.log(testname,"Tool tip should be missing to begin with");
            expect(result1).to.equal(false, "The Tooltip should not be available yet");
         })
         .end()

         // Move to test button - does the tool tip appear?
         .findByCssSelector("#TEST_BUTTON > #TEST_BUTTON_label")
         .sleep(1000)
         .hasElementByCss(".dijitTooltip")
         .then(function(result2) {
            TestCommon.log(testname,"Move to test button - does the tool tip appear?");
            expect(result2).to.equal(true, "The Tooltip did not appear");
         })
         .end()

         // Does the tool tip contain the appropriate copy
         .findByCssSelector(".dijitTooltipContainer.dijitTooltipContents")
         .getVisibleText()
         .then(function(resultText1) {
            TestCommon.log(testname,"Does the tool tip contain the appropriate copy");
            expect(resultText1).to.equal("This is the test button", "The tool tip text is incorrect");
         })
         .end()

         // Move to test button two - does the tool tip disappear?
         .findById("TEST_BUTTON_TWO")
         .sleep(250)
         .hasElementByCss(".dijitTooltip")
         .then(function(result3) {
            TestCommon.log(testname,"Move to test button two - does the tool tip disappear?");
            expect(result3).to.equal(true, "The Tooltip code should not have disappeared");
         })
         .end()

         .findByCssSelector(".dijitTooltip")
         .isDisplayed()
         .then(function(result4) {
            TestCommon.log(testname,"Move to test button two - does the tool tip disappear?");
            if(browser.environmentType.browserName.indexOf("chrome") === -1) {
               expect(result4).to.equal(false, "The Tooltip should be hidden");
            }
         });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});