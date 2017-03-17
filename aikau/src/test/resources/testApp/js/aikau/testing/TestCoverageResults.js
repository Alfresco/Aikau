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
 * This widget is intended purely for the purpose of collecting and submitting code coverage
 * data generated when running widget unit tests. It relies on the source code having been 
 * offline-instrumented using the "node-coverage" (https://github.com/piuccio/node-coverage)
 * application. If instrumentation data is available then this widget can be used to send
 * the coverage data to a node-coverage server.
 * 
 * Because the node-coverage server is likely to be on a different host (mostly because
 * node-coverage is a Node.js application and the widgets will be running on a JEE stack)
 * it is necessary to use a form POST to submit the data cross-origin.
 *
 * @module aikauTesting/TestCoverageResults
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./templates/TestCoverageResults.html",
        "alfresco/core/Core"], 
        function(declare, _Widget, _Templated, _OnDijitClickMixin, template, Core) {
   
   return declare([_Widget, _Templated, _OnDijitClickMixin, Core], {
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * This is the host and port of the "node-coverage" server to use to submit the coverage
       * results to.
       *
       * @instance
       * @type {string}
       * @default
       */
      nodeCoverageServer: "192.168.56.1:8082",

      /**
       * Ensure that the [nodeCoverageServer]{@link module:aikau/testing/TestCoverageResults#nodeCoverageServer}
       * is set correctly. This ensures that coverage results can be posted when running the test on a VM
       *
       * @instance
       */
      postMixInProperties: function alfresco_testing_TestCoverageResults__postMixInProperties() {
         this.inherited(arguments);
         this.nodeCoverageServer = location.hostname + ":8082";
      },

      /**
       * This is the input field that will be used to post the coverage results to the
       * coverage server.
       *
       * @instance
       * @type {element}
       * @default
       */
      coverageField: null,

      /**
       * This function is called whenever the submit button is clicked. It is designed to grab
       * the coverage results and set them in the input field before the form is submitted.
       *
       * @instance
       */
      captureCoverageResults: function alfresco_testing_TestCoverageResults__captureCoverageResults(evt) {
         this.alfLog("log", "Grab coverage results");
         if ($$_l === undefined)
         {
            // If the $$_l variable is undefined then this means that the code being run is
            // NOT instrumented and will not generate any code coverage results. It also means
            // that there isn't even any data to post. Don't do anything except issue a warning
            // this.alfLog("warn", "Code coverage data not avaialable");
         }
         else
         {
            this.alfLog("log", "Getting code coverage data...");
            try
            {
               var coverageData = {
                  name : name || "",
                  lines : $$_l.lines,
                  runLines : $$_l.runLines,
                  code : $$_l.code,
                  allConditions : $$_l.allConditions,
                  conditions : $$_l.conditions,
                  allFunctions : $$_l.allFunctions,
                  runFunctions : $$_l.runFunctions
               };
               var serializedData = JSON.stringify(coverageData);
               // this.alfLog("log", "Setting serialized data...");
               this.coverageField.value = serializedData;
            }
            catch (e)
            {
               this.alfLog("error", "An error occurred collecting code coverage data", e);
            }
         }
      }
   });
});