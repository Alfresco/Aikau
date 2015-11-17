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
define(["alfresco/TestCommon",
        "intern/chai!assert",
        "intern!object"],
        function(TestCommon, assert, registerSuite) {

   registerSuite(function(){
      var browser;

      return {
         name: "Addable View Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/AddableView", "Addable View Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Add button is present on list view": function() {
            return browser.findByCssSelector("#VIEW #CREATE_BUTTON_2_ITEM_0");
         },

         "Add button is present on the grid view": function() {
            return browser.findById("SHOW_GRID_VIEW_label")
               .click()
            .end()

            .findDisplayedByCssSelector("#GRID #CREATE_BUTTON_3_ITEM_0");
         },

         "Check that add button is not as wide as it's parent": function() {
            var containerSize;
            return browser.findById("CELL_CONTAINER_ITEM_0")
               .getSize()
               .then(function(size) {
                  containerSize = size.width;
               })
            .end()

            .findById("CREATE_BUTTON_3_ITEM_0")
               .getSize()
               .then(function(size) {
                  assert.isBelow(size.width, containerSize, "The button was resized");
               });
         },

         "Empty cells should be created when there are no items": function() {
            return browser.findAllByCssSelector("#GRID_ITEMS .alfresco-lists-views-layouts-Grid__emptyCell")
               .then(function(elements) {
                  assert.lengthOf(elements, 3, "No empty cells created");
               });
         },

         "Create a new item from the grid view": function() {
            // Click the add button...
            return browser.findById("CREATE_BUTTON_3_ITEM_0_label")
               .click()
            .end()

            // Enter a value for the new item...
            .findDisplayedByCssSelector("#ADD_ITEM_DIALOG #DIALOG_NAME .dijitInputContainer input")
               .clearValue()
               .type("Test1") 
            .end()

            // Clear the pub/sub log so we can look for the reloading of the list...
            .clearLog()

            // Create the item...
            .findById("ADD_ITEM_DIALOG_OK_label")
               .click()
            .end()

            // Wait for the list to be reloaded...
            .getLastPublish("ALF_DOCLIST_DOCUMENTS_LOADED")

            .findDisplayedByCssSelector("#GRID #PROPERTY_ITEM_0")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Test1", "Item was not created");
               });
         },

         "Switch back to the list view and check item exists": function() {
            return browser.findById("SHOW_LIST_VIEW_label")
               .click()
            .end()

            .findDisplayedByCssSelector("#LIST #LIST_PROPERTY_ITEM_0")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Test1", "Item was not created");
               });
         },

         "Create an item from the list view": function() {
            return browser.findById("CREATE_BUTTON_2_ITEM_0_label")
               .click()
            .end()

            // Enter a value for the new item...
            .findDisplayedByCssSelector("#ADD_ITEM_DIALOG #DIALOG_NAME .dijitInputContainer input")
               .clearValue()
               .type("Test2") 
            .end()

            // Clear the pub/sub log so we can look for the reloading of the list...
            .clearLog()

            // Create the item...
            .findById("ADD_ITEM_DIALOG_OK_label")
               .click()
            .end()

            // Wait for the list to be reloaded...
            .getLastPublish("ALF_DOCLIST_DOCUMENTS_LOADED")

            .findDisplayedByCssSelector("#LIST #LIST_PROPERTY_ITEM_1")
               .getVisibleText()
               .then(function(text) {
                  assert.equal(text, "Test2", "Item was not created");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});