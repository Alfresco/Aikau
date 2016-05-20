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
 * This is the unit test for the alfresco/menus/AlfMenuBarSelect widget.
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   var menuBarSelectSelectors = TestCommon.getTestSelectors("alfresco/menus/AlfMenuBarSelect");
   var menuItemSelectors = TestCommon.getTestSelectors("alfresco/menus/AlfMenuItem");
   var buttonSelectors = TestCommon.getTestSelectors("alfresco/buttons/AlfButton");

   var selectors = {
      menuBarSelects: {
         mbs1: {
            label: TestCommon.getTestSelector(menuBarSelectSelectors, "label", ["MENU_BAR_SELECT"]),
            menuItem: TestCommon.getTestSelector(menuBarSelectSelectors, "menu", ["MENU_BAR_SELECT"]),
            popup: TestCommon.getTestSelector(menuBarSelectSelectors, "popup", ["MENU_BAR_SELECT"])
         },
         mbs2: {
            label: TestCommon.getTestSelector(menuBarSelectSelectors, "label", ["MENU_BAR_SELECT_VALUE"]),
            popup: TestCommon.getTestSelector(menuBarSelectSelectors, "popup", ["MENU_BAR_SELECT_VALUE"])
         },
         mbs3: {
            label: TestCommon.getTestSelector(menuBarSelectSelectors, "label", ["MENU_BAR_SELECT_WITH_ICON"]),
            popup: TestCommon.getTestSelector(menuBarSelectSelectors, "popup", ["MENU_BAR_SELECT_WITH_ICON"]),
            icon: TestCommon.getTestSelector(menuBarSelectSelectors, "icon", ["MENU_BAR_SELECT_WITH_ICON"])
         }
      },
      menuItems: {
         menuItem1: {
            label: TestCommon.getTestSelector(menuItemSelectors, "label", ["SELECT_MENU_ITEM_1"])
         },
         menuItem2: {
            label: TestCommon.getTestSelector(menuItemSelectors, "label", ["SELECT_MENU_ITEM_2"])
         },
         menuItem3: {
            label: TestCommon.getTestSelector(menuItemSelectors, "label", ["SELECT_MENU_ITEM_3"])
         },
         menuItem4: {
            label: TestCommon.getTestSelector(menuItemSelectors, "label", ["SELECT_MENU_ITEM_4"])
         },
         menuItem5: {
            label: TestCommon.getTestSelector(menuItemSelectors, "label", ["SELECT_MENU_ITEM_5"])
         },
         menuItem6: {
            label: TestCommon.getTestSelector(menuItemSelectors, "label", ["SELECT_MENU_ITEM_6"])
         }
      },
      buttons: {
         setWithLabel: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SET_WITH_LABEL"]),
         setWithValue: TestCommon.getTestSelector(buttonSelectors, "button.label", ["SET_WITH_VALUE"])
      }
   };

   defineSuite(module, {
      name: "AlfMenuBarSelect Tests",
      testPage: "/AlfMenuBarSelect",

      "Check initial label (1)": function() {
         return this.remote.findByCssSelector(selectors.menuBarSelects.mbs1.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Select (label)...");
            });
      },

      "Check initial label (2)": function() {
         return this.remote.findByCssSelector(selectors.menuBarSelects.mbs2.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Select (value)...");
            });
      },

      "Check initial label (3)": function() {
         return this.remote.findByCssSelector(selectors.menuBarSelects.mbs3.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Select (show icon)...");
            });
      },

      "Use the keyboard to test label set (using label)": function() {
         return this.remote.findByCssSelector("body")
            .tabToElement({
               selector: selectors.menuBarSelects.mbs1.menuItem
            })

         .pressKeys(keys.ARROW_DOWN)

         .findDisplayedByCssSelector(selectors.menuBarSelects.mbs1.popup)
            .end()

         .clearLog()
            .pressKeys(keys.SPACE)

         .getLastPublish("MENU_BAR_SELECT")
            .then(function(payload) {
               assert.propertyVal(payload, "label", "Option 1 Selected");
            })

         .findByCssSelector(selectors.menuBarSelects.mbs1.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Option 1 Selected");
            });
      },

      "Use the keyboard to test label set (using value)": function() {
         return this.remote.pressKeys(keys.ARROW_RIGHT)

         .findDisplayedByCssSelector(selectors.menuBarSelects.mbs2.popup)
            .end()

         .clearLog()
            .pressKeys(keys.RETURN)

         .getLastPublish("MENU_BAR_SELECT_VALUE")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "Alpha");
            })

         .findByCssSelector(selectors.menuBarSelects.mbs2.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Alpha");
            });
      },

      "Use the keyboard to test label set (using icons)": function() {
         return this.remote.pressKeys(keys.ARROW_RIGHT)

         .findDisplayedByCssSelector(selectors.menuBarSelects.mbs3.popup)
            .end()

         .clearLog()
            .pressKeys(keys.RETURN)

         .getLastPublish("MENU_BAR_SELECT_WITH_ICONS")
            .then(function(payload) {
               assert.propertyVal(payload, "iconClass", "alf-textdoc-icon");
            })

         .findDisplayedByCssSelector(selectors.menuBarSelects.mbs3.icon)
            .getAttribute("class")
            .then(function(classes) {
               assert.include(classes, "alfresco-menus-AlfMenuItemIconMixin");
               assert.include(classes, "alf-textdoc-icon");
            });
      },

      "Use the mouse to test label set (using label)": function() {
         return this.remote.findByCssSelector(selectors.menuBarSelects.mbs1.label)
            .click()
            .end()

         .findDisplayedByCssSelector(selectors.menuBarSelects.mbs1.popup)
            .end()

         .clearLog()

         .findByCssSelector(selectors.menuItems.menuItem2.label)
            .click()
            .end()

         .getLastPublish("MENU_BAR_SELECT")
            .then(function(payload) {
               assert.propertyVal(payload, "label", "Option 2 Selected");
            })

         .findByCssSelector(selectors.menuBarSelects.mbs1.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Option 2 Selected");
            });
      },

      "Use the mouse to test label set (using value)": function() {
         return this.remote.findByCssSelector(selectors.menuBarSelects.mbs2.label)
            .click()
            .end()

         .findDisplayedByCssSelector(selectors.menuBarSelects.mbs2.popup)
            .end()

         .clearLog()

         .findByCssSelector(selectors.menuItems.menuItem4.label)
            .click()
            .end()

         .getLastPublish("MENU_BAR_SELECT_VALUE")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "Beta");
            })

         .findByCssSelector(selectors.menuBarSelects.mbs2.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Beta");
            });
      },

      "Use the mouse to test label set (using icon)": function() {
         return this.remote.findByCssSelector(selectors.menuBarSelects.mbs3.label)
            .click()
            .end()

         .findDisplayedByCssSelector(selectors.menuBarSelects.mbs3.popup)
            .end()

         .clearLog()

         .findByCssSelector(selectors.menuItems.menuItem6.label)
            .click()
            .end()

         .getLastPublish("MENU_BAR_SELECT_WITH_ICONS")
            .then(function(payload) {
               assert.propertyVal(payload, "iconClass", "alf-htmldoc-icon");
            })

         .findDisplayedByCssSelector(selectors.menuBarSelects.mbs3.icon)
            .getAttribute("class")
            .then(function(classes) {
               assert.include(classes, "alfresco-menus-AlfMenuItemIconMixin");
               assert.include(classes, "alf-htmldoc-icon");
               assert.notInclude(classes, "alf-textdoc-icon");
            });
      },

      "Set the label using an external publication": function() {
         return this.remote.findByCssSelector(selectors.buttons.setWithLabel)
            .click()
            .end()

         .getLastPublish("MENU_BAR_SELECT")
            .then(function(payload) {
               assert.propertyVal(payload, "label", "Alternative Label");
            })

         .findByCssSelector(selectors.menuBarSelects.mbs1.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Alternative Label");
            });
      },

      "Set the label using an external publication (2)": function() {
         return this.remote.findByCssSelector(selectors.buttons.setWithValue)
            .click()
            .end()

         .getLastPublish("MENU_BAR_SELECT_VALUE")
            .then(function(payload) {
               assert.propertyVal(payload, "label", "Alternative Value");
            })

         .findByCssSelector(selectors.menuBarSelects.mbs2.label)
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Alternative Value");
            });
      }
   });
});