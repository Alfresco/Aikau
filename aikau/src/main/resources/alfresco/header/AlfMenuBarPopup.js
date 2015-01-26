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
 * @module alfresco/header/AlfMenuBarPopup
 * @extends module:alfresco/menus/AlfMenuBarPopup
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBarPopup",
        "dojo/dom-class",
        "dojo/dom-construct"], 
        function(declare, AlfMenuBarPopup, domClass, domConstruct) {
   
   return declare([AlfMenuBarPopup], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance 
       * @type {object[]}
       * @default [{cssFile:"./css/AlfMenuBarPopup.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfMenuBarPopup.css"}],
      
      /**
       * Used to indicate whether or not to display a down arrow that indicates that this is a drop-down menu.
       * True by default.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      showArrow: true,
   
      /**
       * Extends the default implementation to create an additional <span> element with the show arrow CSS class to the 
       * focusNode of the widget.
       * 
       * @instance
       */
      postCreate: function alfresco_header_AlfMenuBarPopup__postCreate() {
         this.inherited(arguments);
         if (this.popup && this.popup.domNode)
         {
            // This ensures that we can differentiate between header menu popups and regular menu popups with our CSS selectors
            domClass.add(this.popup.domNode, "alf-header-menu-bar");
         }
         
      }
   });
});