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
 *
 * @author Martin Doyle
 */
define(["module",
        "alfresco/TestCommon",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, TestCommon, defineSuite, assert) {

   defineSuite(module, {
      name: "TextArea Tests",
      testPage: "/TextArea",

      "Label is rendered correctly": function() {
         return this.remote.findByCssSelector("#BASIC_TEXTAREA .label")
            .getVisibleText()
            .then(function(visibleText) {
               assert.equal(visibleText, "Basic textarea");
            });
      },

      "Rows/cols are set correctly": function() {
         return this.remote.findByCssSelector("#SIZED_TEXTAREA textarea")
            .getProperty("rows")
            .then(function(rows) {
               assert.equal(rows, 3);
            })
            .getProperty("cols")
            .then(function(cols) {
               assert.equal(cols, 100);
            });
      },

      "Initial value is set correctly": function() {
         return this.remote.findByCssSelector("#TEXTAREA_WITH_CONTENT textarea")
            .getProperty("value")
            .then(function(value) {
               assert.equal(value, "A some arguable jeepers cheerful pled impalpable yikes nosily however irresolute so tortoise amphibious.");
            });
      },

      "Correct font is used": function() {
         return this.remote.findByCssSelector("#TEXTAREA_WITH_CONTENT textarea")
            .getComputedStyle("fontFamily")
            .then(function(fontFamily) {
               assert.include(fontFamily, "Open Sans");
            })
            .getComputedStyle("fontSize")
            .then(function(fontSize) {
               assert.equal(fontSize, "13px");
            });
      }
   });
});