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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, assert, require, TestCommon, keys) {

   registerSuite({
      name: 'Auto Set Form Rules Test',
      'Basic Test': function () {

         var browser = this.remote;
         var testName = "Auto Set Form Rules Test";
         return TestCommon.loadTestWebScript(this.remote, "/AutoSet", testName)

            // Post the form, check the initial results...
            .findByCssSelector(".confirmationButton > span")
               .click()
               .end()
            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "source", "1"))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #1a - source field not posted correctly");
               })
               .end()
            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "target", ""))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #1b - target field not posted correctly");
               })
               .end()
            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "hidden", ""))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #1c - hidden field not posted correctly");
               })
               .end()

            // Set the drop-down to 2...
            .findByCssSelector("#SOURCE .dijitArrowButtonInner")
               .click()
               .end()
            .findByCssSelector("#SOURCE_CONTROL_dropdown table tr:nth-child(2) td.dijitMenuItemLabel")
               .click()
               .end()

            // Post the form, check the hidden field is set and the visible field isn't
            .findByCssSelector(".confirmationButton > span")
               .click()
               .end()
            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "source", "2"))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #2a - source field not posted correctly");
               })
               .end()
            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "target", ""))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #2b - target field not posted correctly");
               })
               .end()
            .findByCssSelector(TestCommon.pubDataNestedValueCssSelector("POST_FORM","something","quite","complex"))
               .then(null, function() {
                  assert(false, "Test #2c - Couldn't find complex data in initial form value publication");
               })
               .end()

            // Set the drop-down to 2...
            .findByCssSelector("#SOURCE .dijitArrowButtonInner")
               .click()
               .end()
            .findByCssSelector("#SOURCE_CONTROL_dropdown table tr:nth-child(2) td.dijitMenuItemLabel")
               .click()
               .end()

            // Set the drop-down to 3...
            .findByCssSelector("#SOURCE .dijitArrowButtonInner")
               .click()
               .end()
            .findByCssSelector("#SOURCE_CONTROL_dropdown table tr:nth-child(3) td.dijitMenuItemLabel")
               .click()
               .end()

            // Post the form, check the hidden field is not set and the visible field is...
            .findByCssSelector(".confirmationButton > span")
               .click()
               .end()
            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "source", "3"))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #3a - source field not posted correctly");
               })
               .end()
            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "target", "Updated"))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #3b - target field not posted correctly");
               })
               .end()
            .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "hidden", ""))
               .then(function(elements) {
                  assert(elements.length == 1, "Test #3c - hidden field not posted correctly");
               })
               .end()

            .alfPostCoverageResults(browser);
      }
   });
});