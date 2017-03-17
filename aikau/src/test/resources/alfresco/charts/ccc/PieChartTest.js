/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * @author Erik Winlöf
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "PieChart Tests",
      testPage: "/PieChart",

      "Check pie slices": function() {
         // Test #1
         // Check pie slices
         return this.remote.findAllByCssSelector("#PIECHART_1 svg text")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Expected to find 2 items in the chart, but found " + elements.length);
            });
      },

      "Check label 1": function() {
         // Test #2
         // Check labels
         return this.remote.findByCssSelector("#PIECHART_1 svg g g g g g:nth-child(2) text")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "one-hundred-100", "Expected to find label 'one-hundred-100', but found '" + text + "'");
            });
      },

      "Check label 2": function() {
         // Test #3
         // Check labels
         return this.remote.findByCssSelector("#PIECHART_1 svg g g g g g:nth-child(4) text")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "two-hundred-200", "Expected to find label 'two-hundred-200', but found '" + text + "'");
            });
      }
   });
});