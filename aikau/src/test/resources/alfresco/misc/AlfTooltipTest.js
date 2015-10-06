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
      name: "AlfTooltip Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfTooltip", "AlfTooltip Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check tooltip is created": function() {
         return browser.findByCssSelector("#LOGO1")
            .moveMouseTo()
         .end()
         .findAllByCssSelector("#SINGLE_ITEM_TOOLTIP")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find tooltip");
            });
      },

      "Check tooltip is displayed": function() {
         return browser.findByCssSelector("#SINGLE_ITEM_TOOLTIP")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The tooltip was not displayed");
            });
      },

      "Check width of tooltip is correct": function() {
         return browser.findByCssSelector("#SINGLE_ITEM_TOOLTIP")
            .getSize()
            .then(function(size) {
               // width set is 300, 306 accounts for styling
               assert.equal(size.width, 306, "The tooltip width was incorrect"); 
            });
      },

      "Check tooltip content": function() {
         return browser.findByCssSelector("#LABEL1")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "This is the tooltip content", "The tooltip content was not created");
            });
      },

      "Check tooltip is hidden": function() {
         return browser.findByCssSelector("#LIST2 tr:first-child .alfresco-renderers-Property .value")
            .moveMouseTo()
            .sleep(500)
         .end()
         .findByCssSelector("#SINGLE_ITEM_TOOLTIP")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The tooltip was not hidden");
            });
      },

      "Check click tooltip is not displayed": function() {
         return browser.findByCssSelector("#LOGO1_REQUIRES_CLICK")
            .moveMouseTo()
         .end()
         .findAllByCssSelector("#LABEL1_REQUIRES_CLICK")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The tooltip was displayed but should require click");
            });
      },

      "Check XHR generated data": function() {
         return browser.findAllByCssSelector(".alfresco-renderers-Thumbnail")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find XHR generated content");
            });
      },
      
      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});