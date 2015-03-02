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
 * This is a customization of the standard [menu bar item]{@link module:alfresco/menus/AlfFilteringMenuItem} that
 * mixes in the ability to determine whether or not the current user has the ability to create content 
 * at the current rendered location. This was created for use in the document library (for items in the "Create..." menu
 * but is applicable for use anywhere where user access rights need to be verified.
 * 
 * @module alfresco/documentlibrary/AlfCreateContentMenuItem
 * @extends module:alfresco/menus/AlfMenuBarPopup
 * @mixes module:alfresco/documentlibrary/_AlfCreateContentPermissionsMixin
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfFilteringMenuItem",
        "alfresco/documentlibrary/_AlfCreateContentPermissionsMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang"], 
        function(declare, AlfFilteringMenuItem, _AlfCreateContentPermissionsMixin, _AlfDocumentListTopicMixin, lang) {
   
   return declare([AlfFilteringMenuItem, _AlfCreateContentPermissionsMixin, _AlfDocumentListTopicMixin], {

      /**
       * Set the i18n scope so that labels are picked up from the wrapped toolbar message scope.
       * 
       * @instance
       * @type {string}
       * @default "Alfresco.DocListToolbar"
       */
      i18nScope: "Alfresco.DocListToolbar",
      
      /**
       * Extended to add additional subscription to listen for changes to the filter. If the filter is not set
       * to a path then it is not possible to create content.
       * 
       * @instance
       */
      postCreate: function alfresco_documentlibrary_AlfCreateContentMenuBarPopup__postCreate() {
         this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.onFilterChange));
         this.alfSubscribe(this.userAccessChangeTopic, lang.hitch(this, this.onUserAcess));
         this.inherited(arguments);
      },
   
      /**
       * This function filters the menu item based on the supplied user access payload against the data 
       * in the "permission" attribute that should be set when the item is instantiated. This code is based
       * on the "onUserAccess" function from the original YUI based DocumentLibrary "toolbar.js" widget.
       * 
       * @instance filter
       * @param {object} payload The payload published on the filter topic
       */
      filter: function alfresco_documentlibrary_AlfCreateContentMenuItem__filter(payload) {
         this.alfLog("log", "Filtering request received: ", payload);
         
         // Hide the menu item if necessary 
         if (this.hasPermission(this.permission, payload.userAccess))
         {
            this.show();
         }
         else
         {
            this.hide();
         }
      }
   });
});