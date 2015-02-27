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

   var browser;
   registerSuite({
      name: "Reorder Renderer Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Reorder", "Reorder Renderer Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Basic Tests": function () {
         // Although there are 3 items, only 2 up arrows and 2 down arrows should be displayed (first
         // can't be moved up, last can't be moved down)...
         return browser.findAllByCssSelector(".alfresco-renderers-Reorder .up")
            .then(function(elements) {
               assert(elements.length === 3, "Test #1a - Unexpected number of up arrows: " + elements.length);
            })
            .end()
         .findAllByCssSelector(".alfresco-renderers-Reorder .up.invisible")
            .then(function(elements) {
               assert(elements.length === 1, "Test #1b - Unexpected number of INVISIBLE up arrows: " + elements.length);
            })
            .end()
         .findByCssSelector(".alfresco-lists-views-layouts-Row:nth-child(1) .alfresco-renderers-Reorder .up")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test #1c - The first up arrow was displayed incorrectly");
            })
            .end()

         .findAllByCssSelector(".alfresco-renderers-Reorder .down")
            .then(function(elements) {
               assert(elements.length === 3, "Test #1d - Unexpected number of down arrows: " + elements.length);
            })
            .end()
         .findAllByCssSelector(".alfresco-renderers-Reorder .down.invisible")
            .then(function(elements) {
               assert(elements.length === 1, "Test #1e - Unexpected number of INVISIBLE down arrows: " + elements.length);
            })
            .end()

         .findByCssSelector(".alfresco-lists-views-layouts-Row:nth-child(3) .alfresco-renderers-Reorder .down")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Test #1f - The last down arrow was displayed incorrectly");
            })
            .end()

         // Check the alt-text is meaningful...
         .findByCssSelector(".alfresco-lists-views-layouts-Row:nth-child(1) .alfresco-renderers-Reorder .down > img")
            .getAttribute("alt")
            .then(function(result) {
               assert(result === "Click to move \"First\" down a place", "Test #2a - Alt text not set correctly on down arrow: " + result);
            })
            .end()
         .findByCssSelector(".alfresco-lists-views-layouts-Row:nth-child(2) .alfresco-renderers-Reorder .up > img")
            .getAttribute("alt")
            .then(function(result) {
               assert(result === "Click to move \"Middle\" up a place", "Test #2a - Alt text not set correctly on down arrow: " + result);
            })
            .end()

         // Check that publications are issued correctly...
         .findByCssSelector(".alfresco-lists-views-layouts-Row:nth-child(1) .alfresco-renderers-Reorder .down > img")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_MOVE_DOWN", "publish", "last"))
            .then(function(elements) {
               assert(elements.length === 1, "Test #3a - Move down topic not published");
            })
            .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "name", "First"))
            .then(function(elements) {
               assert(elements.length === 1, "Test #3b - Move down payload not published correctly");
            })
            .end()

         .findByCssSelector(".alfresco-lists-views-layouts-Row:nth-child(2) .alfresco-renderers-Reorder .up > img")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_MOVE_UP", "publish", "last"))
            .then(function(elements) {
               assert(elements.length === 1, "Test #3c - Move up topic not published");
            })
            .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "name", "Middle"))
            .then(function(elements) {
               assert(elements.length === 1, "Test #3d - Move up payload not published correctly");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});