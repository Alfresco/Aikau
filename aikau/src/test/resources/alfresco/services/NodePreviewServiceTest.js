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
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(registerSuite, assert, TestCommon, keys) {

   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");
   var dialogSelectors = TestCommon.getTestSelectors("alfresco/dialogs/AlfDialog");

   var selectors = {
      buttons: {
         imagePreview: TestCommon.getTestSelector(buttonSelectors, "button.label", ["IMAGE_PREVIEW"]),
         videoPreview: TestCommon.getTestSelector(buttonSelectors, "button.label", ["VIDEO_PREVIEW"]),
         audioPreview: TestCommon.getTestSelector(buttonSelectors, "button.label", ["AUDIO_PREVIEW"])
      },
      dialogs: {
         preview: {
            visible: TestCommon.getTestSelector(dialogSelectors, "visible.dialog", ["NODE_PREVIEW_SERVICE_DIALOG"])
         }
      },
   };

   registerSuite(function(){
      var browser;

      return {

         name: "NodePreviewService Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/NodePreviewService", "NodePreviewService Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Show image preview": function() {
            return browser.findByCssSelector(selectors.buttons.imagePreview)
               .click()
            .end()

            .getLastPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST")
            .getLastPublish("ALF_DISPLAY_LIGHTBOX")

            .findDisplayedById("aikauLightbox")
            .end()

            .findDisplayedById("aikauCloseButton")
               .click()
            .end()

            .clearLog();
         },

         "Show video preview": function() {
            return browser.findByCssSelector(selectors.buttons.videoPreview)
               .click()
            .end()

            .getLastPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST")
            .getLastPublish("ALF_CREATE_DIALOG_REQUEST")

            .findByCssSelector(selectors.dialogs.preview.visible)
            .end()

            .findByCssSelector("video")
            .end()

            .pressKeys(keys.ESCAPE)

            .waitForDeletedByCssSelector(selectors.dialogs.preview.visible);
         },

         "Show audio preview": function() {
            return browser.findByCssSelector(selectors.buttons.audioPreview)
               .click()
            .end()

            .getLastPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST")
            .getLastPublish("ALF_CREATE_DIALOG_REQUEST")

            .findByCssSelector(selectors.dialogs.preview.visible)
            .end()

            .findByCssSelector("audio");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {

         name: "NodePreviewService Tests (alternate display)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/NodePreviewService?altDisplay=true", "NodePreviewService Tests (alternate display)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Show image preview": function() {
            return browser.findByCssSelector(selectors.buttons.imagePreview)
               .click()
            .end()

            .getLastPublish("ALF_RETRIEVE_SINGLE_DOCUMENT_REQUEST")
            .getLastPublish("ALF_DISPLAY_STICKY_PANEL")

            .findDisplayedByCssSelector(".alfresco-layout-StickyPanel__panel .alfresco-preview-AlfDocumentPreview");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});