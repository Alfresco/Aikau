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
        "alfresco/TestCommon",
        "config/Config",
        "intern/dojo/node!leadfoot/keys"],
        function(registerSuite, assert, require, TestCommon, Config, keys) {

   var browser;

   registerSuite({
      name: "Search Box Tests (Repo Context)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchBox", "Search Box Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Find the search box input field": function() {
         return browser.findAllByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Unexpect number of input fields found");
            });
      },

      "Check that live search pane isn't displayed initially": function() {
         return browser.findByCssSelector(".alf-livesearch")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The live search pane was unexpectedly displayed on page load");
            });
      },

      "Check that live search pane is displayed on text entry": function() {
         return browser.findByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .type("pdf")
         .end()
         .findAllByCssSelector(".alf-livesearch-item")
         .end()
         .findByCssSelector(".alf-livesearch")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The live search pane was not shown after typing search term");
            });
      },

      "Count the documents": function() {
         return browser.findAllByCssSelector(".alf-live-search-documents-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Unexpected number of documents found");
            });
      },

      "Count the sites": function() {
         return browser.findAllByCssSelector(".alf-live-search-sites-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "There shouldn't have been any sites displayed");
            });
      },

      "Count the people": function() {
         return browser.findAllByCssSelector(".alf-live-search-people-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "There shouldn't have been any people displayed");
            });
      },

      "Click the document link": function() {
         return browser.findByCssSelector(".alf-livesearch-item a")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_NAVIGATE_TO_PAGE", "url", "/aikau/page/site/swsdp/document-details?nodeRef=workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Did not find expected navigation publication request");
            });
      },

      "Click the document site meta link": function() {
         return browser.findByCssSelector(".alf-livesearch-item > span > a:nth-child(1)")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "url"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, Config.urls.unitTestAppBaseUrl + "/aikau/page/site/swsdp/documentlibrary", "Wrong URL");
            });
      },

      "Click the document modifier meta link": function() {
         return browser.findByCssSelector(".alf-livesearch-item > span > a:nth-child(2)")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "url"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, Config.urls.unitTestAppBaseUrl + "/aikau/page/user/admin/profile", "Wrong URL");
            });
      },

      "Submit the search request": function() {
         browser.findAllByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .click()
            .pressKeys(keys.RETURN)
         .end()
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_NAVIGATE_TO_PAGE", "url", "dp/ws/faceted-search#searchTerm=pdf&scope=repo&sortField=Relevance"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Did not find expected navigation publication request (check the search scope!)");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "Search Box Tests (Site Context)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchBox", "Search Box Tests", "/site/site1/tp/ws").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Count the documents": function() {
         return browser.findByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .type("site")
         .end()
         .findAllByCssSelector(".alf-live-search-documents-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 5, "Unexpected number of documents found");
            });
      },

      "Count the sites": function() {
         return browser.findAllByCssSelector(".alf-live-search-sites-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Unexpected number of sites found");
            });
      },

      "Count the people": function() {
         return browser.findAllByCssSelector(".alf-live-search-people-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Unexpected number of people found");
            });
      },

      "Click the more results link": function() {
         return browser.findByCssSelector(".alf-livesearch-more span")
            .click()
         .end()
         .sleep(500) // Need a pause to wait for the data reload
         .findAllByCssSelector(".alf-live-search-documents-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 10, "Additional results weren't loaded");
            });
      },

      "Submit the search request": function() {
         browser.findAllByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .click()
            .pressKeys(keys.RETURN)
         .end()
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_NAVIGATE_TO_PAGE", "url", "site/site1/dp/ws/faceted-search#searchTerm=site&scope=site1&sortField=Relevance"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Did not find expected navigation publication request (check the search scope contains site!)");
            });
      },

      "Enter and clear search terms": function() {
         return browser.findByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .type("site")
         .end()
         .findByCssSelector(".alfresco-header-SearchBox-clear div")
            .click()
         .end()
         .findByCssSelector(".alf-livesearch")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The live search pane was not hidden on clearing search terms");
            });
      },

      "Check that search field is cleared": function() {
         return browser.findByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .getValue()
            .then(function(value) {
               assert.equal(value, "", "The previous search terms weren't cleared");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});
