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

            .findByCssSelector(".alfresco-upload-UploadMonitor__item__name__error")
               .getVisibleText()
               .then(function(visibleText) {
                  assert.equal(visibleText, "0kb files cannot be uploaded");
               })
               .end()
               .end() // Escape previous extra nesting

            .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
               .click();
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
               })
            .end()

            .findByCssSelector(".alfresco-layout-StickyPanel__title-bar__close")
               .click();
         },

         "Close button enabled on upload complete": function() {
            return browser.findAllByCssSelector(".alfresco-layout-StickyPanel--close-disabled")
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "Found disablement class");
               })
            .end()

            .getLastPublish("ALF_STICKY_PANEL_ENABLE_CLOSE");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});