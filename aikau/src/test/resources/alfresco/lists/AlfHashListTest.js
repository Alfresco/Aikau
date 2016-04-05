/*jshint browser:true*/
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
 * HashList test
 *
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["module",
        "alfresco/TestCommon",
        "intern/chai!assert",
        "alfresco/defineSuite"],
        function(module, TestCommon, assert, defineSuite) {

   defineSuite(module, {
      name: "AlfHashList Tests",
      testPage: "/AlfHashList#var1=initial",

      "Test initial load request": function() {
         return this.remote.findByCssSelector("body") // Need to start session
            .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST");
      },

      "Check that default view payload is published correctly": function() {
         return this.remote.findByCssSelector("body") // Need to start session
            .getLastPublish("ALF_DOCLIST_SELECT_VIEW")
            .then(function(payload) {
               assert.propertyVal(payload, "selected", true, "The default view was published incorrectly");
            });
      },

      "Alignment is correct": function() {
         var headingLeft;
         return this.remote.findByCssSelector(".alfresco-html-Heading")
            .getPosition()
            .then(function(pos) {
               headingLeft = pos.x;
            })
            .end()

         .findByCssSelector(".alfresco-lists-views-AlfListView")
            .getPosition()
            .then(function(pos) {
               assert.equal(headingLeft, pos.x);
            });
      },

      "Set hash var that won't trigger reload - type 1": function() {
         return this.remote.findByCssSelector("#SET_HASH1")
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
         return this.remote.findByCssSelector("#SET_HASH2")
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
         return this.remote.findByCssSelector("#SET_HASH3")
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
         return this.remote.findByCssSelector("#SET_HASH4")
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
         var anotherPageUrl = TestCommon.generateWebscriptUrl("/Index"),
            returnUrl = TestCommon.generateWebscriptUrl("/AlfHashList#var1=test1&var2=test2&var3=test3");

         return this.remote.findByCssSelector("body")
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

      "Check overflow on list": function() {
         function nodeOverflows(selector) {
            var node = document.querySelector(selector);
            return node.scrollWidth > node.clientWidth;
         }

         return this.remote.setWindowSize(null, 400, 768)
            .execute(nodeOverflows, ["#HASHLIST1"])
            .then(function(overflows) {
               assert.isTrue(overflows, "Scroll bar is not displayed");
            });
      },

      "Payload Data Loading is prevented when the hash vars are filter out": function() {
         var badUrl = TestCommon.generateWebscriptUrl("/AlfHashListPayloadData#lib=Libraries&path=a/b/c");

         return this.remote.findByCssSelector("body")
            .clearLog()
            .end()

         .get(badUrl)
            .findByCssSelector("body")
            .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.notProperty(payload, "path", "There should be no path value in the payload");
            });
      },

      "Payload Data Loading is successful when the hash vars are not filter out": function() {
         var goodUrl = TestCommon.generateWebscriptUrl("/AlfHashListPayloadData#lib=Personal&path=d/e/f");

         return this.remote.findByCssSelector("body")
            .clearLog()
            .end()

         .get(goodUrl)
            .findByCssSelector("body")
            .end()

         .getLastPublish("ALF_RETRIEVE_DOCUMENTS_REQUEST")
            .then(function(payload) {
               assert.propertyVal(payload, "path", "d/e/f", "Path value incorrect");
            });
      }
   });
});