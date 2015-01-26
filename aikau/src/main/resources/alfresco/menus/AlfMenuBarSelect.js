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
 * @module alfresco/menus/AlfMenuBarSelect
 * @extends module:alfresco/menus/AlfMenuBarPopup
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBarPopup",
        "dojo/dom-class",
        "dojo/_base/lang"], 
        function(declare, AlfMenuBarPopup, domClass, lang) {
   
   return declare([AlfMenuBarPopup], {
      
      /**
       * The topic that the widget will listen to.
       * 
       * @instance
       * @type {string}
       * @default null 
       */
      selectionTopic: null,

      /**
       * The last set icon CSS class. Maintained so that it can be removed when changed.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      _currentIconClass: null,
      
      /**
       * Indicates whether a selection can modify the main icon
       * 
       * @instance
       * @type {boolean} 
       * @default false
       */
      updateIconOnSelection: false,
      
      /**
       * Extends the inherited implementation to subscribe to the 'selectionTopic' attribute.
       * 
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuBarSelect__postCreate() {
         if (this.selectionTopic)
         {
            this.alfSubscribe(this.selectionTopic, lang.hitch(this, "handleSelection"));
         }
         else
         {
            this.alfLog("warn", "No selection topic provided - AlfMenuBarSelect will not reflect selection!");
         }
         this.inherited(arguments);
         this._currentIconClass = this.iconClass;
      },
      
      /**
       * @instance
       * @param {object} payload The payload from the publication on the selection topic
       */
      handleSelection: function alfresco_menus_AlfMenuBarSelect__handleSelection(payload) {
         this.alfLog("log", "Selection detected", payload);
         
         if (payload) 
         {
            // Update the label with the selection...
            if (payload.label)
            {
               this.set('label', this.message(payload.label));
            }
            else if (payload.value != null)
            {
               this.set('label', payload.value.toString()); 
            }
            
            // Update the icon if there is an icon node, it's supported and there is a new iconClass...
            if (this.iconNode && this.updateIconOnSelection && payload.iconClass)
            {
               domClass.remove(this.iconNode, this._currentIconClass);
               domClass.add(this.iconNode, payload.iconClass);
            }
         }
         domClass.remove(this.domNode, "dijitMenuItemSelected"); // Ensure that the menu bar item isn't marked as selected
      }
   });
});