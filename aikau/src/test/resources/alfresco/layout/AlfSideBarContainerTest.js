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

         "Sidebar height increases with window size": function() {
            var sidebarHeight;
            return browser.setWindowSize(null, 1024, 768)
               .findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
               .getSize()
               .then(function(size) {
                  sidebarHeight = size.height;
               })
               .end()

            .setWindowSize(null, 1024, 968)
               .findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
               .getSize()
               .then(function(size) {
                  assert.equal(sidebarHeight + 200, size.height);
                  sidebarHeight = size.height;
               });
         },

         "Sidebar height decreases with window size": function() {
            var sidebarHeight;
            return browser.findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
               .getSize()
               .then(function(size) {
                  sidebarHeight = size.height;
               })
               .end()

            .setWindowSize(null, 1024, 768)
               .findByCssSelector(".alfresco-layout-AlfSideBarContainer__sidebar")
               .getSize()
               .then(function(size) {
                  assert.equal(sidebarHeight - 200, size.height);
                  sidebarHeight = size.height;
               });
         },

         "Panes increase and decrease in size if other changes": function() {
            var storedHeights = {},
               getHeights = function() {
                  var sidebar = document.querySelector('.alfresco-layout-AlfSideBarContainer__sidebar'),
                     main = document.querySelector('.alfresco-layout-AlfSideBarContainer__main');
                  return {
                     sidebar: sidebar.offsetHeight,
                     main: main.offsetHeight
                  };
               };

            return browser.execute(getHeights)
               .then(function(newHeights) {
                  storedHeights.original = newHeights.sidebar;
               })
               .end()

            .execute(getHeights)
               .then(function(newHeights) {
                  assert.closeTo(newHeights.main, storedHeights.original, 2, "Main panel starting height not same as sidebar starting height");
               })
               .end()

            .findByCssSelector("#MAIN_TWISTER .alfresco-layout-Twister--closed")
               .clearLog()
               .click()
               .getLastPublish("ALF_NODE_RESIZED")
               .end()

            .execute(getHeights)
               .then(function(newHeights) {
                  storedHeights.updated1 = newHeights.main;
                  assert.isAbove(storedHeights.updated1, storedHeights.original, "Main panel height not increased after expanding small twister");
               })
               .end()

            .execute(getHeights)
               .then(function(newHeights) {
                  assert.closeTo(newHeights.sidebar, storedHeights.updated1, 2, "Side panel height not increased correctly after expanding small twister");
               })
               .end()

            .findByCssSelector("#SIDEBAR_TWISTER .alfresco-layout-Twister--closed")
               .clearLog()
               .click()
               .getLastPublish("ALF_NODE_RESIZED")
               .end()

            .execute(getHeights)
               .then(function(newHeights) {
                  storedHeights.updated2 = newHeights.sidebar;
                  assert.isAbove(storedHeights.updated2, storedHeights.updated1, "Side panel height not increased after expanding large twister");
               })
               .end()

            .execute(getHeights)
               .then(function(newHeights) {
                  assert.closeTo(newHeights.main, storedHeights.updated2, 2, "Main panel height not increased correctly after expanding large twister");
               })
               .end()

            .findByCssSelector("#SIDEBAR_TWISTER .alfresco-layout-Twister--open")
               .clearLog()
               .click()
               .getLastPublish("ALF_NODE_RESIZED")
               .end()

            .execute(getHeights)
               .then(function(newHeights) {
                  assert.closeTo(newHeights.main, storedHeights.updated1, 2, "Main panel height not restored correctly after collapsing large twister");
               })
               .end()

            .execute(getHeights)
               .then(function(newHeights) {
                  assert.closeTo(newHeights.sidebar, storedHeights.updated1, 2, "Side panel height not restored correctly after collapsing large twister");
               })
               .end()

            .findByCssSelector("#MAIN_TWISTER .alfresco-layout-Twister--open")
               .clearLog()
               .click()
               .getLastPublish("ALF_NODE_RESIZED")
               .end()

            .execute(getHeights)
               .then(function(newHeights) {
                  assert.closeTo(newHeights.main, storedHeights.original, 2, "Main panel height not restored correctly after collapsing small twister");
               })
               .end()

            .execute(getHeights)
               .then(function(newHeights) {
                  assert.closeTo(newHeights.sidebar, storedHeights.original, 2, "Side panel height not restored correctly after collapsing small twister");
               })
               .end()
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
            return browser.findByCssSelector(".alfresco-layout-AlfSideBarContainer__resize-handle")
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