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
 * @author Martin Doyle
 */
define([
      "alfresco/TestCommon",
      "intern!object",
      "intern/chai!assert"
   ],
   function(TestCommon, registerSuite, assert) {

      registerSuite(function() {
         var browser;

         return {
            name: "Login Form Tests",

            setup: function() {
               browser = this.remote;
               return TestCommon.loadTestWebScript(this.remote, "/Login", "Login Form Tests");
            },

            beforeEach: function() {
               browser.end();
            },

            "Placeholder attribute passed through if supported": function() {
               var placeholderSupported = false;

               return browser.execute(function() {
                     return document.createElement('input').placeholder === "";
                  })
                  .then(function(supported) {
                     placeholderSupported = supported;
                  })
                  .findByCssSelector("#LOGIN_USERNAME .dijitInputField input")
                  .getAttribute("placeholder")
                  .then(function(attrValue) {
                     assert[placeholderSupported ? "equal" : "notEqual"](attrValue, "Username");
                  });
            },

            "Autocomplete attribute passed through": function() {
               return browser.findByCssSelector("#LOGIN_USERNAME .dijitInputField input")
                  .getAttribute("autocomplete")
                  .then(function(attrValue) {
                     assert.equal(attrValue, "username");
                  });
            },

            "Post Coverage Results": function() {
               TestCommon.alfPostCoverageResults(this, browser);
            }
         };
      });
   });