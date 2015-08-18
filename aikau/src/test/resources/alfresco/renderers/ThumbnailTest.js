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
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

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
         return browser.findByCssSelector("#DOCLIB_RENDITIONS tr:nth-child(2) .alfresco-renderers-Thumbnail .inner img")
            .click()
         .end();
         // TODO: Link is currently not created properly outside of Share, raised https://issues.alfresco.com/jira/browse/AKU-240
      },

      "Standard container link": function() {
         return browser.findByCssSelector("#DOCLIB_RENDITIONS tr:nth-child(1) .alfresco-renderers-Thumbnail .inner img")
            .click()
         .end()
         .getLastPublish("ALF_DOCUMENTLIST_PATH_CHANGED")
            .then(function(payload) {
               assert.propertyVal(payload, "path", "/Budget Files/Invoices/Folder", "Could not find standard container link publication");
            });
      },

      "Custom thumbnail link": function() {
         return browser.findByCssSelector("#IMGPREVIEW_RENDITIONS tr:nth-child(2) .alfresco-renderers-Thumbnail .inner img")
            .click()
         .end()

         .getLastPublish("CUSTOM_SCOPE_CUSTOM_CLICK_TOPIC", "Topic was not published at the correct scope")
            .then(function(payload) {
               assert.propertyVal(payload, "nodeRef", "workspace://SpacesStore/7bb7bfa8-997e-4c55-8bd9-2e5029653bc8", "Could not find custom link click publication");
            });
      },

      "Lightbox preview": function() {
         return browser.findByCssSelector("#TASKS1 .alfresco-renderers-Thumbnail .inner img")
            .click()
         .end()
         .sleep(1000) // Give the lightbox a chance to populate
         .findByCssSelector("#aikauLightbox")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The lightbox preview was not displayed");
            });
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
         return browser.findByCssSelector("#HARDCODED .alfresco-renderers-Thumbnail .inner img")
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
});