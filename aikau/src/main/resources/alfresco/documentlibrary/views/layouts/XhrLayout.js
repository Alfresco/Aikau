/**
 * Copyright (C) 2005-2015 Alfresco Software Limited.
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
 * @module alfresco/documentlibrary/views/layouts/XhrLayout
 * @extends module:alfresco/lists/views/layouts/XhrLayout
 * @author Dave Draper
 * @deprecated Since 1.0.4 - Use [alfresco/lists/views/layouts/XhrLayout]{@link module:alfresco/lists/views/layouts/XhrLayout} instead.
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/layouts/XhrLayout"], 
        function(declare, XhrLayout) {
   return declare([XhrLayout], {}
);});