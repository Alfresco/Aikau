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
        function(registerSuite, assert, require, TestCommon, keys) {

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

      "Check that results are loaded initially": function() {
         return browser.findAllByCssSelector("#SEPARATE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 6, "The wrong number of results were displayed");
            });
      },

      "Type a filter": function() {
         return browser.findByCssSelector("#TEXTBOX .dijitInputContainer input")
            .clearLog()
            .type("one")
            .end()

         // Use the implicit wait for the loading data to return to ensure that the filtered results have returned
         .getLastPublish("ALF_DOCLIST_DOCUMENTS_LOADED")
            .end()

         .findAllByCssSelector("#SEPARATE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Only 1 result should be displayed for filter 'one'");
            });
      },

      "Delete a couple of characters": function() {
         return browser.findByCssSelector("#TEXTBOX .dijitInputContainer input")
            .clearLog()
            .type(keys.BACKSPACE)
            .type(keys.BACKSPACE)
            .end()

         .getLastPublish("ALF_DOCLIST_DOCUMENTS_LOADED")
            .end()

         .findAllByCssSelector("#SEPARATE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "3 results should be displayed for filter 'o'");
            });
      },

      "Select a filter from drop down": function() {
         return browser.findByCssSelector("#COMPOSITE_DROPDOWN .dijitArrowButtonInner")
            .clearLog()
            .click()
            .end()

         .findByCssSelector("#COMPOSITE_DROPDOWN_CONTROL_popup1")
            .click()
            .end()

         .getLastPublish("ALF_DOCLIST_DOCUMENTS_LOADED")
            .end()

         .findAllByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "4 results should be displayed for description 'moo'");
            });
      },

      "Apply a 2nd filter": function() {
         return browser.findByCssSelector("#COMPOSITE_TEXTBOX .dijitInputContainer input")
            .clearLog()
            .type("t")
            .end()

         // Use the implicit wait for the loading data to return to ensure that the filtered results have returned
         .getLastPublish("ALF_DOCLIST_DOCUMENTS_LOADED")
            .end()

         .findAllByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Only 2 result should be displayed for combined filter");
            });
      },

      "Hash reflects current filter values": function() {
         return browser.getCurrentUrl()
            .then(function(url) {
               var hash = url.split("#")[1],
                  hashParts = (hash && hash.split("&")) || [],
                  hashObj = {};
               hashParts.forEach(function(hashPart) {
                  var nameValuePair = hashPart.split("=");
                  hashObj[nameValuePair[0]] = nameValuePair[1];
               });
               assert.propertyVal(hashObj, "description", "moo", "Invalid value in hash");
               assert.propertyVal(hashObj, "name", "t", "Invalid value in hash");
            });
      },

      "Changing hash value updates filter": function() {
         var updatedUrl = TestCommon.testWebScriptURL("/FilteredList#description=woof");
         return browser.findByCssSelector("body")
            .clearLog()
            .get(updatedUrl)
            .getLastPublish("COMPOSITE_ALF_DOCLIST_REQUEST_FINISHED")
            .end()

         .findByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Row:first-child")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "five woof", "Incorrect results displayed for intended filter");
            })
            .end()

         .findByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Row:nth-child(2)")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "six woof", "Incorrect results displayed for intended filter");
            });
      },

      "Filter field reflects applied filter": function() {
         return browser.findByCssSelector("#COMPOSITE_DROPDOWN_CONTROL + input")
            .getAttribute("value")
            .then(function(value) {
               assert.equal(value, "woof", "Incorrect filter field value");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});