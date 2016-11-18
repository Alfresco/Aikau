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
         this.remote.findByCssSelector("#FILTERING_SELECT_1_CONTROL")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "abeecher");
            });
      },

      "Value assigned to form is selected": function() {
         this.remote.findByCssSelector("#FILTERING_SELECT_2_CONTROL")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "abeecher");
            });
      }
   });
});