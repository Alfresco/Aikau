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
      name: "HashForm Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/HashForm#field1=one&field2=two&field3=three", "HashForm Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test that field 3 is NOT set in FORM1": function() {
         return browser.findByCssSelector("#HASH_TEXT_BOX_3 .dijitInputInner")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "", "Field 3 in first form should not have been set");
            });
      },

      "Test that field 3 IS set in FORM2": function() {
         return browser.findByCssSelector("#HASH_TEXT_BOX_6 .dijitInputInner")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "three", "Field 3 in first form should not have been set");
            });
      },

      "Test that disabled field 1 is NOT updated in FORM3": function() {
         return browser.findByCssSelector("#HASH_TEXT_BOX_7 .dijitInputInner")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "", "Field 1 in third form should not have been set");
            });
      },

      "Update field 1 and field3 and check that only field 1 updates the URL hash": function() {
         return browser.findByCssSelector("#HASH_TEXT_BOX_1 .dijitInputInner")
            .clearValue()
            .type("Update1")
         .end()
         .findByCssSelector("#HASH_TEXT_BOX_3 .dijitInputInner")
            .clearValue()
            .type("Update2")
         .end()
         .findByCssSelector("#HASH_FORM1 .confirmationButton > span")
            .click()
            .execute("return window.location.hash.toString()")
            .then(function(hash) {
               assert.equal(hash, "#field1=Update1&field2=two&field3=three", "Form submit did not update hash fragment as expected");
            });
      },

      "Check that field 1 in FORM2 was updated": function() {
         return browser.findByCssSelector("#HASH_TEXT_BOX_4 .dijitInputInner")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "Update1", "Field 3 in first form should have been updated");
            });
      },

      "Update field 1 and field3 and check that both fields updates the URL hash": function() {
         return browser.findByCssSelector("#HASH_TEXT_BOX_4 .dijitInputInner")
            .clearValue()
            .type("Reset1")
         .end()
         .findByCssSelector("#HASH_TEXT_BOX_6 .dijitInputInner")
            .clearValue()
            .type("Reset2")
         .end()
         .findByCssSelector("#HASH_FORM2 .confirmationButton > span")
            .click()
            .execute("return window.location.hash.toString()")
            .then(function(hash) {
               assert.equal(hash, "#field1=Reset1&field2=two&field3=Reset2", "Form submit did not update hash fragment as expected");
            });
      },

      "Check that field 3 in FORM1 was NOT updated": function() {
         return browser.findByCssSelector("#HASH_TEXT_BOX_3 .dijitInputInner")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "Update2", "Field 3 in first form should NOT have been updated");
            });
      },

      "Check that updating FORM3 does NOT update hash": function() {
         return browser.findByCssSelector("#HASH_TEXT_BOX_8 .dijitInputInner")
            .clearValue()
            .type("NoUpdate")
         .end()
         .findByCssSelector("#HASH_FORM3 .confirmationButton > span")
            .click()
            .execute("return window.location.hash.toString()")
            .then(function(hash) {
               assert.equal(hash, "#field1=Reset1&field2=two&field3=Reset2", "Hash updated when form configured not to");
            });
      },

      "Check that updating form configured not to update hash does NOT update hash": function() {
         // Set a value that won't be updated once the field is disabled...
         return browser.findByCssSelector("#HASH_TEXT_BOX_5 .dijitInputInner")
            .clearValue()
            .type("NoUpdate")
         .end()
         // Set a value in another field to dynamically make the test field disabled...
         .findByCssSelector("#HASH_TEXT_BOX_4 .dijitInputInner")
            .clearValue()
            .type("disableField2")
         .end()
         .findByCssSelector("#HASH_FORM2 .confirmationButton > span")
            .click()
            .execute("return window.location.hash.toString()")
            .then(function(hash) {
               assert.equal(hash, "#field1=disableField2&field2=two&field3=Reset2", "Hash updated when form configured not to");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});