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
 * <p><b>This widget is in the "aikau" package and does not adhere to the backwards compatibility standards
 * of the "alfresco" package. The code in this package is intended to form the basis of the next major release
 * of Aikau and will remain in an unstable state until ready for release. Please evaluate and feedback on this
 * module but do not rely on it in production!</b></p>
 *
 * @module aikau/lists/views/ListView
 * @extends module:alfresco/lists/views/AlfListView
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "alfresco/lists/views/AlfListView",
        "dojo/dom-class",
        "dojo/_base/lang"], 
        function(declare, AlfListView, domClass, lang) {

   return declare([AlfListView], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/ListView.css"}]
       */
      cssRequirements: [{cssFile:"./css/ListView.css"}],
      
      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/views/AlfListView#postCreate}
       * to add the additional CSS class for the widget.
       * 
       * @instance
       */
      postCreate: function aikau_lists_views_ListView__postCreate() {
         domClass.add(this.domNode, "aikau-lists-views-ListView");
         domClass.add(this.tableNode, "mdl-data-table mdl-js-data-table mdl-shadow--2dp");
         this.inherited(arguments);
      },

      /**
       * This method is called when there is no data to be shown. By default this just shows a standard localized
       * message to say that there is no data.
       *
       * @instance
       * @override
       */
      renderNoDataDisplay: function aikau_lists_views_ListView__renderNoDataDisplay() {
         // Determine whether user can upload and pass on to the widgetsForNoDataDisplay config(s)
         var permissions = lang.getObject("_currentNode.parent.permissions", false, this);
         var canUpload = permissions && lang.getObject("user.CreateChildren", false, permissions) === true;
         if (this.widgetsForNoDataDisplay)
         {
            this.widgetsForNoDataDisplay.forEach(function(widget) {
               widget.config = lang.mixin(widget.config || {}, {
                  canUpload: canUpload
               });
            });
         }
         this.inherited(arguments);
      }
   });
});