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
 * A document-specific version of the list, that only deals with lists of documents.
 * 
 * @module alfresco/lists/views/AlfDocumentListView
 * @extends module:alfresco/lists/views/AlfListView
 * @author Martin Doyle
 * @since 1.0.67
 */
define(["dojo/_base/declare",
        "dojo/_base/lang",
        "alfresco/lists/views/AlfListView"],
        function(declare, lang, AlfListView) {

   return declare([AlfListView], {

      /**
       * Minimum height for this view. Not used by default. Can be either a Number (treated as pixels) or
       * a String (treated as CSS units).
       *
       * @instance
       * @override
       * @type {Number|String}
       * @default
       */
      minHeight: 300,

      /**
       * An JSON model defining the widgets to display when no data is available to display.
       *
       * @instance
       * @override
       * @type {Object[]}
       * @default
       */
      widgetsForNoDataDisplay: [
         {
            name: "alfresco/lists/views/EmptyDocumentList"
         }
      ],

      /**
       * This method is called when there is no data to be shown. By default this just shows a standard localized
       * message to say that there is no data.
       *
       * @instance
       * @override
       */
      renderNoDataDisplay: function alfresco_lists_views_AlfListView__renderNoDataDisplay() {

         // Determine whether user can upload and pass on to the widgetsForNoDataDisplay config(s)
         var permissions = lang.getObject("_currentNode.parent.permissions", false, this),
            canUpload = permissions && lang.getObject("user.CreateChildren", false, permissions) === true;
         this.widgetsForNoDataDisplay.forEach(function(widget) {
            widget.config = lang.mixin(widget.config || {}, {
               canUpload: canUpload
            });
         });

         // Defer to parent
         this.inherited(arguments);
      }
   });
});