/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Document Service Tests",
      testPage: "/DocumentService",

      "Single document download (DocLib API)": function() {
         return this.remote.findById("SINGLE_DOCUMENT_DOCLIB_label")
            .click()
            .end()

         .findByCssSelector("iframe#ALF_DOCUMENT_SERVICE_DOWNLOAD_IFRAME")
            .getAttribute("src")
            .then(function(src) {
               assert.include(src, "proxy/alfresco/slingshot/node/content/workspace/SpacesStore/62e6c83c-f239-4f85-b1e8-6ba0fd50fac4/2013-12-29%2009.58.43.jpg?a=true");
            })
            .clearLog();
      },

      "Single folder download (DocLib API)": function() {
         return this.remote.findById("SINGLE_FOLDER_DOCLIB_label")
            .click()
            .end()

         .getLastPublish("ALF_ARCHIVE_DELETE", "Archive download not requested")
            .clearLog();
      },

      "Single document download (Search API)": function() {
         return this.remote.findById("SINGLE_DOCUMENT_SEARCH_label")
            .click()
            .end()

         .getLastPublish("ALF_DOWNLOAD_ON_NODE_RETRIEVAL_SUCCESS")
            .clearLog()

         .findByCssSelector("iframe#ALF_DOCUMENT_SERVICE_DOWNLOAD_IFRAME")
            .getAttribute("src")
            .then(function(src) {
               assert.include(src, "proxy/alfresco/slingshot/node/content/workspace/SpacesStore/26ae500c-91a9-496f-aca6-14101f985c28/PDF.pdf?a=true");
            })
            .clearLog();
      },

      "Single folder download (Search API)": function() {
         return this.remote.findById("SINGLE_FOLDER_SEARCH_label")
            .click()
            .end()

         .getLastPublish("ALF_ARCHIVE_DELETE", "Archive download not requested")
            .clearLog();
      },

      "Single item download": function() {
         return this.remote.findById("MULTIPLE_DOCUMENTS_label")
            .click()
            .end()

         .getLastPublish("ALF_ARCHIVE_DELETE", "Archive download not requested")
            .clearLog();
      }
   });
});