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
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   var actionsSelectors = TestCommon.getTestSelectors("alfresco/renderers/Actions");
   var selectors = {
      downloadDocument: {
         label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", "0"]),
         dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["ACTIONS", "0"]),
         action1: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.nth.action.label", ["ACTIONS", "0", "1"])
      },
      downloadFolder: {
         label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", "1"]),
         dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["ACTIONS", "1"])
      }
   };

   defineSuite(module, {
      name: "Download as ZIP Action Tests",
      testPage: "/DownloadAsZip",

      "Test single item download": function() {
         // This test simulates the payload that would be generated from legacy document library action
         // configuration to check that the appropriate publications occur...
         return this.remote.setFindTimeout(5000).findById("SINGLE_DOWNLOAD_VIA_ACTION_SERVICE_label")
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
         return this.remote.setFindTimeout(5000).findById("MULTIPLE_DOWNLOAD_VIA_ACTION_SERVICE_label")
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

      "Test that action does NOT appear for document": function() {
         return this.remote.findByCssSelector(selectors.downloadDocument.label)
            .click()
         .end()

         .findAllByCssSelector("#ACTIONS_ITEM_0_DOWNLOAD_AS_ZIP")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Download as zip action should not be present for document");
            });
      },

      "Test that action does appear for folder": function() {
         return this.remote.findByCssSelector(selectors.downloadFolder.label)
            .click()
         .end()

         .findDisplayedById("ACTIONS_ITEM_1_DOWNLOAD_AS_ZIP");
      },

      "Test non-legacy action version": function() {
         return this.remote.findAllByCssSelector("#ACTIONS_ITEM_1_DOWNLOAD_AS_ZIP")
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

      "Cancel will prevent the download occurring": function() {
         return this.remote.findById("MULTIPLE_DOWNLOAD_VIA_ACTION_SERVICE")
            .clearLog()
            .click()
         .end()

         .findByCssSelector("#ARCHIVING_DIALOG.dialogDisplayed .dijitButtonNode")
            .click()
         .end()

         .findByCssSelector("#ARCHIVING_DIALOG.dialogHidden")
         .end()

         .getAllPublishes("ALF_DOWNLOAD_FILE")
            .then(function(publishes) {
               assert.lengthOf(publishes, 0);
            });
      }
   });
});