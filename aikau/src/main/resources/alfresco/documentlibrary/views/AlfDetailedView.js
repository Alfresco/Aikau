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
 * @module alfresco/documentlibrary/views/AlfDetailedView
 * @extends module:alfresco/lists/views/AlfListView
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/AlfListView"], 
        function(declare, AlfDocumentListView) {

   return declare([AlfDocumentListView], {

      /**
       * By default the detailed view should have no borders
       *
       * @instance
       * @type {string}
       * @default "no-borders"
       */
      additionalCssClasses: "no-borders",

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
      widgets: [{
         name: "alfresco/documentlibrary/views/AlfDetailedViewItem",
         config: {
            generatePubSubScope: true
         }
      }]
   });
});