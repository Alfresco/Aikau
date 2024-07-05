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
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, TestCommon) {

   var actionsSelectors = TestCommon.getTestSelectors("alfresco/renderers/Actions");
   defineSuite(module, {
      name: "Manage Aspects Action",
      testPage: "/ManageAspectsAction",

      "Check that action appears for basic node": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 0]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_0_MANAGE_ASPECTS")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find manage aspects action for basic node");
            });
      },

      "Check that action does not appear for working copy node": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 1]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_1_MANAGE_ASPECTS")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Manage aspects action should not have been displayed for working copy node");
            });
      },

      "Check that action does not appear for locked node": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 2]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_2_MANAGE_ASPECTS")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Manage aspects action should not have been displayed for locked node");
            });
      },

      "Check that action does not appear for node without WRITE permission": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 3]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_3_MANAGE_ASPECTS")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Manage aspects action should not have been displayed for node without user WRITE permission");
            });
      },

      "Check that manage aspects dialog can be opened": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 0]);
         return this.remote.findByCssSelector(actionsSelector)
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
      }
   });
});