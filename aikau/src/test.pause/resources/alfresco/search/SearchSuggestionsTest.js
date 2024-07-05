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
 * This test generates some variations on AlfSearchResult to test the various if statements in the rendering widgets involved
 *
 * @author Richard Smith
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Search Suggestions Tests (Alternative Searches)",
      testPage: "/SearchSuggestions#searchTerm=test",

      "Check alternative search label": function() {
         return this.remote.findByCssSelector(".alfresco-search-AlternativeSearchLabel")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The AlternativeSearchLabel was not initially hidden");
            });
      },

      "Check search suggestions aren't initially displayed": function() {
         return this.remote.findByCssSelector("#SEARCHED_ON")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The search suggestions list was not initially hidden");
            });
      },

      "Check that the alternative search label is revealed": function() {
         // Click the button to simulate a search result that used an alternative search term
         return this.remote.findByCssSelector("#SIM_ALT_SEARCH_label")
            .click()
            .end()

         // Check that the alternative suggestion widget is displayed
         .findByCssSelector(".alfresco-search-AlternativeSearchLabel")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The AlternativeSearchLabel was not revealed");
            });
      },

      "Check the alternative search term rendering": function() {
         return this.remote.findByCssSelector(".alfresco-search-AlternativeSearchLabel > .searched-for-term > .search-term-link")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "test", "The alternative search term was not rendered correctly");
            });
      },

      "Check the original search term rendering": function() {
         return this.remote.findByCssSelector(".alfresco-search-AlternativeSearchLabel > .original-term > .search-term-link")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "tast", "The original search term was not rendered correctly");
            });
      },

      "Check the URL has been updated correctly when clicking on the alternative search term": function() {
         return this.remote.findByCssSelector(".alfresco-search-AlternativeSearchLabel > .searched-for-term > .search-term-link")
            .click()
            .end()

         // Check the URL is updated correctly
         .getCurrentUrl()
            .then(function(url) {
               assert.include(url, "#searchTerm=test", "Clicking on the alternative search term did not update the URL correctly: " + url);
            });
      },

      "Check the URL has been updated correctly when clicking on the original search term": function() {
         return this.remote.findByCssSelector(".alfresco-search-AlternativeSearchLabel > .original-term > .search-term-link")
            .click()
            .end()

         // Check the URL is updated correctly
         .getCurrentUrl()
            .then(function(url) {
               assert.include(url, "#searchTerm=tast", "Clicking on the original search term did not update the URL correctly: " + url);
            });
      }
   });

   defineSuite(module, {
      name: "Search Suggestions Tests (Suggestions)",
      testPage: "/SearchSuggestions",

      "Check that the search suggestions is revealed": function() {
         // Click the button to simulate a search result containing suggested search terms
         return this.remote.findByCssSelector("#SIM_SEARCH_SUGGESTIONS_label")
            .click()
            .end()

         // Check that search suggestions are displayed
         .findByCssSelector("#SEARCHED_ON")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The search suggestions list was not revealed");
            });
      },

      "Check that there are 3 suggestions": function() {
         return this.remote.findAllByCssSelector("#SEARCHED_ON tr")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "The wrong number of search suggestions were shown");
            });
      },

      "Check that the suggestion is rendered correctly": function() {
         return this.remote.findByCssSelector("#SEARCHED_ON tr:first-child span.value")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "test", "The search suggestion was rendered incorrectly");
            })
            .click();
      },

      "Check the URL has been updated correctly when clicking on the search suggestion": function() {
         return this.remote.getCurrentUrl()
            .then(function(url) {
               assert.include(url, "#searchTerm=test", "Clicking on the search suggestion did not update the URL correctly: " + url);
            });
      }
   });

   defineSuite(module, {
      name: "Search Suggestions Tests (Standard Search)",
      testPage: "/SearchSuggestions",

      "Check that the alternative search label is still hidden": function() {
         // Click the button to simulate a search result containing suggested search terms
         return this.remote.findDisplayedByCssSelector("#SIM_NORMAL_SEARCH_label")
            .click()
         .end()

         // Check that neither the alternative search nor the search suggestions are displayed...
         .findByCssSelector(".alfresco-search-AlternativeSearchLabel")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The AlternativeSearchLabel did not remain hidden");
            });
      },

      "Check that the search suggestions list is still hidden": function() {
         return this.remote.findByCssSelector("#SEARCHED_ON")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The search suggestions list did not remain hidden");
            });
      }
   });

   defineSuite(module, {
      name: "Search Suggestions Tests (Visibility Config)",
      testPage: "/SearchSuggestions",

      "Check that the AlternativeSearchLabel is hidden": function() {
         // Show both alt search and suggestions...
         return this.remote.findByCssSelector("#SIM_ALT_SEARCH_label")
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
            .then(function(displayed) {
               assert.isFalse(displayed, "The AlternativeSearchLabel was not hidden");
            });
      },

      "Check that the search suggestions list is hidden": function() {
         return this.remote.findByCssSelector("#SEARCHED_ON")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The search suggestions list was not hidden");
            });
      }
   });
});