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
        "alfresco/TestCommon",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, TestCommon, defineSuite, assert) {

   defineSuite(module, {
      name: "TagFilters Tests",
      testPage: "/TagFilters",

      // See AKU-640 - this test needs to be first before we start manipulating the filters...
      "Check root node tag publication": function() {
         return this.remote.findByCssSelector("body").end()
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
         return this.remote.findByCssSelector("body").end()
            .getLastXhr("/tagQuery", "No root node XHR request");
      },

      "Can retrieve tags in unscoped context": function() {
         return this.remote.findAllByCssSelector("#TAG_FILTERS .alfresco-documentlibrary-AlfDocumentFilter")
            .then(function(elements) {
               assert.lengthOf(elements, 9);
            });
      },

      "Can retrieve tags in scoped context": function() {
         return this.remote.findAllByCssSelector("#SCOPED_TAG_FILTERS .alfresco-documentlibrary-AlfDocumentFilter")
            .then(function(elements) {
               assert.lengthOf(elements, 9);
            });
      },

      "Clicked tags publish change notification (unscoped)": function() {
         return this.remote.findByCssSelector("#TAG_FILTERS .alfresco-documentlibrary-AlfDocumentFilter:last-child")
            .clearLog()
            .click()
            .getLastPublish("ALF_DOCUMENTLIST_TAG_CHANGED", true);
      },

      "Clicked tags publish change notification (scoped)": function() {
         return this.remote.findByCssSelector("#SCOPED_TAG_FILTERS .alfresco-documentlibrary-AlfDocumentFilter:last-child")
            .clearLog()
            .click()
            .getLastPublish("SCOPED_ALF_DOCUMENTLIST_TAG_CHANGED", true);
      },

      "Document tagged event forces reload of scoped list": function() {
         return this.remote.findById("PUBLISH_TAGGED_BUTTON_label")
            .click()
            .getLastPublish("SCOPED_ALF_DOCUMENT_TAGGED", true)
            .getLastPublish("ALF_TAG_QUERY", true)
            .then(function(payload) {
               assert.propertyVal(payload, "alfResponseScope", "SCOPED_");
            });
      }
   });
});