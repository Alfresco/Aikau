/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 *
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
      function (registerSuite, assert, TestCommon, keys) {

   registerSuite(function(){
      var browser;

      return {
         name: "Drop Down Button Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/DropDownButtons", "Drop Down Button Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Open left drop-down": function() {
            return browser.findById("DDB1_DROP_DOWN_BUTTON_label")
               .click()
            .end()

            .findDisplayedById("DDB1_DROP_DOWN_DISPLAY")
            .end()

            .findDisplayedById("TB1")
            .end()

            .findDisplayedById("TB1")
            .end()
         },

         "Click button to close left drop-down": function() {
            return browser.findDisplayedByCssSelector("#FORM .confirmationButton > span")
               .click()
            .end()

            .getLastPublish("SAVE")

            .findById("DDB1_DROP_DOWN_DISPLAY")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed);
               });
         },

         "Tab to and open right, drop-down": function() {
            return browser.findByCssSelector("body")
               .tabToElement("#DDB2_DROP_DOWN_BUTTON")
               .pressKeys(keys.ENTER)
            .end()

            .findDisplayedById("DDB2_DROP_DOWN_DISPLAY")
         },

         "Press escape to close drop-down": function() {
            return browser.pressKeys(keys.ESCAPE)
               .findById("DDB2_DROP_DOWN_DISPLAY")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed);
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});