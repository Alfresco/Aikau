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
 * This test uses a MockXhr service to test the search service responds as required.
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

   registerSuite({
      name: 'Search Service Test',
      'alfresco/services/SearchService': function () {

         var browser = this.remote;
         var testname = "SearchServiceTest";
         return TestCommon.loadTestWebScript(this.remote, "/SearchService", testname)

         .findById('FCTSRCH_SEARCH_RESULTS_LIST')
            .getVisibleText()
            .then(function (text){
               TestCommon.log(testname,"Check there are no results yet");
               expect(text).to.equal("No results found", "There should not be any results found yet");
            })
            .end()

         .findByCssSelector("#FCTSRCH_SEARCH_FORM div.alfresco-forms-controls-TextBox div.control input[name='searchTerm']")
            .type("test")
            .end()

         .findByCssSelector("#FCTSRCH_SEARCH_FORM div.buttons span.dijitButtonNode")
            .click()
            .end()

         .findAllByCssSelector('#FCTSRCH_SEARCH_RESULTS_LIST tr.alfresco-search-AlfSearchResult')
            .then(function (results){
               TestCommon.log(testname,"Check there are the expected number of mocked results");
               expect(results).to.have.length(24, "There should be 24 mocked results");
            })
            .end()

         .execute("location.hash='#searchTerm=test&allSites=true&repo=false&sortField=cm%3Aname&facetFilters=%7Bhttp%3A%2F%2Fwww.alfresco.org%2Fmodel%2Fcontent%2F1.0%7Dcreator.__.u%7Cadmin&sortAscending=false'")
         .end()

         .findAllByCssSelector('#FCTSRCH_SEARCH_RESULTS_LIST tr.alfresco-search-AlfSearchResult')
            .then(function (results){
               TestCommon.log(testname,"Check there are still the expected number of mocked results");
               expect(results).to.have.length(24, "There should still be 24 mocked results");
            })
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});