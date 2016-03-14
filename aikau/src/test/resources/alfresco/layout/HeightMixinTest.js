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
 * This is a unit test for the HeightMixin
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, function() {
      var windowHeight;

      return {
         name: "HeightMixin tests",
         testPage: "/HeightMixin",

         beforeEach: function() {
            return this.remote.findByCssSelector("body")
               .getSize()
               .then(function(size) {
                  windowHeight = size.height - 20; // PLEASE NOTE: 20 pixels deducted for test page padding
               })
               .end();
         },

         "Check AUTO height": function() {
            return this.remote.findById("AUTO")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, windowHeight, "Height not calculated correctly");
               });
         },

         "Check AUTO height (with adjustment)": function() {
            return this.remote.findById("AUTO_WITH_ADJUSTMENT")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, windowHeight - 50, "Height not calculated correctly");
               });
         },

         "Check FIXED height": function() {
            return this.remote.findById("FIXED")
               .getSize()
               .then(function(size) {
                  // NOTE: Extra 2 pixels for border compensation
                  assert.equal(size.height, 202, "Height not calculated correctly");
               });
         },

         "Check MINUS height": function() {
            return this.remote.findById("MINUS")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, windowHeight - 100, "Height not calculated correctly");
               });
         },

         "Show dialog with no padding and fixed height": function() {
            return this.remote.findById("LAUNCH_DIALOG_1_label")
               .click()
               .end()
               .findByCssSelector("#HEIGHT_DIALOG_1.dialogDisplayed")
               .end()
               .findById("DIALOG_1_TEST")
               .getSize()
               .then(function(size) {
                  // Height is the dialog content height minus 2px adjustment to show border
                  assert.equal(size.height, 300, "Height not calculated correctly");
               })
               .end()
               .findByCssSelector("#HEIGHT_DIALOG_1 .dijitDialogCloseIcon")
               .click()
               .end()
               .findByCssSelector("#HEIGHT_DIALOG_1.dialogHidden")
               .end();
         },

         "Show dialog with padding and fixed height": function() {
            return this.remote.findById("LAUNCH_DIALOG_2_label")
               .click()
               .end()
               .findByCssSelector("#HEIGHT_DIALOG_2.dialogDisplayed")
               .end()
               .findById("DIALOG_2_TEST")
               .getSize()
               .then(function(size) {
                  // Height is minus the standard border adjustment of 24 pixels
                  assert.equal(size.height, 76, "Height not calculated correctly");
               })
               .end()
               .findByCssSelector("#HEIGHT_DIALOG_2 .dijitDialogCloseIcon")
               .click()
               .end()
               .findByCssSelector("#HEIGHT_DIALOG_2.dialogHidden")
               .end();
         },

         "Show dialog with defaults": function() {
            return this.remote.findById("LAUNCH_DIALOG_3_label")
               .click()
               .end()
               .findByCssSelector("#HEIGHT_DIALOG_3.dialogDisplayed")
               .end()
               .findById("DIALOG_3_TEST")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, 18, "Height not calculated correctly");
               })
               .end()
               .findByCssSelector("#HEIGHT_DIALOG_3 .dijitDialogCloseIcon")
               .click()
               .end()
               .findByCssSelector("#HEIGHT_DIALOG_3.dialogHidden")
               .end();
         },

         "Show dialog with buttons": function() {
            return this.remote.findById("LAUNCH_DIALOG_4_label")
               .click()
               .end()
               .findByCssSelector("#HEIGHT_DIALOG_4.dialogDisplayed")
               .end()
               .findById("DIALOG_4_TEST")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, 18, "Height not calculated correctly");
               })
               .end()
               .findByCssSelector("#HEIGHT_DIALOG_4 .dijitDialogCloseIcon")
               .click()
               .end()
               .findByCssSelector("#HEIGHT_DIALOG_4.dialogHidden")
               .end();
         },

         "Show full screen dialog with no buttons": function() {
            return this.remote.findById("FULL_SCREEN_DIALOG_NO_BUTTON_label")
               .click()
               .end()
               .findByCssSelector("#FSDNB.dialogDisplayed")
               .end()
               .findByCssSelector("#FSDNB .alfresco-layout-FixedHeaderFooter")
               .getSize()
               .then(function(size) {
                  // NOTE: target height is client height minus dialog "margin", padding and title
                  var target = windowHeight - 80 - 24 - 39;
                  assert.closeTo(size.height, target, 10, "Height not calculated correctly");
               })
               .end()
               .findByCssSelector("#FSDNB .dijitDialogCloseIcon")
               .click()
               .end()
               .findByCssSelector("#FSDNB.dialogHidden")
               .end();
         },

         "Show full screen dialog with buttons bar": function() {
            return this.remote.findById("FULL_SCREEN_DIALOG_label")
               .click()
               .end()
               .findByCssSelector("#FSD.dialogDisplayed")
               .end()
               .findByCssSelector("#FSD .alfresco-layout-FixedHeaderFooter")
               .getSize()
               .then(function(size) {
                  // NOTE: target height is client height minus dialog "margin", padding, title and button bars
                  var target = windowHeight - 80 - 24 - 39 - 44;
                  assert.closeTo(size.height, target, 10, "Height not calculated correctly");
               })
               .end()
               .findByCssSelector("#FSD .dijitDialogCloseIcon")
               .click()
               .end()
               .findByCssSelector("#FSD.dialogHidden")
               .end();
         }
      };
   });

   defineSuite(module, {
      name: "HeightMixin tests (parent height)",
      testPage: "/ParentHeight",

      "Check FixedHeaderFooter height": function() {
         return this.remote.findById("FIXED_HEADER_FOOTER_1")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 600, "The FixedHeaderFooter widget did not take the parent height");
            });
      },

      "Check PDF.js previewer height": function() {
         return this.remote.findByCssSelector("#PDF_PREVIEW .alfresco-preview-PdfJs")
            .getSize()
            .then(function(size) {
               assert.closeTo(size.height, 558, 5, "The PDF.js previewer did not take the parent height");
            });
      }
   });
});