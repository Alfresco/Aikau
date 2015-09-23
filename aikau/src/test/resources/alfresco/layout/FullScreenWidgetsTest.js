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
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

registerSuite(function(){
   var browser;

   return {
      name: "Full Screen Widgets Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/FullScreenWidgets", "Full Screen Widgets Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Tests": function () {
         var testname = "Full Screen Widgets Test";
         return browser.findByCssSelector(".alfresco-core-FullScreenMixin-fullWindow")
            .then(
               function() {
                  assert(false, "Test #1a - Full window class found unexpectedly");
               },
               function() { 
                  TestCommon.log(testname, "Found full window class not present as expected");
               }
            )
            .end()

         // Go full window...
         .findByCssSelector("#POPUP_MENU")
            .click()
            .end()
         .findByCssSelector("#FULL_WINDOW")
            .click()
            .end()
         .findByCssSelector(".alfresco-core-FullScreenMixin-fullWindow")
            .then(
               function() { 
                  TestCommon.log(testname, "Found full window class as expected");
               },
               function() {
                  assert(false, "Test #1b - Full window class not found");
               }
            )
            .end()

         // Cancel full window using menu
         .findByCssSelector("#POPUP_MENU")
            .click()
            .end()
         .findByCssSelector("#FULL_WINDOW")
            .click()
            .end()
         .findByCssSelector(".alfresco-core-FullScreenMixin-fullWindow")
            .then(
               function() {
                  assert(false, "Test #2a - Full window class should have been removed");
               },
               function() { 
                  TestCommon.log(testname, "Found full window class removed correctly (on full screen)");
               }
            )
            .end()

         // Go full screen
         .findByCssSelector("#POPUP_MENU")
            .click()
            .end()
         .findByCssSelector("#FULL_WINDOW")
            .click()
            .end()
         .findByCssSelector(".alfresco-core-FullScreenMixin-fullWindow")
            .then(
               function() { 
                  TestCommon.log(testname, "Found full window class as expected");
               },
               function() {
                  assert(false, "Test #3a - Full window class not found (when full screen removed)");
               }
            )
            .end()

         // Remove full screen
         .findByCssSelector("#POPUP_MENU")
            .click()
            .end()
         .findByCssSelector("#FULL_WINDOW")
            .click()
            .end()
         .findByCssSelector(".alfresco-core-FullScreenMixin-fullWindow")
            .then(
               function() {
                  assert(false, "Test #3b - Full window class should have been removed");
               },
               function() { 
                  TestCommon.log(testname, "Found full window class removed correctly");
               }
            )
            .end()

         // Check escape key works
         .findByCssSelector("#POPUP_MENU")
            .click()
            .end()
         .findByCssSelector("#FULL_WINDOW")
            .click()
            .end()
         .findByCssSelector(".alfresco-core-FullScreenMixin-fullWindow")
            .then(
               function() { 
                  TestCommon.log(testname, "Found full window class as expected");
               },
               function() {
                  assert(false, "Test #4a - Full window class not found");
               }
            )
            .end()
            
         .pressKeys(keys.ESCAPE)
         .findByCssSelector(".alfresco-core-FullScreenMixin-fullWindow")
            .then(
               function() {
                  assert(false, "Test #4b - Full window class should have been removed after pressing escape key");
               },
               function() { 
                  TestCommon.log(testname, "Found full window class removed correctly following escape key press");
               }
            );
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});