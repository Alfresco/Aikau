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
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

   var browser;

   // PLEASE NOTE:
   // We're going to run the same tests on the Document Library with URL hashing enabled and then disabled
   // so the tests are abstracted to their own individual functions for re-use (this is slightly different
   // that other tests)...
   var countInitialBreadcrumbs = function() {
      return browser.setFindTimeout(10000).findAllByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb")
         .then(function(elements) {
            assert.lengthOf(elements, 1, "No breadcrumbs were rendered on page load");
         }); 
   };

   var checkInitialBreadcrumbText = function() {
      return browser.findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb .breadcrumb")
         .getVisibleText()
         .then(function(text) {
            assert.equal(text, "Documents", "The initial breadcrumb was rendered incorrectly");
         });
   };

   var clickOnFolderLink = function() {
      return browser.findByCssSelector("#DETAILED_VIEW_NAME_ITEM_0 .alfresco-renderers-Property")
         .clearLog()
            .click()
         .end()
         .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")
         .findAllByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "The breadcrumb trail was not updated");
            });
         };

   var checkAddedBreadcrumbText = function() {
      return browser.findByCssSelector("#DOCLIB_BREADCRUMB_TRAIL .alfresco-documentlibrary-AlfBreadcrumb:nth-child(2) .breadcrumb")
         .getVisibleText()
         .then(function(text) {
            assert.equal(text, "DetailedView", "The added breadcrumb was not rendered correctly");
         });
   };

   var returnToRoot = function() {
      return browser.findByCssSelector("#DOCLIB_BREADCRUMB_TRAIL .alfresco-documentlibrary-AlfBreadcrumb:nth-child(1) .breadcrumb")
         .clearLog()
         .click()
      .end()
      .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")
      .end()
      .findAllByCssSelector(".alfresco-documentlibrary-views-AlfDetailedViewItem")
         .then(function(elements) {
            assert.lengthOf(elements, 3, "The data wasn't reloaded");
         })
      .end()
      .findAllByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb")
         .then(function(elements) {
            assert.lengthOf(elements, 1, "The breadcrumb trail was not updated");
         });
   };

   var switchToFilter = function(pubSubScope) {
      return browser.findByCssSelector(".alfresco-documentlibrary-AlfDocumentFilter:last-child span")
         .clearLog()
         .click()
      .end()
      .getLastPublish(pubSubScope + "ALF_CURRENT_NODEREF_CHANGED", "The current Node data should have been published")
      .end()
      .findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb")
         .getVisibleText()
         .then(function(text) {
            assert.equal(text, "My Favorite Files and Folders", "The filter description was not retained");
         });
   };

   // NOTE: For some as yet undetermined reason the first time we attempt to load the Document Library test page 
   //       with clear dependency caches it will fail. Therefore we register a dummy test suite that absorbs this
   //       failure so that subsequent tests can pass.
   registerSuite({
      name: "Document Library Test (dummy load)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DocLib", "Document Library Test (dummy load)", null, true).end();
      }
      
   });

   registerSuite({
      name: "Document Library Test (default)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DocLib", "Document Library Test").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Count the initial breadcrumbs": function() {
         return browser.then(function() {
            return countInitialBreadcrumbs();
         });
      },

      "Check the initial breadcrumb text": function() {
         return browser.then(function() {
            return checkInitialBreadcrumbText();
         });
      },

      "Click on a folder link and check for updated breadcrumb": function() {
         return browser.then(function() {
            return clickOnFolderLink();
         });
      },

      "Check the added breadcrumb text": function() {
         return browser.then(function() {
            return checkAddedBreadcrumbText();
         });
      },

      "Use the breadcrumb trail to return to the root": function() {
         return browser.then(function() {
            return returnToRoot();
         });
      },

      "Switch to favourites filter": function() {
         return browser.then(function() {
            return switchToFilter("SCOPED_");
         });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({
      name: "Document Library Test (no URL hashing)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DocLibNoHash", "Document Library Test (no URL hashing)").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Count the initial breadcrumbs": function() {
         return browser.then(function() {
            return countInitialBreadcrumbs();
         });
      },

      "Check the initial breadcrumb text": function() {
         return browser.then(function() {
            return checkInitialBreadcrumbText();
         });
      },

      "Click on a folder link and check for updated breadcrumb": function() {
         return browser.then(function() {
            return clickOnFolderLink();
         });
      },

      "Check the added breadcrumb text": function() {
         return browser.then(function() {
            return checkAddedBreadcrumbText();
         });
      },

      "Use the breadcrumb trail to return to the root": function() {
         return browser.then(function() {
            return returnToRoot();
         });
      },

      "Switch to favourites filter": function() {
         return browser.then(function() {
            return switchToFilter("");
         });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});