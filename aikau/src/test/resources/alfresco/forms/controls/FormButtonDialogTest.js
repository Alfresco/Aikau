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

registerSuite(function(){
   var browser;

   return {
      name: "FormButtonDialog Test",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/FormButtonDialog", "FormButtonDialog").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end().alfPostCoverageResults(browser);
      // },
      
      "Test Form Exists": function () {
         return browser.findByCssSelector("DIV#TEST_FORM > FORM")
            .then(function(el1) {
               expect(el1).to.be.an("object", "The Form could not be found");
            });
      },

      "Test Dialog Opening Button Exists": function() {
         return browser.findById("TEST_DIALOG_BUTTON")
            .then(function(el2) {
               expect(el2).to.be.an("object", "The Button could not be found");
            });
      },

      "Test dialog opens on button click": function() {
         return browser.findById("TEST_DIALOG_BUTTON")
            .click()
         .end()
         .findByCssSelector(".alfresco-dialog-AlfDialog")
            .then(null, function() {
               assert(false, "The Dialog did not appear");
            });
      },

      "Test dialog title is correct": function() {
         return browser.findByCssSelector("span.dijitDialogTitle")
            .getVisibleText()
            .then(function(resultText1) {
               expect(resultText1).to.equal("Twas brillig and the slithy toves...", "The Dialog title text is incorrect");
            });
      },

      "Test dialog button count": function() {
         return browser.findAllByCssSelector("div.alfresco-dialog-AlfDialog div.footer > span.alfresco-buttons-AlfButton")
            .then(function (buttons) {
               expect(buttons).to.have.length(2, "The popup Dialog does not contain 2 buttons");
            });
      },

      "Test dialog cancellation button exists": function() {
         return browser.findByCssSelector("span.alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation")
            .then(null, function() {
               assert(false, "The Dialog cancel button cannot be found");
            });
      },

      "Test dialog confirmation button label": function() {
         return browser.findByCssSelector("span.alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.confirmation span.dijitButtonText")
            .getVisibleText()
            .then(function (resultText2) {
               expect(resultText2).to.equal("Ok friend", "The copy on Dialog button one was incorrect");
            });
      },

      "Test dialog cancellation button label": function() {
         return browser.findByCssSelector("span.alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation span.dijitButtonText")
            .getVisibleText()
            .then(function (resultText3) {
               expect(resultText3).to.equal("No thanks buddy", "The copy on Dialog button two was incorrect");
            });
      },

      "Test check box exists in dialog": function() {
         return browser.findByCssSelector("div#TEST_CHECKBOX_CONTAINER > div.control-row > div.control input")
            .then(function (el3) {
               expect(el3).to.be.an("object", "The Checkbox could not be found");
            });
      },

      "Test check box is NOT checked": function() {
         return browser.findByCssSelector("div#TEST_CHECKBOX_CONTAINER > div.control-row > div.control input")
            .isSelected()
            .then(function (result3) {
               expect(result3).to.equal(false, "The Checkbox should not be selected when the Dialog form is first loaded");
            });
      },

      "Test check box can be checked": function() {
         return browser.findByCssSelector("div#TEST_CHECKBOX_CONTAINER > div.control-row > div.control input")
            .click()
         .end()
         .findByCssSelector("div#TEST_CHECKBOX_CONTAINER > div.control-row > div.control input")
            .isSelected()
            .then(function (result4) {
               expect(result4).to.equal(true, "The Checkbox should now be selected");
            });
      },

      "Test cancel button does not destroy dialog": function() {
         return browser.findByCssSelector("span.alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation span")
            .click()
            .sleep(500)
         .end()
         .findAllByCssSelector(".alfresco-dialog-AlfDialog")
            .then(function(elements) {
               // TODO: When dialogs are properly cleaned up, this should be a test for zero...
               assert(elements.length === 1, "The Dialog was found but should be hidden after the cancel button has been clicked");
            });
      },

      "Test cancel button hides dialog": function() {
         return browser.findByCssSelector(".alfresco-dialog-AlfDialog")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "The dialog should have been hidden");
            });
      },
      
      "Test form submission": function() {
         return browser.findByCssSelector("span.alfresco-buttons-AlfButton.confirmationButton > span")
            .click()
            .sleep(500)
         .end()
         .findByCssSelector(TestCommon.pubSubDataCssSelector("last", "alfTopic", "TEST_FORM_SUBMITTED"))
            .then(null, function() {
               assert(false, "Form submission did not proceed as expected and the expected publish on 'TEST_FORM_SUBMITTED' was missing");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});