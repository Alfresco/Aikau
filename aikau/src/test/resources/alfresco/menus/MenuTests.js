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
 * This registers the test suites for the alfresco/menus package.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, TestCommon, keys) {

   var menuBarSelectors = TestCommon.getTestSelectors("alfresco/menus/AlfMenuBar");
   var menuItemSelectors = TestCommon.getTestSelectors("alfresco/menus/AlfMenuItem");
   var menuBarPopupSelectors = TestCommon.getTestSelectors("alfresco/menus/AlfMenuBarPopup");
   var cascadingMenuSelectors = TestCommon.getTestSelectors("alfresco/menus/AlfCascadingMenu");

   var selectors = {
      menuBar: TestCommon.getTestSelector(menuBarSelectors, "menubar", ["MENU_BAR"]),
      popupMenus: {
         dropDown1: {
            label: TestCommon.getTestSelector(menuBarPopupSelectors, "label", ["DROP_DOWN_MENU_1"]),
            menuItem: TestCommon.getTestSelector(menuBarPopupSelectors, "menu", ["DROP_DOWN_MENU_1"]),
            popup: TestCommon.getTestSelector(menuBarPopupSelectors, "popup", ["DROP_DOWN_MENU_1"])
         },
         dropDown2: {
            menuItem: TestCommon.getTestSelector(menuBarPopupSelectors, "menu", ["DROP_DOWN_MENU_2"]),
            popup: TestCommon.getTestSelector(menuBarPopupSelectors, "popup", ["DROP_DOWN_MENU_2"])
         },
         dropDown3: {
            label: TestCommon.getTestSelector(menuBarPopupSelectors, "label", ["DROP_DOWN_MENU_3"]),
            menuItem: TestCommon.getTestSelector(menuBarPopupSelectors, "menu", ["DROP_DOWN_MENU_3"]),
            popup: TestCommon.getTestSelector(menuBarPopupSelectors, "popup", ["DROP_DOWN_MENU_3"])
         },
         dropDown4: {
            label: TestCommon.getTestSelector(menuBarPopupSelectors, "label", ["DROP_DOWN_MENU_4"]),
            menuItem: TestCommon.getTestSelector(menuBarPopupSelectors, "menu", ["DROP_DOWN_MENU_4"]),
            popup: TestCommon.getTestSelector(menuBarPopupSelectors, "popup", ["DROP_DOWN_MENU_4"]),
            icon: TestCommon.getTestSelector(menuBarPopupSelectors, "icon", ["DROP_DOWN_MENU_4"])
         }
      },
      cascadingMenus: {
         cascade1: {
            label: TestCommon.getTestSelector(cascadingMenuSelectors, "label", ["CASCADING_MENU_1"]),
            popup: TestCommon.getTestSelector(cascadingMenuSelectors, "popup", ["CASCADING_MENU_1"])
         },
         cascade2: {
            label: TestCommon.getTestSelector(cascadingMenuSelectors, "label", ["CASCADING_MENU_2"]),
            popup: TestCommon.getTestSelector(cascadingMenuSelectors, "popup", ["CASCADING_MENU_2"])
         }
      },
      menuItems: {
         menuItem1: {
            label: TestCommon.getTestSelector(menuItemSelectors, "label", ["MENU_ITEM_1"])
         },
         menuItem10: {
            label: TestCommon.getTestSelector(menuItemSelectors, "label", ["MENU_ITEM_10"]),
            icon: TestCommon.getTestSelector(menuItemSelectors, "icon", ["MENU_ITEM_10"])
         },
         menuItem13: {
            label: TestCommon.getTestSelector(menuItemSelectors, "label", ["MENU_ITEM_13"])
         }
      }
   };

   registerSuite(function(){
      var browser;

      return {
         name: "Menus Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/BasicMenuTestPage", "Menus Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Open the drop-down menu and select the FIRST menut item using the space bar": function() {
            return browser.findByCssSelector("body")
               .tabToElement(selectors.popupMenus.dropDown1.menuItem)
               .pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown1.popup)
               .end()

               .pressKeys(keys.SPACE)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_1");
                  });
         },

         "Open the drop-down menu and select the SECOND menu item using the return key": function() {
            return browser.pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown1.popup)
               .end()

               .pressKeys(keys.ARROW_DOWN)
               .clearLog()
               .pressKeys(keys.RETURN)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_2");
                  });
         },

         "Open the menu and select the first item in the SECOND group (tests cross-group navigation)": function() {
             return browser.pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown1.popup)
               .end()

               .pressKeys(keys.ARROW_DOWN)
               .pressKeys(keys.ARROW_DOWN)
               .clearLog()
               .pressKeys(keys.RETURN)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_3");
                  });

         },

         "Test cross group navigation both up and down groups": function() {
            return browser.pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown1.popup)
               .end()

               .pressKeys(keys.ARROW_DOWN)
               .pressKeys(keys.ARROW_DOWN)
               .pressKeys(keys.ARROW_UP)
               .clearLog()
               .pressKeys(keys.RETURN)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_2");
                  });
         },

         "Test going from first item in first group to last item in last group": function() {
            return browser.pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown1.popup)
               .end()

               .pressKeys(keys.ARROW_UP)
               .clearLog()
               .pressKeys(keys.SPACE)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_6");
                  });
         },

         "Test going from the last item in the last group to the first item in the first group": function() {
            return browser.pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown1.popup)
               .end()

               .pressKeys(keys.ARROW_UP)
               .pressKeys(keys.ARROW_DOWN)
               .clearLog()
               .pressKeys(keys.SPACE)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_1");
                  });
         },

         "Test going along the menu bar (the menu bar should already have focus)": function() {
            return browser.pressKeys(keys.ARROW_RIGHT)

               .clearLog()
               .pressKeys(keys.SPACE)

               .getLastPublish("ALF_NAVIGATE_TO_PAGE")
                  .then(function(payload) {
                     assert.propertyVal(payload, "url", "MENU_BAR_ITEM_1");
                  });
         },

         "Test navigating between UNGROUPED menu items in a drop down menu": function() {
            return browser.pressKeys(keys.ARROW_RIGHT)
               .pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown2.popup)
               .end()

               .clearLog()
               .pressKeys(keys.SPACE)

               .getLastPublish("ALF_NAVIGATE_TO_PAGE")
                  .then(function(payload) {
                     assert.propertyVal(payload, "url", "MENU_ITEM_8");
                  });
         },

         "Test navigating between UNGROUPED menu items in a drop down menu (part 2)": function() {
            return browser.pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown2.popup)
               .end()

               .pressKeys(keys.ARROW_DOWN)
               .pressKeys(keys.ARROW_UP)
               .clearLog()
               .pressKeys(keys.SPACE)

               .getLastPublish("ALF_NAVIGATE_TO_PAGE")
                  .then(function(payload) {
                     assert.propertyVal(payload, "url", "MENU_ITEM_7");
                  });
         },

         "Test cascade menu keyboard navigation (opening and closing cascades)": function() {
            return browser.pressKeys(keys.ARROW_RIGHT)
               .pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown3.popup)
               .end()

               .pressKeys(keys.ARROW_DOWN) // Go past...
               .pressKeys(keys.ARROW_UP) //... and back to cascade
               .pressKeys(keys.ARROW_RIGHT) // ...then open the cascade

               .findDisplayedByCssSelector(selectors.cascadingMenus.cascade1.popup)
               .end()

               .clearLog()
               .pressKeys(keys.SPACE)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_11");
                  });
         },

         "Test opening cascades within cascades": function() {
            return browser.pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown3.popup)
               .end()

               .pressKeys(keys.ARROW_DOWN)
               .pressKeys(keys.ARROW_RIGHT) // Open the first cascade

               .findDisplayedByCssSelector(selectors.cascadingMenus.cascade1.popup)
               .end()

               .pressKeys(keys.ARROW_DOWN)

               .pressKeys(keys.ARROW_RIGHT) // Open the second cascade

               .findDisplayedByCssSelector(selectors.cascadingMenus.cascade2.popup)
               .end()

               .clearLog()
               .pressKeys(keys.SPACE)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_13");
                  });
         },

         "Test closing cascades": function() {
            return browser.pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown3.popup)
               .end()

               .pressKeys(keys.ARROW_DOWN)
               .pressKeys(keys.ARROW_RIGHT) // Open the cascade

               .findDisplayedByCssSelector(selectors.cascadingMenus.cascade1.popup)
               .end()

               .pressKeys(keys.ARROW_LEFT) // Close the cascade 
               .pressKeys(keys.ARROW_DOWN) // Select the next menu item

               .clearLog()
               .pressKeys(keys.SPACE)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_14");
                  });
         },

         "Test menu item wrapper navigation (e.g. that you can navigate over non-menu items)": function() {
            return browser.pressKeys(keys.ARROW_RIGHT)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown4.popup)
               .end()

               .pressKeys(keys.ARROW_DOWN)

               .screenie()
               
               .clearLog()
               .pressKeys(keys.SPACE)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_10");
                  });
         },

         "Test menu item wrapper navigation (e.g. that you can navigate back up over non-menu items)": function() {
            return browser.pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown4.popup)
               .end()

               .pressKeys(keys.ARROW_DOWN)
               .pressKeys(keys.ARROW_UP)
              
               .clearLog()
               .pressKeys(keys.SPACE)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_9");
                  });
         },

         "Test right cursor wrapping on menu": function() {
            return browser.pressKeys(keys.ARROW_RIGHT)
               .pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown1.popup)
               .end()
              
               .clearLog()
               .pressKeys(keys.SPACE)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_2");
                  });
         },

         "Test left cursor wrapping on menu": function() {
            return browser.pressKeys(keys.ARROW_LEFT)
               .pressKeys(keys.ARROW_DOWN)

               .findDisplayedByCssSelector(selectors.popupMenus.dropDown4.popup)
               .end()
              
               .clearLog()
               .pressKeys(keys.SPACE)

               .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_10");
                  });
         },

         "Test drop-down menu using the mouse": function() {
            return browser.findByCssSelector(selectors.popupMenus.dropDown1.label)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.popupMenus.dropDown1.popup)
            .end()

            .findByCssSelector(selectors.menuItems.menuItem1.label)
               .click()
            .end()

            .getLastPublish("KEYBOARD_CLICK")
                  .then(function(payload) {
                     assert.propertyVal(payload, "item", "MENU_ITEM_1");
                  });
         },

         "Test cascade menus using the mouse": function() {
            return browser.findByCssSelector(selectors.popupMenus.dropDown3.label)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.popupMenus.dropDown3.popup)
            .end()

            .findByCssSelector(selectors.cascadingMenus.cascade1.label)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.cascadingMenus.cascade1.popup)
            .end()

            .findByCssSelector(selectors.cascadingMenus.cascade2.label)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.cascadingMenus.cascade2.popup)
            .end()

            .findByCssSelector(selectors.menuItems.menuItem13.label)
               .click()
            .end()

            .getLastPublish("KEYBOARD_CLICK")
               .then(function(payload) {
                  assert.propertyVal(payload, "item", "MENU_ITEM_13");
               });
         },

         "Share relative page URLs are correct": function() {
            return browser.findByCssSelector("#MENU_ITEM_7 .alfresco-navigation-_HtmlAnchorMixin")
               .getAttribute("href")
               .then(function(href) {
                  assert.equal(href, "/aikau/page/MENU_ITEM_7", "Share relative page URL incorrect");
               });
         },

         "Check popup menu image alt text": function() {
            return browser.findByCssSelector(selectors.popupMenus.dropDown4.icon)
               .getAttribute("alt")
               .then(function(text) {
                  assert(text, "dd4.label");
               });
         },

         "Check menu item alt text": function() {
            return browser.findByCssSelector(selectors.popupMenus.dropDown4.label)
               .click()
            .end()

            .findDisplayedByCssSelector(selectors.popupMenus.dropDown4.popup)
            .end()

            .findByCssSelector(selectors.menuItems.menuItem10.icon)
               .getAttribute("alt")
               .then(function(text) {
                  assert(text, "dd4.group1.mi2");
               });

         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});