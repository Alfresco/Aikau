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

/*globals sinon*/
/**
 * This can be extended for creating widgets that provide Mock XHR responses. It is provided for use
 * in testing and will replace the standard browser XMLHttpRequest rendering all standard XHR requests
 * impossible when included on a page.
 * 
 * @module alfresco/testing/MockXhr
 * @author Dave Draper
 * @author Martin Doyle
 * @since 1.0.50
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin", 
        "dojo/text!./templates/MockXhr.html", 
        "alfresco/core/Core", 
        "dojo/_base/lang", 
        "dojo/_base/array",
        "dojo/dom-class", 
        "dojo/dom-construct", 
        "dojo/aspect", 
        "dojo/Deferred"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, lang, array, domClass, domConstruct, aspect, Deferred) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/MockXhr.css"}]
       */
      cssRequirements: [{cssFile: "./css/MockXhr.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * An amount of time (in milliseconds) to respond after. This is useful for giving the test a chance to
       * cancel operations. If no value is given then it will respond immediately.
       *
       * @instance
       * @type {number}
       * @default
       */
      respondAfter: null,

      /**
       * Sets up the Sinon fake server.
       *
       * @instance
       */
      constructor: function alfresco_testing_MockXhr__constructor(args) {
         lang.mixin(this, args);
         this.loadBinaryData();

         // Set-up a fake server to handle all the responses...
         var server = this.server = sinon.fakeServer.create();
         if (this.respondAfter)
         {
            this.server.autoRespondAfter = this.respondAfter;
         }
         server.autoRespond = true;
         server.xhr.useFilters = true;

         // Adds a filter to allow dynamic dependency requests to be processed normally...
         server.xhr.addFilter(function(method, url) {
           return !!url.match(/surf\/dojo\/xhr\/dependencies/) || !!url.match(/service\/sanitize\/data/);
         });
         this.setupServer();

         // Capture each request and log it...
         this.requests = [];
         aspect.before(this.server, "handleRequest", lang.hitch(this, this.updateLog));
      },

      /**
       * Build the HTML for displaying a request/response body on the page
       *
       * @instance
       * @param {object} body The body object (request or response)
       * @returns {string} The HTML
       */
      buildBodyHTML: function alfresco_testing_MockXhr__buildBodyHTML(body) {
         var bodyHTML = body;
         try {
            bodyHTML = JSON.parse(bodyHTML);
            bodyHTML = JSON.stringify(bodyHTML, null, 2);
         } catch (e) {
            // Ignore
         }
         return bodyHTML;
      },

      /**
       * Build the HTML for displaying headers on the page
       *
       * @instance
       * @param {object} headers The headers object (request or response)
       * @returns {string} The HTML
       */
      buildHeadersHTML: function alfresco_testing_MockXhr__buildHeadersHTML(headers) {
         var headersHtmlBuffer = [],
            headerName,
            headerValue;
         for (headerName in headers) {
            if (headers.hasOwnProperty(headerName)) {
               headerValue = headers[headerName];
               headersHtmlBuffer.push("<span class='nowrap'><strong>" + headerName + ":</strong> " + headerValue + "</span>");
            }
         }
         return (headersHtmlBuffer.length && headersHtmlBuffer.join("<br />")) || "N/A";
      },

      /**
       * This is an extension point function intended to be overridden by extending mock xhr services.
       * The extension should load binary data before the XMLHttpRequest object is overridden by Sinon
       * and the data loading call backs should call the [waitForServer]{@link module:aikauTesting/MockXhr#waitForServer}
       * function which will in turn call [setupServerWithBinaryData]{@link module:aikauTesting/MockXhr#setupServerWithBinaryData}
       * when the fake Sinon server is ready for configuring.
       *
       * @instance
       */
      loadBinaryData: function alfresco_testing_MockXhr__loadBinaryData() {
         // Extension point - no action required.
      },

      /**
       * This should be called from [loadBinaryData]{@link module:aikauTesting/MockXhr#loadBinaryData} once
       * binary data is loaded. It will call [setupServerWithBinaryData]{@link module:aikauTesting/MockXhr#setupServerWithBinaryData}
       * once the fake Sinon server is ready to be configured to return the binary data.
       *
       * @instance
       */
      waitForServer: function alfresco_testing_mockservices_MockXhr__waitForServer() {
         var _this = this;
         setTimeout(function() {
            if (!_this.server) {
               _this.alfLog("log", "Waiting for fake server...");
               _this.waitForServer();
            } else {
               _this.setupServerWithBinaryData();
            }
         }, 3000);
      },

      /**
       * This is an extension point function intended to be overridden by extending mock xhr services. It
       * is called from [waitForServer]{@link module:aikauTesting/MockXhr#waitForServer} and indicates that
       * both the binary data and the fake Sinon server are ready to use.
       *
       * @instance
       */
      setupServerWithBinaryData: function alfresco_testing_mockservices_MockXhr__setupServerWithBinaryData() {
         // Extension point - no action required.
      },

      /**
       * This is an extension point function intended to be overridden by extending mock xhr services. It should be
       * overridden to set up the fake server with all the responses it should provide.
       *
       * @instance
       */
      setupServer: function alfresco_testing_MockXhr__setupServer() {
         // Extension point - no action required.
         this.alfPublish("ALF_MOCK_XHR_SERVICE_READY", {});
      },

      /**
       * Adds the details of each XHR request to the log so that it can be queried by a unit test to
       * check that services are making appropriate requests for data.
       *
       * @instance
       * @param {object} xhrRequest The XHR request that was made
       */
      updateLog: function alfresco_testing_MockXhr__updateLog(xhrRequest) {

         // We need to know when the response has been completed
         var deferred = new Deferred(),
            stateComplete = 4;
         xhrRequest.addEventListener("readystatechange", function() {
            if (xhrRequest.readyState === stateComplete) {
               deferred.resolve();
            }
         });

         // Add a new row to the log
         var rowNode = domConstruct.create("tr", {
            className: "mx-row",
            "data-aikau-xhr-method": xhrRequest.method || "",
            "data-aikau-xhr-url": xhrRequest.url || "",
            "data-aikau-xhr-request-headers": (xhrRequest.requestHeaders && JSON.stringify(xhrRequest.requestHeaders)) || "",
            "data-aikau-xhr-request-body": xhrRequest.requestBody || ""
         }, this.logNode, "first");
         domConstruct.create("td", {
            className: "mx-method",
            innerHTML: xhrRequest.method,
            title: xhrRequest.method
         }, rowNode);
         domConstruct.create("td", {
            className: "mx-url",
            innerHTML: xhrRequest.url,
            title: xhrRequest.url
         }, rowNode);
         domConstruct.create("td", {
            className: "mx-request-headers",
            innerHTML: this.buildHeadersHTML(xhrRequest.requestHeaders),
            title: this.buildHeadersHTML(xhrRequest.requestHeaders)
         }, rowNode);
         domConstruct.create("td", {
            className: "mx-request-body",
            innerHTML: this.buildBodyHTML(xhrRequest.requestBody) || "&nbsp;",
            title: this.buildBodyHTML(xhrRequest.requestBody) || "&nbsp;"
         }, rowNode);
         var responseNode = domConstruct.create("td", {
            className: "mx-response",
            innerHTML: "Waiting..."
         }, rowNode);

         // Once we've had a response, add it to the log
         deferred.promise.then(lang.hitch(this, function() {

            // Construct headers HTML and tidy response text
            var headersHtml = this.buildHeadersHTML(xhrRequest.responseHeaders),
               responseHeaders = (xhrRequest.responseHeaders && JSON.stringify(xhrRequest.responseHeaders)) || "";
            var responseBody = (xhrRequest.responseText && lang.trim(xhrRequest.responseText)) || "N/A";

            // Build response info
            var responseHtml = xhrRequest.status + " (" + xhrRequest.statusText + ")<br />";
            responseHtml += "<em>Hover for more info ...</em>";
            responseHtml += "<dl class='mx-response__info'>";
            responseHtml += "<dt>Headers</dt>";
            responseHtml += "<dd>" + headersHtml + "</dd>";
            responseHtml += "<dt>Reponse body</dt>";
            responseHtml += "<dd>" + this.buildBodyHTML(responseBody) + "</dd>";
            responseHtml += "</dl>";

            // Add a new row to the log and update the data attribute
            responseNode.innerHTML = responseHtml;
            rowNode.setAttribute("data-aikau-xhr-response-headers", responseHeaders);
            rowNode.setAttribute("data-aikau-xhr-response-body", responseBody);
         }));
      },

      /**
       * Clear the log node
       *
       * @instance
       */
      _clearLog: function alfresco_testing_MockXhr___clearLog() {
         domConstruct.empty(this.logNode);
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
       * Toggle the body visibility for the log
       *
       * @instance
       */
      _toggleBody: function alfresco_testing_MockXhr___toggleBody() {
         domClass.toggle(this.domNode, "alfresco-testing-MockXhr--hide-body");
      }
   });
});