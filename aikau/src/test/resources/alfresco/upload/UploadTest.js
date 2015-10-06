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
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

   var uploadsSelector = ".alfresco-dialog-AlfDialog .alfresco-upload-AlfUploadDisplay .uploads";
   var successfulUploadsSelector = uploadsSelector + "> .successful table tr";
   var failedUploadsSelector = uploadsSelector + " > .failed table tr";
   var aggProgStatusSelector = uploadsSelector + " .aggregate-progress .percentage";
   var okButtonSelector = ".alfresco-dialog-AlfDialog .footer > span:first-child > span";
   var cancelButtonSelector = ".alfresco-dialog-AlfDialog .footer > span:nth-child(2) > span";
   var dialogDelay = 500;

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
      
      // teardown: function() {
      //    return browser.end().alfPostCoverageResults(browser);
      // },
      
      "Upload Failure": function () {
         // Simulate providing a zero byte file and check the output...
         return browser.findByCssSelector("#SINGLE_UPLOAD_label")
            .click()
            .sleep(dialogDelay)
         .end()
         .findAllByCssSelector(failedUploadsSelector)
            .then(function(elements) {
               assert(elements.length === 1, "Test #1a - Wrong number of failed uploads, expected 1, found: " + elements.length);
            })
         .end()
         .findByCssSelector(cancelButtonSelector)
            .click()
            .sleep(dialogDelay)
         .end();
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
      
      // teardown: function() {
      //    return browser.end().alfPostCoverageResults(browser);
      // },
      
      "Test bad file data": function () {
         // Simulate providing a zero byte file and check the output...
         return browser.findByCssSelector("#BAD_FILE_DATA_label")
            .click()
            .sleep(dialogDelay)
         .end()
         .findAllByCssSelector(failedUploadsSelector)
            .then(function(elements) {
               assert(elements.length === 1, "Wrong number of failed uploads, expected 1, found: " + elements.length);
            })
         .end()
         .findByCssSelector(cancelButtonSelector)
            .click()
            .sleep(dialogDelay)
         .end();
      },
      
      "Test single file upload (no failures)": function () {
         return browser.findByCssSelector("#SINGLE_UPLOAD_label")
            .click()
            .sleep(dialogDelay)
         .end()
         .findAllByCssSelector(failedUploadsSelector)
            .then(function(elements) {
               assert(elements.length === 0, "Wrong number of failed uploads, expected 0, found: " + elements.length);
            })
         .end();
      },
      
      "Test single file upload (one success)": function() {
         return browser.findAllByCssSelector(successfulUploadsSelector)
            .then(function(elements) {
               assert(elements.length === 1, "Wrong number of successful uploads, expected 1, found: " + elements.length);
            })
         .end();
      },
      
      "Test single file upload (progress)": function() {
         return browser.findByCssSelector(aggProgStatusSelector)
            .getVisibleText()
            .then(function(text) {
               assert(text === "100%", "The aggregate progress was not 100%: " + text);
            })
         .end()
         .findByCssSelector(okButtonSelector)
            .click()
            .sleep(dialogDelay)
         .end();
      },
      
      "Test zero file upload (failed)": function () {
         return browser.findByCssSelector("#NO_FILES_UPLOAD_label")
            .click()
            .sleep(dialogDelay)
         .end()
         .findAllByCssSelector(failedUploadsSelector)
            .then(function(elements) {
               assert(elements.length === 0, "Wrong number of failed uploads, expected 0, found: " + elements.length);
            })
         .end();
      },
      
      "Test zero file upload (successful)": function() {
         return browser.findAllByCssSelector(successfulUploadsSelector)
            .then(function(elements) {
               assert(elements.length === 0, "Wrong number of successful uploads, expected 0, found: " + elements.length);
            })
         .end()
         .findByCssSelector(okButtonSelector)
            .click()
            .sleep(dialogDelay)
         .end();
      },
      
      "Test Multi-File Upload (failed)": function () {
         return browser.findByCssSelector("#MULTI_UPLOAD_label")
            .click()
            .sleep(dialogDelay)
         .end()
         .findAllByCssSelector(failedUploadsSelector)
            .then(function(elements) {
               assert(elements.length === 0, "Wrong number of failed uploads, expected 0, found: " + elements.length);
            })
         .end();
      },
      
      "Test Multi-File Upload (successful)": function () {
         return browser.findAllByCssSelector(successfulUploadsSelector)
            .then(function(elements) {
               assert(elements.length === 4, "Wrong number of successful uploads, expected 4, found: " + elements.length);
            })
         .end()
         .findByCssSelector(aggProgStatusSelector)
            .getVisibleText()
            .then(function(text) {
               assert(text === "100%", "The aggregate progress was not 100%: " + text);
            })
         .end()
         .findByCssSelector(okButtonSelector)
            .click()
            .sleep(dialogDelay)
         .end();
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});