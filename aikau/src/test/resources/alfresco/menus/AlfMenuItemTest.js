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
      name: "AlfMenuItem Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfMenuItem", "AlfMenuItem Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check processed payload": function() {
         return browser.findByCssSelector("#MENU_BAR_POPUP_text")
            .click()
         .end()
         .findByCssSelector("#PROCESS_PAYLOAD_MENU_ITEM_text")
            .click()
         .end()
         .getLastPublish("PROCESSED_PAYLOAD")
         .then(function(payload) {
            assert.propertyVal(payload, "value", "test", "Processed payload not generated correctly");
         });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});