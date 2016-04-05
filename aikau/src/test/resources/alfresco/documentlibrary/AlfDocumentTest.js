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
        "alfresco/defineSuite"],
        function(module, defineSuite) {

   defineSuite(module, {
      name: "AlfDocument Tests",
      testPage: "/AlfDocument",

      // See AKU-656 for the reasons for these tests...
      "First document loads data": function() {
         return this.remote.findById("PROPERTYLINK");
      },

      "Click first document property to populate second document": function() {
         return this.remote.findByCssSelector("#PROPERTYLINK .value")
            .click()
            .end()

         .findById("PROPERTY");
      }
   });
});