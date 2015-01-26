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
 * A Bar Chart
 *
 * @module alfresco/charts/ccc/BarChart
 * @extends module:alfresco/charts/ccc/Chart
 * @author Erik Winlöf
 */
define(["dojo/_base/declare",
   "alfresco/core/Core",
   "alfresco/core/I18nUtils",
   "alfresco/charts/ccc/Chart"],
      function(declare, AlfCore, I18nUtils, Chart) {

         var i18nScope = "alfresco.reports.BarChart";

         return declare([Chart], {

            /**
             * The Protovis class that will be wrapped inside this widget.
             *
             * @instance
             * @type {string}
             */
            pvcChartType: "BarChart",

            /**
             * The chart orientation indicates if the direction or the bars is vertical or horizontal. 
             *
             * For more details visit:
             * {@link http://www.webdetails.pt/ctools/charts/jsdoc/symbols/pvc.options.charts.BarChart.html#orientation}
             *
             * @instance
             * @default "vertical"
             */
            orientation: "vertical",

            /**
             * An array of the i18n files to use with this widget.
             *
             * @instance
             * @type {object[]}
             * @default [{i18nFile: "./i18n/PieChart.properties"}]
             */
            i18nRequirements: [{i18nFile: "./i18n/BarChart.properties"}],

            createChartConfig: function alfresco_charts_ccc_BarChart__createChartConfig(){
               var config = this.inherited(arguments);

               // BarChart specific options
               if (this.orientation)
               {
                  config.orientation = this.orientation;
               }

               return config;
            }

         });
      });