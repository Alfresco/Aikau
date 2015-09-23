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
        "alfresco/TestCommon"],
        function(registerSuite, assert, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Download as ZIP Action Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DownloadAsZip", "Download as ZIP Action Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test single item download": function() {
         // This test simulates the payload that would be generated from legacy document library action 
         // configuration to check that the appropriate publications occur...
         return browser.setFindTimeout(5000).findById("SINGLE_DOWNLOAD_VIA_ACTION_SERVICE_label")
               .click()
            .end()
            .findAllByCssSelector("#ARCHIVING_DIALOG.dialogDisplayed")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Archiving dialog not displayed");
               })
            .end()
            .getLastPublish("ALF_SINGLE_DOCUMENT_ACTION_REQUEST", 5000, "Single document action request not made")
            .getLastPublish("ALF_DOWNLOAD_AS_ZIP", 5000, "Single document action not passed to document service")
            .getLastPublish("ALF_ARCHIVE_REQUEST", 5000, "A request was not made to initiate the archive generation")
            .findAllByCssSelector("#ARCHIVING_DIALOG.dialogHidden")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Archiving dialog not hidden");
               })
            .end()
            .getLastPublish("ALF_DOWNLOAD_FILE", 5000, "Generated archive not downloaded")
            .clearLog();
      },

      "Test multiple item download": function() {
         // This test simulates the payload that would be generated from a multiple item selection action 
         // based on the legacy Share document library action configuration...
         return browser.setFindTimeout(5000).findById("MULTIPLE_DOWNLOAD_VIA_ACTION_SERVICE_label")
               .click()
            .end()
            .findAllByCssSelector("#ARCHIVING_DIALOG.dialogDisplayed")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Archiving dialog not displayed");
               })
            .end()
            .getLastPublish("ALF_MULTIPLE_DOCUMENT_ACTION_REQUEST", 5000, "Multiple document action request not made")
            .getLastPublish("ALF_DOWNLOAD_AS_ZIP", 5000, "Multiple document action not passed to document service")
               .then(function(payload) {
                  assert.lengthOf(payload.documents, 2, "Incorrect number of nodes requested to be archived");
               })
            .getLastPublish("ALF_ARCHIVE_REQUEST", 5000, "A request was not made to initiate the archive generation")
            .findAllByCssSelector("#ARCHIVING_DIALOG.dialogHidden")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Archiving dialog not hidden");
               })
            .end()
            .getLastPublish("ALF_DOWNLOAD_FILE", 5000, "Generated archive not downloaded")
            .clearLog();
      },

      "Test that action does NOT appear for document": function() {
         return browser.findByCssSelector("#ACTIONS_ITEM_0_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#ACTIONS_ITEM_0_DOWNLOAD_AS_ZIP")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Download as zip action should not be present for document");
            });
      },

      "Test that action does appear for folder": function() {
         return browser.findByCssSelector("#ACTIONS_ITEM_1_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#ACTIONS_ITEM_1_DOWNLOAD_AS_ZIP")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Download as zip action was not created for folder");
            });
      },

      "Test non-legacy action version": function() {
         return browser.findByCssSelector("#ACTIONS_ITEM_1_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#ACTIONS_ITEM_1_DOWNLOAD_AS_ZIP")
            .click()
         .end()
         .findAllByCssSelector("#ARCHIVING_DIALOG.dialogDisplayed")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Archiving dialog not displayed");
            })
         .end()
         .getLastPublish("ALF_ARCHIVE_REQUEST", 5000, "A request was not made to initiate the archive generation")
         .findAllByCssSelector("#ARCHIVING_DIALOG.dialogHidden")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Archiving dialog not hidden");
            })
         .end()
         .getLastPublish("ALF_DOWNLOAD_FILE", 5000, "Generated archive not downloaded")
         .clearLog();
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});