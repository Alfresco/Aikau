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
 * This class provides the extension methods for the Leadfoot Command object.
 * For more information on its structure, please see the official Leadfoot
 * documentation at https://theintern.github.io/leadfoot/module-leadfoot_Command.html
 *
 * @author Martin Doyle
 * @since 1.0.62
 */
define(["intern/dojo/node!fs",
      "intern/dojo/node!leadfoot/Command",
      "intern/dojo/node!leadfoot/keys",
      "intern/dojo/Promise",
      "intern/dojo/lang",
      "lodash"
   ],
   function(fs, Command, keys, Promise, lang, _) {

      // Necessary for ES6 features
      "use strict";

      // Define and add the custom properties
      // NOTE: Variables then methods, all alphabetical
      lang.mixin(Command.prototype, {

         /**
          * The index of the "screenie". This is reset each time loadTestWebScript() is called.
          *
          * @instance
          * @type {number}
          * @default
          */
         screenieIndex: 0,

         // This function is a (hopefully) helpful template for how to write these methods
         __boilerPlate: function() {
            /*jshint unused:false*/

            // If you need access to the passed arguments-object, it must be done here in the outer function

            // This next line is mandatory boilerplate
            return new this.constructor(this, function() {

               // This is how you must retrieve the browser object
               var browser = this.parent;

               // This is where you do the necessary work
               // return browser.XXX;

               // Close the inner function
            });

            // Close the outer function
         },

         /**
          * Clear the DebugLog.
          *
          * @instance
          */
         clearLog: function() {
            return new this.constructor(this, function() {
               var browser = this.parent;
               return browser.execute(function() {
                  var clearButton = document.querySelector(".alfresco_logging_DebugLog__clear-button");
                  clearButton && clearButton.click();
               });
            });
         },

         /**
          * Clear the XHR log
          *
          * @instance
          */
         clearXhrLog: function() {

            // Boilerplate stuff
            return new this.constructor(this, function() {
               var browser = this.parent;

               // Clear the log using the button
               return browser.execute(function() {
                  var clearButton = document.getElementById("mockXhr_clearLog");
                  clearButton && clearButton.click();
               });
            });
         },

         /**
          * Get the payload for all matching log entries. Uses getLogEntries() under the hood.
          *
          * @instance
          * @param {string} topicName The name of the topic to be found.
          * @param {...object} varArgs The same varArgs as supported by getLogEntries()
          * @returns {object[]} The payloads for the found topics (can be empty)
          */
         getAllPublishes: function(topicName) {

            // Grab varags
            var applyArgs = Array.prototype.slice.call(arguments, 1);

            // Boilerplate
            return new this.constructor(this, function() {
               var browser = this.parent;

               // Pre-pend the filter object and call the main log-accessor method
               applyArgs.unshift({
                  type: "PUBLISH",
                  topic: topicName,
                  pos: "all"
               });
               return browser.getLogEntries.apply(browser, applyArgs);
            });
         },

         /**
          * Get the payload for the last published log entry. Uses getLogEntries() under the hood.
          *
          * @instance
          * @param {string} topicName The name of the topic to be found.
          * @param {...object} varArgs One or more optional arguments which will be treated
          *                            according to their type. If boolean and true then topics
          *                            must be global; if numeric then will be treated as a
          *                            custom query timeout for the search; finally, if type
          *                            is a string then this will be treated as a message to
          *                            be used if an error occurs
          * @returns {object} The payload for that topic
          * @throws {error} If topic cannot be found.
          */
         getLastPublish: function(topicName) {

            // Define the opts to pass through to getLogEntries()
            var opts = {
               topic: topicName,
               type: "PUBLISH",
               pos: "last"
            };

            // Parse the arguments
            Array.prototype.slice.call(arguments, 1).forEach(function(arg) {
               switch (typeof arg) {
                  case "boolean":
                     opts.isGlobal = arg;
                     break;
                  case "string":
                     opts.messageIfError = arg;
                     break;
                  case "number":
                     opts.queryTimeout = arg;
                     break;
               }
            });

            // Boilerplate
            return new this.constructor(this, function() {
               var browser = this.parent;
               return browser.getLogEntries(opts);
            });
         },

         /**
          * Get the last XHR that contains the provided URL substring
          *
          * @instance
          * @param {string} url The substring to search for in the XHR log's URLs
          * @param {*} optionalArgs Up to two additional arguments, which will be
          *                         handled depending on their type. If a number
          *                         then will be treated as a queryTimeout override.
          *                         If a string then will be used as a prefix to
          *                         an error message if an error occurs.
          * @returns {object} The XHR entry, if found, or null if not present
          * @throws {error} If the entry cannot be found.
          */
         getLastXhr: function(url) {

            // Define the opts to pass through to getXhrEntries()
            var opts = {
               url: url,
               pos: "last"
            };

            // Parse the arguments
            Array.prototype.slice.call(arguments, 1).forEach(function(arg) {
               if (typeof arg === "number") {
                  opts.queryTimeout = arg;
               } else {
                  opts.messageIfError = arg;
               }
            });

            // Boilerplate stuff
            return new this.constructor(this, function() {
               var browser = this.parent;
               return browser.getXhrEntries(opts);
            });
         },

         /**
          * Get the payload(s) for all matching log entries.
          *
          * @instance
          * @param {object} opts The opts to be applied
          * @param {string} opts.topic The topic to search for
          * @param {string} opts.type The type of log entry ("PUBLISH" or "SUBSCRIBE")
          * @param {string} [opts.pos] One of "all", "first" or "last" (defaults to "all")
          * @param {string} [opts.object] The source object of the publication/subscription
          * @param {int} [opts.queryTimeout] How long to wait before failing to find first match
          * @param {boolean} [opts.isGlobal] Whether the publish should be global (can search for
          *                                   scoped topics by prefixing the topic with the scope
          *                                   and setting this to true)
          * @param {string} [opts.messageIfError] A string to prefix the error with, if one occurs
          *                                         while finding the topic(s)
          * @returns {object|object[]} The payload(s) for the found topics. If pos was "all"
          *                            then will be an array (possibly zero-length) of matching
          *                            payloads. If pos was "first" or "last" then will be a
          *                            single payload.
          * @throws {error} If pos is "first" or "last" and no match was found
          */
         getLogEntries: function(opts) {

            // Apply defaults to arguments
            opts = lang.mixin({
               queryTimeout: 2000,
               pos: "all",
               messageIfError: "",
               isGlobal: false,
               topic: null,
               type: null,
               object: null
            }, opts || {});

            // Boilerplate
            return new this.constructor(this, function() {

               // Get the browser object
               var browser = this.parent;

               // Build the selector
               var selectorBits = [".alfresco_logging_DebugLog__log__entry"];
               opts.type && selectorBits.push("[data-aikau-log-type=\"" + opts.type + "\"]"); // Type is "..."
               if (opts.isGlobal) {
                  opts.topic && selectorBits.push("[data-aikau-log-topic=\"" + opts.topic + "\"]"); // Topic is "..."
               } else {
                  opts.topic && selectorBits.push("[data-aikau-log-topic$=\"" + opts.topic + "\"]"); // Topic ends with "..."
               }
               opts.object && selectorBits.push("[data-aikau-log-object=\"" + opts.object + "\"]"); // Object is "..."

               // Declare variable to hold the existing async timeout
               var existingTimeout;

               // Store the async timeout and then perform the search and reset the timeout
               return browser.getExecuteAsyncTimeout()
                  .then(function(timeout) {
                     existingTimeout = timeout;
                  })
                  .setExecuteAsyncTimeout(opts.queryTimeout + 2000)
                  .executeAsync(function(entriesSelector, timeout, asyncComplete) {

                     // Store the start-time and start the interval
                     var before = Date.now(),
                        intervalPointer = setInterval(function() {

                           // Perform the search and grab the payloads
                           var entries = document.querySelectorAll(entriesSelector),
                              dataObjs = Array.prototype.map.call(entries, function(entry) {
                                 return JSON.parse(entry.getAttribute("data-aikau-log-data"));
                              });

                           // Finish if we have data or if timeout exceeded
                           if (dataObjs.length || (Date.now() - before > timeout)) {
                              clearInterval(intervalPointer);
                              asyncComplete(dataObjs);
                           }

                        }, 50);

                  }, [selectorBits.join(""), opts.queryTimeout])
                  .then(function(entries) {

                     // Return value depends upon "pos" attribute
                     if (entries.length || opts.pos === "all") {

                        // Entries found, or empty collection acceptable
                        var returnValue = entries;
                        if (opts.pos === "first") {
                           returnValue = entries.pop();
                        } else if (opts.pos === "last") {
                           returnValue = entries.shift();
                        }
                        return returnValue;

                     } else {

                        // Construct the error message
                        var customMessage = opts.messageIfError ? opts.messageIfError + ": " : "",
                           entryType = opts.type || "PUBorSUB",
                           topic = opts.isGlobal ? opts.topic + " (global)" : "*" + opts.topic,
                           errorMessage = "Unable to find a " + entryType + " of " + topic + " with timeout of " + opts.queryTimeout + "ms";

                        // Throw the error
                        throw new Error(customMessage + errorMessage);
                     }
                  })
                  .then(function(entries) {
                     browser.setExecuteAsyncTimeout(existingTimeout);
                     return entries;
                  }, function(error) {
                     browser.setExecuteAsyncTimeout(existingTimeout);
                     throw error;
                  });
            });
         },

         /**
          * Get the text content of a specific node
          *
          * @instance
          * @param {String} selector The CSS selector for the element
          * @returns {String} The text-content
          */
         getTextContent: function(selector) {
            return new this.constructor(this, function() {
               var browser = this.parent;
               return browser.execute(function (cssSelector) {
                  var elem = document.querySelector(cssSelector);
                  return elem && elem.textContent;
               }, [selector]);
            });
         },

         /**
          * Get all matching entries from the XHR log
          *
          * @instance
          * @param {object} opts A full list of the arguments
          * @param {string} [opts.url] The substring to search for in a URL
          * @param {string} [opts.pos=all] One of "first", "last" or "all", as reference to
          *                            the chronological order of items in the XHR log
          * @param {string} [opts.method] The method use in the XHR request (this will
          *                               be automatically capitalised)
          * @param {object} [opts.headers={}] Looks for all of the specified header name/values
          * @param {int} [opts.queryTimeout=2000] How long to wait for the first match
          * @param {string} [opts.body] Searches for this string inside the request body
          * @param {string} [opts.messageIfError] Used as a prefix to any returned error message
          * @returns {object|object[]} If "first" or "last" was specified as the 'pos'
          *                            parameter, then will return either a single XHR
          *                            entry or throw an error. If "all" (the default)
          *                            is specified then will return an array of objects
          *                            always (but empty if none found).
          */
         getXhrEntries: function(opts) {

            // Apply defaults to arguments
            opts = lang.mixin({
               queryTimeout: 2000,
               pos: "all",
               url: "",
               method: "",
               headers: {},
               body: "",
               messageIfError: ""
            }, opts || {});

            // Boilerplate stuff
            return new this.constructor(this, function() {
               var browser = this.parent;

               // Build the selector
               var selectorBits = [".mx-row"];
               opts.url && selectorBits.push("[data-aikau-xhr-url*=\"" + opts.url + "\"]");
               opts.method && selectorBits.push("[data-aikau-xhr-method=\"" + opts.method.toUpperCase() + "\"]");
               Object.keys(opts.headers).forEach(function(key) {
                  var value = opts.headers[key],
                     quotedName = "\"" + key + "\"",
                     quotedValue = "\"" + value + "\"";
                  if (value.constructor === Array) {
                     quotedValue = "[\"" + value.join("\",\"") + "\"]";
                  }
                  var attributeValue = _.unescape(quotedName + ":" + quotedValue);
                  selectorBits.push("[data-aikau-xhr-headers*=\"" + attributeValue + "\"]");
               });
               opts.body && selectorBits.push("[data-aikau-xhr-request-body*=\"" + opts.body + "\"]");

               // Declare variable to hold the existing async timeout
               var existingTimeout;

               // Store the async timeout and then perform the search and reset the timeout
               return browser.getExecuteAsyncTimeout()
                  .then(function(timeout) {
                     existingTimeout = timeout;
                  })
                  .setExecuteAsyncTimeout(opts.queryTimeout + 2000)
                  .executeAsync(function(entriesSelector, timeout, asyncComplete) {

                     try {

                        // Create helper function outside of loop
                        var jsonify = function(data) {
                           try {
                              return JSON.parse(data);
                           } catch (e) {
                              return data;
                           }
                        };

                        // Store the start-time and start the interval
                        var before = Date.now(),
                           intervalPointer = setInterval(function() {

                              // Perform the search and grab the payloads
                              var entries = document.querySelectorAll(entriesSelector),
                                 dataObjs = Array.prototype.map.call(entries, function(entry) {

                                    // Get raw attribute values
                                    var method = entry.getAttribute("data-aikau-xhr-method"),
                                       url = entry.getAttribute("data-aikau-xhr-url"),
                                       requestHeaders = entry.getAttribute("data-aikau-xhr-request-headers"),
                                       requestBody = entry.getAttribute("data-aikau-xhr-request-body"),
                                       responseHeaders = entry.getAttribute("data-aikau-xhr-response-headers"),
                                       responseBody = entry.getAttribute("data-aikau-xhr-response-body");

                                    return {
                                       request: {
                                          method: method,
                                          url: url,
                                          headers: jsonify(requestHeaders),
                                          body: jsonify(requestBody)
                                       },
                                       response: {
                                          headers: jsonify(responseHeaders),
                                          body: jsonify(responseBody)
                                       }
                                    };
                                 });

                              // Finish if we have data or if timeout exceeded
                              if (dataObjs.length || (Date.now() - before > timeout)) {
                                 clearInterval(intervalPointer);
                                 asyncComplete(dataObjs);
                              }
                           }, 50);

                     } catch (e) {
                        var message = "ERROR!: " + e.message;
                        asyncComplete(message);
                     }

                  }, [selectorBits.join(""), opts.queryTimeout])
                  .then(function(entries) {

                     if (typeof entries === "string" && entries.indexOf("ERROR!:") === 0) {
                        throw new Error(entries.substr("ERROR!: ".length));
                     }

                     // Return value depends upon "pos" attribute
                     if (entries.length || opts.pos === "all") {

                        // Entries found, or empty collection acceptable
                        var returnValue = entries;
                        if (opts.pos === "first") {
                           returnValue = entries.pop();
                        } else if (opts.pos === "last") {
                           returnValue = entries.shift();
                        }
                        return returnValue;

                     } else {

                        // Construct the error message
                        var customMessage = opts.messageIfError ? opts.messageIfError + ": " : "",
                           url = opts.url || "ANY",
                           method = opts.method || "ANY",
                           errorMessage = "Unable to find a " + method + " to \"" + url + "\" with specified headers/body filter and timeout of " + opts.queryTimeout + "ms";

                        // Throw the error
                        throw new Error(customMessage + errorMessage);
                     }
                  })
                  .then(function(entries) {
                     browser.setExecuteAsyncTimeout(existingTimeout);
                     return entries;
                  }, function(error) {
                     browser.setExecuteAsyncTimeout(existingTimeout);
                     throw error;
                  });
            });
         },

         /**
          * Whether the specified elements currently has scrollbars visible.
          *
          * @instance
          * @param {string} selector The element to be checked
          * @returns {boolean} Whether there are scrollbars
          */
         hasScrollbars: function(selector) {

            // Boilerplate
            return new this.constructor(this, function() {
               var browser = this.parent;

               return browser.execute(function(cssSelector) {
                  var elem = document.querySelectorAll(cssSelector)[0],
                     contentIsTaller = false,
                     contentIsWider = false,
                     canScrollVertically = false,
                     canScrollHorizontally = false,
                     computedStyle = elem && getComputedStyle(elem),
                     validOverflows = ["auto", "scroll"];
                  if (computedStyle) {
                     contentIsTaller = elem.scrollHeight > elem.clientHeight;
                     contentIsWider = elem.scrollWidth > elem.clientWidth;
                     canScrollVertically = validOverflows.indexOf(computedStyle.overflowY) !== -1;
                     canScrollHorizontally = validOverflows.indexOf(computedStyle.overflowX) !== -1;
                  }
                  return {
                     vertical: contentIsTaller && canScrollVertically,
                     horizontal: contentIsWider && canScrollHorizontally
                  };
               }, [selector]);
            });
         },

         /**
          * Reload the page (but using a get of the current page, rather than reload, to avoid coverage info loss)
          *
          * @instance
          * @since 1.0.66
          */
         reload: function() {

            // Boilerplate
            return new this.constructor(this, function() {
               var browser = this.parent;

               return browser.getCurrentUrl()
                  .then(function(currentUrl) {
                     return browser.get(currentUrl);
                  })
                  .findByCssSelector("body")
                  .end();
            });
         },

         /**
          * <p>Take a screenshot, and save to the src/test/screenshots directory. Can take up to
          * three arguments, in any order, where the argument type dictates how it's treated.</p>
          *
          * <p>If the argument is a string then it will be treated as a description of the
          * screenshot, and will be put into the information panel that overlays the screenshot.</p>
          *
          * <p>If the argument is a boolean, and specifically if it's true, then the currently
          * focused element on the page will be noted in the information panel overlay.</p>
          *
          * <p>If the argument is an object then it is treated as an options object, with three
          * permissible properties of "description" (handled as the string property above);
          * "logFocusedElement" (handled as the boolean property above); and "thisTestName" (the
          * name of the test will be included in the information panel).</p>
          *
          * @instance
          */
         screenie: function() {

            // Parse arguments
            var argsArray = Array.prototype.slice.call(arguments),
               description,
               logFocusedElement,
               thisTestName;
            argsArray.forEach(function(arg) {
               if (typeof arg === "string") {
                  description = arg;
               } else if (typeof arg === "boolean") {
                  logFocusedElement = arg;
               } else if (typeof arg === "object") {
                  description = arg.desc || undefined;
                  logFocusedElement = arg.logFocused || false;
                  thisTestName = arg.testName || undefined;
               }
            });

            // Ensure description isn't too long
            if (description && description.length > 500) {
               description = description.substr(0, 497) + "...";
            }

            // Boilerplate stuff
            return new this.constructor(this, function() {

               // Get the environment info
               var rootSuite = this,
                  envType;
               while(rootSuite.parent) {
                  rootSuite = rootSuite.parent;
               }
               envType = rootSuite.environmentType;

               // Get the browser object
               var browser = this.parent,
                  suiteName = browser.session.suiteName;

               // Pad the screenie index
               var padding = "000",
                  indexAsStr = (browser.session.screenieIndex++) + "",
                  paddedIndex = (padding + indexAsStr).slice(-padding.length);

               // Setup function variables
               var safeBrowserName = envType.browserName.replace(/\W+/g, "_")
                  .split("_")
                  .map(function(namePart) {
                     return namePart.length > 1 ? namePart.substr(0, 1)
                        .toUpperCase() + namePart.substr(1)
                        .toLowerCase() : namePart.toUpperCase();
                  })
                  .join("_"),
                  nonWordRegex = /[^a-z0-9]+/gi,
                  suite = suiteName.replace(nonWordRegex, "_") + "--", // Don't ask
                  thisTest = (thisTestName && "--" + thisTestName.replace(nonWordRegex, "_")) || "",
                  screenshotName = safeBrowserName + "--" + suite + paddedIndex + thisTest + ".png",
                  screenshotPath = "src/test/screenshots/" + screenshotName,
                  infoId = "TestCommon__webpage-info",
                  dfd = new Promise.Deferred();

               // Take and store the screenshot
               browser.executeAsync(function(id, desc, logFocused, asyncComplete) {

                     // Cleanup old info block
                     var oldInfo = document.getElementById(id);
                     oldInfo && document.body.removeChild(oldInfo);

                     // Get details of the active (focused) element
                     var focused = document.activeElement,
                        focusedTag = focused.tagName,
                        focusedId = focused.id ? "#" + focused.id : "",
                        focusedClasses = focused.className ? "." + focused.className.split(" ").join(".") : "",
                        focusedText = focusedTag + focusedId + focusedClasses;

                     // Create new info block
                     var urlDisplay = document.createElement("DIV");
                     urlDisplay.id = id;
                     urlDisplay.style.background = "#666";
                     urlDisplay.style.borderRadius = "5px 0 0 5px";
                     urlDisplay.style.color = "#fff";
                     urlDisplay.style.fontFamily = "Open Sans Bold, sans-serif";
                     urlDisplay.style.fontSize = "12px";
                     urlDisplay.style.lineHeight = "18px";
                     urlDisplay.style.maxWidth = "400px";
                     urlDisplay.style.opacity = ".85";
                     urlDisplay.style.padding = "10px";
                     urlDisplay.style.position = "fixed";
                     urlDisplay.style.right = "0";
                     urlDisplay.style.bottom = "10px";
                     urlDisplay.appendChild(document.createTextNode("User Agent: " + navigator.userAgent));
                     urlDisplay.appendChild(document.createElement("BR"));
                     urlDisplay.appendChild(document.createTextNode("Time: " + (new Date()).toISOString()));
                     urlDisplay.appendChild(document.createElement("BR"));
                     urlDisplay.appendChild(document.createTextNode("URL: " + location.href));
                     if (desc) {
                        urlDisplay.appendChild(document.createElement("BR"));
                        urlDisplay.appendChild(document.createTextNode("Description: \"" + desc + "\""));
                     }
                     if (logFocused) {
                        urlDisplay.appendChild(document.createElement("BR"));
                        urlDisplay.appendChild(document.createTextNode("Focused elem: " + focusedText));
                     }

                     // Add info block to page and complete async
                     document.body.appendChild(urlDisplay);
                     setTimeout(asyncComplete, 0);

                  }, [infoId, description, logFocusedElement])
                  .takeScreenshot()
                  .then(function(screenshot) {
                     fs.writeFile(screenshotPath, screenshot.toString("binary"), "binary", function(err) {
                        browser.execute(function(id) {
                           var infoBlock = document.getElementById(id);
                           if(infoBlock) {
                              infoBlock.parentNode.removeChild(infoBlock);
                           }
                        }, [infoId]);
                        if (err) {
                           dfd.reject(err);
                        } else {
                           dfd.resolve();
                        }
                     });
                  });

               // Pass back a promise
               return dfd.promise;
            });
         },

         /**
          * Tab to the specified element on the page.
          *
          * @instance
          * @param {string} selector The CSS selector of the element to tab to
          * @param {int} [collectionIndex=0] If the selector matches a collection, this index will define the item within that collection if provided
          * @param {int} [maxTabs=10] The maximum number of tabs to use (i.e. how many times to simulate pressing tab) - used to prevent forever looping round a page trying to find an element
          */
         tabToElement: function(selector, collectionIndex, maxTabs) {

            // Boilerplate stuff
            return new this.constructor(this, function() {

               // Setup variables
               var browser = this.parent,
                  numTabs = 0,
                  dfd = new Promise.Deferred();

               // Sanitise arguments
               collectionIndex = collectionIndex || 0;
               maxTabs = maxTabs || 10;
               if (!selector) {
                  throw new Error("No valid selector provided in tabToElement()");
               }

               // Define tabAndCheck function
               function tabAndCheck() {
                  return browser.pressKeys(keys.TAB)
                     .execute(function(targetElemSelector, index) {
                        var targetElem = document.querySelectorAll(targetElemSelector)[index];
                        return targetElem && targetElem === document.activeElement;
                     }, [selector, collectionIndex])
                     .then(function(foundElem) {
                        if (typeof foundElem === "undefined") {
                           throw new Error("Unable to find target element with selector \"" + selector + "\" and index " + collectionIndex);
                        } else if (!foundElem && numTabs++ < maxTabs) {
                           return tabAndCheck();
                        } else if (!foundElem) {
                           throw new Error("Unable to tab to element with selector \"" + selector + "\" after " + maxTabs + " attempts");
                        } else {
                           return true;
                        }
                     });
               }

               // Tab until found
               tabAndCheck().then(function() {
                  dfd.resolve();
               }, function(err) {
                  dfd.reject(err);
               });

               // Pass back the base promise
               return dfd.promise;
            });
         }
      });
   });