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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"],
       function(registerSuite, assert, TestCommon) {

registerSuite(function(){
   var browser;

   return {

      name: "Full Screen Dialog Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/FullScreenDialogs", "Full Screen Dialog Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Create full screen dialog": function() {
         var windowSize;
         return browser.setWindowSize(null, 1024, 400).findByCssSelector("body")
            .getSize()
            .then(function(size) {
               windowSize = size;
            })
         .end()
         .findById("FULL_SCREEN_DIALOG_label")
            .click()
         .end()
         .findByCssSelector("#FSD1.dialogDisplayed")
            .getSize()
            .then(function(size) {
               assert.equal(windowSize.height - 40, size.height, "Height wrong");
               assert.equal(windowSize.width - 40, size.width, "Width wrong");
            });
      },

      "Resize window (1)": function() {
         var windowSize;
         return browser.setWindowSize(null, 1024, 600).end()
            .findByCssSelector("body")
            .getSize()
            .then(function(size) {
               windowSize = size;
            })
         .end()
         .findByCssSelector("#FSD1.dialogDisplayed")
            .getSize()
            .then(function(size) {
               assert.equal(windowSize.height - 40, size.height, "Height wrong");
               assert.equal(windowSize.width - 40, size.width, "Width wrong");
            })
         .end()
         .findById("FULL_SCREEN_DIALOG_CLOSE_label")
            .click()
         .end()
         .findByCssSelector("#FSD1.dialogHidden");
      },

      "Create full screen form dialog": function() {
         var windowSize;
         return browser.findByCssSelector("body")
            .getSize()
            .then(function(size) {
               windowSize = size;
            })
         .end()
         .findById("FULL_SCREEN_FORM_DIALOG_label")
            .click()
         .end()
         .findByCssSelector("#FSD2.dialogDisplayed")
            .getSize()
            .then(function(size) {
               assert.equal(windowSize.height - 80, size.height, "Height wrong");
               assert.equal(windowSize.width - 80, size.width, "Width wrong");
            });
      },

      "Resize window (2)": function() {
         var windowSize;
         return browser.setWindowSize(null, 1024, 700)
            .findByCssSelector("body")
            .getSize()
            .then(function(size) {
               windowSize = size;
            })
         .end()
         .findByCssSelector("#FSD2.dialogDisplayed")
            .getSize()
            .then(function(size) {
               assert.equal(windowSize.height - 80, size.height, "Height wrong");
               assert.equal(windowSize.width - 80, size.width, "Width wrong");
            })
         .end()
         .findById("FSD2_OK_label")
            .click()
         .end()
         .findByCssSelector("#FSD2.dialogHidden");
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});