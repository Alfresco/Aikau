/*jshint browser:true*/
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
 * @since 1.0.85
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "User Renderer Tests",
      testPage: "/User",

      "No delimiters in value shows userName": function() {
         return this.remote.findDisplayedByCssSelector("#USER1")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "test");
            });
      },

      "Single delimiter in value shows firstName only": function() {
         return this.remote.findDisplayedByCssSelector("#USER2")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Administrator");
            });
      },

      "Two delimiters in value shows full displayName only": function() {
         return this.remote.findDisplayedByCssSelector("#USER3")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Alice Beecher");
            });
      },

      "Clicking name publishes expected values": function() {
         return this.remote.findDisplayedByCssSelector("#USER3 .inner .value")
            .click()
         .end()

         .getLastPublish("USER3")
            .then(function(payload) {
               assert.propertyVal(payload, "userIs", "abeecher");
               assert.propertyVal(payload, "displayedAs", "Alice Beecher");
            });
      }
   });
});