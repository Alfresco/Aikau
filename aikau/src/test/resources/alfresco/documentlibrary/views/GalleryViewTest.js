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
 * The purpose of this test is to ensure that keyboard accessibility is possible between the header and the 
 * main table. It should be possible to use the tab/shift-tab keys to navigate along the headers (and the enter/space key
 * to make requests for sorting) and then the cursor keys to navigate around the table itself.
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, expect, require, TestCommon, keys) {

registerSuite(function(){
   var browser;

   return {
      name: "GalleryView Tests",
      
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/GalleryView", "Gallery View Tests (Resizing)").end();
      },
      
      beforeEach: function() {
         browser.end();
      },
      
      "Test gallery view resize slider is displayed": function() {
         return browser.findByCssSelector("#TOOLBAR .alfresco-documentlibrary-AlfGalleryViewSlider")
            .getLastPublish("ALF_DOCLIST_DOCUMENTS_LOADED")
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "The gallery view slider was found but is not displayed");
            });
      },
      
      "Test initial layout": function() {
         // NOTE: That gallery view has been configured to have a non-default number of columns, 7 instead of 4...
         // Check that the page has been initialised with 7 items per row...
         return browser.findAllByCssSelector("#DOCLIST .alfresco-lists-views-layouts-Grid > tr:first-child > td")
            .then(function(elements) {
               assert.lengthOf(elements, 7, "The view initially displays an unexpected number of items per row");
            });
      },
      
      "Test slider change decreases items per row": function() {
         // Increment the view size and check that the number of of items per row has decreased to 4....
         return browser.findByCssSelector("#TOOLBAR .dijitSliderIncrementIconH")
            .clearLog()
            .click()
         .end()
         .getLastPublish("ALF_PREFERENCE_SET", "Preference not set")
         .end()
         .findAllByCssSelector("#DOCLIST .alfresco-lists-views-layouts-Grid > tr:first-child > td")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "The number of items per row was not decreased");
            });
      },
      
      "Test slider change increases items per row (show 7)": function() {
         // Decrement the view size and check the number of items per row increases...
         return browser.findByCssSelector("#TOOLBAR .dijitSliderDecrementIconH")
            .click()
         .end()
         .findAllByCssSelector("#DOCLIST .alfresco-lists-views-layouts-Grid > tr:first-child > td")
            .then(function(elements) {
               assert.lengthOf(elements, 7, "The number of items per row was not increased");
            });
      },
      
      "Test slider change increases items per row (show 10)": function() {
         return browser.findByCssSelector("#TOOLBAR .dijitSliderDecrementIconH")
            .click()
         .end()
         .findAllByCssSelector("#DOCLIST .alfresco-lists-views-layouts-Grid > tr:first-child > td")
            .then(function(elements) {
               assert.lengthOf(elements, 10, "The number of items per row was not increased");
            });
      },
      
      "Test 'no-items' slider exists": function() {
         // Check that the 2nd AlfGalleryViewSlider is hidden because there are no items...
         return browser.findByCssSelector("#TOOLBAR_NO_ITEMS .alfresco-documentlibrary-AlfGalleryViewSlider")
            .then(null, function() {
               assert(false, "The 'no-items' gallery view slider was not found");
            });
      },
      
      "Test 'no-items' slider is not displayed": function() {
         // Check that the 2nd AlfGalleryViewSlider is hidden because there are no items...
         return browser.findByCssSelector("#TOOLBAR_NO_ITEMS .alfresco-documentlibrary-AlfGalleryViewSlider")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "The 'no-items' gallery view slider was found but should be hidden");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

registerSuite(function(){
   var browser;
   var alfPause = 500;

   return {
      name: "GalleryView Keyboard Tests",
      
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/GalleryView", "Gallery View Tests (Keyboard Navigation)")
         // Using the slider ensures everything is setup for keyboard navigation
         .findByCssSelector("#TOOLBAR .dijitSliderIncrementIconH")
            .click()
         .end();
      },
      
      beforeEach: function() {
         browser.end();
      },
      
      "Test selecting first item (Folder 1)": function () {
         // 1. Focus on the first thumbnail...
         return browser.pressKeys(keys.TAB) // Goes to first thumbnail...
         .sleep(alfPause)
         // 2. Tab again to select the selector...
         .pressKeys(keys.TAB)
         .sleep(alfPause)
         .pressKeys(keys.SPACE)
         .getLastPublish("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_SELECTED")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "value.displayName", "Folder 1", "The wrong document was selected");
            });
      },

      "Check selector click doesn't navigate": function() {
         return browser.findAllByCssSelector(TestCommon.topicSelector("ALF_NAVIGATE_TO_PAGE","publish","any"))
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Should not have been able to find a navigation request");
            });
      },
      
      "Test showing more info on first thumbnail": function() {
         // 3. Display the More Info dialog...
         return browser.pressKeys(keys.TAB)
         .sleep(alfPause)
         .pressKeys(keys.RETURN)
         .findByCssSelector(".alfresco-dialog-AlfDialog .dijitDialogTitleBar > span")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Folder 1", "The More Info dialog was not displayed");
            });
      },
      
      "Test moving to second row (Wiki Page)": function() {
         return browser.sleep(alfPause)
            .pressKeys(keys.ESCAPE)
            .sleep(alfPause)
            // 4. Use the keys to move around...
            .pressKeys(keys.ARROW_DOWN)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .getLastPublish("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_SELECTED")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "value.displayName", "Wiki Page", "The wrong document was selected");
            });
      },
      
      "Test left cursor moves to last item on first row (Calendar Event)": function() {
         return browser.sleep(alfPause)
            .pressKeys(keys.ARROW_LEFT)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .getLastPublish("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_SELECTED")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "value.displayName", "Calendar Event", "The wrong document was selected");
            });
      },
      
      "Test up cursor loops to bottom (Folder 4)": function() {
         return browser.sleep(alfPause)
            .pressKeys(keys.ARROW_UP)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .getLastPublish("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_SELECTED")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "value.displayName", "Folder 4", "The wrong document was selected");
            });
      },
      
      "Test right cursor on last item loops to first item (Folder 1)": function() {
         return browser.sleep(alfPause)
            .pressKeys(keys.ARROW_RIGHT)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .sleep(alfPause)
            .getLastPublish("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_DESELECTED")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "value.displayName", "Folder 1", "The wrong document was selected");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});