/*jshint browser:true*/
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
 * @author Martin Doyle
 */
define(["module",
        "alfresco/TestCommon",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, TestCommon, defineSuite, assert) {

   defineSuite(module, {
      name: "Login Form Tests",
      testPage: "/Login",

      "Placeholder attribute passed through if supported": function() {
         var placeholderSupported = false;

         return this.remote.execute(function() {
               return document.createElement("input").placeholder === "";
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
         return this.remote.findByCssSelector("#LOGIN_USERNAME .dijitInputField input")
            .getAttribute("autocomplete")
            .then(function(attrValue) {
               assert.equal(attrValue, "username");
            });
      }
   });
});