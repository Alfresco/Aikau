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
      name: 'Advanced VisibilityConfig Test',
      'Test Initial Setup': function () {
         // var browser = this.remote;
         var testname = "Advanced Visibility Config";
         return TestCommon.loadTestWebScript(this.remote, "/AdvancedVisibilityConfig", testname)

         .findByCssSelector("#LOGO1")
            .isDisplayed()
            .then(function(result) {
               TestCommon.log(testname,"Check LOGO1 is initially displayed");
               assert(result === true, "Test #1a - LOGO1 was not initially displayed");
            })
         .end()

         .findByCssSelector("#LOGO2")
            .isDisplayed()
            .then(function(result) {
               TestCommon.log(testname,"Check LOGO2 is initially displayed");
               assert(result === true, "Test #1b - LOGO2 was not initially displayed");
            })
         .end()

         .findByCssSelector("#LOGO3")
            .isDisplayed()
            .then(function(result) {
               TestCommon.log(testname,"Check LOGO3 is initially displayed");
               assert(result === true, "Test #1c - LOGO3 was not initially displayed");
            })
         .end();
      },
      'Test Non Strict Visibility Rule': function () {
         var browser = this.remote;
         var testname = "Test Non-Strict Mode";

         return browser.findByCssSelector("#TEST_NON_STRICT_1")
            .click()
         .end()

         .findByCssSelector("#LOGO1")
            .isDisplayed()
            .then(function(result) {
               TestCommon.log(testname,"Check LOGO1 is still displayed");
               assert(result === true, "Test #2a - LOGO1 was hidden");
            })
         .end();
      },
      'Test Current Item Rule': function () {
         var browser = this.remote;
         var testname = "Test CurrentItem Rule";

         return browser.findByCssSelector("#HIDE_LOGO_2")
            .click()
         .end()

         .findByCssSelector("#LOGO2")
            .isDisplayed()
            .then(function(result) {
               TestCommon.log(testname,"Check LOGO2 is still displayed");
               assert(result === true, "Test #3a - LOGO2 was hidden");
            })
         .end();
      },
      'Test Invisibility Rule': function () {
         var browser = this.remote;
         var testname = "Test Invisibility Rule";

         return browser.findByCssSelector("#HIDE_LOGO_3")
            .click()
         .end()

         .findByCssSelector("#LOGO3")
            .isDisplayed()
            .then(function(result) {
               TestCommon.log(testname,"Check LOGO3 is now hidden");
               assert(result === false, "Test #4a - LOGO3 was still displayed");
            })
         .end()

         .findByCssSelector("#SHOW_LOGO_3")
            .click()
         .end()

         .findByCssSelector("#LOGO3")
            .isDisplayed()
            .then(function(result) {
               TestCommon.log(testname,"Check LOGO3 is now displayed");
               assert(result === true, "Test #4b - LOGO3 was not displayed");
            })
         .end()
         
         .alfPostCoverageResults(browser);
      }
   });
});