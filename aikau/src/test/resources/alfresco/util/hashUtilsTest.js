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
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, TestCommon, defineSuite, assert) {

   defineSuite(module, {
      name: "URL Utils Test",
      testPage: "/Index",

      "updateHash doesn't double-encode": function() {
         return this.remote.executeAsync(function(callback) {
               require(["alfresco/util/hashUtils"], function(hashUtils) {
                  hashUtils.updateHash({
                     myvar: "Something with a space in it"
                  });
                  callback();
               });
            })
            .getCurrentUrl()
            .then(function(currentUrl) {
               assert.include(currentUrl, "#myvar=Something%20with%20a%20space%20in%20it");
            });
      }
   });
});