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
 * A donut chart widget wrapping the CCC2 pie chart class
 *
 * @module alfresco/charts/ccc/DonutChart
 * @extends module:alfresco/charts/ccc/PieChart
 * @author Erik Winlöf
 */
define(["dojo/_base/declare",
   "alfresco/core/Core",
   "alfresco/core/I18nUtils",
   "alfresco/charts/ccc/PieChart"],
      function(declare, AlfCore, I18nUtils, PieChart) {

         return declare([PieChart], {

            /**
             * Adds spacing between the pie slices.
             *
             * @instance
             */
            explodedSliceRadius: '1%',

            /**
             * Adds a margin into the centre of the pie chart, making it look like a donut instead.
             *
             * @instance
             */
            extensionPoints: {
               slice_innerRadiusEx: '20%'
            }

         });
      });
