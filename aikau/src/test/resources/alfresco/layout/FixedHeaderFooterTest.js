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
 * This is a unit test for the FixedHeaderFooter widget
 *
 * @author Martin Doyle
 */
define(["intern!object",
      "intern/chai!assert",
      "alfresco/TestCommon"
   ],
   function(registerSuite, assert, TestCommon) {

      var browser;
      registerSuite({
         name: "FixedHeaderFooter tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/FixedHeaderFooter", "FixedHeaderFooter Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Total height is correct": function() {
            return browser.findById("HEADER_FOOTER")
               .getSize()
               .then(function(size) {
                  assert.equal(size.height, 300, "Height not as per widget config");
               });
         },

         "Only content is scrollable": function() {
            function nodeOverflows(selector) {
               var node = document.querySelector(selector);
               return node.scrollHeight > node.offsetHeight;
            }

            return browser.execute(nodeOverflows, ["#HEADER_FOOTER .alfresco-layout-FixedHeaderFooter__header"])
               .then(function(overflows) {
                  assert.isFalse(overflows, "Header is not same height as its content");
               })

            .execute(nodeOverflows, ["#HEADER_FOOTER .alfresco-layout-FixedHeaderFooter__content"])
               .then(function(overflows) {
                  assert.isTrue(overflows, "Content is not overflowing");
               })

            .execute(nodeOverflows, ["#HEADER_FOOTER .alfresco-layout-FixedHeaderFooter__footer"])
               .then(function(overflows) {
                  assert.isFalse(overflows, "Footer is not same height as its content");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      });
   });