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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

   var browser;
   registerSuite({
      name: 'Forms Test',
      "Test setting browser hash fragment with form post": function () {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/Forms", "Forms Test").findByCssSelector("#HASH_TEXT_BOX_1 .dijitInputContainer input")
            .type("test1")
         .end()
         .findByCssSelector("#HASH_TEXT_BOX_2 .dijitInputContainer input")
            .type("test2")
         .end()
         .findByCssSelector("#HASH_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton > span")
            .click()
         .end();
//          Temporarily commented out as the url() function is not returning the full URL...
//          Raised issue with Intern here: https://github.com/theintern/intern/issues/188
//         .getCurrentUrl()
//         .then(function(page) {
//            TestCommon.log(testname,"Check fragment hash has been updated: " + page);
//            expect(page).to.contain("#field1=test1&field2=test2", "Test #1 - form submit did not update hash fragment");
//         })
//         .end()
      },
      "Test updating browser hash updates form": function() {
         this.remote.findByCssSelector("#SET_HASH")
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
            })
         .end();
      },
      "Test confirmation form button initially disabled": function() {
         this.remote.findAllByCssSelector("#STANDARD_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton.dijitButtonDisabled")
            .then(function(elements) {
               assert(elements.length === 1, "Standard form button was not initially disabled");
            })
         .end();
      },
      "Test confirmation button is enabled with valid fields": function() {
         this.remote.findByCssSelector("#TEXT_BOX_1 .dijitInputContainer input")
            .type("test3")
         .end()
         .findByCssSelector("#TEXT_BOX_2 .dijitInputContainer input")
            .type("9")
         .end()
         .findAllByCssSelector("#STANDARD_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton.dijitButtonDisabled")
            .then(function(elements) {
               assert(elements.length === 0, "Standard form button was not enabled following valid data entry");
            })
         .end();
      },
      "Test form value publication": function() {
         this.remote.findByCssSelector("#STANDARD_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton > span")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field3", "test3"))
            .then(function(elements) {
               assert(elements.length === 1, "field3 in standard form didn't publish correctly");
            })
         .end().findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field4", "9"))
            .then(function(elements) {
               assert(elements.length === 1, "field4 in standard form didn't publish correctly");
            })
         .end();
      },
      "Test additional form buttons rendered": function() {
         this.remote.findAllByCssSelector("#ADD_BUTTON_1")
            .then(function(elements) {
               assert(elements.length === 1, "The first additional button could not be found");
            })
         .end()
         .findAllByCssSelector("#ADD_BUTTON_2")
            .then(function(elements) {
               assert(elements.length === 1, "The second additional button could not be found");
            })
         .end();
      },
      "Test additional form buttons publish correct data": function() {
         this.remote.findByCssSelector("#ADD_TEXT_BOX_1 .dijitInputContainer input")
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
            })
         .end();
      },
      "Test custom scope set correctly": function() {
         this.remote.findAllByCssSelector(TestCommon.topicSelector("CUSTOM_SCOPE_AddButton1", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 1, "Custom scope not set");
            })
         .end();
      },
      "Test global scope set correctly": function() {
         this.remote.findAllByCssSelector(TestCommon.topicSelector("SET_HASH", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 1, "Global scope not set");
            })
         .end()
         .alfPostCoverageResults(browser);
      }
   });
});