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
 * @author Martin Doyle
 */
define([
      "intern!object",
      "intern/chai!assert",
      "require",
      "alfresco/TestCommon",
      "intern/dojo/node!leadfoot/keys"
   ],
   function(registerSuite, assert, require, TestCommon, keys) {

      var browser;
      registerSuite({
         name: "Multi Select Input Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/MultiSelectInput", "Multi Select Input Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Controls are fully loaded": function() {
            return browser.findAllByCssSelector("#MULTISELECT_1_CONTROL.alfresco-forms-controls-MultiSelect--loaded")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "First MultiSelect control not fully loaded");
               })
               .end()

            .findAllByCssSelector("#MULTISELECT_2_CONTROL.alfresco-forms-controls-MultiSelect--loaded")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Second MultiSelect control not fully loaded");
               });
         },

         "Preset values are rendered by control": function() {
            return browser.findAllByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice")
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "Did not render two preset values for control");
               })
               .end()

            .findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(1) .alfresco-forms-controls-MultiSelect__choice__content")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "tag1", "Did not display first tag label correctly");
               })
               .end()

            .findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(2) .alfresco-forms-controls-MultiSelect__choice__content")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "tag11", "Did not display second tag label correctly");
               });
         },

         "Clicking on control no longer loses responses to a second query": function() {
            return browser.findByCssSelector("#MULTISELECT_2_CONTROL .alfresco-forms-controls-MultiSelect__search-box")
               .click()
               .end()

            .findAllByCssSelector("#MULTISELECT_2_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result")
               .then(function(elements) {
                  assert.lengthOf(elements, 14, "Did not bring up results");
               });
         },

         "Focusing on control brings up initial results": function() {
            return browser.findById("FOCUS_HELPER_BUTTON")
               .click()
               .pressKeys(keys.TAB)
               .end()

            .findAllByCssSelector("#MULTISELECT_1_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result")
               .then(function(elements) {
                  assert.lengthOf(elements, 7, "Did not bring up initial results");
               });
         },

         "Selecting already-chosen item in dropdown does not choose item again": function() {
            return browser.findByCssSelector("#MULTISELECT_1_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result:nth-child(4)")
               .click()
               .pressKeys(keys.ESCAPE)
               .end()

            .findById("FOCUS_HELPER_BUTTON")
               .click()
               .pressKeys(keys.TAB)
               .end()

            .findAllByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice")
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "Added already-selected choice to control");
               });
         },

         "Selecting item in dropdown chooses that item": function() {
            return browser.findByCssSelector("#MULTISELECT_1_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result:nth-child(5)")
               .click()
               .end()

            .findAllByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice")
               .then(function(elements) {
                  assert.lengthOf(elements, 3, "Did not add new choice to control");
               })
               .end()

            .findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(3) .alfresco-forms-controls-MultiSelect__choice__content")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "tag2", "Did not add selected tag at end of choices");
               });
         },

         "Typing into search box filters results": function() {
            return browser.findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__search-box")
               .type("tag2")
               .waitForDeletedByCssSelector("#MULTISELECT_1_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result:nth-child(5)")
               .end()

            .findAllByCssSelector("#MULTISELECT_1_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Did not filter results");
               });
         },

         "Typing into search box filters results for strings in middle of name": function() {
            return browser.findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__search-box")
               .clearValue()
               .type("12")
               .waitForDeletedByCssSelector("#MULTISELECT_1_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result:nth-child(2)")
               .end()

            .findAllByCssSelector("#MULTISELECT_1_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Did not filter results for string in middle of name" + elements);
               });
         },

         "Search box correctly filters on special reg exp chars": function() {
            return browser.findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__search-box")
               .clearValue()
               .type("(a")
               .waitForDeletedByCssSelector("#MULTISELECT_1_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result:nth-child(5)")
               .end()

            .findAllByCssSelector("#MULTISELECT_1_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Did not filter results using special reg exp character");
               })
               .end()

            .findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__search-box")
               .clearValue();
         },

         "Clicking cross on a chosen item removes it": function() {
            return browser.findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(2) .alfresco-forms-controls-MultiSelect__choice__close-button")
               .click()
               .waitForDeletedByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(3)")
               .end()

            .findAllByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice")
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "Did not remove choice");
               });
         },

         "Submitting form submits correct values from control": function() {
            return browser.findByCssSelector("#FORM1 .confirmationButton .dijitButtonNode")
               .click()
               .end()

            .getLogEntries({
                  type: "PUBLISH",
                  topic: "FORM_POST",
                  pos: "last"
               })
               .then(function(payload) {
                  assert.isNotNull(payload, "Could not find form submission");
                  if (payload) {
                     assert.deepPropertyVal(payload, "tags[0].name", "tag1", "Failed to submit tag1 name");
                     assert.deepPropertyVal(payload, "tags[0].value", "workspace://SpacesStore/06bd4708-8998-47be-a4ea-0f418bc7bb38", "Failed to submit tag1 value");
                     assert.deepPropertyVal(payload, "tags[1].name", "tag2", "Failed to submit tag2 name");
                     assert.deepPropertyVal(payload, "tags[1].value", "workspace://SpacesStore/84a27335-6008-4ddc-8a27-724225bbed3d", "Failed to submit tag2 value");
                  }
               });
         },

         "Keyboard can navigate and select items in dropdown": function() {
            return browser.findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__search-box")
               .type("new")
               .waitForDeletedByCssSelector("#MULTISELECT_1_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result:nth-child(7)")
               .pressKeys([keys.ARROW_DOWN, keys.ARROW_DOWN, keys.ARROW_UP, keys.ENTER])
               .end()

            .findAllByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice")
               .then(function(elements) {
                  assert.lengthOf(elements, 3, "Did not add new choice to control");
               })
               .end()

            .findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(3) .alfresco-forms-controls-MultiSelect__choice__content")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "newtag13(a)", "Did not add selected tag at end of choices");
               });
         },

         "Selecting item with keyboard does not persist previous search": function() {
            return browser.findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__search-box")
               .click()
               .end()

            .findAllByCssSelector("#MULTISELECT_1_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result")
               .then(function(elements) {
                  assert.lengthOf(elements, 7, "Did not return full list of results after keyboard choice selection");
               })
               .end()

            .findById("FOCUS_HELPER_BUTTON")
               .click()
         },

         "Deleting all items disables confirmation button": function() {
            return browser.findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(1) .alfresco-forms-controls-MultiSelect__choice__close-button")
               .click()
               .waitForDeletedByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(3)")
               .end()

            .findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(1) .alfresco-forms-controls-MultiSelect__choice__close-button")
               .click()
               .waitForDeletedByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(2)")
               .end()

            .findByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(1) .alfresco-forms-controls-MultiSelect__choice__close-button")
               .click()
               .waitForDeletedByCssSelector("#MULTISELECT_1_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(1)")
               .end()

            .findAllByCssSelector("#FORM1 .confirmationButton.dijitDisabled")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "The confirmation button was not disabled when all the items were removed");
               });
         },

         "Custom label format is used for choices": function() {
            return browser.findByCssSelector("#MULTISELECT_2_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(1) .alfresco-forms-controls-MultiSelect__choice__content")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Those that belong to the emperor", "Did not display custom label format (type=choice) for choice");
               })
               .getAttribute("title")
               .then(function(title) {
                  assert.equal(title, "ID=CAT_01, Name=Those that belong to the emperor", "Did not display custom label format (type=full) for choice");
               });
         },

         "Custom label format is used for results": function() {
            return browser.findByCssSelector("#MULTISELECT_2_CONTROL .alfresco-forms-controls-MultiSelect__search-box")
               .type("the")
               .waitForDeletedByCssSelector("#MULTISELECT_2_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result:nth-child(7)")
               .end()

            .findByCssSelector("#MULTISELECT_2_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result:nth-child(4)")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "CAT_01: Those that belong to the emperor", "Did not display custom label format (type=result) for result");
               })
               .getAttribute("title")
               .then(function(title) {
                  assert.equal(title, "ID=CAT_01, Name=Those that belong to the emperor", "Did not display custom label format (type=full) for result");
               });
         },

         "Choices do not exceed max width": function() {
            return browser.findByCssSelector("#MULTISELECT_2_CONTROL .alfresco-forms-controls-MultiSelect__choice:nth-child(1) .alfresco-forms-controls-MultiSelect__choice__content")
               .getSize()
               .then(function(size) {
                  assert(size.width < 151, "Choice was not restricted to under 150px as requested");
               });
         },

         "Opening MultiSelect in dialog still displays dropdown properly": function() {
            return browser.findByCssSelector("[widgetid=\"CREATE_FORM_DIALOG\"] .dijitButtonNode")
               .click()
               .end()

            .findByCssSelector("#MULTISELECT_IN_DIALOG_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result:nth-child(5)")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "Unable to see result in dropdown");
               });
         },

         "Dialog MultiSelect submits correct data": function() {
            return browser.findByCssSelector("#MULTISELECT_IN_DIALOG_CONTROL_RESULTS .alfresco-forms-controls-MultiSelect__results__result:nth-child(5)")
               .click()
               .end()

            .findByCssSelector("#DIALOG_WITH_MULTISELECT .footer .confirmationButton .dijitButtonNode")
               .click()
               .end()

            .getLogEntries({
                  type: "PUBLISH",
                  topic: "DIALOG_POST",
                  pos: "last"
               })
               .then(function(payload) {
                  assert.isNotNull(payload, "Could not find dialog submission");
                  if (payload) {
                     assert.deepPropertyVal(payload, "tags[0].name", "tag2", "Failed to submit tag2 name from dialog");
                     assert.deepPropertyVal(payload, "tags[0].value", "workspace://SpacesStore/84a27335-6008-4ddc-8a27-724225bbed3d", "Failed to submit tag2 value from dialog");
                  }
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      });
   }
);