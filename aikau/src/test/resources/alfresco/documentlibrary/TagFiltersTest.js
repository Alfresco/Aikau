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
 * @author Martin Doyle
 */
define(["alfresco/TestCommon",
      "intern!object",
      "intern/chai!assert"],
      function(TestCommon, registerSuite, assert) {

   registerSuite(function() {
      var browser;

      return {
         name: "TagFilters Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/TagFilters", "TagFilters Tests");
         },

         beforeEach: function() {
            browser.end();
         },

         // See AKU-640 - this test needs to be first before we start manipulating the filters...
         "Check root node tag publication": function() {
            return browser.findByCssSelector("body").end()
               .getLastPublish("ALF_TAG_QUERY")
                  .then(function(payload) {
                     assert.propertyVal(payload, "siteId", null, "Unexpected siteId");
                     assert.propertyVal(payload, "containerId", null, "Unexpected containerId");
                     assert.propertyVal(payload, "rootNode", "some://fake/node", "Unexpected containerId");
                  });
         },

         "Check root node XHR request": function() {
            // We know that a rootNode query uses "tagQuery" as opposed to "tags" as used for siteId/containerId
            // It's important to make sure that a rootNode request is made because then we know that no
            // spurious siteId/containerId attributes have been provided...
            return browser.findByCssSelector("body").end()
               .getLastXhr("/tagQuery", "No root node XHR request");
         },

         "Can retrieve tags in unscoped context": function() {
            return browser.findAllByCssSelector("#TAG_FILTERS .alfresco-documentlibrary-AlfDocumentFilter")
               .then(function(elements) {
                  assert.lengthOf(elements, 9);
               });
         },

         "Can retrieve tags in scoped context": function() {
            return browser.findAllByCssSelector("#SCOPED_TAG_FILTERS .alfresco-documentlibrary-AlfDocumentFilter")
               .then(function(elements) {
                  assert.lengthOf(elements, 9);
               });
         },

         "Clicked tags publish change notification (unscoped)": function() {
            return browser.findByCssSelector("#TAG_FILTERS .alfresco-documentlibrary-AlfDocumentFilter:last-child")
               .clearLog()
               .click()
               .getLastPublish("ALF_DOCUMENTLIST_TAG_CHANGED", true);
         },

         "Clicked tags publish change notification (scoped)": function() {
            return browser.findByCssSelector("#SCOPED_TAG_FILTERS .alfresco-documentlibrary-AlfDocumentFilter:last-child")
               .clearLog()
               .click()
               .getLastPublish("SCOPED_ALF_DOCUMENTLIST_TAG_CHANGED", true);
         },

         "Document tagged event forces reload of scoped list": function() {
            return browser.findById("PUBLISH_TAGGED_BUTTON_label")
               .click()
               .getLastPublish("SCOPED_ALF_DOCUMENT_TAGGED", true)
               .getLastPublish("ALF_TAG_QUERY", true)
               .then(function(payload) {
                  assert.propertyVal(payload, "alfResponseScope", "SCOPED_");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});