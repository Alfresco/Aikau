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
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

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
         
registerSuite(function(){
   var browser;

   return {
      name: "RenderFilter Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/RenderFilter", "RenderFilter Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check that successful contains rule widget is shown": function() {
         return browser.findAllByCssSelector("#MBI9")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find widget");
            });
      },

      "Check that successful containsAll rule widget is shown": function() {
         return browser.findAllByCssSelector("#MBI10")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find widget");
            });
      },

      "Check that failing contains rule widget not rendererd": function() {
         return browser.findAllByCssSelector("#MBI11")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Should not have been able to find widget");
            });
      },

      "Check that failing containsAll rule widget is not rendered": function() {
         return browser.findAllByCssSelector("#MBI12")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Should not have been able to find widget");
            });
      },

      "Test single render filter rule": function () {
         return browser.findById("MBI1")
            .then(function (el) {
               expect(el).to.be.an("object", "A single render filter rule failed unexpectedly");
            });
      },

      "Test negated render filter rule (1)": function() {
         return browser.findById("MBI3")
            .then(function (el) {
               expect(el).to.be.an("object", "A single negated render filter rule failed unexpectedly");
            });
      },

      "Test negated render filter rule (2)": function() {
         return browser.findAllByCssSelector("MBI3a")
            .then(function (elements) {
               assert.lengthOf(elements, 0, "A single negated render filter rule failed unexpectedly");
            });
      },

      "Test absent property render filter rule": function() {
         return browser.findById("MBI4")
            .then(function (el) {
               expect(el).to.be.an("object", "A single absent property render filter rule failed unexpectedly");
            });
      },

      "Test AND condition": function() {
         return browser.findById("MBI5")
            .then(function (el) {
               expect(el).to.be.an("object", "An AND condition property render filter rule failed unexpectedly");
            });
      },

      "Test OR condition (passing)": function() {
         return browser.findById("MBI7")
            .then(function (el) {
               expect(el).to.be.an("object", "An OR condition property render filter rule failed unexpectedly");
            });
      },

      "Test OR condition (failing)": function() {
         return browser.findAllByCssSelector("#MBI8")
            .then(function (els) {
               assert(els.length === 0, "An OR condition property render filter rule passed unexpectedly");
            });
      },

      "Test inherited currentItem change (failing)": function() {
         return browser.findAllByCssSelector("#MBI2")
            .then(function (els) {
               assert(els.length === 0, "An inherited currentItem change render filter rule passed unexpectedly");
            });
      },

      "Test inherited currentItem change (passing)": function() {
         return browser.findByCssSelector("#DD1_text")
            .sleep(250)
            .click()
         .end()

         .sleep(250)

         .findById("MI1")
            .then(function (el) {
               expect(el).to.be.an("object", "An inherited currentItem change render filter rule failed unexpectedly");
            });
      },

      "Test inherited currentItem change (failing 2)": function() {
         return browser.findAllByCssSelector("#MI2")
            .then(function (els) {
               assert(els.length === 0, "An inherited currentItem change render filter rule passed unexpectedly");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});