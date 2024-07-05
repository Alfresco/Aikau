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
      name: "View With No Data Widgets Tests",
      testPage: "/ViewNoDataWidgets",

      "No data widgets displayed": function() {
         return this.remote.findDisplayedById("NO_DATA_WARNING");
      },

      "Render filter in no data display (rule pass)": function() {
         return this.remote.findDisplayedById("LOGO1");
      },

      "Render filter in no data display (rule fail)": function() {
         return this.remote.findAllByCssSelector("#LOGO2")
            .then(function(elements) {
               assert.lengthOf(elements, 0);
            });
      },

      "Data failure widgets displayed": function() {
         return this.remote.findDisplayedById("DATA_FAIL_WARNING");
      }
   });
});