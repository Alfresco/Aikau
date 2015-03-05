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
      }
   });
});