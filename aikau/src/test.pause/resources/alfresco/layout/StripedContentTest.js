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
 * This is a unit test for the StripedContent widget
 *
 * @author Martin Doyle
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "StripedContent tests",
      testPage: "/StripedContent",

      "Content is rendered on load": function() {
         return this.remote.findByCssSelector(".alfresco-layout-StripedContent")
            .getVisibleText()
            .then(function(text) {
               assert.include(text, "This is the sub-header", "Sub-header content not rendered on page-load");
               assert.include(text, "This is the menu row", "Menu row content not rendered on page-load");
               assert.include(text, "Content goes here...", "Main content row not rendered on page-load");
            });
      },

      "Logo is rendered on load": function() {
         return this.remote.findByCssSelector(".alfresco-logo-Logo")
            .isDisplayed()
            .then(function(isDisplayed) {
               assert(isDisplayed, "Logo was not visible");
            });
      },

      "Elements all rendered in correct order": function() {
         var lastTop = 0;
         return this.remote.findByCssSelector(".alfresco-logo-Logo")
            .getPosition()
            .then(function(pos) {
               assert(lastTop < (lastTop = pos.y), "Logo was not below top of page");
            })
            .end()

         .findAllByCssSelector(".alfresco-html-Label")
            .then(function(elements) {
               elements[0].getPosition()
                  .then(function(pos) {
                     assert(lastTop < (lastTop = pos.y), "Sub-header was not below logo");
                  });

               elements[1].getPosition()
                  .then(function(pos) {
                     assert(lastTop < (lastTop = pos.y), "Menu row was not below sub-header");
                  });

               return elements[2].getPosition()
                  .then(function(pos) {
                     assert(lastTop < (lastTop = pos.y), "Main content was not below menu row");
                  });
            });
      }
   });
});