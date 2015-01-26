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
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

   registerSuite({
      name: 'Table And Form Dialog Test',
      'TableAndFormDialog': function () {

         var browser = this.remote;
         var testname = "Table and Form Dialog Test";
         return TestCommon.loadTestWebScript(this.remote, "/TableAndFormDialog", testname)

         // To get an entry in the table to click: "#TABLE_VIEW_ITEMS tr:nth-child(1) td:nth-child(2) span.inner"
         // To get the value of an entry in the table to click: "#TABLE_VIEW_ITEMS tr:nth-child(1) td:nth-child(2) span.inner span.value"

         .findAllByCssSelector(".alfresco-dialog-AlfDialog")
            .then(function(elements) {
               assert(elements.length === 0, "Test #0a - Check there are no dialogs at page load");
            })
            .end()

         // Check the initial values...
         .findByCssSelector("#TABLE_VIEW_ITEMS tr:nth-child(1) td:nth-child(2) span.inner span.value")
            .getVisibleText()
            .then(function(resultText) {
                  assert(resultText == "ID1", "Test #1a - First row of data has wrong id" + resultText);
               })
            .end()
         .findByCssSelector("#TABLE_VIEW_ITEMS tr:nth-child(2) td:nth-child(2) span.inner span.value")
            .getVisibleText()
            .then(function(resultText) {
                  assert(resultText == "ID2", "Test #1b - Second row of data has wrong id" + resultText);
               })
            .end()

         // Click on the ID in the first row to open the dialog...
         .findByCssSelector("#TABLE_VIEW_ITEMS tr:nth-child(1) td:nth-child(2) span.inner")
            .click()
            .end()

         // Check that only 1 dialog exists (e.g. that any previous dialogs have been destroyed)...
         .findAllByCssSelector(".alfresco-dialog-AlfDialog")
            .then(function(elements) {
               assert(elements.length == 1, "Test #2a - More than one dialog was found");
            })
            .end()

         // Check the dialog title has been set from the selected item...
         .findByCssSelector(".alfresco-dialog-AlfDialog .dijitDialogTitleBar .dijitDialogTitle")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "ID1", "Test #2b - The dialog did not have the expected title");
            })
            .end()

         // Count the form controls...
         .findAllByCssSelector(".dialog-body form div.alfresco-forms-controls-BaseFormControl")
            .then(function(elements) {
               assert(elements.length == 3, "Test #2c - Unexpected number of form controls in the dialog: " + elements.length);
            })
            .end()

         // Check the values of the controls...
         .findByCssSelector(".dialog-body form > .alfresco-layout-HorizontalWidgets:nth-child(1) .horizontal-widget:nth-child(1) div.alfresco-forms-controls-BaseFormControl .dijitInputContainer input")
            .getProperty('value')
            .then(function(resultText) {
               assert(resultText == "ID1", "Test #3a - The ID form field was not set correctly: " + resultText);
            })
            .end()
         .findByCssSelector(".dialog-body form > .alfresco-layout-HorizontalWidgets:nth-child(1) .horizontal-widget:nth-child(2) div.alfresco-forms-controls-BaseFormControl .dijitInputContainer input")
            .getProperty('value')
            .then(function(resultText) {
               assert(resultText == "Test1", "Test #3b - The name form field was not set correctly: " + resultText);
            })
            .end()
         .findByCssSelector(".dialog-body form > .alfresco-layout-HorizontalWidgets:nth-child(2) .horizontal-widget:nth-child(1) div.alfresco-forms-controls-BaseFormControl span[role=option]")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "One", "Test #3c - The option form field was not set correctly: " + resultText);
            })
            .end()

         // Update the first text field...
         .findByCssSelector(".dialog-body form > .alfresco-layout-HorizontalWidgets:nth-child(1) .horizontal-widget:nth-child(1) div.alfresco-forms-controls-BaseFormControl .dijitInputContainer input")
            .clearValue()
            .type("Updated_ID1")
            .end()

         // Post the form...
         .findByCssSelector(".alfresco-dialog-AlfDialog .footer .alfresco-buttons-AlfButton:nth-child(1) .dijitButtonText")
            .click()
            .end()

         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_CRUD_UPDATE", "id", "Updated_ID1"))
            .then(function(elements) {
               assert(elements.length == 1, "Test #4a - ID was not updated");
            })
            .end()

            
         .alfPostCoverageResults(browser);
      }
   });
});