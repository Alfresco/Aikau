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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, TestCommon, keys) {

   var dialogSelectors = TestCommon.getTestSelectors("alfresco/dialogs/AlfDialog");
   var selectors = {
      dialogs: {
         preview: {
            visible: TestCommon.getTestSelector(dialogSelectors, "visible.dialog", ["NODE_PREVIEW_SERVICE_DIALOG"])
         }
      },
   };

   registerSuite(function(){
      var browser;

      return {
         name: "Thumbnail Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/Thumbnail", "Thumbnail Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Check there are the expected number of thumbnails successfully rendered": function () {
            return browser.findAllByCssSelector("span.alfresco-renderers-Thumbnail")
               .then(function (elements){
                  assert.lengthOf(elements, 9, "There should be 9 thumbnails successfully rendered");
               });
         },

         "Standard document link": function() {
            return browser.findByCssSelector("#DOCLIB_RENDITIONS tr:nth-child(2) .alfresco-renderers-Thumbnail .alfresco-renderers-Thumbnail__image")
               .click()
            .end();
            // TODO: Link is currently not created properly outside of Share, raised https://issues.alfresco.com/jira/browse/AKU-240
         },

         "Standard container link": function() {
            return browser.findByCssSelector("#DOCLIB_RENDITIONS tr:nth-child(1) .alfresco-renderers-Thumbnail .alfresco-renderers-Thumbnail__image")
               .click()
            .end()
            .getLastPublish("ALF_DOCUMENTLIST_PATH_CHANGED")
               .then(function(payload) {
                  assert.propertyVal(payload, "path", "/Budget Files/Invoices/Folder", "Could not find standard container link publication");
               });
         },

         "Custom thumbnail link": function() {
            return browser.findByCssSelector("#IMGPREVIEW_RENDITIONS tr:nth-child(2) .alfresco-renderers-Thumbnail .alfresco-renderers-Thumbnail__image")
               .click()
            .end()

            .getLastPublish("CUSTOM_SCOPE_CUSTOM_CLICK_TOPIC", "Topic was not published at the correct scope")
               .then(function(payload) {
                  assert.propertyVal(payload, "nodeRef", "workspace://SpacesStore/7bb7bfa8-997e-4c55-8bd9-2e5029653bc8", "Could not find custom link click publication");
               });
         },

         "Lightbox preview": function() {
            return browser.findByCssSelector("#TASKS1 .alfresco-renderers-Thumbnail .alfresco-renderers-Thumbnail__image")
               .click()
            .end()
            .findDisplayedById("aikauLightbox");
         },

         "Escape closes lightbox preview": function() {
            return browser.pressKeys([keys.ESCAPE])
               .findByCssSelector("#aikauLightbox")
                  .isDisplayed()
                  .then(function(displayed) {
                     assert.isFalse(displayed, "The lightbox preview was not hidden on ESC");
                  });
         },

         "PDFjs Preview": function() {
            return browser.findByCssSelector("#HARDCODED .alfresco-renderers-Thumbnail .alfresco-renderers-Thumbnail__image")
               .click()
            .end()
            .findAllByCssSelector(".alfresco-dialog-AlfDialog .alfresco-preview-PdfJs")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "PDFjs preview not displayed");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "Thumbnail Tests (Using NodePreviewService)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/Thumbnail?usePreviewService=true", "Thumbnail Tests (Using NodePreviewService)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Lightbox preview": function() {
            return browser.findByCssSelector("#TASKS1 .alfresco-renderers-Thumbnail .alfresco-renderers-Thumbnail__image")
               .click()
            .end()

            .findDisplayedById("aikauLightbox")
            .end()

            .findDisplayedById("aikauCloseButton")
               .click();
         },

         "PDFjs Preview": function() {
            return browser.findByCssSelector("#HARDCODED .alfresco-renderers-Thumbnail .alfresco-renderers-Thumbnail__image")
               .click()
            .end()

            .findByCssSelector(selectors.dialogs.preview.visible)
            .end()

            .findDisplayedByCssSelector(".alfresco-preview-PdfJs");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});