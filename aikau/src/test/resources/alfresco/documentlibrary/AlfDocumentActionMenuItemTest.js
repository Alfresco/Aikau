/*jshint browser:true*/
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
 * @since 1.0.82
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "AlfDocumentActionMenuItem Tests",
      testPage: "/AlfDocumentActionMenuItem",

      "Select folder and start workflow action is hidden": function() {
         return this.remote.findDisplayedByCssSelector("#SELECTOR_ITEM_0")
            .click()
         .end()

         // Wait for the selected items menu to be enabled...
         .waitForDeletedByCssSelector("#SELECTED_ITEMS_MENU.dijitDisabled")
         .end()

         .findByCssSelector("#SELECTED_ITEMS_MENU_text")
            .click()
         .end()

         .findByCssSelector("#SELECTED_ITEMS_MENU_dropdown #onActionAssignWorkflow")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            });
      },

      "Select document (with folder still selected) and start workflow action is still hidden": function() {
         return this.remote.findDisplayedByCssSelector("#SELECTOR_ITEM_1")
            .click()
         .end()

         .findByCssSelector("#SELECTED_ITEMS_MENU_text")
            .click()
         .end()

         .findDisplayedByCssSelector("#SELECTED_ITEMS_MENU_dropdown")
            .findByCssSelector("#onActionAssignWorkflow")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed);
               });
      },

      "De-Select folder to reveal start workflow action": function() {
         return this.remote.findDisplayedByCssSelector("#SELECTOR_ITEM_0")
            .click()
         .end()

         .findByCssSelector("#SELECTED_ITEMS_MENU_text")
            .click()
         .end()

         .findDisplayedByCssSelector("#SELECTED_ITEMS_MENU_dropdown #onActionAssignWorkflow")
            .click();
      },

      "Cell width is correct": function() {
         return this.remote.findDisplayedByCssSelector("#SELECTOR_CELL_ITEM_0")
            .getSize()
            .then(function(size) {
               assert.equal(size.width, 35); // 20 + margin
            });
      }
   });
});