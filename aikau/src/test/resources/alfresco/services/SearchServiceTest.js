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
 * This test uses a MockXhr service to test the search service responds as required.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Search Service Test",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchService", "Search Service Test").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // Because there is no searchTerm the SearchService publishes a failure. Hence the failure message displayed.
     "Check there are no results yet": function () {
         return browser.findById("FCTSRCH_SEARCH_RESULTS_LIST")
            .getVisibleText()
            .then(function (text){
               assert.equal(text, "We hit a problem getting your search results. Try searching again", "There should not be any results found yet");
            })
         .end()
         .clearLog();
      },

      "Check there are the expected number of mocked results": function() {
         return browser.findByCssSelector("#FCTSRCH_SEARCH_FORM div.alfresco-forms-controls-TextBox div.control input[name='searchTerm']")
            .type("test")
         .end()

         .findByCssSelector("#FCTSRCH_SEARCH_FORM div.buttons span.dijitButtonNode")
            .click()
         .end()

         .findAllByCssSelector("#FCTSRCH_SEARCH_RESULTS_LIST tr.alfresco-search-AlfSearchResult")
            .then(function (results){
               assert.lengthOf(results, 24, "There should be 24 mocked results");
            });
      },

      "Check there are still the expected number of mocked results": function() {
         return browser.execute("location.hash='#searchTerm=test&allSites=true&repo=false&sortField=cm%3Aname&facetFilters=%7Bhttp%3A%2F%2Fwww.alfresco.org%2Fmodel%2Fcontent%2F1.0%7Dcreator.__.u%7Cadmin&sortAscending=false'")
         .end()

         .findAllByCssSelector("#FCTSRCH_SEARCH_RESULTS_LIST tr.alfresco-search-AlfSearchResult")
            .then(function (results){
               assert.lengthOf(results, 24, "There should still be 24 mocked results");
            });
      },

      "Check there are no unexpected queries": function() {
         return browser.findByCssSelector("td.mx-url")
            .getVisibleText()
            .then(function(text) {
               assert(decodeURIComponent(text).indexOf("&query={") === -1, "unexpected query found");
            });
      },

      "Repository scope should be used by default": function() {
         return browser.findByCssSelector("body").end().getLastPublish("ALF_SEARCH_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "repo", true, "Repository scope not requested");
            })
         .end()
         .findByCssSelector("tr.mx-row:nth-child(1) td.mx-url")
            .getVisibleText()
            .then(function(url) {
               assert.include(url, "repo=true", "Repository scope not used in XHR");
            })
         .end()
         .clearLog();
      },

      "Switch to All Sites scope": function() {
         return browser.findById("FCTSRCH_SCOPE_SELECTION_MENU_text")
            .click()
         .end()
         .findById("FCTSRCH_SET_ALL_SITES_SCOPE_text")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.propertyVal(payload, "repo", false, "Repository scope used");
            assert.propertyVal(payload, "site", "", "Site incorrect");
         })
         .findByCssSelector("tr.mx-row:nth-child(3) td.mx-url")
            .getVisibleText()
            .then(function(url) {
               assert.include(url, "repo=false", "Repository scope not used in XHR");
            })
         .end()
         .clearLog();
      },

      "Switch to Site scope": function() {
         return browser.findById("FCTSRCH_SCOPE_SELECTION_MENU_text")
            .click()
         .end()
         .findById("FCTSRCH_SET_SPECIFIC_SITE_SCOPE_text")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.propertyVal(payload, "repo", false, "Repository scope used");
            assert.propertyVal(payload, "site", "site", "Site incorrect");
         })
         .findByCssSelector("tr.mx-row:nth-child(4) td.mx-url")
            .getVisibleText()
            .then(function(url) {
               assert.include(url, "repo=false", "Repository scope not used in XHR");
               assert.include(url, "site=site", "Repository scope not used in XHR");
            })
         .end()
         .clearLog();
      },

      "Switch to Repository scope": function() {
         return browser.findById("FCTSRCH_SCOPE_SELECTION_MENU_text")
            .click()
         .end()
         .findById("FCTSRCH_SET_REPO_SCOPE_text")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.propertyVal(payload, "repo", true, "Repository scope NOT used");
         })
         .findByCssSelector("tr.mx-row:nth-child(5) td.mx-url")
            .getVisibleText()
            .then(function(url) {
               assert.include(url, "repo=true", "Repository scope not used in XHR");
            })
         .end()
         .clearLog();
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});