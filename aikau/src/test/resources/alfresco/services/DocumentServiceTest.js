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
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "Document Service Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/DocumentService", "Document Service Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Single document download (DocLib API)": function() {
            return browser.findById("SINGLE_DOCUMENT_DOCLIB_label")
               .click()
            .end()

            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload) {
                  assert.include(payload.url, 
                                 "proxy/alfresco/slingshot/node/content/workspace/SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4/2013-12-29%2009.58.43.jpg?a=true",
                                 "Individual download request not detected");
               })
               .clearLog();
         },

         "Single folder download (DocLib API)": function() {
            return browser.findById("SINGLE_FOLDER_DOCLIB_label")
               .click()
            .end()

            .getLastPublish("ALF_ARCHIVE_DELETE", "Archive download not requested")
            .clearLog();
         },

         "Single document download (Search API)": function() {
            return browser.findById("SINGLE_DOCUMENT_SEARCH_label")
               .click()
            .end()

            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
               .then(function(payload) {
                  assert.include(payload.url, 
                                 "proxy/alfresco/slingshot/node/content/workspace/SpacesStore/26ae500c-91a9-496f-aca6-14101f985c28/PDF.pdf?a=true",
                                 "Individual download request not detected");
               })
               .clearLog();
         },

         "Single folder download (Search API)": function() {
            return browser.findById("SINGLE_FOLDER_SEARCH_label")
               .click()
            .end()

            .getLastPublish("ALF_ARCHIVE_DELETE", "Archive download not requested")
            .clearLog();
         },

         "Single item download": function() {
            return browser.findById("MULTIPLE_DOCUMENTS_label")
               .click()
            .end()

            .getLastPublish("ALF_ARCHIVE_DELETE", "Archive download not requested")
            .clearLog();
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});