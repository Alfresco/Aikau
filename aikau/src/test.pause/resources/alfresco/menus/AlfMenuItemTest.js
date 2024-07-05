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
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "AlfMenuItem Tests",
      testPage: "/AlfMenuItem",

      "Check title encoding (popup)": function() {
         return this.remote.findById("MENU_BAR_POPUP")
            .getAttribute("title")
            .then(function(title) {
               assert.equal(title, "Workflows que j'ai initiés");
            });
      },

      "Check title (menu item)": function() {
         return this.remote.findByCssSelector("#MENU_BAR_POPUP_text")
            .click()
            .end()

         .findByCssSelector(".alfresco-menus-_AlfMenuItemMixin")
            .getAttribute("title")
            .then(function(title) {
               assert.equal(title, "Workflows que j'ai initiés");
            });
      },

      "Check processed payload": function() {
         return this.remote.findByCssSelector("#PROCESS_PAYLOAD_MENU_ITEM_text")
            .click()
            .end()

         .getLastPublish("PROCESSED_PAYLOAD")

         .then(function(payload) {
            assert.propertyVal(payload, "value", "test", "Processed payload not generated correctly");
         });
      }
   });
});