/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * This module returns a "sentinel" object that can be added as a marker data item in an 
 * [AlfListView]{@link module:alfresco/lists/views/AlfListView} to indicate that the item
 * represents a request to render a configured appendix model. This allows views to be
 * configured so that they can include a model for adding new items into the existing list.
 * 
 * @module alfresco/lists/views/RenderAppendixSentinel
 * @author Dave Draper
 */
define([], function() {
   return {
      renderAppendix: true
   };
});