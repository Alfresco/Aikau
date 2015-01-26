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
      name: 'CRUD Form Test',
      'Basic Test': function () {
         var browser = this.remote;
         var testname = "CRUD Form Test";
         return TestCommon.loadTestWebScript(this.remote, "/CrudForm", testname)

            // Check the info node is displayed initially...
            .findByCssSelector("#CRUD_FORM_INFO_NODE")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Check that the info node is initially displayed");
                  assert(result === true, "Test #0a - The info node should be displayed");
               })
            .end()

            // Show the form...
            .findByCssSelector("#SHOW_FORM_label")
               .click()
               .end()
            .findByCssSelector("#CRUD_FORM_INFO_NODE")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Check that the info node has been hidden");
                  assert(result === false, "Test #0b - The info node should be hidden");
               })
            .end()

            // Hide the form...
            .findByCssSelector("#ADDITIONAL_BUTTON_label")
               .click()
               .end()
            .findByCssSelector("#CRUD_FORM_INFO_NODE")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Check that the info node has been displayed again");
                  assert(result === true, "Test #0c - The info node should be displayed");
               })
            .end()

            // Display the new item form...
            .findByCssSelector("#SHOW_CREATE_label")
               .click()
            .end()

            .findByCssSelector("#CRUD_FORM_INFO_NODE")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Check that the info node has been hidden again");
                  assert(result === false, "Test #0d - The info node should be hidden");
               })
            .end()

            // Check default data is displayed...
            .findByCssSelector("#TEXT_FIELD .dijitInputContainer input")
               .getProperty('value')
               .then(function(resultText) {
                  TestCommon.log(testname, "Checking that new form value is correct default");
                  assert(resultText === "NewData", "Test #1a - The new form value was not set correctly: " + resultText);
               })
            .end()

            // Check the create button is displayed...
            .findByCssSelector(".alfresco-buttons-AlfButton.createButton > span")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Checking that the create button is displayed");
                  assert(result === true, "Test #1b - The create button was not displayed");
               })
               .click()
            .end()

            // Check that the create data is published correctly...
            .findAllByCssSelector(TestCommon.pubDataCssSelector("CREATE_ITEM", "prop1", "NewData"))
               .then(function(elements) {
                  TestCommon.log(testname, "Checking that new item data is published correctly");
                  assert(elements.length === 1, "Test #1c - The new item button data was not published correctly, expected 1. Found: " + elements.length);
               })
            .end()

            // Display the new item form...
            .findByCssSelector("#SHOW_EXISTING_1_label")
               .click()
            .end()

            // Check existing data is displayed...
            .findByCssSelector("#TEXT_FIELD .dijitInputContainer input")
               .getProperty('value')
               .then(function(resultText) {
                  TestCommon.log(testname, "Checking that form value is shows the existing value");
                  assert(resultText === "Existing 1", "Test #2a - The form was not set with existing data: " + resultText);
               })
            .end()

            // Check the update button is displayed...
            .findByCssSelector(".alfresco-buttons-AlfButton.updateButton > span")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Checking that the update button is displayed");
                  assert(result === true, "Test #2b - The update button was not displayed");
               })
               .click()
            .end()

            // Check that the create data is published correctly...
            .findAllByCssSelector(TestCommon.pubDataCssSelector("UPDATE_ITEM", "prop1", "Existing 1"))
               .then(function(elements) {
                  TestCommon.log(testname, "Checking that existing item data is published correctly");
                  assert(elements.length === 1, "Test #2c - The existing item button data was not published correctly");
               })
            .end()

            // Check the delete button is displayed...
            .findByCssSelector(".alfresco-buttons-AlfButton.deleteButton > span")
               .isDisplayed()
               .then(function(result) {
                  TestCommon.log(testname, "Checking that the delete button is displayed");
                  assert(result === true, "Test #3a - The delete button was not displayed");
               })
               .click()
            .end()

            // Check that the create data is published correctly...
            .findAllByCssSelector(TestCommon.pubDataCssSelector("DELETE_ITEM", "prop1", "Existing 1"))
               .then(function(elements) {
                  TestCommon.log(testname, "Checking that a request was made to delete the existing item");
                  assert(elements.length === 1, "Test #3b - A request was not made to delete the existing item");
               })
            .end()

            .findByCssSelector("#CRUD_FORM_INFO_NODE")
               .isDisplayed()
               .then(function(result) {
                  assert(result === true, "Test #3c - The info node should be displayed");
               })
            .end()

            .alfPostCoverageResults(browser);
      }
   });
});