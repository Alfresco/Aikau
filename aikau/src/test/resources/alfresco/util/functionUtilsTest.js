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
define([
      "alfresco/TestCommon",
      "intern!object",
      "intern/chai!assert",
      "require"
   ],
   function(TestCommon, registerSuite, assert, require) {

registerSuite(function(){
   var browser;

   return {
         name: "Function Utils Test",

         setup: function() {
            browser = this.remote;
            return TestCommon.loadTestWebScript(this.remote, "/Index", "Function Utils Test").end();
         },

         beforeEach: function() {
            browser.end();
         },

         "Throttle function works": function() {
            return browser.setExecuteAsyncTimeout(5000)
               .executeAsync(function(callback) {
                  require(["alfresco/util/functionUtils"], function(funcUtils) {
                     var results = [],
                        before = Date.now(),
                        invokeThrottle = function(label, delayMs) {
                           setTimeout(function() {
                              funcUtils.throttle({
                                 name: "Throttle Test",
                                 func: function() {
                                    results.push(label);
                                 }
                              });
                           }, delayMs);
                        };
                     invokeThrottle("A", 0);
                     invokeThrottle("B", 60);
                     invokeThrottle("C", 120);
                     invokeThrottle("D", 280);
                     invokeThrottle("E", 400);
                     setTimeout(function() {
                        callback(results);
                     }, 1000);
                  });
               })
               .then(function(results) {
                  assert.equal(results.join(), "A,C,E", "Did not throttle functions correctly");
               });
         },

         "Throttle option ignoreFirst works": function() {
            return browser.setExecuteAsyncTimeout(5000)
               .executeAsync(function(callback) {
                  require(["alfresco/util/functionUtils"], function(funcUtils) {
                     var results = [],
                        before = Date.now(),
                        invokeThrottle = function(label, delayMs) {
                           setTimeout(function() {
                              funcUtils.throttle({
                                 name: "Throttle Test",
                                 func: function() {
                                    results.push(label);
                                 },
                                 ignoreFirst: true
                              });
                           }, delayMs);
                        };
                     invokeThrottle("A", 0);
                     invokeThrottle("B", 60);
                     invokeThrottle("C", 120);
                     invokeThrottle("D", 280);
                     invokeThrottle("E", 400);
                     setTimeout(function() {
                        callback(results);
                     }, 1000);
                  });
               })
               .then(function(results) {
                  assert.equal(results.join(), "C,E", "Did not handle ignoreFirst option in throttle function correctly");
               });
         },

         "Debounce function works": function() {
            return browser.setExecuteAsyncTimeout(5000)
               .executeAsync(function(callback) {
                  require(["alfresco/util/functionUtils"], function(funcUtils) {
                     var results = [],
                        before = Date.now(),
                        timeOfExecution,
                        invokeDebounce = function(label, delayMs) {
                           setTimeout(function() {
                              funcUtils.debounce({
                                 name: "Debounce Test",
                                 func: function() {
                                    timeOfExecution = Date.now() - before
                                 }
                              });
                           }, delayMs);
                        };
                     invokeDebounce("A", 0);
                     invokeDebounce("B", 30);
                     invokeDebounce("C", 60);
                     invokeDebounce("D", 120);
                     invokeDebounce("E", 170);
                     setTimeout(function() {
                        callback(timeOfExecution);
                     }, 1000);
                  });
               })
               .then(function(timeOfExecution) {
                  assert.closeTo(timeOfExecution, (170 + 250), 25, "Did not debounce correctly");
               });
         },

         "Debounce option execFirst works": function() {
            return browser.setExecuteAsyncTimeout(5000)
               .executeAsync(function(callback) {
                  require(["alfresco/util/functionUtils"], function(funcUtils) {
                     var results = [],
                        before = Date.now(),
                        timeOfExecution,
                        invokeDebounce = function(label, delayMs) {
                           setTimeout(function() {
                              funcUtils.debounce({
                                 name: "Debounce Test",
                                 func: function() {
                                    timeOfExecution = Date.now() - before
                                 },
                                 execFirst: true
                              });
                           }, delayMs);
                        };
                     invokeDebounce("A", 0);
                     invokeDebounce("B", 30);
                     invokeDebounce("C", 60);
                     invokeDebounce("D", 120);
                     invokeDebounce("E", 170);
                     setTimeout(function() {
                        callback(timeOfExecution);
                     }, 1000);
                  });
               })
               .then(function(timeOfExecution) {
                  assert.closeTo(timeOfExecution, 0, 25, "Did not handle execFirst option in debounce function correctly");
               });
         }
      };
      });
   }
);