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
      "dojo/text!./templates/DebugLog.html"
   ],
   function(ObjectTypeUtils, SubscriptionLog, array, declare, lang, dateLocale, domClass, domConstruct, on, template, ZeroClipboard) {
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
          */
         _entries: null,

         /**
          * The constructor
          *
          * @instance
          * @override
          */
         constructor: function() {
            this._entries = [];
            this.topicsToIgnore = [];
         },

         /**
          * Called after properties have been mixed into widget
          *
          * @instance
          * @override
          */
         postMixInProperties: function() {
            this.inherited(arguments);
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
               dataNode,
               copyToClipboardNode;

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
            this._applyIncludeFilter();
            this._applyExcludeFilter();
         },

         /**
          * Update the exclude filter
          *
          * @instance
          */
         _applyExcludeFilter: function alfresco_logging_DebugLog___applyExcludeFilter() {
            this._applyFilter(this.excludeFilter, this.excludeFilterRegex, false);
         },

         /**
          * Update the supplied filter
          *
          * @instance
          */
         _applyFilter: function alfresco_logging_DebugLog___applyFilter(filter, regexControl, include) {
            var filterValue = filter.value,
               useRegex = regexControl.checked,
               matchRegex = new RegExp(filterValue, "i");
            array.forEach(this._entries, function(entry) {
               var matchesTopic=false,
               displayEntry = false;
               if (useRegex) {
                  matchesTopic = matchRegex.test(entry.topic);
               } else {
                  matchesTopic = entry.topic.toLowerCase().indexOf(filterValue.toLowerCase()) !== -1;
               }
               displayEntry = !filterValue || (include ? matchesTopic : !matchesTopic);
               domClass[displayEntry ? "remove" : "add"](entry.node, this.rootClass + "__log__entry--hidden");
            }, this);
         },

         /**
          * Update the include filter
          *
          * @instance
          */
         _applyIncludeFilter: function alfresco_logging_DebugLog___applyIncludeFilter() {
            this._applyFilter(this.includeFilter, this.includeFilterRegex, true);
         },

         /**
          * Clear the exclude filter
          *
          * @instance
          */
         _clearExcludeFilter: function alfresco_logging_DebugLog___clearExcludeFilter() {
            this.excludeFilter.value = "";
            this._applyExcludeFilter();
         },

         /**
          * Clear the include filter
          *
          * @instance
          */
         _clearIncludeFilter: function alfresco_logging_DebugLog___clearIncludeFilter() {
            this.includeFilter.value = "";
            this._applyIncludeFilter();
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
                  safeValue = "[" + (functionName || "function") + "]";

               } else if (!unsafe || typeof unsafe !== "object") {

                  // Falsy values and non-objects are already safe
                  safeValue = unsafe;

               } else if (ObjectTypeUtils.isArray(unsafe)) {

                  // Arrays are safe in themselves, but make their items safe
                  safeValue = array.map(unsafe, lang.hitch(this, function(unsafeChild) {
                     return makeSafe(unsafeChild, ancestors);
                  }));

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

               } else if (unsafe._attachPoints) {

                  // Ignore widgets
                  safeValue = "[widget]";

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
            if (!clickedOnExpandedData) {
               domClass.toggle(dataNode, collapsedClass);
            }
         }
      });
   });