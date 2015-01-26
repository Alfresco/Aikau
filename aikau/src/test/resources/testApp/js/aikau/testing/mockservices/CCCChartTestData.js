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
 * @module aikauTesting/mockservices/CCCChartTestData
 * @extends module:alfresco/core/Core
 * @author Erik Winlöf
 */
define(["dojo/_base/declare",
   "alfresco/core/Core",
   "dojo/_base/lang"],
      function(declare, AlfCore, lang) {

         return declare([AlfCore], {

            /**
             *
             *
             * @instance
             * @param {array} args The constructor arguments.
             */
            constructor: function alfresco_testing_mockservices_CCCChartTestData__constructor(args) {
               lang.mixin(this, args);
               this.alfSubscribe("GET_SAMPLE_CHART_DATA_1", lang.hitch(this, this.getSampleChartData1));
            },

            /**
             *
             * @instance
             * @param {object} payload
             */
            getSampleChartData1: function alfresco_testing_mockservices_CCCChartTestData__getSampleChartData1(payload) {
               var alfTopic = (payload.alfResponseTopic != null) ? payload.alfResponseTopic : "GET_SAMPLE_CHART_DATA_1";
               this.alfPublish(alfTopic + "_SUCCESS", {
                  response: {
                     data: {
                        "resultset": [
                           ["one-hundred", 100],
                           ["two-hundred", 200]
                        ],
                        "metadata": [{
                           "colIndex": 0,
                           "colType": "String",
                           "colName": "Name"
                        }, {
                           "colIndex": 1,
                           "colType": "Numeric",
                           "colName": "Value"
                        }]
                     },
                     dataDescriptor: {
                        crosstabMode: false,
                        seriesInRows: false
                     }
                  }
               });
            }
         });
      });
