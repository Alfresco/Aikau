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
define([
      "alfresco/TestCommon",
      "intern!object",
      "intern/chai!assert"
   ],
   function(TestCommon, registerSuite, assert) {

      registerSuite(function() {
         var browser;

         return {
            name: "URL Utils Test",

            setup: function() {
               browser = this.remote;
               return TestCommon.loadTestWebScript(this.remote, "/Index", "Hash Utils Test").end();
            },

            beforeEach: function() {
               browser.end();
            },

            "updateHash doesn't double-encode": function() {
               return browser.executeAsync(function(callback) {
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
         };
      });
   });