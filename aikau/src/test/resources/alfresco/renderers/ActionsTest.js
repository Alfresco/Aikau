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
      name: "Action Renderer Test",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ActionsRenderer", "Action Renderer Test").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Count REST API actions": function() {
         return browser.findByCssSelector("#REST_ACTIONS_ITEM_0_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#REST_ACTIONS_ITEM_0_GROUP tr")
            .then(function(elements) {
               assert.lengthOf(elements, 10, "Unexpected number of REST API actions rendered");
            });
      },

      "Count custom actions": function() {

         return browser.findByCssSelector("#CUSTOM_ACTIONS_ITEM_0_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#CUSTOM_ACTIONS_ITEM_0_GROUP tr")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Unexpected number of custom actions rendered");
            });
      },

      "Count filtered merged actions": function() {

         return browser.findByCssSelector("#MERGED_ACTIONS_ITEM_0_MENU_text")
            .click()
         .end()
         .findAllByCssSelector("#MERGED_ACTIONS_ITEM_0_GROUP tr")
            .then(function(elements) {
               assert.lengthOf(elements, 5, "Unexpected number of filtered merged REST API and custom actions rendered");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});