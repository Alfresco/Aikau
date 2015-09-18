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
      name: "Response Scope Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ResponseScope", "Response Scope Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "pubSubScope used as alfResponseScope when responseScope and alfResponseScope aren't set (global)": function() {
         return browser.findById("B1_label")
            .click()
         .end()
         .getLastPublish("B1")
            .then(function(payload) {
               assert.propertyVal(payload, "alfResponseScope", "", "Wrong response scope");
            });
      },

      "pubSubScope used as alfResponseScope when responseScope and alfResponseScope aren't set (scoped)": function() {
         return browser.waitForDeletedByClassName("dialogDisplayed")
            .findById("B2_label")
            .click()
         .end()
         .getLastPublish("SCOPE_B2")
            .then(function(payload) {
               assert.propertyVal(payload, "alfResponseScope", "SCOPE_", "Wrong response scope");
            });
      },

      "resposeScope used as alfResponseScope when included in payload (global)": function() {
         return browser.waitForDeletedByClassName("dialogDisplayed")
            .findById("B3_label")
            .click()
         .end()
         .getLastPublish("B3")
            .then(function(payload) {
               assert.propertyVal(payload, "alfResponseScope", "OTHER_SCOPE_", "Wrong response scope");
            });
      },

      "resposeScope used as alfResponseScope when included in payload (scoped)": function() {
         return browser.waitForDeletedByClassName("dialogDisplayed")
            .findById("B4_label")
            .click()
         .end()
         .getLastPublish("SCOPE_B4")
            .then(function(payload) {
               assert.propertyVal(payload, "alfResponseScope", "OTHER_SCOPE_", "Wrong response scope");
            });
      },

      "alfResponseScope used as alfResponseScope when included in payload (global)": function() {
         return browser.waitForDeletedByClassName("dialogDisplayed")
            .findById("B5_label")
            .click()
         .end()
         .getLastPublish("B5")
            .then(function(payload) {
               assert.propertyVal(payload, "alfResponseScope", "THIRD_SCOPE_", "Wrong response scope");
            });
      },

      "alfResponseScope used as alfResponseScope when included in payload (scoped)": function() {
         return browser.waitForDeletedByClassName("dialogDisplayed")
            .findById("B6_label")
            .click()
         .end()
         .getLastPublish("SCOPE_B6")
            .then(function(payload) {
               assert.propertyVal(payload, "alfResponseScope", "THIRD_SCOPE_", "Wrong response scope");
            });
      },

      "Dialog with no responseScope uses global scope as alfResponseScope": function() {
         return browser.waitForDeletedByClassName("dialogDisplayed")
            .findById("B7_label")
            .click()
         .end()
         .findAllByCssSelector("#B7_DIALOG.dialogDisplayed")
         .end()
         .findById("B7_DIALOG_OK_label")
            .click()
         .end()
         .getLastPublish("B7_DIALOG")
            .then(function(payload) {
               assert.propertyVal(payload, "alfResponseScope", "", "Wrong response scope");
            });
      },

      "Dialog with responseScope used as alfResponseScope": function() {
         return browser.waitForDeletedByClassName("dialogDisplayed")
            .findById("B8_label")
            .click()
         .end()
         .findAllByCssSelector("#B8_DIALOG.dialogDisplayed")
         .end()
         .findById("B8_DIALOG_OK_label")
            .click()
         .end()
         .getLastPublish("B8_DIALOG")
            .then(function(payload) {
               assert.propertyVal(payload, "alfResponseScope", "FOURTH_SCOPE_", "Wrong response scope");
            });
      },

      "Dialog with responseScope in used as alfResponseScope": function() {
         return browser.waitForDeletedByClassName("dialogDisplayed")
            .findById("B9_label")
            .click()
         .end()
         .findAllByCssSelector("#B9_DIALOG.dialogDisplayed")
         .end()
         .findById("B9_DIALOG_OK_label")
            .click()
         .end()
         .getLastPublish("B9_DIALOG")
            .then(function(payload) {
               assert.propertyVal(payload, "alfResponseScope", "FIFTH_SCOPE_", "Wrong response scope");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});