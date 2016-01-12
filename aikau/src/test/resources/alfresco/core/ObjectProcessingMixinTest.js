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
 * @author Martin Doyle
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"],
        function (registerSuite, assert, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "ObjectProcessingMixin Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ObjectProcessingMixin", "ObjectProcessingMixin Tests");
      },

      beforeEach: function() {
         browser.end();
      },

      "Trying to process a recursive object succeeds and can be used as payload": function() {
         return browser.findById("PROCESS_RECURSIVE")
            .click()
            .end()

         .getLastPublish("GENERATED", true)
            .then(function(payload) {
               assert.deepPropertyVal(payload, "obj1.obj2", "[recursive object]");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});