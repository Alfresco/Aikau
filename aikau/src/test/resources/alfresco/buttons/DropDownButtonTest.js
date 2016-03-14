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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   defineSuite(module, {
      name: "Drop Down Button Tests",
      testPage: "/DropDownButtons",

      "Open left drop-down": function() {
         return this.remote.findById("DDB1_DROP_DOWN_BUTTON_label")
            .click()
            .end()

         .findDisplayedById("DDB1_DROP_DOWN_DISPLAY")
            .end()

         .findDisplayedById("TB1")
            .end()

         .findDisplayedById("TB1");
      },

      "Click button to close left drop-down": function() {
         return this.remote.findDisplayedByCssSelector("#FORM .confirmationButton > span")
            .click()
            .end()

         .getLastPublish("SAVE")

         .findById("DDB1_DROP_DOWN_DISPLAY")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            });
      },

      "Tab to and open right, drop-down": function() {
         return this.remote.findByCssSelector("body")
            .tabToElement("#DDB2_DROP_DOWN_BUTTON")
            .pressKeys(keys.ENTER)
            .end()

         .findDisplayedById("DDB2_DROP_DOWN_DISPLAY");
      },

      "Press escape to close drop-down": function() {
         return this.remote.pressKeys(keys.ESCAPE)
            .findById("DDB2_DROP_DOWN_DISPLAY")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            });
      }
   });
});