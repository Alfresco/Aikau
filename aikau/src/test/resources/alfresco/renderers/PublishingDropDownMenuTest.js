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
      name: "PublishingDropDownMenu Tests",
      testPage: "/PublishingDropDownMenu",

      "Verify drop down menu count": function() {
         return this.remote.findAllByCssSelector("div.alfresco-renderers-PublishingDropDownMenu")
            .then(function(dropdowns) {
               assert.lengthOf(dropdowns, 3, "There should be 3 dropdown menus rendered");
            });
      },

      "First drop-down value is 'Public'": function() {
         return this.remote.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Public", "The start value of dropdown menu 1 should be 'Public'");
            });
      },

      "Menu opens on mouse click": function() {
         return this.remote.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .click()
            .end()

         .findByCssSelector(".dijitMenuPopup")
            .then(null, function() {
               assert(false, "The drop down menu did not appear on mouse clicks");
            })
            .isDisplayed()
            .then(function(isDisplayed) {
               assert.isTrue(isDisplayed, "The drop down menu should be visible on mouse clicks");
            });
      },

      "Additional CSS classes are included in the popup": function() {
         return this.remote.findAllByCssSelector("#PDM_ITEM_0_SELECT_CONTROL_dropdown.custom-css")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find additional CSS classes on select popup");
            });
      },

      "Value is included in data attribute of select option": function() {
         return this.remote.findAllByCssSelector("#PDM_ITEM_0_SELECT_CONTROL_dropdown tr[data-value='PUBLIC']")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Could not find select option via data-value attribute");
            });
      },

      "Menu code not removed on click": function() {
         // Select "Private" (should succeed)...
         return this.remote.findByCssSelector("tr.dijitMenuItem:nth-of-type(3)")
            .click()
            .end()

         // The menu code should not have been removed
         .findByCssSelector(".dijitMenuPopup")
            .end()

         .findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Private", "The drop-down was not reset on failure");
            });
      },

      "Dropdown disappears after mouse click": function() {
         return this.remote.findByCssSelector(".dijitMenuPopup")
            .isDisplayed()
            .then(function(isDisplayed) {
               assert.isFalse(isDisplayed, "The drop down menu should be hidden after the mouse click");
            });
      },

      "Selection published on mouse click": function() {
         return this.remote.findByCssSelector("body")
            .getLastPublish("ALF_PUBLISHING_DROPDOWN_MENU");
      },

      "Success item is displayed": function() {
         return this.remote.findAllByCssSelector(".alfresco-renderers-PublishingDropDownMenu .indicator.success:not(.hidden)")
            .then(function(elements) {
               assert(elements.length === 1, "The success icon did not display");
            });
      },

      "Failure item is displayed on failure": function() {
         return this.remote.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .click()
            .end()

         // Select "Moderated" (should fail, and reset to "Private")...
         .findByCssSelector("tr.dijitMenuItem:nth-of-type(2)")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-renderers-PublishingDropDownMenu .indicator.warning:not(.hidden)")
            .then(function(elements) {
               assert(elements.length === 1, "The failure icon did not display");
            })
            .end()

         .findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Private", "The drop-down was not reset on failure");
            });
      },

      "Status icon is hidden on cancel": function() {
         return this.remote.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .click()
            .end()

         .findByCssSelector("tr.dijitMenuItem:nth-of-type(1)")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-renderers-PublishingDropDownMenu .indicator:not(.hidden)")
            .then(function(elements) {
               assert(elements.length === 0, "There is still a visible status icon when there shouldn't be");
            })
            .end()

         .findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Private", "The drop-down was not reset on cancel");
            });
      },

      "Spinner icon is displayed": function() {
         return this.remote.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .click()
            .end()

         // Select "Public" (there should be no response so the spinner will just keep spinning...)
         .findByCssSelector("tr.dijitMenuItem:nth-of-type(1)")
            .click()
            .end()

         .findAllByCssSelector(".alfresco-renderers-PublishingDropDownMenu .indicator.processing:not(.hidden)")
            .then(function(elements) {
               assert(elements.length === 1, "The spinner icon is not present");
            });
      },

      "Cancel 'button' cancels the publish": function() {
         return this.remote.findByCssSelector(".alfresco-renderers-PublishingDropDownMenu .indicator.processing")
            .click()
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "The spinner should have been hidden");
            })
            .end()

         .findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Private", "The drop-down was not reset on cancel");
            });
      },

      "Value updates respect confirmation choice (in dialog)": function() {
         return this.remote.findById("SHOW_DIALOG")
            .click()
            .end()

         .findByCssSelector("#DIALOG1.dialogDisplayed")
            .end()

         .findById("DIALOG_PDM_ITEM_0_SELECT_CONTROL")
            .click()
            .end()

         .findByCssSelector("#DIALOG_PDM_ITEM_0_SELECT_CONTROL_menu tr:nth-child(2) .dijitMenuItemLabel")
            .click()
            .end()

         .findByCssSelector("#CONFIRM_PUBLISH_DIALOG.dialogDisplayed")
            .end()

         .findByCssSelector("#CONFIRM_PUBLISH_DIALOG [widgetid='CANCEL'] .dijitButtonNode")
            .click()
            .end()

         .findByCssSelector("#CONFIRM_PUBLISH_DIALOG.dialogHidden")
            .end()

         .findByCssSelector("#DIALOG_PDM_ITEM_0_SELECT_CONTROL .dijitSelectLabel")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Public", "Value changed when it should not have");
            })
            .end()

         .findById("DIALOG_PDM_ITEM_0_SELECT_CONTROL")
            .click()
            .end()

         .findByCssSelector("#DIALOG_PDM_ITEM_0_SELECT_CONTROL_menu tr:nth-child(2) .dijitMenuItemLabel")
            .click()
            .end()

         .findByCssSelector("#CONFIRM_PUBLISH_DIALOG.dialogDisplayed")
            .end()

         .findByCssSelector("#CONFIRM_PUBLISH_DIALOG [widgetid='OK'] .dijitButtonNode")
            .click()
            .end()

         .findByCssSelector("#CONFIRM_PUBLISH_DIALOG.dialogHidden")
            .end()

         .findByCssSelector("#DIALOG_PDM_ITEM_0_SELECT_CONTROL .dijitSelectLabel")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Moderated", "Did not update value");
            })
            .end()

         .findByCssSelector("#DIALOG1 .dijitDialogCloseIcon")
            .click()
            .end()

         .findByCssSelector("#DIALOG1.dialogHidden");
      },

      "Confirmation dialog can be cancelled by button, escape or cross": function() {
         // Launch dialog
         return this.remote.findById("SHOW_DIALOG")
            .click()
            .end()
            .findByCssSelector("#DIALOG1.dialogDisplayed")
            .end()

         // Choose second option
         .findById("DIALOG_PDM_ITEM_0_SELECT_CONTROL")
            .click()
            .end()
            .findByCssSelector("#DIALOG_PDM_ITEM_0_SELECT_CONTROL_menu tr:nth-child(2) .dijitMenuItemLabel")
            .click()
            .end()

         // Cancel confirmation dialog (via button-press)
         .findByCssSelector("#CONFIRM_PUBLISH_DIALOG.dialogDisplayed")
            .end()
            .findByCssSelector("#CONFIRM_PUBLISH_DIALOG [widgetid='CANCEL'] .dijitButtonNode")
            .click()
            .end()
            .findByCssSelector("#CONFIRM_PUBLISH_DIALOG.dialogHidden")
            .end()

         // Confirm no change
         .findByCssSelector("#DIALOG_PDM_ITEM_0_SELECT_CONTROL .dijitSelectLabel")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Public", "Value changed after 'button-press cancel'");
            })
            .end()

         // Choose second option
         .findById("DIALOG_PDM_ITEM_0_SELECT_CONTROL")
            .click()
            .end()
            .findByCssSelector("#DIALOG_PDM_ITEM_0_SELECT_CONTROL_menu tr:nth-child(2) .dijitMenuItemLabel")
            .click()
            .end()

         // Cancel confirmation dialog (via escape)
         .findByCssSelector("#CONFIRM_PUBLISH_DIALOG.dialogDisplayed")
            .pressKeys(keys.ESCAPE)
            .end()
            .findByCssSelector("#CONFIRM_PUBLISH_DIALOG.dialogHidden")
            .end()

         // Confirm no change
         .findByCssSelector("#DIALOG_PDM_ITEM_0_SELECT_CONTROL .dijitSelectLabel")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Public", "Value changed after 'escape cancel'");
            })
            .end()

         // Choose second option
         .findById("DIALOG_PDM_ITEM_0_SELECT_CONTROL")
            .click()
            .end()
            .findByCssSelector("#DIALOG_PDM_ITEM_0_SELECT_CONTROL_menu tr:nth-child(2) .dijitMenuItemLabel")
            .click()
            .end()

         // Cancel confirmation dialog (via cross)
         .findByCssSelector("#CONFIRM_PUBLISH_DIALOG.dialogDisplayed")
            .end()
            .findByCssSelector("#CONFIRM_PUBLISH_DIALOG .dijitDialogCloseIcon")
            .click()
            .end()
            .findByCssSelector("#CONFIRM_PUBLISH_DIALOG.dialogHidden")
            .end()

         // Confirm no change
         .findByCssSelector("#DIALOG_PDM_ITEM_0_SELECT_CONTROL .dijitSelectLabel")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Public", "Value changed after 'cross-click cancel'");
            })
            .end()

         .findByCssSelector("#DIALOG1 .dijitDialogCloseIcon")
            .click()
            .end()

         .findByCssSelector("#DIALOG1.dialogHidden");
      },

      "Publish is cleared on refresh": function() {
         return this.remote.get(TestCommon.generateWebscriptUrl("/PublishingDropDownMenu"))
            .end()

         .getAllPublishes("ALF_PUBLISHING_DROPDOWN_MENU")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "The menu publish should have gone after a refresh");
            });
      },

      "Can be opened via keyboard": function() {
         return this.remote.pressKeys(keys.TAB)
            .pressKeys(keys.TAB)
            .pressKeys(keys.TAB)
            .pressKeys(keys.TAB)
            .pressKeys(keys.TAB)
            .pressKeys(keys.ARROW_DOWN)
            .sleep(500)
            .findByCssSelector(".dijitMenuPopup")
            .isDisplayed()
            .then(function(isDisplayed) {
               assert.isTrue(isDisplayed, "The drop down menu should be visible after key presses");
            });
      },

      "Dropdown hidden after keyboard selection": function() {
         return this.remote.pressKeys(keys.ARROW_DOWN)
            .pressKeys(keys.RETURN)
            .sleep(500)
            .findByCssSelector(".dijitMenuPopup")
            .isDisplayed()
            .then(function(isDisplayed) {
               assert.isFalse(isDisplayed, "The drop down menu should be hidden after key presses");
            });
      },

      "Selection published after keyboard selection": function() {
         return this.remote.findByCssSelector("body")
            .getLastPublish("ALF_PUBLISHING_DROPDOWN_MENU", "The menu did not publish on 'ALF_PUBLISHING_DROPDOWN_MENU' after key presses");
      },

      "Second drop-down is disabled (in main view)": function() {
         return this.remote.findByCssSelector("#PDM_ITEM_1_SELECT_CONTROL.dijitDisabled")
            .getAttribute("aria-disabled")
            .then(function(attribute) {
               assert.equal(attribute, "true", "The drop-down was not disabled");
            });
      },

      "Second drop-down is NOT disabled (in dialog)": function() {
         return this.remote.findByCssSelector("#SHOW_DIALOG_label")
            .click()
            .end()

         // Wait for dialog...
         .findByCssSelector("#DIALOG1.dialogDisplayed")
            .end()

         // Check the
         .findAllByCssSelector("#DIALOG_PDM_ITEM_1_SELECT_CONTROL.dijitDisabled")
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The drop-down was disabled");
            })
            .end()

         .findById("DIALOG_PDM_ITEM_1_SELECT_CONTROL")
            .getAttribute("aria-disabled")
            .then(function(attribute) {
               assert.equal(attribute, "false", "The drop-down was not disabled (aria)");
            })
            .end()

         // Close dialog
         .findByCssSelector(".dijitDialogCloseIcon")
            .click()
            .end()

         // Wait for dialog to be hidden...
         .findAllByCssSelector("#DIALOG1.dialogHidden")
            .end();
      }
   });
});