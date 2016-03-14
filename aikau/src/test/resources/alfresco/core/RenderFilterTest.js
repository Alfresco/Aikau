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
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   // The IDs that should be displayed are...
   // MBI1 - successful filter rule
   // MBI3 - negated rule
   // MBI4 - absent property
   // MBI5 - successful AND condition
   // MI1 - successful filter rule following inherited currentItem change

   // The IDs that should not be displayed are...
   // MBI2 - failed filter rule
   // MBI6 - failed AND condition
   // MI2 - failed filter rule following inherited currentItem change

   defineSuite(module, {
      name: "RenderFilter Tests",
      testPage: "/RenderFilter",

      "Check that successful contains rule widget is shown": function() {
         return this.remote.findAllByCssSelector("#MBI9")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find widget");
            });
      },

      "Check that successful containsAll rule widget is shown": function() {
         return this.remote.findAllByCssSelector("#MBI10")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find widget");
            });
      },

      "Check that failing contains rule widget not rendererd": function() {
         return this.remote.findAllByCssSelector("#MBI11")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Should not have been able to find widget");
            });
      },

      "Check that failing containsAll rule widget is not rendered": function() {
         return this.remote.findAllByCssSelector("#MBI12")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Should not have been able to find widget");
            });
      },

      "Test single render filter rule": function() {
         return this.remote.findById("MBI1");
      },

      "Test negated render filter rule (1)": function() {
         return this.remote.findById("MBI3");
      },

      "Test negated render filter rule (2)": function() {
         return this.remote.findAllByCssSelector("MBI3a")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "A single negated render filter rule failed unexpectedly");
            });
      },

      "Test absent property render filter rule": function() {
         return this.remote.findById("MBI4");
      },

      "Test AND condition": function() {
         return this.remote.findById("MBI5");
      },

      "Test OR condition (passing)": function() {
         return this.remote.findById("MBI7");
      },

      "Test OR condition (failing)": function() {
         return this.remote.findAllByCssSelector("#MBI8")
            .then(function(els) {
               assert(els.length === 0, "An OR condition property render filter rule passed unexpectedly");
            });
      },

      "Test inherited currentItem change (failing)": function() {
         return this.remote.findAllByCssSelector("#MBI2")
            .then(function(els) {
               assert(els.length === 0, "An inherited currentItem change render filter rule passed unexpectedly");
            });
      },

      "Test inherited currentItem change (passing)": function() {
         return this.remote.findByCssSelector("#DD1_text")
            .click()
            .end()

         .findDisplayedById("MI1");
      },

      "Test inherited currentItem change (failing 2)": function() {
         return this.remote.findAllByCssSelector("#MI2")
            .then(function(els) {
               assert(els.length === 0, "An inherited currentItem change render filter rule passed unexpectedly");
            });
      },

      "Test value with tokens (passing)": function() {
         return this.remote.findById("MBI3");
      },

      "Test contains tokens (passing)": function() {
         return this.remote.findById("MBI4");
      }
   });
});