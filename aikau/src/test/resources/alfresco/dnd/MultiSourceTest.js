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
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, require, TestCommon, keys) {

   defineSuite(module, {
      name: "Multi-source DND tests",
      testPage: "/multi-source-dnd",

      "Select item in source one, then select item in source two to deselect item in source one": function() {
         return this.remote.tabToElement({
               selector: "#DRAG_PALETTE1 .alfresco-dnd-DragAndDropItem"
            })
            .pressKeys(keys.ENTER)

         .tabToElement({
               selector: "#DRAG_PALETTE2 .alfresco-dnd-DragAndDropItem"
            })
            .clearLog()
            .pressKeys(keys.ENTER)

         .getLastPublish("ALF_DND_SOURCE_ITEM_SELECTED")

         .findAllByCssSelector(".alfresco-dnd-DragAndDropItem.selected")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The wrong number of items were selected");
            });
      },

      "Drag and drop a single use item into a nested target": function() {
         return this.remote.dragOnto("#dojoUnique1 .title", ".alfresco-dnd-DragAndDropTarget > div")
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
         return this.remote.findByCssSelector(".alfresco-dnd-DroppedItemWrapper .action.delete img")
            .click()
            .end()
            .findAllByCssSelector("#DRAG_PALETTE2 .dojoDndItem")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The deleted single use item was not reinstated");
            });
      }
   });

   var setupDroppedItems = function(browser) {
      // Select the item in the first source...
      return browser.tabToElement({
            selector: "#DRAG_PALETTE1 .alfresco-dnd-DragAndDropItem"
         })
         .pressKeys(keys.ENTER)

      // Tab to the drop target and add the selected item...
      .tabToElement({
            selector: "#ROOT_DROPPED_ITEMS1 .dojoDndTarget"
         })
         .pressKeys(keys.ENTER)

      // Tab to the single use item and select...
      .tabToElement({
            selector: "#DRAG_PALETTE2 .alfresco-dnd-DragAndDropItem"
         })
         .pressKeys(keys.ENTER)

      // Tab back to the dropped target and add...
      .tabToElement({
            selector: "#ROOT_DROPPED_ITEMS1 .dojoDndTarget .dojoDndTarget",
            reverse: true
         })
         .pressKeys(keys.ENTER)

      // Make sure everything is setup correctly
      .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
         .then(function(elements) {
            assert.lengthOf(elements, 2, "The dropped items were not found");
         })
         .end();
   };

   defineSuite(module, {
      name: "Multi-source DND tests (clear using publication)",
      testPage: "/multi-source-dnd",

      "Nest single use item in multiple use item": function() {
         return this.remote.then(() => {
            return setupDroppedItems(this.remote);
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
      }
   });

   defineSuite(module, {
      name: "Multi-source DND tests (clear with no restore using publication)",
      testPage: "/multi-source-dnd",

      "Nest single use item in multiple use item": function() {
         return this.remote.then(() => {
            return setupDroppedItems(this.remote);
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
      }
   });

   defineSuite(module, {
      name: "Multi-source DND tests (test preset value loading)",
      testPage: "/multi-source-dnd?preset=true",

      "Check that the single use item has been removed (as it has been used)": function() {
         return this.remote.findAllByCssSelector("#DRAG_PALETTE2 .alfresco-dnd-DragAndDropItem")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The single use item was not removed");
            });
      },

      "Check that all items are present and correct": function() {
         return this.remote.findAllByCssSelector(".alfresco-dnd-DroppedItemWrapper")
            .then(function(elements) {
               assert.lengthOf(elements, 3, "Not all the items were recreated");
            });
      },

      "Drag a preset item and check only one item is selected": function() {
         return this.remote.findByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DroppedItemWrapper:first-child .dojoDndHandle")
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
      }
   });
});