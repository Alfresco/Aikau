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
 * @module aikau/lists/List
 * @extends module:alfresco/lists/AlfSortablePaginatedList
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "alfresco/lists/AlfSortablePaginatedList",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare, AlfSortablePaginatedList, lang, domClass) {

   return declare([AlfSortablePaginatedList], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/List.css"}]
       */
      cssRequirements: [{cssFile:"./css/List.css"}],
      
      /**
       * This is a configurable topic that can be published to change the state of the items
       * that should be displayed.
       * 
       * @instance
       * @type {string}
       * @default
       */
      updateStateSubscriptionTopic: "ALF_UPDATE_LIST_STATE",

      /**
       * Overrides the [inherited function]{@link module:alfresco/lists/AlfList#postCreate}
       * to add the additional CSS class for the widget.
       * 
       * @instance
       */
      postCreate: function aikau_lists_List__postCreate() {
         domClass.add(this.domNode, "aikau-lists-List");
         this.inherited(arguments);
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfList#setupSubscriptions}
       * to create an additional subscription to 
       *
       * @instance
       */
      setupSubscriptions: function aikau_lists_List__setupSubscriptions() {
         this.inherited(arguments);
         this.updateStateSubscriptionTopic && this.alfSubscribe(this.updateStateSubscriptionTopic, lang.hitch(this, this.updateState));
      },

      /**
       * 
       * @instance
       * @param  {object} payload [description]
       * @return {[type]}         [description]
       */
      updateState: function aikau_lists_List__updateState(payload) {
         var isFolder = lang.getObject("entry.isFolder", false, payload);
         if (isFolder)
         {
            var path = lang.getObject("entry.path.name", false, payload);
            var name = lang.getObject("entry.name", false, payload);
            if (path)
            {
               path.startsWith("/") && (path = path.substring(1));
               var pathElements = path.split("/");
               if (pathElements)
               {
                  pathElements.shift(); // Remove the first element
                  this.relativePath = pathElements.join("/");
                  name && (this.relativePath += ("/" + name));
                  this.currentPage = 1;
                  this.loadData();
               }
            }
         }
      },

      /**
       * Applies the state set by [updateState]{@link module:aikau/lists/List#updateState}
       *
       * @instance
       * @param {object} payload The payload object to update
       */
      updateLoadDataPayload: function alfresco_lists_AlfList__updateLoadDataPayload(payload) {
         this.inherited(arguments);
         payload.relativePath = this.relativePath;
      }
   });
});