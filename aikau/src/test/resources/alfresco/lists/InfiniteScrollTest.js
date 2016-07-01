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
               scrollToTop(this.remote);
            })
            
            .findAllByCssSelector(".alfresco-renderers-Property")
               .then(function(elements) {
                  assert.lengthOf(elements, 50);
               });
      },

      "Simulate requests in progress, trigger infinite scroll": function() {
         return this.remote.sleep(1000).findByCssSelector("#SIMULATE_REQUEST_IN_PROGRESS_label")
            .click()
         .end()

         .then(() => {
               scrollToBottom(this.remote);
               scrollToTop(this.remote);
               scrollToBottom(this.remote);
               scrollToTop(this.remote);
            })

            .findAllByCssSelector(".alfresco-renderers-Property")
               .then(function(elements) {
                  assert.lengthOf(elements, 50);
               });

      }
   });
});