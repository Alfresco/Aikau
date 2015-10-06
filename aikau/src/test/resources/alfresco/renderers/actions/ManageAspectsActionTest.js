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
 * 
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
      name: "Manage Aspects Action",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ManageAspectsAction", "Manage Aspects Action").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check that action appears for basic node": function() {
         return browser.findByCssSelector("#ACTIONS_ITEM_0_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#ACTIONS_ITEM_0_MANAGE_ASPECTS")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find manage aspects action for basic node");
            });
      },

      "Check that action does not appear for working copy node": function() {
         return browser.findByCssSelector("#ACTIONS_ITEM_1_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#ACTIONS_ITEM_1_MANAGE_ASPECTS")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Manage aspects action should not have been displayed for working copy node");
            });
      },

      "Check that action does not appear for locked node": function() {
         return browser.findByCssSelector("#ACTIONS_ITEM_2_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#ACTIONS_ITEM_2_MANAGE_ASPECTS")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Manage aspects action should not have been displayed for locked node");
            });
      },

      "Check that action does not appear for node without WRITE permission": function() {
         return browser.findByCssSelector("#ACTIONS_ITEM_3_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#ACTIONS_ITEM_3_MANAGE_ASPECTS")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Manage aspects action should not have been displayed for node without user WRITE permission");
            });
      },

      "Check that manage aspects dialog can be opened": function() {
         return browser.findByCssSelector("#ACTIONS_ITEM_0_MENU_text")
            .click()
         .end()
         .findByCssSelector("#ACTIONS_ITEM_0_MANAGE_ASPECTS_text")
            .click()
         .end()
         .setFindTimeout(10000)
         .findAllByCssSelector("#ALF_MANAGE_ASPECTS_DIALOG.dialogDisplayed")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The manage aspects dialog was not displayed");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});