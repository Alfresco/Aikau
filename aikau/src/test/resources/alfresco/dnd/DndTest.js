/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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

   var pause = 150;

   defineSuite(module, {
      name: "Basic DND tests",
      testPage: "/basic-dnd",

      "Test that labels are localized": function() {
         return this.remote.findByCssSelector("#dojoUnique1 .title")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Value 1", "Item label was not localized");
            });
      },

      "Test there are no dropped items on page load": function() {
         return this.remote.findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > *")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The dropped items widget should be empty");
            });
      },

      "Test Drag From Palette To DropItems": function() {
         return this.remote.findByCssSelector("#dojoUnique1 .title")
            .moveMouseTo()
            .click()
            .pressMouseButton()
            .moveMouseTo(1, 1)
            .end()
            .findByCssSelector(".alfresco-dnd-DragAndDropTarget > div")
            .then(element => {
               return this.remote.moveMouseTo(element)
                  .sleep(500) // The drag is 'elastic' and this sleep allows the item to catch up with the mouse movement
                  .releaseMouseButton();
            })
            .end()
            .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The dropped item was found");
            });
      },

      "Test that dropped items labels are localized": function() {
         return this.remote.findByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper > .label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Value 1", "Dropped item label was not localized");
            });
      },

      "Test Form Value Updated After Drop": function() {
         return this.remote.findByCssSelector("#FORM1 .confirmationButton > span")
            .click()
            .end()
            .findByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM1_POST", "data", "name", "bob"))
            .then(null, function() {
               assert(false, "Form didn't contain the value from the dropped item");
            });
      },

      "Test Preset Form Control Populates Dropped Items": function() {
         return this.remote.findAllByCssSelector("#ROOT_DROPPED_ITEMS2 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The preset dropped item was found");
            });
      },

      "Test Preset Form Control Post Value": function() {
         return this.remote.findByCssSelector("#FORM2 .confirmationButton > span")
            .click()
            .end()
            .findByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM2_POST", "data", "preset", "value1"))
            .then(null, function() {
               assert(false, "Preset form didn't contain the initialised value.");
            });
      },

      "Test deleting preset dropped item": function() {
         return this.remote.findByCssSelector("#ROOT_DROPPED_ITEMS2 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper .delete")
            .click()
            .end()
            .findAllByCssSelector("#ROOT_DROPPED_ITEMS2 .alfresco-dnd-DragAndDropTarget > div.previewPanel > *")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The dropped items widget should be empty after deleting preset dropped item");
            });
      },

      "Test deleted preset value form value": function() {
         return this.remote.findAllByCssSelector(TestCommon.pubDataRowsCssSelector("FORM2_POST", "data"))
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Preset dropped item was not deleted");
            });
      }
   });

   defineSuite(module, {
      name: "DND items provided by list",
      testPage: "/list-of-dnd-items",

      "Check items can be loaded from a list": function() {
         return this.remote.findAllByCssSelector(".alfresco-dnd-DragAndDropItemsListView .alfresco-dnd-DragAndDropItem")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "The DND items were not populated");
            });
      },

      "Labels should not be double encoded": function() {
         return this.remote.findByCssSelector("#dojoUnique1 .title")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Workflows que j'ai initiés");
            });
      },

      "Labels should be XSS safe": function() {
         return this.remote.findByCssSelector("#dojoUnique2 .title")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "<img src=\"1\" onerror=\"window.hackedTextBoxValue=true\">");
            });
      }
   });

   defineSuite(module, {
      name: "Accessibility DND tests",
      testPage: "/basic-dnd",

      "Select item using keyboard": function() {
         return this.remote.pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.ENTER)
            .findAllByCssSelector(".alfresco-dnd-DragAndDropItem.selected")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The wrong number of items were selected");
            });
      },

      "Add item to target": function() {
         // 3 more tabs should highlight the first drop target...
         return this.remote.pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)

         // Hitting return should add the selected item...
         .pressKeys(keys.ENTER)
            .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The item was not added");
            });
      },

      "Submit the form to check the right item was added": function() {
         // Six more tabs should highlight the confirmation button
         return this.remote.pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.ENTER)
            .findByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM1_POST", "data", "name", "bob"))
            .then(null, function() {
               assert(false, "Form didn't contain the value added by keyboard");
            });
      },

      "Select another item": function() {
         // Shift tab 7 times should get back to the last item
         return this.remote.pressKeys([keys.SHIFT])
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys([keys.SHIFT]) // Remember to release the shift key!
            .pressKeys(keys.ENTER)
            .findAllByCssSelector(".alfresco-dnd-DragAndDropItem.selected")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Only one item should be selected, the other should be deselected");
            });

      },

      "Add the next item": function() {
         // Just one more tab should get to the target again...
         return this.remote.pressKeys(keys.TAB)
            .sleep(pause)

         // Hitting return should add the selected item...
         .pressKeys(keys.ENTER)
            .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "The second item was not added");
            });
      },

      "Check the initial order": function() {
         return this.remote.findByCssSelector("#FORM1 .previewPanel .alfresco-dnd-DroppedItemWrapper:nth-child(1) > .label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Value 1", "The items are not in the correct order");
            });
      },

      "Move item down a place": function() {
         // 3 tabs should get to the move down action...
         return this.remote.pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.ENTER)
            .findByCssSelector("#FORM1 .previewPanel .alfresco-dnd-DroppedItemWrapper:nth-child(1) > .label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "TextBox", "The item was not moved down a place");
            });
      },

      "Move item back up a place": function() {
         // We should still be focused on the same node, so a single shift-tab will get to the move up action...
         return this.remote.pressKeys([keys.SHIFT])
            .pressKeys(keys.TAB)
            .pressKeys([keys.SHIFT]) // Release the SHIFT key!
            .sleep(pause)
            .pressKeys(keys.ENTER)
            .findByCssSelector("#FORM1 .previewPanel .alfresco-dnd-DroppedItemWrapper:nth-child(1) > .label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Value 1", "The item was not moved back up");
            });
      },

      // TODO: This test is passing on Chrome but failing on Firefox
      // "Delete an item": function() {
      //    // 2 tabs should get to the delete item action
      //    return this.remote.pressKeys(keys.TAB)
      //       .sleep(pause)
      //       .pressKeys(keys.TAB)
      //       .sleep(pause)
      //       .pressKeys(keys.ENTER)

      //       .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
      //          .then(function(elements) {
      //                assert.lengthOf(elements, 1, "The item was not deleted");
      //          });
      // }
   });

   defineSuite(module, {
      name: "DND Nesting Tests",
      testPage: "/nested-dnd",

      "Check that preset nested items are rendered": function() {
         return this.remote.findAllByCssSelector("#FORM2 .alfresco-dnd-DroppedItem")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find nested preset item");
            });
      }
   });

   defineSuite(module, {
      name: "DND Modelling Tests",
      testPage: "/modelled-dnd",

      "Test Preset Form Control Populates Dropped Items": function() {
         return this.remote.findAllByCssSelector("#ROOT_DROPPED_ITEMS2 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The preset dropped item was found");
            });
      },

      "Test preset form control value renders the actual widget": function() {
         return this.remote.findAllByCssSelector("#ROOT_DROPPED_ITEMS2 .alfresco-forms-controls-TextArea")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The text area widget was not rendered");
            });
      },

      "Check that custom wrapper CSS defined in the model is present": function() {
         return this.remote.findAllByCssSelector(".custom-wrapper-class")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find custom wrapper class");
            });
      },

      "Check that custom item CSS defined in the model is present": function() {
         return this.remote.findAllByCssSelector(".custom-item-class")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find custom item class");
            });
      },

      "Drag and drop and item": function() {
         return this.remote.findByCssSelector("#dojoUnique1 .title")
            .moveMouseTo()
            .click()
            .pressMouseButton()
            .moveMouseTo(1, 1)
            .end()
            .findByCssSelector(".alfresco-dnd-DragAndDropTarget > div")
            .then(element => {
               return this.remote.moveMouseTo(element)
                  .sleep(500) // The drag is 'elastic' and this sleep allows the item to catch up with the mouse movement
                  .releaseMouseButton();
            })
            .end()
            .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The dropped item was found");
            });
      },

      "Check that the dropped item rendered the actual widget": function() {
         return this.remote.findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-forms-controls-TextArea")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The text area widget was not rendered");
            });
      },

      "Edit the widget to check that the dialog is displayed": function() {
         return this.remote.findByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper .action.edit")
            .click()
            .end()
            .findAllByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The edit dialog was not displayed");
            });
      },

      "Check that the form is initialised correctly": function() {
         return this.remote.findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG #ALF_EDIT_FORM_CONTROL_LABEL .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "No Label", "The edit dialog was not initialised correctly");
            });
      },

      "Update the label and check that the widget renders again": function() {
         return this.remote.findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG #ALF_EDIT_FORM_CONTROL_LABEL .dijitInputContainer input")
            .clearValue()
            .type("Updated Label")
            .end()
            .findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG .confirmationButton > span")
            .click()
            .end()
            .findByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-forms-controls-TextArea label")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Updated Label", "The widget was not re-rendered");
            });
      }
   });
});