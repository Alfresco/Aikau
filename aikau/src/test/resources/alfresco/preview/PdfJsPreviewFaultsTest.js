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
 * @author Richard Smith
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function(module, defineSuite, expect, assert, require, TestCommon) {

   defineSuite(module, {
      name: "PdfJs missing PDF test",
      testPage: "/PdfJsPreviewMissing",

      "Checking controls are hidden": function() {
         return this.remote.sleep(500)
            .findByCssSelector(".previewer > .controls")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(false, "Controls should be hidden");
            });
      },

      "Checking sidebar is hidden": function() {
         return this.remote.findByCssSelector(".previewer > .sidebar")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(false, "Sidebar should be hidden");
            });
      },

      "Checking viewer is hidden": function() {
         return this.remote.findByCssSelector(".previewer > .viewer")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(false, "Viewer should be hidden");
            });
      },

      "Checking notification is shown": function() {
         return this.remote.findByCssSelector(".notification")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(true, "Notification should be shown");
            });
      },

      "Checking notification has text in it": function() {
         return this.remote.findByCssSelector(".notification")
            .getVisibleText()
            .then(function(text) {
               expect(text).to.have.length.above(0, "There should be a notification message");
            });
      }
   });

   defineSuite(module, {
      name: "PdfJs faulty PDF test",
      testPage: "/PdfJsPreviewFaulty",

      "Checking controls are hidden": function() {
         return this.remote.sleep(500)
            .findByCssSelector(".previewer > .controls")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(false, "Controls should be hidden");
            });
      },

      "Checking sidebar is hidden": function() {
         return this.remote.findByCssSelector(".previewer > .sidebar")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(false, "Sidebar should be hidden");
            });
      },

      "Checking viewer is hidden": function() {
         return this.remote.findByCssSelector(".previewer > .viewer")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(false, "Viewer should be hidden");
            });
      },

      "Checking notification is shown": function() {
         return this.remote.findByCssSelector(".notification")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(true, "Notification should be shown");
            });
      },

      "Checking notification has text in it": function() {
         return this.remote.findByCssSelector(".notification")
            .getVisibleText()
            .then(function(text) {
               expect(text).to.have.length.above(0, "There should be a notification message");
            });
      }
   });

   defineSuite(module, {
      name: "PdfJs password protected PDF test",
      testPage: "/PdfJsPreviewPassword",

      "Checking controls are hidden": function() {
         return this.remote.findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogDisplayed") // Wait for dialog
            .end()
            .findByCssSelector(".previewer > .controls")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(false, "Controls should be hidden");
            });
      },

      "Checking sidebar is hidden": function() {
         return this.remote.findByCssSelector(".previewer > .sidebar")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(false, "Sidebar should be hidden");
            });
      },

      "Checking viewer is hidden": function() {
         return this.remote.findByCssSelector(".previewer > .viewer")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(false, "Viewer should be hidden");
            });
      },

      "Checking notification is shown": function() {
         return this.remote.findByCssSelector(".notification")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(true, "Notification should be shown");
            });
      },

      "Checking notification has text in it": function() {
         return this.remote.findByCssSelector(".notification")
            .getVisibleText()
            .then(function(text) {
               expect(text).to.have.length.above(0, "There should be a notification message");
            });
      },

      "Test PdfJs with a password protected PDF displays a password request": function() {
         return this.remote.findByCssSelector(".alfresco-dialog-AlfDialog")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(true, "Dialog should be displayed");
            });
      },

      "Test PdfJs with a password protected PDF displays a new password challenge with a password error": function() {
         return this.remote.findByCssSelector(".alfresco-dialog-AlfDialog input[name='password']")
            .then(null, function() {
               assert(false, "No password field found");
            })
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog input[name='password']")
            .type("abc")
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog .footer > span:first-child > span")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogHidden") // Wait for dialog to close
            .end()
            .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogDisplayed") // Wait for dialog to open
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("ALF_CREATE_FORM_DIALOG_REQUEST", "publish", "any"))
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Another request for a dialog should have been made");
            });
      },

      "Test PdfJs with a password protected PDF displays a new password challenge with another password error": function() {
         return this.remote.findByCssSelector(".alfresco-dialog-AlfDialog input[name='password']")
            .then(null, function() {
               assert(false, "No password field found");
            })
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog input[name='password']")
            .type("def")
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog .footer > span:first-child > span")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogHidden") // Wait for dialog to close
            .end()
            .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogDisplayed") // Wait for dialog to open
            .end()

         .findAllByCssSelector(TestCommon.topicSelector("ALF_CREATE_FORM_DIALOG_REQUEST", "publish", "any"))
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Another request for a dialog should have been made");
            });
      },

      "Test PdfJs with a password protected PDF displays the PDF with a correct password": function() {
         return this.remote.findByCssSelector(".alfresco-dialog-AlfDialog input[name='password']")
            .then(null, function() {
               assert(false, "No password field found");
            })
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog input[name='password']")
            .type("alfresco")
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog .footer > span:first-child > span")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogHidden") // Wait for dialog to close
            .end()

         .findByCssSelector(".previewer > .controls")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(true, "Controls should be visible");
            });
      },

      "Checking sidebar is visible": function() {
         return this.remote.findByCssSelector(".previewer > .sidebar")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(true, "Sidebar should be visible");
            });
      },

      "Checking viewer is visible": function() {
         return this.remote.findByCssSelector(".previewer > .viewer")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(true, "Viewer should be visible");
            });
      },

      "Checking notification is not shown": function() {
         return this.remote.findByCssSelector(".notification")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(false, "Notification should not be shown");
            });
      }
   });
});