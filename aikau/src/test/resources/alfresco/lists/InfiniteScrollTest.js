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
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   var countResults = function(browser, expected) {
      browser.findAllByCssSelector(".alfresco-search-AlfSearchResult")
         .then(function(elements) {
            assert(elements.length === expected, "Counting Result, expected: " + expected + ", found: " + elements.length);
         })
      .end();
   };
   var scrollToBottom = function(browser) {
      browser.execute("return window.scrollTo(0,Math.max(document.documentElement.scrollHeight,document.body.scrollHeight,document.documentElement.clientHeight))")
         .sleep(2000)
      .end();
   };
   var scrollToTop = function(browser) {
      browser.execute("return window.scrollTo(0,0)")
         .sleep(2000)
      .end();
   };

registerSuite(function(){
   var browser;

   return {
      name: "Infinite Scroll Tests",
      
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/InfiniteScrollList", "Infinite Scroll Tests").end();
      },
      
      beforeEach: function() {
         browser.end();
      },

      "Trigger Infinite Scroll": function() {
         return browser.sleep(1000)
            // Trigger Infinite Scroll.
            .then(function(){
               scrollToBottom(browser);
               scrollToTop(browser);
               scrollToBottom(browser);
            })

            // Count Results. there should be 50. (Request 2)
            .then(function(){
               countResults(browser, 50);
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});