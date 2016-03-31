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
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(registerSuite, assert, TestCommon, keys) {

   /* global window */

   var inlineEditSelectors = TestCommon.getTestSelectors("alfresco/renderers/InlineEditProperty");

   var selectors = {
      inlineEditProperties: {
         first: {
            readValue: TestCommon.getTestSelector(inlineEditSelectors, "readonly.value", ["INLINE_EDIT_1_ITEM_0"]),
            editForm: TestCommon.getTestSelector(inlineEditSelectors, "edit.form", ["INLINE_EDIT_1_ITEM_0"]),
            editIcon: TestCommon.getTestSelector(inlineEditSelectors, "edit.icon", ["INLINE_EDIT_1_ITEM_0"]),
            editSave: TestCommon.getTestSelector(inlineEditSelectors, "edit.save", ["INLINE_EDIT_1_ITEM_0"]),
            editCancel: TestCommon.getTestSelector(inlineEditSelectors, "edit.cancel", ["INLINE_EDIT_1_ITEM_0"]),
            editInput: TestCommon.getTestSelector(inlineEditSelectors, "edit.input", ["INLINE_EDIT_1_ITEM_0"])
         },
         second: {
            readValue: TestCommon.getTestSelector(inlineEditSelectors, "readonly.value", ["INLINE_EDIT_2_ITEM_0"]),
            editForm: TestCommon.getTestSelector(inlineEditSelectors, "edit.form", ["INLINE_EDIT_2_ITEM_0"]),
            editIcon: TestCommon.getTestSelector(inlineEditSelectors, "edit.icon", ["INLINE_EDIT_2_ITEM_0"]),
            editSave: TestCommon.getTestSelector(inlineEditSelectors, "edit.save", ["INLINE_EDIT_2_ITEM_0"]),
            editCancel: TestCommon.getTestSelector(inlineEditSelectors, "edit.cancel", ["INLINE_EDIT_2_ITEM_0"]),
            editInput: TestCommon.getTestSelector(inlineEditSelectors, "edit.input", ["INLINE_EDIT_2_ITEM_0"])
         },
         third: {
            readValue: TestCommon.getTestSelector(inlineEditSelectors, "readonly.value", ["INLINE_EDIT_3_ITEM_0"]),
            editForm: TestCommon.getTestSelector(inlineEditSelectors, "edit.form", ["INLINE_EDIT_3_ITEM_0"]),
            editIcon: TestCommon.getTestSelector(inlineEditSelectors, "edit.icon", ["INLINE_EDIT_3_ITEM_0"]),
            editSave: TestCommon.getTestSelector(inlineEditSelectors, "edit.save", ["INLINE_EDIT_3_ITEM_0"]),
            editCancel: TestCommon.getTestSelector(inlineEditSelectors, "edit.cancel", ["INLINE_EDIT_3_ITEM_0"]),
            editInput: TestCommon.getTestSelector(inlineEditSelectors, "edit.input", ["INLINE_EDIT_3_ITEM_0"])
         },
         fourth: {
            readValue: TestCommon.getTestSelector(inlineEditSelectors, "readonly.value", ["INLINE_EDIT_4_ITEM_0"]),
            editForm: TestCommon.getTestSelector(inlineEditSelectors, "edit.form", ["INLINE_EDIT_4_ITEM_0"]),
            editIcon: TestCommon.getTestSelector(inlineEditSelectors, "edit.icon", ["INLINE_EDIT_4_ITEM_0"]),
            editSave: TestCommon.getTestSelector(inlineEditSelectors, "edit.save", ["INLINE_EDIT_4_ITEM_0"]),
            editCancel: TestCommon.getTestSelector(inlineEditSelectors, "edit.cancel", ["INLINE_EDIT_4_ITEM_0"]),
            editInput: TestCommon.getTestSelector(inlineEditSelectors, "edit.input", ["INLINE_EDIT_4_ITEM_0"])
         },
         fifth: {
            readValue: TestCommon.getTestSelector(inlineEditSelectors, "readonly.value", ["INLINE_EDIT_5_ITEM_0"]),
            editForm: TestCommon.getTestSelector(inlineEditSelectors, "edit.form", ["INLINE_EDIT_5_ITEM_0"]),
            editIcon: TestCommon.getTestSelector(inlineEditSelectors, "edit.icon", ["INLINE_EDIT_5_ITEM_0"]),
            editSave: TestCommon.getTestSelector(inlineEditSelectors, "edit.save", ["INLINE_EDIT_5_ITEM_0"]),
            editCancel: TestCommon.getTestSelector(inlineEditSelectors, "edit.cancel", ["INLINE_EDIT_5_ITEM_0"]),
            editInput: TestCommon.getTestSelector(inlineEditSelectors, "edit.input", ["INLINE_EDIT_5_ITEM_0"])
         }
      }
   };

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
            return browser.findByCssSelector(selectors.inlineEditProperties.first.readValue)
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Test item (topic, no scope)", "Value not rendered correctly");
               });
         },

         "Edit widget not initially created": function() {
            return browser.findAllByCssSelector(selectors.inlineEditProperties.first.editForm)
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
         },

         "Edit icon initially invisible": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.first.editIcon)
               .isDisplayed()
               .then(function(result) {
                  assert.isFalse(result);
               });
         },

         "Icon appears on focus": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.first.readValue)
               .then(function(element) {
                  element.type(""); // Focus on element

                  browser.end()
                     .findByCssSelector(selectors.inlineEditProperties.first.editIcon)
                     .isDisplayed()
                     .then(function(result) {
                        assert.isTrue(result);
                     });
               });
         },

         "Icon disappears on blur": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.first.readValue)
               .then(function(element) {
                  element.type([keys.SHIFT, keys.TAB]); // Focus away from element

                  browser.end()
                     .findByCssSelector(selectors.inlineEditProperties.first.editIcon)
                     .isDisplayed()
                     .then(function(result) {
                        assert.isFalse(result);
                     });
               });
         },

         "Icon appears on mouseover": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.first.readValue)
               .moveMouseTo()
            .end()

            .findByCssSelector(selectors.inlineEditProperties.first.editIcon)
               .isDisplayed()
               .then(function(result) {
                  assert.isTrue(result);
               });
         },

         "Icon hides on mouseout": function() {
            return browser.findByCssSelector("body")
               .moveMouseTo(0, 0)
               .then(function() {
                  browser.end()
                     .findByCssSelector(selectors.inlineEditProperties.first.editIcon)
                     .isDisplayed()
                     .then(function(result) {
                        assert.isFalse(result);
                     });
               });
         },

         "Edit widgets are created on edit": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.first.editIcon)
               .click()
            .end()

            .findByCssSelector(selectors.inlineEditProperties.first.editForm);
         },

         "Read property is hidden when editing": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.first.readValue)
               .isDisplayed()
               .then(function(result) {
                  assert.isFalse(result, "Read-only span was not hidden");
               });
         },

         "Save and cancel buttons are displayed when editing": function() {
            return browser.findDisplayedByCssSelector(selectors.inlineEditProperties.first.editSave)
            .end()

            .findDisplayedByCssSelector(selectors.inlineEditProperties.first.editCancel);
         },

         "Escape key cancels editing": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.first.editInput)
               .pressKeys([keys.ESCAPE])
            .end()

            .findDisplayedByCssSelector(selectors.inlineEditProperties.first.readValue);
         },

         "Clicking on property fires topic": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.first.readValue)
               .click()
            .end()

            .getLastPublish("TEST_PROPERTY_LINK_CLICK", "Property link topic not published on click");
         },

         "Clicking on property does not start editing": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.first.editInput)
               .isDisplayed()
               .then(function(result) {
                  assert.isFalse(result, "Edit box revealed when clicking on property value");
               });
         },

         "Clicking on cancel button stops editing": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.first.readValue)
               .moveMouseTo()
               .then(function() {
                  return browser.end()
                     .findByCssSelector(selectors.inlineEditProperties.first.editIcon)
                     .click()
                  .end()

                  .findByCssSelector(selectors.inlineEditProperties.first.readValue)
                     .isDisplayed()
                     .then(function(result) {
                        assert.isFalse(result, "Edit mode not entered when clicking on icon");
                     })
                  .end()

                  .findByCssSelector(selectors.inlineEditProperties.first.editCancel)
                     .click()
                  .end()

                  .findDisplayedByCssSelector(selectors.inlineEditProperties.first.readValue);
               });
         },

         "CTRL-E starts editing": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.first.readValue)
               .pressKeys([keys.CONTROL, "e"])
               .pressKeys(keys.NULL)
            .end()

            .findByCssSelector(selectors.inlineEditProperties.first.editInput)
               .isDisplayed()
               .then(function(result) {
                  assert.isTrue(result, "Edit box not revealed on CTRL-E");
               });
         },

         "Changes published on save": function() {
            return browser.findDisplayedByCssSelector(selectors.inlineEditProperties.first.editInput)
               .clearValue()
               .type("New")
            .end()

            .findByCssSelector(selectors.inlineEditProperties.first.editSave)
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
            return browser.findDisplayedByCssSelector(selectors.inlineEditProperties.first.readValue)
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "New", "Read-only value not updated correctly");
               });
         },

         "Scoped property link update has response scoped": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.second.editIcon)
               .click()
            .end()

            .findByCssSelector(selectors.inlineEditProperties.second.editInput)
               .type("New2")
            .end()

            .findByCssSelector(selectors.inlineEditProperties.second.editSave)
               .clearLog()
               .click()
            .end()

            .getLastPublish("ALF_CRUD_UPDATE", true, "Property update not requested")
               .then(function(payload) {
                  assert.propertyVal(payload, "alfResponseScope", "SCOPED_", "Scoped property link generated incorrect alfResponseScope");
               });
         },

         "Property links publish correct payloads": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.first.readValue)
               .clearLog()
               .click()
            .end()

            .getLastPublish("TEST_PROPERTY_LINK_CLICK", true, "'Test item (topic, no scope)' did not publish correct topic")
               .then(function(payload) {
                  assert.propertyVal(payload, "alfResponseScope", "", "'Test item (topic, no scope)' generated incorrect alfResponseScope");
               })
            .end()

            .findByCssSelector(selectors.inlineEditProperties.second.readValue)
               .clearLog()
               .click()
            .end()

            .getLastPublish("SCOPED_TEST_PROPERTY_LINK_CLICK", true, "'Test item (topic, scoped)' did not publish correct topic")
               .then(function(payload) {
                  assert.propertyVal(payload, "alfResponseScope", "SCOPED_", "'Test item (topic, scoped)' generated incorrect alfResponseScope");
               })
            .end()

            .findByCssSelector(selectors.inlineEditProperties.third.readValue)
               .clearLog()
               .click()
            .end()

            .getLastPublish("SCOPED_ALF_NAVIGATE_TO_PAGE", true, "'Test item (no topic, scoped)' did not publish correct topic")
               .then(function(payload) {
                  assert.propertyVal(payload, "alfResponseScope", "SCOPED_", "'Test item (no topic, scoped)' generated incorrect alfResponseScope");
               });
         },

         "Rendered value is not double-encoded": function() {
            return browser.findById("LIST_UMLAUTS_ITEMS")
               .getVisibleText()
               .then(function(visibleText) {
                  assert.equal(visibleText, "test äöü test");
               });
         },

         "Cannot inject XSS code": function() {
            return browser.execute(function() {
                  return !!window.hackedProperty;
               })
               .then(function(isHacked) {
                  assert.isFalse(isHacked);
               });
         },

         "Edit encoded value": function() {
            // Move the mouse over the hidden edit icon...
            return browser.findByCssSelector(selectors.inlineEditProperties.fifth.editIcon)
               .moveMouseTo()
            .end()

            // Wait for it to appear and clikc it...
            .findDisplayedByCssSelector(selectors.inlineEditProperties.fifth.editIcon)
               .click()
            .end()

            // Check that the edit value isn't encoded...
            .findDisplayedByCssSelector(selectors.inlineEditProperties.fifth.editInput)
               .getProperty("value")
               .then(function(value) {
                  assert.equal(value, "<img src=\"1\" onerror=\"window.hackedProperty=true\">", "Incorrect edit field value");
               });
         },

         "Save value and check XSS is not injected": function() {
            return browser.findByCssSelector(selectors.inlineEditProperties.fifth.editSave)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.inlineEditProperties.fifth.readValue)
               .getVisibleText()
               .then(function(visibleText) {
                  assert.equal(visibleText, "<img src=\"1\" onerror=\"window.hackedProperty=true\">");
               })
            .end()

            .execute(function() {
                  return !!window.hackedProperty;
               })
               .then(function(isHacked) {
                  assert.isFalse(isHacked);
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});