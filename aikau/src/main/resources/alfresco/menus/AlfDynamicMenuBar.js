/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * 
 * @deprecated This module is deprecated because it is currently not in use.
 * @module alfresco/menus/AlfDynamicMenuBar
 * @extends module:alfresco/menus/AlfMenuBar
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBar",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/menus/AlfMenuBarItem"], 
        function(declare, AlfMenuBar, lang, array, AlfMenuBarItem) {
   
   return declare([AlfMenuBar], {
      
      /**
       * @instance
       */
      updateTopic: "ALF_ADD_DYNAMIC_MENU_ITEMS",
      
      /**
       * @instance
       */
      postCreate: function alfresco_menus_AlfDynamicMenuBar__postCreate() {
         this.inherited(arguments);
         this.alfSubscribe(this.updateTopic, lang.hitch(this, "processUpdates"));
      },
      
      /**
       * @instance
       * @param {object} payload The payload received on the updateTopic
       */
      processUpdates: function alfresco_menus_AlfDynamicMenuBar__processUpdates(payload) {
         if (payload == null && payload.add == null && payload.remove == null)
         {
            this.alfLog("warn", "A request was made to update a dynamic menu bar but not enough information was provided", payload);
         }
         else
         {
            if (payload.remove)
            {
               array.forEach(payload.remove, lang.hitch(this, "removeUpdate"));
            }
            if (payload.add)
            {
               array.forEach(payload.add, lang.hitch(this, "addUpdate"));
            }
         }
      },
      
      /**
       * The attributes of an item are:
       * 
       * @instance
       * @param {object} update The update to process
       * @param {integer} index The index of the update
       */
      addUpdate: function alfresco_menus_AlfDynamicMenuBar__processUpdate(update, index) {
         this._menuBar.addChild(update, "first");
      },
      
      /**
       * @instance
       * @param {object} update The update to process
       * @param {integer} index The index of the update
       */
      removeUpdate: function alfresco_menus_AlfDynamicMenuBar__removeUpdates(update, index) {
         this._menuBar.removeChild(update);
      }
   });
});