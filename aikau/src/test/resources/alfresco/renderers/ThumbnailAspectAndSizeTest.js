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
         name: "Thumbnail Tests (aspect ratio, cropping and size) ",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/ThumbnailAspectAndSize", "Thumbnail Tests (aspect ratio, cropping and size) ").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Thumbnail can be sized": function() {
            return browser.findByCssSelector("#THUMB2_ITEM_0 .alfresco-renderers-Thumbnail__frame")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, 150, "Incorrect height");
                  assert.equal(size.width, 150, "Incorrect width");
               });
         },
         
         "Landscape thumbnail can be cropped": function() {
            return browser.findByCssSelector("#THUMB2_ITEM_0 .alfresco-renderers-Thumbnail__image")
               .getSize()
               .then(function(size) {
                  assert.isAbove(size.width, 150, "Landscape not cropped");
               });
         },

         "Portrait thumbnail can be cropped": function() {
            return browser.findByCssSelector("#THUMB2_ITEM_1 .alfresco-renderers-Thumbnail__image")
               .getSize()
               .then(function(size) {
                  assert.isAbove(size.height, 150, "Portrait not cropped");
               });
         },

         "Gallery thumbnail can be sized": function() {
            return browser.findById("THUMB3_ITEM_0")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, 200, "Incorrect height");
                  assert.equal(size.width, 200, "Incorrect width");
               });
         },

         "Gallery thumbnail can lose aspect ratio": function() {
            return browser.findByCssSelector("#THUMB3_ITEM_0 .alfresco-renderers-Thumbnail__image")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, 200, "Incorrect height");
                  assert.equal(size.width, 200, "Incorrect width");
               });
         },

         "Landscape gallery thumbnail can maintain aspect ratio": function() {
            return browser.findByCssSelector("#THUMB4_ITEM_0 .alfresco-renderers-Thumbnail__image")
               .getSize()
               .then(function(size) {
                  assert.closeTo(size.height, 169, 2, "Incorrect height");
                  assert.equal(size.width, 300, "Incorrect width");
               });
         },

         "Portrait gallery thumbnail can maintain aspect ratio": function() {
            return browser.findByCssSelector("#THUMB4_ITEM_1 .alfresco-renderers-Thumbnail__image")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, 300, "Incorrect height");
                  assert.closeTo(size.width, 225, 2, "Incorrect width");
               });
         },

         "Small thumbnail is correct size": function() {
            return browser.findByCssSelector("#THUMB7_ITEM_0 .alfresco-renderers-Thumbnail__frame")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, 40, "Incorrect height");
                  assert.equal(size.width, 40, "Incorrect width");
               });
         },

         "Landscape gallery thumbnail can be cropped": function() {
            return browser.findByCssSelector("#THUMB8_ITEM_0 .alfresco-renderers-Thumbnail__image")
               .getSize()
               .then(function(size) {
                  assert.isAbove(size.width, 249, "Landscape not cropped");
               });
         },

         "Landscape gallery  thumbnail can be cropped": function() {
            return browser.findByCssSelector("#THUMB8_ITEM_0 .alfresco-renderers-Thumbnail__image")
               .getSize()
               .then(function(size) {
                  assert.isAbove(size.height, 249, "Portrait not cropped");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});