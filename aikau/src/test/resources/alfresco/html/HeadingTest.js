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
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {
   defineSuite(module, {
      name: "Heading Tests",
      testPage: "/Heading",

      "Test header is translated": function() {
         return this.remote.findAllByCssSelector("#HEADING1 > h1")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Heading Test");
            });
      },

      "Test XSS and level": function() {
         return this.remote.findAllByCssSelector("#HEADING2 > h4")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "<img src='1' onerror='window.hacked=true>");
            });
      },

      "Test update heading label": function() {
         return this.remote.findAllByCssSelector("#HEADING3 > h1")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "BEFORE PUBLISH LABEL", "Heading was not correct before update");
            })
            .end()

         .findById("TEST_BUTTON")
            .click()
            .end()

         .findAllByCssSelector("#HEADING3 > h1")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "AFTER PUBLISH LABEL", "Heading was not correct after update");
            });
      }
   });
});