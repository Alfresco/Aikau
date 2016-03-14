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
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Menu Bar Orientation Tests",
      testPage: "/MenuBarOrientation",

      "Check that menu 1 appears above the menu bar": function() {
         var menuTop;
         return this.remote.findByCssSelector("#POPUP_MENU_text")
            .getPosition()
            .then(function(pos) {
               menuTop = pos.y;
            })
            .click()
            .end()
            .findByCssSelector("#POPUP_MENU_dropdown")
            .getPosition()
            .then(function(pos) {
               assert(pos.y < menuTop, "Popup was not displayed above the menu bar");
            });
      },

      "Check that menu 2 appears below the menu bar": function() {
         var menuTop;
         return this.remote.findByCssSelector("#DROPDOWN_MENU_text")
            .getPosition()
            .then(function(pos) {
               menuTop = pos.y;
            })
            .click()
            .end()
            .findByCssSelector("#DROPDOWN_MENU_dropdown")
            .getPosition()
            .then(function(pos) {
               assert(pos.y > menuTop, "Popup was not displayed below the menu bar");
            });
      }
   });
});