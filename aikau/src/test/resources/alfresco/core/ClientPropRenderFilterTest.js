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
       "intern/chai!assert",
       "alfresco/TestCommon"], 
       function(module, defineSuite, assert, TestCommon) {

   var testPage = "/ClientPropRenderFilter?property=outerHeight",
      testURL = TestCommon.generateWebscriptUrl(testPage);

   defineSuite(module, {
      name: "RenderFilter Tests (Client Properties)",
      testPage: testPage,

      "LessThan Comparator passes": function() {
         return this.remote.setWindowSize(null, 900, 400)
            .get(testURL)

         .getLastPublish("ALF_WIDGETS_READY")

         .findDisplayedById("BUTTON1");
      },

      "LessThan Comparator passes with item": function() {
         return this.remote.findDisplayedById("BUTTON1WITHITEM");
      },

      "GreaterThan Comparator fails": function() {
         return this.remote.findAllByCssSelector("#BUTTON2")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "GreaterThan Comparator fails with item": function() {
         return this.remote.findAllByCssSelector("#BUTTON2WITHITEM")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "EqualTo Comparator fails": function() {
         return this.remote.findAllByCssSelector("#BUTTON3")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "EqualTo Comparator fails with item": function() {
         return this.remote.findAllByCssSelector("#BUTTON3WITHITEM")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "LessThan Comparator fails (after resize 1)": function() {
         return this.remote.setWindowSize(null, 900, 800)
            .get(testURL)

         .getLastPublish("ALF_WIDGETS_READY")

         .findAllByCssSelector("#BUTTON1")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });

      },

      "LessThan Comparator fails with item (after resize 1)": function() {
         return this.remote.findAllByCssSelector("#BUTTON1WITHITEM")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });

      },

      "GreaterThan Comparator passes (after resize 1)": function() {
         return this.remote.findDisplayedById("BUTTON2");
      },

      "GreaterThan Comparator passes with item (after resize 1)": function() {
         return this.remote.findDisplayedById("BUTTON2WITHITEM");
      },

      "EqualTo Comparator fails (after resize 1)": function() {
         return this.remote.findAllByCssSelector("#BUTTON3")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "EqualTo Comparator fails with item (after resize 1)": function() {
         return this.remote.findAllByCssSelector("#BUTTON3WITHITEM")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "LessThan Comparator fails (after resize 2)": function() {
         return this.remote.setWindowSize(null, 900, 500)
            .get(testURL)

         .getLastPublish("ALF_WIDGETS_READY")

         .findAllByCssSelector("#BUTTON1")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });

      },

      "LessThan Comparator fails with item (after resize 2)": function() {
         return this.remote.findAllByCssSelector("#BUTTON1WITHITEM")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });

      },

      "GreaterThan Comparator fails (after resize 2)": function() {
         return this.remote.findAllByCssSelector("#BUTTON2")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "GreaterThan Comparator fails with item (after resize 2)": function() {
         return this.remote.findAllByCssSelector("#BUTTON2WITHITEM")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "EqualTo Comparator passes (after resize 2)": function() {
         return this.remote.findDisplayedById("BUTTON3");
      },

      "EqualTo Comparator passes with item (after resize 2)": function() {
         return this.remote.findDisplayedById("BUTTON3WITHITEM");
      }
   });
});