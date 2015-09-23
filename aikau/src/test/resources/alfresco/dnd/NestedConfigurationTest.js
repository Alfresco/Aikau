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

registerSuite(function(){
   var pause = 150;
   var browser;

   return {

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

            .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogDisplayed") // Wait for the dialog to render
            .end()

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

         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogHidden") // Wait for the dialog to be hidden
         .end()
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

      "Edit outer widget and check label is persisted": function() {
         return browser.findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG .cancellationButton > span")
            .click()
         .end()
         
         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogHidden") // Wait for the dialog to be hidden
         .end()

         .pressKeys(keys.SHIFT) // Need to tab backwards to the outer edit action
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
         .pressKeys(keys.SHIFT)
         .sleep(pause)
         .pressKeys(keys.ENTER)

         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogDisplayed") // Wait for the dialog to render
         .end()

         // Now tab to confirmation button and close the dialog
         .pressKeys(keys.TAB)
         .sleep(pause)
         .pressKeys(keys.TAB)
         .sleep(pause)
         .pressKeys(keys.ENTER)

         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogHidden") // Wait for the dialog to be hidden
         .end()

         // Check that the label has been preserved...
         .findByCssSelector(".alfresco-dnd-DragAndDropTarget .alfresco-dnd-DragAndDropTarget span.label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Horizontal Widgets", "The dropped item label was not preserved after editing parent");
            });
      },

      "Check prepopulated nested widget configuration": function() {
         return browser.findByCssSelector(".vertical-widgets-wrapper .action.edit > img")
            .click()
         .end()

         // Wait for dialog to be displayed...
         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogDisplayed")
         .end()

         .findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG #MARGINS_TOP .dijitInputContainer input")
         .getProperty("value")
            .then(function(value) {
               assert.equal(value, 5, "The margins top value was not set correctly");
            })
         .end()

         .findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG #MARGINS_BOTTOM .dijitInputContainer input")
         .getProperty("value")
            .then(function(value) {
               assert.equal(value, 4, "The margins bottom value was not set correctly");
            })
         .end();
      },

      "Update config values and check form save": function() {
         return browser.findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG #MARGINS_TOP .dijitArrowButton")
            .click()
            .click()
         .end()
         .findByCssSelector("#ALF_DROPPED_ITEM_CONFIGURATION_DIALOG .confirmationButton > span")
            .click()
         .end()
            
         // Wait for the dialog to be hidden...
         .findAllByCssSelector(".alfresco-dialog-AlfDialog.dialogHidden") 
         .end()

         // Post the form...
         .findByCssSelector("#FORM2 .confirmationButton > span")
            .click()
         .end()

         // Check that the updated values are correctly logged
         .getLastPublish("FORM2_POST")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "data.0.config.widgets.0.config.widgetMarginTop", 7, "Updated value not saved on form post");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});