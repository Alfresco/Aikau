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
      name: "ContentService Tests",
      testPage: "/ContentService",

      "Delete node (basic data)": function() {
         return this.remote.findByCssSelector("#DELETE_CONTENT_1_label")
            .click()
         .end()

         .findByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogDisplayed .dijitDialogTitle")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The confirmation dialog was not displayed");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Confirm Deletion", "The confirmation dialog title was wrong");
            });
      },

      "Count displayed items for deletion": function() {
         return this.remote.findAllByCssSelector(".dialog-body .alfresco-renderers-Property .value")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Unexpected number of items to delete");
            });
      },

      "Check display name for item to delete": function() {
         return this.remote.findByCssSelector(".dialog-body .alfresco-renderers-Property .value")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Some Node Title", "The item display name was wrong");
            });
      },

      "Confirm delete (basic data)": function() {
         return this.remote.findByCssSelector("#ALF_DELETE_CONTENT_DIALOG .dijitButton:first-child .dijitButtonNode")
            .click()
         .end()

         .findAllByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogHidden")
         .end()

         .getLastPublish("ALF_DISPLAY_NOTIFICATION")
            .then(function(payload) {
               assert.propertyVal(payload, "message", "Delete successful", "Did not display successful delete notification");
            })
            .clearLog();
      },

      "Delete node (doclib data)": function() {
         return this.remote.findAllByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogHidden")
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
         return this.remote.findByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogDisplayed .dijitButton:first-child .dijitButtonNode")
            .click()
         .end()

         .findAllByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogHidden")
         .end()

         .getLastPublish("ALF_DISPLAY_NOTIFICATION")
            .then(function(payload) {
               assert.propertyVal(payload, "message", "Delete successful", "Did not display successful delete notification");
            });
      },

      "Edit basic metadata": function() {
         return this.remote.findByCssSelector("#EDIT_BASIC_METADATA_label")
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
            });
      },

      "Save basic metadata": function() {
         return this.remote.findByCssSelector("#ALF_BASIC_METADATA_DIALOG .confirmationButton > span")
            .click()
         .end()

         .getLastXhr("aikau/proxy/alfresco/api/node/workspace/SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e/formprocessor")
            .then(function(xhr) {
               assert.deepPropertyVal(xhr.request.body, "prop_cm_name", "Some Node");
               assert.deepPropertyVal(xhr.request.body, "prop_cm_title", "With this title");
               assert.deepPropertyVal(xhr.request.body, "prop_cm_description", "And this description");
            });
      },

      "Edit basic metadata (nodeRef only)": function() {
         return this.remote.findAllByCssSelector("#ALF_BASIC_METADATA_DIALOG.dialogHidden")
         .end()

         .findByCssSelector("#EDIT_BASIC_METADATA_NODEREF_ONLY_label")
            .click()
         .end()

         .findAllByCssSelector("#ALF_BASIC_METADATA_DIALOG.dialogDisplayed") // Wait for dialog
         .end()

         .getLastPublish("ALF_BASIC_METADATA_SUCCESS", "Did not publish basic metadata success");
      },

      "Check retrieved node data": function() {
         return this.remote.findByCssSelector(".alfresco-forms-controls-TextBox:nth-child(2) .dijitInputContainer input")
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

      "Upload file dialog submit button should be disabled": function() {
         // See AKU-666
         return this.remote.findById("UPLOAD_NEW_FILE_label")
            .click()
         .end()

         .findAllByCssSelector("#ALF_UPLOAD_DIALOG.dialogDisplayed") // Wait for dialog
         .end()

         // This line is essentially the test now, make sure the confirmation button is disabled
         // because no files are selected...
         .findByCssSelector("#ALF_UPLOAD_DIALOG .confirmationButton.dijitDisabled")
         .end()

         .findById("ALF_UPLOAD_DIALOG_CANCEL_label")
            .click()
         .end()

         .findAllByCssSelector("#ALF_UPLOAD_DIALOG.dialogHidden"); // Wait for dialog to close
      },

      "Upload new version dialog submit button should be disabled": function() {
         // See AKU-666
         return this.remote.findById("UPDATE_FILE_label")
            .click()
         .end()

         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogDisplayed") // Wait for dialog
         .end()

         .findByCssSelector("#ALF_UPLOAD_DIALOG .confirmationButton.dijitDisabled")
         .end()

         .findById("ALF_UPLOAD_DIALOG_CANCEL")
            .click()
         .end()

         .findByCssSelector("#ALF_UPLOAD_DIALOG.dialogHidden");
      },

      "Create new content strips framework attributes from POST body": function() {
         return this.remote.findById("CREATE_CONTENT_label")
            .click()
         .end()

         .getLastXhr("cm:folder/formprocessor")
            .then(function(xhrEntry) {
               assert.notDeepProperty(xhrEntry, "request.body.alfPublishScope");
               assert.notDeepProperty(xhrEntry, "request.body.alfTopic");
               assert.notDeepProperty(xhrEntry, "request.body.type");
               assert.notDeepProperty(xhrEntry, "request.body.currentNode");
            });
      },

      "Create new content scopes the success response correctly": function() {
         return this.remote.findById("CREATE_CONTENT_SCOPED_label")
            .clearLog()
            .click()
         .end()

         .getLastPublish("SCOPED_ALF_DOCLIST_RELOAD_DATA", true);
      },

      // See AKU-1162
      "Check footer position when deleting lots of content": function() {
         var footerVPos;
         return this.remote.findByCssSelector("#DELETE_CONTENT_3_label")
            .click()
         .end()

         .findDisplayedByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogDisplayed")
            
            .findDisplayedByCssSelector(".footer")
               .getPosition()
               .then(function(footerPosition) {
                  footerVPos = footerPosition.y;
               })
            .end()

            .findDisplayedByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-child(6)")
               .getPosition()
                  .then(function(rowPosition) {
                     assert.isAbove(footerVPos, rowPosition.y);
                  });
      }
   });
});