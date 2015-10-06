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

var pause = 150;
registerSuite(function(){
   var browser;

   return {

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

      "Drag and drop a single use item into a nested target": function () {
         return browser.findByCssSelector("#dojoUnique1 .title")
            .moveMouseTo()
            .click()
            .pressMouseButton()
            .moveMouseTo(1, 1)
         .end()
         .findByCssSelector(".alfresco-dnd-DragAndDropTarget > div")
            .then(function(element) {
               return browser.moveMouseTo(element)
                  .sleep(500) // The drag is 'elastic' and this sleep allows the item to catch up with the mouse movement
                  .releaseMouseButton();
            })
         .end()
         .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
                  assert.lengthOf(elements, 1, "The dropped item was found");
            })
         .end()
         .findByCssSelector(".alfresco-dnd-DroppedItemWrapper .alfresco-dnd-DragAndDropTarget .dojoDndTarget")
            .click()
         .end()
         .pressKeys(keys.ENTER)
         .pressKeys(keys.ENTER)
         .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
                  assert.lengthOf(elements, 2, "The dropped item was not found");
            })
         .end()
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
   };
   });

   var setupDroppedItems = function(browser) {
      // Select the item in the first source...
      return browser.pressKeys(keys.TAB)
         .sleep(pause)
         .pressKeys(keys.ENTER)

         // Tab to the drop target and add the selected item...
         .pressKeys(keys.TAB)
         .sleep(pause)
         .pressKeys(keys.ENTER)
         .sleep(pause)

         // Tab to the single use item and select...
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
         .pressKeys(keys.TAB)
         .sleep(pause)
         .pressKeys(keys.ENTER)
         
         // Tab back to the dropped target and add...
         .pressKeys(keys.SHIFT)
         .sleep(pause)
         .pressKeys(keys.TAB)
         .sleep(pause)
         .pressKeys(keys.TAB)
         .sleep(pause)
         .pressKeys(keys.SHIFT) // Release shift key
         .pressKeys(keys.ENTER)

         // Make sure everything is setup correctly
         .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
               .then(function(elements) {
                     assert.lengthOf(elements, 2, "The dropped items were not found");
               })
            .end();
   };

registerSuite(function(){
   var browser;

   return {

      name: "Multi-source DND tests (clear using publication)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/multi-source-dnd", "Multi-source DND tests (clear using publication)")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Nest single use item in multiple use item": function() {
         return browser.then(function() {
               return setupDroppedItems(browser);
            })

            // Make sure everything is setup correctly
            .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
               .then(function(elements) {
                     assert.lengthOf(elements, 2, "The dropped items were not found");
               })
            .end()

            .findByCssSelector("#NICE_CLEAR_BUTTON_label")
               .click()
            .end()

            .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
               .then(function(elements) {
                     assert.lengthOf(elements, 0, "The dropped items were not deleted");
               })
            .end()

            .findAllByCssSelector("#DRAG_PALETTE2 .dojoDndItem")
               .then(function(elements) {
                     assert.lengthOf(elements, 1, "The deleted single use item was not reinstated");
               });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

registerSuite(function(){
   var browser;

   return {

      name: "Multi-source DND tests (clear with no restore using publication)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/multi-source-dnd", "Multi-source DND tests (clear with no restore using publication)")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Nest single use item in multiple use item": function() {
         return browser.then(function() {
               return setupDroppedItems(browser);
            })

            .findByCssSelector("#BRUTAL_CLEAR_BUTTON_label")
               .click()
            .end()

            .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
               .then(function(elements) {
                     assert.lengthOf(elements, 0, "The dropped items were not deleted");
               })
            .end()

            .findAllByCssSelector("#DRAG_PALETTE2 .dojoDndItem")
               .then(function(elements) {
                     assert.lengthOf(elements, 0, "The deleted single use item WAS unexpectedly reinstated");
               });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

registerSuite(function(){
   var browser;

   return {

      name: "Multi-source DND tests (test preset value loading)",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/multi-source-dnd?preset=true", "Multi-source DND tests (test preset value loading)")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check that the single use item has been removed (as it has been used)": function() {
         return browser.findAllByCssSelector("#DRAG_PALETTE2 .alfresco-dnd-DragAndDropItem")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The single use item was not removed");
            });
      },

      "Check that all items are present and correct": function() {
         return browser.findAllByCssSelector(".alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Not all the items were recreated");
            });
      },

      "Drag a preset item and check only one item is selected": function() {
         return browser.findByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DroppedItemWrapper:first-child .dojoDndHandle")
            .moveMouseTo()
            .click()
            .pressMouseButton()
            .moveMouseTo(1, 1)
            .moveMouseTo(1, 50)
         .end()
         .findAllByCssSelector(".alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
               assert.lengthOf(elements, 5, "The wrong number of items were pre-selected for dragging");
            })
            .releaseMouseButton();
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});