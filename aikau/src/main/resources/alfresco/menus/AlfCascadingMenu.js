/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * @module alfresco/menus/AlfCascadingMenu
 * @extends external:dijit/PopupMenuItem
 * @mixes module:alfresco/menus/_AlfMenuItemMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/PopupMenuItem",
        "alfresco/menus/_AlfMenuItemMixin",
        "alfresco/menus/AlfMenuGroups",
        "alfresco/core/Core"], 
        function(declare, PopupMenuItem, _AlfMenuItemMixin, AlfMenuGroups, AlfCore) {
   
   return declare([PopupMenuItem, _AlfMenuItemMixin, AlfCore], {
      
      /**
       * Overrides the default value provided by the _AlfMenuItemMixin
       * @instance
       * @type {boolean}
       * @default false 
       */
      closeOnClick: false,
      
      /**
       * Ensures that the supplied menu item label is translated.
       * @instance
       */
      postCreate: function alfresco_menus_AlfCascadingMenu__postCreate() {
         this.setupIconNode();
         this.inherited(arguments);
         
         // Create a popup menu and add children to it...
         this.popup = new AlfMenuGroups({pubSubScope: this.pubSubScope, widgets: this.widgets});
         
         // Call the method provided by the _AlfPopupCloseMixin to handle popup close events...
         this.registerPopupCloseEvent();
      }
   });
});