/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 *
 * @module aikauTesting/MockXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/MockXhr.html",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/aspect"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, lang, domConstruct, aspect) {
   
   return declare([ _WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/MockXhr.css"}]
       */
      cssRequirements: [{cssFile:"./css/MockXhr.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * Sets up the Sinon fake server.
       * 
       * @instance
       */
      constructor: function alfresco_testing_MockXhr__constructor(args) {
         lang.mixin(this, args);
         this.loadBinaryData();

         // Set-up a fake server to handle all the responses...
         this.server = sinon.fakeServer.create();
         this.server.autoRespond = true;
         this.setupServer();

         // Capture each request and log it...
         this.requests = [];
         aspect.before(this.server, "handleRequest", lang.hitch(this, this.updateLog));
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
         setTimeout(function () {
            if (_this.server == null) {
               _this.alfLog("log", "Waiting for fake server...");
               _this.waitForServer();
            }
            else
            {
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
      },

      /**
       * Adds the details of each XHR request to the log so that it can be queried by a unit test to 
       * check that services are making appropriate requests for data.
       * 
       * @instance
       * @param {object} xhrRequest The XHR request that was made
       */
      updateLog: function alfresco_testing_MockXhr__updateLog(xhrRequest) {
         var rowNode = domConstruct.create("tr", {
            className: "mx-row"
         }, this.logNode);
         domConstruct.create("td", {
            className: "mx-method",
            innerHTML: xhrRequest.method
         }, rowNode);
         domConstruct.create("td", {
            className: "mx-url",
            innerHTML: xhrRequest.url
         }, rowNode);
         domConstruct.create("td", {
            className: "mx-payload",
            innerHTML: (xhrRequest.requestBody != null) ? xhrRequest.requestBody : ""
         }, rowNode);
      }
   });
});
