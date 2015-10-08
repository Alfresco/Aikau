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
 * This is a unit test for ClassicWindow
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Classic Window Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ClassicWindow", "Classic Window Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check the classic windows are present": function () {
         return browser.findById("WINDOW1")
            .then(function () {
               
            },
            function () {
               assert(false, "Classic Window 1 not found");
            })
            .end()

            .findById("WINDOW2")
            .then(function () {
               
            },
            function () {
               assert(false, "Classic Window 2 not found");
            });
      },

      "Check the Classic Windows have appropriate title bars shown": function() {
         return browser.findByCssSelector("#WINDOW1 .titlebar")
            .then(function () {
               
            },
            function () {
               assert(false, "Classic Window 1 titlebar not found");
            })
            .end()

            .findByCssSelector("#WINDOW2 .titlebar")
            .then(function () {
               assert(false, "Classic Window 2 should not have a titlebar");
            },
            function () {
               
            });
      },

      "Check Classic Window 1 has the appropariate title": function() {
         return browser.findByCssSelector("#WINDOW1 .titlebar")
            .getVisibleText()
            .then(function (text) {
               assert.strictEqual(text, "Test title");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});