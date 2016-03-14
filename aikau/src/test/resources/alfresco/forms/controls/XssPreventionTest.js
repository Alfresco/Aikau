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
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Form Control XSS Prevention Test",
      testPage: "/xss",

      "Test TextBox Value": function() {
         return this.remote.then(() => {
            var notHacked = this.remote.execute("!window.hackedTextBoxValue");
            assert(notHacked, "XSS attack in TextBox value succeeeded");
         });
      },

      "Test RadioButtons Option Label": function() {
         return this.remote.then(() => {
            var notHacked = this.remote.execute("!window.hackedRBOptionLabel");
            assert(notHacked, "XSS attack in RadioButtons option label succeeeded");
         });
      },

      "Test RadioButtons Option Value": function() {
         return this.remote.then(() => {
            var notHacked = this.remote.execute("!window.hackedRBOptionValue");
            assert(notHacked, "XSS attack in RadioButtons option value succeeeded");
         });
      },

      "Test Select Option Label": function() {
         return this.remote.then(() => {
            var notHacked = this.remote.execute("!window.hackedSelectOptionLabel");
            assert(notHacked, "XSS attack in Select option label succeeeded");
         });
      },

      "Test Select Option Value": function() {
         return this.remote.then(() => {
            var notHacked = this.remote.execute("!window.hackedSelectOptionValue");
            assert(notHacked, "XSS attack in Select option value succeeeded");
         });
      },

      "Test ComboBox Option Label": function() {
         return this.remote.then(() => {
            var notHacked = this.remote.execute("!window.hackedSelectOptionLabel");
            assert(notHacked, "XSS attack in ComboBox option label succeeeded");
         });
      },

      "Test ComboBox Option Value": function() {
         return this.remote.then(() => {
            var notHacked = this.remote.execute("!window.hackedComboBoxOptionValue");
            assert(notHacked, "XSS attack in ComboBox option value succeeeded");
         });
      }
   });
});