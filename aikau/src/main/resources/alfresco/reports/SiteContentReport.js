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
 * SiteContentReport displays a chart giving an overview of the type of content that exist in the current site.
 *
 * @module alfresco/reports/SiteContentReport
 * @extends module:alfresco/reports/Report
 * @author Erik Winlöf
 */
define(["dojo/_base/declare",
   "alfresco/core/Core",
   "alfresco/core/I18nUtils",
   "alfresco/reports/Report"],
      function(declare, AlfCore, I18nUtils, Report) {
         var i18nScope = "alfresco.reports.SiteContentReport";
         return declare([Report], {

            /**
             * An array of the i18n files to use with this widget.
             *
             * @instance
             * @type {object[]}
             * @default [{i18nFile: "./i18n/SiteContentReport.properties"}]
             */
            i18nRequirements: [{i18nFile: "./i18n/SiteContentReport.properties"}],

            /**
             * Declare the dependencies on "legacy" JS files that this is wrapping.
             *
             * @instance
             * @type {string[]}
             * @default ["/js/alfresco.js"]
             */
            nonAmdDependencies: ["/js/alfresco.js"],

            /**
             * The widgets to be processed to generate each item in the rendered view.
             *
             * @instance
             * @type {object[]}
             * @default null
             */
            widgets: [
               {
                  name: "alfresco/charts/ccc/PieChart",
                  config: {
                     dataTopic: "ALF_RETRIEVE_SITE_CONTENT_REPORT",
                     dataTopicPayload: {
                        site: Alfresco.constants.SITE // todo replace with $$SITE$$ once supported
                     },
                     readers: [
                        { names: 'category', indexes: 0 },
                        { names: 'value', indexes: 2 }
                     ],
                     explodedSliceRadius: null,
                     selectable: false,
                     hoverable:  true,
                     extensionPoints: {
                        slice_innerRadiusEx: '55%',
                        slice_strokeStyle: 'white'
                     },
                     tooltip: {
                        format: function(scene){
                           var tooltip = '<div style="text-align: left;">';
                           tooltip += '<strong>' + Alfresco.util.encodeHTML(scene.datum.atoms.category.value) + '</strong><br/>';
                           tooltip += I18nUtils.msg(i18nScope, "count", Alfresco.util.encodeHTML(scene.datum.atoms.value.value), Alfresco.util.encodeHTML(scene.vars.value.percent.label)) + '<br/>';
                           tooltip += I18nUtils.msg(i18nScope, "sum", Alfresco.util.encodeHTML(Alfresco.util.formatFileSize(scene.datum.atoms.value2.value)));
                           tooltip += '</div>';
                           return tooltip;
                        }
                     }
                  }
               }
            ]

         });
      });