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
 *
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function (registerSuite, assert, require, TestCommon, keys) {

   registerSuite({
      name: 'Document Picker Test',
      'alfresco/forms/controls/DocumentPicker': function () {

         var browser = this.remote;
         var testname = "DocumentPickerTest";
         return TestCommon.loadTestWebScript(this.remote, "/DocumentPicker", testname)

         // Open the dialog to select items...
         .findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span > span > span")
            .click()
            .end()

         // Check the picker is displayed...
         .findByCssSelector(".alfresco-pickers-Picker")
            .then(
               function(){
                  TestCommon.log(testname, "Check that the dialog has opened with the picker...");
               }, 
               function() {
                  assert(false, "Test #1a - The dialog has NOT opened with the picker");
               }
            )
            .end()

         // Select "Shared Files" (the results for this are mocked)
         .findByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:first-child .dijitMenuItem:nth-child(5)")
            .click()
            .end()

         // Check that a new results set are shown...
         .findByCssSelector(".alfresco-documentlibrary-views-layouts-AlfDocumentListView")
            .then(
               function()
               {
                  TestCommon.log(testname, "Check that clicking Shared Files shows some results...");
               }, 
               function() {
                  assert(false, "Test #1b - The Shared Files click did not yield any results");
               }
            )
            .end()

         // Count the mocked results...
         .findAllByCssSelector(".alfresco-documentlibrary-views-layouts-AlfDocumentListView tr")
            .then(function(elements) {
               TestCommon.log(testname, "Count the number of Shared Files results...");
               assert(elements.length == 4, "Test #1c - 4 results expected for Shared Files");
            })
            .end()

         // Check the first item has an ADD publish action image...
         // TODO: This could be more specific, e.g. to check the actual image source?
         .findByCssSelector(".alfresco-documentlibrary-views-layouts-AlfDocumentListView tr:nth-child(1) .alfresco-renderers-PublishAction > img")
            .then(
               function(){
                  TestCommon.log(testname, "Check that the first item in Shared Files has the icon for adding...");
               }, 
               function() {
                  assert(false, "Test #1d -The first shared files item did not have an ADD publish action image");
               }
            )
            .end()

         // Click the ADD publish action image to add the item to the picked items...
         .findByCssSelector(".alfresco-documentlibrary-views-layouts-AlfDocumentListView tr:nth-child(1) .alfresco-renderers-PublishAction > img")
            .click()
            .end()

         // Count the number of picked items (there should now be 1)...
         // TODO: Could probably check that there were none picked when the dialog was first opened...
         .findAllByCssSelector(".picked-items tr")
            .then(function(elements) {
               TestCommon.log(testname, "Check that clicked item is shown in the list of picked items..");
               assert(elements.length == 1, "Test #1e - Only one result was expected for picked items");
            })
            .end()

         // Close the dialog...
         .findByCssSelector(".alfresco-dialog-AlfDialog .footer .alfresco-buttons-AlfButton:first-child > span")
            .click()
            .sleep(500)
            .end()

         // Count the selected items...
         .findAllByCssSelector("#DOCUMENT_PICKER .alfresco-documentlibrary-views-layouts-AlfDocumentListView tr")
            .then(function(elements) {
               TestCommon.log(testname, "Check that the picked item is now shown in the form control...");
               assert(elements.length == 5, "Test #1f - Only 1 results was expected for picked items after dialog close");
            })
            .end()

         .findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span.alfresco-buttons-AlfButton.confirmationButton > span > span")
            .then(function(){}, function() {
               // TestCommon.log(testname,"Have we found the element? " + result);
            })
            .end()

         // Open the dialog again and check the picked items remain...
         .findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span > span > span")
            .click()
            .end()

         .findAllByCssSelector(".picked-items tr")
            .then(function(elements) {
               TestCommon.log(testname, "Check that the previously picked item was preserved...");
               assert(elements.length == 1, "Test #1g - The previously selected item was not preserved");
            })
            .end()

         // Check the remove item image exists...
         .findByCssSelector(".picked-items tr .alfresco-renderers-PublishAction > img")
            .then(
               function(){
                  TestCommon.log(testname, "Check that the remove item image is present...");
               }, function() {
                  assert(false, "Test #1h - The remove item image could not be found");
               }
            )
            .end()

         // Remove the previously selected item...
         .findByCssSelector(".picked-items tr .alfresco-renderers-PublishAction > img")
            .click()
            .end()

         // Close the dialog...
         .findByCssSelector(".alfresco-dialog-AlfDialog .footer .alfresco-buttons-AlfButton:first-child > span")
            .click()
            .end()

         // Check the item was removed...
         .findAllByCssSelector("#DOCUMENT_PICKER .alfresco-documentlibrary-views-layouts-AlfDocumentListView tr")
            .then(function(elements) {
               TestCommon.log(testname, "Check that the removed item is not shown in the form control.");
               assert(elements.length === 0, "Test #1i - The previously selected item should have been removed");
            })
            .end()

         // Open the dialog again and add some more...
         .findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span > span > span")
            .click()
            .end()

         // Select "Shared Files" option again...
         .findByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:first-child .dijitMenuItem:nth-child(5)")
            .click()
            .end()

         // Click the ADD publish action image TWICE, check that it was only added once...
         .findByCssSelector(".alfresco-documentlibrary-views-layouts-AlfDocumentListView tr:nth-child(2) .alfresco-renderers-PublishAction > img")
            .click()
            .click()
            .end()

         // Count the number of picked items (there should now be 1 DESPITE clicking twice)...
         .findAllByCssSelector(".picked-items tr")
            .then(function(elements) {
               TestCommon.log(testname, "Check an item can only be added once...");
               assert(elements.length == 1, "Test #1j - Only one results was expected for picked items");
            })
            .end()

         // Add another item...
         .findByCssSelector(".alfresco-documentlibrary-views-layouts-AlfDocumentListView tr:nth-child(3) .alfresco-renderers-PublishAction > img")
            .click()
            .end()

         .findAllByCssSelector(".picked-items tr")
            .then(function(elements) {
               TestCommon.log(testname, "Check that a second item has been added...");
               assert(elements.length == 2, "Test #1k - Two results were expected for picked items");
            })
            .end()

         // Close the dialog...
         .findByCssSelector(".alfresco-dialog-AlfDialog .footer .alfresco-buttons-AlfButton:first-child > span")
            .click()
            .end()

         // Check there are now 2 items...
         .findAllByCssSelector("#DOCUMENT_PICKER .alfresco-documentlibrary-views-layouts-AlfDocumentListView tr")
            .then(function(elements) {
               TestCommon.log(testname, "Check that the form control now shows two items...");
               assert(elements.length == 2, "Test #1l - Two items should have been picked");
            })
            .end()

         // TODO: Check all items can be removed
         // TODO: Check form values can be set and retrieved
         // TODO: Check that initial values can be set
         // TOOD: Check that folders don't have publish action images
         // TODO: Set up controls with invalid data
         // TODO: Click on a folder to get sub-results
         // TODO: Check singleItemMode works.

         .alfPostCoverageResults(browser);
      }
   });
});