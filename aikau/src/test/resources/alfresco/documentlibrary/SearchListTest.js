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

   var browser;
   registerSuite({
      name: "SearchList Tests",
      
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchList", "SearchList Tests").end();
      },
      
      beforeEach: function() {
         browser.end();
      },
      
      "Test that initial search term is not set from hash": function () {
         // Include a facet with no data...
         return browser.findByCssSelector("#INCLUDE_FACET_0")
            .click()
         .end()
         // Include an initial facet (for code coverage)...
         .findByCssSelector("#INCLUDE_FACET_1")
            .click()
         .end()
         // The initial AlfSearchList doesn't perform an initial search when "useHash" is set to true (which
         // for this test it is).
         // Check that no request to search exists...
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.isNull(payload, "Search request made unexpectedly");
         });
      },
      
      "Test setting empty search term": function() {
         // Click the button to set a search term (but don't actually provide one)
         return browser.findByCssSelector("#SET_SEARCH_TERM_1")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.isNull(payload, "Search request made unexpectedly");
         });
      },
      
      "Test updating hash sets search term": function() {
         // Click the button to set the search term...
         return browser.findByCssSelector("#SET_SEARCH_TERM_2")
            .click()
         .end()
         // Check that updating the hash results in a search request being made...
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.equal(payload.term, "testTerm1", "Search term didn't request search");
            assert.equal(payload.facetFields, "qname1", "Facet fields not set appropriately from request");
         });
      },

      "Test that setting different search term does not issues new search request when current request is ongoing": function() {
         // Click the button to set a DIFFERENT search term (a new request SHOULD NOT be issued because a request is in progress)...
         return browser.findByCssSelector("#SET_SEARCH_TERM_3")
            .clearLog()
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.isNull(payload, "Another search request made before previous response returned");
         });
      },

      "Test that the pending search is requested": function() {
         // Send some response data, and then issue the search again, there should now be 3 search 
         // requests and the last one should be for the last search term...
         return browser.findByCssSelector("#PUBLISH_SEARCH_RESULTS")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.equal(payload.term, "testTerm2", "Search term didn't request search");
         });
      },

      "Test that setting identical search term DOES not re-issue search (to address eventual consistency)": function() {
         // Click the button to set the SAME search term (a new request shouldn't be issued)...
         // Return response from previous request...
         return browser.findByCssSelector("#PUBLISH_SEARCH_RESULTS")
            .click()
         .end()

         // Set identical search term...
         .findByCssSelector("#SET_SEARCH_TERM_3")
            .clearLog()
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.equal(payload.term, "testTerm2", "Search term didn't request search");
         });
      },

      "Test setting search with facet filters via hash": function() {
         // Click the button to set a variety of data (including facet filters)....
         // Set the same term again to check that the filters are removed...
         return browser.findByCssSelector("#PUBLISH_SEARCH_RESULTS")
            .click()
         .end()
         .findByCssSelector("#SET_MULTIPLE_SEARCH_DATA")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.equal(payload.filters, "filter1,filter2,filter3", "Facet fields were not set appropriately from hash change");
         });
      },

      "Test new search term clears previous filters": function() {
         // Ensure the next search term will be set by publishing some data (to prevent concurrent request blocking)...
         return browser.findByCssSelector("#PUBLISH_SEARCH_RESULTS")
            .click()
         .end()
         .findByCssSelector("#SET_SEARCH_TERM_2")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.equal(payload.term, "testTerm1", "New search term not issued");
            assert.equal(payload.filters, "", "Facet fields were not cleared");
         });
      },

      "Test setting null scope doesn't issue a search": function() {
         // Test scope settings...
         // Set empty scope...
         return browser.findByCssSelector("#PUBLISH_SEARCH_RESULTS")
            .click()
         .end()
         .clearLog()
         .findByCssSelector("#SET_SCOPE_0")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.isNull(payload, "Setting a null scope issued a search request");
         });
      },

      "Test that setting the same scope doesn't issue new search": function() {
         return browser.findByCssSelector("#SET_SCOPE_1")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.isNull(payload, "Setting the same scope issued a search request.");
         });
      },

      "Test that setting a new scope issues a new search": function() {
         return browser.findByCssSelector("#SET_SCOPE_2")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.equal(payload.repo, false, "Setting a new scope didn't issue a search request (and repo wasn't set to false)");
            assert.equal(payload.site, "", "Site wasn't set to empty string for ALL_SITES scope");
         });
      },

      "Test that setting specific site scope issues a new search": function() {
         return browser.findByCssSelector("#PUBLISH_SEARCH_RESULTS")
            .click()
         .end()
         .findByCssSelector("#SET_SCOPE_3")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.equal(payload.repo, false, "Repo wasn't set to false for site scope search");
            assert.equal(payload.site, "site1", "Site wasn't set requested site");
         });
      },

      "Test that setting repo scope issues a new search": function() {
         return browser.findByCssSelector("#PUBLISH_SEARCH_RESULTS")
            .click()
         .end()
         .findByCssSelector("#SET_SCOPE_1")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.equal(payload.repo, true, "Repo wasn't set to true for repo scope search");
            assert.equal(payload.site, "", "Site wasn't cleared for repo scope search");
         });
      },

      "Test setting multiple search attributes on hash (term)": function() {
         // Check that updating the hash results in a search request being made...
         return browser.findByCssSelector("#PUBLISH_SEARCH_RESULTS")
            .click()
         .end()
         .findByCssSelector("#SET_MULTIPLE_SEARCH_DATA")
            .click()
         .end()
         .getLastPublish("ALF_SEARCH_REQUEST")
         .then(function(payload) {
            assert.equal(payload.term, "testTerm2", "Search term not set appropriately from hash change");
            assert.equal(payload.facetFields, "qname1", "Facet fields not set appropriately from hash change");
         });
      },

      // "Test setting term and facet filters together (facet field 1)": function() {
      //    // Check that updating the hash results in a search request being made...
      //    return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "facetFields", "qname1"))
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 1, "Facet fields not set appropriately from hash change");
      //       });
      // },

      // "Test setting term and facet filters together (facet field 2)": function() {
      //    // Check that updating the hash results in a search request being made...
      //    return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "filters", "filter1,filter2,filter3"))
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 1, "Facet filters not set appropriately from hash change");
      //       });
      // },

      // "Test setting term and facet filters together (sort direction)": function() {
      //    return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "sortAscending", "false"))
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 1, "Sort order not set appropriately from hash change");
      //       });
      // },

      // "Test setting term and facet filters together (sort field)": function() {
      //    return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "sortField", "cm:title"))
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 1, "Sort property not set appropriately from hash change");
      //       });
      // },

      // "Test removing facet filter": function() {
      //    // Click the button to remove filter2 from the filters list...
      //    return browser.findByCssSelector("#REMOVE_FACET_FILTER")
      //       .click()
      //    .end()
      //    .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "filters", "filter1,filter3"))
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 1, "Facet filter 'filter2' was not removed");
      //       });
      // },

      // "Test setting bad facet filter doesn't issue search": function() {
      //    // Test facet includes...
      //    return browser.findAllByCssSelector(TestCommon.topicSelector("ALF_SEARCH_REQUEST", "publish", "any"))
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 10, "Unexpected number of previous searches " + elements.length);
      //       })
      //    .end()
      //    // Click the button to include an additional facet in search requests...
      //    .findByCssSelector("#INCLUDE_FACET_2")
      //       .click()
      //    .end()
      //    .findByCssSelector("#APPLY_FACET_FILTER_0")
      //       .click()
      //    .end()
      //    .findAllByCssSelector(TestCommon.topicSelector("ALF_SEARCH_REQUEST", "publish", "any"))
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 10, "Bad facet filter triggered search");
      //       });
      // },

      // "Test applying new filter over pub/sub issues a search": function() {
      //    // Click the button to add filter4 to the filters list...
      //    return browser.findByCssSelector("#APPLY_FACET_FILTER")
      //       .click()
      //    .end()
      //    .findAllByCssSelector(TestCommon.topicSelector("ALF_SEARCH_REQUEST", "publish", "any"))
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 11, "Applying a filter didn't trigger a search");
      //       });
      // },

      // "Test applying facet filter values over pub/sub updates search request": function() {
      //    return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "filters", "filter1,filter3,filter4"))
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 1, "Test #5d - facet filter 'filter4' was not applied");
      //       });
      // },

      // "Test that additinal facet field is included": function() {
      //    // Check that the additional qname was included...
      //    return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "facetFields", "qname1"))
      //       .then(function(elements) {
      //          // console.log("TODO: Failing test needs looking at");
      //          // selector used to be "qname1,qname2" and failed - can see no reason why this changed?
      //          assert.lengthOf(elements, 1, "Additional facet qnames were not included");
      //       });
      // },

      // "Test setting new search data on hash (term)": function() {
      //    // Publish data to prevent block on concurrent requests...
      //    return browser.findByCssSelector("#PUBLISH_SEARCH_RESULTS")
      //       .click()
      //    .end()
      //    .findByCssSelector("#SET_MULTIPLE_SEARCH_DATA_2")
      //       .click()
      //    .end()
      //    .findAllByCssSelector(TestCommon.topicSelector("ALF_SEARCH_REQUEST", "publish", "any"))
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 12, "Setting different multiple data didn't trigger a new search");
      //       })
      //    .end()
      //    .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "term", "testTerm3"))
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 1, "Search term not set appropriately from hash change");
      //       });
      // },

      // "Test setting new search data on hash (filters)": function() {
      //    return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "filters", "filter1,filter2,filter3"))
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 1, "Previous filters not cleared on new search term");
      //       });
      // },

      // "Test search result count publishes correctly": function() {
      //    // Click the button to generate a fake search request response...
      //    return browser.findByCssSelector("#PUBLISH_SEARCH_RESULTS")
      //       .click()
      //    .end()
      //    // Check that facet data is published... NOTE: TOPIC THROWS AN ERROR IN TESTING - MUST BE THE @
      //    // .findAllByCssSelector(TestCommon.topicSelector("ALF_FACET_RESULTS_@qname1", "publish", "any"))
      //    //    .then(function(elements) {
      //    //       TestCommon.log(testname,"Check that facet search results were published");
      //    //       assert(elements.length == 1, "Test #7 - Search result facet data not published");
      //    //    })
      //    //    .end()
      //    // Commented out whilst updating the unit test...
      //    // Check that search result count is published...
      //    .findAllByCssSelector(TestCommon.topicSelector("ALF_SEARCH_RESULTS_COUNT", "publish", "any"))
      //       .then(function(elements) {
      //          assert(elements.length > 0, "Search resultset size not published");
      //       })
      //    .end()
      //    // Test that Number of search results is as expected.
      //    .findAllByCssSelector(".alfresco-search-AlfSearchResult")
      //       .then(function(elements) {
      //          assert.lengthOf(elements, 3, "Number of results expected is 3, actual results displayed is: " + elements.length);
      //       });
      // },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});