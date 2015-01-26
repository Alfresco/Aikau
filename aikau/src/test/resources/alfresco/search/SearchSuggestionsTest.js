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
 * This test generates some variations on AlfSearchResult to test the various if statements in the rendering widgets involved
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   registerSuite({
      name: 'Search Suggestions Test',
      'Test Initial Rendering': function () {

         var browser = this.remote;
         var testname = "Search Suggestions - test initial rendering";
         return TestCommon.loadTestWebScript(this.remote, "/SearchSuggestions", testname)

            // Check that alternative suggestion isn't displayed
            .findByCssSelector(".alfresco-search-AlternativeSearchLabel")
               .then(
                  function() {
                     TestCommon.log(testname, "Found the AlternativeSearchLabel widget...");
                  },
                  function() {
                     assert(false, "Test #1a - Couldn't find the AlternativeSearchLabel widget");
                  }
               )
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Check that the AlternativeSearchLabel is initially hidden...");
                  assert(result === false, "Test #1b - The AlternativeSearchLabel was not initially hidden");
               })
            .end()

            // Check that search suggestions aren't displayed
            .findByCssSelector("#SEARCHED_ON")
               .then(
                  function() {
                     TestCommon.log(testname, "Found the search suggestions list...");
                  },
                  function() {
                     assert(false, "Test #1c - Couldn't find the search suggestions list widget");
                  }
               )
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Check that the search suggestions list is initially hidden...");
                  assert(result === false, "Test #1d - The search suggestions list was not initially hidden");
               })
            .end()

         .alfPostCoverageResults(browser);
      },
      'Test Alternative Search': function () {

         var browser = this.remote;
         var testname = "Search Suggestions - test alternative search";
         return TestCommon.loadTestWebScript(this.remote, "/SearchSuggestions", testname)

            // Click the button to simulate a search result that used an alternative search term
            .findByCssSelector("#SIM_ALT_SEARCH_label")
               .click()
            .end()

            // Check that the alternative suggestion widget is displayed
            .findByCssSelector(".alfresco-search-AlternativeSearchLabel")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Check that the AlternativeSearchLabel has been revealed...");
                  assert(result === true, "Test #2a - The AlternativeSearchLabel was not revealed");
               })
            .end()

            // Check that the searchedFor and searchRequest terms are rendered correctly
            .findByCssSelector(".alfresco-search-AlternativeSearchLabel > .searched-for-term > .search-term-link")
               .getVisibleText()
               .then(function(text) {
                  TestCommon.log(testname, "Check the alternative search term rendering...");
                  assert(text === "test", "Test #2b - The alternative search term was not rendered correctly: " + text);
               })
            .end()
            .findByCssSelector(".alfresco-search-AlternativeSearchLabel > .original-term > .search-term-link")
               .getVisibleText()
               .then(function(text) {
                  TestCommon.log(testname, "Check the original search term rendering...");
                  assert(text === "tast", "Test #2b - The original search term was not rendered correctly: " + text);
               })
            .end()

            // Click the alternative search term
            .findByCssSelector(".alfresco-search-AlternativeSearchLabel > .searched-for-term > .search-term-link")
               .click()
            .end()

            // Check the URL is updated correctly
            .getCurrentUrl()
               .then(function(url) {
                  TestCommon.log(testname, "Check the URL has been updated correctly when clicking on the alternative search term...");
                  assert(url.indexOf("#searchTerm=test") != -1, "Test #2c - Clicking on the alternative search term did not update the URL correctly: " + url);
               })
            .end()

            // Click the original search term
            .findByCssSelector(".alfresco-search-AlternativeSearchLabel > .original-term > .search-term-link")
               .click()
            .end()

            // Check the URL is updated correctly
            .getCurrentUrl()
               .then(function(url) {
                  TestCommon.log(testname, "Check the URL has been updated correctly when clicking on the original search term...");
                  assert(url.indexOf("#searchTerm=tast") != -1, "Test #2c - Clicking on the original search term did not update the URL correctly: " + url);
               })
            .end()

         .alfPostCoverageResults(browser);
      },
      'Test Search Suggestions': function () {

         var browser = this.remote;
         var testname = "Search Suggestions - check initial rendering";
         return TestCommon.loadTestWebScript(this.remote, "/SearchSuggestions", testname)

            // Click the button to simulate a search result containing suggested search terms
            .findByCssSelector("#SIM_SEARCH_SUGGESTIONS_label")
               .click()
            .end()

            // Check that search suggestions are displayed
            .findByCssSelector("#SEARCHED_ON")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Check that the search suggestions is revealed...");
                  assert(result === true, "Test #3a - The search suggestions list was not revealed");
               })
            .end()

            // Count the suggestions
            .findAllByCssSelector("#SEARCHED_ON tr")
               .then(function(elements) {
                  TestCommon.log(testname, "Check that there are 3 suggestions...");
                  assert(elements.length === 3, "Test #3b - The wrong number of search suggestions were shown: " + elements.length);
               })
            .end()

            // Click on the first suggestion
            .findByCssSelector("#SEARCHED_ON tr:first-child span.value")
               .getVisibleText()
               .then(function(text) {
                  TestCommon.log(testname, "Check that the suggestion is rendered correctly...");
                  assert(text === "test", "Test #3c - The search suggestion was rendered incorrectly: " + text);
               })
               .click()
            .end()

            // Check the URL is updated correctly
            .getCurrentUrl()
               .then(function(url) {
                  TestCommon.log(testname, "Check the URL has been updated correctly when clicking on the search suggestion...");
                  assert(url.indexOf("#searchTerm=test") != -1, "Test #3d - Clicking on the search suggestion did not update the URL correctly: " + url);
               })
            .end()

         .alfPostCoverageResults(browser);
      },
      'Test Standard Search': function () {

         var browser = this.remote;
         var testname = "Search Suggestions - check initial rendering";
         return TestCommon.loadTestWebScript(this.remote, "/SearchSuggestions", testname)

            // Click the button to simulate a search result containing suggested search terms
            .findByCssSelector("#SIM_NORMAL_SEARCH_label")
               .click()
            .end()

            // Check that neither the alternative search nor the search suggestions are displayed...
            .findByCssSelector(".alfresco-search-AlternativeSearchLabel")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Check that the AlternativeSearchLabel is still hidden...");
                  assert(result === false, "Test #4a - The AlternativeSearchLabel did not remain hidden");
               })
            .end()
            .findByCssSelector("#SEARCHED_ON")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Check that the search suggestions list is still hidden...");
                  assert(result === false, "Test #4b - The search suggestions list did not remain hidden");
               })
            .end()
            
         .alfPostCoverageResults(browser);
      },
      'Test Visibity Config': function () {

         var browser = this.remote;
         var testname = "Search Suggestions - check visibility config";
         return TestCommon.loadTestWebScript(this.remote, "/SearchSuggestions", testname)

            // Show both alt search and suggestions...
            .findByCssSelector("#SIM_ALT_SEARCH_label")
               .click()
            .end()
            .findByCssSelector("#SIM_SEARCH_SUGGESTIONS_label")
               .click()
            .end()

            // Simulate another search request (this should hide them both)...
            .findByCssSelector("#SIM_SEARCH_REQUEST_label")
               .click()
            .end()

            // Check that neither the alternative search nor the search suggestions are displayed...
            .findByCssSelector(".alfresco-search-AlternativeSearchLabel")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Check that the AlternativeSearchLabel is hidden...");
                  assert(result === false, "Test #5a - The AlternativeSearchLabel was not hidden");
               })
            .end()
            .findByCssSelector("#SEARCHED_ON")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Check that the search suggestions list is hidden...");
                  assert(result === false, "Test #5b - The search suggestions list was not hidden");
               })
            .end()
            
         .alfPostCoverageResults(browser);
      }
   });
});