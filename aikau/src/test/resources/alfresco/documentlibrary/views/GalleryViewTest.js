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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   defineSuite(module, {
      name: "GalleryView Tests",
      testPage: "/GalleryView",

      "Test gallery view resize slider is displayed": function() {
         return this.remote.findByCssSelector("#TOOLBAR .alfresco-documentlibrary-AlfGalleryViewSlider")
            .getLastPublish("ALF_DOCLIST_DOCUMENTS_LOADED")
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "The gallery view slider was found but is not displayed");
            });
      },

      "Test initial layout": function() {
         // NOTE: That gallery view has been configured to have a non-default number of columns, 7 instead of 4...
         // Check that the page has been initialised with 7 items per row...
         return this.remote.findAllByCssSelector("#DOCLIST .alfresco-lists-views-layouts-Grid > tr:first-child > td")
            .then(function(elements) {
               assert.lengthOf(elements, 7, "The view initially displays an unexpected number of items per row");
            });
      },

      "Test slider change decreases items per row": function() {
         // Increment the view size and check that the number of of items per row has decreased to 4....
         return this.remote.findByCssSelector("#TOOLBAR .dijitSliderIncrementIconH")
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
         return this.remote.findByCssSelector("#TOOLBAR .dijitSliderDecrementIconH")
            .click()
            .end()
            .getLastPublish("HAS_ITEMS_ALF_DOCLIST_SET_GALLERY_COLUMNS")
            .findAllByCssSelector("#DOCLIST .alfresco-lists-views-layouts-Grid > tr:first-child > td")
            .then(function(elements) {
               assert.lengthOf(elements, 7, "The number of items per row was not increased");
            });
      },

      "Test slider change increases items per row (show 10)": function() {
         return this.remote.findByCssSelector("#TOOLBAR .dijitSliderDecrementIconH")
            .click()
            .end()
            .getLastPublish("HAS_ITEMS_ALF_DOCLIST_SET_GALLERY_COLUMNS")
            .findAllByCssSelector("#DOCLIST .alfresco-lists-views-layouts-Grid > tr:first-child > td")
            .then(function(elements) {
               assert.lengthOf(elements, 10, "The number of items per row was not increased");
            });
      },

      "Test 'no-items' slider exists": function() {
         // Check that the 2nd AlfGalleryViewSlider is hidden because there are no items...
         return this.remote.findByCssSelector("#TOOLBAR_NO_ITEMS .alfresco-documentlibrary-AlfGalleryViewSlider")
            .then(null, function() {
               assert(false, "The 'no-items' gallery view slider was not found");
            });
      },

      "Test 'no-items' slider is not displayed": function() {
         // Check that the 2nd AlfGalleryViewSlider is hidden because there are no items...
         return this.remote.findByCssSelector("#TOOLBAR_NO_ITEMS .alfresco-documentlibrary-AlfGalleryViewSlider")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "The 'no-items' gallery view slider was found but should be hidden");
            });
      },

      "Long item names are truncated": function() {
         var normalNameHeight;
         return this.remote.findByCssSelector("#DOCLIST tr:nth-child(1) td:nth-child(1) .displayName")
            .getSize()
            .then(function(size) {
               normalNameHeight = size.height;
            })
            .end()

         .findByCssSelector("#DOCLIST tr:nth-child(1) td:nth-child(6) .displayName")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Link with a really, really long title that won't fit properly", "Incorrect item being tested for height");
            })
            .getSize()
            .then(function(size) {
               assert.equal(normalNameHeight, size.height, "Height not consistent with being truncated (i.e. is probably wrapping)");
            });
      }
   });

   var alfPause = 500;

   defineSuite(module, {
      name: "GalleryView Keyboard Tests",

      setup: function() {
         return TestCommon.loadTestWebScript(this.remote, "/GalleryView", "Gallery View Tests (Keyboard Navigation)")
            // Using the slider ensures everything is setup for keyboard navigation
            .findByCssSelector("#TOOLBAR .dijitSliderIncrementIconH")
            .click()
            .end();
      },

      "Test selecting first item (Folder 1)": function() {
         return this.remote.findByCssSelector("body")
            .tabToElement(".alfresco-lists-views-layouts-Grid tr:first-child td:first-child .alfresco-renderers-Thumbnail .alfresco-renderers-Selector")
            .pressKeys(keys.SPACE)
            .getLastPublish("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_SELECTED")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "value.displayName", "Folder 1", "The wrong document was selected");
            });
      },

      "Check selector click doesn't navigate": function() {
         return this.remote.findAllByCssSelector(TestCommon.topicSelector("ALF_NAVIGATE_TO_PAGE", "publish", "any"))
            .then(function(elements) {
               assert.lengthOf(elements, 0, "Should not have been able to find a navigation request");
            });
      },

      "Test showing more info on first thumbnail": function() {
         // 3. Display the More Info dialog...
         return this.remote.pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.RETURN)
            .findByCssSelector(".alfresco-dialog-AlfDialog .dijitDialogTitleBar > span")
            .getVisibleText()
            .then(function(text) {
               assert(text === "Folder 1", "The More Info dialog was not displayed");
            });
      },

      "Test moving to second row (Wiki Page)": function() {
         return this.remote.sleep(alfPause)
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
         return this.remote.sleep(alfPause)
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
         return this.remote.sleep(alfPause)
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
         return this.remote.sleep(alfPause)
            .pressKeys(keys.ARROW_RIGHT)
            .sleep(alfPause)
            .pressKeys(keys.TAB)
            .sleep(alfPause)
            .pressKeys(keys.SPACE)
            .sleep(alfPause)
            .getLastPublish("HAS_ITEMS_ALF_DOCLIST_DOCUMENT_DESELECTED")
            .then(function(payload) {
               assert.deepPropertyVal(payload, "value.displayName", "Folder 1", "The wrong document was selected");
            })
            .clearLog();
      },

      "Resize and check the selections": function() {
         return this.remote.findByCssSelector("#TOOLBAR .dijitSliderDecrementIconH")
            .click()
            .end()
            .getLastPublish("HAS_ITEMS_ALF_SELECTED_FILES_CHANGED")
            .then(function(payload) {
               var nodeRefs = [];
               payload.selectedItems.forEach(function(item) {
                  nodeRefs.push(item.nodeRef);
               });
               assert.lengthOf(nodeRefs, 3, "Unexpected number of selected items");
               assert.include(nodeRefs, "dummy://nodeRef/4", "Couldn't find selected calendar event");
               assert.include(nodeRefs, "dummy://nodeRef/5", "Couldn't find selected wiki page");
               assert.include(nodeRefs, "dummy://nodeRef/11", "Couldn't find selected folder");
            });
      }
   });
});