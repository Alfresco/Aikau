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
 * This is a unit test for ClassicWindow
 *
 * @author Richard Smith
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Classic Window Tests",
      testPage: "/ClassicWindow",

      "Check the classic windows are present": function() {
         return this.remote.findById("WINDOW1")
            .end()

         .findById("WINDOW2");
      },

      "Check the Classic Windows have appropriate title bars shown": function() {
         return this.remote.findByCssSelector("#WINDOW1 .alfresco-layout-ClassicWindow__titlebar")
            .end()

         .findByCssSelector("#WINDOW2 .alfresco-layout-ClassicWindow__titlebar")
            .then(function() {
                  assert.fail(null, null, "Classic Window 2 should not have a titlebar");
               },
               function() {

               });
      },

      "Check Classic Window 1 has the appropriate title": function() {
         return this.remote.findByCssSelector("#WINDOW1 .alfresco-layout-ClassicWindow__titlebar")
            .getVisibleText()
            .then(function(text) {
               assert.strictEqual(text, "Test title");
            });
      },

      /* global document*/
      "Check for scrollbars on overflow": function() {
         function nodeOverflows(selector) {
            var node = document.querySelector(selector);
            return node.scrollWidth > node.clientWidth;
         }

         return this.remote.execute(nodeOverflows, ["#WINDOW3 .alfresco-layout-ClassicWindow__content"])
            .then(function(overflows) {
               assert.isTrue(overflows, "Scroll bar is not displayed");
            });
         // return this.remote.findByCssSelector("#WINDOW3 .alfresco-layout-ClassicWindow__content")
         //    .then(function(element) {
         //       console.log("Scroll width=" + element.scrollWidth + ", client width=" + element.clientWidth);
         //       assert(element.scrollWidth > element.clientWidth, "Scroll bar is not displayed");
         //    });
      }
   });
});