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

   var shouldBeRendered = function(browser, index) {
      var actionSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", index]);
      var dropDownSelector = TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["ACTIONS", index]);
      return browser.findByCssSelector(actionSelector)
         .click()
         .end()

      .findDisplayedByCssSelector(dropDownSelector)
         .end()

      .findDisplayedById("ACTIONS_ITEM_" + index + "_UPLOAD_NEW_VERSION");
   };

   var shouldNotBeRendered = function(browser, index) {
      var actionSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", index]);
      var dropDownSelector = TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["ACTIONS", index]);
      return browser.findByCssSelector(actionSelector)
         .click()
         .end()

      .findDisplayedByCssSelector(dropDownSelector)
         .end()

      .findAllByCssSelector("#ACTIONS_ITEM_" + index + "_UPLOAD_NEW_VERSION")
         .then(function(elements) {
            assert.lengthOf(elements, 0, "Upload new version action shouldn't be rendered");
         });
   };

   defineSuite(module, {
      name: "Upload New Version Action Test",
      testPage: "/UploadNewVersionAction",

      "Check folder": function() {
         return shouldNotBeRendered(this.remote, 0);
      },

      "Check basic node": function() {
         return shouldBeRendered(this.remote, 1);
      },

      "Check working copy owner by user": function() {
         return shouldBeRendered(this.remote, 2);
      },

      "Check working copy owner by another user": function() {
         return shouldNotBeRendered(this.remote, 3);
      },

      "Check node locked by user": function() {
         return shouldBeRendered(this.remote, 4);
      },

      "Check node locked by another user": function() {
         return shouldNotBeRendered(this.remote, 5);
      },

      "Check node with node lock": function() {
         return shouldNotBeRendered(this.remote, 6);
      },

      "Check node without Write permission": function() {
         return shouldNotBeRendered(this.remote, 7);
      },

      "Upload a new verion": function() {
         var actionSelector = TestCommon.getTestSelector(actionsSelectors, "nth.label", ["ACTIONS", 1]);
         var dropDownSelector = TestCommon.getTestSelector(actionsSelectors, "nth.dropdown", ["ACTIONS", 1]);

         return this.remote.findByCssSelector(actionSelector)
            .click()
            .end()

         .findDisplayedByCssSelector(dropDownSelector)
            .end()

         .findById("ACTIONS_ITEM_1_UPLOAD_NEW_VERSION")
            .click()
            .end()

         // Give the dialog a chance to appear...
         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogDisplayed")
            .end()

         // Check this is an update (rather than just upload) dialog...
         .findAllByCssSelector(".alfresco-dialog-AlfDialog .alfresco-forms-controls-RadioButtons")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Version increment options should be displayed");
            });
      }
   });
});