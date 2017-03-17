/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * @author Martin Doyle
 */
define(["module",
        "alfresco/TestCommon",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "intern/dojo/node!leadfoot/keys"],
        function(module, TestCommon, defineSuite, assert, keys) {

   defineSuite(module, {
      name: "Image Tests",
      testPage: "/Image",

      "Image displayed with correct, custom dimensions": function() {
         return this.remote.findById("IMAGE_WITH_DIMENSIONS")
            .getSize()
            .then(function(size) {
               assert.propertyVal(size, "width", 150);
               assert.propertyVal(size, "height", 75);
            });
      },

      "Missing dimension extrapolated from aspect ratio": function() {
         return this.remote.findById("IMAGE_CLASS_AND_DIMENSIONS")
            .getSize()
            .then(function(size) {
               assert.propertyVal(size, "width", 100);
               assert.propertyVal(size, "height", 100);
            });
      },

      "Custom style applied": function() {
         return this.remote.findByCssSelector("#IMAGE_CLASS_STYLE_TOPIC .alfresco-html-Image__img")
            .getComputedStyle("boxShadow")
            .then(function(boxShadow) {
               assert.include(boxShadow, "3px 3px 10px");
            });
      },

      "Image with topic publishes on click": function() {
         return this.remote.findById("IMAGE_CLASS_STYLE_TOPIC")
            .click()
            .getLastPublish("LOGO_TOPIC_PUBLISHED");
      },

      "Image with url navigates when clicked": function() {
         return this.remote.findByCssSelector("#IMAGE_CLASS_LINK .alfresco-html-Image__img")
            .click()
            .end()

         .findByCssSelector("#TDAC .title")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Aikau Unit Tests");
            });
      }
   });

   defineSuite(module, {
      name: "Image Keyboard Tests",
      testPage: "/Image",

      "Image will publish topic when ENTER pressed": function() {
         return this.remote.findByCssSelector("body")
            .tabToElement("#IMAGE_CLASS_STYLE_TOPIC")
            .pressKeys(keys.ENTER)
            .getLastPublish("LOGO_TOPIC_PUBLISHED");
      },

      "Image will act as link when ENTER pressed": function() {
         return this.remote.findByCssSelector("body")
            .tabToElement("#IMAGE_CLASS_LINK a")
            .pressKeys(keys.ENTER)
            .end()

         .findByCssSelector("#TDAC .title")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Aikau Unit Tests");
            });
      }
   });
});