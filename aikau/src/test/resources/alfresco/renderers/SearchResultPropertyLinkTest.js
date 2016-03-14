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
define(["module",
        "alfresco/defineSuite",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, expect, assert, require, TestCommon, keys) {

   defineSuite(module, {
      name: "SearchResultPropertyLink Tests",
      testPage: "/SearchResultPropertyLink",

      "Check that all 4 links have anchors": function() {
         return this.remote.findAllByCssSelector("a.alfresco-navigation-_HtmlAnchorMixin")
            .then(function(elements) {
               assert(elements.length === 4, "'path' not initialised correctly");
            });
      },

      "Check that navigation payload": function() {
         return this.remote.pressKeys(keys.TAB)
            .pressKeys(keys.RETURN)
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "type", "PAGE_RELATIVE", "Incorreect type");
               assert.propertyVal(payload, "target", "CURRENT", "Incorrect target");
               assert.propertyVal(payload, "url", "site/site1/document-details?nodeRef=workspace://SpacesStore/some-fake-uuid", "Incorrect URL");
            });
      },

      "Check that url is correct for site folder": function() {
         return this.remote.pressKeys(keys.TAB)
            .pressKeys(keys.RETURN)
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "site/site1/documentlibrary?path=%2Ffolder1%2Ffolder2%2Ffolder3", "Site folder search result URL was incorrect");
            });
      },

      "Check that details url is correct for repo document": function() {
         return this.remote.pressKeys(keys.TAB)
            .pressKeys(keys.RETURN)
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "document-details?nodeRef=workspace://SpacesStore/some-fake-uuid", "Repository document search result URL was incorrect");
            });
      },

      "Check that path url is correct for repo document": function() {
         return this.remote.pressKeys(keys.TAB)
            .pressKeys(keys.RETURN)
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "repository?path=%2Ffolder2%2Ffolder3", "Repository folder search result URL was incorrect");
            });
      },

      "Check that details url is correct for site document": function() {
         return this.remote.findByCssSelector("#SITE_DOC_LINK span.inner a")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "site/site1/document-details?nodeRef=workspace://SpacesStore/some-fake-uuid", "Site document search result URL was incorrect");
            });
      },

      "Check that path url is correct for site folder": function() {
         return this.remote.findByCssSelector("#SITE_FOLDER_LINK span.inner a")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "site/site1/documentlibrary?path=%2Ffolder1%2Ffolder2%2Ffolder3", "Site folder search result URL was incorrect");
            });
      },

      "Check that details url is correct for repo document (2)": function() {
         return this.remote.findByCssSelector("#REPO_DOC_LINK span.inner a")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "document-details?nodeRef=workspace://SpacesStore/some-fake-uuid", "Repository document search result URL was incorrect");
            });
      },

      "Check that path url is correct for repo document (2)": function() {
         return this.remote.findByCssSelector("#REPO_FOLDER_LINK span.inner a")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.propertyVal(payload, "url", "repository?path=%2Ffolder2%2Ffolder3", "Repository folder search result URL was incorrect");
            });
      }
   });
});