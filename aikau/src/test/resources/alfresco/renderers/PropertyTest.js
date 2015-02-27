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
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "Property Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Property", "Property Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Tests": function () {
         var testname = "PropertyTest";
         return browser.moveMouseTo(null, 0, 0)
            .end()

         .findByCssSelector("#BASIC .value")
            .getVisibleText()
            .then(function(resultText) {
               TestCommon.log(testname,"Check standard property is rendered correctly");
               assert(resultText === "Test", "Standard property not rendered correctly: " + resultText);
            })
            .end()

         .findByCssSelector("#PREFIX_SUFFIX .value")
            .getVisibleText()
            .then(function(resultText) {
               TestCommon.log(testname,"Check prefixed/suffixed property is rendered correctly");
               assert(resultText === "(Test)", "Prefix and suffix not rendered correctly: " + resultText);
            })
            .end()

         .findByCssSelector("#NEW_LINE")
            .getComputedStyle("display")
            .then(function(result) {
               TestCommon.log(testname,"Check new line property is rendered correctly");
               assert(result === "block", "New line not applied");
            })
            .end()

         .findByCssSelector("#WARN1 .value")
            .getVisibleText()
            .then(function(resultText) {
               TestCommon.log(testname,"Check standard warning is rendered correctly");
               assert(resultText === "No property for: \"missing\"", "Standard warning not rendered correctly: " + resultText);
            })
            .end()

         .findByCssSelector("#WARN2 .value")
            .getVisibleText()
            .then(function(resultText) {
               TestCommon.log(testname,"Check explicit warning is rendered correctly");
               assert(resultText === "No description", "Explicit warning not rendered correctly: " + resultText);
            })
            .end()

         // Position the mouse over the SubscriptionLog to make sure the hover only property isn't displayed...
         .findByCssSelector(".alfresco-testing-SubscriptionLog")
            .then(function(element) {
               browser.moveMouseTo(element);
            })
            .end()

         .findByCssSelector("#HOVER .inner")
           .isDisplayed()
            .then(function(result) {
               TestCommon.log(testname,"Check hover property is hidden");
               assert(result === false, "Hover displayed unexpectedly");
            })
            .end()

         .findByCssSelector("#LIST table tbody tr td")
            .then(function(element) {
               browser.moveMouseTo(element);
            })
            .end()

        .findByCssSelector("#HOVER .value")
           .isDisplayed()
           .then(function(result) {
               TestCommon.log(testname,"Check hover property is displayed");
               assert(result === true, "Hover displayed unexpectedly");
            })
           .end()

         .findByCssSelector("#LABEL .label")
            .getVisibleText()
            .then(function(resultText) {
               TestCommon.log(testname,"Check label is rendered correctly");
               assert(resultText === "Label:", "Label not rendered correctly: " + resultText);
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});