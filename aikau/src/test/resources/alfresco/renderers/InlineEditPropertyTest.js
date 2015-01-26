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
      name: 'Inline Edit Property Test',
      'Basic': function () {

         var browser = this.remote;
         var testname = "Inline Edit Property Basic Test";
         return TestCommon.loadTestWebScript(this.remote, "/InlineEditProperty", testname)

            // Check that the edit icon isn't initially displayed...
            .findByCssSelector("#INLINE_EDIT .editIcon")
               .isDisplayed()
               .then(function(result) {
                  assert(result === false, "Test #1a - The edit icon should not be displayed");
               })
               .end()

            // Check that the property is rendered correctly...
            .findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .getVisibleText()
               .then(function(text) {
                  assert(text === "Test", "Test #1b - The read only value was not rendered correctly: " + text);
               })
               .end()

            // Check that the edit widget is not created...
            .findAllByCssSelector("#INLINE_EDIT > .editWidgetNode > *")
               .then(function(elements) {
                  assert(elements.length === 0, "Test #1c - The edit widget node should be empty until needed");
               })
               .end()

            // Move the mouse to the property and check that the icon appears...
            .findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .then(function(element) {
                  browser.moveMouseTo(element);
               })
               .sleep(500)
               .end()

            .findByCssSelector("#INLINE_EDIT .editIcon")
               .isDisplayed()
               .then(function(result) {
                  assert(result === true, "Test #2a - The edit icon was not revealed on mouse over");
               })

               // Click the icon (NOTE: intentionally not ending last chain)
               .click()
               .end()

            // Check that the edit widget is created...
            .findByCssSelector(".alfresco-forms-controls-DojoValidationTextBox:first-child")
               .then(
                  function(){ /* No action required */},
                  function(){assert(false, "Test #2b - Clicking the edit icon did not create the validation text box");}
               )
               .end()

            // Check that the read property is hidden...
            .findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .isDisplayed()
               .then(function(result) {
                  assert(result === false, "Test #2c - The read only span was not hidden");
               })
               .end()

            // Check that the save and cancel buttons are displayed
            .findByCssSelector("#INLINE_EDIT .action.save")
               .isDisplayed()
               .then(function(result) {
                  assert(result === true, "Test #2d - The save button was not revealed");
               })
               .end()
            .findByCssSelector("#INLINE_EDIT .action.cancel")
               .isDisplayed()
               .then(function(result) {
                  assert(result === true, "Test #2d - The cancel button was not revealed");
               })
               .end()

            // Use ESC to cancel editing...
            .pressKeys([keys.ESCAPE])
            .findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .isDisplayed()
               .then(function(result) {
                  assert(result === true, "Test #3a - The read only span was not revealed on edit cancel");
               })
               .end()

            // Use CTRL-E to start editing...
            .pressKeys([keys.CONTROL, "e"])
            .pressKeys([keys.NULL])
            
            // Check edit box has reappeared...
            .findByCssSelector(".alfresco-forms-controls-DojoValidationTextBox:first-child")
               .isDisplayed()
               .then(function(result) {
                  assert(result === true, "Test #4a - The edit box was not revealed on CTRL-E");
               })
               .end()

            // Enter some new text...
            .findByCssSelector("#INLINE_EDIT .dijitInputContainer input")
               .clearValue()
               .type("New")
               .end()
            
            // Click the save button...
            .findByCssSelector("#INLINE_EDIT .action.save")
               .click()
               .end()

            // Check the new value has been published...
            .findAllByCssSelector(TestCommon.topicSelector("ALF_CRUD_UPDATE", "publish", "any"))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #5a - Property update not requested");
               })
               .end()
            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "name", "New"))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #5b - New value didn't publish correctly");
               })
               .end()
            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "hiddenData", "hidden_update"))
            .then(function(elements) {
               assert(elements.length == 1, "Test #5b.1 - Hidden value didn't get included");
            })
            .end()

            // Check that the readonly view is displayed again...
            .findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .isDisplayed()
               .then(function(result) {
                  assert(result === true, "Test #5c - The read only span was not revealed on save");
               })
               .getVisibleText()
               .then(function(text) {
                  assert(text === "New", "Test #5d - The read only value was not updated correctly: " + text);
               })
               .end()

            // Check inline edit select (it should fail on update...
            .findByCssSelector("#INLINE_SELECT > .alfresco-renderers-Property")
               .then(function(element) {
                  browser.moveMouseTo(element);
               })
               .sleep(500)
               .end()
            .findByCssSelector("#INLINE_SELECT .editIcon")
               .click()
               .end()
             .findByCssSelector("#INLINE_SELECT .alfresco-forms-controls-BaseFormControl .dijitArrowButtonInner")
               .click()
               .end()
            .findByCssSelector(".dijitPopup table tr:nth-child(2) td.dijitMenuItemLabel")
               .click()
               .end()
            .findByCssSelector("#INLINE_SELECT .action.save")
               .click()
               .end()
            .findByCssSelector("#INLINE_SELECT > .alfresco-renderers-Property")
               .isDisplayed()
               .then(function(result) {
                  assert(result === true, "Test #6a - The read only span was not revealed on failed save");
               })
               .getVisibleText()
               .then(function(text) {
                  assert(text === "1", "Test #6b - The read only value was not restored correctly: " + text);
               })
               .end()
            
            .alfPostCoverageResults(browser);
      }
   });
});