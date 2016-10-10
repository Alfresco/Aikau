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
 * The purpose of this test is to ensure that keyboard accessibility is possible between the header and the
 * main table. It should be possible to use the tab/shift-tab keys to navigate along the headers (and the enter/space key
 * to make requests for sorting) and then the cursor keys to navigate around the table itself.
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, keys) {

   var alfPause = 200;
   defineSuite(module, {
      name: "AlfMenuBarToggle Tests (Mouse)",
      testPage: "/AlfMenuBarToggle",

      "Test label of basic toggle": function() {
         return this.remote.findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function(initialValue) {
               assert.equal(initialValue, "Off");
            });
      },

      "Test label of custom toggle": function() {
         return this.remote.findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function(initialValue) {
               assert.equal(initialValue, "On (Custom Label)");
            });
      },

      "Test label for icon toggle is not displayed": function() {
         return this.remote.findAllByCssSelector("#MENU_BAR_SELECT_WITH_ICON_text")
            .then(function(results) {
               assert.lengthOf(results, 0);
            });
      },

      "Test image for icon toggle is correct": function() {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-descending-icon")
            .then(function() {}, function() {
               assert(false, "Image for icon toggle had wrong or missing CSS class");
            });
      },

      "Test mouse click on basic toggle": function() {
         return this.remote.findById("BASIC_MENU_BAR_TOGGLE_text")
            .click()
         .end()
         
         .getLastPublish("ALF_WIDGET_PROCESSING_COMPLETE");
      },

      "Test label updated after toggle after mouse": function() {
         return this.remote.findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "On");
            });
      },

      "Test value publication of custom toggle after mouse click": function() {
         return this.remote.findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .click()
         .end()

         .getLastPublish("CLICK")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "OFF");
               assert.propertyVal(payload, "clicked", "TOGGLE_WITH_LABEL");
            });
      },

      "Test label update of custom toggle after mouse click": function() {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Off (Custom Label)");
            });
      },

      "Test value publication of icon toggle after mouse click": function() {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img")
            .clearLog()
            .click()
         .end()
         
         .getLastPublish("CLICK")
            .then(function(payload) {
               assert.propertyVal(payload, "value", "ON");
               assert.propertyVal(payload, "clicked", "TOGGLE_WITH_ICON");
            });
      },

      "Test CSS of icon toggle after mouse click": function() {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-ascending-icon")
            .then(function() {}, function() {
               assert(false, "Image for icon toggle had wrong or missing CSS class after update by mouse");
            });
      }
   });

   defineSuite(module, {
      name: "AlfMenuBarToggle Tests (Keyboard)",
      testPage: "/AlfMenuBarToggle",

      "Test basic toggle publication by keyboard": function() {
         return this.remote.pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
         .end()
         
         .getLastPublish("ALF_WIDGET_PROCESSING_COMPLETE");
      },

      "Test label update after basic toggle by keyboard": function() {
         return this.remote.findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "On");
            });
      },

      "Test publication of basic toggle by keyboard": function() {
         return this.remote.pressKeys(keys.ARROW_RIGHT)
            .sleep(alfPause)
            .clearLog()
            .pressKeys(keys.RETURN)
            
            .getLastPublish("CLICK")
               .then(function(payload) {
                  assert.propertyVal(payload, "value", "OFF");
                  assert.propertyVal(payload, "clicked", "TOGGLE_WITH_LABEL");
               });
      },

      "Test label update after custom toggle by keyboard": function() {
         return this.remote.findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "Off (Custom Label)");
            });
      },

      "Test topic publication after icon toggle by keyboard": function() {
         return this.remote.pressKeys(keys.ARROW_RIGHT)
            .sleep(alfPause)
            .clearLog()
            .pressKeys(keys.RETURN)

            .getLastPublish("CLICK")
               .then(function(payload) {
                  assert.propertyVal(payload, "value", "ON");
                  assert.propertyVal(payload, "clicked", "TOGGLE_WITH_ICON");
               });
      },

      "Test CSS after icon toggle by keyboard": function() {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-ascending-icon")
            .then(function() {}, function() {
               assert(false, "Image for icon toggle had wrong or missing CSS class after keyboard toggle");
            })
            .end();
      }
   });

   defineSuite(module, {
      name: "AlfMenuBarToggle Tests (Publications/Hashing)",
      testPage: "/AlfMenuBarToggle#sortAscending=true",

      "Test external publication updates label (basic toggle) ON": function() {
         return this.remote.findById("TEST_BUTTON_ASC")
            .click()
         .end()
         
         .findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function(initialValue) {
               assert.equal(initialValue, "On");
            });
      },

      "Test external publication updates label (custom toggle) ON": function() {
         return this.remote.findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function(initialValue) {
               assert.equal(initialValue, "On (Custom Label)");
            });
      },

      "Test external publication updates label (icon toggle) ON": function() {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-ascending-icon")
            .then(function() {}, function() {
               assert(false, "Image for asc icon toggle had wrong or missing CSS class");
            });
      },

      "Test external publication updates label (basic toggle) OFF": function() {
         return this.remote.findById("TEST_BUTTON_DESC")
            .click()
         .end()
            
         .findById("BASIC_MENU_BAR_TOGGLE_text")
            .getVisibleText()
            .then(function(initialValue) {
               assert.equal(initialValue, "Off");
            });
      },

      "Test external publication updates label (custom toggle) OFF": function() {
         return this.remote.findById("MENU_BAR_TOGGLE_CUSTOM_LABEL_text")
            .getVisibleText()
            .then(function(initialValue) {
               assert.equal(initialValue, "Off (Custom Label)");
            });
      },

      "Test external publication updates label (icon toggle) OFF": function() {
         return this.remote.findByCssSelector("#MENU_BAR_TOGGLE_WITH_ICON > img.alf-sort-descending-icon")
            .then(function() {}, function() {
               assert(false, "Test #1f - Image for desc icon toggle had wrong or missing CSS class");
            });
      },

      "Test hash initialises state": function() {
         return this.remote.findById("MENU_BAR_TOGGLE_USE_HASH_text")
            .getVisibleText()
            .then(function(initialValue) {
               assert.equal(initialValue, "Ascending");
            });
      },

      "Update hash changes toggle": function() {
         return this.remote.findById("SET_HASH_label")
            .click()
         .end()

         .findById("MENU_BAR_TOGGLE_USE_HASH_text")
            .getVisibleText()
            .then(function(initialValue) {
               assert.equal(initialValue, "Descending");
            });
      }
   });
});