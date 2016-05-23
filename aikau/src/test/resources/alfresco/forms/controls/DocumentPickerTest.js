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
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Document Picker Test",
      testPage: "/DocumentPicker",

      "Test picker dialog can be displayed": function() {
         return this.remote.findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span > span > span")
            .click()
            .end()
            .findByCssSelector(".alfresco-pickers-Picker")
            .then(
               function() {},
               function() {
                  assert(false, "The dialog has NOT opened with the picker");
               }
            );
      },

      "Test Shared Files sub-picker is shown": function() {
         // Select "Shared Files" (the results for this are mocked)
         return this.remote.findByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:first-child .dijitMenuItem:nth-child(5)")
            .click()
            .end()
            .findByCssSelector(".alfresco-lists-views-AlfListView")
            .then(
               function() {},
               function() {
                  assert(false, "The Shared Files click did not yield any results");
               }
            );
      },

      "Test Shared files result count": function() {
         // Count the mocked results...
         return this.remote.findAllByCssSelector(".alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "4 results expected for Shared Files");
            });
      },

      "Test first item in picker can be added": function() {
         // Check the first item has an ADD publish action image...
         return this.remote.findByCssSelector(".alfresco-lists-views-AlfListView tr:nth-child(1) .alfresco-renderers-PublishAction > img")
            .then(
               function() {},
               function() {
                  assert(false, "The first shared files item did not have an ADD publish action image");
               }
            );
      },

      "Test item gets picked": function() {
         // Click the ADD publish action image to add the item to the picked items...
         return this.remote.findByCssSelector(".alfresco-lists-views-AlfListView tr:nth-child(1) .alfresco-renderers-PublishAction > img")
            .click()
            .end()
            // Count the number of picked items (there should now be 1)...
            // TODO: Could probably check that there were none picked when the dialog was first opened...
            .findAllByCssSelector(".picked-items tr")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Only one result was expected for picked items");
            });
      },

      "Test picked items are reflected when closing dialog": function() {
         // Close the dialog...
         return this.remote.findByCssSelector(".alfresco-dialog-AlfDialog .footer .alfresco-buttons-AlfButton:first-child > span")
            .click()
            .sleep(500)
            .end()
            // Count the selected items...
            .findAllByCssSelector("#DOCUMENT_PICKER .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Only 1 results was expected for picked items after dialog close");
            });
      },

      "Test picked items are retained": function() {
         return this.remote.findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span.alfresco-buttons-AlfButton.confirmationButton > span > span")
            .then(function() {}, function() {})
            .end()
            // Open the dialog again and check the picked items remain...
            .findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span > span > span")
            .click()
            .end()
            .findAllByCssSelector(".picked-items tr")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The previously selected item was not preserved");
            });
      },

      "Test previously picked item can be removed": function() {
         // Check the remove item image exists...
         return this.remote.findByCssSelector(".picked-items tr .alfresco-renderers-PublishAction > img")
            .then(
               function() {},
               function() {
                  assert(false, "The remove item image could not be found");
               }
            );
      },

      "Test previously picked item gets removed": function() {
         // Remove the previously selected item...
         return this.remote.findByCssSelector(".picked-items tr .alfresco-renderers-PublishAction > img")
            .click()
            .end()
            // Close the dialog...
            .findByCssSelector(".alfresco-dialog-AlfDialog .footer .alfresco-buttons-AlfButton:first-child > span")
            .click()
            .end()
            // Check the item was removed...
            .findAllByCssSelector("#DOCUMENT_PICKER .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The previously selected item should have been removed");
            });
      },

      "Test an item can be only picked once": function() {
         // Open the dialog again and add some more...
         return this.remote.findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span > span > span")
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
               assert.lengthOf(elements, 1, "Only one result was expected for picked items");
            });
      },

      "Test picking another item": function() {
         // Add another item...
         return this.remote.findByCssSelector(".alfresco-lists-views-AlfListView tr:nth-child(3) .alfresco-renderers-PublishAction > img")
            .click()
            .end()
            .findAllByCssSelector(".picked-items tr")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Two results were expected for picked items");
            });
      },

      "Test both items are shown as picked when dialog closed": function() {
         // Close the dialog...
         return this.remote.findByCssSelector(".alfresco-dialog-AlfDialog .footer .alfresco-buttons-AlfButton:first-child > span")
            .click()
            .end()
            // Check there are now 2 items...
            .findAllByCssSelector("#DOCUMENT_PICKER .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Two items should have been picked");
            });
      }
   });

   defineSuite(module, {
      name: "Document Picker Test (Sites)",
      testPage: "/DocumentPicker",

      "Check site items are displayed": function() {
         return this.remote.findByCssSelector("#DOCUMENT_PICKER .alfresco-layout-VerticalWidgets > span > span > span")
            .click()
         .end()

         .findDisplayedByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:first-child .dijitMenuItem:nth-child(1)")
            .click()
         .end()

         .findDisplayedByCssSelector(".alfresco-pickers-SingleItemPicker .alfresco-menus-_AlfMenuItemMixin:nth-child(1) .alf-menu-bar-label-node")
            .click()
         .end()

         .findDisplayedByCssSelector(".alfresco-dialog-AlfDialog .alfresco-lists-views-AlfListView tr")
         .end()

         .findAllByCssSelector(".alfresco-dialog-AlfDialog .alfresco-lists-views-AlfListView tr")
            .then(function(elements) {
               assert.lengthOf(elements, 4);
            });
      }
   });
});