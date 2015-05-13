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
 * This module was written with the express purpose of working with the [ComboBox]{@link module:alfresco/forms/controls/ComboBox}
 * form control. It extends the Dojo JsonRest module to support queries over the Aikau publication/subscription
 * communication layer (rather than by direct XHR request).
 *
 * @module alfresco/forms/controls/utilities/ServiceStore
 * @extends external:dojo/store/JsonRest
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/store/JsonRest",
        "alfresco/core/Core",
        "dojo/Deferred",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/store/util/QueryResults",
        "dojo/store/util/SimpleQueryEngine",
        "dojo/regexp"],
        function(declare, JsonRest, AlfCore, Deferred, lang, array, QueryResults, SimpleQueryEngine, regexp) {

   return declare([JsonRest, AlfCore], {

      /**
       * This is the topic to publish to get the options for.
       *
       * @instance
       * @type {string}
       * @default null
       */
      publishTopic: null,

      /**
       * The payload to publish on the [publishTopic]{@link module:alfresco/forms/controls/utilities/ServiceStore#publishTopic}
       * to assist with retrieving data.
       *
       * @instance
       * @type {object}
       * @default null
       */
      publishPayload: null,

      /**
       * This is the attribute to use when querying the result data for matching items. This is set to
       * "name" by default but can be overridden. When used by a [form control]{@link module:alfresco/forms/controls/BaseFormControl}
       * it would be expected that this would be set to be the [name attribute]{@link module:alfresco/forms/controls/BaseFormControl#name}
       * of that form control.
       *
       * @instance
       * @type {string}
       * @default "name"
       */
      queryAttribute: "name",

      /**
       * Should the results all start with the search query string.
       * If set to false, results that contain the string anywhere will match
       *
       * @instance
       * @type {string}
       * @default true
       */
      searchStartsWith: true,

      /**
       * If this is configured to be an array of fixed options then the query will be run against
       * those options without constantly making XHR requests for fresh data.
       *
       * @instance
       * @type {array}
       * @default null
       */
      fixed: null,

      /**
       * This function is called to retrieve an item from the store. If the store uses fixed options
       * then these are checked and if an XHR request is required then a deferred item will be
       * returned pending a callback to the
       * [onGetOptions function]{@link module:alfresco/forms/controls/utilities/ServiceStore#onGetOptions}.
       *
       * @instance
       * @param {string} id The id of the item to retrieve from the store
       * @param {object} options Options for finding the item
       * @returns Either the item or a promise of the item
       */
      get: function alfresco_forms_controls_utilities_ServiceStore__get(id, /*jshint unused:false*/options){
         var response = null;
         if (this.publishTopic)
         {
            // If a publishTopic has been specified then publish on it to request the options
            // to search through for the item...
            response = new Deferred();
            var responseTopic = this.generateUuid();
            var payload = lang.clone(this.publishPayload);
            if (!payload)
            {
               payload = {};
            }
            payload.alfResponseTopic = responseTopic;
            var resultsProperty = this.publishPayload.resultsProperty || "response";
            this._getOptionsHandle = [];
            this._getOptionsHandle.push(this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, "onGetOptions", response, resultsProperty, id), true));
            this.alfPublish(this.publishTopic, payload, true);
         }
         else if (this.fixed)
         {
            // ...otherwise search any fixed options that have been supplied...
            response = this.getOption(lang.clone(this.fixed), id);
         }
         else
         {
            this.alfLog("warn", "A ServiceStore was set up without 'publishTopic' or 'fixed' attributes to use to retrieve options", this);
            response = "";
         }
         return response;
      },

      /**
       * This is the callback function that is hitched to the request for
       *
       * @instance
       * @param {obejct} dfd The deferred object to resolve.
       * @param {string} resultsProperty A dot-notation address in the payload that should contain the list of options.
       * @param {string} id The id of the item to retrieve
       * @param {object} payload The options to use
       */
      onGetOptions: function alfresco_forms_controls_utilities_ServiceStore__onGetOptions(dfd, resultsProperty, id, payload) {
         this.alfUnsubscribeSaveHandles([this._getOptionsHandle]);
         var results = lang.getObject(resultsProperty, false, payload);
         if (results !== null && typeof results !== "undefined")
         {
            var target = this.getOption(results, id);
            dfd.resolve(target);
         }
         else
         {
            this.alfLog("warn", "No '" + resultsProperty + "' attribute published in payload for the query options", payload, this);
            dfd.resolve("");
         }
      },

      /**
       * Iterates over the supplied results array to try and find an item where it's
       * valueAttribute matches the supplied id.
       *
       * @instance
       * @param {array} results The results to iterate over
       * @param {string} id The id of the item to find
       * @returns {object} The found item (or the empty string if the item cannot be found)
       */
      getOption: function alfresco_forms_controls_utilities_ServiceStore__getOption(results, id) {
         var target = "";
         array.forEach(results, function(item) {
            if (item[this.valueAttribute] === id)
            {
               target = item;
            }
         }, this);
         return target;
      },

      /**
       * This function is used to actually query the results (either from a pub/sub request or
       * defined in a fixed list of options).
       *
       * @instance
       * @param {array} results The results to query.
       */
      queryResults: function alfresco_forms_controls_utilities_ServiceStore__queryResults(results, query) {
         /*jshint newcap:false*/

         // Clone the original fixed set of options to ensure that we're not
         // removing any of the original data...
         var queryAttribute = this.queryAttribute || "name";
         var labelAttribute = this.labelAttribute || "label";
         var valueAttribute = this.valueAttribute || "value";

         // Check that all the data is valid, this is done to ensure any data sets that don't contain all the data...
         // This is a workaround for an issue with the Dojo query engine that will break when an item doesn't contain
         // the query attribute...
         array.forEach(results, lang.hitch(this, this.processResult, queryAttribute, labelAttribute, valueAttribute));

         // Create an updated query with a sanitised query/regex in it
         var updatedQuery = {};
         updatedQuery[this.queryAttribute] = this.createSearchRegex(query[this.queryAttribute].toString());

         // NOTE: Ignore JSHint warnings on the following 2 lines...
         var queryEngine = SimpleQueryEngine(updatedQuery);
         var queriedResults = QueryResults(queryEngine(results));
         return queriedResults;
      },

      /**
       * Create the regex used for querying
       *
       * @instance
       * @param    {string}  queryString The supplied query string
       * @param    {boolean} ignorePostMatch Whether to append ".*$" to the string (defaults to including this)
       * @returns  {object}  The regular expression to use in the query engine
       */
      createSearchRegex: function alfresco_forms_controls_utilities_ServiceStore__createSearchRegex(queryString, ignorePostMatch) {
         var safeQueryString = regexp.escapeString(queryString),
            rePrefix = this.searchStartsWith ? "^" : "",
            reSuffix = ignorePostMatch ? "" : ".*$",
            reValue = rePrefix + safeQueryString + reSuffix,
            reModifiers = "i";
         return new RegExp(reValue, reModifiers);
      },

      /**
       * Processes the results to check that all the data is valid, this is done to ensure any
       * data sets that don't contain all the data are corrected.This is a workaround for an
       * issue with the Dojo query engine that will break when an item doesn't contain
       * the query attribute. This function also adds label and value attributes to the item
       * if they're not present.
       *
       * @instance
       * @param {array} options The array to add the processed item to
       * @param {object} config The configuration to use for processing the option
       * @param {object} item The current item to process as an option
       * @param {number} index The index of the item in the items list
       */
      processResult: function alfresco_forms_controls_utilities_ServiceStore__processResult(queryAttribute, labelAttribute, valueAttribute, item, /*jshint unused:false*/ index) {
         // Small helper func to remove JSHint errors but absolutely preserve existing logic
         var isValid = function(o) {
            return o !== null && typeof o !== "undefined";
         };
         if (!isValid(item[queryAttribute]))
         {
            item[queryAttribute] = "";
         }
         if (!isValid(item.label) && isValid(item[labelAttribute]))
         {
            item.label = item[labelAttribute];
         }
         if (!isValid(item.value) && isValid(item[valueAttribute]))
         {
            item.value = item[valueAttribute];
         }
      },

      /**
       * Queries a fixed set of options.
       *
       * @instance
       * @param {object} query The query to use for retrieving objects from the store.
       * @param {object} options The optional arguments to apply to the resultset.
       * @returns {object} The results of the query, extended with iterative methods.
       */
      queryFixedOptions: function alfresco_forms_controls_utilities_ServiceStore__queryFixedOptions(query, /*jshint unused:false*/ options) {
         var queriedResults = this.queryResults(lang.clone(this.fixed), query);
         return queriedResults;
      },

      /**
       * Makes a request for data by publishing a request on a specific topic. This returns a
       * Deferred object which is resolved by the
       * [onQueryOptions]{@link module:alfresco/forms/controls/utilities/ServiceStore#onQueryOptions}
       * function.
       *
       * @instance
       * @param {object} query The query to use for retrieving objects from the store.
       * @param {object} options The optional arguments to apply to the resultset.
       * @returns {object} The results of the query, extended with iterative methods.
       */
      queryXhrOptions: function alfresco_forms_controls_utilities_ServiceStore__query(query, /*jshint unused:false*/ options) {
         var response = new Deferred();
         var responseTopic = this.generateUuid();
         var payload = lang.clone(this.publishPayload);
         if (!payload)
         {
            payload = {};
         }
         payload.alfResponseTopic = responseTopic;

         // Set up a dot-notation address to retrieve the results from, this will be set to response if not included
         // in the payload...
         var resultsProperty = payload.resultsProperty || "response";

         // Add in an additional query attribute. Some services (e.g. the TagService) will use this as an additional
         // search term request parameter...
         payload.query = query[this.queryAttribute || "name"];

         var optionsHandle = [];
         optionsHandle.push(this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, "onQueryOptions", response, query, resultsProperty, optionsHandle), true));
         optionsHandle.push(this.alfSubscribe(responseTopic, lang.hitch(this, "onQueryOptions", response, query, resultsProperty, optionsHandle), true));
         this.alfPublish(this.publishTopic, payload, true);
         return response;
      },

      /**
       * Overrides the inherited function from the JsonRest store to call either the
       * [queryXhrOptions]{@link module:alfresco/forms/controls/utilities/ServiceStore#queryXhrOptions}
       * or [queryFixedOptions]{@link module:alfresco/forms/controls/utilities/ServiceStore#queryFixedOptions}
       * depending upon how this module has been configured.
       *
       * @instance
       * @param {object} query The query to use for retrieving objects from the store.
       * @param {object} options The optional arguments to apply to the resultset.
       * @returns {object} The r{@link module:alfresco/forms/controls/utilities/ServiceStore#onQueryOptions} esults of the query, extended with iterative methods.
       */
      query: function alfresco_forms_controls_utilities_ServiceStore__query(query, options){
         var response = null;
         if (this.publishTopic)
         {
            response = this.queryXhrOptions(query, options);
         }
         else if (this.fixed)
         {
            response = this.queryFixedOptions(query, options);
         }
         else
         {
            this.alfLog("warn", "A ServiceStore was set up without 'publishTopic' or 'fixed' attributes to use to retrieve options", this);
            response = {};
         }
         return response;
      },

      /**
       * This is hitched to a generated topic subscription that is published when the target service has retrieved
       * the requested data. It performs a query on the data provided to generate the result set.
       *
       * @instance
       * @param {obejct} dfd The deferred object to resolve.
       * @param {object} query The requested query data.
       * @param {string} resultsProperty A dot-notation address in the payload that should contain the list of options.
       * @param {object} payload The options to use
       */
      onQueryOptions: function alfresco_forms_controls_utilities_ServiceStore__onQueryOptions(dfd, query, resultsProperty, optionsHandle, payload) {
         this.alfUnsubscribeSaveHandles([optionsHandle]);
         var results = lang.getObject(resultsProperty, false, payload);
         if (results)
         {
            var queriedResults = this.queryResults(results, query);
            dfd.resolve(queriedResults);
         }
         else
         {
            this.alfLog("warn", "No '" + resultsProperty + "' attribute published in payload for the query options", payload, this);
            dfd.resolve([]);
         }
      }
   });
});