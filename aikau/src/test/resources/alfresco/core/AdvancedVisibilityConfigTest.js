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
      name: "Advanced VisibilityConfig Tests",
      testPage: "/AdvancedVisibilityConfig",

      "Check LOGO1 is initially displayed": function() {
         return this.remote.findByCssSelector("#LOGO1")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "LOGO1 was not initially displayed");
            });
      },

      "Check LOGO2 is initially displayed": function() {
         return this.remote.findByCssSelector("#LOGO2")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "LOGO2 was not initially displayed");
            });
      },

      "Check LOGO3 is initially displayed": function() {
         return this.remote.findByCssSelector("#LOGO3")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "LOGO3 was not initially displayed");
            });
      },

      "Check LOGO1 is still displayed (non-strict)": function() {
         return this.remote.findByCssSelector("#TEST_NON_STRICT_1")
            .click()
         .end()
         
         .findByCssSelector("#LOGO1")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "LOGO1 was hidden");
            });
      },

      "Check LOGO2 is still displayed (Current Item Rule)": function() {
         return this.remote.findByCssSelector("#HIDE_LOGO_2")
            .click()
         .end()
      
         .findByCssSelector("#LOGO2")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "LOGO2 was hidden");
            });
      },

      "Check LOGO3 is now hidden (Invisibility Rule)": function() {
         return this.remote.findByCssSelector("#HIDE_LOGO_3")
            .click()
         .end()
      
         .findByCssSelector("#LOGO3")
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "LOGO3 was still displayed");
            });
      },

      "Check LOGO3 is now displayed (Invisibility Rule)": function() {
         return this.remote.findByCssSelector("#SHOW_LOGO_3")
            .click()
         .end()
       
         .findByCssSelector("#LOGO3")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "LOGO3 was not displayed");
            });
      },

      "All scoped Logos should be initially displayed": function() {
         return this.remote.findDisplayedById("LOGO4")
         .end()

         .findDisplayedById("LOGO5")
         .end()

         .findDisplayedById("LOGO6")
         .end();
      },

      "Global scoped hide should only hide global scope subscribed logo": function() {
         return this.remote.findByCssSelector("#HIDE_LOGO_4_label")
            .click()
         .end()

         .findDisplayedById("LOGO5")
         .end()

         .findDisplayedById("LOGO6")
         .end()

         .findById("LOGO4")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            });
      },

      "Parent scoped hide should only hide parent scope subscribed logo": function() {
         return this.remote.findByCssSelector("#HIDE_LOGO_5_label")
            .click()
         .end()

         .findDisplayedById("LOGO6")
         .end()

         .findById("LOGO5")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            });
      },

      "Custom scoped hide should only hide custom scope subscribed logo": function() {
         return this.remote.findByCssSelector("#HIDE_LOGO_6_label")
            .click()
         .end()

         .findById("LOGO6")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            });
      }
   });
});