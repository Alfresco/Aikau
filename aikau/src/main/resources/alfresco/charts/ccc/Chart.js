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
 * @module alfresco/charts/ccc/Chart
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @abstract
 *
 * @author Erik Winlöf
 */
define(["dojo/_base/declare",
   "dijit/_WidgetBase",
   "dijit/_TemplatedMixin",
   "dojo/text!./templates/Chart.html",
   "alfresco/core/Core",
   "alfresco/core/CoreWidgetProcessing",
   "alfresco/core/DomElementUtils",
   "dojo/_base/lang",
   "dojo/on",
   "dojo/dom-geometry",
   "dojo/dom-style"],
      function(declare, _WidgetBase, _TemplatedMixin, template,
               AlfCore, CoreWidgetProcessing, DomElementUtils, lang, dojoOn, domGeom, domStyle) {

         return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, DomElementUtils], {

            /**
             * The base css class to use for this widget
             *
             * @instance
             * @type {string}
             * @default "alfresco-charts-ccc-Chart"
             */
            baseClass: "alfresco-charts-ccc-Chart",

            /**
             * The Protovis class that will be wrapped inside this widget.
             * Note! MUST be overridden by a sub class.
             *
             * @instance
             * @type {string}
             */
            pvcChartType: null,

            /**
             * Any additional configuration attributes for the chart can be set here
             * 
             * <p>Options set here will override anything set via another named property.</p>
             *
             * @instance
             * @type {object}
             */
            chartConfig: null,

            /**
             * The charts container element (will be set by dojo)
             * @instance
             * @type {HTMLElement}
             */
            chartNode: null,

            /**
             * The topic to publish when requesting chart data
             *
             * @instance
             * @type {string}
             */
            dataTopic: null,

            /**
             * The initial payload of the [dataTopic]{@link module:alfresco/charts/ccc/Chart#dataTopic}.
             *
             * @instance
             */
            dataTopicPayload: {},

            /**
             * The topic to publish when chart data item has been clicked.
             *
             * @instance
             * @type {string}
             */
            clickTopic: null,

            /**
             * The chart title
             *
             * @instance
             * @type {string}
             */
            title: null,

            /**
             * The position of the chart title
             *
             * @instance
             * @type {string}
             */
            titlePosition: "bottom",

            /**
             * The width in pixels of the chart. A null value indicates 100%
             *
             * @instance
             * @type {number|null}
             * @default null
             */
            width: null,

            /**
             * The height in pixels.
             *
             * @instance
             * @type {number}
             * @default 400
             */
            height: 400,

            /**
             * Decides if a legend shall be displayed and if so how it should appear.
             *
             * For more details see:
             * {@link http://www.webdetails.pt/ctools/charts/jsdoc/symbols/pvc.options.panels.LegendPanel.html}
             *
             * @instance
             * @type {boolean|pvc.options.panels.LegendPanel}
             * @default false
             */
            legend: false,

            /**
             * Indicates if the chart's visual elements can be selected by the user, by clicking on them or using the
             * rubber-band.
             *
             * @instance
             * @type {boolean}
             * @default false
             */
            selectable: false,

            /**
             * Indicates if the chart's visual elements are automatically highlighted when the user hovers over them
             * with the mouse.
             *
             * @instance
             * @type {boolean}
             * @default false
             */
            hoverable: false,

            /**
             * Indicates if tooltips are enabled and contains additional tooltip presentation options.
             *
             * For more details see:
             * {@link http://www.webdetails.pt/ctools/charts/jsdoc/symbols/pvc.options.Tooltip.html}
             *
             * @instance
             * @type {pvc.options.Tooltip}
             * @default { enabled: true }
             */
            tooltip: {
               enabled: true
            },

            /**
             * An array of dimensions readers.
             * Can be specified to customize the translation process of the data source.
             *
             * For more details see:
             * {@link http://www.webdetails.pt/ctools/charts/jsdoc/symbols/pvc.options.DimensionsReader.html}
             *
             * @instance
             * @type {null|pvc.options.DimensionsReader}
             * @default null
             */
            readers: null,

            /**
             * A map whose keys are the dimension type names and whose values are the dimension type options.
             *
             * For more details see:
             * {@link http://www.webdetails.pt/ctools/charts/jsdoc/symbols/pvc.options.DimensionType.html}
             *
             * @instance
             * @type {null|pvc.options.DimensionType}
             * @default null
             */
            dimensions: null,

            /**
             * Extension points for the chart, will vary depending on the CCC2 class.
             *
             * For more details visit:
             * {@link http://www.webdetails.pt/ctools/charts/jsdoc/symbols/pvc.options.ext.ChartExtensionPoints.html}
             */
            extensionPoints: null,

            /**
             * Variable for storing the current data
             *
             * @instance
             * @type {object}
             */
            _currentData: null,

            /**
             * Variable for storing meta data about the current data
             *
             * @instance
             * @type {object}
             */
            _currentDataDescriptor: null,

            /**
             * Declare the dependencies on "legacy" JS files that this widget is wrapping.
             *
             * @instance
             * @type {string[]}
             */
            nonAmdDependencies: [
               "/js/lib/ctools/jquery.js",
               "/js/lib/ctools/protovis.js",
               "/js/lib/ctools/protovis-msie.js",
               "/js/lib/ctools/jquery.tipsy.js",
               "/js/lib/ctools/tipsy.js",
               "/js/lib/ctools/def.js",
               "/js/lib/ctools/pvc.js"
            ],

            /**
             * An array of the CSS files to use with this widget.
             *
             * @instance cssRequirements {Array}
             * @type {object[]}
             * @default [{cssFile:"./css/Chart.css"}]
             */
            cssRequirements: [
               {cssFile:"./css/Chart.css"},
               {cssFile:"/js/lib/ctools/tipsy.css"}
            ],

            /**
             * The HTML template to use for the widget.
             *
             * @instance
             * @type {string}
             */
            templateString: template,

            /**
             * Subscribes to the data topic
             *
             * @instance
             */
            postMixInProperties: function alfresco_charts_ccc_Chart__postMixInProperties() {
               if (this.dataTopic) {
                  // Subscribe to the topics that will be published on by the ReportService when retrieving data
                  // that this widget requests...
                  this.alfSubscribe(this.dataTopic + "_SUCCESS", lang.hitch(this, this.onDataLoadSuccess));
                  this.alfSubscribe(this.dataTopic + "_FAILURE", lang.hitch(this, this.onDataLoadFailure));
               }
            },

            /**
             * Creates and returns the chart config
             *
             * @instance
             * @return {object}
             */
            createChartConfig: function(){
               var config = {};

               // Common configurable properties
               config.canvas = this.chartNode;

               config.width = this._getWidth();
               config.height = this.height;

               config.title = this.title;
               config.titlePosition = this.titlePosition;

               config.legend = this.legend;

               config.selectable = this.selectable;
               config.hoverable = this.hoverable;

               if (this.readers) {
                  config.readers = this.readers;
               }
               if (this.dimensions) {
                  config.dimensions = this.dimensions;
               }
               if (this.extensionPoints) {
                  config.extensionPoints = this.extensionPoints;
               }

               if (this.clickTopic)
               {
                  config.clickable = true;
                  config.clickAction = lang.hitch(this, this.onItemClick);
               }

               config.tooltip = this.tooltip;

               var styles = this.resolveCssStyles(this.baseClass + "--color", [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21], {
                  backgroundColor: ["rgba(0, 0, 0, 0)", "transparent"]
               });
               config.colors = styles.backgroundColor;

               // Set any additional chart options
               if (typeof this.chartConfig == "object")
               {
                  for (var p in this.chartConfig)
                  {
                     config[p] = this.chartConfig[p];
                  }
               }

               return config;
            },

            /**
             * Creates the CCC chart.
             *
             * @instance
             */
            createChart: function alfresco_charts_ccc_Chart__createChart(){
               this.chart = new pvc[this.pvcChartType](this.createChartConfig());
            },

            /**
             * Called when a chart item is clicked, will publish a topic with the name defined in the
             * [clickTopic]{@link module:alfresco/charts/ccc/Chart#clickTopic}
             *
             * @param scene {object}
             */
            onItemClick: function(scene){
               this.alfPublish(this.clickTopic, scene.atoms.category.rawValue);
            },

            /**
             * Sets up topic subscriptions and makes sure the chart is resized when the window is resized.
             *
             * @instance
             */
            postCreate: function alfresco_charts_ccc_Chart__postCreate() {
               if (this.dataTopic) {
                  // Set a response topic that is scoped to this widget...
                  var dataTopicPayload = this.dataTopicPayload || {};
                  dataTopicPayload.alfResponseTopic = this.dataTopic;
                  this.alfPublish(this.dataTopic, dataTopicPayload);
               }

               var me = this;
               var lastResizeEvent;
               var skippedResizeEvents = 0;

               function doResize() {
                  // Avoid re-rendering until the chart has been rendered a first time
                  if (me.chart) {
                     me._renderChart();
                  }
               }

               function onResize() {
                  if (lastResizeEvent) {
                     clearTimeout(lastResizeEvent);
                     skippedResizeEvents++;
                     if (skippedResizeEvents > 1) {
                        skippedResizeEvents = 0;
                        me._renderChart();
                        return;
                     }
                  }
                  lastResizeEvent = window.setTimeout(doResize, 100);
               }
               dojoOn(window, "resize", onResize);
            },

            /**
             * Shows the data in the chart
             *
             * @instance
             * @param data {object} The data to display
             * @param dataDescriptor {object} Metadata description about the data 
             */
            showData: function(data, dataDescriptor){
               this._currentData = data;
               this._currentDataDescriptor = dataDescriptor;
               this._renderChart();
            },

            /**
             * Renders the chart.
             *
             * @instance
             */
            _renderChart: function(){
               if (this._getWidth()) {
                  this._performRenderChart();
                  return;
               }

               // This element has not been added to the dom yet and has therefor no width, wait until its set
               var me = this;
               var timeoutId;
               function callPerformRenderChartWhenReady(){
                  if (me._getWidth()) {
                     clearTimeout(timeoutId);
                     me._performRenderChart();
                  }
               }
               timeoutId = window.setInterval(callPerformRenderChartWhenReady, 100);
            },

            /**
             * Performs the actual rendering of the chart.
             *
             * @instance
             */
            _performRenderChart: function(){
               this.createChart();
               this.chart.setData(this._currentData, this._currentDataDescriptor);
               this.chart.render(true, true, false);
            },

            /**
             * Calculates the width (in pixels) of an element.
             *
             * @return {null|number}
             * @private
             */
            _getWidth: function(){
               try {
                  var style = domStyle.getComputedStyle(this.domNode);
                  var s = domGeom.getContentBox(this.domNode, style);
                  var w = (s.w + "").split('.')[0];
                  w = w.split('px')[0];
                  w = parseInt(w);
                  return w;
               }
               catch(e) {
                  return null;
               }
            },

            /**
             * Called when chart is loaded.
             *
             * @param payload {object}
             */
            onDataLoadSuccess: function(payload){
               this.showData(payload.response.data, payload.response.dataDescriptor);
            },

            /**
             * Called when chart data failed to load.
             *
             * @param payload {object}
             */
            onDataLoadFailure: function(payload){
               this.showData({}, {});
            }

         });
      });