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
      "alfresco/TestCommon"
   ],
   function(registerSuite, assert, TestCommon) {

      var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");

      var selectors = {
         buttons: {
            doUpload: TestCommon.getTestSelector(buttonSelectors, "button.label", ["DO_UPLOAD"])
         }
      };

      registerSuite(function() {
         var browser;

         return {
            name: "FileUploadService Config Tests",

            setup: function() {
               browser = this.remote;
               return TestCommon.loadTestWebScript(this.remote, "/FileUploadServiceConfig", "FileUploadService Config Tests").end();
            },

            beforeEach: function() {
               browser.end();
            },

            "Configured success action does not prevent inprogress action payload from publishing": function() {
               return browser.findByCssSelector(selectors.buttons.doUpload)
                  .clearLog()
                  .click()
                  .end()

               .findByCssSelector(".alfresco-upload-UploadMonitor__inprogress-items .alfresco-renderers-PublishAction")
                  .click()
                  .end()

               .getLastPublish("CANCEL_INPROGRESS_UPLOAD")
                  .then(function(payload) {
                     assert.propertyVal(payload, "fileSize", 1337, "fileSize property not found in payload");
                     assert.propertyVal(payload, "fileName", "File for v1 API.docx", "fileName property not found in payload");
                  });
            },

            "Post Coverage Results": function() {
               TestCommon.alfPostCoverageResults(this, browser);
            }
         };
      });
   });