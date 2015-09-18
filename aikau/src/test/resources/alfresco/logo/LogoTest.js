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
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Logo Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Logo", "Logo Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Check CSS logo": function () {
         return browser.findByCssSelector("#LOGO1.alfresco-logo-Logo .alfresco-logo-large")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "CSS logo was not displayed");
            });
      },

      "Check image logo": function () {
         return browser.findByCssSelector("#LOGO2.alfresco-logo-Logo .alfresco-logo-large")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "CSS logo was not displayed for Logo with image source");
            });
      },

      "Check image logo height": function() {
         return browser.findByCssSelector("#LOGO2 img")
            .getComputedStyle("height")
            .then(function(height) {
               assert.equal(height, "48px", "The height of the image logo was incorrect");
            });
      },

      "Check image logo width": function() {
         // The width of image logo should be set to auto, only CSS logos should have fixed widths
         return browser.findByCssSelector("#LOGO2 img")
            .getComputedStyle("width")
            .then(function(width) {
               assert.equal(width, "auto", "The width of the image should be auto");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});