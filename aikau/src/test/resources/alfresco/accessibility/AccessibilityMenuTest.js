/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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

   registerSuite({
      name: 'AccessibilityMenu Test',
      'alfresco/accessibility/AccessibilityMenu': function () {

         var browser = this.remote;
         var testname = "AccessibilityMenuTest";
         return TestCommon.loadTestWebScript(this.remote, "/AccessibilityMenu", testname)

         // Find the menu element
         .findById("AccessibilityMenu")
            .then(function (el) {
               TestCommon.log(testname,"Find the menu element");
               expect(el).to.be.an("object", "The Accessibility Menu could not be found");
            })
            .end()

         // Find the heading text
         .findByCssSelector("#AccessibilityMenu > p")
            .getVisibleText()
            .then(function(headingText) {
               TestCommon.log(testname,"Find the heading text");
               expect(headingText).to.equal("Access key links:", "The heading text is wrong");
            })
            .end()

         // Find the menu items
         .findAllByCssSelector("#AccessibilityMenu > ul > li")
            .then(function (menuitems) {
               TestCommon.log(testname,"Find the menu items");
               expect(menuitems).to.have.length(8, "The Accessibility Menu does not contain 8 <li> items");
            })
            .end()

         // Find the first target
         .findByCssSelector("a#accesskey-skip")
            .then(function (el) {
               TestCommon.log(testname,"Find the first target");
               expect(el).to.be.an("object", "The accesskey-skip target is missing");
            })
            .end()

         // Find the second target
         .findById("accesskey-foot")
            .then(function (el) {
               TestCommon.log(testname,"Find the second target");
               expect(el).to.be.an("object", "The accesskey-foot target is missing");
            })
            .end()

         // Find the first menu link - which links the first target
         .findByCssSelector("#AccessibilityMenu > ul > li:nth-of-type(1) > a ")
            .then(function (el) {
               TestCommon.log(testname,"Find the first menu link - which links the first target");
               expect(el).to.be.an("object", "The first link is missing");
            })
            .end()

         // Hit the browser with a sequence of different accesskey combinations and the letter 's' for a nav skip
         .pressKeys([keys.SHIFT, "s"])
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
               TestCommon.log(testname,"Hit the browser with a sequence of different accesskey combinations and the letter 's' for a nav skip");
               expect(page).to.contain("#accesskey-skip", "Accesskey target not linked to");
            }
            else {
               TestCommon.log(testname,"Skipping key combo test due to Mac compatibility issues.");
            }
         })
         .end()

         .alfPostCoverageResults(browser);
      }
   });
});