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

   var browser;
   registerSuite({
      name: "Basic Layout Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/BasicLayouts", "Basic Layout Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Tests": function () {

         var testableDimensions = {};

         var testname = "BasicLayoutTest";
         // Test #1
         // Check margins in vertical widgets...
         return browser.findByCssSelector("#SURF_LOGO1")
               .getAttribute("style")
               .then(function(style) {
                  TestCommon.log(testname,"Test top margin is set correctly on a vertical widget");
                  assert(style === "margin-top: 10px;", "Test #1a - The style was not set correctly on a vertical widget with top margin: " + style);
               })
               .end()

            .findByCssSelector("#SURF_LOGO2")
               .getAttribute("style")
               .then(function(style) {
                  TestCommon.log(testname,"Test bottom margin is set correctly on a vertical widget");
                  assert(style === "margin-bottom: 20px;", "Test #1b - The style was not set correctly on a vertical widget with bottom margin: " + style);
               })
               .end()

            .findByCssSelector("#SURF_LOGO3")
               .getAttribute("style")
               .then(function(style) {
                  TestCommon.log(testname,"Test both top and bottom margins are set correctly on a vertical widget");
                  assert(style === "margin-top: 30px; margin-bottom: 40px;", "Test #1c - The style was not set correctly on a vertical widget with top and bottom margins: " + style);
               })
               .end()

            // Test #2
            // Check empty layouts are rendererd...
            .findByCssSelector("#EMPTY_HORIZONTAL")
               .then(null, function() {
                  assert(false, "Test #2a - Empty horizontal widgets was not rendered");
               })
               .end()

            .findByCssSelector("#EMPTY_VERTICAL")
               .then(null, function() {
                  assert(false, "Test #2b - Empty vertical widgets was not rendered");
               })
               .end()

            .findByCssSelector("#EMPTY_LEFT_AND_RIGHT")
               .then(null, function() {
                  assert(false, "Test #2c - Empty left and right widgets was not rendered");
               })
               .end()

            .findByCssSelector("#EMPTY_CENTERED_WIDGETS")
               .then(null, function() {
                  assert(false, "Test #2d - Empty centered widgets was not rendered");
               })
               .end()

            // Test #3
            // Test left/right alignment of left and right widgets...
            .findByCssSelector(".left-widgets #SURF_LOGO4")
               .then(null, function() {
                  assert(false, "Test #3a - widget was not left aligned");
               })
               .end()

            .findByCssSelector(".right-widgets #ALFRESCO_LOGO1")
               .then(null, function() {
                  assert(false, "Test #3b - logo was not right aligned");
               })
               .end()

            // Test #4
            // Test size allocation in horizontal widgets...
            .findByCssSelector("#LEVEL2_HORIZONTAL2")
               .getComputedStyle("width")
               .then(function(width) {
                  testableDimensions.horiz2 = width.substring(0, width.lastIndexOf("px"));
               })
               .end()

            .findByCssSelector("#LEVEL2_HORIZONTAL2 > div > div:nth-child(3)")
               .getComputedStyle("margin-left")
               .then(function(x) {
                  TestCommon.log(testname,"Test left margin of horizontal widget");
                  assert(x === "10px", "Test #4a - The left margin was not set correctly on a horizontal widget: " + x);
               })
               .getComputedStyle("margin-right")
               .then(function(x) {
                  TestCommon.log(testname,"Test right margin of horizontal widget");
                  assert(x === "20px", "Test #4b - The right margin was not set correctly on a horizontal widget: " + x);
               })
               .getComputedStyle("width")
               .then(function(width) {
                  // Calculate what the width should be...
                  // 75% of the the width of the REMAINDER of the horizontal widget parent minus all the margins and the pixel width widget
                  var x = width.substring(0, width.lastIndexOf("px"));
                  var shouldBe = (testableDimensions.horiz2 - 90 - 300 - 3 - 30) * 0.75;
                  TestCommon.log(testname,"Test width of horizontal element by remaining percentage");
                  assert(shouldBe === x, "Test #4c - The width was not set correctly by remaining percentage: " + x + " (should be: " + shouldBe + ")");
               })
               .end()

            .findByCssSelector("#LEVEL2_HORIZONTAL2 > div > div:nth-child(2)")
               .getComputedStyle("width")
               .then(function(width) {
                  TestCommon.log(testname,"Test width is set correctly");
                  assert(width === "300px", "Test #4d - The width was not set correctly by pixels: " + width);
               })
               .end()

            .findByCssSelector("#LEVEL2_HORIZONTAL3")
               .getComputedStyle("width")
               .then(function(width) {
                  testableDimensions.horiz3 = width.substring(0, width.lastIndexOf("px"));
               })
               .end()

            .findByCssSelector("#LEVEL2_HORIZONTAL3 > div > div:nth-child(1)")
               .getComputedStyle("width")
               .then(function(width) {
                  var x = width.substring(0, width.lastIndexOf("px"));
                  var shouldBe = (testableDimensions.horiz3 - 2 - 30) * 0.5;
                  TestCommon.log(testname,"Test space is evenly divided");
                  assert(shouldBe === x, "Test #4e - The width was not set correctly by evenly dividing space, was: " + x + ", should be: " + shouldBe);
               })
               .end()

            .findByCssSelector("#LEVEL2_HORIZONTAL3 > div > div:nth-child(2)")
               .getComputedStyle("width")
               .then(function(width) {
                  var x = width.substring(0, width.lastIndexOf("px"));
                  var shouldBe = (testableDimensions.horiz3 - 2 - 30) * 0.5;
                  TestCommon.log(testname,"Test space is evenly divided");
                  assert(shouldBe === x, "Test #4f - The width was not set correctly by evenly dividing space");
               })
               .end()

            .findByCssSelector("#LOGO6")
               .then(null, function() {
                  assert(false, "Test #4g - first widget with excess pixels was not rendered");
               })
               .end()

            .findByCssSelector("#LOGO7")
               .then(null, function() {
                  assert(false, "Test #4h - second widget with excess pixels was not rendered");
               })
               .end()

            .findByCssSelector("#LOGO8")
               .then(null, function() {
                  assert(false, "Test #4i - widget1 with excess pixels was not rendered");
               })
               .end()

            // Test #5
            // Test center alignment of centered widgets...
            .findByCssSelector(".center-container")
               .then(null, function() {
                  assert(false, "Test #5a - center-container not found");
               })
               .end()

            .findByCssSelector(".center-container #LOGO9")
               .then(null, function() {
                  assert(false, "Test #5b - logo was not center aligned");
               })
               .end()

            .findByCssSelector(".center-container")
               .getComputedStyle("width")
               .then(function(width) {
                  var x = width.substring(0, width.lastIndexOf("px"));
                  var shouldBe = 368;
                  assert(shouldBe === x, "Test #5c - The width was not set correctly");
               });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});