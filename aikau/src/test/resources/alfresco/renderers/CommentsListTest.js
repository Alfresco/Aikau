/*jshint browser:true*/
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
 * @author Martin Doyle
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "CommentsList Tests",
      testPage: "/CommentsList",

      "Check initial comments are displayed": function() {
         return this.remote.findAllByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 5, "An unexpected number of comments were returned");
            });
      },

      "Check paginator page selector is visible": function() {
         return this.remote.findByCssSelector(".dijitMenuBar .dijitMenuItem:nth-child(2)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The page selector should have been displayed");
            });
      },

      // See AKU-719 - The CommentsList should not use the standard Document Library page size (25)
      // and instead use it's own preference. CommentsList by default will show 5 items per page unlike
      // with the next test suite there is no mock preference service so this default should remain.
      "Check paginator page selector text": function() {
         return this.remote.findByCssSelector(".dijitMenuBar .dijitMenuItem:nth-child(2) > span")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "1-5 of 6", "The page selector label was incorrect");
            });
      },

      "Check comments pagination (results per page)": function() {
         return this.remote.findByCssSelector("#COMMENT_LIST .alfresco-lists-Paginator__results-per-page")
            .getVisibleText()
            .then(function(text) {
               assert.include(text, "5 per page", "Wrong initial page information");
            });
      },

      "Check visibility of sort toggle": function() {
         return this.remote.findByCssSelector(".dijitMenuBar .dijitMenuItem:nth-child(7)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The sort toggle should have been displayed");
            });
      },

      "Check initial order": function() {
         return this.remote.findByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .read .read")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "one", "The order was initially incorrect");
            });
      },

      "Add comment": function() {
         return this.remote.findByCssSelector("#COMMENT_LIST .alf-menu-bar-label-node")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-dialog-AlfDialog .alfresco-editors-TinyMCE iframe") // Wait for control
            .end()

         .findAllByCssSelector(".alfresco-dialog-AlfDialog .alfresco-editors-TinyMCE iframe")
            .execute("tinymce.get(0).setContent('<p><strong>Hello tester!</strong></p>');")
            .execute("tinymce.get(0).save();")
            .end()

         .findByCssSelector(".alfresco-dialog-AlfDialog .dijitButtonNode")
            .click()
            .end()

         .findByCssSelector(".dijitMenuBar .dijitMenuItem:nth-child(2) > span")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "1-5 of 7", "The page selector label was incorrect");
            });
      },

      "Edit a comment": function() {
         return this.remote.findByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .alfresco-renderers-PublishAction:nth-child(2) > img")
            .click()
            .end()
            .findByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .alfresco-renderers-EditableComment .edit")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Editable comment not switched to edit mode");
            });
      },

      "Save edit": function() {
         return this.remote.findAllByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .alfresco-editors-TinyMCE iframe") // Wait for control
            .end()
            .findAllByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .alfresco-editors-TinyMCE iframe")
            .execute("tinymce.get(1).setContent('updated');")
            .execute("tinymce.get(1).save();")
            .end()
            .sleep(500)
            .findByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .confirmationButton > span")
            .click()
            .end()
            .sleep(500)
            .findByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .read .read")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "updated", "The comment was not updated");
            });
      },

      "Reverse order": function() {
         return this.remote.findByCssSelector(".dijitMenuBar .dijitMenuItem:nth-child(7) img.dijitMenuItemIcon")
            .click()
            .end()
            .sleep(500)
            .findByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .read .read")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "five", "The order was not reversed");
            });
      },

      "Change page size": function() {
         return this.remote.findByCssSelector(".dijitMenuBar .dijitMenuItem:nth-child(6) span")
            .click()
            .end()

         .clearLog()

         .findByCssSelector(".dijitPopup tr:nth-child(2) .dijitMenuItemLabel")
            .click()
            .end()

         .getLastPublish("COMMENTS1_ALF_DOCLIST_REQUEST_FINISHED")

         .findAllByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row")
            .then(function(elements) {
               assert.lengthOf(elements, 7, "Page size change didn't work");
            });
      },

      "Delete all the comments": function() {
         return this.remote.findDisplayedByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .alfresco-renderers-PublishAction:nth-child(3) > img")
            .clearLog()
            .click()
            .end()

         .getLastPublish("COMMENTS1_ALF_DOCLIST_REQUEST_FINISHED")
            .clearLog()

         .findDisplayedByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .alfresco-renderers-PublishAction:nth-child(3) > img")
            .click()
            .end()

         .getLastPublish("COMMENTS1_ALF_DOCLIST_REQUEST_FINISHED")
            .clearLog()

         .findDisplayedByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .alfresco-renderers-PublishAction:nth-child(3) > img")
            .click()
            .end()

         .getLastPublish("COMMENTS1_ALF_DOCLIST_REQUEST_FINISHED")
            .clearLog()

         .findDisplayedByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .alfresco-renderers-PublishAction:nth-child(3) > img")
            .click()
            .end()

         .getLastPublish("COMMENTS1_ALF_DOCLIST_REQUEST_FINISHED")
            .clearLog()

         .findDisplayedByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .alfresco-renderers-PublishAction:nth-child(3) > img")
            .click()
            .end()

         .findDisplayedByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .alfresco-renderers-PublishAction:nth-child(3) > img")
            .click()
            .end()

         .getLastPublish("COMMENTS1_ALF_DOCLIST_REQUEST_FINISHED")
            .clearLog()

         .findDisplayedByCssSelector(".alfresco-lists-AlfList .alfresco-lists-views-layouts-Row:first-child .alfresco-renderers-PublishAction:nth-child(3) > img")
            .click()
            .end()

         .getLastPublish("COMMENTS1_ALF_DOCLIST_REQUEST_FINISHED")
            .clearLog()

         .findByCssSelector("#COMMENT_LIST .alfresco-lists-AlfList")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "No comments", "Did not display no-comments after deleting comments");
            });
      },

      "Check paginator page selector is hidden": function() {
         return this.remote.findByCssSelector(".dijitMenuBar .dijitMenuItem:nth-child(2)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The page selector should have been hidden");
            });
      },

      "Check sort toggle is hidden": function() {
         return this.remote.findByCssSelector(".dijitMenuBar .dijitMenuItem:nth-child(7)")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The sort toggle should have been hidden");
            });
      }
   });

   defineSuite(module, {
      name: "CommentsList Tests (Full-screen add-comments)",
      testPage: "/FullScreenCommentsList",

      // See AKU-719 - The CommentsList should not use the standard Document Library page size (25)
      // and instead use it's own preference. CommentsList by default will show 5 items per page, however
      // the mock preference service will override that with a preference of 10...
      "Check comments pagination (page selector)": function() {
         return this.remote.findDisplayedByCssSelector("#FS_COMMENT_LIST .alfresco-lists-Paginator__page-selector")
            .getVisibleText()
            .then(function(text) {
               assert.include(text, "1-6 of 6", "Wrong initial page information");
            });
      },

      "Check comments pagination (results per page)": function() {
         return this.remote.findDisplayedByCssSelector("#FS_COMMENT_LIST .alfresco-lists-Paginator__results-per-page")
            .getVisibleText()
            .then(function(text) {
               assert.include(text, "10 per page", "Wrong initial page information");
            });
      },

      "Add-comment opens in full-screen mode": function() {
         var getDimensions = function() {
            var dialog = document.querySelector(".tinymce-dialog.dialogDisplayed"),
               dialogRect = dialog.getBoundingClientRect();
            return {
               screen: {
                  w: window.innerWidth,
                  h: window.innerHeight
               },
               dialog: {
                  w: dialog.offsetWidth,
                  h: dialog.offsetHeight,
                  x: dialogRect.left,
                  y: dialogRect.top
               }
            };
         };

         return this.remote.findByCssSelector(".dijitMenuItem:nth-child(1) .alf-menu-bar-label-node")
            .click()
            .end()

         .findByCssSelector(".tinymce-dialog.dialogDisplayed")
            .screenie()
            .end()

         .execute(getDimensions)
            .then(function(dimensions) {
               var screen = dimensions.screen,
                  dialog = dimensions.dialog;
               // Using 16 because scrollbar is 15px and allowing 1px for browser inconsistencies
               assert.closeTo(dialog.w, screen.w, 16, "Dialog width and screen width did not match");
               assert.closeTo(dialog.h, screen.h, 16, "Dialog height and screen height did not match");
               assert.equal(dialog.x, 0, "Dialog left was not zero");
               assert.equal(dialog.y, 0, "Dialog top was not zero");
            })

         // See AKU-717...
         .findByCssSelector(".alfresco-editors-TinyMCE")
            .getSize()
            .then(function(size) {
               assert.isAbove(size.height, 250, "Height of editor did now grow to consume dialog space");
               assert.isAbove(size.width, 538, "Height of editor did now grow to consume dialog space");
            })
            .end()

         .findByCssSelector(".cancellationButton .dijitButtonNode")
            .click()
            .end()

         .findByCssSelector(".tinymce-dialog.dialogHidden");
      }
   });
});