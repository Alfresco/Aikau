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
 * Extends the abstract [document list view]{@link module:alfresco/lists/views/AlfListView}
 * to provide a specific set of instructions to display when no search results are available. This advice is in the
 * form of a bulleted ordered list and is configurable through the [searchAdvice attribute]{@link module:alfresco/search/AlfSearchListView#searchAdvice}
 *
 * @module alfresco/search/AlfSearchListView
 * @extends module:alfresco/lists/views/AlfListView
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/AlfListView"], 
        function(declare, AlfListView) {
   
   return declare([AlfListView], {
      
      /**
       * The configuration for selecting the view (configured the menu item)
       * @instance
       * @type {object}
       * @property {string|null} label The label or message key for the view (as appears in the menus)
       * @property {string|null} iconClass The class to place next to the label
       */
      viewSelectionConfig: {
         label: "doclist.view.detailed.label",
         iconClass: "alf-detailedlist-icon"
      },
      
      /**
       * Returns the name of the view that is used when saving user view preferences.
       * 
       * @instance
       * @returns {string} "detailed"
       */
      getViewName: function alfresco_documentlibrary_views_AlfDocumentListView__getViewName() {
         return "detailed";
      },
      
      /**
       * The definition of how a single item is represented in the view. 
       * 
       * @instance
       * @type {object[]}
       */
      widgets: [
         {
            name: "alfresco/search/AlfSearchResult"
         }
      ]
   });
});