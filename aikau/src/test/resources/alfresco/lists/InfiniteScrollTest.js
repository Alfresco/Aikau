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

   defineSuite(module, {
      name: "Infinite Scroll Tests",
      testPage: "/InfiniteScrollList",

      "Trigger Infinite Scroll": function() {
         return this.remote.sleep(1000)
            // Trigger Infinite Scroll.
            .then(() => {
               scrollToBottom(this.remote);
               scrollToTop(this.remote);
               scrollToBottom(this.remote);
            })

         // Count Results. there should be 50. (Request 2)
         .then(() => {
            countResults(this.remote, 50);
         });
      }
   });
});