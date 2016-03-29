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
        "alfresco/TestCommon"], 
        function(registerSuite, assert, TestCommon) {

   function getTextContent(selector) {
      var elem = document.querySelector(selector);
      return elem && elem.textContent;
   }

   registerSuite(function() {
      var browser;

      return {
         name: "UploadMonitor Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/UploadMonitor", "UploadMonitor Tests");
         },

         beforeEach: function() {
            browser.end();
         },

         "Bad file immediately displays as unsuccessful": function() {
            return browser.findById("BAD_FILE_DATA_label")
               .click()
               .sleep(1000)
               .end()

            .findByCssSelector(".alfresco-layout-StickyPanel__panel .alfresco-upload-UploadMonitor__unsuccessful-items .alfresco-upload-UploadMonitor__item")
            .end()

            .execute(getTextContent, [".alfresco-upload-UploadMonitor__item__status__unsuccessful_icon svg title"])
               .then(function(text) {
                  assert.equal(text, "The file ''This file is empty.txt'' couldn't be uploaded for the following reason. 0kb files can't be uploaded");
               })

            .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
               .click();
         },

         "Panel buttons carry correct attributes": function() {
            return browser.findById("BAD_FILE_DATA_label")
               .click()
            .end()

            .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__minimise")
               .getAttribute("title")
               .then(function(attrValue){
                  assert.equal(attrValue, "Minimize the upload window", "Minimise button does not have correct title attribute");
               })
               .getAttribute("aria-label")
               .then(function(attrValue){
                  assert.equal(attrValue, "Minimize the upload window", "Minimise button does not have correct aria-label attribute");
               })
            .end()

            .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__restore")
               .getAttribute("title")
               .then(function(attrValue){
                  assert.equal(attrValue, "Restore the upload window", "Restore button does not have correct title attribute");
               })
               .getAttribute("aria-label")
               .then(function(attrValue){
                  assert.equal(attrValue, "Restore the upload window", "Restore button does not have correct aria-label attribute");
               })
            .end()

            .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
               .getAttribute("title")
               .then(function(attrValue){
                  assert.equal(attrValue, "Close the upload window", "Close button does not have correct title attribute");
               })
               .getAttribute("aria-label")
               .then(function(attrValue){
                  assert.equal(attrValue, "Close the upload window", "Close button does not have correct aria-label attribute");
               })
            .end()

            .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
               .click()
            .end()

            .getLastPublish("ALF_STICKY_PANEL_CLOSED");
         },

         "Single file upload succeeds": function() {
            return browser.findById("SINGLE_UPLOAD_label")
               .click()
            .end()

            .getLastPublish("UPLOAD_COMPLETE_OR_CANCELLED", 5000)

            .findByCssSelector(".alfresco-layout-StickyPanel__panel .alfresco-upload-UploadMonitor__successful-items .alfresco-upload-UploadMonitor__item")
               .end()

            .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
               .click();
         },

         "Upload service uses v0 API by default": function() {
            return browser.findByCssSelector("body")
               .getLastXhr("api/upload");
         },

         "Close button disabled on upload start": function() {
            return browser.findById("MULTI_UPLOAD_label")
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_STICKY_PANEL_DISABLE_CLOSE")

            .findByCssSelector(".alfresco-layout-StickyPanel--close-disabled");
         },

         "Multiple file upload succeeds with one failure": function() {
            return browser.findByCssSelector("body").end()

            .getLastPublish("UPLOAD_COMPLETE_OR_CANCELLED", 10000)

            .findByCssSelector(".alfresco-layout-StickyPanel__panel .alfresco-upload-UploadMonitor__unsuccessful-items .alfresco-upload-UploadMonitor__item")
            .end()

            .findAllByCssSelector(".alfresco-layout-StickyPanel__panel .alfresco-upload-UploadMonitor__successful-items .alfresco-upload-UploadMonitor__item")
               .then(function(elements) {
                  assert.lengthOf(elements, 3, "Should be three successful uploads");
               });
         },

         "Close button enabled on upload complete": function() {
            return browser.findAllByCssSelector(".alfresco-layout-StickyPanel--close-disabled")
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "Found disablement class");
               })
            .end()

            .getLastPublish("ALF_STICKY_PANEL_ENABLE_CLOSE")

            .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
               .click()
            .end()

            .getLastPublish("ALF_STICKY_PANEL_CLOSED");
         },

         "Can cancel in-progress upload": function() {
            return browser.findById("SINGLE_UPLOAD_label")
               .clearLog()
               .click()
            .end()

            .findDisplayedByCssSelector(".alfresco-upload-UploadMonitor__item__action__inprogress")
               .click()
            .end()

            .execute(getTextContent, [".alfresco-upload-UploadMonitor__item__status__unsuccessful_icon svg title"])
               .then(function(text) {
                  assert.equal(text, "The file ''Tiny dataset.csv'' couldn't be uploaded for the following reason. The upload was cancelled");
               })
            .end()

            .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
               .click()
            .end()

            .getLastPublish("ALF_STICKY_PANEL_CLOSED");
         },

         "Progress bar displayed when upload in-progress": function() {
            return browser.findById("SINGLE_UPLOAD_label")
               .clearLog()
               .click()
            .end()

            .findDisplayedByCssSelector(".alfresco-upload-UploadMonitor__item__progress-bar")
            .end()

            .getLastPublish("UPLOAD_COMPLETE_OR_CANCELLED", 5000)

            .waitForDeletedByCssSelector(".alfresco-upload-UploadMonitor__item__progress-bar")
            .end()

            .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
               .click()
            .end()

            .getLastPublish("ALF_STICKY_PANEL_CLOSED");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function() {
      var browser;

      return {
         name: "UploadMonitor V1 API Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/UploadMonitorV1", "UploadMonitor V1 API Tests");
         },

         beforeEach: function() {
            browser.end();
         },

         "Single file upload succeeds": function() {
            return browser.findById("V1_API_UPLOAD_label")
               .click()
            .end()

            .getLastPublish("UPLOAD_COMPLETE_OR_CANCELLED", 5000)

            .findByCssSelector(".alfresco-layout-StickyPanel__panel .alfresco-upload-UploadMonitor__successful-items .alfresco-upload-UploadMonitor__item")
               .end()

            .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
               .click();
         },

         "Upload service uses v0 API by default": function() {
            return browser.findByCssSelector("body")
               .getLastXhr("public/alfresco/versions/1/nodes/node/children");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});