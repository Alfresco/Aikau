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
        "alfresco/TestCommon"], 
        function (registerSuite, expect, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "DynamicForm Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DynamicForm", "DynamicForm Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },
      
     "Test first form displayed": function () {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/DynamicForm", "DynamicForm Test").findByCssSelector("#Form1_Field")
            .then(null, function() {
               assert(false, "The first form was not displayed");
            });
      },
      
      "Test initial value in first form set correctly": function() {
         this.remote.findByCssSelector("#Form1_Field .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert(resultText === "Value1", "The initial value in the first form was not set correctly: " + resultText);
            });
      },
      
      "Test first form post values": function() {
         this.remote.findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field1", "Value1"))
            .then(function(elements) {
               assert(elements.length === 1, "First form didn't publish correctly");
            });
      },
      
      "Test second form displays": function() {
         this.remote.findByCssSelector("#FORM_SELECT_SELECT .dijitArrowButtonInner")
            .click()
         .end()
         .findByCssSelector("#FORM_SELECT_SELECT_CONTROL_dropdown table tr:nth-child(2) td.dijitMenuItemLabel")
            .click()
         .end()
         .findByCssSelector("#Form2_Field")
            .then(null, function() {
               assert(false, "The second form was not displayed");
            });
      },
      
      "Test initial value in second form set correctly": function() {
         this.remote.findByCssSelector("#Form2_Field .dijitInputContainer input")
            .getProperty("value")
            .then(function(resultText) {
               assert(resultText === "Value2", "The initial value in the second form was not set correctly: " + resultText);
            });
      },
      
      "Test second form post values": function() {
         this.remote.findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "field2", "Value2"))
            .then(function(elements) {
               assert(elements.length === 1, "Second form didn't publish correctly");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});