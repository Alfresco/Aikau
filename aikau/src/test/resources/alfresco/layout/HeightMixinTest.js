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
 * This is a unit test for the HeightMixin
 *
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"],
       function(registerSuite, assert, TestCommon) {

   var windowHeight;
   var browser;
   registerSuite({
      name: "HeightMixin tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/HeightMixin", "HeightMixin Tests").end();
      },

      beforeEach: function() {
         browser.findByCssSelector("body")
            .getSize()
            .then(function(size) {
               windowHeight = size.height - 20; // PLEASE NOTE: 20 pixels deducted for test page padding
            })
         .end();
      },

      "Check AUTO height": function() {
         return browser.findById("AUTO")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, windowHeight, "Height not calculated correctly");
            });
      },

      "Check AUTO height (with adjustment)": function() {
         return browser.findById("AUTO_WITH_ADJUSTMENT")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, windowHeight - 50, "Height not calculated correctly");
            });
      },

      "Check FIXED height": function() {
         return browser.findById("FIXED")
            .getSize()
            .then(function(size) {
               // NOTE: Extra 2 pixels for border compensation
               assert.equal(size.height, 202, "Height not calculated correctly");
            });
      },

      "Check MINUS height": function() {
         return browser.findById("MINUS")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, windowHeight - 100, "Height not calculated correctly");
            });
      },

      "Show dialog with no padding and fixed height": function() {
         return browser.findById("LAUNCH_DIALOG_1_label")
            .click()
         .end()
         .findByCssSelector("#HEIGHT_DIALOG_1.dialogDisplayed")
         .end()
         .findById("DIALOG_1_TEST")
            .getSize()
            .then(function(size) {
               // Height is the dialog content height minus 2px adjustment to show border
               assert.equal(size.height, 300, "Height not calculated correctly");
            })
         .end()
         .findByCssSelector("#HEIGHT_DIALOG_1 .dijitDialogCloseIcon")
            .click()
         .end()
         .findByCssSelector("#HEIGHT_DIALOG_1.dialogHidden")
         .end();
      },

      "Show dialog with padding and fixed height": function() {
         return browser.findById("LAUNCH_DIALOG_2_label")
            .click()
         .end()
         .findByCssSelector("#HEIGHT_DIALOG_2.dialogDisplayed")
         .end()
         .findById("DIALOG_2_TEST")
            .getSize()
            .then(function(size) {
               // Height is minus the standard border adjustment of 24 pixels
               assert.equal(size.height, 76, "Height not calculated correctly");
            })
         .end()
         .findByCssSelector("#HEIGHT_DIALOG_2 .dijitDialogCloseIcon")
            .click()
         .end()
         .findByCssSelector("#HEIGHT_DIALOG_2.dialogHidden")
         .end();
      },

      "Show dialog with defaults": function() {
         return browser.findById("LAUNCH_DIALOG_3_label")
            .click()
         .end()
         .findByCssSelector("#HEIGHT_DIALOG_3.dialogDisplayed")
         .end()
         .findById("DIALOG_3_TEST")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 18, "Height not calculated correctly");
            })
         .end()
         .findByCssSelector("#HEIGHT_DIALOG_3 .dijitDialogCloseIcon")
            .click()
         .end()
         .findByCssSelector("#HEIGHT_DIALOG_3.dialogHidden")
         .end();
      },

      "Show dialog with buttons": function() {
         return browser.findById("LAUNCH_DIALOG_4_label")
            .click()
         .end()
         .findByCssSelector("#HEIGHT_DIALOG_4.dialogDisplayed")
         .end()
         .findById("DIALOG_4_TEST")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 18, "Height not calculated correctly");
            })
         .end()
         .findByCssSelector("#HEIGHT_DIALOG_4 .dijitDialogCloseIcon")
            .click()
         .end()
         .findByCssSelector("#HEIGHT_DIALOG_4.dialogHidden")
         .end();
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});