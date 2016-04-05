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

   defineSuite(module, {
      name: "Row Tests",
      testPage: "/Row",

      "Test that row has additional CSS classes": function() {
         return this.remote.findAllByCssSelector("tr.extra")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Additional CSS classes not applied correctly");
            });
      },

      "Test colspan can be set on cell": function() {
         return this.remote.findByCssSelector("#CELL3_ITEM_0")
            .getAttribute("colspan")
            .then(function(colspan) {
               assert.equal(colspan, 2, "Colspan attribute not set on cell");
            });
      },

      "Check focus hightlighing": function() {
         // See AKU-498 - There are two rows, but only one of them should highlight when focused
         return this.remote.findById("CELL1_ITEM_0")
            .click()
            .end()
            .findAllByCssSelector(".alfresco-lists-views-layout-_MultiItemRendererMixin__item--focusHighlighting")
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The row did not have the focus class");
            });
      }
   });
});