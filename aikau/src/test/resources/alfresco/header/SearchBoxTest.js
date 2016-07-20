/*jshint browser:true*/
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
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "config/Config",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, require, TestCommon, Config, keys) {

   defineSuite(module, {
      name: "Search Box Tests (Repo Context)",
      testPage: "/SearchBox",

      "Find the search box input field": function() {
         return this.remote.findAllByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Unexpect number of input fields found");
            });
      },

      "Check that live search pane isn't displayed initially": function() {
         return this.remote.findByCssSelector(".alf-livesearch")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The live search pane was unexpectedly displayed on page load");
            });
      },

      "Check that live search pane is displayed on text entry": function() {
         return this.remote.findByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
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
      
      "Check the Repository and Site toggle is not present": function() {
         return this.remote.findByCssSelector("#SB1 .alf-livesearch-context")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "There should be no repository site toggle displayed");
            });
      },

      "Count the documents": function() {
         return this.remote.findAllByCssSelector(".alf-live-search-documents-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Unexpected number of documents found");
            });
      },

      "Count the sites": function() {
         return this.remote.findAllByCssSelector(".alf-live-search-sites-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "There shouldn't have been any sites displayed");
            });
      },

      "Count the people": function() {
         return this.remote.findAllByCssSelector(".alf-live-search-people-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "There shouldn't have been any people displayed");
            });
      },

      "Text isn't erroneously escaped": function() {
         return this.remote.findByCssSelector("#SB1 .alf-live-search-documents-list > div:nth-child(2)")
            .findByCssSelector(".alf-livesearch-thumbnail a")
            .getAttribute("title")
            .then(function(attr) {
               assert.equal(attr, "Terms & Conditions.pdf", "Preview link title attribute not set correctly");
            })
         .end()

         .findByCssSelector(".alf-livesearch-thumbnail a img")
            .getAttribute("alt")
            .then(function(attr) {
               assert.equal(attr, "Terms & Conditions.pdf", "Preview image alt attribute not set correctly");
            })
         .end()

         .findByCssSelector(".alf-livesearch-item a")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Terms & Conditions.pdf", "Link content not set correctly");
            })
            .end(); // Necessary to break out of inner context - suite will break out of outer automatically
      },

      "Code cannot be injected maliciously": function() {
         return this.remote.execute(function() {
               return ["Name", "Title", "Description"].filter(function(hackedProp) {
                  return !!window[hackedProp];
               });
            })
            .then(function(hackedItems) {
               assert.lengthOf(hackedItems, 0);
            });
      },

      "Click the document link": function() {
         return this.remote.findByCssSelector(".alf-livesearch-item a")
            .click()
         .end()
         
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "/aikau/page/site/swsdp/document-details?nodeRef=workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e");
            });
      },

      "Click the document site meta link": function() {
         return this.remote.findByCssSelector(".alf-livesearch-item > span > a:nth-child(1)")
            .click()
         .end()
         
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.include(payload.url, "/aikau/page/site/swsdp/documentlibrary", "Wrong URL");
            });
      },

      "Click the document modifier meta link": function() {
         return this.remote.findByCssSelector(".alf-livesearch-item > span > a:nth-child(2)")
            .click()
         .end()
      
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.include(payload.url, "/aikau/page/user/admin/profile", "Wrong URL");
            });
      },

      "Submit the search request": function() {
         return this.remote.findAllByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .click()
            .pressKeys(keys.RETURN)
         .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "dp/ws/faceted-search#searchTerm=pdf&scope=repo", "Did not find expected navigation publication request (check the search scope!)");
            });
      },

      "Results height is restricted": function() {
         return this.remote.findByCssSelector("#SB7 input.alfresco-header-SearchBox-text")
            .type("pdf")
         .end()

         .findDisplayedByCssSelector("#SB7 .alf-livesearch")
            .getSize()
            .then(function(size) {
               assert.closeTo(size.height, 100, 5);
            });
      }
      
   });

   defineSuite(module, {
      name: "Search Box Tests (Site Context)",

      setup: function() {
         return TestCommon.loadTestWebScript(this.remote, "/SearchBox", "Search Box Tests", "/site/site1/tp/ws");
      },

      "Count the documents": function() {
         return this.remote.findByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .type("site")
         .end()
         
         .findAllByCssSelector(".alf-live-search-documents-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 5, "Unexpected number of documents found");
            });
      },

      "Check overflow": function() {
         return this.remote.findByCssSelector("#SB1 .alf-live-search-documents-list > div:nth-child(2) .alf-livesearch-item > a")
            .getSize()
            .then(function(size) {
               assert.isBelow(size.width, 450);
            });
      },

      "Count the sites": function() {
         return this.remote.findAllByCssSelector(".alf-live-search-sites-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Unexpected number of sites found");
            });
      },

      "Count the people": function() {
         return this.remote.findAllByCssSelector(".alf-live-search-people-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Unexpected number of people found");
            });
      },

      "Click the more results link": function() {
         return this.remote.findByCssSelector(".alf-livesearch-more span")
            .click()
         .end()
         
         .sleep(500) // Need a pause to wait for the data reload
      
         .findAllByCssSelector(".alf-live-search-documents-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 10, "Additional results weren't loaded");
            });
      },
      
      "Check the Repository and Site toggle is present": function() {
         return this.remote.findByCssSelector("#SB1 .alf-livesearch-context")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "There should be a repository site toggle displayed");
            });
      },

      "Submit the search request": function() {
         return this.remote.findByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .click()
            .pressKeys(keys.RETURN)
         .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "site/site1/dp/ws/faceted-search#searchTerm=site&scope=repo");
            });
      },

      "Enter and clear search terms": function() {
         return this.remote.findByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
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
         return this.remote.findByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "", "The previous search terms weren't cleared");
            });
      },
      
      "Check the Site toggle functions": function() {
         return this.remote.findByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .type("site")
         .end()
         
         .sleep(500) // Need a pause to wait for the data reload
         
         .findAllByCssSelector("#SB1 .alf-live-search-documents-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 5, "Expected list of documents was not present.");
            })
         .end()
         
         .findByCssSelector("#SB1 .alf-livesearch-context .alf-livesearch-context__repo.alf-livesearch-context--active")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Repository search context should be active by default.");
            })
         .end()
         
         .findByCssSelector("#SB1 .alf-livesearch-context .alf-livesearch-context__site")
            .click()
         .end()
         
         .sleep(500) // Need a pause to wait for the data reload
         
         .findAllByCssSelector("#SB1 .alf-live-search-documents-list .alf-livesearch-item")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Empty list of documents was not present.");
            })
         
         .findByCssSelector("#SB1 .alf-livesearch-context .alf-livesearch-context__site.alf-livesearch-context--active")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Site search context should be active.");
            })
         .end()
         
         // ensure the site/repository options are still displayed  - even if no results returned for site local search
         .findByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .type("pdf")
         .end()
         
         .sleep(500) // Need a pause to wait for the data reload
         
         .findByCssSelector("#SB1 .alf-livesearch-context")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Site context options should be visible.");
            })
         .end();
      },
      
      "Check the Site toggle display label": function() {
         return this.remote.findByCssSelector("#SB1 input.alfresco-header-SearchBox-text")
            .type("site")
         .end()
         
         .sleep(500) // Need a pause to wait for the data reload
         
         .findByCssSelector("#SB1 .alf-livesearch-context .alf-livesearch-context__site")
            .findAllByTagName("a")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Search 'SiteLabel'", "Site display label was not displayed");
               })
            .end()
         .end();
      }
   });

   defineSuite(module, {
      name: "Search Box Tests (Configuration options)",

      setup: function() {
         return TestCommon.loadTestWebScript(this.remote, "/SearchBox", "Search Box Tests", "/site/site1/tp/ws");
      },

      "Check alternative placeholder text": function() {
         return this.remote.findByCssSelector("#SB2 .alfresco-header-SearchBox-text")
            .getAttribute("placeholder")
            .then(function(placeholder) {
               assert.equal(placeholder, "Whatcha lookin' for?", "Placeholder text override not shown");
            });
      },

      "Check search results redirect can be suppressed": function() {
         return this.remote.findByCssSelector("#SB2 input.alfresco-header-SearchBox-text")
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
         return this.remote.findByCssSelector("#SB2 .alf-live-search-documents-title")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Stuff", "Documents title was not overridden");
            });
      },

      "Check that people titles can be overridden": function() {
         return this.remote.findByCssSelector("#SB2 .alf-live-search-people-title")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Even more stuff", "People title was not overridden");
            });
      },

      "Check that live search site results can be hidden": function() {
         return this.remote.findByCssSelector("#SB2 .alf-live-search-sites-list")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The live search sites results weren't hidden");
            });
      },

      "Check that live search document results can be hidden": function() {
         return this.remote.findByCssSelector("#SB2 .alfresco-header-SearchBox-clear div")
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
         return this.remote.findByCssSelector("#SB3 .alf-live-search-sites-title")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Other stuff", "Sites title was not overridden");
            });
      },

      "Check that live search people results can be hidden": function() {
         return this.remote.findByCssSelector("#SB3 .alfresco-header-SearchBox-clear div")
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
         return this.remote.findByCssSelector("#SB4 .alfresco-header-SearchBox-clear div")
            .click()
         .end()
         
         .findByCssSelector("#SB5 input.alfresco-header-SearchBox-text")
            .type("data%test")
            .pressKeys(keys.RETURN)
         .end()
      
         .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "dp/ws/faceted-search#searchTerm=(data%25test)%20secret%20squirrels&scope=repo");
            });
      }
   });

   defineSuite(module, {
      name: "Search Box Tests (Custom publication)",

      setup: function() {
         return TestCommon.loadTestWebScript(this.remote, "/SearchBox", "Search Box Tests", "/site/site1/tp/ws");
      },

      "Click on result with custom result publication": function() {
         return this.remote.findByCssSelector("#SB4 input.alfresco-header-SearchBox-text")
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
      }
   });
});