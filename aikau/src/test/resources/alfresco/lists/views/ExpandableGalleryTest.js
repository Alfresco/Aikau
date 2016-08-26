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
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   var textBoxSelectors = TestCommon.getTestSelectors("alfresco/forms/controls/TextBox");
   var inlineEditPropertySelectors = TestCommon.getTestSelectors("alfresco/renderers/InlineEditProperty");

   var selectors = {
      textBoxes: {
         alternateExpanded: {
            input: TestCommon.getTestSelector(textBoxSelectors, "input", ["APPENDIX_TEXTBOX"]),
         }
      },
      inlineEditProperties: {
         alternateExpanded: {
            editIcon: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.icon", ["EXPANDED_LIST_INLINE_EDIT_ITEM_0"]),
            editSave: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.save", ["EXPANDED_LIST_INLINE_EDIT_ITEM_0"]),
            editCancel: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.cancel", ["EXPANDED_LIST_INLINE_EDIT_ITEM_0"]),
            editInput: TestCommon.getTestSelector(inlineEditPropertySelectors, "edit.input", ["EXPANDED_LIST_INLINE_EDIT_ITEM_0"])
         }
      }
   };

   defineSuite(module, {
      name: "Expandable Gallery View Tests",
      testPage: "/ExandableGallery",

      "There should be no expanded cells": function() {
         return this.remote.findDisplayedById("CELL_CONTAINER_ITEM_0")
            .end()

         .findAllByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Unexpected expanded panel found");
            });
      },

      "Click on a cell to expand": function() {
         return this.remote.findDisplayedById("CELL_CONTAINER_ITEM_0")
            .click()
            .end()

         .findByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel");
      },

      "Resize window to make sure expanded cell remains the same size": function() {
         var originalWidth;
         return this.remote.findByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel td")
            .getSize()
            .then(function(size) {
               originalWidth = size.width;
            })

         .setWindowSize(null, 1500, 768)

         .getSize()
            .then(function(size) {
               assert.isAbove(size.width, originalWidth, "Expanded panel cell should not have got smaller");
            });
      },

      "Check the expanded panel position": function() {
         // This verifies that the expanded panel has been inserted in the 2nd row...
         return this.remote.findByCssSelector(".alfresco-lists-views-layouts-Grid tr.alfresco-lists-views-layouts-Grid__expandedPanel:nth-child(2)");
      },

      "Check that expanded panel has focus": function() {
         return this.remote.getActiveElement()
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "Monthly HES Summary Data", "The form field in the expanded element was not focused");
            });
      },

      "Use escape key to close panel": function() {
         return this.remote.pressKeys(keys.ESCAPE)
            .waitForDeletedByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel");
      },

      "The expanded cell should be re-focused": function() {
         return this.remote.findByCssSelector(".alfresco-lists-views-layouts-Grid__cell--focused #CELL_CONTAINER_ITEM_0");
      },

      "Keyboard navigate to and expand another cell": function() {
         return this.remote.pressKeys(keys.ARROW_RIGHT)
            .findByCssSelector(".alfresco-lists-views-layouts-Grid__cell--focused #CELL_CONTAINER_ITEM_1")
            .end()

         .pressKeys(keys.RETURN)

         .findByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel")
         .end()

         .getActiveElement()
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "Telford and Wrekin Council", "The form field in the expanded element was not focused");
            });
      },

      "Use mouse to close expanded cell": function() {
         return this.remote.findById("CELL_CONTAINER_ITEM_1")
            .click()
            .end()

         .waitForDeletedByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel");
      },

      "Check that inline edit can be typed into without losing focus": function() {
         return this.remote.findByCssSelector("#EXPAND_LINK_ITEM_4 .label")
            .click()
         .end()

         .findDisplayedByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel")
         .end()

         .clearLog()

         .findByCssSelector(selectors.inlineEditProperties.alternateExpanded.editIcon)
            .click()
         .end()

         .findDisplayedByCssSelector(selectors.inlineEditProperties.alternateExpanded.editInput)
            .clearValue()
            .type("hello again")
         .end()

         .clearLog()

         .findByCssSelector(selectors.inlineEditProperties.alternateExpanded.editSave)
            .click()
         .end()

         .getLastPublish("ALT_INLINE_EDIT_SAVE")
            .then(function(payload) {
               assert.propertyVal(payload, "fake", "hello again");
            });
      },

      "Cursor key use on inline edit do not navigate list": function() {
         // NOTE: Because save is not handled in test page, input field will still be focused...
         var inputId;
         return this.remote.findDisplayedByCssSelector(selectors.inlineEditProperties.alternateExpanded.editInput)
            .clearValue()
            .type("test")
            .getAttribute("id")
            .then(function(id) {
               inputId = id;
            })
            .pressKeys([keys.ARROW_LEFT, keys.ARROW_UP, keys.ARROW_RIGHT, keys.ARROW_DOWN])
         .end()
         
         .getActiveElement()
            .getAttribute("id")
            .then(function(id) {
               assert.equal(inputId, id);
            });
      },

      "It is possible to type into form control without losing focus": function() {
         return this.remote.findDisplayedByCssSelector(selectors.textBoxes.alternateExpanded.input)
            .type("hello world")
         .end()

         .getLastPublish("EditCaveatGroupListView_valueChangeOf_APPENDIX_TEXTBOX")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "hello world");
            });
      },

      "Cursor key use on focused form control do not navigate list": function() {
         var inputId;
         return this.remote.findDisplayedByCssSelector(selectors.textBoxes.alternateExpanded.input)
            .getAttribute("id")
            .then(function(id) {
               inputId = id;
            })
            .pressKeys([keys.ARROW_LEFT, keys.ARROW_UP, keys.ARROW_RIGHT, keys.ARROW_DOWN])
         .end()
         
         .getActiveElement()
            .getAttribute("id")
            .then(function(id) {
               assert.equal(inputId, id);
            });
      }
   });

   defineSuite(module, {
      name: "Expandable Gallery View Tests (resizeByColumnCount=false)",
      testPage: "/ExandableGallery?resizeByColumnCount=false",

      "Select an item, check the expanded panel is shown": function() {
         return this.remote.findDisplayedById("CELL_CONTAINER_ITEM_0")
            .click()
         .end()

         .findDisplayedByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel");
      },

      "Resize window to make sure expanded cell remains the same size": function() {
         return this.remote.findByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel td")
         .end()

         .setWindowSize(null, 1500, 768)

         .findDisplayedByCssSelector(".alfresco-lists-views-layouts-Grid__expandedPanel");
      }
   });
});