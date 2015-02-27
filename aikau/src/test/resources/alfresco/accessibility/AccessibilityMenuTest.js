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
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, require, TestCommon, keys) {

   var browser;
   registerSuite({
      name: "AccessibilityMenu Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AccessibilityMenu", "AccessibilityMenu Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },
      
      "Find the menu element": function () {
         // Find the menu element
         return browser.findById("AccessibilityMenu")
            .then(function (el) {
               expect(el).to.be.an("object", "The Accessibility Menu could not be found");
            });
      },

      "Find the heading text": function() {
         // Find the heading text
         return browser.findByCssSelector("#AccessibilityMenu > p")
            .getVisibleText()
            .then(function(headingText) {
               expect(headingText).to.equal("Access key links:", "The heading text is wrong");
            });
      },

      "Find the menu items": function() {
         // Find the menu items
         return browser.findAllByCssSelector("#AccessibilityMenu > ul > li")
            .then(function (menuitems) {
               expect(menuitems).to.have.length(8, "The Accessibility Menu does not contain 8 <li> items");
            });
      },

      "Find the first target": function() {
         // Find the first target
         return browser.findByCssSelector("a#accesskey-skip")
            .then(function (el) {
               expect(el).to.be.an("object", "The accesskey-skip target is missing");
            });
      },

      "Find the second target": function() {
         // Find the second target
         return browser.findById("accesskey-foot")
            .then(function (el) {
               expect(el).to.be.an("object", "The accesskey-foot target is missing");
            });
      },

      "Find the first menu link - which links the first target": function() {
         // Find the first menu link - which links the first target
         return browser.findByCssSelector("#AccessibilityMenu > ul > li:nth-of-type(1) > a ")
            .then(function (el) {
               expect(el).to.be.an("object", "The first link is missing");
            });
      },

      "Test access keys": function() {
         // Hit the browser with a sequence of different accesskey combinations and the letter 's' for a nav skip
         return browser.pressKeys([keys.SHIFT, "s"])
            .pressKeys([keys.SHIFT])
            .pressKeys([keys.ALT, keys.SHIFT, "s"])
            .pressKeys([keys.ALT, keys.SHIFT])
//       Can't do this because of a conflict in FF on Windows that calls up a dialogue
//         .pressKeys([keys["Control"], keys["Command"], "s"])
//         .pressKeys([keys["Control"], keys["Command"]])
            .getCurrentUrl()
            .then(function (page) {
               // Only check the test if this isn't a Mac because of key combo conflicts.
               if(browser.environmentType.platform !== "MAC") {
                  expect(page).to.contain("#accesskey-skip", "Accesskey target not linked to");
               }
               else {
               }
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});