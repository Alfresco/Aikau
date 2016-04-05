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
      name: "Delete Action Test",
      testPage: "/Delete",

      "Check that action appears for folder node": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 0]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_0_DELETE")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find delete action for folder node");
            });
      },

      "Check that action appears for document node": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 1]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_1_DELETE")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find delete action for document node");
            });
      },

      "Check that action appears for user owned working copy": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 2]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_2_DELETE")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find delete action for user owned working copy");
            });
      },

      "Check that action does not appear for working copy owned by another user": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 3]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_3_DELETE")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Delete action should not have been displayed for working copy owned by another user");
            });
      },

      "Check that action appears for user owned locked node": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 4]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_4_DELETE")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find delete action for user locked node");
            });
      },

      "Check that action does not appear for node locked by another user": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 5]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_5_DELETE")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Delete action should not have been displayed for node locked by another user");
            });
      },

      "Check that action does not appear for node with node lock": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 6]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_6_DELETE")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Delete action should not have been displayed for node locked with NODE_LOCK");
            });
      },

      "Check that action does not appear for node without write permission": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 7]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findAllByCssSelector("#ACTIONS_ITEM_7_DELETE")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Delete action should not have been displayed for node without write permission");
            });
      },

      "Test legacy single item delete": function() {
         return this.remote.findById("SINGLE_DELETE_VIA_ACTION_SERVICE_label")
            .click()
            .end()
            .findByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogDisplayed")
            .end()
            .findById("ALF_DELETE_CONTENT_DIALOG_CONFIRMATION_label")
            .click()
            .end()
            .findByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogHidden")
            .end()
            .getLastXhr("aikau/proxy/alfresco/slingshot/doclib/action/files?alf_method=delete")
            .then(function(xhr) {
               assert.deepPropertyVal(xhr.request.body, "nodeRefs[0]", "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4d");
            });
      },

      "Test legacy multiple item delete": function() {
         return this.remote.findById("MULTIPLE_DELETE_VIA_ACTION_SERVICE_label")
            .click()
            .end()
            .findByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogDisplayed")
            .end()
            .findById("ALF_DELETE_CONTENT_DIALOG_CONFIRMATION_label")
            .click()
            .end()
            .findByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogHidden")
            .end()
            .getLastXhr("aikau/proxy/alfresco/slingshot/doclib/action/files?alf_method=delete")
            .then(function(xhr) {
               assert.deepPropertyVal(xhr.request.body, "nodeRefs[0]", "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4e");
               assert.deepPropertyVal(xhr.request.body, "nodeRefs[1]", "workspace://SpacesStore/1a0b110f-1e09-4ca2-b367-fe25e4964a4f");
            });
      },

      "Test actions renderer item delete": function() {
         var actionsSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 0]);
         return this.remote.findByCssSelector(actionsSelector)
            .click()
            .end()
            .findByCssSelector("#ACTIONS_ITEM_0_DELETE_text")
            .click()
            .end()
            .findByCssSelector("#ALF_DELETE_CONTENT_DIALOG.dialogDisplayed")
            .end();
      }
   });
});