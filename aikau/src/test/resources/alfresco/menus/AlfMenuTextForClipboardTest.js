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
 * This is the unit test for the alfresco/menus/AlfMenuTextForClipboard widget.
 * 
 * PLEASE NOTE: Development of this test has been temporarily abandoned as I can't get the modifier keys for
 * the copy/paste actions to work correctly - I've raised the following question on StackOverflow: 
 * http://stackoverflow.com/questions/20565341/how-do-i-keyboard-cut-and-paste-in-intern-functional-test
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

registerSuite(function(){
   var browser;

   return {
      name: "AlfMenuTextForClipboard Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuTextForClipboard", "AlfMenuTextForClipboard Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Tests": function () {
         var testName = "Menu Text For Clipboard Test";
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuTextForClipboard", testName)

            // Test #1
            // Check the initial labels...
            .pressKeys(keys.TAB)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_RIGHT)
            // .findByCssSelector("#TEXT1 span.label")
            //    .getVisibleText()
            //    .then(function(resultText) {
            //       assert(resultText == "", "Test #1a - The inital label of TEXT1 has been set incorrectly: " + resultText);
            //    })
            //    .end()
            .pressKeys(keys.ARROW_LEFT)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_RIGHT)
            // .findByCssSelector("#TEXT2 span.label")
            //    .getVisibleText()
            //    .then(function(resultText) {
            //       assert(resultText == "", "Test #1b - The inital label of TEXT2 has been set incorrectly: " + resultText);
            //    })
            // .end()
            .pressKeys(keys.ARROW_LEFT)
            .pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.ARROW_RIGHT)

            // .findByCssSelector("#TEXT3 span.text")
            // .addValue(['Control','x','NULL'],function(err) {
            //             expect(err).to.be.null;
            //         })
            // .sleep(2000)
            // .type([keys["Control"],"c"])


            .pressKeys(keys.TAB)
            .pressKeys(keys.TAB);
            // .pressKeys(keys.TAB)
            // .findByCssSelector("#TEXTAREA textarea")
            //    .click()
            //    // .type("hello")
            //    // .sleep(1000)
            // .sleep(2000)
            // .type([keys["Control"],"v"])
               // .end()
               // .sleep(2000)


            // .findByCssSelector("#TEXT3 span.label")
            //    .getVisibleText()
            //    .then(function(resultText) {
            //       assert(resultText == "Copy me!", "Test #1c - The inital label of TEXT3 has been set incorrectly: " + resultText);
            //    })
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});