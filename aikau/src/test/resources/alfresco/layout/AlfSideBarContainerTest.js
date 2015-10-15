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
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
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
            return browser.findByCssSelector(".resize-handle");
         },

         "Test Sidebar Placement": function () {
            return browser.findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar #SIDEBAR_LOGO");
         },

         "Test Main Panel Placement": function () {
            return browser.findByCssSelector(".alfresco-layout-AlfSideBarContainer__main #MAIN_LOGO");
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

         "Test Resize": function() {
            // TODO: We haven't figured out how to do this reliably with LeadFoot
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "AlfSideBarContainer Tests (not resizable)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/SimpleSideBarContainer", "AlfSideBarContainer Tests (not resizable)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Resize bar is hidden": function() {
            return browser.findByCssSelector(".alfresco-layout-AlfSideBarContainer__resizeHandle")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "The resize bar should not have been displayed");
               });
         },

         "Sidebar width is correct": function() {
            return browser.findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
               .getSize()
               .then(function(size) {
                  // NOTE: Allow a single pixel for the border...
                  assert.equal(size.width, 251, "The sidebar was not the correct width");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});