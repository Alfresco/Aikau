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
        "alfresco/TestCommon",
        'intern/dojo/node!fs',
        "intern/dojo/node!leadfoot/helpers/pollUntil",
        "intern/dojo/node!leadfoot/Command"], 
        function (registerSuite, expect, assert, require, TestCommon, fs, pollUntil, Command) {

   var startSize;

   registerSuite({
      name: 'AlfSideBarContainer Tests',
      'Test preferences requested': function () {
         return TestCommon.loadTestWebScript(this.remote, "/AlfSideBarContainer", "AlfSideBarContainer Tests")
         .findByCssSelector(TestCommon.pubDataCssSelector("ALF_PREFERENCE_GET", "preference", "org.alfresco.share.sideBarWidth"))
            .then(
               function(element) {
                  // No action - preferences request found
               },
               function(err) {
                  assert(false, "User preferences were not requested");
               })
         .end();
      },
      'Test Resized Handle Exists': function () {
         return this.remote.findByCssSelector(".resize-handle")
            .then(
               function(element) {
                  // No action required - resize handler found
               },
               function(err) {
                  assert(false, "Couldn't find resize handle");
               })
         .end();
      },
      'Test Sidebar Placement': function () {
         return this.remote.findByCssSelector(".alfresco-layout-AlfSideBarContainer .sidebar #SIDEBAR_LOGO")
            .then(
               function(element) {
                  // No action required - found logo in sidebar
               },
               function(err) {
                  assert(false, "Logo wasn't placed correctly into the sidebar");
               })
         .end();
      },
      'Test Main Panel Placement': function () {
         return this.remote.findByCssSelector(".alfresco-layout-AlfSideBarContainer .main #MAIN_LOGO")
            .then(
               function(element) {
                  // No action required - found logo in main panel
               },
               function() {
                  assert(false, "Main logo wasn't placed correctly into main panel");
               })
         .end();
      },
      'Test Initial Widths': function () {
         return this.remote.findByCssSelector(".alfresco-layout-AlfSideBarContainer .sidebar")
            .getComputedStyle("width")
            .then(function(width) {
               assert(width == "150px", "The sidebar width wasn't initialised correctly");
            })
         .end();
      },
      'Test Hide Sidebar': function () {
         return this.remote.findByCssSelector(".resize-handle-button")
            .click()
         .end()
         .findByCssSelector(".alfresco-layout-AlfSideBarContainer .sidebar")
            .getComputedStyle("width")
            .then(function(width) {
               assert(width == "9px", "The sidebar wasn't hidden via the bar control");
            })
         .end();
      },
      'Test Show Sidebar': function() {
         return this.remote.findByCssSelector(".resize-handle-button")
            .click()
         .end()
         .findByCssSelector(".alfresco-layout-AlfSideBarContainer .sidebar")
            .getComputedStyle("width")
            .then(function(width) {
               assert(width == "150px", "The sidebar wasn't shown via the bar control");
            })
         .end();
      },
      'Test Hide Sidebar via PubSub': function() {
         return this.remote.findByCssSelector("#HIDE_BUTTON")
            .click()
         .end()
         .findByCssSelector(".alfresco-layout-AlfSideBarContainer .sidebar")
            .getComputedStyle("width")
            .then(function(width) {
               assert(width == "9px", "The sidebar wasn't hidden via publication");
            })
         .end();
      },
      'Test Show Sidebar via PubSub': function() {
         var browser = this.remote;
         return this.remote.findByCssSelector("#SHOW_BUTTON")
            .click()
         .end()
         .findByCssSelector(".alfresco-layout-AlfSideBarContainer .sidebar")
            .getComputedStyle("width")
            .then(function(width) {
               assert(width == "150px", "The sidebar wasn't shown via publication");
            })
         .end()
         .alfPostCoverageResults(browser);
      }
      // TODO: Re-instate when figured out how to resize with Leadfoot!
      // ,
      // 'Test Resize': function () {
      //    var browser = this.remote;
      //    return this.remote.findByCssSelector(".sidebar")
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
      //    .findByCssSelector(".sidebar")
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