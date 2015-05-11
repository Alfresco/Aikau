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
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

   var browser;
   registerSuite({
      name: "SearchResultPropertyLink Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SearchResultPropertyLink", "SearchResultPropertyLink Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

     "Check that all 4 links have anchors": function () {
         return browser.findAllByCssSelector("a.alfresco-navigation-_HtmlAnchorMixin")
            .then(function(elements) {
               assert(elements.length === 4, "'path' not initialised correctly");
            });
      },

      "Check that 'PAGE_RELATIVE' is set as the type": function() {
         return browser.pressKeys(keys.TAB)
         .pressKeys(keys.RETURN)
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "type", "PAGE_RELATIVE"))
            .then(function(elements) {
               assert(elements.length === 1, "'PAGE_RELATIVE' was not set as the navigation type");
            });
      },

      "Check that 'CURRENT' is set as the target": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "target", "CURRENT"))
            .then(function(elements) {
               assert(elements.length === 1, "'PAGE_RELATIVE' was not set as the navigation target");
            });
      },

      "Check that url is correct for site document": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "site/site1/document-details?nodeRef=workspace://SpacesStore/some-fake-uuid"))
            .then(function(elements) {
               assert(elements.length === 1, "site document search result URL was incorrect");
            });
      },

      "Check that url is correct for site folder": function() {
         return browser.pressKeys(keys.TAB)
         .pressKeys(keys.RETURN)
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "site/site1/documentlibrary?path=/folder1/folder2/folder3"))
            .then(function(elements) {
               assert(elements.length === 1, "site folder search result URL was incorrect");
            });
      },

      "Check that details url is correct for repo document": function() {
         return browser.pressKeys(keys.TAB)
         .pressKeys(keys.RETURN)
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "document-details?nodeRef=workspace://SpacesStore/some-fake-uuid"))
            .then(function(elements) {
               assert(elements.length === 1, "repo document search result URL was incorrect");
            });
      },

      "Check that path url is correct for repo document": function() {
         return browser.pressKeys(keys.TAB)
         .pressKeys(keys.RETURN)
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "repository?path=/folder2/folder3"))
            .then(function(elements) {
               assert(elements.length === 1, "repo document search result URL was incorrect");
            });
      },

      "Check that details url is correct for site document": function() {
         return browser.findByCssSelector("#SITE_DOC_LINK span.inner a")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "site/site1/document-details?nodeRef=workspace://SpacesStore/some-fake-uuid"))
            .then(function(elements) {
               assert(elements.length === 1, "site document search result URL was incorrect");
            });
      },

      "Check that path url is correct for site folder": function() {
         return browser.findByCssSelector("#SITE_FOLDER_LINK span.inner a")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "site/site1/documentlibrary?path=/folder1/folder2/folder3"))
            .then(function(elements) {
               assert(elements.length === 1, "site folder search result URL was incorrect");
            });
      },

      "Check that details url is correct for repo document (2)": function() {
         return browser.findByCssSelector("#REPO_DOC_LINK span.inner a")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "document-details?nodeRef=workspace://SpacesStore/some-fake-uuid"))
            .then(function(elements) {
               assert(elements.length === 1, "repo document search result URL was incorrect");
            });
      },

      "Check that path url is correct for repo document (2)": function() {
         return browser.findByCssSelector("#REPO_FOLDER_LINK span.inner a")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "url", "repository?path=/folder2/folder3"))
            .then(function(elements) {
               assert(elements.length === 1, "repo document search result URL was incorrect");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});