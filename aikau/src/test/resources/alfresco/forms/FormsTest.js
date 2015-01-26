/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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

   registerSuite({
      name: 'Forms Test',
      'Forms': function () {

         var browser = this.remote;
         var testname = "FormsTest";
         return TestCommon.loadTestWebScript(this.remote, "/Forms", testname)

         // 1. Test setting and getting the form value from the hash fragment
         .findByCssSelector("#HASH_TEXT_BOX_1 .dijitInputContainer input")
         .type("test1")
         .end()

         .findByCssSelector("#HASH_TEXT_BOX_2 .dijitInputContainer input")
         .type("test2")
         .end()

         .findByCssSelector("#HASH_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton > span")
         .click()
         .end()

//          Temporarily commented out as the url() function is not returning the full URL...
//          Raised issue with Intern here: https://github.com/theintern/intern/issues/188
//         .getCurrentUrl()
//         .then(function(page) {
//            TestCommon.log(testname,"Check fragment hash has been updated: " + page);
//            expect(page).to.contain("#field1=test1&field2=test2", "Test #1 - form submit did not update hash fragment");
//         })
//         .end()

         // 2. Check that setting the hash will update the form...
         .findByCssSelector("#SET_HASH")
         .click()
         .end()

         .findByCssSelector("#HASH_TEXT_BOX_1 .dijitInputContainer input")
         .getProperty('value')
         .then(function(resultText) {
            assert(resultText == "updatedField1", "Test #2a - field1 was not set by the hash: " + resultText);
         })
         .end()

         .findByCssSelector("#HASH_TEXT_BOX_2 .dijitInputContainer input")
         .getProperty('value')
         .then(function(resultText) {
            assert(resultText == "updatedField2", "Test #2b - field2 was not set by the hash: " + resultText);
         })
         .end()

         // 2. Test hiding/displaying/configuring the standard buttons
         .findAllByCssSelector("#STANDARD_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton.dijitButtonDisabled")
         .then(function(elements) {
            assert(elements.length == 1, "Test #3 - Standard form button was not initially disabled");
         })
         .end()

         // 3. Update the fields and check that the submit button become enabled...
         .findByCssSelector("#TEXT_BOX_1 .dijitInputContainer input")
         .type("test3")
         .end()

         .findByCssSelector("#TEXT_BOX_2 .dijitInputContainer input")
         .type("9")
         .end()

         .findAllByCssSelector("#STANDARD_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton.dijitButtonDisabled")
         .then(function(elements) {
            assert(elements.length === 0, "Test #4a - Standard form button was not enabled following valid data entry");
         })
         .end()

         .findByCssSelector("#STANDARD_FORM .buttons .alfresco-buttons-AlfButton.confirmationButton > span")
         .click()
         .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field3", "test3"))
         .then(function(elements) {
            assert(elements.length == 1, "Test #4b - standard form didn't publish correctly");
         })
         .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field4", "9"))
         .then(function(elements) {
            assert(elements.length == 1, "Test #4c - standard form didn't publish correctly");
         })
         .end()

         // 3. Test creating additional buttons
         .findAllByCssSelector("#ADD_BUTTON_1")
         .then(function(elements) {
            assert(elements.length == 1, "Test #5a - The first additional button could not be found");
         })
         .end()

         .findAllByCssSelector("#ADD_BUTTON_2")
         .then(function(elements) {
            assert(elements.length == 1, "Test #5b - The second additional button could not be found");
         })
         .end()

         .findByCssSelector("#ADD_TEXT_BOX_1 .dijitInputContainer input")
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
            assert(elements.length == 1, "Test #5c - the additional button didn't publish data correctly");
         })
         .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field6", "test5"))
         .then(function(elements) {
            assert(elements.length == 1, "Test #5d - the additional button didn't publish data correctly");
         })
         .end()

         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "extra", "stuff"))
         .then(function(elements) {
            assert(elements.length == 1, "Test #5e - the additional button didn't publish data correctly");
         })
         .end()

         // 4. Test scoping
         .findAllByCssSelector(TestCommon.topicSelector("CUSTOM_SCOPE_AddButton1", "publish", "any"))
         .then(function(elements) {
            assert(elements.length == 1, "Test #6a - Custom scope not set");
         })
         .end()

         .findAllByCssSelector(TestCommon.topicSelector("SET_HASH", "publish", "any"))
         .then(function(elements) {
            assert(elements.length == 1, "Test #6b - Global scope not set");
         })
         .end()

         .alfPostCoverageResults(browser);
      }
   });
});