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
      name: "Thumbnail Tests (aspect ratio, cropping and size) ",
      testPage: "/ThumbnailAspectAndSize",

      "Thumbnail can be sized": function() {
         return this.remote.findByCssSelector("#THUMB2_ITEM_0 .alfresco-renderers-Thumbnail__frame")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 150, "Incorrect height");
               assert.equal(size.width, 150, "Incorrect width");
            });
      },

      "Landscape thumbnail can be cropped": function() {
         return this.remote.findByCssSelector("#THUMB2_ITEM_0 .alfresco-renderers-Thumbnail__image")
            .getSize()
            .then(function(size) {
               assert.isAbove(size.width, 150, "Landscape not cropped");
            });
      },

      "Portrait thumbnail can be cropped": function() {
         return this.remote.findByCssSelector("#THUMB2_ITEM_1 .alfresco-renderers-Thumbnail__image")
            .getSize()
            .then(function(size) {
               assert.isAbove(size.height, 150, "Portrait not cropped");
            });
      },

      "Gallery thumbnail can be sized": function() {
         return this.remote.findById("THUMB3_ITEM_0")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 200, "Incorrect height");
               assert.equal(size.width, 200, "Incorrect width");
            });
      },

      "Gallery thumbnail can lose aspect ratio": function() {
         return this.remote.findByCssSelector("#THUMB3_ITEM_0 .alfresco-renderers-Thumbnail__image")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 200, "Incorrect height");
               assert.equal(size.width, 200, "Incorrect width");
            });
      },

      "Landscape gallery thumbnail can maintain aspect ratio": function() {
         return this.remote.findByCssSelector("#THUMB4_ITEM_0 .alfresco-renderers-Thumbnail__image")
            .getSize()
            .then(function(size) {
               assert.closeTo(size.height, 169, 2, "Incorrect height");
               assert.equal(size.width, 300, "Incorrect width");
            });
      },

      "Portrait gallery thumbnail can maintain aspect ratio": function() {
         return this.remote.findByCssSelector("#THUMB4_ITEM_1 .alfresco-renderers-Thumbnail__image")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 300, "Incorrect height");
               assert.closeTo(size.width, 225, 2, "Incorrect width");
            });
      },

      "Small thumbnail is correct size": function() {
         return this.remote.findByCssSelector("#THUMB7_ITEM_0 .alfresco-renderers-Thumbnail__frame")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 40, "Incorrect height");
               assert.equal(size.width, 40, "Incorrect width");
            });
      },

      "Landscape gallery thumbnail can be cropped": function() {
         return this.remote.findByCssSelector("#THUMB8_ITEM_0 .alfresco-renderers-Thumbnail__image")
            .getSize()
            .then(function(size) {
               assert.isAbove(size.width, 249, "Landscape not cropped");
            });
      },

      "Landscape gallery  thumbnail can be cropped": function() {
         return this.remote.findByCssSelector("#THUMB8_ITEM_0 .alfresco-renderers-Thumbnail__image")
            .getSize()
            .then(function(size) {
               assert.isAbove(size.height, 249, "Portrait not cropped");
            });
      },

      // NOTE: The following two tests address both AKU-713 and AKU-714...
      //       The height and width of the landscape and portrait take into account the
      //       5px margin - e.g. the *thumbnail* width and height should be 300px and 200px
      "Non-square thumbnail landscape renders correctly": function() {
         return this.remote.findByCssSelector("#THUMB9_ITEM_0 .alfresco-renderers-Thumbnail__image")
            .getSize()
            .then(function(size) {
               assert.closeTo(size.width, 290, 1, "Non-square landscape width is wrong");
               assert.closeTo(size.height, 163, 1, "Non-square landscape height is wrong");
            });
      },

      "Non-square thumbnail portrait renders correctly": function() {
         return this.remote.findByCssSelector("#THUMB9_ITEM_1 .alfresco-renderers-Thumbnail__image")
            .getSize()
            .then(function(size) {
               assert.closeTo(size.height, 190, 1, "Non-square portrait height is wrong");
               assert.closeTo(size.width, 143, 1, "Non-square portrait width is wrong");
            });
      }
   });
});