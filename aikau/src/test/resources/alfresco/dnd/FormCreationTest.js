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

      name: "Form Creation DND tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/form-dnd", "Form Creation DND tests")
            .end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Drag form onto target": function () {
         return browser.findByCssSelector("#dojoUnique2 .title")
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
            });
      },

      "Add two controls to form": function() {
         // Select form control
         return browser.pressKeys(keys.TAB)
            .sleep(pause)
            .pressKeys(keys.ENTER)

            // Add to form (select the preview panel with the mouse and use enter to add the selected item)...
            .findByCssSelector(".alfresco-dnd-DragAndDropTarget .alfresco-dnd-DragAndDropTarget .previewPanel")
               .click()
            .end()
            .pressKeys(keys.ENTER)
            .pressKeys(keys.ENTER)
            
            .findAllByCssSelector("#ROOT_DROPPED_ITEMS1 .alfresco-dnd-DragAndDropTarget .alfresco-dnd-DragAndDropTarget > div.previewPanel > .alfresco-dnd-DroppedItemWrapper")
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "There should be two form controls added now");
               });
      },

      "Set a field id": function() {
         // Click to edit the form control...
         return browser.findByCssSelector(".alfresco-dnd-DragAndDropTarget .alfresco-dnd-DragAndDropTarget .previewPanel .action.edit img")
            .click()
         .end()
         .findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG #FIELD_ID .dijitInputContainer input")
            .clearValue()
            .type("field1")
         .end()
         .findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG .confirmationButton > span")
            .click()
         .end()
            .waitForDeletedByCssSelector(".dialogDisplayed");

         // TODO: Test something?
      },

      "Edit the form": function() {
         // We want to make sure that editing the form won't hide the nested form control...
         return browser.findByCssSelector(".alfresco-dnd-DragAndDropTarget .previewPanel .action.edit img")
               .click()
            .end()
            .sleep(1000) // Wait for dialog to render...
            .findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG .confirmationButton > span")
               .click()
            .end()
            .findAllByCssSelector(".alfresco-dnd-DragAndDropTarget .alfresco-dnd-DragAndDropTarget .previewPanel .action.edit img")
               .then(function(elements) {
                  assert.lengthOf(elements, 2, "The form control edit button couldn't be found which indicates that the control wasn't re-rendered");
               });
      },

      "Edit the second form control to check form control information is available": function() {
         // Edit the second control...
         return browser.findByCssSelector(".alfresco-dnd-DroppedItemWrapper:nth-child(2) .action.edit img")
            .click()
         .end()

         .sleep(1000)

         // Reveal the dynamic visibility controls...
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
         .pressKeys(keys.SPACE)
         .sleep(pause)

         // Reveal the dynamic visibility controls...
         // .findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG #DYNAMIC_BEHAVIOUR_TOGGLE input")
         //    .click()
         // .end()

         // Add a new visibility rule...
         .pressKeys(keys.TAB)
         .sleep(pause)
         .pressKeys(keys.TAB)
         .sleep(pause)
         .pressKeys(keys.SPACE)
         .sleep(pause)

         .sleep(1000)

         // Add a new visibility rule...
         // .findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG #DYNAMIC_VISIBILITY_RULES .button.add")
         //    .click()
         // .end()

         // Count the numnber of fields that can be referenced...
         .findAllByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG #DYNAMIC_VISIBILITY_RULES .alfresco-forms-controls-Select tr")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "An unexpected number of other field options was found");
            });
      },

      "Preview the form": function() {
         return browser.findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG .cancellationButton > span")
            .click()
         .end()

         .sleep(1000)

         .findByCssSelector("#FORM1 .buttons > span:nth-child(2) > span")
            .click()
         .end()

         .sleep(5000) // Give the preview time to render

         .findAllByCssSelector(".alfresco-prototyping-Preview .alfresco-forms-controls-TextBox")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Text boxes not found in the preview panel");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});