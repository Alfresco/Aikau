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

      var browser;

      registerSuite({
         name: "InlineEditPropertyLink",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/InlineEditPropertyLink", "InlineEditPropertyLink")
               .end();
         },

         teardown: function() {
            browser.alfPostCoverageResults(browser);
         },

         "Property is rendered correctly": function() {
            return browser.findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Test", "Value not rendered correctly");
               })
               .end();
         },

         "Edit widget not initially created": function() {
            return browser.findAllByCssSelector("#INLINE_EDIT > .editWidgetNode > *")
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "Edit widget node should be empty until needed");
               })
               .end();
         },

         "Edit icon initially invisible": function() {
            return browser.findByCssSelector("#INLINE_EDIT .editIcon")
               .isDisplayed()
               .then(function(result) {
                  assert.isFalse(result, "Icon should not be displayed");
               })
               .end();
         },

         "Icon appears on focus": function() {
            return browser.findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .then(function(element) {
                  element.type(""); // Focus on element

                  browser.findByCssSelector("#INLINE_EDIT .editIcon")
                     .isDisplayed()
                     .then(function(result) {
                        assert.isTrue(result, "Edit icon was not revealed on focus");
                     })
                     .end();
               })
               .end();
         },

         "Icon disappears on blur": function() {
            return browser.findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .then(function(element) {
                  element.type([keys.SHIFT, keys.TAB]); // Focus away from element

                  browser.findByCssSelector("#INLINE_EDIT .editIcon")
                     .isDisplayed()
                     .then(function(result) {
                        assert.isFalse(result, "Edit icon was not hidden on blur");
                     })
                     .end();
               })
               .end();
         },

         "Icon appears on mouseover": function() {
            return browser.findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .moveMouseTo()
               .end()

            .findByCssSelector("#INLINE_EDIT .editIcon")
               .isDisplayed()
               .then(function(result) {
                  assert.isTrue(result, "Edit icon was not revealed on mouse over");
               })
               .end();
         },

         "Icon hides on mouseout": function() {
            return browser.findByCssSelector("body")
               .moveMouseTo(0, 0)
               .then(function() {
                  browser.findByCssSelector("#INLINE_EDIT .editIcon")
                     .isDisplayed()
                     .then(function(result) {
                        assert.isFalse(result, "Edit icon was not hidden on mouse out");
                     })
                     .end();
               })
               .end();
         },

         "Edit widgets are created on edit": function() {
            return browser.findByCssSelector("#INLINE_EDIT .editIcon")
               .click()
               .end()

            .findByCssSelector(".alfresco-forms-controls-TextBox:first-child")
               .then(null, function() {
                  assert(false, "Clicking edit icon did not create the validation text box");
               })
               .end();
         },

         "Read property is hidden when editing": function() {
            return browser.findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .isDisplayed()
               .then(function(result) {
                  assert.isFalse(result, "Read-only span was not hidden");
               })
               .end();
         },

         "Save and cancel buttons are displayed when editing": function() {
            return browser.findByCssSelector("#INLINE_EDIT .action.save")
               .isDisplayed()
               .then(function(result) {
                  assert.isTrue(result, "Save button not visible when editing");
               })
               .end()

            .findByCssSelector("#INLINE_EDIT .action.cancel")
               .isDisplayed()
               .then(function(result) {
                  assert.isTrue(result, "Cancel button not visible when editing");
               })
               .end();
         },

         "Escape key cancels editing": function() {
            return browser.findByCssSelector(".alfresco-forms-controls-TextBox:first-child")
               .pressKeys([keys.ESCAPE])
               .end()

            .findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .isDisplayed()
               .then(function(result) {
                  assert.isTrue(result, "Read-only value not revealed on cancelling edit");
               })
               .end();
         },

         "Clicking on property fires topic": function() {
            return browser.findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .click()
               .end()

            .findAllByCssSelector(TestCommon.topicSelector("TEST_PROPERTY_LINK_CLICK", "publish", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Property link topic not published on click");
               })
               .end();
         },

         "Clicking on property does not start editing": function() {
            return browser.findByCssSelector(".alfresco-forms-controls-TextBox:first-child")
               .isDisplayed()
               .then(function(result) {
                  assert.isFalse(result, "Edit box revealed when clicking on property value");
               })
               .end();
         },

         "Clicking on cancel button stops editing": function() {
            return browser.findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .moveMouseTo()
               .then(function() {
                  browser.findByCssSelector("#INLINE_EDIT .editIcon")
                     .click()
                     .end()

                  .findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
                     .isDisplayed()
                     .then(function(result) {
                        assert.isFalse(result, "Edit mode not entered when clicking on icon");
                     })
                     .end()

                  .findByCssSelector("#INLINE_EDIT .action.cancel")
                     .click()
                     .end()

                  .findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
                     .isDisplayed()
                     .then(function(result) {
                        assert.isTrue(result, "Read-only value not revealed on cancelling edit");
                     })
                     .end();
               })
               .end();
         },

         "CTRL-E starts editing": function() {
            return browser.findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .pressKeys([keys.CONTROL, "e"])
               .pressKeys(keys.NULL)
               .end()

            .findByCssSelector(".alfresco-forms-controls-TextBox:first-child")
               .isDisplayed()
               .then(function(result) {
                  assert.isTrue(result, "Edit box not revealed on CTRL-E");
               })
               .end();
         },

         "Changes published on save": function() {
            return browser.findByCssSelector(".alfresco-forms-controls-TextBox:first-child")
               .isDisplayed()
               .then(function(result) {
                  assert.isTrue(result, "Edit box not visible");
               })
               .end()

            .findByCssSelector("#INLINE_EDIT .dijitInputContainer input")
               .clearValue()
               .type("New")
               .end()

            .findByCssSelector("#INLINE_EDIT .action.save")
               .click()
               .end()

            .findAllByCssSelector(TestCommon.topicSelector("ALF_CRUD_UPDATE", "publish", "any"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Property update not requested");
               })
               .end()

            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "name", "New"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "New value didn't publish correctly");
               })
               .end()

            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "hiddenData", "hidden_update"))
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Hidden value didn't get included");
               })
               .end();
         },

         "Readonly view displayed when finished editing": function() {
            return browser.findByCssSelector("#INLINE_EDIT > .alfresco-renderers-Property")
               .isDisplayed()
               .then(function(result) {
                  assert.isTrue(result, "Read-only span not revealed on save");
               })

            .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "New", "Read-only value not updated correctly");
               })
               .end();
         }

      });
   });