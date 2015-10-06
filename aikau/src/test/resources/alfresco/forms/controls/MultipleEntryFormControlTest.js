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
      return "#" + id + " div.control div.entries > div:nth-child(" + elementIndex + ") div.edit-display .alfresco-forms-controls-TextBox .control .dijitInputContainer input";
   };
   // Use this function for finding the read display field...
   var readDisplayCssSelector = function(id, elementIndex) {
      return "#" + id + " .alfresco-forms-controls-MultipleEntryElementWrapper:nth-child(" + elementIndex + ") .alfresco-forms-controls-MultipleEntryElement > div:first-child";
   };

registerSuite(function(){
   var browser;

   return {
      name: "MultipleEntryFormControlTest",
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/MultipleEntryFormControl", "MultipleEntryFormControl").end();
      },
      // beforeEach: function() {
      //    browser.end();
      // },
      // teardown: function() {
      //    return browser.end().alfPostCoverageResults(browser);
      // },
      
      "Test for simple value in initial form value": function () {
         // First save the form to check that the initialised results are posted correctly...
         return browser.findByCssSelector(".confirmationButton > span")
            .click()
            .end()
         .findByCssSelector(TestCommon.pubDataNestedArrayValueCssSelector("FORM1SAVE_FORM_1","simpleWithValue","1","test1"))
            .then(null, function() {
               assert(false, "Couldn't find simple data in initial form value publication");
            })
         .end();
      },
      
      "Test for complex value in initial form value": function() {
         return browser.findByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM1SAVE_FORM_1","complexWithValue","value","test4"))
            .then(null, function() {
               assert(false, "Couldn't find complex data in initial form value publication");
            })
         .end();
      },
      
      "Test simple preset simple value count": function() {
         // Count the preset values for the simple widget...
         return browser.findAllByCssSelector("#SIMPLE_WITH_VALUE .alfresco-forms-controls-MultipleEntryElement")
            .then(function(elements) {
               assert(elements.length === 3, "Didn't find the expected number of preset simple value elements");
            })
         .end();
      },
      
      "Test simple preset values rendered correctly (first)": function() {
         // Check that the preset values have been rendered correctly...
         return browser.findByCssSelector("#SIMPLE_WITH_VALUE .alfresco-forms-controls-MultipleEntryElementWrapper:nth-child(1) .alfresco-forms-controls-MultipleEntryElement > div:first-child")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "test1", "First simple value not set correctly, expected 'test1' but found: " + resultText);
            })
         .end();
      },
      
      "Test simple preset values rendered correctly (second)": function() {
         // Check that the preset values have been rendered correctly...
         return browser.findByCssSelector("#SIMPLE_WITH_VALUE .alfresco-forms-controls-MultipleEntryElementWrapper:nth-child(2) .alfresco-forms-controls-MultipleEntryElement > div:first-child")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "test2", "Second simple value not set correctly, expected 'test2' but found: " + resultText);
            })
         .end();
      },
     
      "Test simple preset values rendered correctly (third)": function() {
         // Check that the preset values have been rendered correctly...
         return browser.findByCssSelector("#SIMPLE_WITH_VALUE .alfresco-forms-controls-MultipleEntryElementWrapper:nth-child(3) .alfresco-forms-controls-MultipleEntryElement > div:first-child")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "test3", "Third simple value not set correctly, expected 'test3' but found: " + resultText);
            })
         .end();
      },
  
      "Test complex preset value count": function() {
         return browser.findAllByCssSelector("#COMPLEX_WITH_VALUE .alfresco-forms-controls-MultipleEntryElement")
            .then(function(elements) {
               assert(elements.length === 2, "Didn't find the expected number of preset complex value elements");
            })
         .end();
      },
  
      "Test complex preset values rendered correctly (first)": function() {
         // Check that the preset values have been rendered correctly...
         return browser.findByCssSelector("#COMPLEX_WITH_VALUE .alfresco-forms-controls-MultipleEntryElementWrapper:nth-child(1) .alfresco-forms-controls-MultipleEntryElement > div:first-child")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "test4", "First complex value not set correctly, expected 'test4' but found: " + resultText);
            })
         .end();
      },
  
      "Test complex preset values rendered correctly (second)": function() {
         // Check that the preset values have been rendered correctly...
         return browser.findByCssSelector("#COMPLEX_WITH_VALUE .alfresco-forms-controls-MultipleEntryElementWrapper:nth-child(2) .alfresco-forms-controls-MultipleEntryElement > div:first-child")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "test5", "Second complex value not set correctly, expected 'test5' but found: " + resultText);
            })
         .end();
      },
 
      "Test deleting simple entries updates form value correctly": function() {
         // Delete some entries and check that the form value is updated correctly...
         return browser.findByCssSelector(buttonCssSelector("SIMPLE_WITH_VALUE", "1", "delete"))
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
               assert(false, "Deletion of simple element not reflected in form post");
            })
         .end();
      },
  
      "Test deleting complex entries updates the form value correctly": function() {
         // NOTE:The form post was already done in the previous test, as was the deletion!
         return browser.findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM1SAVE_FORM_1","complexWithValue","value","test4"))
            .then(function (elements) {
               // NOTE: We're still expecting to find one result (e.g. from the initial form post)...
               assert(elements.length === 1, " Deletion of complex element not reflected in form post");
            })
         .end();
      },

      // Edit some existing entries...
      "Test that simple entry value can be edited": function() {
         // Click the edit button of the first preset simple entry...
         return browser.findByCssSelector(buttonCssSelector("SIMPLE_WITH_VALUE", "1", "edit"))
            .click()
         .end()
         // Check the edit field is present and initialised correctly...
         .findByCssSelector(editFieldCssSelector("SIMPLE_WITH_VALUE", "1"))
            .then(null, function() {
               assert(false, "Couldn't find the edit field for the simple element");
            })
            .getProperty("value")
            .then(function(resultText) {
               assert(resultText === "test2", "The edit field wasn't populated as expected" + resultText);
            })
         .end();
      },
   
      "Test edited simple entry is reflected in read-only display": function() {
         return browser.findByCssSelector(editFieldCssSelector("SIMPLE_WITH_VALUE", "1"))
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
               assert(resultText === "updated simple value", "Read display not updated correctly:", resultText);
            })
         .end();
      },
 
      "Test updated value reflected in form post": function() {
          // Post the update...
         return browser.findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         // Check the new value...
         .findByCssSelector(TestCommon.pubDataNestedArrayValueCssSelector("FORM1SAVE_FORM_1","simpleWithValue","1","updated simple value"))
            .then(null, function() {
               assert(false, "Edited value not included in form post");
            })
         .end();
      },
 
      "Test previous edit retained": function() {
         // Edit the same field, but this time with the intent to discard the changes...
         return browser.findByCssSelector(buttonCssSelector("SIMPLE_WITH_VALUE", "1", "edit"))
            .click()
         .end()
         // Check the edit field is present and initialised correctly...
         .findByCssSelector(editFieldCssSelector("SIMPLE_WITH_VALUE", "1"))
            .getProperty("value")
            .then(function(resultText) {
               assert(resultText === "updated simple value", "The edit field wasn't populated as expected following previous edit" + resultText);
            })
         .end();
      },
 
      "Test current edit can be discarded": function() {
         return browser.findByCssSelector(editFieldCssSelector("SIMPLE_WITH_VALUE", "1"))
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
               assert(resultText === "updated simple value", "Discarded changes were displayed:", resultText);
            })
         .end();
      },
  
      "Test that dicarded edits are not included in form post": function() {
          // Post the update...
         return browser.findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         // Check that the discarded changes were NOT posted...
         .findByCssSelector(TestCommon.pubDataNestedArrayValueCssSelector("FORM1SAVE_FORM_1","simpleWithValue","1","updated simple value"))
            .then(null, function() {
               assert(false, "Discarded changes were included in form post");
            })
         .end();
      },
  
      "Test adding and discarding an entry": function() {
         // Add some new entries...
         return browser.findByCssSelector(addButtonCssSelector("SIMPLE_NO_VALUE"))
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
               assert(elements.length === 0, "Cancelling creating a new entry didn't delete the element");
            })
         .end();
      },
 
      "Test adding and saving an entry": function() {
         // Add the entry (with the intention of saving this time)...
         return browser.findByCssSelector(addButtonCssSelector("SIMPLE_NO_VALUE"))
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
               assert(elements.length === 1, "Saving a new element didn't create a single entry: " +  elements.length);
            })
         .end();
      },
   
      "Test read display on additional entry": function() {
         // Check the read display...
         return browser.findByCssSelector(readDisplayCssSelector("SIMPLE_NO_VALUE", "1"))
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "new entry", "Added entry was not displayed correctly:", resultText);
            })
         .end();
      },
   
      "Test added entry is included in form post": function() {
         // Post the update...
         return browser.findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         // Check that the discarded changes were NOT posted...
         .findByCssSelector(TestCommon.pubDataNestedArrayValueCssSelector("FORM1SAVE_FORM_1","simple","1","new entry"))
            .then(null, function() {
               assert(false, "Test #5d - Added entry was not included in form post");
            })
         .end();
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});