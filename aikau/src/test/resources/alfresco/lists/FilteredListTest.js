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
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

   var browser;
   registerSuite({
      name: "FilteredList Tests",
      
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/FilteredList", "FilteredList Tests").end();
      },
      
      beforeEach: function() {
         browser.end();
      },
      
      "Check that results are loaded initially": function () {
         return browser.findAllByCssSelector("#SEPARATE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 6, "The wrong number of results were displayed");
            });
      },

      "Type a filter": function() {
         return browser.findByCssSelector("#TEXTBOX .dijitInputContainer input")
            .type("one")
         .end()
         // Use the implicit wait for the loading data to return to ensure that the filtered results have returned
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_DOCLIST_DOCUMENTS_LOADED", "totalRecords", "1"))
         .end()
         .findAllByCssSelector("#SEPARATE .alfresco-lists-views-layouts-Row")
         .then(function(elements) {
            assert.lengthOf(elements, 1, "Only 1 result should be displayed for filter 'one'");
         });
      },

      "Delete a couple of characters": function() {
         return browser.findByCssSelector("#TEXTBOX .dijitInputContainer input")
            .type(keys.BACKSPACE)
            .type(keys.BACKSPACE)
         .end()
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_DOCLIST_DOCUMENTS_LOADED", "totalRecords", "3"))
         .end()
         .findAllByCssSelector("#SEPARATE .alfresco-lists-views-layouts-Row")
         .then(function(elements) {
            assert.lengthOf(elements, 3, "3 results should be displayed for filter 'o'");
         });
      },

      "Select a filter from drop down": function() {
         return browser.findByCssSelector("#COMPOSITE_DROPDOWN .dijitArrowButtonInner")
            .click()
         .end()
         .findByCssSelector("#COMPOSITE_DROPDOWN_CONTROL_popup1")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_DOCLIST_DOCUMENTS_LOADED", "totalRecords", "4"))
         .end()
         .findAllByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Row")
         .then(function(elements) {
            assert.lengthOf(elements, 4, "4 results should be displayed for description 'moo'");
         });
      },

      "Apply a 2nd filter": function() {
         return browser.findByCssSelector("#COMPOSITE_TEXTBOX .dijitInputContainer input")
            .type("t")
         .end()
         // Use the implicit wait for the loading data to return to ensure that the filtered results have returned
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_DOCLIST_DOCUMENTS_LOADED", "totalRecords", "2"))
         .end()
         .findAllByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Row")
         .then(function(elements) {
            assert.lengthOf(elements, 2, "Only 2 result should be displayed for combined filter");
         });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});