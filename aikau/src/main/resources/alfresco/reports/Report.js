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
 * Abstract Report class
 *
 * @module alfresco/reports/Report
 * @extends module:alfresco/core/ProcessWidgets
 * @abstract
 *
 * @author Erik Winlöf
 */
define(["alfresco/core/ProcessWidgets",
   "dojo/_base/declare",
   "dojo/_base/lang"],
      function(ProcessWidgets, declare, lang) {

         return declare([ProcessWidgets], {

            /**
             * The CSS class (or a space separated list of classes) to include in the DOM node.
             *
             * @instance
             * @type {string}
             * @default "alfresco-reports-Report"
             */
            baseClass: "alfresco-reports-Report",

            /**
             * Creates the widgets as defined in widgets
             *
             * @instance
             */
            postCreate: function alfresco_reports_Report__postCreate() {
               if (this.widgets)
               {
                  this.processWidgets(lang.clone(this.widgets), this.containerNode);
               }
            }
         });
      });