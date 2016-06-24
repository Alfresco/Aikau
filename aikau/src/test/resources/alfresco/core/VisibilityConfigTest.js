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
        "intern/chai!expect",
        "intern/chai!assert"],
        function(module, defineSuite, expect, assert) {

   defineSuite(module, {
      name: "VisibilityConfig Tests",
      testPage: "/VisibilityConfig",

      "Check LOGO1 is initially displayed": function() {
         // Test 1: Check that LOGO1 is initially displayed and that LOGO2 is initially hidden...
         return this.remote.findAllByCssSelector("#LOGO1")
            .then(function(els) {
               assert.lengthOf(els, 1, "LOGO1 was unexpectedly hidden");
            });
      },

      "Check that LOGO2 was hidden": function() {
         return this.remote.findByCssSelector("#LOGO2")
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "none", "LOGO2 was displayed unexpectedly");
            });
      },

      "Check that LOGO1 was gets hidden": function() {
         // Test 2: Check that LOGO1 can be hidden can then displayed by isNot rules
         return this.remote.findByCssSelector("#HIDE_LOGO_1")
            .click()
         .end()
      
         .findByCssSelector("#LOGO1")
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "none", "LOGO1 was not hidden");
            });
      },

      "Check that LOGO1 gets revealed": function() {
         return this.remote.findByCssSelector("#SHOW_LOGO_1")
            .click()
         .end()
         
         .findByCssSelector("#LOGO1")
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "block", "LOGO1 was not revealed");
            });
      },

      "Check that LOGO2 gets revealed": function() {
         // Test 3: Check that LOGO2 can be displayed and then hidden by is rules
         return this.remote.findByCssSelector("#SHOW_LOGO_2_A")
            .click()
         .end()
      
         .findByCssSelector("#LOGO2")
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "block", "LOGO2 was not revealed");
            });
      },

      "Check that LOGO2 gets hidden": function() {
         return this.remote.findByCssSelector("#HIDE_LOGO_2")
            .click()
         .end()
      
         .findByCssSelector("#LOGO2")
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "none", "LOGO2 was not hidden");
            });
      },

      "Check that LOGO2 gets revealed again": function() {
         return this.remote.findByCssSelector("#SHOW_LOGO_2_B")
            .click()
         .end()
      
         .findByCssSelector("#LOGO2")
            .getComputedStyle("display")
            .then(function(result) {
               assert.equal(result, "block", "LOGO2 was not revaled again");
            });
      }
   });
});