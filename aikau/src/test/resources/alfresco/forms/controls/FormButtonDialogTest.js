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
 * @author Richard Smith
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

   var browser = this.remote;
   registerSuite({
      name: 'FormButtonDialog Test',
      'Test Form Exists': function () {
         var testname = "FormButtonDialogTest";
         return TestCommon.loadTestWebScript(this.remote, "/FormButtonDialog", testname).findByCssSelector("DIV#TEST_FORM > FORM")
            .then(function(el1) {
               expect(el1).to.be.an("object", "The Form could not be found");
            })
         .end();
      },
      'Test Dialog Opening Button Exists': function() {
         this.remote.findById("TEST_DIALOG_BUTTON")
            .then(function(el2) {
               expect(el2).to.be.an("object", "The Button could not be found");
            })
         .end();
      },
      'Test dialog opens on button click': function() {
         this.remote.findById("TEST_DIALOG_BUTTON")
            .click()
         .end()
         .findByCssSelector(".alfresco-dialog-AlfDialog")
            .then(null, function() {
               assert(false, "The Dialog did not appear");
            })
         .end();
      },
      'Test dialog title is correct': function() {
         this.remote.findByCssSelector("span.dijitDialogTitle")
            .getVisibleText()
            .then(function(resultText1) {
               expect(resultText1).to.equal("Twas brillig and the slithy toves...", "The Dialog title text is incorrect");
            })
         .end();
      },
      'Test dialog button count': function() {
         this.remote.findAllByCssSelector("div.alfresco-dialog-AlfDialog div.footer > span.alfresco-buttons-AlfButton")
            .then(function (buttons) {
               expect(buttons).to.have.length(2, "The popup Dialog does not contain 2 buttons");
            })
            .end();
      },
      'Test dialog cancellation button exists': function() {
         this.remote.findByCssSelector("span.alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation")
            .then(null, function() {
               assert(false, "The Dialog cancel button cannot be found");
            })
         .end();
      },
      'Test dialog confirmation button label': function() {
         this.remote.findByCssSelector("span.alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.confirmation span.dijitButtonText")
            .getVisibleText()
            .then(function (resultText2) {
               expect(resultText2).to.equal("Ok friend", "The copy on Dialog button one was incorrect");
            })
         .end();
      },
      'Test dialog cancellation button label': function() {
         this.remote.findByCssSelector("span.alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation span.dijitButtonText")
            .getVisibleText()
            .then(function (resultText3) {
               expect(resultText3).to.equal("No thanks buddy", "The copy on Dialog button two was incorrect");
            })
         .end();
      },
      'Test check box exists in dialog': function() {
         this.remote.findByCssSelector("div#TEST_CHECKBOX_CONTAINER > div.control-row > div.control input")
            .then(function (el3) {
               expect(el3).to.be.an("object", "The Checkbox could not be found");
            })
         .end();
      },
      'Test check box is NOT checked': function() {
         this.remote.findByCssSelector("div#TEST_CHECKBOX_CONTAINER > div.control-row > div.control input")
            .isSelected()
            .then(function (result3) {
               expect(result3).to.equal(false, "The Checkbox should not be selected when the Dialog form is first loaded");
            })
         .end();
      },
      'Test check box can be checked': function() {
         this.remote.findByCssSelector("div#TEST_CHECKBOX_CONTAINER > div.control-row > div.control input")
            .click()
         .end()
         .findByCssSelector("div#TEST_CHECKBOX_CONTAINER > div.control-row > div.control input")
            .isSelected()
            .then(function (result4) {
               expect(result4).to.equal(true, "The Checkbox should now be selected");
            })
         .end();
      },
      'Test cancel button does not destroy dialog': function() {
         this.remote.findByCssSelector("span.alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation span")
            .click()
            .sleep(500)
         .end()
         .findAllByCssSelector(".alfresco-dialog-AlfDialog")
            .then(function(elements) {
               // TODO: When dialogs are properly cleaned up, this should be a test for zero...
               assert(elements.length === 1, "The Dialog was found but should be hidden after the cancel button has been clicked");
            })
         .end();
      },
      'Test cancel button hides dialog': function() {
         this.remote.findByCssSelector(".alfresco-dialog-AlfDialog")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "The dialog should have been hidden");
            })
         .end();
      },
      'Test form submission': function() {
         this.remote.findByCssSelector("span.alfresco-buttons-AlfButton.confirmationButton > span")
            .click()
            .sleep(500)
         .end()
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