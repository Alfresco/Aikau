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
 * TopSiteContributorReportDashlet
 *
 * @module alfresco/reports/TopSiteContributorReportDashlet
 * @extends alfresco/dashlets/Dashlet
 * @author Erik Winlöf
 */
define(["dojo/_base/declare",
   "alfresco/core/Core",
   "alfresco/core/I18nUtils",
   "alfresco/dashlets/Dashlet",
   "dojo/_base/lang"],
      function(declare, AlfCore, I18nUtils, Dashlet) {

         return declare([Dashlet], {

            /**
             * The i18n scope to use for this widget.
             *
             * @instance
             */
            i18nScope: "alfresco.reports.TopSiteContributorReportDashlet",

            /**
             * An array of the i18n files to use with this widget.
             *
             * @instance
             * @type {object[]}
             * @default [{i18nFile: "./i18n/TopSiteContributorReportDashlet.properties"}]
             */
            i18nRequirements: [{i18nFile: "./i18n/TopSiteContributorReportDashlet.properties"}],

            /**
             * The widgets to be processed to generate each item in the rendered view.
             *
             * @instance
             * @type {object[]}
             * @default null
             */
            widgetsForBody: [
               {
                  name: "alfresco/reports/TopSiteContributorReport",
                  config: {
                     title: ""
                  }
               }
            ]

         });
      });