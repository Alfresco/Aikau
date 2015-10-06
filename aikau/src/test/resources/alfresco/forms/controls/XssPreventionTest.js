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
 * 
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Form Control XSS Prevention Test",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/xss", "Form Control XSS Prevention Test").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },
      
     "Test TextBox Value": function () {
        return browser.then(function(){
            var notHacked = browser.execute("!window.hackedTextBoxValue");
            assert(notHacked, "XSS attack in TextBox value succeeeded");
         });
      },
      
      "Test RadioButtons Option Label": function () {
         return browser.then(function(){
            var notHacked = browser.execute("!window.hackedRBOptionLabel");
            assert(notHacked, "XSS attack in RadioButtons option label succeeeded");
         });
      },

      "Test RadioButtons Option Value": function () {
         return browser.then(function(){
            var notHacked = browser.execute("!window.hackedRBOptionValue");
            assert(notHacked, "XSS attack in RadioButtons option value succeeeded");
         });
      },

      "Test Select Option Label": function () {
         return browser.then(function(){
            var notHacked = browser.execute("!window.hackedSelectOptionLabel");
            assert(notHacked, "XSS attack in Select option label succeeeded");
         });
      },

      "Test Select Option Value": function () {
         return browser.then(function(){
            var notHacked = browser.execute("!window.hackedSelectOptionValue");
            assert(notHacked, "XSS attack in Select option value succeeeded");
         });
      },

      "Test ComboBox Option Label": function () {
         return browser.then(function(){
            var notHacked = browser.execute("!window.hackedSelectOptionLabel");
            assert(notHacked, "XSS attack in ComboBox option label succeeeded");
         });
      },

      "Test ComboBox Option Value": function () {
         return browser.then(function(){
            var notHacked = browser.execute("!window.hackedComboBoxOptionValue");
            assert(notHacked, "XSS attack in ComboBox option value succeeeded");
         });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});