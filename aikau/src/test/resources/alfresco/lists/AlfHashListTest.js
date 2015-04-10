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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"], 
        function (registerSuite, assert, require, TestCommon) {

   var browser;
   registerSuite({
      name: "AlfHashList Tests",
      
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfHashList#var1=initial", "AlfHashList Tests").end();
      },
      
      beforeEach: function() {
         browser.end();
      },
      
      "Test initial load request": function() {
         return browser.findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_RETRIEVE_DOCUMENTS_REQUEST", "var1", "initial"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "Found the initial data request");
            });
      },

      "Set hash var that won't trigger reload": function() {
         return browser.findByCssSelector("#SET_HASH1_label")
            .click()
         .end()
         // Check that the hash change topic is last, not a request to load data...
         .findByCssSelector(TestCommon.topicSelector("ALF_HASH_CHANGED", "publish", "last"))
         .end()
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_HASH_CHANGED", "var3", "test3"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The hash was not updated correctly");
            });
      },

      "Set hash var that will trigger reload": function() {
         return browser.findByCssSelector("#SET_HASH2_label")
            .click()
         .end()
         .findByCssSelector(TestCommon.topicSelector("ALF_RETRIEVE_DOCUMENTS_REQUEST", "publish", "last"))
         .end()
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_RETRIEVE_DOCUMENTS_REQUEST", "var1", "test1"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The request did not include the mapped hash data for 'var1'");
            })
         .end()
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_RETRIEVE_DOCUMENTS_REQUEST", "var2", "test2"))
            .then(function(elements) {
               assert.lengthOf(elements, 1, "The request did not include the mapped hash data for 'var2'");
            })
         .end()
         .findAllByCssSelector(TestCommon.pubDataCssSelector("ALF_RETRIEVE_DOCUMENTS_REQUEST", "var3", "test3"))
            .then(function(elements) {
               assert.lengthOf(elements, 0, "The request should not have included hash data for 'var3'");
            })
         .end();
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   });
});