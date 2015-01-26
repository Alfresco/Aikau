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
 * This is the unit test for the alfresco/menus/AlfFormDialogMenuItem widget.
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
      name: 'AlfFormDialogMenuItem Test',
      'alfresco/menus/AlfFormDialogMenuItem': function () {

         var browser = this.remote;
         var testName = "Form Dialog Menu Item Test";
         return TestCommon.loadTestWebScript(this.remote, "/AlfFormDialogMenuItem", testName)

         // Test #1
         // Check the service subscription is setup
         .findAllByCssSelector(TestCommon.topicSelector("ALF_CREATE_FORM_DIALOG_REQUEST", "subscribe", "any"))
            .then(function(elements) {
               TestCommon.log(testName,"Check that a subscription has been setup");
               assert(elements.length === 1, "Test #1a - A subscription from the alfresco/dialogs/AlfDialogService should have been setup");
            })
         .end()

         // Test #2
         // Create the dialog...
         .findByCssSelector("#DROP_DOWN_MENU_text")
            .click()
         .end()

         .findByCssSelector("#FDM1_text")
            .click()
         .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog")
            .then(null, function() {
               assert(false, "Test #2a - The dialog was not created");
            })
         .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog .dijitDialogTitle")
            .getVisibleText()
            .then(function(text) {
               assert(text == "New Dialog", "Test #2b - The dialog title was not set correctly");
            })
         .end()

         .findByCssSelector(".alfresco-forms-controls-BaseFormControl")
            .then(null, function() {
               assert(false, "Test #2c - The form control was not displayed");
            })
         .end()

         .findByCssSelector(".alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.confirmation")
            .then(null, function() {
               assert(false, "Test #2d - The confirmation button is missing");
            })
         .end()

         .findByCssSelector(".alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.confirmation")
            .getVisibleText()
            .then(function(text) {
               assert(text == "Save", "Test #2e - The confirmation button text is wrong: " + text);
            })
         .end()

         .findByCssSelector(".alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation")
            .then(null, function() {
               assert(false, "Test #2f - The cancellation button is missing");
            })
         .end()

         .findByCssSelector(".alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation")
            .getVisibleText()
            .then(function(text) {
               assert(text == "Close", "Test #2g - The cancellation button text is wrong: " + text);
            })
         .end()

         // Test #3
         // Check publication occurs (don't check details - that's for another test)
         .findByCssSelector(".alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.confirmation span.dijitButtonText")
            .click()
            .sleep(250)
         .end()

         .findByCssSelector(TestCommon.topicSelector("FORM_SUBMIT", "publish"))
            .then(null, function() {
               assert(false, "Test #3a - Form didn't publish");
            })
         .end()
            
         // Test #4
         // Close the dialog...
         .findByCssSelector("#DROP_DOWN_MENU_text")
            .click()
         .end()

         .findByCssSelector("#FDM1_text")
            .click()
            .sleep(250)
         .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog")
            .then(null, function() {
               assert(false, "Test #4a - The dialog was not created");
            })
         .end()

         .findByCssSelector(".alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation span.dijitButtonText")
            .click()
            .sleep(250)
            .end()

         .findByCssSelector(TestCommon.nthTopicSelector("last"))
            .getVisibleText()
            .then(function(text) {
               assert(text.lastIndexOf("ALF_CLOSE_DIALOG") != -1, "Test #4b - A request to close the form was not published");
            })
         .end()

         .alfPostCoverageResults(browser);
      }
   });
});