/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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

   registerSuite({
      name: 'GalleryView Test',
      'Basic Test': function () {

         var browser = this.remote;
         var testname = "GalleryView Test (basic)";
         // return TestCommon.loadTestWebScript(this.remote, "/GalleryView", testname)
         return TestCommon.loadTestWebScript(this.remote, "/galleryViewTest", testname)

            // 1. Check that the AlfGalleryViewSlider is visible (this is an additional control published from the gallery view)...
            .findByCssSelector("#TOOLBAR .alfresco-documentlibrary-AlfGalleryViewSlider")
               .then(null, function() {
                  assert(false, "Test #1a - The gallery view slider was not found");
               })
               .isDisplayed()
               .then(function(result) {
                  assert(result === true, "Test #1b - The gallery view slider was found but is not displayed");
               })
            .end()

            // 2. Check that the page has been initialised with 4 items per row...
            .findAllByCssSelector("#DOCLIST .alfresco-documentlibrary-views-layouts-Grid > tr:first-child > td")
               .then(function(elements) {
                  assert(elements.length == 4, "Test #2a - The view initially displays an unexpected number of items per row: " + elements.length);
               })
            .end()

            // 3. Increment the view size and check that the number of of items per row has decreased to 3....
            .findByCssSelector("#TOOLBAR .dijitSliderIncrementIconH")
               .click()
            .end()
            .findAllByCssSelector("#DOCLIST .alfresco-documentlibrary-views-layouts-Grid > tr:first-child > td")
               .then(function(elements) {
                  assert(elements.length == 3, "Test #3a - The number of items per row was not decreased: " + elements.length);
               })
            .end()

            // 4. Decrement the view size and check the number of items per row increases...
            .findByCssSelector("#TOOLBAR .dijitSliderDecrementIconH")
               .click()
               .click()
            .end()
            .findAllByCssSelector("#DOCLIST .alfresco-documentlibrary-views-layouts-Grid > tr:first-child > td")
               .then(function(elements) {
                  assert(elements.length == 7, "Test #4a - The number of items per row was not increased: " + elements.length);
               })
            .end()
            .findByCssSelector("#TOOLBAR .dijitSliderDecrementIconH")
               .click()
            .end()
            .findAllByCssSelector("#DOCLIST .alfresco-documentlibrary-views-layouts-Grid > tr:first-child > td")
               .then(function(elements) {
                  assert(elements.length == 10, "Test #4b - The number of items per row was not increased: " + elements.length);
               })
            .end()

            // 5. Check that the 2nd AlfGalleryViewSlider is hidden because there are no items...
            .findByCssSelector("#TOOLBAR_NO_ITEMS .alfresco-documentlibrary-AlfGalleryViewSlider")
               .then(null, function() {
                  assert(false, "Test #5a - The 'no-items' gallery view slider was not found");
               })
               .isDisplayed()
               .then(function(result) {
                  assert(result === false, "Test #5b - The 'no-items' gallery view slider was found but should be hidden");
               })
            .end()

            .alfPostCoverageResults(browser);
      },
      'Keyboard Navigation': function () {

         var alfPause = 500;
         var browser = this.remote;
         var testname = "GalleryView Test (keyboard)";
         // return TestCommon.loadTestWebScript(this.remote, "/GalleryView", testname)
         return TestCommon.loadTestWebScript(this.remote, "/galleryViewTest", testname)

            .findByCssSelector("#TOOLBAR .alfresco-documentlibrary-AlfGalleryViewSlider")
               .then(null, function() {
                  TestCommon.log(testname, "Finding slider...");
                  assert(false, "Test #0a - The gallery view slider was not found");
               })
            .end()

            // Increment and decrement the size... just making sure everything is ready for keyboard navigation...
            .findByCssSelector("#TOOLBAR .dijitSliderIncrementIconH")
               .click()
            .end()
            .findByCssSelector("#TOOLBAR .dijitSliderDecrementIconH")
               .click()
            .end()

            // 1. Focus on the first thumbnail...
            .pressKeys(keys.TAB) // Goes to first thumbnail...
            .sleep(alfPause)

            // 2. Tab again to select the selector...
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_SELECTED", "value", "displayName", "Folder 1"))
               .then(function(elements) {
                  TestCommon.log(testname, "Tabbed and selected first document...");
                  assert(elements.length == 1, "Test #1b - The wrong document was selected");
               })
            .end()

            // 3. Display the More Info dialog...
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.RETURN)

            .findByCssSelector(".alfresco-dialog-AlfDialog .dijitDialogTitleBar > span")
               .getVisibleText()
               .then(function(text) {
                  TestCommon.log(testname, "Displaying More Info dialog...");
                  assert(text === "Folder 1", "Test #2a - The More Info dialog was not displayed");
               })
            .end()

            .sleep(alfPause)
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
                  TestCommon.log(testname, "Selected second document...");
                  assert(elements.length == 1, "Test #3a - The wrong document was selected");
               })
            .end()

            .sleep(alfPause)
            .pressKeys(keys.ARROW_LEFT)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_SELECTED", "value", "displayName", "Calendar Event"))
               .then(function(elements) {
                  TestCommon.log(testname, "Selected third document");
                  assert(elements.length == 1, "Test #3b - The wrong document was selected");
               })
            .end()

            .sleep(alfPause)
            .pressKeys(keys.ARROW_UP)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_SELECTED", "value", "displayName", "Folder 4"))
               .then(function(elements) {
                  TestCommon.log(testname, "Selected fourth document");
                  assert(elements.length == 1, "Test #3c - The wrong document was selected");
               })
            .end()

            .sleep(alfPause)
            .pressKeys(keys.ARROW_RIGHT)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .sleep(alfPause)
            .findAllByCssSelector(TestCommon.pubDataNestedValueCssSelector("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_DESELECTED", "value", "displayName", "Folder 1"))
               .then(function(elements) {
                  TestCommon.log(testname, "Selected fifth document");
                  assert(elements.length == 1, "Test #3d - The wrong document was selected");
               })
            .end()
            
            .alfPostCoverageResults(browser);
      }
   });
});