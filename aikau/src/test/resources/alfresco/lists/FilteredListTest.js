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
 * Test the filtered list widget
 *
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["module",
        "alfresco/TestCommon",
        "intern/chai!assert",
        "intern/dojo/node!leadfoot/keys",
        "alfresco/defineSuite"],
        function(module, TestCommon, assert, keys, defineSuite) {

   defineSuite(module, {
      name: "FilteredList Tests",
      testPage: "/FilteredList",

      "Check that results are loaded initially": function() {
         return this.remote.findAllByCssSelector("#SEPARATE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 8, "The wrong number of results were displayed");
            })
            .end()

         .findAllByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 5, "Did not load first page of results");
            })
            .end()

         .findByCssSelector("#COMPOSITE .alfresco-lists-Paginator__page-selector [id$=PAGE_SELECTOR_text]")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "1-5 of 8", "Did not display correct page description");
            });
      },

      "Type a filter": function() {
         return this.remote.findByCssSelector("#TEXTBOX .dijitInputContainer input")
            .clearLog()
            .type("one")
            .end()

         // Use the implicit wait for the loading data to return to ensure that the filtered results have returned
         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", 1500)
            .end()

         .findAllByCssSelector("#SEPARATE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Only 1 result should be displayed for filter 'one'");
            });
      },

      "Delete a couple of characters": function() {
         return this.remote.findByCssSelector("#TEXTBOX .dijitInputContainer input")
            .clearLog()
            .type(keys.BACKSPACE)
            .type(keys.BACKSPACE)
            .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", 1500)
            .end()

         .findAllByCssSelector("#SEPARATE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "3 results should be displayed for filter 'o'");
            });
      },

      "Select a filter from drop down (useHash=true)": function() {
         return this.remote.findByCssSelector("#COMPOSITE_DROPDOWN .dijitArrowButtonInner")
            .clearLog()
            .click()
            .end()

         .findByCssSelector("#COMPOSITE_DROPDOWN_CONTROL_popup1")
            .click()
            .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", 1500)
            .end()

         .findAllByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "4 results should be displayed for description 'moo'");
            });
      },

      "Apply a 2nd filter (useHash=true)": function() {
         return this.remote.findByCssSelector("#COMPOSITE_TEXTBOX .dijitInputContainer input")
            .clearLog()
            .type("t")
            .end()

         // Use the implicit wait for the loading data to return to ensure that the filtered results have returned
         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", 1500)
            .end()

         .findAllByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Only 2 result should be displayed for combined filter");
            });
      },

      "Hash reflects current filter values (useHash=true)": function() {
         return this.remote.getCurrentUrl()
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

      "Changing hash value updates filter (useHash=true)": function() {
         var updatedUrl = TestCommon.generateWebscriptUrl("/FilteredList#description=woof");
         return this.remote.findByCssSelector("body")
            .clearLog()
            .get(updatedUrl)
            .getLastPublish("COMPOSITE_ALF_DOCLIST_REQUEST_FINISHED")
            .end()

         .findByCssSelector("#COMPOSITE .alfresco-lists-views-AlfListView table")
            .getVisibleText()
            .then(function(visibleText) {
               var text = visibleText.split("\n").join("|"),
                  expectedText = "five woof|five and a half woof|six woof|six and a half woof";
               assert.equal(text, expectedText, "Incorrect results displayed for intended filter");
            });
      },

      "Filter field reflects applied filter (useHash=true)": function() {
         return this.remote.findByCssSelector("#COMPOSITE_DROPDOWN_CONTROL + input")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "woof", "Incorrect filter field value");
            });
      },

      "Deleting filter field value removes filter (useHash=true)": function() {
         var updatedUrl = TestCommon.generateWebscriptUrl("/FilteredList#name=one");
         return this.remote.findByCssSelector("body")
            .clearLog()
            .get(updatedUrl)
            .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", "Didn't reload list after hash change")
            .end()

         .findByCssSelector("#COMPOSITE_TEXTBOX .dijitInputContainer input")
            .clearLog()
            .clearValue()
            .pressKeys(keys.TAB)
            .end()

         .getLastPublish("ALF_DOCLIST_DOCUMENTS_LOADED", 1500, "Didn't reload list after filter removal")
            .end()

         .findAllByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 5, "All results should be displayed when filter removed");
            });
      },

      "Going to next page displays second page of results (useHash=true)": function() {
         return this.remote.findByCssSelector("#COMPOSITE .alfresco-lists-Paginator__page-forward")
            .click()
            .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", 1500, "Going to next page did not reload list")

         .findAllByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Should be displaying second page of results");
            });
      },

      "Filter values with spaces in should not be URL escaped (useHash=true)": function() {
         return this.remote.findByCssSelector("#COMPOSITE_TEXTBOX .dijitInputContainer input")
            .clearLog()
            .type("five and")
            .end()

         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED", 1500)
            .end()

         .findByCssSelector("#COMPOSITE_TEXTBOX .dijitInputInner")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "five and", "Incorrect filter field value");
            })
            .end()

         .findAllByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "One result should be displayed for filter 'five and'");
            })
            .end()

         .findByCssSelector("#COMPOSITE .alfresco-lists-views-layouts-Cell:nth-child(2) .alfresco-renderers-Property .value")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "five and a half", "Incorrect result displayed for filter 'five and'");
            });
      },

      "Navigating to another page and then back will re-apply filter (useHash=true)": function() {
         var anotherPageUrl = TestCommon.generateWebscriptUrl("/Index"),
            returnUrl = TestCommon.generateWebscriptUrl("/FilteredList#description=woof");
         return this.remote.findByCssSelector("body")
            .clearLog()
            .end()

         .get(anotherPageUrl)
            .findByCssSelector("body")
            .end()

         .get(returnUrl)
            .findByCssSelector("body")
            .end()

         .findByCssSelector("#COMPOSITE .alfresco-lists-views-AlfListView table")
            .getVisibleText()
            .then(function(visibleText) {
               var text = visibleText.split("\n").join("|"),
                  expectedText = "five woof|five and a half woof|six woof|six and a half woof";
               assert.equal(text, expectedText, "Incorrect results displayed for filter 'woof'");
            });
      },

      "Filter summary displayed": function() {
         return this.remote.findDisplayedByCssSelector(".alfresco-lists-utilities-FilterSummary");
      },

      "Single Filter choice displayed": function() {
         return this.remote.findAllByCssSelector(".alfresco-forms-controls-utilities-ChoiceMixin__choice")
            .then(function(elements) {
               assert.lengthOf(elements, 1);
            });
      },

      "Filter choice displayed correctly": function() {
         return this.remote.findByCssSelector(".alfresco-forms-controls-utilities-ChoiceMixin__choice__content")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "woof");
            });
      },

      "Clear all action displayed": function() {
         return this.remote.findDisplayedByCssSelector(".alfresco-lists-utilities-FilterSummary__choices .alfresco-renderers-PropertyLink")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Clear All");
            });
      },

      "Removing filter loads data": function() {
         return this.remote.findByCssSelector(".alfresco-forms-controls-utilities-ChoiceMixin__choice__close-button")
            .clearLog()
            .click()
            .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST");
      },

      "Filter form control is reset": function() {
         return this.remote.findById("COMPOSITE_DROPDOWN_CONTROL")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "");
            });
      },

      "Filter summary is empty": function() {
         return this.remote.findAllByCssSelector(".alfresco-forms-controls-utilities-ChoiceMixin__choice")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "Enter a filter updates summary": function() {
         return this.remote.findByCssSelector("#COMPOSITE_TEXTBOX .dijitInputContainer input")
            .clearLog()
            .type("e")
            .end()

         .findByCssSelector(".alfresco-forms-controls-utilities-ChoiceMixin__choice__content")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "e");
            });
      },

      "Second filter updates summary": function() {
         return this.remote.findByCssSelector("#COMPOSITE_DROPDOWN .dijitArrowButtonInner")
            .clearLog()
            .click()
            .end()

         .findByCssSelector("#COMPOSITE_DROPDOWN_CONTROL_popup1")
            .click()
            .end()

         .getLastPublish("COMPOSITE_ALF_DOCLIST_REQUEST_FINISHED")
            .end()

         .findAllByCssSelector(".alfresco-forms-controls-utilities-ChoiceMixin__choice")
            .then(function(elements) {
               assert.lengthOf(elements, 2);
            });
      },

      "Clear all removes filters": function() {
         return this.remote.findByCssSelector(".alfresco-lists-utilities-FilterSummary__choices .alfresco-renderers-PropertyLink")
            .clearLog()
            .click()
            .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .end()

         .findAllByCssSelector(".alfresco-forms-controls-utilities-ChoiceMixin__choice")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            })
            .end()

         .findByCssSelector("#COMPOSITE_TEXTBOX .dijitInputContainer input")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "", "Text box value not reset");
            });
      }
   });
});