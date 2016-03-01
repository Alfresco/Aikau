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
define(["intern!object",
        "intern/chai!assert",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, TestCommon) {

   registerSuite(function(){
      var browser;

      return {
         name: "RenderFilter Tests (Client Properties)",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/ClientPropRenderFilter?property=outerHeight", "RenderFilter Tests (Client Properties)")
               .end();
         },

         beforeEach: function() {
            browser.end();
         },

         "LessThan Comparator passes": function() {
            return browser.setWindowSize(null, 900, 400).refresh()
                  
               .getLastPublish("ALF_WIDGETS_READY")

               .findDisplayedById("BUTTON1");
         },

         "LessThan Comparator passes with item": function() {
            return browser.findDisplayedById("BUTTON1WITHITEM");
         },

         "GreaterThan Comparator fails": function() {
            return browser.findAllByCssSelector("#BUTTON2")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
         },

         "GreaterThan Comparator fails with item": function() {
            return browser.findAllByCssSelector("#BUTTON2WITHITEM")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
         },

         "EqualTo Comparator fails": function() {
            return browser.findAllByCssSelector("#BUTTON3")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
         },

         "EqualTo Comparator fails with item": function() {
            return browser.findAllByCssSelector("#BUTTON3WITHITEM")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
         },

         "Post Coverage Results (1)": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         },

         "LessThan Comparator fails (after resize 1)": function() {
            return browser.setWindowSize(null, 900, 800).refresh()
                  
               .getLastPublish("ALF_WIDGETS_READY")

               .findAllByCssSelector("#BUTTON1")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
            
         },

         "LessThan Comparator fails with item (after resize 1)": function() {
            return browser.findAllByCssSelector("#BUTTON1WITHITEM")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
            
         },

         "GreaterThan Comparator passes (after resize 1)": function() {
            return browser.findDisplayedById("BUTTON2");
         },

         "GreaterThan Comparator passes with item (after resize 1)": function() {
            return browser.findDisplayedById("BUTTON2WITHITEM");
         },

         "EqualTo Comparator fails (after resize 1)": function() {
            return browser.findAllByCssSelector("#BUTTON3")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
         },

         "EqualTo Comparator fails with item (after resize 1)": function() {
            return browser.findAllByCssSelector("#BUTTON3WITHITEM")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
         },

         "Post Coverage Results (2)": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         },

         "LessThan Comparator fails (after resize 2)": function() {
            return browser.setWindowSize(null, 900, 500).refresh()
                  
               .getLastPublish("ALF_WIDGETS_READY")

               .findAllByCssSelector("#BUTTON1")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
            
         },

         "LessThan Comparator fails with item (after resize 2)": function() {
            return browser.findAllByCssSelector("#BUTTON1WITHITEM")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
            
         },

         "GreaterThan Comparator fails (after resize 2)": function() {
            return browser.findAllByCssSelector("#BUTTON2")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
         },

         "GreaterThan Comparator fails with item (after resize 2)": function() {
            return browser.findAllByCssSelector("#BUTTON2WITHITEM")
               .then(function(elements) {
                  assert.lengthOf(elements, 0);
               });
         },

         "EqualTo Comparator passes (after resize 2)": function() {
            return browser.findDisplayedById("BUTTON3");
         },

         "EqualTo Comparator passes with item (after resize 2)": function() {
            return browser.findDisplayedById("BUTTON3WITHITEM");
         },

         "Post Coverage Results (3)": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
   });
});