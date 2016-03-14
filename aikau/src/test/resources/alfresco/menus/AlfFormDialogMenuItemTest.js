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
 * This is the unit test for the alfresco/menus/AlfFormDialogMenuItem widget.
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, require, TestCommon) {

   defineSuite(module, {
      name: "Form Dialog Menu Tests",
      testPage: "/AlfFormDialogMenuItem",

      "Test that service subscription is created": function() {
         return this.remote.findAllByCssSelector(TestCommon.topicSelector("ALF_CREATE_FORM_DIALOG_REQUEST", "subscribe", "any"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "A subscription from the alfresco/services/DialogService should have been setup");
            });
      },

      "Test that dialog can be created": function() {
         return this.remote.findByCssSelector("#DROP_DOWN_MENU_text")
            .click()
            .end()

         .findByCssSelector("#FDM1_text")
            .click()
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog")
            .then(null, function() {
               assert(false, "The dialog was not created");
            });
      },

      "Test that dialog has correct title": function() {
         return this.remote.findByCssSelector(".alfresco-dialog-AlfDialog .dijitDialogTitle")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "New Dialog", "The dialog title was not set correctly");
            });
      },

      "Test that form control is displayed": function() {
         return this.remote.findByCssSelector(".alfresco-forms-controls-BaseFormControl")
            .then(null, function() {
               assert(false, "The form control was not displayed");
            });
      },

      "Test that confirmation button is displayed": function() {
         return this.remote.findByCssSelector(".alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.confirmation")
            .then(null, function() {
               assert(false, "The confirmation button is missing");
            });
      },

      "Test that confirmation button label is correct": function() {
         return this.remote.findByCssSelector(".alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.confirmation")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Save", "The confirmation button text is wrong");
            });
      },

      "Test that cancellation button is displayed": function() {
         return this.remote.findByCssSelector(".alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation")
            .then(null, function() {
               assert(false, "The cancellation button is missing");
            });
      },

      "Test that cancellation button label is correct": function() {
         return this.remote.findByCssSelector(".alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Close", "The cancellation button text is wrong");
            });
      },

      "Test that publication is made on confirmation": function() {
         return this.remote.findByCssSelector(".alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.confirmation span.dijitButtonText")
            .click()
            .sleep(250)
            .end()

         .findByCssSelector(TestCommon.topicSelector("FORM_SUBMIT", "publish"))
            .then(null, function() {
               assert(false, "Form didn't publish");
            });
      },

      "Test that dialog can be recreated": function() {
         return this.remote.findByCssSelector("#DROP_DOWN_MENU_text")
            .click()
            .end()

         .findByCssSelector("#FDM1_text")
            .click()
            .sleep(250)
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog")
            .then(null, function() {
               assert(false, "The dialog was not recreated");
            });
      },

      "Test that dialog cancellation closes the dialog": function() {
         return this.remote.findByCssSelector(".alfresco-buttons-AlfButton.alfresco-dialogs-_AlfCreateFormDialogMixin.cancellation span.dijitButtonText")
            .click()
            .sleep(250)
            .end()

         .findByCssSelector(TestCommon.nthTopicSelector("last"))
            .getVisibleText()
            .then(function(text) {
               assert(text.lastIndexOf("ALF_CLOSE_DIALOG") !== -1, "A request to close the form was not published");
            });
      }
   });
});