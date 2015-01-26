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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

   registerSuite({
      name: 'DynamicForm Test',
      'Basic Test': function () {
         var browser = this.remote;
         var testname = "DynamicForm Test";
         return TestCommon.loadTestWebScript(this.remote, "/DynamicForm", testname)

         // 1. Check that the first form has been displayed...
         .findByCssSelector("#Form1_Field")
            .then(null, function() {
               assert(false, "Test #1a - The first form was not displayed");
            })
         .end()
         .findByCssSelector("#Form1_Field .dijitInputContainer input")
            .getProperty('value')
            .then(function(resultText) {
               assert(resultText == "Value1", "Test #1b - The initial value in the first form was not set correctly: " + resultText);
            })
         .end()

         // 2. Post the initially displayed form...
         .findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field1", "Value1"))
            .then(function(elements) {
               assert(elements.length == 1, "Test #2a - first form didn't publish correctly");
            })
         .end()

         // 3. Switch to the other form...
         .findByCssSelector("#FORM_SELECT_SELECT .dijitArrowButtonInner")
            .click()
         .end()
         .findByCssSelector("#FORM_SELECT_SELECT_CONTROL_dropdown table tr:nth-child(2) td.dijitMenuItemLabel")
            .click()
         .end()

         // 4. Check the second form is displayed...
         .findByCssSelector("#Form2_Field")
            .then(null, function() {
               assert(false, "Test #3a - The second form was not displayed");
            })
         .end()
         .findByCssSelector("#Form2_Field .dijitInputContainer input")
            .getProperty('value')
            .then(function(resultText) {
               assert(resultText == "Value2", "Test #3b - The initial value in the second form was not set correctly: " + resultText);
            })
         .end()

         // 5. Post the second form...
         .findByCssSelector(".confirmationButton > span")
            .click()
            .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field2", "Value2"))
            .then(function(elements) {
               assert(elements.length == 1, "Test #4a - second form didn't publish correctly");
            })
         .end()

         .alfPostCoverageResults(browser);
      }
   });
});