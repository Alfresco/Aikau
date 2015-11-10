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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "Upload Target and History Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/UploadDashlet", "Upload Target and History Tests").end();
         },
         
         beforeEach: function() {
            browser.end();
         },
         
         "History should not be initially visible": function() {
            return browser.findById("HISTORY")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "The history widget should have been initially hidden");
               });
         },

         "Click the upload button": function() {
            // NOTE: It's not actually possible to perform the upload, so we just want to verify that the upload
            //       button produces the expected dialog
            return browser.findByCssSelector(".alfresco-upload-UploadTarget__button .alfresco-buttons-AlfButton > span")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_TO_LOCATION_DIALOG.dialogDisplayed")
            .end()

            // Check the form controls are in place as expected...
            .findById("ALF_UPLOAD_TO_LOCATION_DIALOG_FILE_SELECT")
            .end()
            
            .findById("ALF_UPLOAD_TO_LOCATION_DIALOG_CONTAINER_PICKER")
            .end()

            // Close the dialog
            .findById("ALF_UPLOAD_TO_LOCATION_DIALOG_CANCEL_label")
               .click()
            .end();
         },

         "Simulate dialog completion": function() {
            // NOTE: A button has been added to simulate a payload that might be expected to be published when the upload
            //       dialog is submitted
            return browser.findById("SIM_BUTTON_label")
               .click()
            .end()

            // Check that the upload progress dialog is displayed
            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogDisplayed")
            .end()

            // Close the dialog...
            .findById("ALF_UPLOAD_PROGRESS_DIALOG_CANCELLATION_label")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogHidden");
         },

         "Check that history is displayed": function() {
            return browser.findById("HISTORY")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The history was not displayed after a successful upload");
               })
            .end()

            .findAllByCssSelector(".alfresco-upload-UploadHistory__target")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Unexpected number of history targets were displayed");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});