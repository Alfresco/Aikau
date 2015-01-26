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
      name: 'MultipleEntryFormControlTest',
      'BasicTest': function () {

         // Use this function for finding the edit, delete, cancel and save buttons...
         var buttonCssSelector = function(id, elementIndex, button) {
            return "#" + id + " div.control div.entries > div:nth-child(" + elementIndex + ") div.button." + button + " > img";
         };
         // Use this function for finding the add new entry button...
         var addButtonCssSelector = function(id) {
            return "#" + id + " div.control div.button.add > img";
         };
         // Use this function for finding the input field when editing...
         var editFieldCssSelector = function(id, elementIndex) {
            return "#" + id + " div.control div.entries > div:nth-child(" + elementIndex + ") div.edit-display .alfresco-forms-controls-DojoValidationTextBox .control .dijitInputContainer input";
         };
         // Use this function for finding the read display field...
         var readDisplayCssSelector = function(id, elementIndex) {
            return "#" + id + " .alfresco-forms-controls-MultipleEntryElementWrapper:nth-child(" + elementIndex + ") .alfresco-forms-controls-MultipleEntryElement > div:first-child";
         };



         var browser = this.remote;
         var testname = "MultipleEntryFormControlTest";
         return TestCommon.loadTestWebScript(this.remote, "/MultipleEntryFormControl", testname)

         // First save the form to check that the initialised results are posted correctly...
         .findByCssSelector(".confirmationButton > span")
            .click()
            .end()
         .findByCssSelector(TestCommon.pubDataNestedArrayValueCssSelector("FORM1SAVE_FORM_1","simpleWithValue","1","test1"))
            .then(null, function() {
               assert(false, "Test #0a - Couldn't find simple data in initial form value publication");
            })
            .end()
         .findByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM1SAVE_FORM_1","complexWithValue","value","test4"))
            .then(null, function() {
               assert(false, "Test #0b - Couldn't find complex data in initial form value publication");
            })
            .end()

         // Count the preset values for the simple widget...
         .findAllByCssSelector("#SIMPLE_WITH_VALUE .alfresco-forms-controls-MultipleEntryElement")
            .then(function(elements) {
               assert(elements.length == 3, "Test #1a - Didn't find the expected number of preset simple value elements");
            })
            .end()

         // Check that the preset values have been rendered correctly...
         .findByCssSelector("#SIMPLE_WITH_VALUE .alfresco-forms-controls-MultipleEntryElementWrapper:nth-child(1) .alfresco-forms-controls-MultipleEntryElement > div:first-child")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "test1", "Test #1b - First simple value not set correctly");
            })
            .end()
         .findByCssSelector("#SIMPLE_WITH_VALUE .alfresco-forms-controls-MultipleEntryElementWrapper:nth-child(2) .alfresco-forms-controls-MultipleEntryElement > div:first-child")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "test2", "Test #1c - Second simple value not set correctly");
            })
            .end()
         .findByCssSelector("#SIMPLE_WITH_VALUE .alfresco-forms-controls-MultipleEntryElementWrapper:nth-child(3) .alfresco-forms-controls-MultipleEntryElement > div:first-child")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "test3", "Test #1d - Third simple value not set correctly");
            })
            .end()

         .findAllByCssSelector("#COMPLEX_WITH_VALUE .alfresco-forms-controls-MultipleEntryElement")
            .then(function(elements) {
               assert(elements.length == 2, "Test #1e - Didn't find the expected number of preset complex value elements");
            })
            .end()

         // Check that the preset values have been rendered correctly...
         .findByCssSelector("#COMPLEX_WITH_VALUE .alfresco-forms-controls-MultipleEntryElementWrapper:nth-child(1) .alfresco-forms-controls-MultipleEntryElement > div:first-child")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "test4", "Test #1f - First complex value not set correctly");
            })
            .end()
         .findByCssSelector("#COMPLEX_WITH_VALUE .alfresco-forms-controls-MultipleEntryElementWrapper:nth-child(2) .alfresco-forms-controls-MultipleEntryElement > div:first-child")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "test5", "Test #1g - Second complex value not set correctly");
            })
            .end()

         // Delete some entries and check that the form value is updated correctly...
         .findByCssSelector(buttonCssSelector("SIMPLE_WITH_VALUE", "1", "delete"))
            .click()
            .end()
         .findByCssSelector(buttonCssSelector("COMPLEX_WITH_VALUE", "1", "delete"))
            .click()
            .end()
         // Post the updates...
         .findByCssSelector(".confirmationButton > span")
            .click()
            .end()

         // Check the new values...
         .findByCssSelector(TestCommon.pubDataNestedArrayValueCssSelector("FORM1SAVE_FORM_1","simpleWithValue","1","test2"))
            .then(null, function() {
               assert(false, "Test #2a - Deletion of simple element not reflected in form post");
            })
            .end()
         .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM1SAVE_FORM_1","complexWithValue","value","test4"))
            .then(function (elements) {
               // NOTE: We're still expecting to find one result (e.g. from the initial form post)...
               assert(elements.length == 1, "Test #2b - Deletion of complex element not reflected in form post");
            })
            .end()

         // Edit some existing entries...
         // Click the edit button of the first preset simple entry...
         .findByCssSelector(buttonCssSelector("SIMPLE_WITH_VALUE", "1", "edit"))
            .click()
            .end()

         // Check the edit field is present and initialised correctly...
         .findByCssSelector(editFieldCssSelector("SIMPLE_WITH_VALUE", "1"))
            .then(null, function() {
               assert(false, "Test #3a - Couldn't find the edit field for the simple element");
            })
            .getProperty('value')
            .then(function(resultText) {
               assert(resultText == "test2", "Test #3b - The edit field wasn't populated as expected" + resultText);
            })
            .clearValue()
            .type("updated simple value")
            .end()

         // Click the "done" button to finish editing (this should save the update)...
         .findByCssSelector(buttonCssSelector("SIMPLE_WITH_VALUE", "1", "doneEditing"))
            .click()
            .end()

         // Check the read display is updated...
         .findByCssSelector(readDisplayCssSelector("SIMPLE_WITH_VALUE", "1"))
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "updated simple value", "Test #3b - Read display not updated correctly:", resultText);
            })
            .end()

          // Post the update...
         .findByCssSelector(".confirmationButton > span")
            .click()
            .end()

         // Check the new value...
         .findByCssSelector(TestCommon.pubDataNestedArrayValueCssSelector("FORM1SAVE_FORM_1","simpleWithValue","1","updated simple value"))
            .then(null, function() {
               assert(false, "Test #3c - Edited value not included in form post");
            })
            .end()

         // Edit the same field, but this time with the intent to discard the changes...
         .findByCssSelector(buttonCssSelector("SIMPLE_WITH_VALUE", "1", "edit"))
            .click()
            .end()

         // Check the edit field is present and initialised correctly...
         .findByCssSelector(editFieldCssSelector("SIMPLE_WITH_VALUE", "1"))
            .getProperty('value')
            .then(function(resultText) {
               assert(resultText == "updated simple value", "Test #4a - The edit field wasn't populated as expected following previous edit" + resultText);
            })
            .clearValue()
            .type("to discard")
            .end()

         // Click the "cancel" button to finish editing (this should not save the changes)...
         .findByCssSelector(buttonCssSelector("SIMPLE_WITH_VALUE", "1", "cancelEditing"))
            .click()
            .end()

         // Check that the read display has NOT been changed...
         .findByCssSelector(readDisplayCssSelector("SIMPLE_WITH_VALUE", "1"))
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "updated simple value", "Test #4b - Discarded changes were displayed:", resultText);
            })
            .end()

          // Post the update...
         .findByCssSelector(".confirmationButton > span")
            .click()
            .end()

         // Check that the discarded changes were NOT posted...
         .findByCssSelector(TestCommon.pubDataNestedArrayValueCssSelector("FORM1SAVE_FORM_1","simpleWithValue","1","updated simple value"))
            .then(null, function() {
               assert(false, "Test #4c - Discarded changes were included in form post");
            })
            .end()

         // Add some new entries...
         .findByCssSelector(addButtonCssSelector("SIMPLE_NO_VALUE"))
            .click()
            .end()

         .findByCssSelector(editFieldCssSelector("SIMPLE_NO_VALUE", "1"))
            .type("new entry to discard")
            .end()

         // Click the "cancel" button to cancel editing (this should delete the entry because it has never been saved)...
         .findByCssSelector(buttonCssSelector("SIMPLE_NO_VALUE", "1", "cancelEditing"))
            .click()
            .end()

         // Make sure that the element wrapper has been removed...
         .findAllByCssSelector("#SIMPLE_NO_VALUE div.control div.entries > div")
            .then(function (elements) {
               assert(elements.length === 0, "Test #5a - Cancelling creating a new entry didn't delete the element");
            })
            .end()

         // Add the entry (with the intention of saving this time)...
         .findByCssSelector(addButtonCssSelector("SIMPLE_NO_VALUE"))
            .click()
            .end()
         .findByCssSelector(editFieldCssSelector("SIMPLE_NO_VALUE", "1"))
            .type("new entry")
            .end()
         .findByCssSelector(buttonCssSelector("SIMPLE_NO_VALUE", "1", "doneEditing"))
            .click()
            .end()

         // Count the created entries...
         .findAllByCssSelector("#SIMPLE_NO_VALUE div.control div.entries > div")
            .then(function (elements) {
               assert(elements.length == 1, "Test #5b - Saving a new element didn't create a single entry: " +  elements.length);
            })
            .end()

         // Check the read display...
         .findByCssSelector(readDisplayCssSelector("SIMPLE_NO_VALUE", "1"))
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText == "new entry", "Test #5c - Added entry was not displayed correctly:", resultText);
            })
            .end()

         // Post the update...
         .findByCssSelector(".confirmationButton > span")
            .click()
            .end()

         // Check that the discarded changes were NOT posted...
         .findByCssSelector(TestCommon.pubDataNestedArrayValueCssSelector("FORM1SAVE_FORM_1","simple","1","new entry"))
            .then(null, function() {
               assert(false, "Test #5d - Added entry was not included in form post");
            })
            .end()

         .alfPostCoverageResults(browser);
      }
   });
});