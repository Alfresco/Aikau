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

registerSuite(function(){
   var browser;

   return {
      name: "Advanced VisibilityConfig Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AdvancedVisibilityConfig", "Advanced VisibilityConfig Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },
      
      "Check LOGO1 is initially displayed": function () {
         return browser.findByCssSelector("#LOGO1")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "LOGO1 was not initially displayed");
            });
      },

      "Check LOGO2 is initially displayed": function() {
         return browser.findByCssSelector("#LOGO2")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "LOGO2 was not initially displayed");
            });
      },

      "Check LOGO3 is initially displayed": function() {
         return browser.findByCssSelector("#LOGO3")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "LOGO3 was not initially displayed");
            });
      },

      "Check LOGO1 is still displayed (non-strict)": function () {
         return browser.findByCssSelector("#TEST_NON_STRICT_1")
            .click()
         .end()
         .findByCssSelector("#LOGO1")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "LOGO1 was hidden");
            });
      },

      "Check LOGO2 is still displayed (Current Item Rule)": function () {
         return browser.findByCssSelector("#HIDE_LOGO_2")
            .click()
         .end()
         .findByCssSelector("#LOGO2")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "LOGO2 was hidden");
            });
      },

      "Check LOGO3 is now hidden (Invisibility Rule)": function () {
         return browser.findByCssSelector("#HIDE_LOGO_3")
            .click()
         .end()
         .findByCssSelector("#LOGO3")
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "LOGO3 was still displayed");
            });
      },

      "Check LOGO3 is now displayed (Invisibility Rule)": function() {
         return browser.findByCssSelector("#SHOW_LOGO_3")
            .click()
         .end()
         .findByCssSelector("#LOGO3")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "LOGO3 was not displayed");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});