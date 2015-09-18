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
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "ViewPreferencesGroup Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ViewPreferencesGroup", "ViewPreferencesGroup Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Set an initial node": function() {
         // Click the first button to set a node (that has a default view that is the current view)...
         // Remove should be shown with correct label
         // Add should not be shown (because it's the current default)
         return browser.findByCssSelector("#SET_METADATA_1_label")
            .click()
         .end()
         .findByCssSelector("#DROP_DOWN_MENU_text")
            .click()
         .end()
         .findByCssSelector("#REMOVE_DEFAULT_DOCUMENT_LIST_VIEW_text")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The remove menu item was not displayed");
            });
      },

      "Check remove label is correct": function() {
         return browser.findByCssSelector("#REMOVE_DEFAULT_DOCUMENT_LIST_VIEW_text")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Remove \"View 1\" as the default view for this folder", "The remove label was not updated correctly");
            });
      },

      "Check that the add menu item is hidden": function() {
         return browser.findByCssSelector("#SET_DEFAULT_DOCUMENT_LIST_VIEW_text")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The add menu item was displayed unexpectedly");
            });
      },

      "Remove the default view": function() {
         return browser.findByCssSelector("#REMOVE_DEFAULT_DOCUMENT_LIST_VIEW_text")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_UPDATE_CONTENT_REQUEST", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Request to remove default view not found");
            })
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "nodeRef"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "some://node/one", "Wrong nodeRef");
            });
         // .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "prop_app_defaultViewId"))
         //    .getVisibleText()
         //    .then(function(text) {
         //       assert.equal(text, "", "Unexpected default view");
         //    });
      },

      "Change the view": function() {
         // Remove should still be shown
         // Add should also be shown (because the current view is not the default view)
         return browser.findByCssSelector("#SET_VIEW_2_text")
            .click()
         .end()
         .findByCssSelector("#DROP_DOWN_MENU_text")
            .click()
         .end()
         .findByCssSelector("#SET_DEFAULT_DOCUMENT_LIST_VIEW_text")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The set menu item was not displayed");
            });
      },

      "Check that the remove menu item is still shown": function() {
          return browser.findByCssSelector("#REMOVE_DEFAULT_DOCUMENT_LIST_VIEW_text")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The remove menu item was not displayed");
            });
      },

      "Set default view": function() {
         return browser.findByCssSelector("#SET_DEFAULT_DOCUMENT_LIST_VIEW_text")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_UPDATE_CONTENT_REQUEST", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Request to remove default view not found");
            })
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "nodeRef"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "some://node/one", "Wrong nodeRef");
            });
      },

      "Change the view back": function() {
         // Remove should still be shown
         // Add should not be shown (because the new node has a default view)
         return browser.findByCssSelector("#SET_VIEW_1_text")
            .click()
         .end()
         .findByCssSelector("#DROP_DOWN_MENU_text")
            .click()
         .end()
         .findByCssSelector("#SET_DEFAULT_DOCUMENT_LIST_VIEW_text")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The set menu item was displayed unexpectedly");
            });
      },

      "Change the node to check view is changed": function() {
         return browser.findByCssSelector("#SET_METADATA_2_label")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_DOCLIST_SELECT_VIEW", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "View selection publication for default folder view not found");
            })
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "value"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "VIEW2", "The default folder view was not requested");
            });
      },

      "Change to unowned node with default view": function() {
         // The menu items should both be hidden
         // Default view should be requested
         return browser.findByCssSelector("#SET_METADATA_3_label")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_DOCLIST_SELECT_VIEW", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "View selection publication for default folder view not found");
            })
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "value"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "VIEW1", "The default folder view was not requested");
            });
      },

      "Check that group is hidden for folders not owned by user": function() {
         return browser.findByCssSelector("#VPG1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The group should not be displayed");
            });
      },

      "Change to unowned node without default view": function() {
         // The menu items should still be hidden
         // The user preferred view should be requested
         return browser.findByCssSelector("#SET_METADATA_4_label")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("ALF_DOCLIST_SELECT_VIEW", "publish", "last"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "View selection publication for user preferred view not found");
            })
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "value"))
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "VIEW3", "The user preferred view was not requested");
            });
      },

      "Simulate filter": function() {
         // When a filter is requested there will be no node to set default views on...
         return browser.findByCssSelector("#SET_METADATA_5_label")
            .click()
         .end()
         .findByCssSelector("#VPG1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The group should not be displayed");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});