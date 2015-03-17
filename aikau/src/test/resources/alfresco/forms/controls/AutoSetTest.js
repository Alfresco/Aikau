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

   var browser;
   registerSuite({
      name: "Auto Set Form Rules Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AutoSet", "Auto Set Form Rules Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Check the initial post (source field)": function () {
         return browser.findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "source", "1"))
            .then(function(elements) {
               assert(elements.length === 1, "Source field not posted correctly");
            });
      },

      "Check the initial post (target field)": function () {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "target", ""))
            .then(function(elements) {
               assert(elements.length === 1, "Target field not posted correctly");
            });
      },

      "Check the initial post (hidden field)": function () {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "hidden", ""))
            .then(function(elements) {
               assert(elements.length === 1, "Hidden field not posted correctly");
            });
      },

      "Check the initial post (hidden field without auto set config)": function () {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "hidden2", "initial value"))
            .then(function(elements) {
               assert(elements.length === 1, "Second hidden field not posted correctly");
            });
      },

      "Check the updated post (source field)": function () {
         return browser.findByCssSelector("#SOURCE .dijitArrowButtonInner")
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
               assert(elements.length === 1, "Source field not posted correctly");
            });
      },

       "Check the updated post (target field)": function () {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "target", ""))
            .then(function(elements) {
               assert(elements.length === 1, "Target field not posted correctly");
            });
      },

      "Check complex data": function() {
         return browser.findByCssSelector(TestCommon.pubDataNestedValueCssSelector("POST_FORM","something","quite","complex"))
            .then(null, function() {
               assert(false, "Couldn't find complex data in initial form value publication");
            });
      },

      "Check the hidden field is not set and the visible field is": function() {
         // Set the drop-down to 2...
         return browser.findByCssSelector("#SOURCE .dijitArrowButtonInner")
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
               assert(elements.length === 1, "Source field not posted correctly");
            });
      },

      "Check target field": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "target", "Updated"))
            .then(function(elements) {
               assert(elements.length === 1, "Target field not posted correctly");
            });
      },

      "Check hidden field": function() {
         return browser.findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "hidden", ""))
            .then(function(elements) {
               assert(elements.length === 1, "Hidden field not posted correctly");
            });
      },

      "Check that hidden field value can be set by form value update": function() {
         return browser.findByCssSelector("#SET_FORM_VALUE")
            .click()
         .end()
         .findByCssSelector(".confirmationButton > span")
            .click()
         .end()
         .findAllByCssSelector(TestCommon.pubSubDataCssSelector("last", "hidden2", "Value Set"))
            .then(function(elements) {
               assert(elements.length === 1, "Second hidden field not posted correctly");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});