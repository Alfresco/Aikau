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
            // NOTE: Load with a scope set because one will be set regardless...
            return TestCommon.loadTestWebScript(this.remote, "/SearchService#searchTerm=&scope=repo", "Search Service Test").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Check there are the expected number of mocked results": function() {
            // See AKU-619 - it should not be necessary to provide a search term in order for searching to occur...
            return browser.findAllByCssSelector("#FCTSRCH_SEARCH_RESULTS_LIST tr.alfresco-search-AlfSearchResult")
               .then(function (results){
                  assert.lengthOf(results, 24, "There should be 24 mocked results");
               });
         },

         "Check there are still the expected number of mocked results": function() {
            return browser.execute("location.hash='#searchTerm=test&allSites=false&repo=true&sortField=cm%3Aname&facetFilters=%7Bhttp%3A%2F%2Fwww.alfresco.org%2Fmodel%2Fcontent%2F1.0%7Dcreator.__.u%7Cadmin&sortAscending=false'")
            .end()

            .findAllByCssSelector("#FCTSRCH_SEARCH_RESULTS_LIST tr.alfresco-search-AlfSearchResult")
               .then(function (results){
                  assert.lengthOf(results, 24, "There should still be 24 mocked results");
               });
         },

         "Check there are no unexpected queries": function() {
            return browser.findByCssSelector("body")
               .end()

            .getXhrEntries({url: "&query={"})
               .then(function(entries) {
                  assert.lengthOf(entries, 0);
               });
         },

         "Repository scope should be used by default": function() {
            return browser.findByCssSelector("body").end().getLastPublish("ALF_SEARCH_REQUEST")
               .then(function(payload) {
                  assert.propertyVal(payload, "repo", true, "Repository scope not requested");
               })
            .end()
            .getLastXhr("aikau/proxy/alfresco/slingshot/search")
               .then(function(xhr){
                  assert.include(xhr.request.url, "repo=true");
               })
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
            .getLastXhr("aikau/proxy/alfresco/slingshot/search")
               .then(function(xhr){
                  assert.include(xhr.request.url, "repo=false");
               })
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
            .getLastXhr("aikau/proxy/alfresco/slingshot/search")
               .then(function(xhr){
                  assert.include(xhr.request.url, "repo=false");
                  assert.include(xhr.request.url, "site=site");
               })
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
            .getLastXhr("aikau/proxy/alfresco/slingshot/search")
               .then(function(xhr){
                  assert.include(xhr.request.url, "repo=true");
               })
               .clearLog();
         },

         "Change sort field": function() {
            return browser.findById("FCTSRCH_SORT_MENU_text")
               .click()
            .end()

            .clearLog()
            .clearXhrLog()

            .findDisplayedById("SORT_BY_NAME_text")
               .click()
            .end()

            .getLastPublish("ALF_SEARCH_REQUEST")
               .then(function(payload) {
                  assert.propertyVal(payload, "sortField", "cm:name", "Sort field not updated correctly");
               })

            .getLastXhr()
               .then(function(xhr) {
                  assert.include(xhr.request.url, encodeURIComponent("cm:name|true"), "Sort not correctly requested");
               });
         },

         "Change sort order": function() {
            return browser.findByCssSelector("#FCTSRCH_SORT_ORDER_TOGGLE img.dijitMenuItemIcon")
               .clearLog()
               .clearXhrLog()
               .click()
            .end()

            .getLastPublish("ALF_SEARCH_REQUEST")
               .then(function(payload) {
                  assert.propertyVal(payload, "sortAscending", "false", "Sort order not updated correctly");
               })

            .getLastXhr()
               .then(function(xhr) {
                  assert.include(xhr.request.url, encodeURIComponent("cm:name|false"), "Sort order not correctly requested");
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
         name: "Search Service Test (no hashing)",

         setup: function() {
            browser = this.remote;
            // NOTE: Load with a scope set because one will be set regardless...
            return TestCommon.loadTestWebScript(this.remote, "/SearchService?useHash=false", "Search Service Test (no hashing)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Change sort field": function() {
            return browser.findById("FCTSRCH_SORT_MENU_text")
               .click()
            .end()

            .clearLog()
            .clearXhrLog()

            .findDisplayedById("SORT_BY_NAME_text")
               .click()
            .end()

            .getLastPublish("ALF_SEARCH_REQUEST")
               .then(function(payload) {
                  assert.propertyVal(payload, "sortField", "cm:name", "Sort field not updated correctly");
               })

            .getLastXhr()
               .then(function(xhr) {
                  assert.include(xhr.request.url, encodeURIComponent("cm:name|true"), "Sort not correctly requested");
               });
         },

         "Change sort order": function() {
            return browser.findByCssSelector("#FCTSRCH_SORT_ORDER_TOGGLE img.dijitMenuItemIcon")
               .clearLog()
               .clearXhrLog()
               .click()
            .end()

            .getLastPublish("ALF_SEARCH_REQUEST")
               .then(function(payload) {
                  assert.propertyVal(payload, "sortAscending", false, "Sort order not updated correctly");
               })

            .getLastXhr()
               .then(function(xhr) {
                  assert.include(xhr.request.url, encodeURIComponent("cm:name|false"), "Sort order not correctly requested");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});