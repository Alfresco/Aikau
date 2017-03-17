/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
      name: "HtmlListView Tests",
      testPage: "/HtmlListView",

      "Count the list elements (DEFAULTS)": function() {
         return this.remote.findAllByCssSelector("#DEFAULTS.alfresco-lists-AlfList li")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "Unexpected number of li elements found");
            });
      },

      "Check the properties have been rendered correctly (DEFAULTS)": function() {
         // Just check a couple...
         return this.remote.findByCssSelector("#DEFAULTS.alfresco-lists-AlfList li:nth-child(1)")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "bob", "First item rendered incorrectly");
            })
            .end()
            .findByCssSelector("#DEFAULTS.alfresco-lists-AlfList li:nth-child(4)")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "trevor", "Last item rendered incorrectly");
            });
      },

      "Check that the list style is overridden (DEFAULTS)": function() {
         return this.remote.findAllByCssSelector(".alfresco-lists-AlfList li[style=\"list-style-type:none\"]")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "List style type not overridden");
            });
      },

      "Count the list elements (OVERRIDES)": function() {
         return this.remote.findAllByCssSelector("#OVERRIDES.alfresco-lists-AlfList li")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "Unexpected number of li elements found");
            });
      },

      "Check the properties have been rendered correctly (OVERRIDES)": function() {
         // Just check a couple...
         return this.remote.findByCssSelector("#OVERRIDES.alfresco-lists-AlfList li:nth-child(1)")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "one", "First item rendered incorrectly");
            })
            .end()
            .findByCssSelector("#OVERRIDES.alfresco-lists-AlfList li:nth-child(4)")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "four", "Last item rendered incorrectly");
            });
      },

      "Check that the list style is overridden (OVERRIDES)": function() {
         return this.remote.findAllByCssSelector(".alfresco-lists-AlfList li[style=\"list-style-type:square\"]")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "List style type not overridden");
            });
      }
   });
});