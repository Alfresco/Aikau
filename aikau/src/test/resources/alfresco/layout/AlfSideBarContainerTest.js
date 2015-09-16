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

   // var startSize;
   var browser;
   registerSuite({
      name: "AlfSideBarContainer Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfSideBarContainer", "AlfSideBarContainer Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Test preferences requested": function () {
         return browser.findByCssSelector(".resize-handle") // Need to find something before getting logged publish data
            .getLastPublish("ALF_PREFERENCE_GET")
               .then(function(payload) {
                  assert.propertyVal(payload, "preference", "org.alfresco.share.sideBarWidth", "User preferences were not requested");
               });
      },

      "Test Resized Handle Exists": function () {
         return browser.findByCssSelector(".resize-handle")
            .then(
               function() {
                  // No action required - resize handler found
               },
               function() {
                  assert(false, "Couldn't find resize handle");
               });
      },

      "Test Sidebar Placement": function () {
         return browser.findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar #SIDEBAR_LOGO")
            .then(
               function() {
                  // No action required - found logo in sidebar
               },
               function() {
                  assert(false, "Logo wasn't placed correctly into the sidebar");
               });
      },

      "Test Main Panel Placement": function () {
         return browser.findByCssSelector(".alfresco-layout-AlfSideBarContainer__main #MAIN_LOGO")
            .then(
               function() {
                  // No action required - found logo in main panel
               },
               function() {
                  assert(false, "Main logo wasn't placed correctly into main panel");
               });
      },

      "Test Initial Widths": function () {
         return browser.findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
            .getSize()
            .then(function(size) {
               // NOTE: The width has to take the 10px right padding into account
               assert.equal(size.width, 360, "The sidebar width wasn't initialised correctly");
            });
      },

      "Test Hide Sidebar": function () {
         return browser.findByCssSelector(".resize-handle-button")
            .click()
         .end()
         .findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
            .getSize()
            .then(function(size) {
               assert.equal(size.width, 9, "The sidebar wasn't hidden via the bar control");
            });
      },

      "Test Show Sidebar": function() {
         return browser.findByCssSelector(".resize-handle-button")
            .click()
         .end()
         .findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
            .getSize()
            .then(function(size) {
               // NOTE: The width has to take the 10px right padding into account
               assert.equal(size.width, 360, "The sidebar wasn't shown via the bar control");
            });
      },

      "Test Hide Sidebar via PubSub": function() {
         return this.remote.findByCssSelector("#HIDE_BUTTON")
            .click()
         .end()
         .findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
            .getSize()
            .then(function(size) {
               assert.equal(size.width, 9, "The sidebar wasn't hidden via publication");
            });
      },

      "Test Show Sidebar via PubSub": function() {
         return browser.findByCssSelector("#SHOW_BUTTON")
            .click()
         .end()
         .findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
            .getSize()
            .then(function(size) {
               // NOTE: The width has to take the 10px right padding into account
               assert.equal(size.width, 360, "The sidebar wasn't shown via publication");
            })
         .end();
      },

      "Increase window size and check sidebar height": function() {
         var bodyHeight;
         return browser.findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar") // Need to find something before clearing logs!
            .end()
            .clearLog() // Clear the logs otherwise they'll force the size of the window
            .setWindowSize(null, 1024, 968)
            .findByCssSelector("body")
               .getSize()
               .then(function(size) {
                  // We need the body size, not the window size because the window size includes all the OS chrome
                  bodyHeight = size.height;
               })
            .findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
               .getSize()
               .then(function(size) {
                  // Substracting the padding from the height!
                  assert.closeTo(size.height, (bodyHeight - 20), 5, "The sidebar height didn't increase with the window size");
               });
      },

      "Decrease window size and check sidebar height": function() {
         var bodyHeight;
         return browser.findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar") // Need to find something before clearing logs!
            .end()
            .clearLog() // Clear the logs otherwise they'll force the size of the window
            .setWindowSize(null, 1024, 568)
            .findByCssSelector("body")
               .getSize()
               .then(function(size) {
                  // We need the body size, not the window size because the window size includes all the OS chrome
                  bodyHeight = size.height;
               })
            .findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
               .getSize()
               .then(function(size) {
                  // Substracting the padding from the height!
                  assert.closeTo(size.height, (bodyHeight - 20), 5, "The sidebar height didn't decrease with the window size");
               });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
      // TODO: Re-instate when figured out how to resize with Leadfoot!
      // ,
      // "Test Resize": function () {
      //    var browser = this.remote;
      //    return this.remote.findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
      //       .getSize()
      //       .then(function(size) {
      //          console.log("Initial sidebar width: " + size.width);
      //          startSize = size;
      //       })
      //    .end()
      //    // .releaseMouseButton()
      //    // .catch(function(err) {
      //    //    // No action required
      //    // })
      //    .findByCssSelector(".resize-handle")
      //       .moveMouseTo()
      //       .click()
      //       .sleep(2000)
      //       .pressMouseButton()
      //       .moveMouseTo(1, 1)
      //       .sleep(100)
      //       .moveMouseTo(200, 1)
      //       .sleep(2000)
      //       .releaseMouseButton()
      //    .end()
      //    .findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
      //       .getSize()
      //       .then(function(endSize) {
      //          console.log("Final sidebar width: " + endSize.width);
      //          expect(endSize.width).to.be.at.least(startSize.width, "The sidebar did not resize on the x axis");
      //          // expect(endSize.height).to.equal(startSize.height, "Test #4b - The sidebar should not have resized on the y axis");
      //       })
      //    .end()
      //    .alfPostCoverageResults(browser);
      // }
   });
});