/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 */
define(["intern!object",
   "intern/chai!assert",
   "require",
   "alfresco/TestCommon",
   "intern/dojo/node!leadfoot/keys"],
      function (registerSuite, assert, require, TestCommon, keys) {

         registerSuite({
            name: 'PieChart Test',
            'alfresco/charts/ccc/PieChart': function () {

               var browser = this.remote;
               var testName = "Pie Chart Test";
               return TestCommon.loadTestWebScript(this.remote, "/PieChart", testName)

                  // Test #1
                  // Check pie slices
                  .findAllByCssSelector("#PIECHART_1 svg text")
                     .then(function(elements) {
                        assert(elements.length == 2, "Expected to find 2 items in the chart, but found " + elements.length);
                     })
                  .end()

                  // Test #2
                  // Check labels
                  .findByCssSelector("#PIECHART_1 svg g g g g g:nth-child(2) text")
                     .getVisibleText()
                     .then(function(text) {
                        assert(text == "one-hundred-100", "Expected to find label 'one-hundred-100', but found '" + text + "'");
                     })
                  .end()

                  // Test #3
                  // Check labels
                  .findByCssSelector("#PIECHART_1 svg g g g g g:nth-child(4) text")
                     .getVisibleText()
                     .then(function(text) {
                        assert(text == "two-hundred-200", "Expected to find label 'two-hundred-200', but found '" + text + "'");
                     })
                  .end()
                  
                  .alfPostCoverageResults(browser);
            }
         });
      });