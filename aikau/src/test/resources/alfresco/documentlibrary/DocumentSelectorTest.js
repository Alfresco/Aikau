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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

   registerSuite({
      name: 'AlfDocumentList Test',
      'AlfSearchListTest': function () {

         // Use this function for getting an individual selector...
         var selectorSelector = function(row) {
            return "#VIEW tr:nth-child(" + row + ") .alfresco-renderers-Selector";
         };
         // Use this function for getting all checked selectors...
         var checkedSelectorSelector = function() {
            return "#VIEW tr .alfresco-renderers-Selector.checked";
         };
         // Use this function for getting all unchecked selectors...
         var uncheckedSelectorSelector = function() {
            return "#VIEW tr .alfresco-renderers-Selector.unchecked";
         };
         // Use this function to check if a specific entry is checked...
         var specificCheckedSelectorSelector = function(row) {
            return "#VIEW tr:nth-child(" + row + ") .alfresco-renderers-Selector.checked";
         };
         // Use this function for getting all unchecked selectors...
         var specificUncheckedSelectorSelector = function(row) {
            return "#VIEW tr:nth-child(" + row + ") .alfresco-renderers-Selector.unchecked";
         };

         var browser = this.remote;
         var testname = "AlfDocumentListTest";
         return TestCommon.loadTestWebScript(this.remote, "/DocumentSelector", testname)

         // First lets count the rows...
         .findAllByCssSelector("#VIEW tr")
            .then(function(elements) {
               assert(elements.length == 3, "Test #1a - An unexpected number of rows were detected: " + elements.length);
            })
         .end()

         // Count the unchecked selectors...
         .findAllByCssSelector(uncheckedSelectorSelector())
            .then(function(elements) {
               assert(elements.length == 3, "Test #1b - An unexpected number of UNCHECKED selectors were found: " + elements.length);
            })
         .end()
          // Count the checked selectors...
         .findAllByCssSelector(checkedSelectorSelector())
            .then(function(elements) {
               assert(elements.length === 0, "Test #1c - An unexpected number of CHECKED selectors were found: " + elements.length);
            })
         .end()

         // Check that the overall selector indicates that none have been selected...
         .findByCssSelector("#SELECTED_ITEMS .alf-noneselected-icon")
            .then(null, function() {
               assert(false, "Test #1d - The selected items widget doesn't indicate that NO items are selected");
            })
         .end()

         // Check the first selector...
         .findByCssSelector(selectorSelector(1))
            .click()
            .end()
         .findByCssSelector("#SELECTED_ITEMS .alf-someselected-icon")
            .then(null, function() {
               assert(false, "Test #2a - The selected items widget doesn't indicate that SOME items are selected");
            })
         .end()

         // Check the other two selectors...
         .findByCssSelector(selectorSelector(2))
            .click()
         .end()
         .findByCssSelector(selectorSelector(3))
            .click()
         .end()
         .findByCssSelector("#SELECTED_ITEMS .alf-allselected-icon")
            .then(null, function() {
               assert(false, "Test #2b - The selected items widget doesn't indicate that ALL items are selected");
            })
         .end()

         // Uncheck the middle selector...
         .findByCssSelector(selectorSelector(2))
            .click()
         .end()
         .findByCssSelector("#SELECTED_ITEMS .alf-someselected-icon")
            .then(null, function() {
               assert(false, "Test #2c - The selected items widget doesn't indicate that SOME items are selected");
            })
         .end()

         // Open the menu and select documents...
         .findByCssSelector(".alf-menu-arrow")
            .click()
         .end()
         .sleep(150)

         .findByCssSelector(".dijitMenuItem:nth-child(4) > td.dijitMenuItemLabel")
            .click()
         .end()

         .findByCssSelector(specificCheckedSelectorSelector(1))
            .then(null, function() {
               assert(false, "Test #3a - First item was not checked when 'Documents' selected");
            })
         .end()
         .findByCssSelector(specificUncheckedSelectorSelector(2))
            .then(null, function() {
               assert(false, "Test #3b - Second item was unexpectedly checked when 'Documents' selected");
            })
         .end()

         // Open the menu and select folders...
         .findByCssSelector(".alf-menu-arrow")
            .click()
         .end()
         .sleep(150)

         .findByCssSelector(".dijitMenuItem:nth-child(5) > td.dijitMenuItemLabel")
            .click()
         .end()

         .findByCssSelector(specificCheckedSelectorSelector(2))
            .then(null, function() {
               assert(false, "Test #3a - First item was unexpectedly checked when 'Folders' selected");
            })
         .end()
         .findByCssSelector(specificUncheckedSelectorSelector(1))
            .then(null, function() {
               assert(false, "Test #3b - Second item was not checked when 'Folders' selected");
            })
         .end()

         .alfPostCoverageResults(browser);
      }
   });
});