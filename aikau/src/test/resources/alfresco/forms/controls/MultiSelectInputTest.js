/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
   function(registerSuite, assert, TestCommon, keys) {

      // Get the selectors for the MultiInputSelect widget...
      var MultiSelectInputSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/MultiSelectInput");
      var FormSelectors = TestCommon.getTestSelectors("alfresco/forms/Form");
      var DialogSelectors = TestCommon.getTestSelectors("alfresco/dialogs/AlfDialog");

      // Build a map of the selectors to use...
      var selectors = {
         control1: {
            loaded: TestCommon.getTestSelector(MultiSelectInputSelectors, "options.loaded.state", ["MULTISELECT_1"]),
            choice: TestCommon.getTestSelector(MultiSelectInputSelectors, "choice", ["MULTISELECT_1"]),
            firstChoice: {
               element: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.choice", ["MULTISELECT_1", "1"]),
               content: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.choice.content", ["MULTISELECT_1", "1"]),
               delete: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.choice.delete", ["MULTISELECT_1", "1"])
            },
            secondChoice: {
               element: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.choice", ["MULTISELECT_1", "2"]),
               content: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.choice.content", ["MULTISELECT_1", "2"]),
               delete: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.choice.delete", ["MULTISELECT_1", "2"])
            },
            thirdChoice: {
               element: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.choice", ["MULTISELECT_1", "3"]),
               content: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.choice.content", ["MULTISELECT_1", "3"]),
               delete: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.choice.delete", ["MULTISELECT_1", "3"])
            },
            result: TestCommon.getTestSelector(MultiSelectInputSelectors, "result", ["MULTISELECT_1"]),
            loading: TestCommon.getTestSelector(MultiSelectInputSelectors, "results.loading.message", ["MULTISELECT_1"]),
            firstResult: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.result", ["MULTISELECT_1", "1"]),
            secondResult: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.result", ["MULTISELECT_1", "2"]),
            fourthResult: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.result", ["MULTISELECT_1", "4"]),
            searchbox: TestCommon.getTestSelector(MultiSelectInputSelectors, "searchbox", ["MULTISELECT_1"]),
         },
         control2: {
            loaded: TestCommon.getTestSelector(MultiSelectInputSelectors, "options.loaded.state", ["MULTISELECT_2"]),
            searchbox: TestCommon.getTestSelector(MultiSelectInputSelectors, "searchbox", ["MULTISELECT_2"]),
            result: TestCommon.getTestSelector(MultiSelectInputSelectors, "result", ["MULTISELECT_2"]),
            choice: {
               content: TestCommon.getTestSelector(MultiSelectInputSelectors, "choice.content", ["MULTISELECT_2"]),
            },
            selectedChoice: {
               content: TestCommon.getTestSelector(MultiSelectInputSelectors, "selected.choice.content", ["MULTISELECT_2"])
            },
            firstChoice: {
               content: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.choice.content", ["MULTISELECT_2", "1"])
            },
            secondChoice: {
               element: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.choice", ["MULTISELECT_2", "2"]),
            },
            firstResult: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.result", ["MULTISELECT_2", "1"]),
            fourthResult: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.result", ["MULTISELECT_2", "4"])
         },
         control3: {
            disabled: TestCommon.getTestSelector(MultiSelectInputSelectors, "disabled", ["MULTISELECT_3"])
         },
         control4: {
            control: TestCommon.getTestSelector(MultiSelectInputSelectors, "control", ["MULTISELECT_4"]),
            choice: {
               content: TestCommon.getTestSelector(MultiSelectInputSelectors, "choice.content", ["MULTISELECT_4"]),
               element: TestCommon.getTestSelector(MultiSelectInputSelectors, "choice", ["MULTISELECT_4"]),
               delete: TestCommon.getTestSelector(MultiSelectInputSelectors, "choice.delete", ["MULTISELECT_4"])
            },
            secondChoice: {
               content: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.choice.content", ["MULTISELECT_4", "2"])
            },
            result: TestCommon.getTestSelector(MultiSelectInputSelectors, "result", ["MULTISELECT_4"]),
            results: TestCommon.getTestSelector(MultiSelectInputSelectors, "results", ["MULTISELECT_4"])
         },
         controlInDialog: {
            result: TestCommon.getTestSelector(MultiSelectInputSelectors, "result", ["MULTISELECT_IN_DIALOG_CONTROL_RESULTS"]),
            secondResult: TestCommon.getTestSelector(MultiSelectInputSelectors, "nth.result", ["MULTISELECT_IN_DIALOG", "2"]),
         }
      };

      var formSelectors = {
         form1: {
            confirmationButton: TestCommon.getTestSelector(FormSelectors, "confirmation.button", ["FORM1"]),
            disabledConfirmationButton: TestCommon.getTestSelector(FormSelectors, "confirmation.button.disabled", ["FORM1"])
         },
         form3: {
            confirmationButton: TestCommon.getTestSelector(FormSelectors, "confirmation.button", ["FORM3"]),
            disabledConfirmationButton: TestCommon.getTestSelector(FormSelectors, "confirmation.button.disabled", ["FORM3"])
         }
      };

      var dialogSelectors = {
         dialog1: {
            confirmationButton: TestCommon.getTestSelector(DialogSelectors, "form.dialog.confirmation.button", ["DIALOG_WITH_MULTISELECT"])
         }
      };

      registerSuite(function() {
         var browser;

         return {
            name: "Multi Select Input Tests",

            // STARTING STATE
            // 
            // Control 1
            //    choices: "tag1", "tag11"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    focused element: none
            //    
            setup: function() {
               browser = this.remote;
               return TestCommon.loadTestWebScript(this.remote, "/MultiSelectInput", "Multi Select Input Tests").end();
            },

            beforeEach: function() {
               browser.end();
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: "tag1", "tag11"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    focused element: none
            //    
            "Controls are fully loaded": function() {

               return browser.findAllByCssSelector(selectors.control1.loaded)
                  .then(function(elements) {
                     assert.lengthOf(elements, 1, "First MultiSelect control not fully loaded");
                  })
               .end()

               .findAllByCssSelector(selectors.control2.loaded)
                  .then(function(elements) {
                     assert.lengthOf(elements, 1, "Second MultiSelect control not fully loaded");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: "tag1", "tag11"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    focused element: none
            //    
            "Preset values are rendered by control": function() {
               return browser.findAllByCssSelector(selectors.control1.choice)
                  .then(function(elements) {
                     assert.lengthOf(elements, 2, "Did not render two preset values for control");
                  })
               .end()

               .findByCssSelector(selectors.control1.firstChoice.content)
                  .getVisibleText()
                  .then(function(text) {
                     assert.equal(text, "tag1", "Did not display first tag label correctly");
                  })
               .end()

               .findByCssSelector(selectors.control1.secondChoice.content)
                  .getVisibleText()
                  .then(function(text) {
                     assert.equal(text, "tag11", "Did not display second tag label correctly");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: "tag1", "tag11"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    *results dropdown: visible
            //    
            // Misc
            //    *focused element: Control 2
            //    
            "Clicking on control no longer loses responses to a second query": function() {
               return browser.findByCssSelector(selectors.control2.searchbox)
                  .click()
               .end()

               .findAllByCssSelector(selectors.control2.result)
                  .then(function(elements) {
                     assert.lengthOf(elements, 14, "Did not bring up results");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: "tag1", "tag11"
            //    searchbox: ""
            //    *results dropdown: visible
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    *results dropdown: hidden
            //    
            // Misc
            //    *focused element: Control 1
            //    
            "Focusing on control brings up initial results": function() {
               return browser.findById("FOCUS_HELPER_BUTTON")
                  .click()
                  .pressKeys(keys.TAB)
               .end()

               .findAllByCssSelector(selectors.control1.result)
                  .then(function(elements) {
                     assert.lengthOf(elements, 7, "Did not bring up initial results");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: "tag1", "tag11"
            //    searchbox: ""
            //    *results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    focused element: Control 1
            //    
            "Selecting already-chosen item in dropdown does not choose item again": function() {
               return browser.findByCssSelector(selectors.control1.firstResult)
                  .click()
                  .pressKeys(keys.ESCAPE)
               .end()

               .findAllByCssSelector(selectors.control1.choice)
                  .then(function(elements) {
                     assert.lengthOf(elements, 2, "Added already-selected choice to control");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    *choices: "tag1", "tag11", "tag2"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    focused element: Control 1
            //    
            "Selecting item in dropdown chooses that item": function() {
               return browser.findById("FOCUS_HELPER_BUTTON")
                  .click()
                  .pressKeys(keys.TAB)
               .end()

               .findByCssSelector(selectors.control1.secondResult)
                  .click()
               .end()

               .findAllByCssSelector(selectors.control1.choice)
                  .then(function(elements) {
                     assert.lengthOf(elements, 3, "Did not add new choice to control");
                  })
               .end()

               .findByCssSelector(selectors.control1.thirdChoice.content)
                  .getVisibleText()
                  .then(function(text) {
                     assert.equal(text, "tag2", "Did not add selected tag at end of choices");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: "tag1", "tag11", "tag2"
            //    *searchbox: "tag2"
            //    *results dropdown: visible
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    focused element: Control 1
            //    
            "Typing into search box filters results": function() {
               return browser.findByCssSelector(selectors.control1.searchbox)
                  .type("tag2")
                  .waitForDeletedByCssSelector(selectors.control1.secondResult)
               .end()

               .findAllByCssSelector(selectors.control1.result)
                  .then(function(elements) {
                     assert.lengthOf(elements, 1, "Did not filter results");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: "tag1", "tag11", "tag2"
            //    *searchbox: "12"
            //    results dropdown: visible
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    focused element: Control 1
            //    
            "Typing into search box filters results for strings in middle of name": function() {
               return browser.findByCssSelector(selectors.control1.searchbox)
                  .clearValue()
                  .type("12")
                  .waitForDeletedByCssSelector(selectors.control1.secondResult)
               .end()

               .findAllByCssSelector(selectors.control1.result)
                  .then(function(elements) {
                     assert.lengthOf(elements, 1, "Did not filter results for string in middle of name" + elements);
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: "tag1", "tag11", "tag2"
            //    *searchbox: "(a"
            //    results dropdown: visible
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    focused element: Control 1
            //    
            "Search box correctly filters on special reg exp chars": function() {
               return browser.findByCssSelector(selectors.control1.searchbox)
                  .clearValue()
                  .type("(a")
                  .waitForDeletedByCssSelector(selectors.control1.secondResult)
               .end()

               .findAllByCssSelector(selectors.control1.result)
                  .then(function(elements) {
                     assert.lengthOf(elements, 1, "Did not filter results using special reg exp character");
                  })
               .end()

               .findByCssSelector(selectors.control1.searchbox)
                  .clearValue();
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    *choices: "tag1", "tag2"
            //    *searchbox: ""
            //    *results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    focused element: Control 1
            //    
            "Clicking cross on a chosen item removes it": function() {
               return browser.findByCssSelector(selectors.control1.secondChoice.delete)
                  .click()
                  .waitForDeletedByCssSelector(selectors.control1.thirdChoice.element)
               .end()

               .findAllByCssSelector(selectors.control1.choice)
                  .then(function(elements) {
                     assert.lengthOf(elements, 2, "Did not remove choice");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: "tag1", "tag2"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    *focused element: Form 1 submit
            //    
            "Submitting form submits correct values from control": function() {
               return browser.findByCssSelector(formSelectors.form1.confirmationButton)
                  .click()
                  .end()

               .getLastPublish("FORM_POST", "Could not find form submission")
                  .then(function(payload) {
                     assert.deepPropertyVal(payload, "tags[0].name", "tag1", "Failed to submit tag1 name");
                     assert.deepPropertyVal(payload, "tags[0].value", "workspace://SpacesStore/06bd4708-8998-47be-a4ea-0f418bc7bb38", "Failed to submit tag1 value");
                     assert.deepPropertyVal(payload, "tags[1].name", "tag2", "Failed to submit tag2 name");
                     assert.deepPropertyVal(payload, "tags[1].value", "workspace://SpacesStore/84a27335-6008-4ddc-8a27-724225bbed3d", "Failed to submit tag2 value");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    *choices: "tag1", "tag2", "newtag13(a)"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    *focused element: Control 1
            //    
            "Keyboard can navigate and select items in dropdown": function() {
               return browser.findByCssSelector(selectors.control1.searchbox)
                  .type("new")
                  .waitForDeletedByCssSelector(selectors.control1.fourthResult)
                  .pressKeys([keys.ARROW_DOWN, keys.ARROW_DOWN, keys.ARROW_UP, keys.ENTER])
               .end()

               .findAllByCssSelector(selectors.control1.choice)
                  .then(function(elements) {
                     assert.lengthOf(elements, 3, "Did not add new choice to control");
                  })
               .end()

               .findByCssSelector(selectors.control1.thirdChoice.content)
                  .getVisibleText()
                  .then(function(text) {
                     assert.equal(text, "newtag13(a)", "Did not add selected tag at end of choices");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: "tag1", "tag2", "newtag13(a)"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    *focused element: Focus helper
            //    
            "Selecting item with keyboard does not persist previous search": function() {
               return browser.findByCssSelector(selectors.control1.searchbox)
                  .pressKeys(keys.ARROW_DOWN)
               .end()
               
               .findAllByCssSelector(selectors.control1.fourthResult)
               .end()
               
               .findAllByCssSelector(selectors.control1.result)
                  .then(function(elements) {
                     assert.lengthOf(elements, 7, "Did not return full list of results after keyboard choice selection");
                  })
               .end()

               .findById("FOCUS_HELPER_BUTTON")
                  .click();
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    *choices: None
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    *focused element: Control 1
            //    
            "Deleting all items disables confirmation button": function() {
               return browser.findByCssSelector(selectors.control1.firstChoice.delete)
                  .click()
                  .waitForDeletedByCssSelector(selectors.control1.thirdChoice.element)
                  .end()

               .findByCssSelector(selectors.control1.secondChoice.delete)
                  .click()
                  .waitForDeletedByCssSelector(selectors.control1.secondChoice.element)
                  .end()

               .findByCssSelector(selectors.control1.firstChoice.delete)
                  .click()
                  .waitForDeletedByCssSelector(selectors.control1.firstChoice.element)
                  .end()

               .findAllByCssSelector(formSelectors.form1.disabledConfirmationButton)
                  .then(function(elements) {
                     assert.lengthOf(elements, 1, "The confirmation button was not disabled when all the items were removed");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: None
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    focused element: Control 1
            //    
            "Custom label format is used for choices": function() {
               return browser.findByCssSelector(selectors.control2.firstChoice.content)
                  .getVisibleText()
                  .then(function(text) {
                     assert.equal(text, "Those that belong to the emperor", "Did not display custom label format (type=choice) for choice");
                  })
                  .getAttribute("title")
                  .then(function(title) {
                     assert.equal(title, "ID=CAT_01, Name=Those that belong to the emperor", "Did not display custom label format (type=full) for choice");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: None
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    *searchbox: "the"
            //    *results dropdown: visible
            //    
            // Misc
            //    *focused element: Control 2
            //    
            "Custom label format is used for results": function() {
               return browser.findByCssSelector(selectors.control2.searchbox)
                  .type("the")
                  .waitForDeletedByCssSelector(selectors.control2.fourthResult)
                  .end()

               .findByCssSelector(selectors.control2.firstResult)
                  .getVisibleText()
                  .then(function(text) {
                     assert.equal(text, "CAT_01: Those that belong to the emperor", "Did not display custom label format (type=result) for result");
                  })
                  .getAttribute("title")
                  .then(function(title) {
                     assert.equal(title, "ID=CAT_01, Name=Those that belong to the emperor", "Did not display custom label format (type=full) for result");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: None
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor", "Innumerable ones"
            //    searchbox: "the"
            //    results dropdown: visible
            //    
            // Misc
            //    focused element: Control 2
            //    
            "Choices do not exceed max width": function() {
               return browser.findByCssSelector(selectors.control2.firstChoice.content)
                  .getSize()
                  .then(function(size) {
                     assert(size.width < 151, "Choice was not restricted to under 150px as requested");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: None
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    *choices: "Those that belong to the emperor"
            //    *searchbox: ""
            //    *results dropdown: hidden
            //    
            // Misc
            //    focused element: Control 2
            //    
            "Arrow key selects choice and backspace key deletes selected choice only": function() {
               return browser.findByCssSelector(selectors.control2.searchbox)
                  .pressKeys(keys.ESCAPE)
                  .sleep(100)
                  .pressKeys(keys.ARROW_LEFT)
               .end()

               .findByCssSelector(selectors.control2.selectedChoice.content)
                  .getVisibleText()
                  .then(function(visibleText) {
                     assert.equal(visibleText, "Innumerable ones", "Did not select correct choice");
                  })
               .end()

               .findByCssSelector(selectors.control2.searchbox)
                  .pressKeys(keys.BACKSPACE)
                  .waitForDeletedByCssSelector(selectors.control2.secondChoice.element)
               .end()

               .findByCssSelector(selectors.control2.choice.content)
                  .getVisibleText()
                  .then(function(visibleText) {
                     assert.equal(visibleText, "Those that belong to the emperor", "Did not delete correct choice");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: None
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    *focused element: Dialog control
            //    *[Dialog displayed and dialog control has results visible]
            //    
            "Opening MultiSelect in dialog still displays dropdown properly": function() {
               return browser.findByCssSelector("[widgetid=\"CREATE_FORM_DIALOG\"] .dijitButtonNode")
                  .click()
               .end()

               .findByCssSelector(selectors.controlInDialog.secondResult)
                  .isDisplayed()
                  .then(function(isDisplayed) {
                     assert.isTrue(isDisplayed, "Unable to see result in dropdown");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: None
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    *focused element: Create dialog button
            //    *
            //    
            "Dialog MultiSelect submits correct data": function() {
               return browser.findByCssSelector(selectors.controlInDialog.secondResult)
                  .click()
               .end()

               .findByCssSelector(dialogSelectors.dialog1.confirmationButton)
                  .click()
               .end()

               .getLastPublish("DIALOG_POST", "Could not find dialog submission")
                  .then(function(payload) {
                     assert.deepPropertyVal(payload, "tags[0].name", "tag2", "Failed to submit tag2 name from dialog");
                     assert.deepPropertyVal(payload, "tags[0].value", "workspace://SpacesStore/84a27335-6008-4ddc-8a27-724225bbed3d", "Failed to submit tag2 value from dialog");
                  });
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    choices: None
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    focused element: Create dialog button
            //    
            "Third control is disabled": function() {
               return browser.findByCssSelector(selectors.control3.disabled);
            },

            // STATE AFTER THIS TEST
            // 
            // Control 1
            //    *choices: "tag1", "tag11"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Control 2
            //    choices: "Those that belong to the emperor"
            //    searchbox: ""
            //    results dropdown: hidden
            //    
            // Misc
            //    *focused element: Set tags value button
            //    
            "Setting a value replaces not appends": function() {
               return browser.findById("SET_TAGS_VALUE_BUTTON")
                  .click()
               .end()

               .findAllByCssSelector(selectors.control1.choice)
                  .then(function(elements) {
                     assert.lengthOf(elements, 2, "Did not render two values for control");
                  })
               .end()

               .findByCssSelector(selectors.control1.firstChoice.content)
                  .getVisibleText()
                  .then(function(text) {
                     assert.equal(text, "tag1", "Did not display first tag label correctly");
                  })
               .end()

               .findByCssSelector(selectors.control1.secondChoice.content)
                  .getVisibleText()
                  .then(function(text) {
                     assert.equal(text, "tag11", "Did not display second tag label correctly");
                  })
                  .end()

               .findById("SET_TAGS_VALUE_BUTTON")
                  .click()
               .end()

               .findAllByCssSelector(selectors.control1.choice)
                  .then(function(elements) {
                     assert.lengthOf(elements, 2, "Does not still render two values for control");
                  })
               .end()

               .findByCssSelector(selectors.control1.firstChoice.content)
                  .getVisibleText()
                  .then(function(text) {
                     assert.equal(text, "tag1", "Did not display first tag label correctly");
                  })
               .end()

               .findByCssSelector(selectors.control1.secondChoice.content)
                  .getVisibleText()
                  .then(function(text) {
                     assert.equal(text, "tag11", "Did not display second tag label correctly");
                  });
            },

            "Post Coverage Results": function() {
               TestCommon.alfPostCoverageResults(this, browser);
            }
         };
      });

      registerSuite(function() {
         var browser;

         return {
            name: "Multi Select Input Tests (Fixed Options)",

            setup: function() {
               browser = this.remote;
               return TestCommon.loadTestWebScript(this.remote, "/MultiSelectInput", "Multi Select Input Tests").end();
            },

            beforeEach: function() {
               browser.end();
            },

            "Removing option from unfocused control does not induce dropdown": function() {
               return browser.findByCssSelector(selectors.control4.choice.delete)
                  .click()
               .end()

               .waitForDeletedByCssSelector(selectors.control4.choice.content)

               .findByCssSelector(selectors.control4.results)
                  .isDisplayed()
                  .then(function(isDisplayed) {
                     assert.isFalse(isDisplayed);
                  });
            },

            "Can click on control and choose an option": function() {
               return browser.findByCssSelector(selectors.control4.control)
                  .click()
               .end()

               .findByCssSelector(selectors.control4.results + " [title=\"Foam Strawberries\"]")
                  .click()
               .end()

               .findByCssSelector(selectors.control4.choice.content)
                  .getVisibleText()
                  .then(function(visibleText) {
                     assert.equal(visibleText, "Foam Strawberries");
                  });
            },

            "Can filter options and select second option": function() {
               return browser.findByCssSelector(selectors.control4.control)
                  .click()
                  .pressKeys("mi")
               .end()

               .findAllByCssSelector(selectors.control4.result)
                  .then(function(elements) {
                     assert.lengthOf(elements, 1);
                  })
               .end()

               .findByCssSelector(selectors.control4.result)
                  .click()
               .end()

               .findByCssSelector(selectors.control4.secondChoice.content)
                  .getVisibleText()
                  .then(function(visibleText) {
                     assert.equal(visibleText, "White Chocolate Mice");
                  });
            },

            "Post Coverage Results": function() {
               TestCommon.alfPostCoverageResults(this, browser);
            }
         };
      });
   }
);