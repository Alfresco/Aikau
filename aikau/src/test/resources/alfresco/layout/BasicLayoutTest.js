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

   var testableDimensions = {};

   defineSuite(module, {
      name: "Basic Layout Tests",
      testPage: "/BasicLayouts",

      "Test top margin is set correctly on a vertical widget": function() {
         return this.remote.findByCssSelector("#SURF_LOGO1")
            .getAttribute("style")
            .then(function(style) {
               assert.equal(style, "margin-top: 10px;", "The style was not set correctly on a vertical widget with top margin: " + style);
            });
      },

      "Test bottom margin is set correctly on a vertical widget": function() {
         return this.remote.findByCssSelector("#SURF_LOGO2")
            .getAttribute("style")
            .then(function(style) {
               assert.equal(style, "margin-bottom: 20px;", "The style was not set correctly on a vertical widget with bottom margin: " + style);
            });
      },

      "Test both top and bottom margins are set correctly on a vertical widget": function() {
         return this.remote.findByCssSelector("#SURF_LOGO3")
            .getAttribute("style")
            .then(function(style) {
               assert.equal(style, "margin-top: 30px; margin-bottom: 40px;", "The style was not set correctly on a vertical widget with top and bottom margins: " + style);
            });
      },

      "Test that empty horizontal widgets are rendered": function() {
         return this.remote.findByCssSelector("#EMPTY_HORIZONTAL")
            .then(null, function() {
               assert(false, "Empty horizontal widgets was not rendered");
            });
      },

      "Test that empty vertical widgets are rendered": function() {
         return this.remote.findByCssSelector("#EMPTY_VERTICAL")
            .then(null, function() {
               assert(false, "Empty vertical widgets was not rendered");
            });
      },

      "Test that empty left and right widgets are rendered": function() {
         return this.remote.findByCssSelector("#EMPTY_LEFT_AND_RIGHT")
            .then(null, function() {
               assert(false, "Empty left and right widgets was not rendered");
            });
      },

      "Test that RIGHT left and right layout widgets are ordered correctly": function() {
         return this.remote.findByCssSelector("#ALFRESCO_LOGO2 + #ALFRESCO_LOGO1")
            .then(null, function() {
               assert(false, "Right layout widgets in the wrong order");
            });
      },

      "Test that LEFT left and right layout widgets are ordered correctly": function() {
         return this.remote.findByCssSelector(".additional-test-class+.additional-test-class-2")
            .then(null, function() {
               assert(false, "Left layout widgets in the wrong order");
            });
      },

      "Test that RIGHT left and right layout widgets are ordered correctly (LEGACY)": function() {
         return this.remote.findByCssSelector("#ALFRESCO_LOGO4 + #ALFRESCO_LOGO3")
            .then(null, function() {
               assert(false, "Right layout widgets in the wrong order");
            });
      },

      "Test that LEFT left and right layout widgets are ordered correctly (LEGACY)": function() {
         return this.remote.findByCssSelector(".additional-test-class-3+.additional-test-class-4")
            .then(null, function() {
               assert(false, "Left layout widgets in the wrong order");
            });
      },

      "Test that empty centered widgets are rendered": function() {
         return this.remote.findByCssSelector("#EMPTY_CENTERED_WIDGETS")
            .then(null, function() {
               assert(false, "Empty centered widgets was not rendered");
            });
      },

      "Test left alignment": function() {
         return this.remote.findByCssSelector(".alfresco-layout-LeftAndRight__left #SURF_LOGO4")
            .then(null, function() {
               assert(false, "Widget was not left aligned");
            });
      },

      "Test right alignment": function() {
         return this.remote.findByCssSelector(".alfresco-layout-LeftAndRight__right #ALFRESCO_LOGO1")
            .then(null, function() {
               assert(false, "logo was not right aligned");
            });
      },

      "Test left margin of horizontal widget": function() {
         return this.remote.findByCssSelector("#LEVEL2_HORIZONTAL2")
            .getComputedStyle("width")
            .then(function(width) {
               testableDimensions.horiz2 = width.substring(0, width.lastIndexOf("px"));
            })
            .end()
            .findByCssSelector("#LEVEL2_HORIZONTAL2 > div > div:nth-child(3)")
            .getComputedStyle("margin-left")
            .then(function(x) {
               assert.equal(x, "10px", "The left margin was not set correctly on a horizontal widget");
            });
      },

      "Test right margin of horizontal widget": function() {
         return this.remote.findByCssSelector("#LEVEL2_HORIZONTAL2 > div > div:nth-child(3)")
            .getComputedStyle("margin-right")
            .then(function(x) {
               assert.equal(x, "20px", "The right margin was not set correctly on a horizontal widget");
            });
      },

      "Test width of horizontal element by remaining percentage": function() {
         return this.remote.findByCssSelector("#LEVEL2_HORIZONTAL2 > div > div:nth-child(3)")
            .getComputedStyle("width")
            .then(function(width) {
               // Calculate what the width should be...
               // 75% of the width of the REMAINDER of the horizontal widget parent minus all the margins and the pixel width widget
               var x = width.substring(0, width.lastIndexOf("px"));
               var shouldBe = (testableDimensions.horiz2 - 90 - 300 - 3 - 30) * 0.75;
               assert.equal(shouldBe, x, "The width was not set correctly by remaining percentage: " + x + " (should be: " + shouldBe + ")");
            });
      },

      "Test width is set correctly": function() {
         return this.remote.findByCssSelector("#LEVEL2_HORIZONTAL2 > div > div:nth-child(2)")
            .getComputedStyle("width")
            .then(function(width) {
               assert.equal(width, "300px", "The width was not set correctly by pixels");
            });
      },

      "Test space is evenly divided (1)": function() {
         return this.remote.findByCssSelector("#LEVEL2_HORIZONTAL3")
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
               assert.equal(shouldBe, x, "The width was not set correctly by evenly dividing space, was: " + x + ", should be: " + shouldBe);
            });
      },

      "Test space is evenly divided (2)": function() {
         return this.remote.findByCssSelector("#LEVEL2_HORIZONTAL3 > div > div:nth-child(2)")
            .getComputedStyle("width")
            .then(function(width) {
               var x = width.substring(0, width.lastIndexOf("px"));
               var shouldBe = (testableDimensions.horiz3 - 2 - 30) * 0.5;
               assert.equal(shouldBe, x, "The width was not set correctly by evenly dividing space");
            });
      },

      "Test that first excess pixel widget is rendered": function() {
         return this.remote.findByCssSelector("#LOGO6")
            .then(null, function() {
               assert(false, "first widget with excess pixels was not rendered");
            });
      },

      "Test that second excess pixel widget is rendered": function() {
         return this.remote.findByCssSelector("#LOGO7")
            .then(null, function() {
               assert(false, "second widget with excess pixels was not rendered");
            });
      },

      "Test that third excess pixel widget is rendered": function() {
         return this.remote.findByCssSelector("#LOGO8")
            .then(null, function() {
               assert(false, "widget1 with excess pixels was not rendered");
            });
      },

      "Find center-container class": function() {
         return this.remote.findByCssSelector(".center-container")
            .then(null, function() {
               assert(false, "center-container not found");
            });
      },

      "Test logo is center aligned": function() {
         return this.remote.findByCssSelector(".center-container #LOGO9")
            .then(null, function() {
               assert(false, "logo was not center aligned");
            });
      },

      "": function() {
         return this.remote.findByCssSelector(".center-container")
            .getComputedStyle("width")
            .then(function(width) {
               var x = width.substring(0, width.lastIndexOf("px"));
               var shouldBe = 368;
               assert.equal(shouldBe, x, "The width was not set correctly");
            });
      }
   });
});