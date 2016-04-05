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
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Table And Form Dialog Tests",
      testPage: "/TableAndFormDialog",

      // To get an entry in the table to click: "#TABLE_VIEW_ITEMS tr:nth-child(1) td:nth-child(2) span.inner"
      // To get the value of an entry in the table to click: "#TABLE_VIEW_ITEMS tr:nth-child(1) td:nth-child(2) span.inner span.value"

      "Test that no dialogs exist when page first loads": function() {
         return this.remote.findAllByCssSelector(".alfresco-dialog-AlfDialog")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Check there are no dialogs at page load");
            });
      },

      "Test that the first row in the initial table is correct": function() {
         // Check the initial values...
         return this.remote.findByCssSelector("#TABLE_VIEW_ITEMS tr:nth-child(1) td:nth-child(2) span.inner span.value")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "ID1", "First row of data has wrong id");
            });
      },

      "Test that second row in the initial table is correct": function() {
         return this.remote.findByCssSelector("#TABLE_VIEW_ITEMS tr:nth-child(2) td:nth-child(2) span.inner span.value")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "ID2", "Second row of data has wrong id");
            });
      },

      "Test that clicking item opens dialog": function() {
         // Click on the ID in the first row to open the dialog...
         return this.remote.findByCssSelector("#TABLE_VIEW_ITEMS tr:nth-child(1) td:nth-child(2) span.inner")
            .click()
            .end()

         // Check that only 1 dialog exists (e.g. that any previous dialogs have been destroyed)...
         .findAllByCssSelector(".alfresco-dialog-AlfDialog")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "More than one dialog was found");
            });
      },

      "Test that dialog title is set from clicked item": function() {
         return this.remote.findByCssSelector(".alfresco-dialog-AlfDialog .dijitDialogTitleBar .dijitDialogTitle")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "ID1", "The dialog did not have the expected title");
            });
      },

      "Test form control count": function() {
         return this.remote.findAllByCssSelector(".dialog-body form div.alfresco-forms-controls-BaseFormControl")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Unexpected number of form controls in the dialog");
            });
      },

      "Test the value of the ID form field": function() {
         return this.remote.findByCssSelector(".dialog-body form > .alfresco-layout-HorizontalWidgets:nth-child(1) .horizontal-widget:nth-child(1) div.alfresco-forms-controls-BaseFormControl .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "ID1", "The ID form field was not set correctly");
            });
      },

      "Test the value of the name form field": function() {
         return this.remote.findByCssSelector(".dialog-body form > .alfresco-layout-HorizontalWidgets:nth-child(1) .horizontal-widget:nth-child(2) div.alfresco-forms-controls-BaseFormControl .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "Test1", "The name form field was not set correctly");
            });
      },

      "Test that option form field was set correctly": function() {
         return this.remote.findByCssSelector(".dialog-body form > .alfresco-layout-HorizontalWidgets:nth-child(2) .horizontal-widget:nth-child(1) div.alfresco-forms-controls-BaseFormControl span[role=option]")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "One", "The option form field was not set correctly");
            });
      },

      "Test posting a changed value": function() {
         // Update the first text field...
         return this.remote.findByCssSelector(".dialog-body form > .alfresco-layout-HorizontalWidgets:nth-child(1) .horizontal-widget:nth-child(1) div.alfresco-forms-controls-BaseFormControl .dijitInputContainer input")
            .clearValue()
            .type("Updated_ID1")
            .end()

         // Post the form...
         .findByCssSelector(".alfresco-dialog-AlfDialog .footer .alfresco-buttons-AlfButton:nth-child(1) .dijitButtonText")
            .click()
            .end()

         .getLastPublish("ALF_CRUD_UPDATE")
            .then(function(payload) {
               assert.propertyVal(payload, "id", "Updated_ID1", "ID was not updated");
            });
      }
   });
});