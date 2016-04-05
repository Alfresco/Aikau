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
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   var inlineEditPropertySelectors = TestCommon.getTestSelectors("alfresco/renderers/InlineEditProperty");
   var inlineEditSelectSelectors = TestCommon.getTestSelectors("alfresco/renderers/InlineEditSelect");

   var selectors = {
      inlineEditProperties: {
         first: {
            label: TestCommon.getTestSelector(inlineEditPropertySelectors, "label", ["INLINE_EDIT_ITEM_0"]),
            readValue: TestCommon.getTestSelector(inlineEditPropertySelectors, "readonly.value", ["INLINE_EDIT_ITEM_0"]),
            editForm: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.form", ["INLINE_EDIT_ITEM_0"]),
            editIcon: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.icon", ["INLINE_EDIT_ITEM_0"]),
            editSave: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.save", ["INLINE_EDIT_ITEM_0"]),
            editCancel: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.cancel", ["INLINE_EDIT_ITEM_0"]),
            editInput: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.input", ["INLINE_EDIT_ITEM_0"])
         },
         second: {
            editIcon: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.icon", ["INLINE_EDIT_NO_VALUE_ITEM_0"])
         },
         third: {
            editIcon: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.icon", ["INLINE_EDIT_ITEM_1"]),
            readValue: TestCommon.getTestSelector(inlineEditPropertySelectors, "readonly.value", ["INLINE_EDIT_ITEM_1"])
         },
         fourth: {
            editIcon: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.icon", ["INLINE_EDIT_NO_VALUE_WITH_WARNING_ITEM_0"]),
            readValue: TestCommon.getTestSelector(inlineEditPropertySelectors, "readonly.value", ["INLINE_EDIT_NO_VALUE_WITH_WARNING_ITEM_0"]),
            editSave: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.save", ["INLINE_EDIT_NO_VALUE_WITH_WARNING_ITEM_0"]),
            editInput: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.input", ["INLINE_EDIT_NO_VALUE_WITH_WARNING_ITEM_0"])
         }
      },
      inlineEditSelects: {
         first: {
            label: TestCommon.getTestSelector(inlineEditSelectSelectors, "label", ["INLINE_SELECT_ITEM_0"]),
            readValue: TestCommon.getTestSelector(inlineEditSelectSelectors, "readonly.value", ["INLINE_SELECT_ITEM_0"]),
            editForm: TestCommon.getTestSelector(inlineEditSelectSelectors, "edit.form", ["INLINE_SELECT_ITEM_0"]),
            editIcon: TestCommon.getTestSelector(inlineEditSelectSelectors, "edit.icon", ["INLINE_SELECT_ITEM_0"]),
            editSave: TestCommon.getTestSelector(inlineEditSelectSelectors, "edit.save", ["INLINE_SELECT_ITEM_0"]),
            editCancel: TestCommon.getTestSelector(inlineEditSelectSelectors, "edit.cancel", ["INLINE_SELECT_ITEM_0"]),
            editOpenMenuIcon: TestCommon.getTestSelector(inlineEditSelectSelectors, "edit.open.menu.icon", ["INLINE_SELECT_ITEM_0"]),
            editOptions: {
               second: TestCommon.getTestSelector(inlineEditSelectSelectors, "edit.nth.option.label", ["INLINE_SELECT_ITEM_0", "2"])
            }
         }
      },

   };

   defineSuite(module, {
      name: "InlineEditProperty",
      testPage: "/InlineEditProperty",

      "Label is displayed": function() {
         return this.remote.findDisplayedByCssSelector(selectors.inlineEditProperties.first.label);
      },

      "Property is rendered correctly": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.first.readValue)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Test", "Value not rendered correctly");
            });
      },

      "Edit widget not initially created": function() {
         return this.remote.findAllByCssSelector("#INLINE_EDIT_ITEM_0 > .editWidgetNode > *")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Edit widget node should be empty until needed");
            });
      },

      "Edit icon initially invisible": function() {
         return this.remote.findByCssSelector(".alfresco_logging_DebugLog__header")
            .moveMouseTo()
            .click() // Make sure the mouse isn't over the row!
            .end()

         .findByCssSelector(selectors.inlineEditProperties.first.editIcon)
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Icon should not be displayed");
            });
      },

      "Render on new line configuration doesn't effect icon": function() {
         var valueX;
         return this.remote.findByCssSelector(selectors.inlineEditProperties.first.readValue)
            .getPosition()
            .then(function(p) {
               valueX = p.x;
            })
            .end()
            .findByCssSelector(selectors.inlineEditProperties.first.editIcon)
            .getPosition()
            .then(function(p) {
               assert.notEqual(valueX, p.x, "The value and icon should NOT be starting at the same X co-ordinate");
            })
            .end();
      },

      "Icon appears on focus": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.first.readValue)
            .then(element => {
               element.type(""); // Focus on element

               this.remote.end()
                  .findDisplayedByCssSelector(selectors.inlineEditProperties.first.editIcon);
            });
      },

      "Icon disappears on blur": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.first.readValue)
            .then(element => {
               element.type([keys.SHIFT, keys.TAB]); // Focus away from element

               this.remote.end()
                  .findByCssSelector(selectors.inlineEditProperties.first.editIcon)
                  .isDisplayed()
                  .then(function(result) {
                     assert.isFalse(result, "Edit icon was not hidden on blur");
                  });
            });
      },

      "Icon appears on mouseover": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.first.readValue)
            .moveMouseTo()
            .end()

         .findDisplayedByCssSelector(selectors.inlineEditProperties.first.editIcon);
      },

      "Icon hides on mouseout": function() {
         return this.remote.findByCssSelector("body")
            .moveMouseTo(0, 0)
            .then(() => {
               this.remote.end()
                  .findByCssSelector(selectors.inlineEditProperties.first.editIcon)
                  .isDisplayed()
                  .then(function(result) {
                     assert.isFalse(result, "Edit icon was not hidden on mouse out");
                  });
            });
      },

      "Edit widgets are created on edit": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.first.editIcon)
            .click()
            .end()

         .findByCssSelector(selectors.inlineEditProperties.first.editInput)
            .then(null, function() {
               assert(false, "Clicking edit icon did not create the validation text box");
            });
      },

      "Read property is hidden when editing": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.first.readValue)
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Read-only span was not hidden");
            });
      },

      "Save and cancel buttons are displayed when editing": function() {
         return this.remote.findDisplayedByCssSelector(selectors.inlineEditProperties.first.editSave)
            .end()

         .findDisplayedByCssSelector(selectors.inlineEditProperties.first.editCancel);
      },

      "Escape key cancels editing": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.first.editInput)
            .pressKeys([keys.ESCAPE])
            .end()

         .findDisplayedByCssSelector(selectors.inlineEditProperties.first.readValue);
      },

      "Clicking on read-only value starts editing": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.first.readValue)
            .click()
            .end()

         .findDisplayedByCssSelector(selectors.inlineEditProperties.first.editInput);
      },

      "Clicking on cancel button stops editing": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.first.editCancel)
            .click()
            .end()

         .findDisplayedByCssSelector(selectors.inlineEditProperties.first.readValue);
      },

      "CTRL-E starts editing": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.first.readValue)
            .pressKeys([keys.CONTROL, "e"])
            .pressKeys(keys.NULL)
            .end()

         .findDisplayedByCssSelector(selectors.inlineEditProperties.first.editInput);
      },

      "Changes published on save": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.first.editInput)
            .clearValue()
            .type("New")
            .end()

         .findByCssSelector(selectors.inlineEditProperties.first.editSave)
            .click()
            .end()

         .getLastPublish("ALF_CRUD_UPDATE")
            .then(function(payload) {
               assert.propertyVal(payload, "name", "New", "New value didn't publish correctly");
               assert.propertyVal(payload, "hiddenData", "hidden_update", "Hidden value didn't get included");
            });
      },

      "Readonly view displayed when finished editing": function() {
         return this.remote.findDisplayedByCssSelector(selectors.inlineEditProperties.first.readValue)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "New", "Read-only value not updated correctly");
            });
      },

      "Inline-edit select restores values on failed save": function() {
         return this.remote.findByCssSelector(selectors.inlineEditSelects.first.readValue)
            .then(element => {
               return this.remote.moveMouseTo(element)
                  .then(() => {
                     return this.remote.end()
                        .findByCssSelector(selectors.inlineEditSelects.first.editIcon)
                        .click()
                        .end()

                     .findByCssSelector(selectors.inlineEditSelects.first.editOpenMenuIcon)
                        .click()
                        .end()

                     .findDisplayedByCssSelector(selectors.inlineEditSelects.first.editOptions.second)
                        .click()
                        .end()

                     .findByCssSelector(selectors.inlineEditSelects.first.editSave)
                        .click()
                        .end()

                     .findDisplayedByCssSelector(selectors.inlineEditSelects.first.readValue)
                        .getVisibleText()
                        .then(function(text) {
                           assert.equal(text, "1", "Read-only value not restored correctly after failed save");
                        });
                  });
            });
      },

      "Check rendered alt text when no value available": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.second.editIcon)
            .getAttribute("alt")
            .then(function(alt) {
               assert.equal(alt, "Click to edit", "Alt text for missing value incorrect");
            });
      },

      "Check edit disabled when user has no write permissions": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.third.readValue)
            .moveMouseTo()
            .end()
            .findByCssSelector(selectors.inlineEditProperties.third.editIcon)
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The edit icon should not be displayed for items without write permission");
            });
      },

      "Check keyboard shortcut edit disabled when user has no write permissions": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.third.readValue)
            .click()
            .pressKeys([keys.CONTROL, "e"])
            .pressKeys(keys.NULL)
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Keyboard shortcut should not have worked for item without write permission");
            });
      },

      "Check warning message on item with no value": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.fourth.readValue)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "(No property set)", "Value not rendered correctly");
            });
      },

      "Check fade class applied to warning value": function() {
         return this.remote.findByCssSelector("#INLINE_EDIT_NO_VALUE_WITH_WARNING_ITEM_0 > .alfresco-renderers-Property.faded");
      },

      "Edit and save item check rendered value has prefix/suffix": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.fourth.editIcon)
            .click()
            .end()

         .findByCssSelector(selectors.inlineEditProperties.fourth.editInput)
            .clearValue()
            .type("Updated")
            .end()

         .findByCssSelector(selectors.inlineEditProperties.fourth.editSave)
            .click()
            .end()

         .findByCssSelector(selectors.inlineEditProperties.fourth.readValue)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "(Updated)", "Value not rendered correctly");
            });
      },

      "Check that faded style has been removed": function() {
         return this.remote.findAllByCssSelector("#INLINE_EDIT_NO_VALUE_WITH_WARNING_ITEM_0 > .alfresco-renderers-Property.faded")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Faded style was not removed when a value was provided");
            });
      },

      "Edit and save item to remove value to check warning returns": function() {
         return this.remote.findByCssSelector(selectors.inlineEditProperties.fourth.editIcon)
            .click()
            .end()

         .findByCssSelector(selectors.inlineEditProperties.fourth.editInput)
            .clearValue()
            .end()

         .findByCssSelector(selectors.inlineEditProperties.fourth.editSave)
            .click()
            .end()

         .findByCssSelector(selectors.inlineEditProperties.fourth.readValue)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "(No property set)", "Value not rendered correctly");
            });
      },

      "Check that faded style has been reapplied": function() {
         return this.remote.findByCssSelector("#INLINE_EDIT_NO_VALUE_WITH_WARNING_ITEM_0 > .alfresco-renderers-Property.faded");
      }
   });
});