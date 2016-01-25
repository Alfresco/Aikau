/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * @module alfresco/core/UrlUtils
 * @extends module:alfresco/core/UrlUtilsMixin
 * @author Martin Doyle
 * @deprecated Since 1.0.25 - please see either [alfresco/util/urlUtils]{@link module:alfresco/util/urlUtils}
 *             or [alfresco/core/UrlUtilsMixin]{@link module:alfresco/core/UrlUtilsMixin} for URL utility
 *             functions instead.
 */
define(["dojo/_base/declare",
        "alfresco/core/UrlUtilsMixin"], 
        function(declare, UrlUtilsMixin) {

   return declare([UrlUtilsMixin], {});
});