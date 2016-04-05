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
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, require, TestCommon) {

   // Define URL with hash regexp
   var reUrlWithHash = /.*#(?:&?[^&=]+=[^&]+)+$/;

   // Function to convert URL to hash object (should always return object)
   function getHash(url) {
      if (!reUrlWithHash.test(url)) {
         return {};
      }
      var hashString = url.substr(url.indexOf("#") + 1),
         hashParams = hashString.split("&"),
         hashObj = hashParams.reduce(function(obj, param) {
            var nameValue = param.split("="),
               name = nameValue[0],
               value = nameValue[1];
            obj[name] = value;
            return obj;
         }, {});
      return hashObj;
   }

   // The first test page has a list that does not fallback on local storage and has no current filter...
   defineSuite(module, {
      name: "List Local Storage (1)",
      testPage: "/ListLocalStorageFallback",

      "When there is no hash only topic is published": function() {
         return this.remote.findById("LIST").end()
            .getLastPublish("LOAD", "The list should have requested data");
      }
   });

   // The second test page sets local storage using the current filter...
   defineSuite(module, {
      name: "List Local Storage (2)",

      setup: function() {
         this.remote.clearLocalStorage(); // NOTE: Need to clear previous local storage...
         return TestCommon.loadTestWebScript(this.remote,
            "/ListLocalStorageFallback?listType=CurrentFilterWithLocalStorage",
            "List Local Storage (2)").end();
      },

      "Data should have been requested": function() {
         return this.remote.findById("LIST").end()
            .getLastPublish("LOAD", "The list should have requested data");
      },

      "When there is no hash, the current filter is set as the hash": function() {
         return this.remote.getCurrentUrl()
            .then(function(url) {
               var hashObj = getHash(url);
               assert.propertyVal(hashObj, "key1", "value1");
               assert.propertyVal(hashObj, "key2", "value2");
            });
      }
   });

   // The third test page has a hash which trumps the current filter and is stored...
   defineSuite(module, {
      name: "Local Storage for Lists Tests (3)",
      testPage: "/ListLocalStorageFallback?listType=CurrentFilterWithLocalStorage#key3=value3", // NOTE: Do not clear local storage this time!

      "When there is a hash, the current filter should not be used": function() {
         return this.remote.getCurrentUrl()
            .then(function(url) {
               assert.include(url, "#key3=value3", "The requested URL hash was not retained");
            });
      }
   });

   // The fourth test page has no hash, and although there is a current filter the locally stored hash is used...
   defineSuite(module, {
      name: "Local Storage for Lists Tests (4)",
      testPage: "/ListLocalStorageFallback?listType=CurrentFilterWithLocalStorage", // NOTE: Do not clear local storage this time!

      "When there is no hash, local storage should trump the current filter": function() {
         return this.remote.getCurrentUrl()
            .then(function(url) {
               assert.include(url, "#key3=value3", "Local storage was NOT used as the hash");
            });
      }
   });

   // The fifth test page has no hash, and the list is configured to not use the previously stored
   // hash to the current filter should be used...
   defineSuite(module, {
      name: "Local Storage for Lists Tests (5)",
      testPage: "/ListLocalStorageFallback?listType=CurrentFilter", // NOTE: Do not clear local storage this time!

      "When there is no hash and local storage is available the current filter should still be used": function() {
         return this.remote.getCurrentUrl()
            .then(function(url) {
               var hashObj = getHash(url);
               assert.propertyVal(hashObj, "key1", "value1");
               assert.propertyVal(hashObj, "key2", "value2");
            });
      }
   });

   // The sixth test page has a list without a current filter, it should re-use the locally stored hash
   defineSuite(module, {
      name: "Local Storage for Lists Tests (6)",
      testPage: "/ListLocalStorageFallback?listType=LocalStorage", // NOTE: Do not clear local storage this time!

      "When there is no hash, local storage should be used": function() {
         return this.remote.getCurrentUrl()
            .then(function(url) {
               assert.include(url, "#key3=value3", "Local storage was NOT used as the hash");
            });
      }
   });

   // The sixth test page has a list but sets a hash which should be used...
   defineSuite(module, {
      name: "Local Storage for Lists Tests (7)",
      testPage: "/ListLocalStorageFallback?listType=LocalStorage#update=test", // NOTE: Do not clear local storage this time!

      "When there is a hash it should be used": function() {
         return this.remote.getCurrentUrl()
            .then(function(url) {
               assert.include(url, "#update=test", "Local storage should not have been used as the hash");
            })
            .getLastPublish("LOAD")
            .then(function(payload) {
               assert.propertyVal(payload, "update", "test", "The data request did not include the hash parameter");
            });
      }
   });
});