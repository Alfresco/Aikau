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
 * @author Martin Doyle
 */
define(["intern!object",
      "intern/chai!expect",
      "intern/chai!assert",
      "require",
      "alfresco/TestCommon",
      "intern/dojo/node!leadfoot/keys"
   ],
   function(registerSuite, expect, assert, require, TestCommon, keys) {

registerSuite(function(){
   var browser;

   return {
         name: "InlineEditPropertyLink",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/InlineEditPropertyLink", "InlineEditPropertyLink").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Property is rendered correctly": function() {
            return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Test item (topic, no scope)", "Value not rendered correctly");
               });
         },

         "Edit widget not initially created": function() {
            return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 [data-dojo-attach-point=\"formWidgetNode\"]") // Make sure placeholder is present
               .end()

            .findAllByCssSelector("#INLINE_EDIT_ITEM_0 .alfresco-forms-Form")
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "Edit widget node should be empty until needed");
               });
         },

         "Edit icon initially invisible": function() {
            return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 .editIcon")
               .isDisplayed()
               .then(function(result) {
                  assert.isFalse(result, "Icon should not be displayed");
               });
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

            .findByCssSelector("#INLINE_EDIT_ITEM_0 .alfresco-forms-Form");
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

         "Clicking on property fires topic": function() {
            return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
               .click()
               .end()

            .getLastPublish("TEST_PROPERTY_LINK_CLICK", "Property link topic not published on click");
         },

         "Clicking on property does not start editing": function() {
            return browser.findByCssSelector(".alfresco-forms-controls-TextBox:first-child")
               .isDisplayed()
               .then(function(result) {
                  assert.isFalse(result, "Edit box revealed when clicking on property value");
               });
         },

         "Clicking on cancel button stops editing": function() {
            return browser.findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
               .moveMouseTo()
               .then(function() {
                  return browser.end()
                     .findByCssSelector("#INLINE_EDIT_ITEM_0 .editIcon")
                     .click()
                     .end()

                  .findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
                     .isDisplayed()
                     .then(function(result) {
                        assert.isFalse(result, "Edit mode not entered when clicking on icon");
                     })
                     .end()

                  .findByCssSelector("#INLINE_EDIT_ITEM_0 .action.cancel")
                     .click()
                     .end()

                  .findByCssSelector("#INLINE_EDIT_ITEM_0 > .alfresco-renderers-Property")
                     .isDisplayed()
                     .then(function(result) {
                        assert.isTrue(result, "Read-only value not revealed on cancelling edit");
                     });
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
            return browser.findByCssSelector(".alfresco-forms-controls-TextBox:first-child")
               .isDisplayed()
               .then(function(result) {
                  assert.isTrue(result, "Edit box not visible");
               })
               .end()

            .findByCssSelector("#INLINE_EDIT_ITEM_0 .dijitInputContainer input")
               .clearValue()
               .type("New")
               .end()

            .findByCssSelector("#INLINE_EDIT_ITEM_0 .action.save")
               .click()
               .end()

            .getLastPublish("ALF_CRUD_UPDATE", true, "Property update not requested")
               .then(function(payload) {
                  assert.propertyVal(payload, "name", "New", "New value didn't publish correctly");
                  assert.propertyVal(payload, "hiddenData", "hidden_update", "Hidden value didn't get included");
                  assert.propertyVal(payload, "alfResponseScope", "", "Unscoped property link generated alfResponseScope");
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

         "Scoped property link update has response scoped": function() {
            return browser.findByCssSelector("#LIST_TOPIC_SCOPED .editIcon")
               .click()
               .end()

            .findByCssSelector("#LIST_TOPIC_SCOPED .alfresco-forms-controls-TextBox:first-child .dijitInputContainer input")
               .type("New2")
               .end()

            .findByCssSelector("#LIST_TOPIC_SCOPED .save")
               .clearLog()
               .click()
               .end()

            .getLastPublish("ALF_CRUD_UPDATE", true, "Property update not requested")
               .then(function(payload) {
                  assert.propertyVal(payload, "alfResponseScope", "SCOPED_", "Scoped property link generated incorrect alfResponseScope");
               });
         },

         "Property links publish correct payloads": function() {
            return browser.findByCssSelector("#LIST_TOPIC_NOSCOPE .alfresco-renderers-InlineEditProperty .alfresco-renderers-Property")
               .clearLog()
               .click()
               .end()

            .getLastPublish("TEST_PROPERTY_LINK_CLICK", true, "'Test item (topic, no scope)' did not publish correct topic")
               .then(function(payload) {
                  assert.propertyVal(payload, "alfResponseScope", "", "'Test item (topic, no scope)' generated incorrect alfResponseScope");
               })
               .end()

            .findByCssSelector("#LIST_TOPIC_SCOPED .alfresco-renderers-InlineEditProperty .alfresco-renderers-Property")
               .clearLog()
               .click()
               .end()

            .getLastPublish("SCOPED_TEST_PROPERTY_LINK_CLICK", true, "'Test item (topic, scoped)' did not publish correct topic")
               .then(function(payload) {
                  assert.propertyVal(payload, "alfResponseScope", "SCOPED_", "'Test item (topic, scoped)' generated incorrect alfResponseScope");
               })
               .end()

            .findByCssSelector("#LIST_NOTOPIC_SCOPED .alfresco-renderers-InlineEditProperty .alfresco-renderers-Property")
               .clearLog()
               .click()
               .end()

            .getLastPublish("SCOPED_ALF_NAVIGATE_TO_PAGE", true, "'Test item (no topic, scoped)' did not publish correct topic")
               .then(function(payload) {
                  assert.propertyVal(payload, "alfResponseScope", "SCOPED_", "'Test item (no topic, scoped)' generated incorrect alfResponseScope");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
      });
   });