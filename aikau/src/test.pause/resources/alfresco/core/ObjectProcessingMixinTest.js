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
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "ObjectProcessingMixin Tests",
      testPage: "/ObjectProcessingMixin#hashName=hashValue",

      "Trying to process a recursive object succeeds and can be used as payload": function() {
         return this.remote.findById("PROCESS_RECURSIVE")
            .clearLog()
            .click()
            .end()

         .getLastPublish("GENERATED", true)
            .then(function(payload) {
               assert.deepPropertyVal(payload, "obj1.obj2", "[recursive object]");
            });
      },

      "Array inside item remains array when published": function() {
         return this.remote.findById("PROCESS_ARRAY")
            .clearLog()
            .click()
            .end()

         .getLastPublish("GENERATED", true)
            .then(function(payload) {
               assert.sameMembers(payload.val, ["A", "B", "C"]);
            });
      },

      "Nested array inside item remains array when published": function() {
         return this.remote.findById("PROCESS_NESTED_ARRAY")
            .clearLog()
            .click()
            .end()

         .getLastPublish("GENERATED", true)
            .then(function(payload) {
               assert.sameMembers(payload.val, ["A", "B", "C"]);
            });
      },

      "Can use 'processHashTokens' successfully": function() {
         return this.remote.findById("PROCESS_HASH_TOKENS")
            .clearLog()
            .click()
            .end()

         .getLastPublish("GENERATED", true)
            .then(function(payload) {
               assert.propertyVal(payload, "val", "hashValue");
            });
      },

      "Can use 'processMessageTokens' successfully": function() {
         return this.remote.findById("PROCESS_MESSAGE_TOKENS")
            .clearLog()
            .click()
            .end()

         .getLastPublish("GENERATED", true)
            .then(function(payload) {
               assert.propertyVal(payload, "val", "propertyValue");
            });
      }
   });
});