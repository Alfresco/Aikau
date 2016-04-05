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
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Multiple Favouriting Tests",
      testPage: "/MultiFavourite",

      "Check that nothing is shown as a favourite on page load": function() {
         return this.remote.findAllByCssSelector(".alfresco-renderers-Toggle .favourite.on.hidden")
            .then(function(elements) {
               assert.lengthOf(elements, 6, "Unexpected number of unfavorited items");
            });
      },

      "Add favourites in bulk": function() {
         return this.remote.findById("ADD_MULTIPLE_FAVOURITES_label")
            .click()
            .end()
            .getLastPublish("ALF_PREFERENCE_ADD_DOCUMENT_FAVOURITE_SUCCESS", "Bulk favourite success topic not published");
      },

      "Folder 1 should be favourited": function() {
         return this.remote.findByCssSelector("#FAVOURITE_ITEM_0 .favourite.enabled")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Folder 1 should be shown as a favourite");
            });
      },

      "Folder 2 should be favourited": function() {
         return this.remote.findByCssSelector("#FAVOURITE_ITEM_1 .favourite.enabled")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Folder 2 should be shown as a favourite");
            });
      },

      "Folder 3 should NOT be favourited": function() {
         return this.remote.findByCssSelector("#FAVOURITE_ITEM_2 .favourite.enabled")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Folder 3 should NOT be shown as a favourite");
            });
      },

      "Document 1 should be favourited": function() {
         return this.remote.findByCssSelector("#FAVOURITE_ITEM_3 .favourite.enabled")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Document 1 should be shown as a favourite");
            });
      },

      "Document 2 should be favourited": function() {
         return this.remote.findByCssSelector("#FAVOURITE_ITEM_4 .favourite.enabled")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Document 2 should be shown as a favourite");
            });
      },

      "Document 3 should NOT be favourited": function() {
         return this.remote.findByCssSelector("#FAVOURITE_ITEM_5 .favourite.enabled")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Document 3 should NOT be shown as a favourite");
            });
      },

      "Remove favourites in bulk": function() {
         return this.remote.findById("REMOVE_MULTIPLE_FAVOURITES_label")
            .click()
            .end()
            .getLastPublish("ALF_PREFERENCE_REMOVE_DOCUMENT_FAVOURITE_SUCCESS", "Bulk favourite removal success topic not published");
      },

      "Folder 1 should NOT be favourited": function() {
         return this.remote.findByCssSelector("#FAVOURITE_ITEM_0 .favourite.enabled")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Folder 1 should NOT be shown as a favourite");
            });
      },

      "Folder 2 should STILL be favourited": function() {
         return this.remote.findByCssSelector("#FAVOURITE_ITEM_1 .favourite.enabled")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Folder 2 should STILL be shown as a favourite");
            });
      },

      "Folder 3 should STILL not be favourited": function() {
         return this.remote.findByCssSelector("#FAVOURITE_ITEM_2 .favourite.enabled")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Folder 3 should STILL NOT be shown as a favourite");
            });
      },

      "Document 1 should STILL be favourited": function() {
         return this.remote.findByCssSelector("#FAVOURITE_ITEM_3 .favourite.enabled")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed, "Document 1 should STILL be shown as a favourite");
            });
      },

      "Document 2 should NOT be favourited": function() {
         return this.remote.findByCssSelector("#FAVOURITE_ITEM_4 .favourite.enabled")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Document 2 should NOT be shown as a favourite");
            });
      },

      "Document 3 should STILL not be favourited": function() {
         return this.remote.findByCssSelector("#FAVOURITE_ITEM_5 .favourite.enabled")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed, "Document 3 should STILL NOT be shown as a favourite");
            });
      }
   });
});