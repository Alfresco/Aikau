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
 * This is a unit test for the BaseForm control
 * 
 * @author Richard Smith
 * @author Martin Doyle
 */
define(["intern!object",
        "intern/chai!assert", 
        "intern/dojo/node!leadfoot/keys", 
        "alfresco/TestCommon"], 
        function(registerSuite, assert, keys, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Base Form Control Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/BaseForm", "Base Form Control Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Checking the form field is initially empty": function() {
         return browser.findByCssSelector("div#FORM_FIELD div.control input[name='control']")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "", "Form field not initially empty");
            });
      },

      "No payload does not update value": function() {
         return browser.findById("SET_FORM_VALUE_1")
            .click()
            .end()

         .findByCssSelector("div#FORM_FIELD div.control input[name=\"control\"]")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "", "No payload published but field value updated");
            });
      },

      "Invalid field name does not update value": function() {
         return browser.findById("SET_FORM_VALUE_2")
            .click()
            .end()

         .findByCssSelector("div#FORM_FIELD div.control input[name=\"control\"]")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "", "Invalid field name provided but value updated");
            });
      },

      "Setting string value updates field appropriately": function() {
         return browser.findById("SET_FORM_VALUE_3")
            .click()
            .end()

         .findByCssSelector("div#FORM_FIELD div.control input[name=\"control\"]")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "this is the new value", "Field value not updated to published string value");
            });
      },

      "Setting number value updates field appropriately": function() {
         return browser.findById("SET_FORM_VALUE_4")
            .click()
            .end()

         .findByCssSelector("div#FORM_FIELD div.control input[name=\"control\"]")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "3.14159265", "Field value not updated to published numeric value");
            });
      },

      "Setting boolean value updates field appropriately": function() {
         return browser.findById("SET_FORM_VALUE_5")
            .click()
            .end()

         .findByCssSelector("div#FORM_FIELD div.control input[name=\"control\"]")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "true", "Field value not updated to published boolean value");
            });
      },

      "Autosave on a form removes OK/Cancel buttons": function() {
         return browser.findAllByCssSelector("#BASIC_FORM .confirmationButton, #BASIC_FORM .cancelButton")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "OK/Cancel buttons not found on basic form");
            })
            .end()

         .findAllByCssSelector("#AUTOSAVE_FORM .confirmationButton, #AUTOSAVE_FORM .cancelButton")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "OK/Cancel buttons found on autosave form");
            });
      },

      "Updating autosave value publishes form": function() {
         return browser.findByCssSelector("#AUTOSAVE_FORM_FIELD .dijitInputInner")
            .clearValue()
            .type("wibble")
            .getLastPublish("AUTOSAVE_FORM_1")
            .then(function(payload) {
               assert.propertyVal(payload, "control", "wibble", "Did not autosave updated value");
               assert.propertyVal(payload, "alfValidForm", true, "Did not autosave validity property");
            });
      },

      "Updating to invalid value does not autosave form": function() {
         return browser.findById("CLEAR_AUTOSAVE_1")
            .click()
            .clearLog()
            .getAllPublishes("AUTOSAVE_FORM_1")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "Published form when invalid");
            });
      },

      "Autosave on invalid flag publishes invalid form": function() {
         return browser.findByCssSelector("#AUTOSAVE_INVALID_FORM_FIELD .dijitInputInner")
            .clearLog()
            .clearValue()
            .pressKeys(keys.BACKSPACE) // Need to trigger an update!
            .getLastPublish("AUTOSAVE_FORM_2")
            .then(function(payload) {
               assert.propertyVal(payload, "control", "", "Did not autosave updated, invalid value");
               assert.propertyVal(payload, "alfValidForm", false, "Did not autosave validity property");
            });
      },

      "Autosaving with defined payload mixes payload into form values": function(){
         return browser.findByCssSelector("#AUTOSAVE_FORM_FIELD") // Need to get session to check for publish
            .getLastPublish("AUTOSAVE_FORM_2")
            .then(function(payload) {
               assert.propertyVal(payload, "customProperty", "awooga", "Did not mix custom payload into form values");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});