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
 * @since 1.0.66
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Selector Tests",
      testPage: "/Selector",

      "Selected items menu is initially disabled": function() {
         return this.remote.findDisplayedByCssSelector("#SELECTED_ITEMS.dijitDisabled").clearLog();
      },

      "Checking first selector enables items menu": function() {
         return this.remote.findByCssSelector("#SELECTOR_ITEM_0")
            .click()
         .end()

         .getLastPublish("ALF_DOCLIST_FILE_SELECTION")
            .then(function(payload) {
               assert.property(payload, "selectedItems");
            });
      },

      "Unchecking first selector disabled menu item": function() {
         return this.remote.findAllByCssSelector("#SELECTED_ITEMS.dijitDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            })
         .end()

         .clearLog()

         .findByCssSelector("#SELECTOR_ITEM_0")
            .click()
         .end()

         .getLastPublish("ALF_DOCLIST_FILE_SELECTION")
            .then(function(payload) {
               assert.property(payload, "selectedItems");
            })

         .findDisplayedByCssSelector("#SELECTED_ITEMS.dijitDisabled");
      },

      "Second selector is disabled": function() {
         return this.remote.findByCssSelector("#SELECTOR_ITEM_1.alfresco-lists-ItemSelectionMixin--disabled");
      },

      "Second selector cannot be selected": function() {
         return this.remote.findByCssSelector("#SELECTOR_ITEM_1")
            .click()
         .end()

         .findAllByCssSelector("#SELECTOR_ITEM_1.alfresco-lists-ItemSelectionMixin--selected")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      }
   });
});