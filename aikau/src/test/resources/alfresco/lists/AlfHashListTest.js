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
 * HashList test
 * 
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["alfresco/TestCommon",
        "intern/chai!assert", 
        "intern!object"], 
        function(TestCommon, assert, registerSuite) {

registerSuite(function(){
   var browser;

   return {
      name: "AlfHashList Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AlfHashList#var1=initial", "AlfHashList Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Test initial load request": function() {
         return browser.findByCssSelector("body") // Need to start session
            .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST");
      },

      "Check that default view payload is published correctly": function() {
         return browser.findByCssSelector("body") // Need to start session
            .getLastPublish("ALF_DOCLIST_SELECT_VIEW")
            .then(function(payload) {
               assert.propertyVal(payload, "selected", true, "The default view was published incorrectly");
            });
      },

      "Set hash var that won't trigger reload - type 1": function() {
         return browser.findByCssSelector("#SET_HASH1")
            .clearLog()
            .click()
            .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")

         .getLastPublish("ALF_HASH_CHANGED")
            .then(function(payload) {
               assert.notProperty(payload, "var1", "The hash was not updated correctly");
               assert.notProperty(payload, "var2", "The hash was not updated correctly");
               assert.propertyVal(payload, "var3", "test3", "The hash was not updated correctly");
            })

         .getAllPublishes("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "Should not publish document request");
            });
      },

      "Set hash var that won't trigger reload - type 2": function() {
         return browser.findByCssSelector("#SET_HASH2")
            .clearLog()
            .click()
            .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")

         .getLastPublish("ALF_HASH_CHANGED")
            .then(function(payload) {
               assert.propertyVal(payload, "var1", "test1", "The hash was not updated correctly");
               assert.notProperty(payload, "var2", "The hash was not updated correctly");
               assert.propertyVal(payload, "var3", "test3", "The hash was not updated correctly");
            })

         .getAllPublishes("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "Should not publish document request");
            });
      },

      "Set hash var that won't trigger reload - type 3": function() {
         return browser.findByCssSelector("#SET_HASH3")
            .clearLog()
            .click()
            .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")

         .getLastPublish("ALF_HASH_CHANGED")
            .then(function(payload) {
               assert.propertyVal(payload, "var1", "test1", "The hash was not updated correctly");
               assert.propertyVal(payload, "var2", "test2", "The hash was not updated correctly");
               assert.propertyVal(payload, "var3", "pickle", "The hash was not updated correctly");
            })

         .getAllPublishes("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payloads) {
               assert.lengthOf(payloads, 0, "Should not publish document request");
            });
      },

      "Set hash var that will trigger reload": function() {
         return browser.findByCssSelector("#SET_HASH4")
            .clearLog()
            .click()
            .end()

         .getLastPublish("ALF_NAVIGATE_TO_PAGE")

         .getLastPublish("ALF_HASH_CHANGED")
            .then(function(payload) {
               assert.propertyVal(payload, "var1", "test1", "The hash was not updated correctly");
               assert.propertyVal(payload, "var2", "test2", "The hash was not updated correctly");
               assert.propertyVal(payload, "var3", "test3", "The hash was not updated correctly");
            })

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST");
      },

      "Navigating to another page and then back will re-apply hash": function() {
         var anotherPageUrl = TestCommon.testWebScriptURL("/Index"),
            returnUrl = TestCommon.testWebScriptURL("/AlfHashList#var1=test1&var2=test2&var3=test3");
         return browser.findByCssSelector("body")
            .clearLog()
            .end()

         .get(anotherPageUrl)
            .findByCssSelector("body")
            .end()

         .get(returnUrl)
            .findByCssSelector("body")
            .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "var1", "test1", "Hash not read and used correctly");
               assert.propertyVal(payload, "var2", "test2", "Hash not read and used correctly");
               assert.notProperty(payload, "var3", "Hash not read and used correctly");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});