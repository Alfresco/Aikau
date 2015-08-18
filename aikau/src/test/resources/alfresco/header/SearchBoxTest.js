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

registerSuite(function(){
   var browser;

   return {
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
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "/aikau/page/site/swsdp/document-details?nodeRef=workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e");
            });
      },

      "Click the document site meta link": function() {
         return browser.findByCssSelector(".alf-livesearch-item > span > a:nth-child(1)")
            .click()
         .end()
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", Config.urls.unitTestAppBaseUrl + "/aikau/page/site/swsdp/documentlibrary", "Wrong URL");
            });
      },

      "Click the document modifier meta link": function() {
         return browser.findByCssSelector(".alf-livesearch-item > span > a:nth-child(2)")
            .click()
         .end()
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", Config.urls.unitTestAppBaseUrl + "/aikau/page/user/admin/profile", "Wrong URL");
            });
      },

      "Submit the search request": function() {
         browser.findAllByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .click()
            .pressKeys(keys.RETURN)
         .end()
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "dp/ws/faceted-search#searchTerm=pdf&scope=repo&sortField=Relevance", "Did not find expected navigation publication request (check the search scope!)");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

registerSuite(function(){
   var browser;

   return {
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
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "site/site1/dp/ws/faceted-search#searchTerm=site&scope=site1&sortField=Relevance");
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
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "", "The previous search terms weren't cleared");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

registerSuite(function(){
   var browser;

   return {
      name: "Search Box Tests (Configuration options)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchBox", "Search Box Tests", "/site/site1/tp/ws").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check alternative placeholder text": function() {
         return browser.findByCssSelector("#SB2 .alfresco-header-SearchBox-text")
            .getAttribute("placeholder")
            .then(function(placeholder) {
               assert.equal(placeholder, "Whatcha lookin' for?", "Placeholder text override not shown");
            });
      },

      "Check search results redirect can be suppressed": function() {
         return browser.findByCssSelector("#SB2 input.alfresco-header-SearchBox-text")
            .clearLog()
            .type("site")
            .pressKeys(keys.RETURN)
         .end()
         .getAllPublishes("ALF_NAVIGATE_TO_PAGE")
         .then(function(payloads) {
            assert.lengthOf(payloads, 0, "The search request was not suppressed");
         });
      },

      "Check that document titles can be overridden": function() {
         return browser.findByCssSelector("#SB2 .alf-live-search-documents-title")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Stuff", "Documents title was not overridden");
            });
      },

      "Check that people titles can be overridden": function() {
         return browser.findByCssSelector("#SB2 .alf-live-search-people-title")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Even more stuff", "People title was not overridden");
            });
      },

      "Check that live search site results can be hidden": function() {
         return browser.findByCssSelector("#SB2 .alf-live-search-sites-list")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The live search sites results weren't hidden");
            });
      },

      "Check that live search document results can be hidden": function() {
         return browser.findByCssSelector("#SB2 .alfresco-header-SearchBox-clear div")
               .click()
            .end()
            .findByCssSelector("#SB3 input.alfresco-header-SearchBox-text")
               .type("site")
            .end()
            .sleep(500)
            .findByCssSelector("#SB3 .alf-live-search-documents-list")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "The live search sites results weren't hidden");
               });
      },

      "Check that sites titles can be overridden": function() {
         return browser.findByCssSelector("#SB3 .alf-live-search-sites-title")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Other stuff", "Sites title was not overridden");
            });
      },

      "Check that live search people results can be hidden": function() {
         return browser.findByCssSelector("#SB3 .alfresco-header-SearchBox-clear div")
               .click()
            .end()
            .findByCssSelector("#SB4 input.alfresco-header-SearchBox-text")
               .type("site")
            .end()
            .sleep(500)
            .findByCssSelector("#SB4 .alf-live-search-people-list")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "The live search sites results weren't hidden");
               });
      },

      "Check that hidden search terms are included": function() {
         return browser.findByCssSelector("#SB4 .alfresco-header-SearchBox-clear div")
               .click()
            .end()
            .findByCssSelector("#SB5 input.alfresco-header-SearchBox-text")
               .type("data")
               .pressKeys(keys.RETURN)
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload) {
                  assert.propertyVal(payload, "url", "dp/ws/faceted-search#searchTerm=(data)%20secret%20squirrels&scope=repo&sortField=Relevance");
               });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

registerSuite(function(){
   var browser;

   return {
      name: "Search Box Tests (Custom publication)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchBox", "Search Box Tests", "/site/site1/tp/ws").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Click on result with custom result publication": function() {
         return browser.findByCssSelector("#SB4 input.alfresco-header-SearchBox-text")
            .type("site")
         .end()
         .findAllByCssSelector(".alf-livesearch-item")
         .end()
         .findByCssSelector(".alf-livesearch-item a")
            .click()
         .end()
         .getLastPublish("CUSTOM_TOPIC")
            .then(function(payload) {
               assert.propertyVal(payload, "name", "WebSiteReview.mp4", "Custom publication not made for result click");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});
