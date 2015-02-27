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
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

   var browser;
   var activeElementId;
      
   registerSuite({
      name: "AlfSearchResult Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfSearchResult", "AlfSearchResult Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Check the correct number of rows is shown": function () {
         return browser.findAllByCssSelector("#SEARCH_RESULTS table tbody tr")
            .then(function (rows){
               expect(rows).to.have.length(11, "There should be 11 search result rows shown");
            });
      },

      "Check that a clicked search result at the bottom of the screen becomes focused": function() {
         return browser.findByCssSelector("#SEARCH_RESULTS table tbody tr:last-of-type")
            .click()
         .end()

         // Store the id of the currently focused (active) element
         .getActiveElement()
            .then(function (element){
               activeElementId = element._elementId;
            })
         .end()

         // Are the clicked row of the results and the currently focused item the same?
         .findByCssSelector("#SEARCH_RESULTS table tbody tr:last-of-type")
            .then(function (clickedElement){
               var clickedElementId = clickedElement._elementId;
               expect(clickedElementId).to.equal(activeElementId, "The clicked element has not become focused");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});