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
      name: "Warning Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Warning", "Warning Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check warning": function () {
         return browser.findByCssSelector("#WARNINGS1 .alfresco-header-Warning__info > span:last-child")
            .getVisibleText()
            .then(function (result1) {
               assert.equal(result1, "WARNING", "Warning not displayed");
            });
      },

      "Check error": function() {
         return browser.findByCssSelector("#WARNINGS2 .alfresco-header-Warning__info > span:last-child")
            .getVisibleText()
            .then(function (result1) {
               assert.equal(result1, "ERROR", "Error not displayed");
            });
      },

      "Check readonly message": function() {
         return browser.findByCssSelector("#LICENSEWARNING_READONLY .alfresco-header-Warning__info > span:last-child")
            .getVisibleText()
            .then(function (result1) {
               assert.equal(result1, "Alfresco is running in READ ONLY mode. Please consult your System Administrator to resolve this.", "Test 1c - Readonly error not displayed");
            });
      },

      "Test that admins see low severity warnings": function() {
         return browser.findAllByCssSelector("#LICENSEWARNING_DISPLAY_TO_ADMIN .alfresco-header-Warning__info")
            .then(function (adminWarnings) {
               assert.lengthOf(adminWarnings, 3, "Admins should see low severity warnings");
            });
      },

      "Test that non-admin users don't see low severity warnings": function() {
         return browser.findAllByCssSelector("#LICENSEWARNING_HIDE_FROM_USER .alfresco-header-Warning__info")
            .then(function (nonAdminWarnings) {
               assert.lengthOf(nonAdminWarnings, 0, "Low severity warnings should be hidden from non-admins");
            });
      },

      "Test that non-admin users see high severity warnings": function() {
         return browser.findAllByCssSelector("#LICENSEWARNING_DISPLAY_TO_USER .alfresco-header-Warning__info")
            .then(function (nonAdminWarnings) {
                assert.lengthOf(nonAdminWarnings, 3, "High severity warnings should be displayed to non-admins");
            });
      },

      "Hide warning": function() {
         return browser.findById("HIDE_WARNING_label")
            .click()
         .end()
         .findById("WARNINGS1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The warning should have been hidden");
            });
      },

      "Show warning": function() {
         return browser.findById("SHOW_WARNING_label")
            .click()
         .end()
         .findById("WARNINGS1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The warning should have been revealed");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});