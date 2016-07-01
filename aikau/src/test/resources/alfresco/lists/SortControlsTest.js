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
      name: "Sort Controlb Tests",
      testPage: "/SortControls",

      "Check initial sort parameters": function() {
         return this.remote.getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "sortField", "index");
               assert.propertyVal(payload, "sortAscending", true);
            });
      },

      "Toggle sort order": function() {
         return this.remote.findDisplayedByCssSelector("#SORT_ORDER_TOGGLE img.alf-sort-ascending-icon")
            .clearLog()
            .click()
         .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "sortAscending", false);
            });
      },

      "Change sort field": function() {
         return this.remote.findDisplayedByCssSelector("#SORT_FIELD_SELECT_text")
            .click()
         .end()

         .findDisplayedByCssSelector("#SORT_BY_NAME_text")
            .clearLog()
            .click()
         .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "sortField", "name");
            });
      }
   });
});