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
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

   registerSuite({
      name: 'FormButtonDialog Test',
      'alfresco/forms/controls/FormButtonDialogTest': function () {

         var browser = this.remote;
         var testname = "FormButtonDialogTest";
         var startPos;
         return TestCommon.loadTestWebScript(this.remote, "/FormButtonDialog", testname)

         // Does the form exist?
         .findByCssSelector("DIV#TEST_FORM > FORM")
            .then(function(el1) {
               TestCommon.log(testname, "Find the form...");
               expect(el1).to.be.an("object", "The Form could not be found");
            })
            .end()
         
         // Does the dialog opening button exist?
         .findById("TEST_DIALOG_BUTTON")
            .then(function(el2) {
               TestCommon.log(testname, "Find the button to open the dialog...");
               expect(el2).to.be.an("object", "The Button could not be found");
            })
            .end()

         // Click the dialog button - does the dialog appear?
         .findById("TEST_DIALOG_BUTTON")
            .click()
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog")
            .then(null, function() {
               TestCommon.log(testname, "Find the dialog...");
               assert(false, "The Dialog did not appear");
            })
            .end()

         // Does the dialog have an appropriate title?
         .findByCssSelector("span.dijitDialogTitle")
            .getVisibleText()
            .then(function(resultText1) {
               TestCommon.log(testname, "Find the title text...");
               expect(resultText1).to.equal("Twas brillig and the slithy toves...", "The Dialog title text is incorrect");
            })
            .end()

         // Does the dialog have a couple of buttons?
         .findAllByCssSelector("div.alfresco-dialog-AlfDialog div.footer > span.alfresco-buttons-AlfButton")
            .then(function (buttons) {
               TestCommon.log(testname, "Count the buttons...");
               expect(buttons).to.have.length(2, "The popup Dialog does not contain 2 buttons");
            })
            .end()

         // Does the cancel button exist?
         .findByCssSelector("span.alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation")
            .then(null, function() {
               TestCommon.log(testname, "Find the cancel button...");
               assert(false, "The Dialog cancel button cannot be found");
            })
            .end()

         // Is the button copy correct?
         .findByCssSelector("span.alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.confirmation span.dijitButtonText")
            .getVisibleText()
            .then(function (resultText2) {
               TestCommon.log(testname, "Check the custom OK button label...");
               expect(resultText2).to.equal("Ok friend", "The copy on Dialog button one was incorrect");
            })
            .end()

         .findByCssSelector("span.alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation span.dijitButtonText")
            .getVisibleText()
            .then(function (resultText3) {
               TestCommon.log(testname, "Check the custom cancel button label...");
               expect(resultText3).to.equal("No thanks buddy", "The copy on Dialog button two was incorrect");
            })
            .end()

         // Does the checkbox exist?
         .findByCssSelector("div#TEST_CHECKBOX_CONTAINER > div.control-row > div.control input")
            .then(function (el3) {
               TestCommon.log(testname, "Find the checkbox...");
               expect(el3).to.be.an("object", "The Checkbox could not be found");
            })
            .end()

         // Is the checkbox checked?
         .findByCssSelector("div#TEST_CHECKBOX_CONTAINER > div.control-row > div.control input")
            .isSelected()
            .then(function (result3) {
               TestCommon.log(testname, "Check the initial state of the checkbox...");
               expect(result3).to.equal(false, "The Checkbox should not be selected when the Dialog form is first loaded");
            })
            .end()

         // Click the checkbox
         .findByCssSelector("div#TEST_CHECKBOX_CONTAINER > div.control-row > div.control input")
            .click()
            .end()

         // Now is the checkbox checked?
         .findByCssSelector("div#TEST_CHECKBOX_CONTAINER > div.control-row > div.control input")
            .isSelected()
            .then(function (result4) {
               TestCommon.log(testname, "Confirm that the checkbox is now checked...");
               expect(result4).to.equal(true, "The Checkbox should now be selected");
            })
            .end()

         // Click the cancel button
         .findByCssSelector("span.alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation span")
            .click()
            .sleep(500)
            .end()

         // Has the dialog disappeared?
         .findAllByCssSelector(".alfresco-dialog-AlfDialog")
            .then(function(elements) {
               // TODO: When dialogs are properly cleaned up, this should be a test for zero...
               TestCommon.log(testname, "Count the dialogs after closing...");
               assert(elements.length === 1, "The Dialog was found but should be hidden after the cancel button has been clicked");
            })
            .end()

         // TODO: This test can be removed once the dialog is cleaned up properly.
         .findByCssSelector(".alfresco-dialog-AlfDialog")
            .isDisplayed()
            .then(function(result) {
               TestCommon.log(testname, "Check the dialog isn't displayed...");
               assert(result === false, "The dialog should have been hidden");
            })
            .end()

         // Submit the main form
         .findByCssSelector("span.alfresco-buttons-AlfButton.confirmationButton > span")
            .click()
            .sleep(500)
            .end()

         // Check the correct pub/sub form submission element has appeared
         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "TEST_FORM_SUBMITTED"))
            .then(null, function() {
               TestCommon.log(testname, "Check the form has been submitted...");
               assert(false, "Form submission did not proceed as expected and the expected publish on 'TEST_FORM_SUBMITTED' was missing");
            })
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});