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
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

   registerSuite({
      name: 'Breadcrumb Trail Tests',
      'Basic Test': function () {

         var browser = this.remote;
         var testname = "Breadcrumb Trail Test";
         return TestCommon.loadTestWebScript(this.remote, "/BreadcrumbTrail", testname)

         // Test 1...
         // Check the path is initially displayed...
         .findAllByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb")
            .then(function(elements) {
               TestCommon.log(testname, "Counting breadcrumbs...");
               assert(elements.length === 4, "Test #1a - An unexpected number of breadcrumbs were found: " + elements.length);
            })
            .end()
         .findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb:nth-child(2) > .breadcrumb")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Checking root breadcrumb text...");
               assert(text === "HOME", "Test #1b - Incorrect root text found: " + text);
            })
            .end()
         .findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb:nth-child(4) > .breadcrumb")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Checking 2nd breadcrumb text...");
               assert(text === "some", "Test #1c - Incorrect breadcrumb text found: " + text);
            })
            .end()
         .findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb:nth-child(6) > .breadcrumb")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Checking 3rd breadcrumb text...");
               assert(text === "imaginary", "Test #1d - Incorrect breadcrumb text found: " + text);
            })
            .end()
         .findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb:nth-child(8) > .breadcrumb")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Checking 4th breadcrumb text...");
               assert(text === "path", "Test #1e - Incorrect breadcrumb text found: " + text);
            })
            .end()

         // Test 2...
         // Show and hide the breadcrumb trail...
         .findByCssSelector("#HIDE_PATH_label")
            .click()
            .end()
         .findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumbTrail")
            .isDisplayed()
            .then(function(result) {
               TestCommon.log(testname, "Check that the breadcrumb is hidden...");
               assert(result === false, "Test #2a - The breadcrumb trail wasn't hidden");
            })
            .end()
         .findByCssSelector("#SHOW_PATH_label")
            .click()
            .end()
         .findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumbTrail")
            .isDisplayed()
            .then(function(result) {
               TestCommon.log(testname, "Check that the breadcrumb is displayed...");
               assert(result === true, "Test #2b - The breadcrumb trail wasn't displayed");
            })
            .end()

         // Test 3...
         // Switch to a simulated filter view...
         .findByCssSelector("#FILTER_SELECTION_label")
            .click()
            .end()
         .findAllByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb")
            .then(function(elements) {
               TestCommon.log(testname, "Check that filter mode is displayed...");
               assert(elements.length === 0, "Test #3a - Setting filter didn't remove breadcrumbs");
            })
            .end()
         .findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumbTrail > div")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Check that filter is displayed correctly...");
               assert(text === "Simulated Filter", "Test #3b - Filter wasn't displayed correctly");
            })
            .end()

         // Test 4...
         // Change to a new path...
         .findByCssSelector("#SET_HASH_label")
            .click()
            .end()
         .findAllByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb")
            .then(function(elements) {
               TestCommon.log(testname, "Count breadcrumbs after changing path via hash...");
               assert(elements.length === 3, "Test #4a - An unexpected number of breadcrumbs were found: " + elements.length);
            })
            .end()
         .findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb:nth-child(3) > .breadcrumb")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Check breadcrumb root label...");
               assert(text === "different", "Test #4b - Incorrect root text found: " + text);
            })
            .end()
         .findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb:nth-child(5) > .breadcrumb")
            .getVisibleText()
            .then(function(text) {
               TestCommon.log(testname, "Check breadcrumb label...");
               assert(text === "path", "Test #4c - Incorrect breadcrumb text found: " + text);
            })
            .end()

         // Test 5...
         // Check links...
         .findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb:nth-child(5) > .breadcrumb")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("ALF_NAVIGATE_TO_PAGE", "publish", "last"))
            .then(function(elements) {
               TestCommon.log(testname, "Check breadcrumb navigation request publishes...");
               assert(elements.length == 1, "Test #5a - Navigation publication not found");
            })
            .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "path=/different/path"))
            .then(function(elements) {
               TestCommon.log(testname, "Check breadcrumb navigation payload...");
               assert(elements.length == 1, "Test #5b - Navigation payload not correct");
            })
            .end()

         .findByCssSelector("#CHANGE_NODEREF_label")
            .click()
            .end()
         .findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb:nth-child(5) > .breadcrumb")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "folder-details?nodeRef=some://fake/nodeRef"))
            .then(function(elements) {
               TestCommon.log(testname, "Check leaf breadcrumb navigation payload...");
               assert(elements.length == 1, "Test #5c - Navigation payload not correct");
            })
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});