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
        function(registerSuite, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "ContentService Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ContentService", "ContentService Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Delete node (basic data)": function() {
         return browser.findByCssSelector("#DELETE_CONTENT_1_label")
            .click()
         .end()
         .findByCssSelector(".dijitDialogTitle")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The confirmation dialog was not displayed");
            });
      },

      "Check dialog title (basic data)": function() {
         return browser.findByCssSelector(".dijitDialogTitle")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Confirm Delete", "The confirmation dialog title was wrong");
            });
      },

      "Count displayed items for deletion": function() {
         return browser.findAllByCssSelector(".dialog-body .alfresco-renderers-Property .value")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Unexpected number of items to delete");
            });
      },

      "Check display name for item to delete": function() {
         return browser.findByCssSelector(".dialog-body .alfresco-renderers-Property .value")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Some Node Title", "The item display name was wrong");
            });
      },

      "Confirm delete (basic data)": function() {
         return browser.findByCssSelector(".footer .alfresco-buttons-AlfButton:first-child .dijitButtonText")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_DISPLAY_NOTIFICATION", "message", "Delete successful"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find success notification");
            });
      },

      "Delete node (doclib data)": function() {
         return browser.findAllByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogHidden")
         .end()
         .findByCssSelector("#DELETE_CONTENT_2_label")
            .click()
         .end()
         .findAllByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogDisplayed")
         .end()
         .findByCssSelector(".dialog-body .alfresco-renderers-Property .value")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Some Node", "The item property name was not displayed");
            });
      },

      "Confirm delete (doclib data)": function() {
         return browser.findByCssSelector(".footer .alfresco-buttons-AlfButton:first-child .dijitButtonText")
            .click()
         .end()
         .findAllByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogHidden")
         .end()
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_DISPLAY_NOTIFICATION", "message", "Delete successful"))
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Could not find success notification");
            });
      },

      "Edit basic metadata": function() {
         return browser.findByCssSelector("#EDIT_BASIC_METADATA_label")
            .click()
         .end()
         .findAllByCssSelector("#ALF_BASIC_METADATA_DIALOG.dialogDisplayed") // Wait for dialog
         .end()
         .findByCssSelector(".alfresco-forms-controls-TextBox:nth-child(2) .dijitInputContainer input")
            .getProperty("value")
            .then(function(text) {
               assert.equal(text, "Some Node", "The node name was not set correctly");
            })
         .end()
         .findByCssSelector(".alfresco-forms-controls-TextBox:nth-child(3) .dijitInputContainer input")
            .getProperty("value")
            .then(function(text) {
               assert.equal(text, "With this title", "The node title was not set correctly");
            })
         .end()
         .findByCssSelector(".alfresco-forms-controls-TextArea:nth-child(4) .dijitTextArea")
            .getProperty("value")
            .then(function(text) {
               assert.equal(text, "And this description", "The node title was not set correctly");
            })
         .end();
      },

      "Save basic metadata": function() {
         return browser.findByCssSelector("#ALF_BASIC_METADATA_DIALOG .confirmationButton > span")
            .click()
         .end()
         .findByCssSelector("tr.mx-row:nth-child(3) .mx-url")
            .getVisibleText()
            .then(function(text) {
               assert.include(text, "aikau/proxy/alfresco/api/node/workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e/formprocessor", "Update POST did not include nodeRef");
            });
      },

      "Edit basic metadata (nodeRef only)": function() {
         return browser.findAllByCssSelector("#ALF_BASIC_METADATA_DIALOG.dialogHidden")
         .end()
         .findByCssSelector("#EDIT_BASIC_METADATA_NODEREF_ONLY_label")
            .click()
         .end()
         .findAllByCssSelector("#ALF_BASIC_METADATA_DIALOG.dialogDisplayed") // Wait for dialog
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_BASIC_METADATA_SUCCESS", "publish", "any"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Node data was not retrieved");
            });
      },

      "Check retrieved node data": function() {
         return browser.findByCssSelector(".alfresco-forms-controls-TextBox:nth-child(2) .dijitInputContainer input")
            .getProperty("value")
            .then(function(text) {
               assert.equal(text, "PDF.pdf", "The node name was not set correctly");
            })
         .end()
         .findByCssSelector("#ALF_BASIC_METADATA_DIALOG .dijitDialogTitle")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Edit Properties: PDF.pdf", "The dialog title was not set correctly");
            })
         .end()
         .findByCssSelector("#ALF_BASIC_METADATA_DIALOG .cancellationButton > span")
            .click()
         .end()
         .findAllByCssSelector("#ALF_BASIC_METADATA_DIALOG.dialogHidden");
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});