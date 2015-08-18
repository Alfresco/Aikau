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

registerSuite(function(){
   var browser;

   return {
      name: "Document Selector Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DocumentSelector", "Document Selector Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },
     
      "Count the rows": function () {
         return browser.findAllByCssSelector("#VIEW tr")
            .then(function(elements) {
               assert(elements.length === 3, "An unexpected number of rows were detected: " + elements.length);
            });
      },

      "Count the unchecked selectors": function() {
         return browser.findAllByCssSelector(uncheckedSelectorSelector())
            .then(function(elements) {
               assert(elements.length === 3, "An unexpected number of UNCHECKED selectors were found: " + elements.length);
            });
      },

      "Count the checked selectors": function() {
          return browser.findAllByCssSelector(checkedSelectorSelector())
            .then(function(elements) {
               assert(elements.length === 0, "An unexpected number of CHECKED selectors were found: " + elements.length);
            });
      },

      "Check that the overall selector indicates that none have been selected": function() {
         return browser.findByCssSelector("#SELECTED_ITEMS .alf-noneselected-icon")
            .then(null, function() {
               assert(false, "The selected items widget doesn't indicate that NO items are selected");
            });
      },

      "Check the first selector": function() {
         return browser.findByCssSelector(selectorSelector(1))
            .click()
         .end()
         .findByCssSelector("#SELECTED_ITEMS .alf-someselected-icon")
            .then(null, function() {
               assert(false, "The selected items widget doesn't indicate that SOME items are selected");
            });
      },

      "Check the other two selectors": function() {
         return browser.findByCssSelector(selectorSelector(2))
            .click()
         .end()
         .findByCssSelector(selectorSelector(3))
            .click()
         .end()
         .findByCssSelector("#SELECTED_ITEMS .alf-allselected-icon")
            .then(null, function() {
               assert(false, "The selected items widget doesn't indicate that ALL items are selected");
            });
      },

      "Uncheck the middle selector": function() {
         return browser.findByCssSelector(selectorSelector(2))
            .click()
         .end()
         .findByCssSelector("#SELECTED_ITEMS .alf-someselected-icon")
            .then(null, function() {
               assert(false, "The selected items widget doesn't indicate that SOME items are selected");
            });
      },

      "Open the menu and select documents": function() {
         return browser.findByCssSelector(".alf-menu-arrow")
            .click()
         .end()
         .sleep(150)
         .findByCssSelector(".dijitMenuItem:nth-child(4) > td.dijitMenuItemLabel")
            .click()
         .end()
         .findByCssSelector(specificCheckedSelectorSelector(1))
            .then(null, function() {
               assert(false, "First item was not checked when 'Documents' selected");
            });
      },

      "Check that second item is not checked": function() {
         return browser.findByCssSelector(specificUncheckedSelectorSelector(2))
            .then(null, function() {
               assert(false, "Second item was unexpectedly checked when 'Documents' selected");
            });
      },

      "Open the menu and select folders": function() {
         return browser.findByCssSelector(".alf-menu-arrow")
            .click()
         .end()
         .sleep(150)

         .findByCssSelector(".dijitMenuItem:nth-child(5) > td.dijitMenuItemLabel")
            .click()
         .end()

         .findByCssSelector(specificCheckedSelectorSelector(2))
            .then(null, function() {
               assert(false, "First item was unexpectedly checked when 'Folders' selected");
            });
      },

      "Check that second item is checked": function() {
         return browser.findByCssSelector(specificUncheckedSelectorSelector(1))
            .then(null, function() {
               assert(false, "Second item was not checked when 'Folders' selected");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});