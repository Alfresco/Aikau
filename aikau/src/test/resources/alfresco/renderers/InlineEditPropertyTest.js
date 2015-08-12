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
 * @author Martin Doyle
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
   function(registerSuite, expect, assert, require, TestCommon, keys) {

   var browser;

   registerSuite({
      name: "InlineEditProperty",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/InlineEditProperty", "InlineEditProperty")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Property is rendered correctly": function() {
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Test", "Value not rendered correctly");
            });
      },

      "Edit widget not initially created": function() {
         return browser.findAllByCssSelector("#INLINE_EDIT_ITEM_0 > .editWidgetNode > *")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Edit widget node should be empty until needed");
            });
      },

      "Edit icon initially invisible": function() {
         return browser.findByCssSelector(".alfresco_logging_DebugLog__header")
            .moveMouseTo()
         .end()
         .sleep(250) // Make sure the mouse isn't over the row!
         .findByCssSelector("#INLINE_EDIT_ITEM_0 .editIcon")
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Icon should not be displayed");
            });
      },

      "Render on new line configuration doesn't effect icon": function() {
         var valueX;
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 .inlineEditValue")
            .getPosition()
            .then(function(p) {
               valueX = p.x;
            })
         .end()
         .findByCssSelector("#INLINE_EDIT_ITEM_0 .editIcon")
            .getPosition()
            .then(function(p) {
               assert.notEqual(valueX, p.x, "The value and icon should NOT be starting at the same X co-ordinate");
            })
         .end();
      },

      "Icon appears on focus": function() {
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
            .then(function(element) {
               element.type(""); // Focus on element

               browser.end()
                  .findByCssSelector("#INLINE_EDIT_ITEM_0 .editIcon")
                  .isDisplayed()
                  .then(function(result) {
                     assert.isTrue(result, "Edit icon was not revealed on focus");
                  });
            });
      },

      "Icon disappears on blur": function() {
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
            .then(function(element) {
               element.type([keys.SHIFT, keys.TAB]); // Focus away from element

               browser.end()
                  .findByCssSelector("#INLINE_EDIT_ITEM_0 .editIcon")
                  .isDisplayed()
                  .then(function(result) {
                     assert.isFalse(result, "Edit icon was not hidden on blur");
                  });
            });
      },

      "Icon appears on mouseover": function() {
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
            .moveMouseTo()
            .end()

         .findByCssSelector("#INLINE_EDIT_ITEM_0 .editIcon")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Edit icon was not revealed on mouse over");
            });
      },

      "Icon hides on mouseout": function() {
         return browser.findByCssSelector("body")
            .moveMouseTo(0, 0)
            .then(function() {
               browser.end()
                  .findByCssSelector("#INLINE_EDIT_ITEM_0 .editIcon")
                  .isDisplayed()
                  .then(function(result) {
                     assert.isFalse(result, "Edit icon was not hidden on mouse out");
                  });
            });
      },

      "Edit widgets are created on edit": function() {
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 .editIcon")
            .click()
            .end()

         .findByCssSelector(".alfresco-forms-controls-TextBox:first-child")
            .then(null, function() {
               assert(false, "Clicking edit icon did not create the validation text box");
            });
      },

      "Read property is hidden when editing": function() {
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
            .isDisplayed()
            .then(function(result) {
               assert.isFalse(result, "Read-only span was not hidden");
            });
      },

      "Save and cancel buttons are displayed when editing": function() {
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 .action.save")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Save button not visible when editing");
            })
            .end()

         .findByCssSelector("#INLINE_EDIT_ITEM_0 .action.cancel")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Cancel button not visible when editing");
            });
      },

      "Escape key cancels editing": function() {
         return browser.findByCssSelector(".alfresco-forms-controls-TextBox:first-child")
            .pressKeys([keys.ESCAPE])
            .end()

         .findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Read-only value not revealed on cancelling edit");
            });
      },

      "Clicking on read-only value starts editing": function() {
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
            .click()
            .end()

         .findByCssSelector(".alfresco-forms-controls-TextBox:first-child")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Edit box not revealed when clicking on read-only value");
            });
      },

      "Clicking on cancel button stops editing": function() {
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 .action.cancel")
            .click()
            .end()

         .findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Read-only value not revealed on cancelling edit");
            });
      },

      "CTRL-E starts editing": function() {
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
            .pressKeys([keys.CONTROL, "e"])
            .pressKeys(keys.NULL)
            .end()

         .findByCssSelector(".alfresco-forms-controls-TextBox:first-child")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Edit box not revealed on CTRL-E");
            });
      },

      "Changes published on save": function() {
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 .dijitInputContainer input")
            .clearValue()
            .type("New")
         .end()

         .findByCssSelector("#INLINE_EDIT_ITEM_0 .action.save")
            .click()
         .end()

         .getLastPublish("ALF_CRUD_UPDATE")
            .then(function(payload) {
               assert.propertyVal(payload, "name", "New", "New value didn't publish correctly");
               assert.propertyVal(payload, "hiddenData", "hidden_update", "Hidden value didn't get included");
            });
      },

      "Readonly view displayed when finished editing": function() {
         return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Read-only span not revealed on save");
            })

         .getVisibleText()
            .then(function(text) {
               assert.equal(text, "New", "Read-only value not updated correctly");
            });
      },

      "Inline-edit select restores values on failed save": function() {
         return browser.findByCssSelector("#INLINE_SELECT_ITEM_0 > .alfresco-renderers-Property")
            .then(function(element) {
               return browser.moveMouseTo(element)
                  .then(function() {
                     return browser.end()
                        .findByCssSelector("#INLINE_SELECT_ITEM_0 .editIcon")
                        .click()
                        .end()

                     .findByCssSelector("#INLINE_SELECT_ITEM_0 .alfresco-forms-controls-BaseFormControl .dijitArrowButtonInner")
                        .click()
                        .end()

                     .findByCssSelector(".dijitPopup table tr:nth-child(2) td.dijitMenuItemLabel")
                        .click()
                        .end()

                     .findByCssSelector("#INLINE_SELECT_ITEM_0 .action.save")
                        .click()
                        .end()

                     .findByCssSelector("#INLINE_SELECT_ITEM_0 > .alfresco-renderers-Property")
                        .isDisplayed()
                        .then(function(result) {
                           assert.isTrue(result, "Read-only span not revealed on failed save");
                        })

                     .getVisibleText()
                        .then(function(text) {
                           assert.equal(text, "1", "Read-only value not restored correctly after failed save");
                        });
                  });
            });
      },

      "Check rendered alt text when no value available": function() {
         return browser.findByCssSelector("#INLINE_EDIT_NO_VALUE_ITEM_0 .editIcon")
            .getAttribute("alt")
            .then(function(alt) {
               assert.equal(alt, "Click to edit", "Alt text for missing value incorrect");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});