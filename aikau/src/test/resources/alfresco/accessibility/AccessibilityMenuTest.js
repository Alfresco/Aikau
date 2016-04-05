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
      name: "AccessibilityMenu Tests",
      testPage: "/AccessibilityMenu",

      "Find the heading text": function() {
         // Find the heading text
         return this.remote.findByCssSelector(".alfresco-accessibility-AccessibilityMenu__header")
            .getVisibleText()
            .then(function(headingText) {
               assert.equal(headingText, "Access key links:", "The heading text is wrong");
            });
      },

      "Find the menu items": function() {
         // Find the menu items
         return this.remote.findAllByCssSelector(".alfresco-accessibility-AccessibilityMenu__access-key-item")
            .then(function(menuitems) {
               assert.lengthOf(menuitems, 11, "The Accessibility Menu does not contain 11 access key items");
            });
      },

      "Test tab to skip to textbox (may not work on OS/X)": function() {
         return this.remote.pressKeys(keys.TAB)
            .pressKeys(keys.TAB)
            .pressKeys(keys.TAB)
            .pressKeys(keys.ENTER)
            .pressKeys("H") // NOTE: need to use pressKeys and not type here
            .getLastPublish("_valueChangeOf_textbox", "Text box was not focused");
      },

      "Test button access key (may not work on OS/X)": function() {
         // Hit the browser with a sequence of different accesskey combinations and the letter 's' for a nav skip
         return this.remote.pressKeys([keys.ALT, "b"])
            .pressKeys([keys.ALT]) // Release SHIFT (Chrome)
            .pressKeys([keys.ALT, keys.SHIFT, "b"])
            .pressKeys([keys.ALT, keys.SHIFT]) // Release ALT + SHIFT (Firefox)

         // The button should now have focus - hit enter to use it...
         .pressKeys(keys.ENTER)
            .getLastPublish("BUTTON_FOCUS_SUCCESS", "Button was not focused");
      },

      "Test menu access key (may not work on OS/X)": function() {
         // Hit the browser with a sequence of different accesskey combinations and the letter 's' for a nav skip
         return this.remote.pressKeys([keys.ALT, "m"])
            .pressKeys([keys.ALT]) // Release SHIFT (Chrome)
            .pressKeys([keys.ALT, keys.SHIFT, "m"])
            .pressKeys([keys.ALT, keys.SHIFT]) // Release ALT + SHIFT (Firefox)

         // The button should now have focus - hit enter to use it...
         .pressKeys(keys.ENTER)
            .getLastPublish("MENU_FOCUS_SUCCESS", "Button was not focused");
      }
   });
});