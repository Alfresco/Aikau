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
      name: "Menu Bar Orientation Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/MenuBarOrientation", "Menu Bar Orientation Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check that menu 1 appears above the menu bar": function() {
         var menuTop;
         return browser.findByCssSelector("#POPUP_MENU_text")
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
         return browser.findByCssSelector("#DROPDOWN_MENU_text")
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
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});