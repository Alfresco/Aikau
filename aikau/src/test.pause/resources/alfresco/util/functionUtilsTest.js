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
        "alfresco/TestCommon",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "require"],
        function(module, TestCommon, defineSuite, assert, require) {

   defineSuite(module, {
      name: "Function Utils Test",
      testPage: "/Index",

      "Throttle function works": function() {
         return this.remote.setExecuteAsyncTimeout(5000)
            .executeAsync(function(callback) {
               require(["alfresco/util/functionUtils"], function(funcUtils) {
                  var results = [],
                     invokeThrottle = function(label, delayMs) {
                        setTimeout(function() {
                           funcUtils.throttle({
                              name: "Throttle Test",
                              func: function() {
                                 results.push(label);
                              },
                              timeoutMs: 250
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

      "Filtered throttle works": function() {
         return this.remote.setExecuteAsyncTimeout(5000)
            .executeAsync(function(callback) {
               require(["alfresco/util/functionUtils"], function(funcUtils) {
                  var results = [],
                     filterObj = {},
                     invokeThrottle = function(label, delayMs, filter) {
                        setTimeout(function() {
                           funcUtils.throttle({
                              name: "Throttle Test",
                              func: function() {
                                 results.push(label);
                              },
                              timeoutMs: 250,
                              filter: filter
                           });
                        }, delayMs);
                     };
                  invokeThrottle("A", 0);
                  invokeThrottle("B", 50, filterObj);
                  invokeThrottle("C", 60);
                  invokeThrottle("D", 110, filterObj);
                  invokeThrottle("E", 120);
                  invokeThrottle("F", 170, filterObj);
                  invokeThrottle("G", 280);
                  invokeThrottle("H", 330, filterObj);
                  invokeThrottle("I", 400);
                  invokeThrottle("J", 450, filterObj);
                  setTimeout(function() {
                     callback(results);
                  }, 1000);
               });
            })
            .then(function(results) {
               assert.equal(results.join(), "A,B,E,F,I,J", "Did not throttle functions correctly");
            });
      },

      "Throttle option ignoreFirst works": function() {
         return this.remote.setExecuteAsyncTimeout(5000)
            .executeAsync(function(callback) {
               require(["alfresco/util/functionUtils"], function(funcUtils) {
                  var results = [],
                     invokeThrottle = function(label, delayMs) {
                        setTimeout(function() {
                           funcUtils.throttle({
                              name: "Throttle Test",
                              func: function() {
                                 results.push(label);
                              },
                              timeoutMs: 250,
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
         return this.remote.setExecuteAsyncTimeout(5000)
            .executeAsync(function(callback) {
               require(["alfresco/util/functionUtils"], function(funcUtils) {
                  var before = Date.now(),
                     timeOfExecution,
                     invokeDebounce = function(label, delayMs) {
                        setTimeout(function() {
                           funcUtils.debounce({
                              name: "Debounce Test",
                              func: function() {
                                 timeOfExecution = Date.now() - before;
                              },
                              timeoutMs: 250
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
         return this.remote.setExecuteAsyncTimeout(5000)
            .executeAsync(function(callback) {
               require(["alfresco/util/functionUtils"], function(funcUtils) {
                  var before = Date.now(),
                     timeOfExecution,
                     invokeDebounce = function(label, delayMs) {
                        setTimeout(function() {
                           funcUtils.debounce({
                              name: "Debounce Test",
                              func: function() {
                                 timeOfExecution = Date.now() - before;
                              },
                              timeoutMs: 250,
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
   });
}
);