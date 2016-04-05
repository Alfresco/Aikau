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
 * This mixin provides accessor methods for the legacy pub/sub log.
 *
 * @author Dave Draper
 * @author Martin Doyle
 * @since 1.0.62
 */
define({

   /**
    * This generates a CSS selector that gets the topic cell for a specific row
    *
    * @instance
    * @param {number} expectedRow The row to get the topic for
    */
   nthTopicSelector: function(expectedRow) {
      var row = this._determineRow(expectedRow);
      var selector = ".alfresco-testing-SubscriptionLog tr.sl-row:" + row + " td.sl-topic";
      return selector;
   },

   /**
    * This generates a CSS selector that attempts to select a publication payload entry from the SubscriptionLog
    * widget. It's looking for a specific publish topic so could return multiple results.
    *
    * @instance
    * @param {string} publishTopic The topic published on
    * @param {string} key The key for the data
    * @param {string} value The value for the data
    * @returns {string} The CSS selector
    */
   pubDataCssSelector: function(publishTopic, key, value) {
      var selector = "" +
         "td[data-publish-topic='" + publishTopic + "'] + " +
         "td.sl-data > table > tr.sl-object-row > " +
         "td[data-pubsub-object-key=" + key + "] + " +
         "td[data-pubsub-object-value=\"" + value + "\"]";
      return selector;
   },

   /**
    * This generates a CSS selector that attempts to select a publication payload entry from the SubscriptionLOg
    * widget where the payload contains a nested array that is the value of a key
    *
    * @instance
    * @param {string} publishTopic The topic published on
    * @param {string} key The key for the data
    * @param {string} arrayIndex The index of the nested array
    * @param {string} value The expected value of the nested data.
    * @returns {string} The CSS selector
    */
   pubDataNestedArrayValueCssSelector: function(publishTopic, key, arrayIndex, value) {
      var selector = "" +
         "td[data-publish-topic='" + publishTopic + "'] + " +
         "td.sl-data tr.sl-object-row " +
         "td[data-pubsub-object-key=" + key +
         "]+ td td[data-pubsub-object-value='" + value + "']:nth-child(" + arrayIndex + ")";
      return selector;
   },

   /**
    * This generates a CSS selector that attempts to select a publication payload entry from the SubscriptionLOg
    * widget where the payload contains a nested key/value pair that is the value of a key
    *
    * @instance
    * @param {string} publishTopic The topic published on
    * @param {string} key The key for the data
    * @param {string} nestedKey The key nested as the value for the data
    * @param {string} nestedValue The value of the nested data.
    * @returns {string} The CSS selector
    */
   pubDataNestedValueCssSelector: function(publishTopic, key, nestedKey, nestedValue) {
      var selector = "" +
         "td[data-publish-topic='" + publishTopic + "'] + " +
         "td.sl-data tr.sl-object-row " +
         "td[data-pubsub-object-key=" + key +
         "]+ td td[data-pubsub-object-key='" + nestedKey + "'] " +
         "+ td[data-pubsub-object-value='" + nestedValue + "']";
      return selector;
   },

   pubDataRowsCssSelector: function(publishTopic, key) {
      var selector = "" +
         "tr.sl-row:last-child td[data-publish-topic='" + publishTopic + "'] + " +
         "td.sl-data tr.sl-object-row " +
         "td[data-pubsub-object-key=" + key +
         "]+td > table > tr";
      return selector;
   },

   /**
    * This generates a CSS selector that attempts to select a publication payload entry from the SubscriptionLog
    * widget. It looks on a specific row of the table for an entry with a specific key/value pair. It's important to
    * remember that the first generated row will be 3 (!! THREE !!) because the index starts at 1 NOT 0 and the first
    * row is the header and the second row will be the publication indicating that the page has loaded.
    *
    * @instance
    * @param {number} expectedRow The row that the data is expected to be found in (can be set to "last")
    * @param {string} key The key for the data
    * @param {string} value The value for the data
    * @returns {string} The CSS selector
    */
   pubSubDataCssSelector: function(expectedRow, key, value) {
      var row = "";
      if (expectedRow === "any") {
         // Don't specify a row
      } else if (expectedRow === "last") {
         row = ":last-child";
      } else if (expectedRow !== "last") {
         row = ":nth-child(" + expectedRow + ")";
      }
      var selector = "" +
         ".alfresco-testing-SubscriptionLog tr.sl-row" + row +
         " td[data-pubsub-object-key=" + key +
         "]+td[data-pubsub-object-value='" + value + "']";
      return selector;
   },

   /**
    * Selects the data value element for a specific key in a specific row.
    * 
    * @instance
    * @param {number} expectedRow The row that the data is expected to be found in (can be set to "last")
    * @param {string} key The key for the data
    * @returns {string} The CSS selector
    */
   pubSubDataValueCssSelector: function(expectedRow, key) {
      var row = "";
      if (expectedRow === "any") {
         // Don't specify a row
      } else if (expectedRow === "last") {
         row = ":last-child";
      } else if (expectedRow !== "last") {
         row = ":nth-child(" + expectedRow + ")";
      }
      var selector = "" +
         ".alfresco-testing-SubscriptionLog tr.sl-row" + row +
         " td[data-pubsub-object-key=" + key +
         "]+td";
      return selector;
   },

   /**
    * This generates a CSS selector that attempts to find all elements that match a subscription topic entry from the
    * SubscriptionLog widget, and returns the associated data column.
    *
    * @instance
    * @param {string} topic The topic to search
    * @param {string} type (optional) The topic action (e.g. "publish" or "subscribe") defaults to "subscribe"
    * @param {string} expectedRow (optional) A specific row to check for ("last" is an accepted option). Negative numbers trigger a backwards count.
    * @param {string} [matchType="exact"] Choose between a partial, prefix, suffix or exact match on topic.
    * @returns {string} The CSS selector
    */
   topicDataSelector: function(topic, type, expectedRow, matchType) {
      return this.topicSelector(topic, type, expectedRow, matchType) + " + td.sl-data";
   },

   /**
    * This generates a CSS selector that attempts to find all elements that match a subscription topic entry from the
    * SubscriptionLog widget.
    *
    * @instance
    * @param {string} topic The topic to search
    * @param {string} type (optional) The topic action (e.g. "publish" or "subscribe") defaults to "subscribe"
    * @param {string} expectedRow (optional) A specific row to check for ("last" is an accepted option). Negative numbers trigger a backwards count.
    * @param {string} [matchType="exact"] Choose between a partial, prefix, suffix or exact match on topic.
    * @returns {string} The CSS selector
    */
   topicSelector: function(topic, type, expectedRow, matchType) {
      type = type || "subscribe";
      var row = "";
      if (expectedRow === "any") {
         // Don't specify a row
      } else if (expectedRow === "last") {
         row = ":last-child";
      } else if (expectedRow !== null && expectedRow !== undefined) {
         var rowSelector = "nth-child";
         if (expectedRow.indexOf("-") !== -1) {
            // If the expected row contains a negative number, count backwards. -1 is last, -2 is penultimate, etc.
            rowSelector = "nth-last-child";
            expectedRow = expectedRow.slice(1, expectedRow.length);
         }
         row = ":" + rowSelector + "(" + expectedRow + ")";
      }

      // Allow partial matching, match prefix or suffix.
      matchType = matchType || "exact";
      var comparison = "=";

      switch (matchType) {
         case "partial":
            comparison = "*=";
            break;
         case "prefix":
            comparison = "$=";
            break;
         case "suffix":
            comparison = "^=";
            break;
         default:
            comparison = "=";
      }

      var selector = ".alfresco-testing-SubscriptionLog tr.sl-row" + row + " td[data-" + type + "-topic" + comparison + topic + "]";
      return selector;
   },

   /**
    * Internal function used to determine whether to use nth-child or last-child pseudo selector
    *
    * @instance
    * @param {number} expectedRow
    * @returns {string} The pseudo selector to use
    */
   _determineRow: function(expectedRow) {
      var row = "last-child";
      if (expectedRow !== "last") {
         row = "nth-child(" + expectedRow + ")";
      }
      return row;
   }
});