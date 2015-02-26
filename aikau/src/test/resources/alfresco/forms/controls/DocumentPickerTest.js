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
 *
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function (registerSuite, assert, require, TestCommon) {


   // TODO: Check all items can be removed
   // TODO: Check form values can be set and retrieved
   // TODO: Check that initial values can be set
   // TOOD: Check that folders don't have publish action images
   // TODO: Set up controls with invalid data
   // TODO: Click on a folder to get sub-results
   // TODO: Check singleItemMode works.

   var browser;

   registerSuite({
      name: "Document Picker Test",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DocumentPicker", "DocumentPicker").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    return browser.end().alfPostCoverageResults(browser);
      // },

      "Test picker dialog can be displayed": function () {
         return browser.findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span > span > span")
            .click()
         .end()
         .findByCssSelector(".alfresco-pickers-Picker")
            .then(
               function(){}, 
               function() {
                  assert(false, "The dialog has NOT opened with the picker");
               }
            );
      },

      "Test Shared Files sub-picker is shown": function() {
         // Select "Shared Files" (the results for this are mocked)
         return browser.findByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:first-child .dijitMenuItem:nth-child(5)")
            .click()
         .end()
         .findByCssSelector(".alfresco-lists-views-AlfListView")
            .then(
               function(){}, 
               function() {
                  assert(false, "The Shared Files click did not yield any results");
               }
            );
      },

      "Test Shared files result count": function() {
         // Count the mocked results...
         return browser.findAllByCssSelector(".alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert(elements.length === 4, "4 results expected for Shared Files, found: " + elements.length);
            });
      },

      "Test first item in picker can be added": function() {
         // Check the first item has an ADD publish action image...
         return browser.findByCssSelector(".alfresco-lists-views-AlfListView tr:nth-child(1) .alfresco-renderers-PublishAction > img")
            .then(
               function(){}, 
               function() {
                  assert(false, "The first shared files item did not have an ADD publish action image");
               }
            );
      },

      "Test item gets picked": function() {
         // Click the ADD publish action image to add the item to the picked items...
         return browser.findByCssSelector(".alfresco-lists-views-AlfListView tr:nth-child(1) .alfresco-renderers-PublishAction > img")
            .click()
         .end()
         // Count the number of picked items (there should now be 1)...
         // TODO: Could probably check that there were none picked when the dialog was first opened...
         .findAllByCssSelector(".picked-items tr")
            .then(function(elements) {
               assert(elements.length === 1, "Only one result was expected for picked items");
            });
      },

      "Test picked items are reflected when closing dialog": function() {
         // Close the dialog...
         return browser.findByCssSelector(".alfresco-dialog-AlfDialog .footer .alfresco-buttons-AlfButton:first-child > span")
            .click()
            .sleep(500)
         .end()
         // Count the selected items...
         .findAllByCssSelector("#DOCUMENT_PICKER .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert(elements.length === 1, "Only 1 results was expected for picked items after dialog close, found: " + elements.length);
            });
      },

      "Test picked items are retained": function() {
         return browser.findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span.alfresco-buttons-AlfButton.confirmationButton > span > span")
            .then(function(){}, function() {})
         .end()
         // Open the dialog again and check the picked items remain...
         .findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span > span > span")
            .click()
         .end()
         .findAllByCssSelector(".picked-items tr")
            .then(function(elements) {
               assert(elements.length === 1, "The previously selected item was not preserved");
            });
      },

      "Test previously picked item can be removed": function() {
         // Check the remove item image exists...
         return browser.findByCssSelector(".picked-items tr .alfresco-renderers-PublishAction > img")
            .then(
               function(){}, 
               function() {
                  assert(false, "The remove item image could not be found");
               }
            );
      },

      "Test previously picked item gets removed": function() {
         // Remove the previously selected item...
         return browser.findByCssSelector(".picked-items tr .alfresco-renderers-PublishAction > img")
            .click()
         .end()
         // Close the dialog...
         .findByCssSelector(".alfresco-dialog-AlfDialog .footer .alfresco-buttons-AlfButton:first-child > span")
            .click()
         .end()
         // Check the item was removed...
         .findAllByCssSelector("#DOCUMENT_PICKER .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert(elements.length === 0, "The previously selected item should have been removed");
            });
      },

      "Test an item can be only picked once": function() {
         // Open the dialog again and add some more...
         return browser.findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span > span > span")
            .click()
         .end()
         // Select "Shared Files" option again...
         .findByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:first-child .dijitMenuItem:nth-child(5)")
            .click()
         .end()
         // Click the ADD publish action image TWICE, check that it was only added once...
         .findByCssSelector(".alfresco-lists-views-AlfListView tr:nth-child(2) .alfresco-renderers-PublishAction > img")
            .click()
            .click()
         .end()
         // Count the number of picked items (there should now be 1 DESPITE clicking twice)...
         .findAllByCssSelector(".picked-items tr")
            .then(function(elements) {
               assert(elements.length === 1, "Only one result was expected for picked items, found: " + elements.length);
            });
      },

      "Test picking another item": function() {
         // Add another item...
         return browser.findByCssSelector(".alfresco-lists-views-AlfListView tr:nth-child(3) .alfresco-renderers-PublishAction > img")
            .click()
         .end()
         .findAllByCssSelector(".picked-items tr")
            .then(function(elements) {
               assert(elements.length === 2, "Two results were expected for picked items, found: " + elements.length);
            });
      },
      
      "Test both items are shown as picked when dialog closed": function() {
         // Close the dialog...
         return browser.findByCssSelector(".alfresco-dialog-AlfDialog .footer .alfresco-buttons-AlfButton:first-child > span")
            .click()
         .end()
         // Check there are now 2 items...
         .findAllByCssSelector("#DOCUMENT_PICKER .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert(elements.length === 2, "Two items should have been picked, found: " + elements.length);
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});