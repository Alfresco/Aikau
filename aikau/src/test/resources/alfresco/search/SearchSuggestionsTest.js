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
 * This test generates some variations on AlfSearchResult to test the various if statements in the rendering widgets involved
 * 
 * @author Richard Smith
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "Search Suggestions Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchSuggestions", "Search Suggestions Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test Initial Rendering": function () {
         var testname = "Search Suggestions - test initial rendering";
         // Check that alternative suggestion isn't displayed
         return browser.findByCssSelector(".alfresco-search-AlternativeSearchLabel")
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
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "Search Suggestions Tests (Alternative Searches)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchSuggestions", "Search Suggestions Tests (Alternative Searches)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test Alternative Search": function () {
         var testname = "Search Suggestions - test alternative search";
         // Click the button to simulate a search result that used an alternative search term
         return browser.findByCssSelector("#SIM_ALT_SEARCH_label")
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
               assert(url.indexOf("#searchTerm=test") !== -1, "Test #2c - Clicking on the alternative search term did not update the URL correctly: " + url);
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
               assert(url.indexOf("#searchTerm=tast") !== -1, "Test #2c - Clicking on the original search term did not update the URL correctly: " + url);
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "Search Suggestions Tests (Suggestions)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchSuggestions", "Search Suggestions Tests (Suggestions)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test Search Suggestions": function () {
         var testname = "Search Suggestions - check initial rendering";
         // Click the button to simulate a search result containing suggested search terms
         return browser.findByCssSelector("#SIM_SEARCH_SUGGESTIONS_label")
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
               assert(url.indexOf("#searchTerm=test") !== -1, "Test #3d - Clicking on the search suggestion did not update the URL correctly: " + url);
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "Search Suggestions Tests (Standard Search)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchSuggestions", "Search Suggestions Tests (Standard Search)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test Standard Search": function () {

         var testname = "Search Suggestions - check initial rendering";
         // Click the button to simulate a search result containing suggested search terms
         return browser.findByCssSelector("#SIM_NORMAL_SEARCH_label")
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
         .end();
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "Search Suggestions Tests (Visibility Config)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchSuggestions", "Search Suggestions Tests (Visibility Config)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test Visibity Config": function () {
         var testname = "Search Suggestions - check visibility config";
         // Show both alt search and suggestions...
         return browser.findByCssSelector("#SIM_ALT_SEARCH_label")
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
         .end();
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});