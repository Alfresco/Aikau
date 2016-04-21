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
 * @author Martin Doyle
 */
define(["module",
        "alfresco/TestCommon",
        "intern/chai!assert",
        "alfresco/defineSuite"],
        function(module, TestCommon, assert, defineSuite) {

   defineSuite(module, {
      name: "AlfListView Tests",
      testPage: "/AlfListView",

      "Can find data-load failure message": function() {
         return this.remote.findByCssSelector("#DATA_LOAD_FAILURE .alfresco-lists-AlfList > .data-failure");
      },

      "Can find no-data message": function() {
         return this.remote.findByCssSelector("#NO_DATA .alfresco-lists-views-AlfListView__no-data");
      },

      "Can find render-error message": function() {
         return this.remote.findByCssSelector("#ERROR .alfresco-lists-views-AlfListView__render-error");
      },

      "Can find successfully loaded list": function() {
         return this.remote.findAllByCssSelector("#SUCCESS .alfresco-renderers-Property")
            .then(function(elements) {
               assert.lengthOf(elements, 4, "Did not render four list items successfully");
            });
      },

      // See AKU-933
      "List modifiers work": function() {
         return this.remote.findByCssSelector("#PROPERTY_ITEM_0 span.value")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Tinky Winky");
            });
      }
   });
});