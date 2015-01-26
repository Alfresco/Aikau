/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * This module provides two main functions. Firstly it provides debugging capabilities for publication/subscription 
 * events. Secondly it provides a tool for use in unit testing that Selenium WebDriver can use to capture events
 * that occur to validate correct widget behaviour.
 *
 * @module alfresco/logging/SubscriptionLog
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/SubscriptionLog.html",
        "alfresco/core/Core",
        "alfresco/core/PubSubLog",
        "dojo/aspect",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-attr",
        "alfresco/core/ObjectTypeUtils"], 
        function(declare, _Widget, _Templated, template, Core, PubSubLog, aspect, lang, array, domConstruct, domAttr, ObjectTypeUtils) {
   
   return declare([_Widget, _Templated, Core], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/SubscriptionLog.css"}]
       */
      cssRequirements: [{cssFile:"./css/SubscriptionLog.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * This will be set to the singleton [PubSubLog]{@link module:alfresco/core/PubSubLog} object where all pub/sub
       * events will be logged when running in debug mode.
       *
       * @instance
       * @type {object}
       * @default null
       */
      pubSubLog: null,

      /**
       * This iterates over all the entries that have been added to the log so that any events logged before this
       * instance was created are displayed and then setup an aspect to capture any subsequent events.
       *
       * @instance
       */
      postCreate: function alfresco_testing_SubscriptionLog__postCreate() {
         this.pubSubLog = PubSubLog.getSingleton();
         array.forEach(this.pubSubLog._log, lang.hitch(this, "updateLog"));
         aspect.after(this.pubSubLog, "addEntry", lang.hitch(this, "logUpdated"), true);
      },

      /**
       * This is hitched via an aspect in the [postCreate]{@link module:alfresco/logging/SubscriptionLog#postCreate}
       * function. It will be called whenever the [PubSubLog]{@link module:alfresco/core/PubSubLog} is updated with
       * a new entry.
       *
       * @instance
       * @param {object} entry The entry capturing the pub/sub event.
       */
      logUpdated: function alfresco_testing_SubscriptionLog__logUpdated(entry) {
         this.updateLog(entry);
      },

      /**
       * It's possible to configure a list of topics that should be ignored. This is primarily added for
       * test purposes to allow avoid building enormous tabular structures that represent loaded data.
       *
       * @instance
       * @type {array}
       * @default null
       */
      topicsToIgnore: null,

      /**
       *
       * @instance
       * @param {object} logData The details of the publication
       */
      updateLog: function alfresco_testing_Subscription__updateLog(logData) {

         var includeTopic = true;
         if (this.topicsToIgnore != null)
         {
            includeTopic = !array.some(this.topicsToIgnore, function(topic, index) {
               return topic === logData.topic;
            });
         }

         if (includeTopic === true)
         {
            var rowNode = domConstruct.create("tr", {
               className: "sl-row"
            }, this.logNode);
            domConstruct.create("td", {
               className: "sl-type",
               innerHTML: logData.type
            }, rowNode);
            var topicNode = domConstruct.create("td", {
               className: "sl-topic",
               innerHTML: logData.topic,
            }, rowNode);
            // Set some additional data in the DOM to aid with CSS selectors in unit tests...
            domAttr.set(topicNode, "data-" + logData.type + "-topic", logData.topic);
            var dataCellNode = domConstruct.create("td", {
               className: "sl-data",
            }, rowNode);
            this.addValueToLog(logData.data, dataCellNode, 0);
            var objectNode = domConstruct.create("td", {
               className: "sl-object",
               innerHTML: logData.object
            }, rowNode);
            // Make the object ID performing the action available on both the row and object cell for
            // assisting with CSS selectors in unit tests...
            domAttr.set(objectNode, "data-pubsub-object-id", logData.object);
            domAttr.set(rowNode, "data-pubsub-log-entry-by", logData.object);
         }
      },

      /**
       * Adds a new value to the log table.
       *  
       * @instance
       * @param {object} value The value to add
       * @param {element} domNode The DOM node to add the value to
       */
      addValueToLog: function alfresco_testing_Subscription__addValueToLog(value, cellNode, depth) {
         if (depth < 6)
         {
            if (value == null)
            {
               this.addStringToLog("null", cellNode);
            }
            else if (typeof value === "number")
            {
               this.addStringToLog(value, cellNode);
            }
            else if (typeof value === "boolean")
            {
               this.addStringToLog(value.toString(), cellNode);
            }
            else if (typeof value === "function")
            {
               this.addStringToLog(value.name, cellNode);
            }
            else if (typeof value.addEventListener === "function")
            {
               // TODO: This is a hack for detecting HTML elements
               this.addStringToLog("HTML Element", cellNode);
            }
            else if (ObjectTypeUtils.isString(value))
            {
               // String value - this can just be output as a single cell
               this.addStringToLog(value, cellNode);
            }
            else if (ObjectTypeUtils.isArray(value))
            {
               // Array - we need to iterate over the values
               this.addArrayToLog(value, cellNode, depth + 1);
            }
            else if (ObjectTypeUtils.isObject(value))
            {
               if (value.excludeFromPubSubLog === true)
               {
                  this.addStringToLog(value.id, cellNode);
               }
               else
               {
                  // Object - we need to iterate over the key/value pairs
                  this.addObjectToLog(value, cellNode, depth + 1);
               }
            }
            else
            {
               // Something else, probably a boolean, function or null
            }
         }
      },

      /**
       * Sets the supplied string as the inner HTML of the supplied DOM node.
       *
       * @instance
       * @param {string} s The string to add
       * @param {element} domNode The element to add the string to
       */
      addStringToLog: function alfresco_testing_Subscription__addStringToLog(s, domNode) {
         domNode.innerHTML = s;
         domAttr.set(domNode, "data-pubsub-object-value", s);
      },

      /**
       * @instance
       * @param {object[]} a The array of data to add
       * @param {element} domNode The element to add the array data to
       */
      addArrayToLog: function alfresco_testing_Subscription__addArrayToLog(a, domNode, depth) {
         var tableNode = domConstruct.create("table", {}, domNode);
         array.forEach(a, function(object, index) {
            var rowNode = domConstruct.create("tr", {}, tableNode);
            var valueCellNode = domConstruct.create("td", {}, rowNode);
            this.addValueToLog(object, valueCellNode, depth);
         }, this);
      },

      /**
       * Add an object to the log table. The entries should be output as rows of key/value pair cells.
       * 
       * @instance
       * @param {object} o The object to add
       * @param {element} domNode The element to add the object to
       */
      addObjectToLog: function alfresco_testing_Subscription__addObject(o, domNode, depth) {
         var tableNode = domConstruct.create("table", {}, domNode);
         for (var key in o)
         {
            var rowNode = domConstruct.create("tr", {
               className: "sl-object-row"
            }, tableNode);
            var keyCellNode = domConstruct.create("td", {
               innerHTML: key
            }, rowNode);
            domAttr.set(keyCellNode, "data-pubsub-object-key", key);

            var valueCellNode = domConstruct.create("td", {}, rowNode);
            var value = o[key];
            this.addValueToLog(value, valueCellNode, depth);
         }
      }
   });
});