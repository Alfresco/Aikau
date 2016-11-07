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

   var formSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
   var formControlSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/BaseFormControl");
   var checkBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/CheckBox");

   var selectors = {
      form: {
         confirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button", ["FORM"]),
         disabledConfirmationButton: TestCommon.getTestSelector(formSelectors, "confirmation.button.disabled", ["FORM"])
      },
      checkBoxes: {
         revealTree: {
            checkBox: TestCommon.getTestSelector(checkBoxSelectors, "checkbox", ["REVEAL_TREE"]),
            label: TestCommon.getTestSelector(formControlSelectors, "label", ["REVEAL_TREE"])
         }
      }
   };


   defineSuite(module, {
      name: "Tree (form control) Tests",
      testPage: "/TreeField",

      // Tests the addition of "validateWhenHidden" attribute...
      "Confirmation button is initially disable": function() {
         return this.remote.findDisplayedByCssSelector(selectors.form.disabledConfirmationButton);
      },

      "Show the tree": function() {
         return this.remote.findByCssSelector(selectors.checkBoxes.revealTree.checkBox)
            .click()
         .end()

         .findDisplayedById("TREE");
      },

      "templates folder is disabled": function() {
         // The 'templates' folder should be disabled because the mock data should show that it has the
         // sync:synced aspect applied to it, this should be matched by the treeNodeDisablementConfig
         return this.remote.findDisplayedByCssSelector("#TREE_TREE_TREE_workspace_SpacesStore_1a9af076-12fc-4dde-b7a5-2c9237ebb7fa.alfresco-navigation-Tree__node--disabled");
      },

      "Clicking on a disabled node does not select it": function() {
         return this.remote.findByCssSelector("#TREE_TREE_TREE_workspace_SpacesStore_1a9af076-12fc-4dde-b7a5-2c9237ebb7fa.alfresco-navigation-Tree__node--disabled .dijitTreeLabel")
            .clearLog()
            .click()
         .end()

         .getAllPublishes("_valueChangeOf_TREE")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "Tree value shouldn't change when clicking on disabled node");
            })
         .end()

         .findDisplayedByCssSelector(selectors.form.disabledConfirmationButton);
      },

      "Clicking an enabled node selects it": function() {
         return this.remote.findByCssSelector("#TREE_TREE_TREE_workspace_SpacesStore_b123c9e2-24db-4f33-aaa1-58c4a37697fc .dijitTreeLabel")
            .click()
         .end()

         .getLastPublish("_valueChangeOf_TREE")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "value.nodeRef", "workspace://SpacesStore/b123c9e2-24db-4f33-aaa1-58c4a37697fc");
            });
      },

      "Confirmation button is enabled after selecting a node": function() {
         return this.remote.findAllByCssSelector(selectors.form.disabledConfirmationButton)
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            }); 
      }

   });
});