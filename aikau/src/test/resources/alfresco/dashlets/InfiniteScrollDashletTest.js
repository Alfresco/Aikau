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
 * Test class for the Dashlet widget.
 * 
 * @author Dave Draper
 */
define(["alfresco/TestCommon",
        "intern/chai!assert",
        "intern!object",
        "intern/dojo/node!leadfoot/keys"],
        function(TestCommon, assert, registerSuite, keys) {

   var browser;
   registerSuite({
      name: "Infinite Scrolling Dashlet Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/InfiniteScrollDashlet", "Infinite Scrolling Dashlet Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Scroll to bottom of first dashlet body": function() {
         return browser.execute(function() {
               document.querySelector("#BELOW_DASHLET .alfresco-dashlets-Dashlet__body__widgets").scrollTop += 20;
            })
            .getLastPublish("BELOW_ALF_EVENTS_SCROLL")
            .then(function(payload) {
               assert.isNotNull(payload, "List scroll event not registered");
            })
            .end()

         .findAllByCssSelector("#INFINITE_SCROLL_LIST_1 tr")
            .then(function(elements) {
               assert.lengthOf(elements, 15, "Additional rows were not loaded when the bottom of the list was reached");
            });
      },

      "Scroll to bottom of second dashlet body": function() {
         return browser.execute(function() {
               document.querySelector("#ABOVE_DASHLET .alfresco-dashlets-Dashlet__body__widgets").scrollTop += 100;
            })
            .getLastPublish("ABOVE_ALF_EVENTS_SCROLL")
            .then(function(payload) {
               assert.isNotNull(payload, "List scroll event not registered");
            })
            .end()
            .findAllByCssSelector("#INFINITE_SCROLL_LIST_2 tr")
            .then(function(elements) {
               assert.lengthOf(elements, 40, "Additional rows were not loaded when the bottom of the list was reached");
            });
      },

      // This does not work in Chrome currently, however we expect the FF test to pass, so this provides some level of regression testability
      "Resizing first dashlet prompts data-load (NOT EXPECTED TO WORK IN CHROME)": function() {
         return browser.findByCssSelector("#BELOW_DASHLET .alfresco-dashlets-Dashlet__resize-bar__icon")
            .moveMouseTo(0, 0)
            .pressMouseButton()
            .moveMouseTo(0, 50)
            .releaseMouseButton()
            .end()

         .findAllByCssSelector("#INFINITE_SCROLL_LIST_1 tr")
            .then(function(elements) {
               assert.lengthOf(elements, 18, "Additional rows were not loaded when the dashlet was resized");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});