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
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

   // PLEASE NOTE: There is additional testing for the original rules engine code (that was originally
   //              part of BaseFormControl) in the TextBoxTest. This test covers updates specific to
   //              ANY/ALL configuration (See AKU-451)...
   
   var browser;
   registerSuite({
      name: "Rules Engine Test",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/RulesEngine", "Rules Engine Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "ANY rules widget should NOT be visible on page load": function() {
         return browser.findById("RULES1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The ANY rules widget should not have been displayed");
            });
      },

      "ALL rules widget should NOT be visible on page load": function() {
         return browser.findById("RULES2")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The ALL rules widget should not have been displayed");
            });
      },

      "Entering text into first text box should reveal ANY rules widget": function() {
         return browser.findByCssSelector("#SOURCE1 .dijitInputContainer input")
            .clearValue()
            .type("hello")
         .end()
         .findById("RULES1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The ANY rules widget should be displayed when one of the source fields has data");
            })
         .end()
         .findById("RULES2")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The ALL rules widget should remain hidden when one of the source fields has data");
            });
      },

      "Entering text into second text box should reveal ALL rules widget": function() {
         return browser.findByCssSelector("#SOURCE2 .dijitInputContainer input")
            .clearValue()
            .type("hello")
         .end()
         .findById("RULES1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The ANY rules widget should remain displayed when both of the source fields have data");
            })
         .end()
         .findById("RULES2")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The ALL rules widget should be displayed when both of the source fields have data");
            });
      },

      "Removing text from first text box should hide ALL rules widget": function() {
         return browser.findByCssSelector("#SOURCE2 .dijitInputContainer input")
            .clearValue()
            .type(keys.BACKSPACE)
         .end()
         .findById("RULES1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "The ANY rules widget should remain displayed when the first source field is cleared");
            })
         .end()
         .findById("RULES2")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The ALL rules widget should be hidden when the first source field is cleared");
            });
      },

      "Removing text from second text box should hide ANY rules widget": function() {
         return browser.findByCssSelector("#SOURCE1 .dijitInputContainer input")
            .clearValue()
            .type(keys.BACKSPACE)
         .end()
         .findById("RULES1")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The ANY rules widget should be hidden when the first source field is cleared");
            })
         .end()
         .findById("RULES2")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The ALL rules widget should remain hidden when the first source field is cleared");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});