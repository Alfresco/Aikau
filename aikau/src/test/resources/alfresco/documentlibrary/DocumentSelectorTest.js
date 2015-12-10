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
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "Document Selector Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/DocumentSelector", "Document Selector Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Count the rows": function () {
            return browser.findAllByCssSelector("#VIEW tr")
               .then(function(elements) {
                  assert.lengthOf(elements, 3, "An unexpected number of rows were detected");
               });
         },

         "Count the checked selectors": function() {
             return browser.findAllByCssSelector("#VIEW tr .alfresco-lists-ItemSelectionMixin--selected")
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "An unexpected number of CHECKED selectors were found");
               });
         },

         "Check that the overall selector indicates that none have been selected": function() {
            return browser.findByCssSelector("#SELECTED_ITEMS .alf-noneselected-icon")
               .then(null, function() {
                  assert(false, "The selected items widget doesn't indicate that NO items are selected");
               });
         },

         "Check the first selector": function() {
            return browser.findById("SELECTOR_ITEM_0")
               .click()
            .end()
            .findByCssSelector("#SELECTED_ITEMS .alf-someselected-icon")
               .then(null, function() {
                  assert(false, "The selected items widget doesn't indicate that SOME items are selected");
               });
         },

         "Check the other two selectors": function() {
            return browser.findById("SELECTOR_ITEM_1")
               .click()
            .end()
            .findById("SELECTOR_ITEM_2")
               .click()
            .end()
            .findByCssSelector("#SELECTED_ITEMS .alf-allselected-icon")
               .then(null, function() {
                  assert(false, "The selected items widget doesn't indicate that ALL items are selected");
               });
         },

         "Uncheck the middle selector": function() {
            return browser.findById("SELECTOR_ITEM_1")
               .click()
            .end()
            .findByCssSelector("#SELECTED_ITEMS .alf-someselected-icon")
               .then(null, function() {
                  assert(false, "The selected items widget doesn't indicate that SOME items are selected");
               });
         },

         "Open the menu and select documents": function() {
            return browser.findByCssSelector(".alf-menu-arrow")
               .click()
            .end()

            .findDisplayedByCssSelector(".dijitMenuItem:nth-child(4) > td.dijitMenuItemLabel")
               .click()
            .end()
            .findByCssSelector("#SELECTOR_ITEM_0.alfresco-lists-ItemSelectionMixin--selected")
               .then(null, function() {
                  assert(false, "First item was not checked when 'Documents' selected");
               });
         },

         "Check that second item is not checked": function() {
            return browser.findAllByCssSelector("#SELECTOR_ITEM_1.alfresco-lists-ItemSelectionMixin--selected")
               .then(function(elements) {
                  assert.lengthOf(elements, 0, "Second item was unexpectedly checked when 'Documents' selected");
               });
         },

         "Open the menu and select folders": function() {
            return browser.findByCssSelector(".alf-menu-arrow")
               .click()
            .end()

            .findDisplayedByCssSelector(".dijitMenuItem:nth-child(5) > td.dijitMenuItemLabel")
               .click()
            .end()

            .findByCssSelector("#SELECTOR_ITEM_1.alfresco-lists-ItemSelectionMixin--selected")
               .then(null, function() {
                  assert(false, "First item was unexpectedly checked when 'Folders' selected");
               });
         },

         "Check that second item is checked": function() {
            return browser.findByCssSelector("#SELECTOR_ITEM_1.alfresco-lists-ItemSelectionMixin--selected")
               .then(null, function() {
                  assert(false, "Second item was not checked when 'Folders' selected");
               });
         },

         "Select via thumbnail (selection only capability)": function() {
            return browser.findByCssSelector("#SELECT_THUMBNAIL_ITEM_0 .alfresco-renderers-Thumbnail__image")
               .clearLog()
               .click()
            .end()
            .getLastPublish("ALF_DOCLIST_DOCUMENT_SELECTED", "Thumbnail click did not publish selection")
            .getAllPublishes("ALF_NAVIGATE_TO_PAGE")
               .then(function(payloads) {
                  assert.lengthOf(payloads, 0, "Navigation publication should not have been made");
               });
         },

         "Deselect via thumbnail (selection only capability)": function() {
            return browser.findByCssSelector("#SELECT_THUMBNAIL_ITEM_0 .alfresco-renderers-Thumbnail__image")
               .clearLog()
               .click()
            .end()
            .getLastPublish("ALF_DOCLIST_DOCUMENT_DESELECTED", "Thumbnail click did not publish de-selection")
            .getAllPublishes("ALF_NAVIGATE_TO_PAGE")
               .then(function(payloads) {
                  assert.lengthOf(payloads, 0, "Navigation publication should not have been made");
               });
         },

         "Select via thumbnail (selection and navigation capability)": function() {
            return browser.findByCssSelector("#MIXED_THUMBNAIL_ITEM_0 .alfresco-renderers-Thumbnail__image")
               .clearLog()
               .click()
            .end()
            .getLastPublish("ALF_DOCLIST_DOCUMENT_SELECTED", "Thumbnail click did not publish selection")
            .getLastPublish("ALF_NAVIGATE_TO_PAGE", "Navigation publication not made");
         },

         "Check that other renderers have detected selection": function() {
            return browser.findByCssSelector("#SELECTOR_ITEM_0.alfresco-lists-ItemSelectionMixin--selected")
               .end()
               .findByCssSelector("#SELECT_THUMBNAIL_ITEM_0.alfresco-lists-ItemSelectionMixin--selected")
               .end()
               .findByCssSelector("#GALLERY_THUMBNAIL_ITEM_0.alfresco-lists-ItemSelectionMixin--selected");
         },

         "Deselect via thumbnail (selection and navigation capability)": function() {
            return browser.findByCssSelector("#MIXED_THUMBNAIL_ITEM_0 .alfresco-renderers-Thumbnail__image")
               .clearLog()
               .click()
            .end()
            .getLastPublish("ALF_DOCLIST_DOCUMENT_DESELECTED", "Thumbnail click did not publish de-selection")
            .getLastPublish("ALF_NAVIGATE_TO_PAGE", "Navigation publication not made");
         },

         "Select via thumbnail (selection disabled)": function() {
            return browser.findByCssSelector("#NON_SELECT_THUMBNAIL_ITEM_0 .alfresco-renderers-Thumbnail__image")
               .clearLog()
               .click()
            .end()
            .getAllPublishes("ALF_DOCLIST_DOCUMENT_SELECTED")
               .then(function(payloads) {
                  assert.lengthOf(payloads, 0, "Selection publication should not have been made");
               })
            .getLastPublish("ALF_NAVIGATE_TO_PAGE", "Navigation publication not made");
         },

         "Deselect via thumbnail (selection disabled)": function() {
            return browser.findByCssSelector("#NON_SELECT_THUMBNAIL_ITEM_0 .alfresco-renderers-Thumbnail__image")
               .clearLog()
               .click()
            .end()
            .getAllPublishes("ALF_DOCLIST_DOCUMENT_SELECTED")
               .then(function(payloads) {
                  assert.lengthOf(payloads, 0, "Selection publication should not have been made");
               })
            .getLastPublish("ALF_NAVIGATE_TO_PAGE", "Navigation publication not made");
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});