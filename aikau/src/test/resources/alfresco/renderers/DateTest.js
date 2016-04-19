/*jshint browser:true*/
/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Date Tests",
      testPage: "/Date",

      "Check custom property is rendered correctly": function() {
         // Test that the dates are rendered as expected. The model uses a very old ISO date which should ensure
         // that we get a relative date in the form "Modified over X years ago" so we're going to use a regular
         // expression that should continue to work in the future as the date gets further into the past
         return this.remote.findByCssSelector("#CUSTOM_PROPS .value")
            .getVisibleText()
            .then(function(resultText) {
               assert(/(Modified over \d+ years ago by TestSök <img ='><svg onload=\"window.hacked=true\"'>)/g.test(resultText), "Custom property not rendered correctly: " + resultText);
            });
      },

      "No XSS attacks were successful": function() {
         return this.remote.execute(function() {
               return window.hacked;
            })
            .then(function(hacked) {
               assert.isFalse(!!hacked);
            });
      },

      "Check standard property is rendered correctly": function() {
         return this.remote.findByCssSelector("#STANDARD_PROPS .value")
            .getVisibleText()
            .then(function(resultText) {
               assert(/(Modified over \d+ years ago by Chris Griffin)/g.test(resultText), "Standard property not rendered correctly: " + resultText);
            });
      },

      "Check standard property with missing user data is rendered correctly": function() {
         return this.remote.findByCssSelector("#STANDARD_PROPS_MISSING_USER .value")
            .getVisibleText()
            .then(function(resultText) {
               assert(/(Modified over \d+ years ago)/g.test(resultText), "Standard property with missing user not rendered correctly: " + resultText);
            });
      },

      "Check simple date rendering": function() {
         return this.remote.findByCssSelector("#SIMPLE_MODE .value")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Tue 11 Apr 2000 12:42:02", "Simple date not rendered correctly");
            });
      },

      "Ensure warnIfNotAvailable works": function() {
         return this.remote.findByCssSelector("#NOT_AVAILABLE .value")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Not available");
            });
      }
   });
});