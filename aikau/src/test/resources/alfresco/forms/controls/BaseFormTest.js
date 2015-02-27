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
 * This is a unit test for AlfTabContainer
 * 
 * @author Richard Smith
 */
define(["intern!object",
        "intern/chai!expect",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, expect, require, TestCommon) {

   var browser;
   registerSuite({
      name: "Base Form Control Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/BaseForm", "Base Form Control Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      // teardown: function() {
      //    browser.end();
      // },

      "Checking the form field is empty (1)": function () {
         return browser.findByCssSelector("div#FORM_FIELD div.control input[name='control']")
            .getProperty("value")
            .then(function(val){
               expect(val).to.equal("", "The form field should be empty");
            });
      },

      "Checking the form field is empty (2)": function() {
         return browser.findById("SET_FORM_VALUE_1")
            .click()
         .end()

         .findByCssSelector("div#FORM_FIELD div.control input[name=\"control\"]")
            .getProperty("value")
            .then(function(val){
               expect(val).to.equal("", "The form field should be empty");
            });
      },

      "Checking the form field is empty (3)": function() {
         return browser.findById("SET_FORM_VALUE_2")
            .click()
         .end()

         .findByCssSelector("div#FORM_FIELD div.control input[name=\"control\"]")
            .getProperty("value")
            .then(function(val){
               expect(val).to.equal("", "The form field should be empty");
            });
      },

      "Checking the form field now contains 'this is the new value'": function() {
         return browser.findById("SET_FORM_VALUE_3")
            .click()
         .end()

         .findByCssSelector("div#FORM_FIELD div.control input[name=\"control\"]")
            .getProperty("value")
            .then(function(val){
               expect(val).to.equal("this is the new value", "The form field should now contain 'this is the new value'");
            });
      },

      "Checking the form field now contains '3.14159265'": function() {
         return browser.findById("SET_FORM_VALUE_4")
            .click()
         .end()

         .findByCssSelector("div#FORM_FIELD div.control input[name=\"control\"]")
            .getProperty("value")
            .then(function(val){
               expect(val).to.equal("3.14159265", "The form field should now contain '3.14159265'");
            });
      },

      "Checking the form field now contains 'true'": function() {
         return browser.findById("SET_FORM_VALUE_5")
            .click()
         .end()

         .findByCssSelector("div#FORM_FIELD div.control input[name=\"control\"]")
            .getProperty("value")
            .then(function(val){
               expect(val).to.equal("true", "The form field should now contain 'true'");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});