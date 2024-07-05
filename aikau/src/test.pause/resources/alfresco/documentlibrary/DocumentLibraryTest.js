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
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   var actionsSelectors = TestCommon.getTestSelectors("alfresco/renderers/Actions");
   var selectors = {
      actions: {
         first: {
            label: TestCommon.getTestSelector(actionsSelectors, "nth.label", ["DETAILED_VIEW_ACTIONS", "0"]),
            dropDown: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["DETAILED_VIEW_ACTIONS", "0"]),
            action: TestCommon.getTestSelector(actionsSelectors, "nth.dropdown.actions", ["DETAILED_VIEW_ACTIONS", "0"])
         }
      }
   };

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
         })
         .end();
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
         })
         .end()
         .getLastPublish(pubSubScope + "ALF_DOCLIST_REQUEST_FINISHED");
   };

   var hashObjFromUrl = function(url) {
      var hashString = url.substr(url.lastIndexOf("#") + 1),
         hashParams = hashString.split("&");
      return hashParams.reduce(function(hashObj, nextParam) {
         var keyVal = nextParam.split("=");
         hashObj[keyVal[0]] = keyVal[1];
         return hashObj;
      }, {});
   };

   // NOTE: For some as yet undetermined reason the first time we attempt to load the Document Library test page
   //       with clear dependency caches it will fail. Therefore we register a dummy test suite that absorbs this
   //       failure so that subsequent tests can pass.
   defineSuite(module, {
      name: "Document Library Test (dummy load)",

      setup: function() {
         return TestCommon.loadTestWebScript(this.remote, "/DocLib", "Document Library Test (dummy load)", null, true);
      }

   });

   defineSuite(module, {
      name: "Document Library Test (default)",
      testPage: "/DocLib",

      "Count the initial breadcrumbs": function() {
         return this.remote.then(() => {
            return countInitialBreadcrumbs(this.remote);
         });
      },

      "Check the initial breadcrumb text": function() {
         return this.remote.then(() => {
            return checkInitialBreadcrumbText(this.remote);
         });
      },

      "Click on a folder link and check for updated breadcrumb": function() {
         return this.remote.then(() => {
               return clickOnFolderLink(this.remote);
            })
            .getCurrentUrl()
            .then(function(currentUrl) {
               var currHash = hashObjFromUrl(currentUrl);
               assert.propertyVal(currHash, "path", "%2FDetailedView", "Hash does not have correct path parameter");
            });
      },

      "Check the added breadcrumb text": function() {
         return this.remote.then(() => {
            return checkAddedBreadcrumbText(this.remote);
         });
      },

      "Use the breadcrumb trail to return to the root": function() {
         return this.remote.then(() => {
            return returnToRoot(this.remote);
         });
      },

      "Upload is enabled for path view": function() {
         return this.remote.findDisplayedByCssSelector(".alfresco-documentlibrary-AlfDocumentList--upload-enabled");
      },

      "Switch to favourites filter": function() {
         return this.remote.then(() => {
               return switchToFilter(this.remote, "SCOPED_");
            })
            .getCurrentUrl()
            .then(function(currentUrl) {
               var currHash = hashObjFromUrl(currentUrl);
               assert.propertyVal(currHash, "filter", "favourites", "Hash does not have correct filter parameter");
               assert.propertyVal(currHash, "description", "My%20Favorite%20Files%20and%20Folders", "Hash does not have correct description parameter");
            });
      },

      "Upload is disabled for filter view": function() {
         return this.remote.findAllByCssSelector(".alfresco-documentlibrary-AlfDocumentList--upload-enabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      // NOTE: The following tests don't need to be duplicated across both hashing and non-hashing Document Libraries

      "Delete item in scoped document library": function() {
         return this.remote.findByCssSelector(selectors.actions.first.label)
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

      "Changing hash to path loads path": function() {
         return this.remote.get(TestCommon.generateWebscriptUrl("/DocLib#currentPage=1&path=%2FDetailedView%2F"))
            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")
            .getCurrentUrl()
            .then(function(currentUrl) {
               var currHash = hashObjFromUrl(currentUrl);
               assert.propertyVal(currHash, "path", "%2FDetailedView%2F", "Hash does not have correct path parameter");
            });
      }
   });

   defineSuite(module, {
      name: "Document Library Test (no URL hashing)",
      testPage: "/DocLibNoHash",

      "Count the initial breadcrumbs": function() {
         return this.remote.then(() => {
            return countInitialBreadcrumbs(this.remote);
         });
      },

      "Check the initial breadcrumb text": function() {
         return this.remote.then(() => {
            return checkInitialBreadcrumbText(this.remote);
         });
      },

      "Click on a folder link and check for updated breadcrumb": function() {
         return this.remote.then(() => {
            return clickOnFolderLink(this.remote);
         });
      },

      "Check the added breadcrumb text": function() {
         return this.remote.then(() => {
            return checkAddedBreadcrumbText(this.remote);
         });
      },

      "Use the breadcrumb trail to return to the root": function() {
         return this.remote.then(() => {
            return returnToRoot(this.remote);
         });
      },

      "Switch to favourites filter": function() {
         return this.remote.then(() => {
            return switchToFilter(this.remote, "");
         });
      },

      // NOTE: These tests do not need to be duplicated across both non-hashing and hashing Document Libraries

      "Select items and switch views": function() {
         // Select an item and make sure it is shown as selected...
         return this.remote.findByCssSelector("#DETAILED_VIEW_SELECTOR_ITEM_0")
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
      }
   });

   defineSuite(module, {
      name: "Document Library Test (raw data)",
      testPage: "/DocLibRawData",

      "Delete item in scoped document library": function() {
         return this.remote.findDisplayedByCssSelector(selectors.actions.first.label)
            .getLastPublish("ALF_DOCLIST_REQUEST_FINISHED")
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
      }
   });
});