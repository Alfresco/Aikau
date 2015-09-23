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
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Breadcrumb Trail Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/BreadcrumbTrail", "Breadcrumb Trail Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Counting fixed breadcrumbs...": function () {
         // Test 1...
         // Check the path is initially displayed...
         return browser.findAllByCssSelector("#FIXED_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "An unexpected number of breadcrumbs were found");
            });
      },

      "Counting path breadcrumbs...": function () {
         // Test 1...
         // Check the path is initially displayed...
         return browser.findAllByCssSelector("#PATH_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "An unexpected number of breadcrumbs were found");
            });
      },

      "Click a path breadcrumb": function() {
         return browser.findByCssSelector("#PATH_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb:nth-child(2) > .breadcrumb")
            .click()
         .end()
         .findAllByCssSelector("#PATH_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Breadcrumb path not updated");
            });
      },

      "Counting hash breadcrumbs...": function () {
         // Test 1...
         // Check the path is initially displayed...
         return browser.findAllByCssSelector("#HASH_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "An unexpected number of breadcrumbs were found");
            });
      },

      "Checking root hash breadcrumb text...": function() {
         return browser.findByCssSelector("#HASH_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb:nth-child(1) > .breadcrumb")
            .getVisibleText()
            .then(function(text) {
               assert(text === "HOME", "Incorrect root text found: " + text);
            });
      },

      "Checking 2nd hash breadcrumb text": function() {
         return browser.findByCssSelector("#HASH_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb:nth-child(2) > .breadcrumb")
            .getVisibleText()
            .then(function(text) {
               assert(text === "some", "Incorrect breadcrumb text found: " + text);
            });
      },

      "Checking 3rd hash breadcrumb text": function() {
         return browser.findByCssSelector("#HASH_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb:nth-child(3) > .breadcrumb")
            .getVisibleText()
            .then(function(text) {
               assert(text === "imaginary", "Incorrect breadcrumb text found: " + text);
            });
      },

      "Checking 4th hash breadcrumb text": function() {
         return browser.findByCssSelector("#HASH_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb:nth-child(4) > .breadcrumb")
            .getVisibleText()
            .then(function(text) {
              assert(text === "path", "Incorrect breadcrumb text found: " + text);
            });
      },

      "Check that the breadcrumb is hidden": function() {
         return browser.findByCssSelector("#HIDE_PATH_label")
            .click()
            .end()
         .findByCssSelector("#FIXED_BREADCRUMBS.alfresco-documentlibrary-AlfBreadcrumbTrail")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "The breadcrumb trail wasn't hidden");
            });
      },

      "Check that the breadcrumb is displayed": function() {
         return browser.findByCssSelector("#SHOW_PATH_label")
            .click()
            .end()
         .findByCssSelector("#FIXED_BREADCRUMBS.alfresco-documentlibrary-AlfBreadcrumbTrail")
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "The breadcrumb trail wasn't displayed");
            });
      },

      "Check that filter mode is displayed": function() {
         return browser.findByCssSelector("#FILTER_SELECTION_label")
            .click()
            .end()
         .findAllByCssSelector("#FIXED_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb")
            .then(function(elements) {
               assert(elements.length === 1, "Setting filter didn't remove breadcrumbs");
            });
      },

      "Check that filter is displayed correctly": function() {
         return browser.findByCssSelector("#FIXED_BREADCRUMBS.alfresco-documentlibrary-AlfBreadcrumbTrail > ul > li > a")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Simulated Filter", "Filter wasn't displayed correctly");
            });
      },

      "Count breadcrumbs after changing path via hash": function() {
         return browser.findByCssSelector("#SET_HASH_label")
            .click()
         .end()
         .findAllByCssSelector("#HASH_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb")
            .then(function(elements) {
               assert(elements.length === 3, "An unexpected number of breadcrumbs were found: " + elements.length);
            });
      },

      "Check hash breadcrumb root label": function() {
         return browser.findByCssSelector("#HASH_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb:nth-child(2) > .breadcrumb")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "different", "Incorrect root text found");
            });
      },

      "Check hash breadcrumb label": function() {
         return browser.findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb:nth-child(3) > .breadcrumb")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "path", "Incorrect breadcrumb text found");
            });
      },

      "Check hash breadcrumb navigation request publishes": function() {
         return browser.findByCssSelector("#HASH_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb:nth-child(2) > .breadcrumb")
            .click()
            .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE", "Navigation publication not found")
            .then(function(payload){
               assert.propertyVal(payload, "url", "path=/different", "Navigation payload URL incorrect");
            });
      },

      "Check hash final breadcrumb navigation payload": function() {
         return browser.findByCssSelector("#CHANGE_NODEREF_label")
            .click()
            .end()

         // NOTE: It's not expected that changing the root node alone will re-render the breadcrumb trail,
         //       the path will be subsequently updated as well (the path uses the base nodeRef)...
         .findByCssSelector("#SET_HASH_label")
            .click()
            .end()

         .findByCssSelector("#HASH_BREADCRUMBS .alfresco-documentlibrary-AlfBreadcrumb:nth-child(3) > .breadcrumb")
            .click()
            .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload){
               assert.propertyVal(payload, "url", "folder-details?nodeRef=some://fake/nodeRef", "Navigation payload URL incorrect");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});