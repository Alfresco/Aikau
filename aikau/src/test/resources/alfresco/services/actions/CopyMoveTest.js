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
        "require",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, require, TestCommon) {

   defineSuite(module, {
      name: "Copy/Move tests",
      testPage: "/CopyMoveService",

      "Test dialog title of copy via ActionService": function() {
         return this.remote.findByCssSelector("#COPY1_label")
            .click()
            .end()
            .findAllByCssSelector("#ALF_COPY_MOVE_DIALOG.dialogDisplayed")
            .end()
            .findByCssSelector(".dijitDialogTitle")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Copy File 1 to...", "Copy dialog title not set correctly");
            });
      },

      "Test Shared Files location shows root node": function() {
         return this.remote.findByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:first-child .dijitMenuItem:nth-child(4)")
            .click()
            .end()
            .findAllByCssSelector(".alfresco-pickers-Picker .sub-pickers > div")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "The Shared Files sub-picker was not shown");
            })
            .end()
            .findAllByCssSelector(".alfresco-navigation-Tree .dijitTreeLabel")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Only one tree node was expected");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Shared Files", "The tree node did not have the expected label");
            })
            .click();
      },

      "Test that the copy confirmation button has correct label": function() {
         return this.remote.findByCssSelector(".footer .alfresco-buttons-AlfButton:nth-child(1) .dijitButtonText")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Copy", "The confirmation button on the copy dialog was incorrect");
            })
            .click()
            .end();
      },

      "Test that a notification of complete success is displayed": function() {
         return this.remote.findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_DISPLAY_NOTIFICATION", "message", "Copy completed successfully"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The copy success message was not found");
            });
      },

      "Test that the copy request was successful": function() {
         return this.remote.findAllByCssSelector(TestCommon.topicSelector("ALF_DOCLIST_RELOAD_DATA", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Only expected one reload publication to indicate success");
            });
      },

      "Test dialog title of move via ActionService": function() {
         return this.remote.findAllByCssSelector("#ALF_COPY_MOVE_DIALOG.dialogHidden")
            .end()
            .findByCssSelector("#MOVE1_label")
            .click()
            .end()
            .findAllByCssSelector("#ALF_COPY_MOVE_DIALOG.dialogDisplayed")
            .end()
            .findByCssSelector(".dijitDialogTitle")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Move File 1 to...", "Move dialog title not set correctly");
            });
      },

      "Test My Files location shows root node": function() {
         return this.remote.findByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:first-child .dijitMenuItem:nth-child(6)")
            .click()
            .end()
            .findAllByCssSelector(".alfresco-pickers-Picker .sub-pickers > div")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "The My Files sub-picker was not shown");
            })
            .end()
            .findAllByCssSelector(".alfresco-navigation-Tree .dijitTreeLabel")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Only one tree node was expected");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "My Files", "The tree node did not have the expected label");
            })
            .click();
      },

      "Test the partial success prompt": function() {
         return this.remote.findByCssSelector(".footer .alfresco-buttons-AlfButton:nth-child(1) .dijitButtonText")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Move", "The confirmation button on the move dialog was incorrect");
            })
            .click()
            .end()
            .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_DISPLAY_PROMPT", "message", "Move partially successful, the following files or folders couldn't be moved: File2, File3"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The copy success message was not found");
            });
      }
   });

   defineSuite(module, {
      name: "Copy/Move tests (overrides and failures)",
      testPage: "/CopyMoveService?repoNodeRef=some://fake/node&copyAPI=fail/",

      "Test Repository location shows root node": function() {
         return this.remote.findByCssSelector("#COPY1_label")
            .click()
            .end()
            .findByCssSelector(".alfresco-pickers-Picker .sub-pickers > div:first-child .dijitMenuItem:nth-child(5)")
            .click()
            .end()
            .findAllByCssSelector(".alfresco-pickers-Picker .sub-pickers > div")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "The Repository sub-picker was not shown");
            })
            .end()
            .findAllByCssSelector(".alfresco-navigation-Tree .dijitTreeLabel")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Only one tree node was expected");
            })
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Repository", "The tree node did not have the expected label");
            })
            .click()
            .end()
            .findByCssSelector(".footer .alfresco-buttons-AlfButton:nth-child(1) .dijitButtonText")
            .click();
      },

      "Test the repository root override is applied": function() {
         return this.remote.findByCssSelector("body")
            .getLastXhr("aikau/proxy/alfresco/slingshot/doclib/treenode/node/alfresco/company/home")
            .then(function(xhr) {
               assert.include(xhr.request.url, "libraryRoot=some%3A%2F%2Ffake%2Fnode");
            });
      },

      "Test that the custom copyAPI was used": function() {
         return this.remote.findByCssSelector("body")
            .getLastXhr("aikau/proxy/alfresco/fail/some/fake/node");
      }
   });
});