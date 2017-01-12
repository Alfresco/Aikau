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
 * This module extends [SubscriptionLog]{@link module:alfresco/logging/SubscriptionLog}
 * to provide a version suitable for debugging purposes.
 *
 * @example <caption>Sample configuration:</caption>
 * {
 *    name: "alfresco/logging/DebugLog",
 *    config: {
 *       payloadConfig: {
 *          maxDepth: 3,
 *          maxChildren: 10,
 *          excludedKeys: ["foo", "bar"]
 *       }
 *    }
 * }
 *
 * @module alfresco/logging/DebugLog
 * @extends external:alfresco/logging/SubscriptionLog
 * @author Martin Doyle
 */
define(["alfresco/core/ObjectTypeUtils",
      "alfresco/logging/SubscriptionLog",
      "dojo/_base/array",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "dojo/date/locale",
      "dojo/dom-class",
      "dojo/dom-construct",
      "dojo/on",
      "dojo/text!./templates/DebugLog.html",
      "dijit/_WidgetBase",
      "alfresco/services/BaseService"
   ],
   function(ObjectTypeUtils, SubscriptionLog, array, declare, lang, dateLocale, domClass, domConstruct, on, template, _WidgetBase, BaseService) {
      /*jshint devel:true*/

      return declare([SubscriptionLog], {

         /**
          * The payload config object
          *
          * @instance
          * @typedef {object} payloadConfig
          * @property {number} maxDepth The maximum depth of included objects
          * @property {number} maxChildren The maximum number of child properties to include on a single object
          * @property {string[]} excludedKeys Property names which should not have their values included
          */

         /**
          * An array of the CSS files to use with this widget.
          *
          * @instance
          * @override
          * @type {object[]}
          * @default [{cssFile:"./css/DebugLog.css"}]
          */
         cssRequirements: [{
            cssFile: "./css/DebugLog.css"
         }],

         /**
          * The HTML template to use for the widget.
          *
          * @instance
          * @override
          * @type {string}
          */
         templateString: template,

         /**
          * The root class for this widget
          *
          * @instance
          * @type {string}
          */
         rootClass: "alfresco_logging_DebugLog",

         /**
          * Default payload configuration values
          *
          * @instance
          * @static
          * @type {payloadConfig}
          */
         defaultPayloadConfig: {
            maxChildren: -1,
            maxDepth: -1,
            excludedKeys: ["dojo", "dijit", "dojox", "$", "LiveReload", "Alfresco", "sinon", "dojoConfig", "tinyMCE", "tinymce", "cScope"]
         },

         /**
          * An optional configuration object for controlling payload sanitisation
          *
          * @instance
          * @type {payloadConfig}
          */
         payloadConfig: null,

         /**
          * The log entry nodes
          *
          * @instance
          * @type {Object[]}
          * @default
          */
         _entries: null,

         /**
          * The previous value of the include-filter
          *
          * @instance
          * @type {string}
          * @since 1.0.50
          * @default
          */
         _lastIncludeFilter: null,

         /**
          * The previous value of the exclude-filter
          *
          * @instance
          * @type {string}
          * @since 1.0.50
          * @default
          */
         _lastExcludeFilter: null,

         /**
          * The constructor
          *
          * @instance
          * @override
          */
         constructor: function() {
            this._entries = [];
         },

         /**
          * Called after properties have been mixed into widget
          *
          * @instance
          * @override
          */
         postMixInProperties: function() {
            this.inherited(arguments);
            
            this.topicsToIgnore = this.topicsToIgnore || [];
            this.payloadConfig = lang.mixin({}, this.defaultPayloadConfig, this.payloadConfig);
         },

         /**
          * Update the log with a new log item
          *
          * @instance
          * @override
          * @param {object} logData The details of the publication
          */
         updateLog: function alfresco_logging_DebugLog__updateLog(logData) {

            // Ensure we're not ignoring this topic
            if (array.indexOf(this.topicsToIgnore, logData.topic) !== -1) {
               return;
            }

            // Create data variables
            var hasData = !!logData.data,
               safeData = this._sanitiseData(logData.data),
               simpleData = JSON.stringify(safeData),
               formattedData = JSON.stringify(safeData, null, 2);

            // Setup other vars
            var now = new Date(),
               source,
               entryNode,
               infoNode,
               dataNode;

            // Create the new entry
            entryNode = domConstruct.create("li", {
               "data-aikau-log-type": logData.type,
               "data-aikau-log-topic": logData.topic,
               "data-aikau-log-object": logData.object,
               "data-aikau-log-data": simpleData,
               className: this.rootClass + "__log__entry"
            }, this.logNode, "first");
            if (logData.type === "SUBSCRIBE") {
               domClass.add(entryNode, this.rootClass + "__log__entry--subscribe");
            } else {
               domClass.add(entryNode, this.rootClass + "__log__entry--publish");
            }

            // Add the basic info
            infoNode = domConstruct.create("span", {
               className: this.rootClass + "__log__entry__info"
            }, entryNode);
            domConstruct.create("span", {
               className: this.rootClass + "__log__entry__info__topic",
               innerHTML: logData.topic || "N/A"
            }, infoNode);
            domConstruct.create("span", {
               className: this.rootClass + "__log__entry__info__timestamp",
               innerHTML: dateLocale.format(now, {
                  datePattern: "yyyy-MM-dd",
                  timePattern: "HH:mm:ss.SSS"
               })
            }, infoNode);
            if (logData.object) {
               source = logData.object;
               domConstruct.create("span", {
                  className: this.rootClass + "__log__entry__info__object",
                  innerHTML: "Source: \"" + source + "\""
               }, infoNode);
            }

            // Do we have some data
            if (hasData) {

               // Add the data nodes
               dataNode = domConstruct.create("span", {
                  className: this.rootClass + "__log__entry__data " + this.rootClass + "__log__entry__data--collapsed",
                  innerHTML: "Payload"
               }, entryNode);
               domConstruct.create("span", {
                  className: this.rootClass + "__log__entry__data__collapsed"
               }, dataNode).appendChild(document.createTextNode(simpleData));
               domConstruct.create("span", {
                  className: this.rootClass + "__log__entry__data__full"
               }, dataNode).appendChild(document.createTextNode(formattedData));
            }

            // Add click-handler
            on(entryNode, "click", lang.hitch(this, this._onEntryClick, dataNode));

            // Add the entry to the collection of nodes
            this._entries.push({
               node: entryNode,
               topic: logData.topic || ""
            });

            // Re-apply the filters
            this._applyFilters(true);
         },

         /**
          * Apply the include and exclude filters to the log. Filter values are either
          * comma-separated strings or a regular expression, as determined by the state
          * of the regular expression "checkbox".
          *
          * @instance
          * @param {boolean} [force=false] Whether to force applying the current filters
          * @since 1.0.50
          */
         _applyFilters: function alfresco_logging_DebugLog___applyFilters(force) {
            var filters = {
                  include: this.includeFilter.value,
                  exclude: this.excludeFilter.value,
                  regex: this.filterUsesRegex.checked,
                  includePayload: this.includePayload.checked
               },
               prefix = filters.regex ? "REGEXP_" : "",
               suffix = filters.includePayload ? "_INCLUDE-PAYLOAD" : "",
               newInclude = prefix + filters.include + suffix,
               newExclude = prefix + filters.exclude + suffix,
               filtersChanged = newInclude !== this._lastIncludeFilter || newExclude !== this._lastExcludeFilter;
            if (filtersChanged || force) {
               if (filtersChanged) {
                  this._lastIncludeFilter = newInclude;
                  this._lastExcludeFilter = newExclude;
               }
               this._entries.forEach(lang.hitch(this, this._applyFilter, filters));
            }
         },

         /**
          * Set the visibility of the supplied log entry given the current filters
          *
          * @instance
          * @param {object} filters The filters information
          * @param {string} filters.include The value of the include-filter input
          * @param {string} filters.exclude The value of the exclude-filter input
          * @param {string} filters.includeRegex Whether the include-filter is a regular-expression
          * @param {string} filters.excludeRegex Whether the include-filter is a regular-expression
          * @param {object} entry The log entry
          */
         _applyFilter: function alfresco_logging_DebugLog___applyFilter(filters, entry) {

            // Setup variables
            var topic = lang.getObject("node.dataset.aikauLogTopic", false, entry),
               data = lang.getObject("node.dataset.aikauLogData", false, entry),
               hiddenClass = this.rootClass + "__log__entry--hidden",
               hide = false,
               hiddenByInclude,
               hiddenByExclude,
               testValue;

            // Clean up the data, to ensure we have suitable data (and not a string containing two quotes!)
            data = (data === "undefined") ? undefined : JSON.parse(data);
            data = data ? JSON.stringify(data) : "";
            testValue = topic;
            if (filters.includePayload) {
               testValue += data;
            }

            // Determine whether to hide this node
            if (filters.include || filters.exclude) {
               hiddenByInclude = filters.include && !this._matchesFilter(testValue, "include", filters);
               hiddenByExclude = filters.exclude && this._matchesFilter(testValue, "exclude", filters);
               hide = hiddenByInclude || hiddenByExclude;
            }

            // Hide/show as appropriate
            domClass[hide ? "add" : "remove"](entry.node, hiddenClass);
         },

         /**
          * Clear the exclude filter
          *
          * @instance
          * @since 1.0.51
          */
         _clearFilters: function alfresco_logging_DebugLog___clearFilters() {
            this.includeFilter.value = "";
            this.excludeFilter.value = "";
            this._applyFilters();
         },

         /**
          * Apply the filter value to the test string and return match status
          *
          * @instance
          * @param {string} testString The text to match against
          * @param {string} filter The filter to apply
          * @returns {boolean} Whether the filter matches the test string
          * @since 1.0.50
          */
         _matchesFilter: function alfresco_logging_DebugLog___matchesFilter(testString, filterType, filters) {
            var filter = filters[filterType];
            if (!filter) {
               return false;
            }
            var matches = false,
               filterToUse;
            if (filters.regex) {
               filterToUse = new RegExp(filter, "i");
               matches = filterToUse.test(testString);
            } else {
               filterToUse = this._splitFilters(filter);
               matches = filterToUse.some(function(filterTerm) {
                  return testString.toLowerCase().indexOf(filterTerm.toLowerCase()) !== -1;
               });
            }
            return matches;
         },

         /**
          * Given a variable, make it safe for being JSON.stringified. This means avoiding
          * circular references and respecting maximum sibling quantity and maximum depth.
          *
          * @instance
          * @param   {object} data The data to make safe
          * @returns {object} The safe data (or the original data, if it was falsy)
          */
         _sanitiseData: function alfresco_logging_DebugLog___sanitiseData(data) {

            // Setup variables
            var maxChildren = this.payloadConfig.maxChildren,
               maxDepth = this.payloadConfig.maxDepth,
               excludedKeys = this.payloadConfig.excludedKeys;

            // Create the safe object
            var safeData = (function makeSafe(unsafe, ancestors) {
               /*jshint maxcomplexity:false,maxstatements:false*/

               // Setup return value
               var safeValue = {};

               // Deal with data appropriately
               if (typeof unsafe === "function") {

                  // Ignore functions
                  var functionName = unsafe.name && unsafe.name + "()";
                  safeValue = functionName || "function";

               } else if (!unsafe || typeof unsafe !== "object") {

                  // Falsy values and non-objects are already safe
                  safeValue = unsafe;

               } else if (ObjectTypeUtils.isArray(unsafe)) {

                  // Arrays are safe in themselves, but make their items safe
                  safeValue = array.map(unsafe, lang.hitch(this, function(unsafeChild) {
                     return makeSafe(unsafeChild, ancestors);
                  }));

               } else if (unsafe === window) {

                   // Ignore the global window object
                   safeValue = "[window]";

               } else if (unsafe.nodeType === Node.ELEMENT_NODE) {

                  // Display information about which element this is
                  safeValue = unsafe.tagName.toLowerCase();
                  if (unsafe.id) {
                     safeValue += "#" + unsafe.id;
                  }
                  if (unsafe.className) {
                     safeValue += "." + unsafe.className.split(" ").join(".");
                  }

               } else if (unsafe.nodeType === Node.TEXT_NODE) {

                  // Text nodes are just strings
                  safeValue = unsafe.textContent;

               } else if (unsafe.nodeType) {

                  // Un-handled node type
                  safeValue = "[" + unsafe.nodeName + "]";

               } else if (typeof unsafe.isInstanceOf === "function" && unsafe.isInstanceOf(_WidgetBase)) {

                  // Ignore widgets
                  safeValue = "[widget";
                  safeValue += unsafe.id ? " id=" + unsafe.id + "]" : "]";
                  
               } else if (typeof unsafe.isInstanceOf === "function" && unsafe.isInstanceOf(BaseService)) {

                   // Ignore services
                   safeValue = "[service";
                   safeValue += unsafe.alfServiceName ? " alfServiceName=" + unsafe.alfServiceName + "]" : "]";
                  
               } else if (ancestors.indexOf(unsafe) !== -1) {

                  // Recursion avoidance!
                  safeValue = "[recursive object";
                  safeValue += unsafe.id ? " id=" + unsafe.id + "]" : "]";

               } else if (maxDepth !== -1 && ancestors.length === maxDepth) {

                  // Handle max-depth exceptions
                  safeValue = "[object beyond max-depth]";

               } else {

                  // A normal object, so recurse through its properties
                  var keys = Object.keys(unsafe),
                     key,
                     value;
                  for (var i = 0; i < keys.length; i++) {

                     // Variables
                     key = keys[i];
                     try {
                        value = unsafe[key];
                     } catch (e) {
                        value = "Error (see console for details): " + e.message;
                        console.warn("Unable to access '" + key + "' property on object: ", unsafe);
                     }

                     // Check against max children
                     if (maxChildren !== -1 && i === maxChildren) {
                        safeValue["MAXIMUM CHILDREN"] = "Maximum child-property count reached";
                        break;
                     }

                     // Ensure key isn't explicitly excluded
                     if (excludedKeys.indexOf(key) !== -1) {
                        safeValue[key] = "[key excluded]";
                        continue;
                     }

                     // Make the value safe before adding to the return object
                     safeValue[key] = makeSafe(value, ancestors.concat(unsafe));
                  }
               }

               // If we end up with a string, make the linebreaks safe
               if (typeof safeValue === "string") {
                  safeValue = safeValue.replace(/\r/g, "").replace(/\n/g, "\\n");
               }

               // Pass back the safe object
               return safeValue;

            })(data, []);

            // Pass back the safe object
            return safeData;
         },

         /**
          * Clear the log
          *
          * @instance
          */
         _onClearButtonClick: function alfresco_logging_DebugLog___onClearButtonClick() {
            domConstruct.empty(this.logNode);
            this._entries = [];
         },

         /**
          * Handle clicks on the log entry
          *
          * @instance
          * @param {Object} dataNode The dataNode, if present
          * @param {Object} evt Dojo-normalised event object
          */
         _onEntryClick: function alfresco_logging_DebugLog___onEntryClick(dataNode, evt) {
            var collapsedClass = this.rootClass + "__log__entry__data--collapsed",
               expandedDataClass = this.rootClass + "__log__entry__data__full",
               clickedOnExpandedData = domClass.contains(evt.target, expandedDataClass);
            if (!clickedOnExpandedData && dataNode) {
               domClass.toggle(dataNode, collapsedClass);
            }
         },

         /**
          * This top-level click handler is to prevent click events on the log bubbling back up to the document.
          *
          * @instance
          * @param {Event} evt Dojo-normalised event object
          * @since 1.0.61
          */
         _onWidgetClick: function alfresco_logging_DebugLog___onWidgetClick(evt) {
            evt.stopPropagation();
         },

         /**
          * Split the terms in a filter string to create an array of filter values. Terms are
          * comma-separated. To include a comma in a search term, double it up (use ,,) and
          * it will be converted into a single comma after the terms have been split.
          *
          * @instance
          * @param {string} filterString The filter string
          * @returns {string[]} The filter values
          * @since 1.0.50
          */
         _splitFilters: function alfresco_logging_DebugLog___splitFilters(filterString) {
            return filterString.split(/,(?!,)/).map(function(filterValue) {
               return filterValue.replace(/,,/, ",");
            });
         }
      });
   });