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

   // The first test page has a list that does not fallback on local storage and has no current filter...
registerSuite(function(){
   var browser;

   return {
      name: "List Local Storage (1)",
      
      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/ListLocalStorageFallback", "List Local Storage (1)").end();
      },
      
      beforeEach: function() {
         browser.end();
      },

      "When there is no hash only topic is published": function() {
         return browser.findById("LIST").end()
            .getLastPublish("LOAD", "The list should have requested data");
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

   // The second test page sets local storage using the current filter...
   registerSuite(function(){
   var browser;

   return {
      name: "List Local Storage (2)",
      
      setup: function() {
         browser = this.remote;
         browser.clearLocalStorage(); // NOTE: Need to clear previous local storage...
         return TestCommon.loadTestWebScript(this.remote, 
                                             "/ListLocalStorageFallback?listType=CurrentFilterWithLocalStorage", 
                                             "List Local Storage (2)").end();
      },
      
      beforeEach: function() {
         browser.end();
      },

      "Data should have been requested": function() {
         return browser.findById("LIST").end()
            .getLastPublish("LOAD", "The list should have requested data");
      },

      "When there is no hash, the current filter is set as the hash": function() {
         return browser.getCurrentUrl()
            .then(function (url) {
               assert.include(url, "#key2=value2&key1=value1", "The URL hash was not set to the current filter");
            });
      },
     
      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

   // The third test page has a hash which trumps the current filter and is stored...
registerSuite(function(){
   var browser;

   return {
      name: "Local Storage for Lists Tests (3)",
      
      setup: function() {
         // NOTE: Do not clear local storage this time!
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, 
                                             "/ListLocalStorageFallback?listType=CurrentFilterWithLocalStorage#key3=value3", 
                                             "Local Storage for Lists Tests (3)").end();
      },
      
      beforeEach: function() {
         browser.end();
      },

      "When there is a hash, the current filter should not be used": function() {
         return browser.getCurrentUrl()
            .then(function (url) {
               assert.include(url, "#key3=value3", "The requested URL hash was not retained");
            });
      },
     
      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

   // The fourth test page has no hash, and although there is a current filter the locally stored hash is used...
registerSuite(function(){
   var browser;

   return {
      name: "Local Storage for Lists Tests (4)",
      
      setup: function() {
         // NOTE: Do not clear local storage this time!
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, 
                                             "/ListLocalStorageFallback?listType=CurrentFilterWithLocalStorage", 
                                             "Local Storage for Lists Tests (4)").end();
      },
      
      beforeEach: function() {
         browser.end();
      },

      "When there is no hash, local storage should trump the current filter": function() {
         return browser.getCurrentUrl()
            .then(function (url) {
               assert.include(url, "#key3=value3", "Local storage was NOT used as the hash");
            });
      },
     
      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

   // The fifth test page has no hash, and the list is configured to not use the previously stored
   // hash to the current filter should be used...
registerSuite(function(){
   var browser;

   return {
      name: "Local Storage for Lists Tests (5)",
      
      setup: function() {
         // NOTE: Do not clear local storage this time!
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, 
                                             "/ListLocalStorageFallback?listType=CurrentFilter", 
                                             "Local Storage for Lists Tests (5)").end();
      },
      
      beforeEach: function() {
         browser.end();
      },

      "When there is no hash and local storage is available the current filter should still be used": function() {
         return browser.getCurrentUrl()
            .then(function (url) {
               assert.include(url, "#key2=value2&key1=value1", "Current filter was not used");
            });
      },
     
      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

   // The sixth test page has a list without a current filter, it should re-use the locally stored hash
registerSuite(function(){
   var browser;

   return {
      name: "Local Storage for Lists Tests (6)",
      
      setup: function() {
         // NOTE: Do not clear local storage this time!
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, 
                                             "/ListLocalStorageFallback?listType=LocalStorage", 
                                             "Local Storage for Lists Tests (6)").end();
      },
      
      beforeEach: function() {
         browser.end();
      },

      "When there is no hash, local storage should be used": function() {
         return browser.getCurrentUrl()
            .then(function (url) {
               assert.include(url, "#key3=value3", "Local storage was NOT used as the hash");
            });
      },
     
      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });

   // The sixth test page has a list but sets a hash which should be used...
registerSuite(function(){
   var browser;

   return {
      name: "Local Storage for Lists Tests (7)",
      
      setup: function() {
         // NOTE: Do not clear local storage this time!
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, 
                                             "/ListLocalStorageFallback?listType=LocalStorage#update=test", 
                                             "Local Storage for Lists Tests (7)").end();
      },
      
      beforeEach: function() {
         browser.end();
      },

      "When there is a hash it should be used": function() {
         return browser.getCurrentUrl()
            .then(function (url) {
               assert.include(url, "#update=test", "Local storage should not have been used as the hash");
            })
            .getLastPublish("LOAD")
               .then(function(payload) {
                  assert.propertyVal(payload, "update", "test", "The data request did not include the hash parameter");
               });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});