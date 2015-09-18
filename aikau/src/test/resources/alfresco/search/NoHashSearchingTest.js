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

registerSuite(function(){
   var browser;

   return {
      name: "No URL Hashing Search Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/NoHashSearching", "No URL Hashing Search Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check that a scope is selected": function() {
         // See AKU-475 - because no hashName attribute is set on the AlfCheckableMenuItems the configured checked 
         // status should result in a scope being set
         return browser.findById("FCTSRCH_SCOPE_SELECTION_MENU_text")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Repository", "An initial scope was not set");
            })
            .clearLog();
      },

      "Perform a search without setting a hash": function() {
         // See AKU-472 - with both the SingleComboBoxForm and AlfSearchList configured with useHash to be false
         // then setting a search term should just perform a search without updating the URL hash
         return browser.findByCssSelector(".dijitInputInner")
            .type("hame")
         .end()
         .findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         .getLastPublish("SEARCH_RESULTS_SUCCESS")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "response.totalRecords", 10, "Response not published");
            })
         .getCurrentUrl()
            .then(function(url) {
               assert.notInclude(url, "#", "A hash should not have been set");
            })
         .clearLog();
      },

      "Check search results for alternative search": function() {
         // Searching for "hame" will actually generate an alternative search for "home"
         return browser.findByCssSelector(".searched-for-term .search-term-link")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "home", "Did not perform the alternative search");
            });
      },

      "Change the scope without setting a hash": function() {
         // Switching from Repository to All Sites scope should initiate a new search search without setting the hash
         return browser.findById("FCTSRCH_SCOPE_SELECTION_MENU_text")
            .click()
         .end()
         .findById("FCTSRCH_SET_ALL_SITES_SCOPE_text")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "repo", false, "The search scope was not updated");
            })
            .clearLog();
      },

      "Use original search term without setting hash": function() {
         // The AlternativeSearchLabel should present the original search term of "hame" - clicking on this
         // should perform that search and the hash should remain unchanged
         return browser.findByCssSelector(".searched-for-term .search-term-link")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "term", "home", "The search request was not updated");
            })
         .getCurrentUrl()
            .then(function(url) {
               assert.notInclude(url, "#", "A hash should not have been set");
            })
         .clearLog();
      },
      
      "Apply a facet filter without setting hash": function() {
         // Applying a facet filter should trigger another search without the AlfSearchList updating the URL hash
         return browser.findByCssSelector(".filters li:first-child .filterLabel")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "filters", "{http://www.alfresco.org/model/content/1.0}created|NOW/DAY-7DAYS\"..\"NOW/DAY+1DAY", "The search request was not updated");
            })
         .getCurrentUrl()
            .then(function(url) {
               assert.notInclude(url, "#", "A hash should not have been set");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});