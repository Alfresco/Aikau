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
      "intern/dojo/node!leadfoot/keys"
   ],
   function(registerSuite, assert, require, TestCommon, keys) {

      var browser;
      registerSuite({
         name: "PublishingDropDownMenu Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/PublishingDropDownMenu", "PublishingDropDownMenu Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Test drop down menu count": function() {
            return browser.findAllByCssSelector("div.alfresco-renderers-PublishingDropDownMenu")
               .then(function(dropdowns) {
                  assert.lengthOf(dropdowns, 3, "There should be 3 dropdown menus rendered");
               });
         },

         "Test first drop-down value is 'Public'": function() {
            return browser.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
               .getVisibleText()
               .then(function(visibleText) {
                  assert.equal(visibleText, "Public", "The start value of dropdown menu 1 should be 'Public'");
               });
         },

         "Test menu opens on mouse click": function() {
            return browser.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
               .click()
               .end()

            .findByCssSelector(".dijitMenuPopup")
               .then(null, function() {
                  assert(false, "The drop down menu did not appear on mouse clicks");
               });
         },

         "Test menu is visible": function() {
            return browser.findByCssSelector(".dijitMenuPopup")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isTrue(isDisplayed, "The drop down menu should be visible on mouse clicks");
               });
         },

         "Test that additional CSS classes are included in the popup": function() {
            return browser.findAllByCssSelector("#PDM_ITEM_0_SELECT_CONTROL_dropdown.custom-css")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Could not find additional CSS classes on select popup");
               });
         },

         "Test that value is included in data attribute of select option": function() {
            return browser.findAllByCssSelector("#PDM_ITEM_0_SELECT_CONTROL_dropdown tr[data-value='PUBLIC']")
               .then(function(elements) {
                  assert.lengthOf(elements, 1, "Could not find select option via data-value attribute");
               });
         },

         "Test menu code not removed on click": function() {
            // Select "Private" (should succeed)...
            return browser.findByCssSelector("tr.dijitMenuItem:nth-of-type(3)")
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

         "Test menu disappears after mouse click": function() {
            return browser.findByCssSelector(".dijitMenuPopup")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The drop down menu should be hidden after the mouse click");
               });
         },

         "Test menu selection published on mouse click": function() {
            return browser.findByCssSelector("body")
               .getLastPublish("ALF_PUBLISHING_DROPDOWN_MENU");
         },

         "Test menu success item is displayed": function() {
            return browser.findAllByCssSelector(".alfresco-renderers-PublishingDropDownMenu .indicator.success:not(.hidden)")
               .then(function(elements) {
                  assert(elements.length === 1, "The success icon did not display");
               });
         },

         "Test menu failure item is displayed": function() {
            return browser.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
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

         "Test menu status icon is hidden on cancel": function() {
            return browser.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
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

         "Test menu spinner icon is displayed": function() {
            return browser.findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
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

         "Test escape key cancels action": function() {
            return browser.pressKeys(keys.ESCAPE)
               .findByCssSelector(".alfresco-renderers-PublishingDropDownMenu .indicator.processing")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isFalse(displayed, "The spinner should have been hidden on ESC");
               })
               .end()

            .findByCssSelector("span.dijitSelectLabel:nth-of-type(1)")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Private", "The drop-down was not reset on cancel");
               })
               .end()

            .getLastPublish("CANCEL_UPDATE");
         },

         "Test use in dialog": function() {
            return browser.findByCssSelector("#SHOW_DIALOG_label")
               .clearLog()
               .click()
               .end()

            // Wait for dialog...
            .findByCssSelector("#DIALOG1.dialogDisplayed")
               .end()

            .findByCssSelector("#DIALOG_PDM_ITEM_2_SELECT_CONTROL")
               .click()
               .end()

            // Select "Public" (there should be no response so the spinner will just keep spinning...)
            .findByCssSelector("#DIALOG_PDM_ITEM_2_SELECT_CONTROL_menu tr:nth-child(1) .dijitMenuItemLabel")
               .click()
               .end()

            .findByCssSelector("#DIALOG1 tr:nth-child(3) .alfresco-renderers-PublishingDropDownMenu .indicator.processing")
               .isDisplayed()
               .then(function(displayed) {
                  assert.isTrue(displayed, "The spinner icon is not present");
               })
               .end()

            .findByCssSelector(".dijitDialogCloseIcon")
               .click()
               .end()

            // Wait for dialog to be hidden...
            .findByCssSelector("#DIALOG1.dialogHidden")
               .end()

            .getLastPublish("CANCEL_UPDATE", "Cancel publication not made on escape key");
         },

         "Test menu publish is cleared on refresh": function() {
            return browser.refresh()
               .end()

            .getAllPublishes("ALF_PUBLISHING_DROPDOWN_MENU")
               .then(function(payloads) {
                  assert.lengthOf(payloads, 0, "The menu publish should have gone after a refresh");
               });
         },

         "Test menu can be opened via keyboard": function() {
            return browser.pressKeys(keys.TAB)
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

         "Test menu hidden after keyboard selection": function() {
            return browser.pressKeys(keys.ARROW_DOWN)
               .pressKeys(keys.RETURN)
               .sleep(500)
               .findByCssSelector(".dijitMenuPopup")
               .isDisplayed()
               .then(function(isDisplayed) {
                  assert.isFalse(isDisplayed, "The drop down menu should be hidden after key presses");
               });
         },

         "Test menu published after keyboard selection": function() {
            return browser.findByCssSelector("body")
               .getLastPublish("ALF_PUBLISHING_DROPDOWN_MENU", "The menu did not publish on 'ALF_PUBLISHING_DROPDOWN_MENU' after key presses");
         },

         "Test that second drop-down is disabled (in main view)": function() {
            return browser.findByCssSelector("#PDM_ITEM_1_SELECT_CONTROL.dijitDisabled")
               .getAttribute("aria-disabled")
               .then(function(attribute) {
                  assert.equal(attribute, "true", "The drop-down was not disabled");
               });
         },

         "Test that second drop-down is NOT disabled (in dialog)": function() {
            return browser.findByCssSelector("#SHOW_DIALOG_label")
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
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      });
   });