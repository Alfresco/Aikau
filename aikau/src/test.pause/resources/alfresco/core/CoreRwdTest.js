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
 * This test assesses the CoreRwd mixin as applied to AlfMenuBarPopup
 *
 * @author Richard Smith
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!expect"],
        function(module, defineSuite, expect) {

   defineSuite(module, {
      name: "CoreRwd Tests",
      testPage: "/CoreRwd",

      "Check the dropdown is not hidden": function() {
         return this.remote.findById("DROP_DOWN_MENU_1")
            .getAttribute("class")
            .then(function(classes1) {
               expect(classes1).to.not.contain("hidden", "The dropdown should not have class 'hidden'");
            });
      },

      "Check the dropdown is visible": function() {
         return this.remote.findById("DROP_DOWN_MENU_1")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(true, "The dropdown should be visible");
            });
      },

      "Check the dropdown is hidden": function() {
         return this.remote.setWindowSize(null, 700, 400)
            .findById("DROP_DOWN_MENU_1")
            .getAttribute("class")
            .then(function(classes2) {
               expect(classes2).to.contain("hidden", "The dropdown should have class 'hidden'");
            });
      },

      "Check the dropdown is not visible": function() {
         return this.remote.findById("DROP_DOWN_MENU_1")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(false, "The dropdown should not be visible");
            });
      },

      "Check the dropdown is not hidden again": function() {
         return this.remote.setWindowSize(null, 1024, 768)
            .findById("DROP_DOWN_MENU_1")
            .getAttribute("class")
            .then(function(classes3) {
               expect(classes3).to.not.contain("hidden", "The dropdown should not have class 'hidden'");
            });
      },

      "Check the dropdown is visible again": function() {
         return this.remote.findById("DROP_DOWN_MENU_1")
            .isDisplayed()
            .then(function(displayed) {
               expect(displayed).to.equal(true, "Test #1f - The dropdown should be visible again");
            });
      }
   });
});