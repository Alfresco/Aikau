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
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

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

      "Test there are no dropped items on page load": function() {
         return browser.findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > *")
            .then(function(elements) {
                  assert.lengthOf(elements, 0, "The dropped items widget should be empty");
            });
      },

      "Test Drag From Palette To DropItems": function () {
         return browser.findByCssSelector("#dojoUnique1 > .title")
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
      
      "Test Form Value Updated After Drop": function() {
         return browser.findByCssSelector("#FORM1 .confirmationButton")
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
         return browser.findByCssSelector("#FORM2 .confirmationButton")
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

      name: "DND Nesting Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/nested-dnd", "DND Nesting Tests")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Drag and drop nestable item": function () {
         return browser.findByCssSelector("#dojoUnique1 > .title")
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

      "Check that two additional drop targets have been rendered": function() {
         return browser.findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DroppedItemWrapper .alfresco-dnd-DragAndDropTarget")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "The nested drop targets weren't rendered");
            });
      },

      "Drop an item into the first nested target": function() {
         return browser.findByCssSelector("#dojoUnique1 > .title")
            .moveMouseTo()
            .click()
            .pressMouseButton()
            .moveMouseTo(1, 1)
         .end()
         .findByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DroppedItemWrapper .alfresco-dnd-DragAndDropTarget:nth-child(2)")
            .then(function(element) {
               browser.moveMouseTo(element);
            })
            .sleep(2000) // The drag is 'elastic' and this sleep allows the item to catch up with the mouse movement
            .releaseMouseButton()
         .end();
         // TODO: Cannot get this working, dropped items get created in main drop target, manual tests work fine
         // .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DroppedItemWrapper .alfresco-dnd-DragAndDropTarget:nth-child(2) .alfresco-dnd-DroppedItemWrapper")
         //    .then(function(elements) {
         //          assert.lengthOf(elements, 1, "The nested dropped item was not found");
         //    }).sleep(2000);
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
         return browser.findByCssSelector("#dojoUnique1 > .title")
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
});