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
      name: "Date Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Date", "Date Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check custom property is rendered correctly": function () {
         // Test that the dates are rendered as expected. The model uses a very old ISO date which should ensure
         // that we get a relative date in the form "Modified over X years ago" so we're going to use a regular
         // expression that should continue to work in the future as the date gets further into the past
         return browser.findByCssSelector("#CUSTOM_PROPS .value")
            .getVisibleText()
            .then(function(resultText) {
               assert(/(Modified over \d+ years ago by Brian Griffin)/g.test(resultText), "Custom property not rendered correctly: " + resultText);
            });
      },

      "Check standard property is rendered correctly": function() {
         return browser.findByCssSelector("#STANDARD_PROPS .value")
            .getVisibleText()
            .then(function(resultText) {
               assert(/(Modified over \d+ years ago by Chris Griffin)/g.test(resultText), "Standard property not rendered correctly: " + resultText);
            });
      },

      "Check simple date rendering": function() {
         return browser.findByCssSelector("#SIMPLE_MODE .value")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Tue 11 Apr 2000 12:42:02", "Simple date not rendered correctly");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});