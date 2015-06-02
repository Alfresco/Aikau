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
 * @module alfresco/documentlibrary/AlfDocumentListInfiniteScroll
 * @extends external:dijit/_WidgetBase
 * @mixes module:alfresco/services/InfiniteScrollService
 * @author David Webster
 * @deprecated Since 1.0.20 - Use [alfresco/services/InfiniteScrollService]{@link module:alfresco/services/InfiniteScrollService} as a service instead.
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "alfresco/services/InfiniteScrollService"], 
        function(declare, _WidgetBase, InfiniteScrollService) {
   return declare([_WidgetBase, InfiniteScrollService], {});
});