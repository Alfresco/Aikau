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
 * This is a unit test for the VerticalReveal widget
 *
 * @author Martin Doyle
 */
define(["intern!object",
      "intern/chai!assert",
      "require",
      "alfresco/TestCommon"
   ],
   function(registerSuite, assert, require, TestCommon) {

      var browser;
      registerSuite({
         name: "VerticalReveal tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/VerticalReveal", "VerticalReveal Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Content is hidden on load": function() {
            return browser.findAllByCssSelector(".alfresco-layout-VerticalReveal .content")
               .getSize()
               .then(function(size) {
                  var contentHeight = (size && size.height) || 0;
                  assert.equal(contentHeight, 0, "Content was visible at page-load");
               });
         },

         "Content is displayed when toggled": function() {
            return browser.findById("TOGGLE_LOGO")
               .click()
               .sleep(1000)
               .end()

            .screenie() // Allow visual checking of content appearing

            .findByCssSelector(".alfresco-layout-VerticalReveal .content")
               .getSize()
               .then(function(size) {
                  assert(size.height > 0, "Content was not revealed on button click");
               });
         },

         "Content is hidden when toggled again": function() {
            return browser.findById("TOGGLE_LOGO")
               .click()
               .sleep(1000)
               .end()

            .screenie() // Allow visual checking of content hiding

            .findByCssSelector(".alfresco-layout-VerticalReveal .content")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, 0, "Content was not hidden on second button click");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      });
   });