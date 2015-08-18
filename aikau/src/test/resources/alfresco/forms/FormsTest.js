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
      name: "Forms Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Forms", "Forms Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test setting browser hash fragment with form post": function () {
         return browser.findByCssSelector("#HASH_TEXT_BOX_1 .dijitInputContainer input")
            .type("test1")
         .end()
         .findByCssSelector("#HASH_TEXT_BOX_2 .dijitInputContainer input")
            .type("test2")
         .end()
         .findByCssSelector("#HASH_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton > span")
            .click()
            .execute("return window.location.hash.toString()")
            .then(function(hash) {
               assert.equal(hash, "#field1=test1&field2=test2", "Form submit did not update hash fragment");
            });
      },

      "Test updating browser hash updates form": function() {
         return browser.findByCssSelector("#SET_HASH")
            .click()
         .end()
         .findByCssSelector("#HASH_TEXT_BOX_1 .dijitInputContainer input")
         .getProperty("value")
            .then(function(resultText) {
               assert(resultText === "updatedField1", "field1 was not set by the hash: " + resultText);
            })
         .end()
         .findByCssSelector("#HASH_TEXT_BOX_2 .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert(resultText === "updatedField2", "field2 was not set by the hash: " + resultText);
         });
      },

      "Test confirmation form button initially disabled": function() {
         return browser.findAllByCssSelector("#STANDARD_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton.dijitButtonDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "Standard form button was not initially disabled");
            })
         .end()
         .findByCssSelector("#STANDARD_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton span.dijitButtonContents")
            .getAttribute("disabled")
            .then(function(disabled) {
               assert.equal(disabled, "true");
            });
      },

      "Test confirmation button is enabled with valid fields": function() {
         return browser.findByCssSelector("#TEXT_BOX_1 .dijitInputContainer input")
            .type("test3")
         .end()
         .findByCssSelector("#TEXT_BOX_2 .dijitInputContainer input")
            .type("9")
         .end()
         .findAllByCssSelector("#STANDARD_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton.dijitButtonDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "Standard form button was not enabled following valid data entry");
            })
         .end()
         .findByCssSelector("#STANDARD_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton span.dijitButtonContents")
            .getAttribute("disabled")
            .then(function(disabled) {
               assert.equal(disabled, "false");
            });
      },

      "Test form value publication": function() {
         return browser.findByCssSelector("#STANDARD_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton > span")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field3", "test3"))
            .then(function(elements) {
               assert(elements.length === 1, "field3 in standard form didn't publish correctly");
            })
         .end().findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field4", "9"))
            .then(function(elements) {
               assert(elements.length === 1, "field4 in standard form didn't publish correctly");
            });
      },

      "Test additional form buttons rendered": function() {
         return browser.findAllByCssSelector("#ADD_BUTTON_1")
            .then(function(elements) {
               assert(elements.length === 1, "The first additional button could not be found");
            })
         .end()
         .findAllByCssSelector("#ADD_BUTTON_2")
            .then(function(elements) {
               assert(elements.length === 1, "The second additional button could not be found");
            });
      },

      "Test additional form buttons publish correct data": function() {
         return browser.findByCssSelector("#ADD_TEXT_BOX_1 .dijitInputContainer input")
            .type("test4")
         .end()
         .findByCssSelector("#ADD_TEXT_BOX_2 .dijitInputContainer input")
            .type("test5")
         .end()
         .findByCssSelector("#ADD_BUTTON_1")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field5", "test4"))
            .then(function(elements) {
               assert(elements.length === 1, "The additional button didn't publish field5 correctly");
            })
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field6", "test5"))
            .then(function(elements) {
               assert(elements.length === 1, "The additional button didn't publish field6 correctly");
            })
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "extra", "stuff"))
            .then(function(elements) {
               assert(elements.length === 1, "The additional button didn't publish 'extra' correctly");
            });
      },

      "Test custom scope set correctly": function() {
         return browser.findAllByCssSelector(TestCommon.topicSelector("CUSTOM_SCOPE_AddButton1", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 1, "Custom scope not set");
            });
      },

      "Test global scope set correctly": function() {
         return browser.findAllByCssSelector(TestCommon.topicSelector("SET_HASH", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 1, "Global scope not set");
            });
      },

      "Test setting form value by publication": function() {
         return browser.findByCssSelector("#TEXT_BOX_3 .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "", "Text box to be set via publication is not empty before test");
            })
         .end()
         .findByCssSelector("#SET_FORM_VALUE")
            .click()
         .end()
         .findByCssSelector("#TEXT_BOX_3 .dijitInputContainer input")
         .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "Value Set", "Text box value was not set via publication");
            });
      },

      "Test noValueUpdateWhenHiddenOrDisabled (disabled)": function() {
         return browser.findByCssSelector("#SET_VALUE_VIA_PUBSUB_FORM .confirmationButton > span")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "pub3"))
            .getVisibleText()
            .then(function(text){
               assert.equal(text, "default", "The default data was updated despite being disabled by the updated value");
            });
      },

      "Test noValueUpdateWhenHiddenOrDisabled (enabled)": function() {
         return browser.findByCssSelector("#TEXT_BOX_4 .dijitInputContainer input")
            .clearValue()
         .end()
         .findByCssSelector("#SET_FORM_VALUE_2")
            .click()
         .end()
         .findByCssSelector("#SET_VALUE_VIA_PUBSUB_FORM .confirmationButton > span")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "pub3"))
            .getVisibleText()
            .then(function(text){
               assert.equal(text, "Update Success", "The default data was not updated despite being enabled");
            });
      },

      "Test postWhenHiddenOrDisabled (displayed) and noPostWhenValueIs (hidden)": function() {
         return browser.findByCssSelector("#TARGET_OPTIONS .radio-button:nth-child(3) .radio-button-widget input")
            .click()
         .end()
         .findByCssSelector("#CUSTOM_TARGET .dijitInputContainer input")
            .clearValue()
            .type("bob")
         .end()
         .findByCssSelector("#CUSTOM_FIELDS_FORM .confirmationButton > span")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "TARGET"))
            .getVisibleText()
            .then(function(text){
               assert.equal(text, "bob", "The custom target data was not posted");
            });
      },

      "Test postWhenHiddenOrDisabled (hidden) and noPostWhenValueIs (displayed)": function() {
         return browser.findByCssSelector("#TARGET_OPTIONS .radio-button:nth-child(1) .radio-button-widget input")
            .click()
         .end()
         .findByCssSelector("#CUSTOM_FIELDS_FORM .confirmationButton > span")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "TARGET"))
            .getVisibleText()
            .then(function(text){
               assert.equal(text, "KNOWN1", "The custom target data was not posted");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});