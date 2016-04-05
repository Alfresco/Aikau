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
 * @since 1.0.33
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   defineSuite(module, function() {
      var scrollbarWidth; // We'll calculate this by deducting the body width from the window width
      var windowSize = 1050; // The size we'll set the window
      var pagePaddingAllocation = 20; // The page has 20px of padding
      var widgetPadding = 20; // Each ClassicWindow widget has 20px of padding
      var scrollbarAllocation = 30; // 30px is reserved for scrollbar allocation (to prevent accidental overflow)
      var fixedWidthWidget = 200; // The fixed width of WIDGET_1
      var availableWidth; // We'll calculate this in the setup

      return {
         name: "Dynamic Horizontal Layout Tests",

         setup: function() {
            return TestCommon.loadTestWebScript(this.remote, "/DynamicHorizontalLayout", "Dynamic Horizontal Layout Tests").end()
               // Set a window size and calculate the scrollbar width to assist width calculations...
               .setWindowSize(null, windowSize, 400)
               .findByCssSelector("body")
               .getSize()
               .then(function(size) {
                  scrollbarWidth = windowSize - size.width;
                  availableWidth = size.width - pagePaddingAllocation - scrollbarAllocation;
               });
         },

         // Width calculations...
         // Window width 1050
         // Padding = 20px
         // Scrollbar allocation 30px
         // Widget 1 = 200px
         // Widget 2 = 50%
         // Widget 3, 4, 5 equal share of remaining space
         // IMPORTANT: All widgets should have 20px deducted for their margins

         "Widget 1 should be 200px on load": function() {
            return this.remote.findById("WIDGET_1")
               .getSize()
               .then(function(size) {
                  assert.equal(size.width, 180, "Widget 1 was not the correct size");
               });
         },

         "Widget 2 should be half the remaining space": function() {
            // Widgets 3 and 4 should be hidden so the width of widget 2 should be 50% of the available space
            // (minus the fixed widget width)...
            var expectedWidth = ((availableWidth - fixedWidthWidget) / 2) - widgetPadding;
            return this.remote.findById("WIDGET_2")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, expectedWidth, 10, "Widget 2 was not the correct size");
               });
         },

         "Widget 3 is hidden on load": function() {
            return this.remote.findById("WIDGET_3")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "Widget 3 should not have been displayed when the page was loaded");
               });
         },

         "Widget 4 is hidden on load": function() {
            return this.remote.findById("WIDGET_4")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "Widget 4 should not have been displayed when the page was loaded");
               });
         },

         "Widget 5 should get half the remaining space": function() {
            // Widget 5 should get an even share of the remaining space after fixed and percentage width widgets
            // have had their widths deducted from the available space. Because Widgets 3 and 4 are initially
            // hidden, this means that widget 5 should get 50% of the available space (after Widget 1 is deducted)
            var expectedWidth = ((availableWidth - fixedWidthWidget) / 2) - widgetPadding;
            return this.remote.findById("WIDGET_5")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, expectedWidth, 10, "Widget 5 was not the correct size");
               });
         },

         "Show Widget 3 (visibility rule)": function() {
            // Revealing Widget 3 should cause the widgets to recalculate their sizes, Widgets 1 and 2 should
            // stay the same size, but Widget 3 should consume half of the space that Widget 5 previously had
            var expectedWidth = ((availableWidth - fixedWidthWidget) / 4) - widgetPadding;
            return this.remote.findById("SHOW_WIDGET_3_BUTTON_label")
               .click()
               .end()
               .findById("WIDGET_3")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "Widget 3 should have been revealed");
               })
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, expectedWidth, 10, "Widget 3 was not the correct size");
               })
               .end()
               .findById("WIDGET_5")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, expectedWidth, 10, "Widget 5 was not the correct size");
               });
         },

         "Show Widget 4 (invisibility rule)": function() {
            // Revealing Widget 4 should cause the widgets to recalculate their sizes, Widgets 1 and 2 should
            // stay the same size, but Widgets 3, 4 and 5 should share the space that Widgets 3 and 5 previously
            // shared
            var remainingSpace = (availableWidth - ((availableWidth - fixedWidthWidget) / 2)) - fixedWidthWidget;
            var expectedWidth = (remainingSpace / 3) - widgetPadding;
            return this.remote.findById("SHOW_WIDGET_4_BUTTON_label")
               .click()
               .end()
               .findById("WIDGET_4")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "Widget 4 should have been revealed");
               })
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, expectedWidth, 10, "Widget 4 was not the correct size");
               })
               .end()
               .findById("WIDGET_3")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, expectedWidth, 10, "Widget 3 was not the correct size");
               })
               .end()
               .findById("WIDGET_5")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, expectedWidth, 10, "Widget 5 was not the correct size");
               });
         },

         "Hide Widget 1": function() {
            // Hiding Widget 1 should cause all the remaining widgets to recalculate their sizes
            // such that Widget 2 has half the available space and Widgets 3,4 and 5 share the remaining space

            var widget2ExpectedWidth = (availableWidth / 2) - widgetPadding;
            var otherWidgetsExpectedWidth = ((availableWidth - widget2ExpectedWidth) / 3) - widgetPadding;

            return this.remote.findById("HIDE_WIDGET_1_BUTTON_label")
               .click()
               .end()
               .findById("WIDGET_1")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "Widget 1 should have been hidden");
               })
               .end()
               .findById("WIDGET_2")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, widget2ExpectedWidth, 10, "Widget 2 was not the correct size");
               })
               .end()
               .findById("WIDGET_3")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, otherWidgetsExpectedWidth, 10, "Widget 3 was not the correct size");
               })
               .end()
               .findById("WIDGET_4")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, otherWidgetsExpectedWidth, 10, "Widget 4 was not the correct size");
               })
               .end()
               .findById("WIDGET_5")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, otherWidgetsExpectedWidth, 10, "Widget 5 was not the correct size");
               });
         },

         "Resize the window": function() {
            // Resizing the window should cause all the widgets to adjust their sizes appropriately to accomodate
            // the new window size...
            var widget2ExpectedWidth;
            var otherWidgetsExpectedWidth;
            windowSize = 850;
            return this.remote.setWindowSize(null, windowSize, 400)
               .findByCssSelector("body")
               .getSize()
               .then(function(size) {
                  scrollbarWidth = windowSize - size.width;
                  availableWidth = size.width - pagePaddingAllocation - scrollbarAllocation;
                  widget2ExpectedWidth = (availableWidth / 2) - widgetPadding;
                  otherWidgetsExpectedWidth = ((availableWidth - widget2ExpectedWidth) / 3) - widgetPadding;
               })
               .end()
               .findById("WIDGET_2")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, widget2ExpectedWidth, 10, "Widget 2 was not the correct size");
               })
               .end()
               .findById("WIDGET_3")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, otherWidgetsExpectedWidth, 10, "Widget 3 was not the correct size");
               })
               .end()
               .findById("WIDGET_4")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, otherWidgetsExpectedWidth, 10, "Widget 4 was not the correct size");
               })
               .end()
               .findById("WIDGET_5")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, otherWidgetsExpectedWidth, 10, "Widget 5 was not the correct size");
               });
         },

         "Hide Widget 2": function() {
            // Hiding Widget 1 should cause all the remaining widgets to recalculate their sizes
            // such that Widget 2 has half the available space and Widgets 3,4 and 5 share the remaining space
            var expectedWidth = (availableWidth / 3) - widgetPadding;

            return this.remote.findById("HIDE_WIDGET_2_BUTTON_label")
               .click()
               .end()
               .findById("WIDGET_2")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "Widget 1 should have been hidden");
               })
               .end()
               .findById("WIDGET_3")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, expectedWidth, 10, "Widget 3 was not the correct size");
               })
               .end()
               .findById("WIDGET_4")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, expectedWidth, 10, "Widget 4 was not the correct size");
               })
               .end()
               .findById("WIDGET_5")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.width, expectedWidth, 10, "Widget 5 was not the correct size");
               });
         },

         "Check that when a widget is revealed that a resize event is published": function() {
            return this.remote.findById("HIDE_WIDGET_2_BUTTON_label")
               .clearLog()
               .click()
               .end()
               .getLastPublish("ALF_NODE_RESIZED", "A resize publication should have been made");
         }
      };
   });
});