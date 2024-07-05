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
      name: "DateLink Tests",
      testPage: "/DateLink",

      "Check the first date is rendered correctly": function() {
         // Test that the dates are rendered as expected. The model uses a very old ISO date which should ensure
         // that we get a relative date in the form "Modified over X years ago" so we're going to use a regular
         // expression that should continue to work in the future as the date gets further into the past
         return this.remote.findByCssSelector("#CUSTOM_PROPS .value")
            .getVisibleText()
            .then(function(resultText) {
               assert(/(Modified over \d+ years ago by TestSök <img ='><svg onload=\"window.hacked=true\"'>)/g.test(resultText), "Test #1 - Custom property not rendered correctly: " + resultText);
            });
      },

      "Check the second date is rendered correctly": function() {
         return this.remote.findByCssSelector("#STANDARD_PROPS .value")
            .getVisibleText()
            .then(function(resultText) {
               assert(/(Modified over \d+ years ago by Chris Griffin)/g.test(resultText), "Test #2 - Standard property not rendered correctly: " + resultText);
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

      "Check the date click published as expected": function() {
         return this.remote.findByCssSelector("#CUSTOM_PROPS .value")
            .click()
         .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "type", "PAGE_RELATIVE");
               assert.propertyVal(payload, "url", "/1/2/3/4/5");
            });
      },

      "Test other configurations": function() {
         return this.remote.findByCssSelector("#STANDARD_PROPS .value")
            .click()
            .end()

         .findByCssSelector("#BROKEN_1 .value")
            .click()
            .end()

         .findByCssSelector("#BROKEN_2 .value")
            .click();
      }
   });
});