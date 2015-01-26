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
 * @module alfresco/menus/AlfFilteringMenuItem
 * @extends module:alfresco/menus/AlfMenuItem
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuItem",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare, AlfMenuItem, lang, domClass) {
   
   return declare([AlfMenuItem], {
      
      /**
       * The topic to subscribe to for filtering events
       * 
       * @instance
       * @type {string} 
       * @default null
       */
      filterTopic: null,
      
      /**
       * Ensures that the supplied menu item label is translated.
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuItem__postCreate() {
         if (this.filterTopic != null)
         {
            this.alfSubscribe(this.filterTopic, lang.hitch(this, "filter"));
         }
         this.inherited(arguments);
      },
      
      /**
       * @instance
       * @param {object} payload The payload published on the filter topic 
       */
      filter: function alfresco_menus_AlfFilteringMenuItem__filter(payload) {
         this.alfLog("warn", "No implementation of filtering extension point", payload);
      },
      
      /**
       * Hides the menu item.
       * @instance
       */
      hide: function alfresco_menus_AlfFilteringMenuItem__hide() {
         domClass.add(this.domNode, "hidden");
      },
      
      /**
       * Displays the menu item.
       * @instance
       */
      show: function alfresco_menus_AlfFilteringMenuItem__show() {
         domClass.remove(this.domNode, "hidden");
      }
   });
});