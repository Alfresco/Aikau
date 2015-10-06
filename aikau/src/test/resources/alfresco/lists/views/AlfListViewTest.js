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
      "intern/chai!assert",
      "intern!object"
   ],
   function(TestCommon, assert, registerSuite) {

registerSuite(function(){
   var browser;

   return {
         name: "AlfListView Tests",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/AlfListView", "AlfListView Tests").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Can find loading message": function() {
            return browser.findByCssSelector("#LOADING .alfresco-lists-AlfList > .data-loading");
         },

         "Can find data-load failure message": function() {
            return browser.findByCssSelector("#DATA_LOAD_FAILURE .alfresco-lists-AlfList > .data-failure");
         },

         "Can find no-data message": function() {
            return browser.findByCssSelector("#NO_DATA .alfresco-lists-views-AlfListView__no-data");
         },

         "Can find render-error message": function() {
            return browser.findByCssSelector("#ERROR .alfresco-lists-views-AlfListView__render-error");
         },

         "Can find successfully loaded list": function() {
            return browser.findAllByCssSelector("#SUCCESS .alfresco-renderers-Property")
               .then(function(elements) {
                  assert.lengthOf(elements, 4, "Did not render four list items successfully");
               });
         },

         "Post Coverage Results": function() {
            TestCommon.alfPostCoverageResults(this, browser);
         }
      };
      });
   });