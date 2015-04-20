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
define(["alfresco/logging/SubscriptionLog",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "dojo/date/locale",
      "dojo/dom-class",
      "dojo/dom-construct",
      "dojo/on",
      "dojo/text!./templates/DebugLog.html"
   ],
   function(SubscriptionLog, declare, lang, dateLocale, domClass, domConstruct, on, template) {
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
            maxChildren: 50,
            maxDepth: 6,
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

            // Create data variables
            var hasData = !!logData.data,
               safeData = this._createSafeData(logData.data),
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
               className: this.rootClass + "__entry"
            }, this.logNode, "first");
            if (logData.type === "SUBSCRIBE") {
               domClass.add(entryNode, this.rootClass + "__entry--subscribe");
            } else {
               domClass.add(entryNode, this.rootClass + "__entry--publish");
            }

            // Add the basic info
            infoNode = domConstruct.create("span", {
               className: this.rootClass + "__entry__info"
            }, entryNode);
            domConstruct.create("span", {
               className: this.rootClass + "__entry__info__topic",
               innerHTML: logData.topic || "N/A"
            }, infoNode);
            domConstruct.create("span", {
               className: this.rootClass + "__entry__info__timestamp",
               innerHTML: dateLocale.format(now, {
                  datePattern: "yyyy-MM-dd",
                  timePattern: "HH:mm:ss.SSS"
               })
            }, infoNode);
            if (logData.object) {
               source = logData.object;
               domConstruct.create("span", {
                  className: this.rootClass + "__entry__info__object",
                  innerHTML: "Source: \"" + source + "\""
               }, infoNode);
            }

            // Add the data if we have it
            if (hasData) {
               dataNode = domConstruct.create("span", {
                  className: this.rootClass + "__entry__data " + this.rootClass + "__entry__data--collapsed",
                  innerHTML: "Payload"
               }, entryNode);
               domConstruct.create("span", {
                  className: this.rootClass + "__entry__data__collapsed",
                  innerHTML: simpleData
               }, dataNode);
               domConstruct.create("span", {
                  className: this.rootClass + "__entry__data__full",
                  innerHTML: formattedData
               }, dataNode);
               on(entryNode, "click", lang.hitch(this, function() {
                  this._toggleCollapsed(dataNode);
               }));
            }
         },

         /**
          * Given a variable, make it safe for being JSON.stringified. This means avoiding
          * circular references and respecting maximum sibling quantity and maximum depth.
          *
          * @instance
          * @param   {object} data The data to make safe
          * @returns {object} The safe data (or the original data, if it was falsy)
          */
         _createSafeData: function alfresco_logging_DebugLog___createSafeData(data) {

            // Return early if it's already falsy
            if (!data || typeof data !== "object") {
               return data;
            }

            // Setup variables
            var maxChildren = this.payloadConfig.maxChildren,
               maxDepth = this.payloadConfig.maxDepth,
               excludedKeys = this.payloadConfig.excludedKeys;

            // Create the safe object
            var safeData = (function makeSafe(unsafe, ancestors) {
               /*jshint maxcomplexity:16,maxstatements:31*/

               // Setup variables
               var keys = Object.keys(unsafe),
                  safe = {},
                  key,
                  value;

               // Run through the keys
               for (var i = 0; i < keys.length; i++) {

                  // Variables
                  key = keys[i];
                  try {
                     value = unsafe[key];
                  } catch (e) {
                     value = "Error: " + e.message;
                     console.debug("Errored on " + key + " property on object: ", safe);
                  }

                  // Check against max children
                  if (i === maxChildren) {
                     safe["MAXIMUM CHILDREN"] = "Maximum child-property count reached";
                     break;
                  }

                  // Ensure key isn't explicitly excluded
                  if (excludedKeys.indexOf(key) !== -1) {
                     safe[key] = "[key excluded]";
                     continue;
                  }

                  // Ignore widgets
                  if (value && value._attachPoints) {
                     safe[key] = "[widget]";
                     continue;
                  }

                  // We only really care about objects
                  if (value && typeof value === "object") {

                     // Handle object appropriately
                     if (value.nodeType === Node.ELEMENT_NODE) {
                        safe[key] = value.tagName.toLowerCase();
                        if (value.id) {
                           safe[key] += "#" + value.id;
                        }
                        if (value.className) {
                           safe[key] += "." + value.className.split(" ").join(".");
                        }
                     } else if (value.nodeType === Node.TEXT_NODE) {
                        safe[key] = value.textContent;
                     } else if (value.nodeType) {
                        safe[key] = "[" + value.nodeName + "]";
                     } else if (ancestors.indexOf(value) !== -1) {
                        safe[key] = "[recursive object";
                        safe[key] += value.id ? " id=" + value.id + "]" : "]";
                     } else if (ancestors.length === maxDepth) {
                        safe[key] = "[object beyond max-depth]";
                     } else {
                        safe[key] = makeSafe(value, ancestors.concat(unsafe));
                     }

                  } else {
                     safe[key] = value;
                  }

                  // Get rid of "proper" linebreaks
                  if (typeof safe[key] === "string") {
                     safe[key] = safe[key].replace(/\r/g, "").replace(/\n/g, "\\n");
                  }
               }

               // Pass back the safe object
               return safe;

            })(data, []);

            // Pass back the safe object
            return safeData;
         },

         /**
          * Toggle the collapsed state of a data item
          *
          * @instance
          * @param    {object} dataNode The node to toggle
          */
         _toggleCollapsed: function alfresco_logging_DebugLog___toggleCollapsed(dataNode) {
            domClass.toggle(dataNode, this.rootClass + "__entry__data--collapsed");
         }
      });
   });