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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!expect",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"], 
        function (registerSuite, expect, assert, require, TestCommon, keys) {

registerSuite(function(){
   var browser;

   return {
      name: "SingleTextFieldForm Tests",
      
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/SingleTextFieldForm#search=bob", "SingleTextFieldForm Tests").end();
      },
      
      beforeEach: function() {
         browser.end();
      },
      
      // teardown: function() {
      //    return browser.end().alfPostCoverageResults(browser);
      // },
      
      "Test hash doesn't set value in first form": function () {
         // The first form is configured to not update values from the browser hash fragment, so the
         // initial URL shouldn't set a value...
         return browser.findByCssSelector("#STFF1 .dijitInputContainer > input")
            .getProperty("value")
            .then(function(value) {
               assert(value === "", "The value of the first form was set with: " + value);
            });
      },
      
      "Test hash sets value in second form": function () {
         // The second form is configured to update values from the browser hash fragment, so the
         // initial URL should be set to "bob" (the value of "search" in the hash fragment)...
         return browser.findByCssSelector("#STFF2 .dijitInputContainer > input")
            .getProperty("value")
            .then(function(value) {
               assert(value === "bob", "The value of the first form was set with: " + value);
            });
      },
      
      "Test form can't be submitted without field value": function() {
         return browser.findByCssSelector("#STFF1 .dijitInputContainer input")
            .pressKeys(keys.RETURN)
         .end()
         .findAllByCssSelector(TestCommon.topicSelector("TEST_PUBLISH", "publish", "any"))
            .then(function(elements) {
               assert(elements.length === 0, "Enter key submitted data on empty field");
            });
      },
      
      "Test form can be submitted with field value": function() {
         return browser.findByCssSelector("#STFF1 .dijitInputContainer input")
            .type("test")
            .pressKeys(keys.RETURN)
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("any", "search", "test"))
            .then(function(elements) {
               assert(elements.length === 1, "Enter key doesn't submit data");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});