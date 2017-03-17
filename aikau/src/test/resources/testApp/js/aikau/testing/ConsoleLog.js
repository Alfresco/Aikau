/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * @module aikauTesting/ConsoleLog
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Richard Smith
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/ConsoleLog.html",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/dom-attr",
        "dojo/sniff"], 
        function(declare, _Widget, _Templated, template, Core, lang, domConstruct, domAttr, has) {

   return declare([_Widget, _Templated, Core], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/ConsoleLog.css"}]
       */
      cssRequirements: [{cssFile:"./css/ConsoleLog.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * Boolean to record the loaded state.
       * @instance
       * @type {boolean}
       */
      hasLoaded: false,

      /**
       * Array for storing logs before the widget has fully loaded.
       * @instance
       * @type {array}
       */
      storedLogs: [],

      /**
       * Activate the console logging intercepter.
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_testing_ConsoleLog__constructor(args) {
         this._consoleTakeOver();
      },

      /**
       * Once the widget has finished rendering, set hasLoaded to true and write stored logs.
       * @instance
       */
      postCreate: function alfresco_testing_ConsoleLog__postCreate() {
         this.hasLoaded = true;
         this._writeStoredLogs();
      },

      /**
       * Intercept the console logging
       * @instance
       */
      _consoleTakeOver: function alfresco_testing_ConsoleLog___consoleTakeOver(){
         var console = window.console,
             consoleContext = this;

         if (!console) return;

         function intercept(method){
            var original = console[method];
            console[method] = function(){

               if(arguments.length > 0)
               {
                  consoleContext._recordLog(arguments);
               }

               if (original.apply){
                  original.apply(console, arguments);
               }else{
                  // IE version
                  var message = Array.prototype.slice.apply(arguments).join(' ');
                  original(message);
               }
            };
         }
         var methods = ['log', 'warn', 'error'];
         for (var i = 0; i < methods.length; i++)
         {
            intercept(methods[i]);
         }

      },

      /**
       * Get a composed log row and write it to the log or to the storedLogs
       * @instance
       */
      _recordLog: function alfresco_testing_ConsoleLog___recordLog(args){
         var row = this._composeLogRow(args);
         if(this.hasLoaded)
         {
            domConstruct.place(row, this.logNode);
         }
         else
         {
            this.storedLogs.push(row);
         }
      },

      /**
       * Compose a row for the logging from the message
       * @instance
       */
      _composeLogRow: function alfresco_testing_ConsoleLog___composeLogRow(args){
         var rowNode = domConstruct.create("tr", {
            className: "cl-row"
         });
         domConstruct.create("td", {
            className: "cl-message",
            innerHTML: args[0]
         }, rowNode);
         var objTdNode = domConstruct.create("td", {
            className: "cl-object"
         }, rowNode);
         try {
            domConstruct.create("pre", {
               innerHTML: args[1] ? this._syntaxHighlight(args[1]) : ""
            }, objTdNode);
         }
         catch(err) {}
         domConstruct.create("td", {
            className: "cl-object",
            innerHTML: args[2] ? args[2] : ""
         }, rowNode);
         return rowNode;
      },

      /**
       * Write logs that have been recorded before the template has been drawn, to the output.
       * @instance
       */
      _writeStoredLogs: function alfresco_testing_ConsoleLog___writeStoredLogs(){
         for(var i=0; i<this.storedLogs.length; i++)
         {
            domConstruct.place(this.storedLogs[i], this.logNode);
         }
      },

      _syntaxHighlight: function alfresco_testing_ConsoleLog___syntaxHighlight(json){

         if(typeof json != 'string')
         {
            json = JSON.stringify(json, undefined, 2);
         }

         json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

         return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if(/^"/.test(match))
            {
               if (/:$/.test(match))
               {
                  cls = 'key';
               }
               else
               {
                  cls = 'string';
               }
            }
            else if (/true|false/.test(match))
            {
               cls = 'boolean';
            }
            else if (/null/.test(match))
            {
               cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
         });
      }
   });
});