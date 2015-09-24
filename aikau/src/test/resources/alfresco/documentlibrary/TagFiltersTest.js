/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
define(["alfresco/TestCommon",
      "intern!object",
      "intern/chai!assert"
   ],
   function(TestCommon, registerSuite, assert) {

      registerSuite(function() {
         var browser;

         return {
            name: "TagFilters Tests",

            setup: function() {
               browser = this.remote;
               return TestCommon.loadTestWebScript(this.remote, "/TagFilters", "TagFilters Tests");
            },

            "Can retrieve tags in unscoped context": function() {
               return browser.findAllByCssSelector("#TAG_FILTERS .alfresco-documentlibrary-AlfDocumentFilter")
                  .then(function(elements) {
                     assert.lengthOf(elements, 9);
                  });
            },

            "Can retrieve tags in scoped context": function() {
               return browser.findAllByCssSelector("#SCOPED_TAG_FILTERS .alfresco-documentlibrary-AlfDocumentFilter")
                  .then(function(elements) {
                     assert.lengthOf(elements, 9);
                  });
            },

            beforeEach: function() {
               browser.end();
            },

            "Post Coverage Results": function() {
               TestCommon.alfPostCoverageResults(this, browser);
            }
         };
      });
   });