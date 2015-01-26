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
 * This test generates some variations on AlfSearchResult to test the various if statements in the rendering widgets involved
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

   registerSuite({
      name: 'AlfSearchResult Test',
      'alfresco/search/AlfSearchResult': function () {

         var browser = this.remote;
         var testname = "AlfSearchResult Test";
         var activeElementId;
         return TestCommon.loadTestWebScript(this.remote, "/AlfSearchResult", testname)

         // Are there 11 results?
         .findAllByCssSelector('#SEARCH_RESULTS table tbody tr')
            .then(function (rows){
               TestCommon.log(testname,"Check the correct number of rows is shown");
               expect(rows).to.have.length(11, "Test #1 - There should be 11 search result rows shown");
            })
            .end()

         // Click the last result row
         .findByCssSelector('#SEARCH_RESULTS table tbody tr:last-of-type')
            .click()
            .end()

         // Store the id of the currently focused (active) element
         .getActiveElement()
            .then(function (element){
               activeElementId = element._elementId;
            })
            .end()

         // Are the clicked row of the results and the currently focused item the same?
         .findByCssSelector('#SEARCH_RESULTS table tbody tr:last-of-type')
            .then(function (clickedElement){
               TestCommon.log(testname,"Check that a clicked search result at the bottom of the screen becomes focused");
               var clickedElementId = clickedElement._elementId;
               expect(clickedElementId).to.equal(activeElementId, "Test #2 - The clicked element has not become focused");
            })
            .end()

         // Old version of last test which was a bit brittle
         // .findByCssSelector('#SEARCH_RESULTS table tbody tr:last-of-type')
         //    .click()
         //    .getComputedStyle('background-color')
         //    .then(function (colour){
         //       TestCommon.log(testname,"Check that a clicked search result at the bottom of the screen becomes selected");
         //       expect(colour).to.equal("rgba(245, 245, 245, 1)", "Test #2 - The colour of the click selection was not as expected");
         //    })
         //    .end()

         .alfPostCoverageResults(browser);
      }
   });
});