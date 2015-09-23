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
 * @author Martin Doyle
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function(registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Service Registry Test",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ServiceRegistry", "Service Registry Test")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check for duplicate global scope subscriptions": function() {
         return browser.findByCssSelector("body")
            .getLogEntries({
               type: "SUBSCRIBE",
               topic: "ALF_NAVIGATE_TO_PAGE",
               pos: "all"
            }, true)
            .then(function(subscriptions) {
               assert.lengthOf(subscriptions, 1, "Multiple global scope subscriptions");
            });
      },

      "Check for duplicate scope subscriptions (SCOPE1_)": function() {
         return browser.findByCssSelector("body")
            .getLogEntries({
               type: "SUBSCRIBE",
               topic: "SCOPE1_ALF_NAVIGATE_TO_PAGE",
               pos: "all"
            }, true)
            .then(function(subscriptions) {
               assert.lengthOf(subscriptions, 1, "Multiple global scope subscriptions");
            });
      },

      "Check for duplicate scope subscriptions (SCOPE2_)": function() {
         return browser.findByCssSelector("body")
            .getLogEntries({
               type: "SUBSCRIBE",
               topic: "SCOPE1_ALF_NAVIGATE_TO_PAGE",
               pos: "all"
            }, true)
            .then(function(subscriptions) {
               assert.lengthOf(subscriptions, 1, "Multiple global scope subscriptions");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});