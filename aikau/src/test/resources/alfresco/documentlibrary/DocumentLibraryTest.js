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

   // PLEASE NOTE:
   // We're going to run the same tests on the Document Library with URL hashing enabled and then disabled
   // so the tests are abstracted to their own individual functions for re-use (this is slightly different
   // that other tests)...
   var countInitialBreadcrumbs = function(browser) {
      return browser.setFindTimeout(10000).findAllByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb")
         .then(function(elements) {
            assert.lengthOf(elements, 1, "No breadcrumbs were rendered on page load");
         }); 
   };

   var checkInitialBreadcrumbText = function(browser) {
      return browser.findByCssSelector(".alfresco-documentlibrary-AlfBreadcrumb .breadcrumb")
         .getVisibleText()
         .then(function(text) {
            assert.equal(text, "Documents", "The initial breadcrumb was rendered incorrectly");
         });
   };

   var clickOnFolderLink = function(browser) {
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

   var checkAddedBreadcrumbText = function(browser) {
      return browser.findByCssSelector("#DOCLIB_BREADCRUMB_TRAIL .alfresco-documentlibrary-AlfBreadcrumb:nth-child(2) .breadcrumb")
         .getVisibleText()
         .then(function(text) {
            assert.equal(text, "DetailedView", "The added breadcrumb was not rendered correctly");
         });
   };

   var returnToRoot = function(browser) {
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

   var switchToFilter = function(browser, pubSubScope) {
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
   registerSuite(function(){
      var browser;

      return {
         name: "Document Library Test (dummy load)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/DocLib", "Document Library Test (dummy load)", null, true).end();
         }
         
      };
   });

   registerSuite(function(){
      var browser;

      return {
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
               return countInitialBreadcrumbs(browser);
            });
         },

         "Check the initial breadcrumb text": function() {
            return browser.then(function() {
               return checkInitialBreadcrumbText(browser);
            });
         },

         "Click on a folder link and check for updated breadcrumb": function() {
            return browser.then(function() {
               return clickOnFolderLink(browser);
            });
         },

         "Check the added breadcrumb text": function() {
            return browser.then(function() {
               return checkAddedBreadcrumbText(browser);
            });
         },

         "Use the breadcrumb trail to return to the root": function() {
            return browser.then(function() {
               return returnToRoot(browser);
            });
         },

         "Switch to favourites filter": function() {
            return browser.then(function() {
               return switchToFilter(browser, "SCOPED_");
            });
         },

         // NOTE: The following tests don't need to be duplicated across both hashing and non-hashing
         //       Document Libraries
         "Delete item in scoped document library": function() {
            return browser.findById("DETAILED_VIEW_ACTIONS_ITEM_0_MENU_text")
               .clearLog()
               .click()
            .end()

            .findDisplayedById("DETAILED_VIEW_ACTIONS_ITEM_0_document-delete_text")
               .click()
            .end()

            .findDisplayedById("ALF_DELETE_CONTENT_DIALOG_CONFIRMATION_label")
               .click()
            .end()

            .getLastPublish("SCOPED_ALF_DOCLIST_RELOAD_DATA", "Scoped reload request not published");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
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
               return countInitialBreadcrumbs(browser);
            });
         },

         "Check the initial breadcrumb text": function() {
            return browser.then(function() {
               return checkInitialBreadcrumbText(browser);
            });
         },

         "Click on a folder link and check for updated breadcrumb": function() {
            return browser.then(function() {
               return clickOnFolderLink(browser);
            });
         },

         "Check the added breadcrumb text": function() {
            return browser.then(function() {
               return checkAddedBreadcrumbText(browser);
            });
         },

         "Use the breadcrumb trail to return to the root": function() {
            return browser.then(function() {
               return returnToRoot(browser);
            });
         },

         "Switch to favourites filter": function() {
            return browser.then(function() {
               return switchToFilter(browser, "");
            });
         },

         // NOTE: These tests do not need to be duplicated across both non-hashing and hashing Document Libraries
         
         "Select items and switch views": function() {
            // Select an item and make sure it is shown as selected...
            return browser.findByCssSelector("#DETAILED_VIEW_SELECTOR_ITEM_0")
               .click()
            .end()
            .findByCssSelector("#DETAILED_VIEW_SELECTOR_ITEM_0.alfresco-lists-ItemSelectionMixin--selected")
            .end()

            // Select another item and make sure it is shown as selected...
            .findByCssSelector("#DETAILED_VIEW_SELECTOR_ITEM_2")
               .click()
            .end()
            .findByCssSelector("#DETAILED_VIEW_SELECTOR_ITEM_2.alfresco-lists-ItemSelectionMixin--selected")
            .end()

            // Clear the log so that we can tell when view switching is complete...
            .clearLog()

            // Open the config menu...
            .findByCssSelector("#DOCLIB_CONFIG_MENU img.alf-configure-icon")
               .click()
            .end()

            // Select a new view...
            .findByCssSelector("#DOCLIB_CONFIG_MENU_VIEW_SELECT_GROUP tr:nth-child(1) td.dijitMenuItemLabel")
               .click()
            .end()

            // Check selected files publication occurs...
            .getLastPublish("ALF_SELECTED_FILES_CHANGED")
            .end()

            // Check the item selection has been retained...
            .findAllByCssSelector("#SIMPLE_VIEW_SELECTOR_ITEM_0.alfresco-lists-ItemSelectionMixin--selected")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Item 0 selection was not retained switching views");
               })
            .end()

            .findAllByCssSelector("#SIMPLE_VIEW_SELECTOR_ITEM_2.alfresco-lists-ItemSelectionMixin--selected")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Item 2 selection was not retained switching views");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });

   registerSuite(function(){
      var browser;

      return {
         name: "Document Library Test (raw data)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/DocLibRawData", "Document Library Test (raw data)").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Delete item in scoped document library": function() {
            return browser.findDisplayedById("DETAILED_VIEW_ACTIONS_ITEM_0_MENU_text")
               .clearLog()
               .click()
            .end()

            .findDisplayedById("DETAILED_VIEW_ACTIONS_ITEM_0_DELETE_text")
               .click()
            .end()

            .findDisplayedById("ALF_DELETE_CONTENT_DIALOG_CONFIRMATION_label")
               .click()
            .end()

            .getLastPublish("SCOPED_ALF_DOCLIST_RELOAD_DATA", "Scoped reload request not published");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});