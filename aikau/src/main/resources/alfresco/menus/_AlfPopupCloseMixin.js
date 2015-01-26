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
 * This mixin provides event functionality to ensure that popup menus and cascades are closed when
 * an item in the menu is clicked.
 * 
 * @module alfresco/menus/_AlfPopupCloseMixin
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/on",
        "dojo/_base/lang",
        "dijit/popup",
        "dijit/focus"], 
        function(declare, AlfCore, on, lang, popup, focusUtil) {
   
   return declare([AlfCore], {

      /**
       * Indicates whether or not the custom event should be fired
       * @instance
       * @type {boolean} 
       */
      closeOnClick: true,
      
      /**
       * Fires the custom event to indicate that popups should be closed.
       * 
       * @instance
       */
      emitClosePopupEvent: function alfresco_menus__AlfPopupCloseMixin__emitClosePopupEvent() {
         if (this.closeOnClick === true)
         {
            on.emit(this.domNode, "ALF_CLOSE_MENU", { bubbles: true, cancelable: true });
         }
      },
      
      /**
       * Registers a listener for the custom event fired when popups should be closed.
       * 
       * @instance
       */
      registerPopupCloseEvent: function alfresco_menus__AlfPopupCloseMixin__registerPopupCloseEvent() {
         // Listen for the custom "ALF_CLOSE_MENU" event and close the popup...
         if (this.popup && this.popup.domNode)
         {
            on(this.popup.domNode, "ALF_CLOSE_MENU", lang.hitch(this, "closePopupMenu"));
         }
      },
      
      /**
       * Handles closing the popup. By default it defers this action to the dijit/popup module.
       * 
       * @instance
       */
      closePopupMenu: function alfresco_menus__AlfPopupCloseMixin__closePopupMenu() {
         if (this.popup)
         {
            // Focus the main node again (this is require for keyboard accessibility)
            var tmp = this.getParent().focusedChild;
            if (typeof this.getParent()._closeChild === "function" && tmp != null)
            {
               this.getParent()._closeChild(tmp);
            }
            else if (typeof this.getParent()._onChildDeselect === "function" && tmp != null)
            {
               this.getParent()._onChildDeselect(tmp);
            }
            else
            {
               popup.close(this.popup);
            }
            
            // Fire another event - this is to catch cascaded popups because they don't live
            // in the same DOM ancestry...
            on.emit(this.domNode, "ALF_CLOSE_MENU", { bubbles: true, cancelable: true });
         }
      } 
   });
});