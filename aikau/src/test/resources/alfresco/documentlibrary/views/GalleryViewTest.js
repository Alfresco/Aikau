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

   var browser;

   registerSuite({
      name: "GalleryView Tests",
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/galleryViewTest", "Gallery View Tests (Resizing)").end();
      },
      beforeEach: function() {
         browser.end();
      },
      teardown: function() {
         return browser.end().alfPostCoverageResults(browser);
      },
      "Test gallery view resize slider exists": function () {
         // 1. Check that the AlfGalleryViewSlider is visible (this is an additional control published from the gallery view)...
         return browser.findByCssSelector("#TOOLBAR .alfresco-documentlibrary-AlfGalleryViewSlider")
            .then(null, function() {
               assert(false, "The gallery view slider was not found");
            })
         .end();
      },
      "Test gallery view resize slider is displayed": function() {
         return browser.findByCssSelector("#TOOLBAR .alfresco-documentlibrary-AlfGalleryViewSlider")
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "The gallery view slider was found but is not displayed");
            })
         .end();
      },
      "Test initial layout": function() {
         // 2. Check that the page has been initialised with 4 items per row...
         return browser.findAllByCssSelector("#DOCLIST .alfresco-lists-views-layouts-Grid > tr:first-child > td")
            .then(function(elements) {
               assert(elements.length === 4, "The view initially displays an unexpected number of items per row, expected 4 but found: " + elements.length);
            })
         .end();
      },
      "Test slider change decreases items per row": function() {
         // 3. Increment the view size and check that the number of of items per row has decreased to 3....
         return browser.findByCssSelector("#TOOLBAR .dijitSliderIncrementIconH")
            .click()
         .end()
         .findAllByCssSelector("#DOCLIST .alfresco-lists-views-layouts-Grid > tr:first-child > td")
            .then(function(elements) {
               assert(elements.length === 3, "The number of items per row was not decreased, expected 3 but found: " + elements.length);
            })
         .end();
      },
      "Test slider change increases items per row (show 7)": function() {
            // 4. Decrement the view size and check the number of items per row increases...
         return browser.findByCssSelector("#TOOLBAR .dijitSliderDecrementIconH")
            .click()
            .click()
         .end()
         .findAllByCssSelector("#DOCLIST .alfresco-lists-views-layouts-Grid > tr:first-child > td")
            .then(function(elements) {
               assert(elements.length === 7, "The number of items per row was not increased, expected 7 but found: " + elements.length);
            })
         .end();
      },
      "Test slider change increases items per row (show 10)": function() {
         return browser.findByCssSelector("#TOOLBAR .dijitSliderDecrementIconH")
            .click()
         .end()
         .findAllByCssSelector("#DOCLIST .alfresco-lists-views-layouts-Grid > tr:first-child > td")
            .then(function(elements) {
               assert(elements.length === 10, "The number of items per row was not increased, expected 10 but found: : " + elements.length);
            })
         .end();
      },
      "Test 'no-items' slider exists": function() {
         // 5. Check that the 2nd AlfGalleryViewSlider is hidden because there are no items...
         return browser.findByCssSelector("#TOOLBAR_NO_ITEMS .alfresco-documentlibrary-AlfGalleryViewSlider")
            .then(null, function() {
               assert(false, "The 'no-items' gallery view slider was not found");
            })
         .end();
      },
      "Test 'no-items' slider is not displayed": function() {
         // 5. Check that the 2nd AlfGalleryViewSlider is hidden because there are no items...
         return browser.findByCssSelector("#TOOLBAR_NO_ITEMS .alfresco-documentlibrary-AlfGalleryViewSlider")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "The 'no-items' gallery view slider was found but should be hidden");
            })
         .end();
      }
   });

   var alfPause = 500;
   registerSuite({
      name: "GalleryView Keyboard Tests",
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/galleryViewTest", "Gallery View Tests (Keyboard Navigation)")
         // Using the slider ensures everything is setup for keyboard navigation
         .findByCssSelector("#TOOLBAR .dijitSliderIncrementIconH")
            .click()
         .end()
         .findByCssSelector("#TOOLBAR .dijitSliderDecrementIconH")
            .click()
         .end();
      },
      beforeEach: function() {
         browser.end();
      },
      teardown: function() {
         return browser.end().alfPostCoverageResults(browser);
      },
      "Test selecting first item (Folder 1)": function () {
         // 1. Focus on the first thumbnail...
         return browser.pressKeys(keys.TAB) // Goes to first thumbnail...
         .sleep(alfPause)
         // 2. Tab again to select the selector...
         .pressKeys(keys.TAB)
         .sleep(alfPause)
         .pressKeys(keys.SPACE)
         .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_SELECTED", "value", "displayName", "Folder 1"))
            .then(function(elements) {
               assert(elements.length === 1, "The wrong document was selected");
            })
         .end();
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
            })
         .end();
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
            .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_SELECTED", "value", "displayName", "Wiki Page"))
               .then(function(elements) {
                  assert(elements.length === 1, "The wrong document was selected");
               })
            .end();
      },
      "Test left cursor moves to last item on first row (Calendar Event)": function() {
         return browser.sleep(alfPause)
            .pressKeys(keys.ARROW_LEFT)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_SELECTED", "value", "displayName", "Calendar Event"))
               .then(function(elements) {
                  assert(elements.length === 1, "The wrong document was selected");
               })
            .end();
      },
      "Test up cursor loops to bottom (Folder 4)": function() {
         return browser.sleep(alfPause)
            .pressKeys(keys.ARROW_UP)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_SELECTED", "value", "displayName", "Folder 4"))
               .then(function(elements) {
                  assert(elements.length === 1, "The wrong document was selected");
               })
            .end();
      },
      "Test right cursor on last item loops to first item (Folder 1)": function() {
         return browser.sleep(alfPause)
            .pressKeys(keys.ARROW_RIGHT)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .sleep(alfPause)
            .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_DESELECTED", "value", "displayName", "Folder 1"))
               .then(function(elements) {
                  assert(elements.length === 1, "The wrong document was selected");
               })
            .end();
      }
   });
});