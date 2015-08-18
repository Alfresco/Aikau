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
   var width;

   return {
      name: "Progress Renderer Test",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/PieChart", "PieChart Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Test Setup": function () {
         return TestCommon.loadTestWebScript(this.remote, "/Progress", "Test Progress Renderer").findByCssSelector("#PROGRESS1 .alfProgressBarLabel")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Creating archive to download", "Unexpected default initialization message: " + text);
            })
         .end();
      },
      "Test Initial Progress": function () {
         return this.remote.findByCssSelector("#PROGRESS1 .alfProgressBarProgress")
            .getSize()
            .then(function(size) {
               width = size.width;
               console.log("Container width: " + width);
            })
            .getComputedStyle("left")
            .then(function(value) {
               assert(value === "-" + width + "px", "Progress bar not zeroed: " + value);
            })
         .end();
      },
      "Test 50% Progress Update": function() {
         return this.remote.findByCssSelector("#SEMI-COMPLETE_label")
            .click()
         .end()
         .findByCssSelector("#PROGRESS1 .alfProgressBarProgress")
            .getComputedStyle("left")
            .then(function(value) {
               var expected = width / 2;
               assert(value === "-" + expected + "px", "Progress bar not halfway, expected: " + expected + ", actual:" + value);
            })
         .end();
      },
      "Test 50% Progress Label": function() {
         return this.remote.findByCssSelector("#PROGRESS1 .alfProgressBarLabel")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Creating zip file (3 out of 7 files added)", "Unexpected default completion message: " + text);
            })
         .end();
      },
      "Test 75% Progress Update": function() {
         return this.remote.findByCssSelector("#THREE-QUARTERS-COMPLETE_label")
            .click()
         .end()
         .findByCssSelector("#PROGRESS1 .alfProgressBarProgress")
            .getComputedStyle("left")
            .then(function(value) {
               var expected = width * 0.25;
               assert(value === "-" + expected + "px", "Progress bar not halfway, expected: " + expected + ", actual:" + value);
            })
         .end();
      },
      "Test Completed Update": function() {
         return this.remote.findByCssSelector("#FULLY-COMPLETE_label")
            .click()
         .end()
         .findByCssSelector("#PROGRESS1 .alfProgressBarProgress")
            .getComputedStyle("left")
            .then(function(value) {
               var expected = "0px";
               assert(value === expected, "Progress bar not halfway, expected: " + expected + ", actual:" + value);
            })
         .end();
      },
      "Test Completed Label": function() {
         return this.remote.findByCssSelector("#PROGRESS1 .alfProgressBarLabel")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Zip creation complete. Downloading zip file.", "Unexpected default completion message: " + text);
            })
         .end();
      },
      "Test Error Update": function() {
         return this.remote.findByCssSelector("#ERROR_label")
            .click()
         .end()
         .findByCssSelector("#PROGRESS1 .alfProgressBarLabel")
            .getVisibleText()
            .then(function(text) {
               assert(text === "There was an error getting progress status.", "Unexpected default error message: " + text);
            })
         .end();
      },
      "Test Cancel Update": function() {
         return browser.findByCssSelector("#CANCELLED_label")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("PROGRESS1_ALF_PROGRESS_CANCELLED", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 1, "Cancellation topic not published");
            })
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_CLOSE_DIALOG", "publish", "last"))
            .then(function(elements) {
               assert(elements.length === 1, "Request to close dialog not published");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});