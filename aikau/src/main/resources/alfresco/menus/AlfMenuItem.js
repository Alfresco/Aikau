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
 * @module alfresco/menus/AlfMenuItem
 * @extends external:dijit/MenuItem
 * @mixes module:alfresco/menus/_AlfMenuItemMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/MenuItem",
        "alfresco/menus/_AlfMenuItemMixin",
        "alfresco/core/Core",
        "dojo/dom-class"], 
        function(declare, MenuItem, _AlfMenuItemMixin, AlfCore, domClass) {
   
   /**
    * Currently this extends the default Dojo implementation of a MenuItem without making any changes. Despite
    * it not providing any additional value-add yet it should still be used such that changes can be applied
    * without needing to modify page definition files.
    */
   return declare([MenuItem, _AlfMenuItemMixin, AlfCore], {
      
      /**
       * Ensures that the supplied menu item label is translated.
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuItem__postCreate() {
         this.setupIconNode();
         this.inherited(arguments);
         domClass.add(this.domNode, "alfresco-menus-AlfMenuItem");
      }
   });
});