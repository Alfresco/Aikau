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
 * This tests the FilteringSelect control.
 * 
 * @author Martin Doyle
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "FilteringSelect Tests",
      testPage: "/FilteringSelect",

      "Only one XHR request should be made for each control": function() {
         return this.remote.getXhrEntries({ method: "GET" })
            .then(function(entries) {
               assert.lengthOf(entries, 3);
            });
      },

      "Value assigned to control is selected": function() {
         return this.remote.findByCssSelector("#FILTERING_SELECT_1_CONTROL")
            .getProperty("value")
            .then(function(text) {
               assert.equal(text, "abeecher");
            });
      },

      "Value assigned to form is selected": function() {
         return this.remote.findByCssSelector("#FILTERING_SELECT_2_CONTROL")
            .getProperty("value")
            .then(function(text) {
               assert.equal(text, "abeecher");
            });
      },

      "Only value matched options are shown": function() {
         return this.remote.findByCssSelector("#widget_FILTERING_SELECT_1_CONTROL .dijitArrowButton")
            .click()
         .end()

         .findDisplayedByCssSelector("#FILTERING_SELECT_1_CONTROL_popup")
         .end()

         .findAllByCssSelector("#FILTERING_SELECT_1_CONTROL_popup .dijitMenuItem")
            .then(function(elements) {
               assert.lengthOf(elements, 3); // NOTE including previous and next items!
            });
      },

      "All options are shown": function() {
         return this.remote.findByCssSelector("#widget_FILTERING_SELECT_2_CONTROL .dijitArrowButton")
            .click()
         .end()

         .findDisplayedByCssSelector("#FILTERING_SELECT_2_CONTROL_popup")
         .end()

         .findAllByCssSelector("#FILTERING_SELECT_2_CONTROL_popup .dijitMenuItem")
            .then(function(elements) {
               assert.lengthOf(elements, 8); // NOTE including previous and next items!
            });
      }
   });
});