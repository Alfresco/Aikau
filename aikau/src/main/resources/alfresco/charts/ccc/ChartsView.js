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
 * A base class for charts
 *
 * @module alfresco/charts/css/ChartsView
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Erik Winlöf
 */
define(["dojo/_base/declare",
   "dijit/_WidgetBase",
   "dijit/_TemplatedMixin",
   "dojo/text!./templates/ChartsView.html",
   "./Chart",
   "alfresco/core/Core",
   "alfresco/core/CoreWidgetProcessing",
   "dojo/_base/lang",
   "dojo/_base/array",
   "dojo/dom-construct",
   "dojo/dom-class",
   "dojo/date",
   "dojo/date/stamp"],
      function(declare, _WidgetBase, _TemplatedMixin, template, Chart,
               AlfCore, CoreWidgetProcessing, lang, array, domConstruct, domClass, date, stamp) {

         return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {

            /**
             * The base css class to use for this widget
             *
             * @instance
             * @type {string}
             * @default "alfresco-charts-ccc-Chart"
             */
            baseClass: "alfresco-charts-ccc-ChartsView",

            /**
             * The HTML template to use for the widget.
             *
             * @instance
             * @type {string}
             */
            templateString: template,


            /**
             * The container element that holds the charts (will be set by dojo)
             * @instance
             * @type {HTMLElement}
             */
            chartsNode: null,

            /**
             * Publication of this topic will cause this widget to publish an event with the same name as
             * [dataRequestTopic]{@link module:alfresco/charts/css/ChartsView#dataRequestTopic} and with a payload set to the payload merged with
             * all previous payloads.
             *
             * @instance
             */
            subscriptionTopic: null,

            /**
             * The topic to publish to request chart data.
             *
             * @instance
             */
            dataRequestTopic: null,

            /**
             * The initial payload of the [dataRequestTopic]{@link module:alfresco/charts/css/ChartsView#dataRequestTopic}.
             *
             * @instance
             */
            dataRequestPayload: {},

            /**
             * The current payload of the [dataRequestTopic]{@link module:alfresco/charts/css/ChartsView#dataRequestTopic}
             */
            _currentDataRequestPayload: {},

            /**
             * Instance of the chart currently being displayed
             *
             * @instance
             */
            _chart: null,

            /**
             * Instances of the charts to display
             *
             * @instance
             */
            _chartMap: null,

            /**
             * The topic to publish when a chart selection has been made
             *
             * @instance
             */
            chartSelectionTopic: null,

            /**
             * The currently selected chart
             *
             * @instance
             */
            _currentlySelectedChart: null,

            /**
             * Sets up subscriptions to the topics
             */
            postMixInProperties: function() {
               if (this.subscriptionTopic)
               {
                  this.alfSubscribe(this.subscriptionTopic, lang.hitch(this, this.onSubscriptionTopic));
               }
               if (this.dataRequestTopic)
               {
                  this.alfSubscribe(this.dataRequestTopic + "_SUCCESS", lang.hitch(this, this.onDataRequestTopicSuccess));
                  this.alfSubscribe(this.dataRequestTopic + "_FAILURE", lang.hitch(this, this.onDataRequestTopicFailure));
               }
            },

            /**
             * Iterates over the widgets processed and calls the [registerChart]{@link module:alfresco/charts/ccc/ChartsView#registerChart}
             * function with each one.
             *
             * @instance
             * @param {object[]} The widgets to create
             */
            allWidgetsProcessed: function(widgets) {
               array.forEach(widgets, lang.hitch(this, this.registerChart));

               if (this.chartSelectionTopic) {
                  this.alfPublish(this.chartSelectionTopic, {
                     value: this._currentlySelectedChart
                  });
               }

               this._currentDataRequestPayload = lang.mixin({}, this.dataRequestPayload);
               this.requestData();
            },

            /**
             * Creates the charts as defined in [widgets]{@link module:alfresco/charts/css/ChartsView#widgets}
             *
             * @instance
             */
            postCreate: function() {
               this._chartMap = {};

               if (this.widgets) {
                  this.processWidgets(this.widgets);
               }
            },

            /**
             * Publishes a topic with the name defined in
             * [dataRequestTopic]{@link module:alfresco/charts/css/ChartsView#dataRequestTopic} to request data
             *
             * @instance
             */
            requestData: function() {
               this._currentDataRequestPayload.alfResponseTopic = this.dataRequestTopic;
               this.alfPublish(this.dataRequestTopic, this._currentDataRequestPayload);
            },

            /**
             * Makes the current chart display new data.
             *
             * @param data {object} The data
             * @param dataDescriptor {object} Metadata describing data
             */
            onDataRequestTopic: function(data, dataDescriptor) {
               var chart = this._chartMap[this._currentlySelectedChart];
               if (chart != null) {
                  chart.showData(data, dataDescriptor);
                  this.showChart(chart);
               }
            },

            /**
             * Called when the chart data has been successfully returned.
             *
             * @instance
             * @param payload
             */
            onDataRequestTopicSuccess: function(payload) {
               this.onDataRequestTopic(payload.response.data, payload.response.dataDescriptor);
            },

            /**
             * Called when the chart data has been successfully returned.
             *
             * @instance
             */
            onDataRequestTopicFailure: function() {
               this.onDataRequestTopic({}, {});
            },

            /**
             * Called when the topic defined in
             * [subscriptionTopic]{@link module:alfresco/charts/css/ChartsView#subscriptionTopic} has been called.
             *
             * @param payload
             */
            onSubscriptionTopic: function(payload) {
                var now = stamp.toISOString(new Date(), { selector: "date" });
                var startDate = payload.startDate, endDate = payload.endDate;
                var getStartDate = function(timePeriod) {
                   switch (timePeriod)
                   {
                      case "TODAY":
                          return now;
                      case "7D":
                          return stamp.toISOString(date.add(new Date(), "day", -7), { selector: "date" });
                      case "30D":
                          return stamp.toISOString(date.add(new Date(), "day", -30), { selector: "date" });
                      case "YEAR":
                          return stamp.toISOString(date.add(new Date(), "year", -1), { selector: "date" });
                      case "CUSTOM":
                          return startDate;
                      default:
                         break;
                   }
                    return startDate;
                };
                var getEndDate = function(timePeriod) {
                   if (timePeriod == "CUSTOM") {
                      return endDate;
                   } else {
                      return now;
                   }
                };
                if (payload.timePeriod) {
                    payload.startDate = getStartDate(payload.timePeriod);
                    payload.endDate = getEndDate(payload.timePeriod);
                }
               lang.mixin(this._currentDataRequestPayload, payload);
               this.requestData();
            },

            /**
             * Registers a chart with a given name.
             *
             * @instance
             * @param chart
             * @param name
             */
            registerChart: function (chart, name) {
               if (chart instanceof Chart)
               {
                  this.alfLog("log", "Registering Chart", chart);

                  var chartName = name;

                  // Check if this is the initially requested chart...
                  if (chartName == this._chart || (!this._currentlySelectedChart && !this._chart))
                  {
                     this._currentlySelectedChart = chartName;
                  }

                  // Step 2: Add the chart to the map of known charts...
                  this._chartMap[chartName] = chart;
               }
               else
               {
                  this.alfLog("warn", "The following widget was provided as a chart, but it does not inherit from 'alfresco/charts/ccc/Chart'", chart);
               }
            },

            /**
             * Shows a chart and hiddes the pother charts using the CSS class "share-hidden".
             *
             * @instance
             * @param chart
             */
            showChart: function(chart) {
               this.hideChildren(this.domNode);
               if (this.chartsNode.children.length > 0)
               {
                  this.chartsNode.removeChild(this.chartsNode.children[0]);
               }

               // Add the new chart...
               domConstruct.place(chart.domNode, this.chartsNode);
               domClass.remove(this.chartsNode, "share-hidden");
            },

            /**
             * Hides all the children of the supplied DOM node by applying the "share-hidden" CSS class to them.
             *
             * @instance
             * @param {Element} targetNode The DOM node to hide the children of.
             */
            hideChildren: function(targetNode) {
               array.forEach(targetNode.children, function(node) {
                  domClass.add(node, "share-hidden");
               });
            }

         });
      });