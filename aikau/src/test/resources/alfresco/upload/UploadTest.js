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
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   var uploadsSelector = ".alfresco-dialog-AlfDialog .alfresco-upload-AlfUploadDisplay .uploads";
   var successfulUploadsSelector = uploadsSelector + "> .successful table tr";
   var failedUploadsSelector = uploadsSelector + " > .failed table tr";
   var aggProgStatusSelector = uploadsSelector + " .aggregate-progress .percentage";

   registerSuite(function(){
      var browser;

      return {
         name: "Upload Failure Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/aikau-upload-failure-unit-test", "Upload Failure").end();
         },
         
         beforeEach: function() {
            browser.end();
         },
         
         "Upload Failure": function () {
            // Simulate providing a zero byte file and check the output...
            return browser.findById("SINGLE_UPLOAD_label")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogDisplayed")
            .end()

            .findAllByCssSelector(failedUploadsSelector)
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Wrong number of failed uploads");
               })
            .end()

            .findByCssSelector(".dialogDisplayed .footer .dijitButtonNode")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogHidden");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "Upload Tests",
         
         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/aikau-upload-unit-test", "Upload").end();
         },
         
         beforeEach: function() {
            browser.end();
         },

         "Test bad file data": function () {
            // Simulate providing a zero byte file and check the output...
            return browser.findById("BAD_FILE_DATA_label")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogDisplayed")
            .end()

            .findAllByCssSelector(failedUploadsSelector)
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Wrong number of failed uploads");
               })
            .end()

            .findByCssSelector(".dialogDisplayed .footer .dijitButtonNode")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogHidden");
         },
         
         "Test single file upload (no failures)": function () {
            return browser.findById("SINGLE_UPLOAD_label")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogDisplayed")
            .end()
            
            .findAllByCssSelector(failedUploadsSelector)
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "Wrong number of failed uploads");
               });
         },
         
         "Test single file upload (one success)": function() {
            return browser.findAllByCssSelector(successfulUploadsSelector)
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Wrong number of successful uploads");
               });
         },
         
         "Test single file upload (progress)": function() {
            return browser.findByCssSelector(aggProgStatusSelector)
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "100%", "The aggregate progress was not 100%");
               })
            .end()

            .findById("ALF_UPLOAD_PROGRESS_DIALOG_CANCELLATION_label")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogHidden");
         },
         
         "Test zero file upload (failed)": function () {
            return browser.findById("NO_FILES_UPLOAD_label")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogDisplayed")
            .end()
            
            .findAllByCssSelector(failedUploadsSelector)
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "Wrong number of failed uploads");
               });
         },
         
         "Test zero file upload (successful)": function() {
            return browser.findAllByCssSelector(successfulUploadsSelector)
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "Wrong number of successful uploads");
               })
            .end()

            .findById("ALF_UPLOAD_PROGRESS_DIALOG_CANCELLATION_label")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogHidden");
         },
         
         "Test Multi-File Upload (failed)": function () {
            return browser.findById("MULTI_UPLOAD_label")
               .click()
            .end()
            
            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogDisplayed")
            .end()
            
            .findAllByCssSelector(failedUploadsSelector)
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "Wrong number of failed uploads");
               });
         },
         
         "Test Multi-File Upload (successful)": function () {
            return browser.findByCssSelector(successfulUploadsSelector + ":nth-child(1)")
            .sleep(2000)
            .end()

            .findByCssSelector(successfulUploadsSelector + ":nth-child(2)")
            .sleep(2000)
            .end()

            .findByCssSelector(successfulUploadsSelector + ":nth-child(3)")
            .sleep(2000)
            .end()

            .findByCssSelector(successfulUploadsSelector + ":nth-child(4)")
            .end()

            .findAllByCssSelector(successfulUploadsSelector)
               .then(function(elements) {
                  assert.lengthOf(elements, 4, "Wrong number of successful uploads");
               })
            .end()
            
            .findByCssSelector(aggProgStatusSelector)
               .getVisibleText()
               .then(function(text) {
                  assert(text === "100%", "The aggregate progress was not 100%: " + text);
               })
            .end()
            
            .findByCssSelector("[widgetid=\"ALF_UPLOAD_PROGRESS_DIALOG_CANCELLATION\"] .dijitButtonNode")
               .getVisibleText()
               .then(function(visibleText) {
                  assert.equal(visibleText, "OK", "Button label didn't change after uploads complete");
               })
            .end()

            .findById("ALF_UPLOAD_PROGRESS_DIALOG_CANCELLATION_label")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogHidden")

            // Check that alfResponseTopic is published on completion
            .getLastPublish("UPLOAD_COMPLETE_OR_CANCELLED");
         },

         // NOTE: Upload does NOT work here because of scoping, however scoping is only used
         // to have multiple upload services on one page, something which is not expected
         // to happen in the wild. If it does, then we will address that problem when it occurs.
         "Dialog button-label and title can be customised": function() {
            return browser.findByCssSelector("[widgetid=\"SINGLE_UPLOAD_CUSTOM_BUTTON\"] .dijitButtonNode")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG_title")
               .getVisibleText()
               .then(function(visibleText){
                  assert.equal(visibleText, "Custom Title", "Dialog title not updated");
               })
            .end()

            .findByCssSelector(".dialogDisplayed #ALF_UPLOAD_PROGRESS_DIALOG_CANCELLATION_label")
               .getVisibleText()
               .then(function(visibleText){
                  assert.equal(visibleText, "Custom Label", "Button label not updated");
               })
            .end()

            .findByCssSelector("[widgetid=\"ALF_UPLOAD_PROGRESS_DIALOG_CANCELLATION\"] .dijitButtonNode")
               .click()
            .end()

            .waitForDeletedByCssSelector(".dialogDisplayed");   
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "Upload Cancellation Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/aikau-upload-unit-test?respondAfter=5000", "Upload Cancellation Tests").end();
         },
         
         beforeEach: function() {
            browser.end();
         },
         
         "Cancel upload": function () {
            // Simulate providing a zero byte file and check the output...
            return browser.findById("MULTI_UPLOAD_label")
               .clearLog()
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogDisplayed")
            .end()

            .findById("ALF_UPLOAD_PROGRESS_DIALOG_CANCELLATION_label")
               .click()
            .end()

            .findByCssSelector("#ALF_UPLOAD_PROGRESS_DIALOG.dialogHidden")
            .end()

            .getLastPublish("UPLOAD_COMPLETE_OR_CANCELLED");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});