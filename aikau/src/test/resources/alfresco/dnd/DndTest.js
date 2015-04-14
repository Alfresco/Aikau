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
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

   var browser;
   registerSuite({

      name: "Basic DND tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/basic-dnd", "Basic DND Testing")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test that labels are localized": function() {
         return browser.findByCssSelector("#dojoUnique1 .title")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Value 1", "Item label was not localized");
            });
      },

      "Test there are no dropped items on page load": function() {
         return browser.findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > *")
            .then(function(elements) {
                  assert.lengthOf(elements, 0, "The dropped items widget should be empty");
            });
      },

      "Test Drag From Palette To DropItems": function () {
         return browser.findByCssSelector("#dojoUnique1 .title")
            .moveMouseTo()
            .click()
            .pressMouseButton()
            .moveMouseTo(1, 1)
         .end()
         .findByCssSelector(".alfresco-dnd-DragAndDropTarget > div")
            .then(function(element) {
               browser.moveMouseTo(element);
            })
            .sleep(500) // The drag is 'elastic' and this sleep allows the item to catch up with the mouse movement
            .releaseMouseButton()
         .end()
         .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
                  assert.lengthOf(elements, 1, "The dropped item was found");
            });
      },

      "Test that dropped items labels are localized": function() {
         return browser.findByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper > .label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Value 1", "Dropped item label was not localized");
            });
      },
      
      "Test Form Value Updated After Drop": function() {
         return browser.findByCssSelector("#FORM1 .confirmationButton > span")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM1_POST","data","name","bob"))
            .then(null, function() {
               assert(false, "Form didn't contain the value from the dropped item");
            });
      },
      
      "Test Preset Form Control Populates Dropped Items": function() {
         return browser.findAllByCssSelector("#ROOT_DROPPED_ITEMS2 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
                  assert.lengthOf(elements, 1, "The preset dropped item was found");
            });
      },
      
      "Test Preset Form Control Post Value": function() {
         return browser.findByCssSelector("#FORM2 .confirmationButton > span")
            .click()
         .end()
         .findByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM2_POST","data","preset","value1"))
            .then(null, function() {
               assert(false, "Preset form didn't contain the initialised value.");
            });
      },
      
      "Test deleting preset dropped item": function() {
         return browser.findByCssSelector("#ROOT_DROPPED_ITEMS2 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper .delete")
            .click()
         .end()
         .findAllByCssSelector("#ROOT_DROPPED_ITEMS2 .alfresco-dnd-DragAndDropTarget > div.previewPanel > *")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The dropped items widget should be empty after deleting preset dropped item");
            });
      },
      
      "Test deleted preset value form value": function() {
         return browser.findAllByCssSelector(TestCommon.pubDataRowsCssSelector("FORM2_POST","data"))
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Preset dropped item was not deleted");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({

      name: "DND items provided by list",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/list-of-dnd-items", "DND items provided by list")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check items can be loaded from a list": function() {
         return browser.findAllByCssSelector(".alfresco-dnd-DragAndDropItemsListView .alfresco-dnd-DragAndDropItem")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "The DND items were not populated");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   var pause = 150;
   registerSuite({

      name: "Accessibility DND tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/basic-dnd", "Accessibility DND Testing")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Select item using keyboard": function() {
         return browser.pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.ENTER)
            .findAllByCssSelector(".alfresco-dnd-DragAndDropItem.selected")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "The wrong number of items were selected");
               });
      },

      "Add item to target": function() {
         // 3 more tabs should highlight the first drop target...
         return browser.pressKeys(keys.TAB)
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
         return browser.pressKeys(keys.TAB)
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
            .findByCssSelector(TestCommon.pubDataNestedValueCssSelector("FORM1_POST","data","name","bob"))
            .then(null, function() {
               assert(false, "Form didn't contain the value added by keyboard");
            });
      },

      "Select another item": function() {
         // Shift tab 7 times should get back to the last item
         return browser.pressKeys([keys.SHIFT])
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
         return browser.pressKeys(keys.TAB)
            .sleep(pause)

            // Hitting return should add the selected item...
            .pressKeys(keys.ENTER)
            .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
               .then(function(elements) {
                     assert.lengthOf(elements, 2, "The second item was not added");
               });
      },

      "Check the initial order": function() {
         return browser.findByCssSelector("#FORM1 .previewPanel .alfresco-dnd-DroppedItemWrapper:nth-child(1) > .label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Value 1", "The items are not in the correct order");
            });
      },

      "Move item down a place": function() {
         // 3 tabs should get to the move down action...
         return browser.pressKeys(keys.TAB)
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
         return browser.pressKeys([keys.SHIFT])
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
      //    return browser.pressKeys(keys.TAB)
      //       .sleep(pause)
      //       .pressKeys(keys.TAB)
      //       .sleep(pause)
      //       .pressKeys(keys.ENTER)
            
      //       .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
      //          .then(function(elements) {
      //                assert.lengthOf(elements, 1, "The item was not deleted");
      //          });
      // },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({

      name: "DND Nesting Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/nested-dnd", "DND Nesting Tests")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check that preset nested items are rendered": function() {
         return browser.findAllByCssSelector("#FORM2 .alfresco-dnd-DroppedItem")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find nested preset item");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({

      name: "DND Modelling Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/modelled-dnd", "DND Modelling Tests")
            .end();
      },

       beforeEach: function() {
         browser.end();
      },

      "Test Preset Form Control Populates Dropped Items": function() {
         return browser.findAllByCssSelector("#ROOT_DROPPED_ITEMS2 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The preset dropped item was found");
            });
      },

      "Test preset form control value renders the actual widget": function() {
         return browser.findAllByCssSelector("#ROOT_DROPPED_ITEMS2 .alfresco-forms-controls-TextArea")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The text area widget was not rendered");
            });
      },

      "Drag and drop and item": function () {
         return browser.findByCssSelector("#dojoUnique1 .title")
            .moveMouseTo()
            .click()
            .pressMouseButton()
            .moveMouseTo(1, 1)
         .end()
         .findByCssSelector(".alfresco-dnd-DragAndDropTarget > div")
            .then(function(element) {
               browser.moveMouseTo(element);
            })
            .sleep(500) // The drag is 'elastic' and this sleep allows the item to catch up with the mouse movement
            .releaseMouseButton()
         .end()
         .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
                  assert.lengthOf(elements, 1, "The dropped item was found");
            });
      },

      "Check that the dropped item rendered the actual widget": function() {
         return browser.findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-forms-controls-TextArea")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The text area widget was not rendered");
            });
      },

      "Edit the widget to check that the dialog is displayed": function() {
         return browser.findByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper .action.edit")
            .click()
         .end()
         .findAllByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The edit dialog was not displayed");
            });
      },

      "Check that the form is initialised correctly": function() {
         return browser.findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG #ALF_EDIT_FORM_CONTROL_LABEL .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert.equal(resultText, "No Label", "The edit dialog was not initialised correctly");
            });
      },

      "Update the label and check that the widget renders again": function() {
         return browser.findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG #ALF_EDIT_FORM_CONTROL_LABEL .dijitInputContainer input")
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
      },

     "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({

      name: "Inherited DND Configuration Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/additional-config-dnd", "Inherited DND Configuration Tests")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check outer widget doesn't inherit configuration": function() {
         // Select the available widget...
         return browser.pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.ENTER)

            // Tab to the target and add the widget...
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.ENTER)
            .sleep(pause)

            // Edit the item...
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
            .pressKeys(keys.ENTER)
            .sleep(pause)

            // Now check that there are 2 form controls (should have inherited one additional configuration field)
            .findAllByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG .alfresco-forms-controls-BaseFormControl")
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "Found an unexpected number of form controls");
               });
      },

      "Check nested item inherits configuration": function() {
         // Close the previous edit dialog...
         return browser.findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG .cancellationButton > span")
            .click()
         .end()

         .sleep(1000) // Make sure dialog disappears...
         .pressKeys(keys.TAB)
         .sleep(pause)
         .pressKeys(keys.ENTER)
         .sleep(pause)
         
         // Tab to the edit button and edit the nested widget...
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
         .pressKeys(keys.ENTER)
         .sleep(pause)

         // Now check that there are 3 form controls (should have inherited one additional configuration field)
         .findAllByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG .alfresco-forms-controls-BaseFormControl")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Found an unexpected number of form controls");
            });

      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });

   registerSuite({

      name: "Multi-source DND tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/multi-source-dnd", "Multi-source DND tests")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Select item in source one, then select item in source two to deselect item in source one": function() {
         // Select the item in the first source...
         return browser.pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.ENTER)

            // Tab to the second source and select its item...
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.ENTER)
            .sleep(pause)

            // Check that just one item is selected...
            .findAllByCssSelector(".alfresco-dnd-DragAndDropItem.selected")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "The wrong number of items were selected");
               });
      },

      "Drag and drop a single use item": function () {
         return browser.findByCssSelector("#DRAG_PALETTE2 .dojoDndItem .title")
            .moveMouseTo()
            .click()
            .pressMouseButton()
            .moveMouseTo(1, 1)
         .end()
         .findByCssSelector(".alfresco-dnd-DragAndDropTarget > div")
            .then(function(element) {
               browser.moveMouseTo(element);
            })
            .sleep(500) // The drag is 'elastic' and this sleep allows the item to catch up with the mouse movement
            .releaseMouseButton()
         .end()
         .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
                  assert.lengthOf(elements, 1, "The dropped item was not found");
            })
         .findAllByCssSelector("#DRAG_PALETTE2 .dojoDndItem")
            .then(function(elements) {
                  assert.lengthOf(elements, 0, "The dragged single use item was not removed from the items list");
            });
      },

      "Delete the dropped single use item to reinstate": function() {
         return browser.findByCssSelector(".alfresco-dnd-DroppedItemWrapper .action.delete img")
            .click()
         .end()
         .findAllByCssSelector("#DRAG_PALETTE2 .dojoDndItem")
            .then(function(elements) {
                  assert.lengthOf(elements, 1, "The deleted single use item was not reinstated");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});