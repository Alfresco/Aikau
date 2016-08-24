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
 * @module aikau/menus/Menu
 * @extends module:aikau/mdl/BaseMdlWidget
 * @author Dave Draper
 * @since 1.0.NEXT
 */
define(["dojo/_base/declare",
        "aikau/buttons/Button", 
        "dojo/dom-construct"], 
        function(declare, Button, domConstruct) {
   
   return declare([Button], {

      /**
       * Override the default to prevent the menu items being rendered until they are required.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      createChildrenImmediately: false,

      /**
       * Internal flag to indicate whether or not the menu items have been created.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      _menuItemsCreated: false,



      /**
       * 
       * @instance
       */
      postCreate: function aikau_buttons_Button__postCreate() {
         this.inherited(arguments);

         if (this.leadingIcon)
         {
            domConstruct.create("i", {
               className: "material-icons",
               innerHTML: this.leadingIcon
            }, this.buttonNode, "first");
         }
         if (this.trailingIcon)
         {
            domConstruct.create("i", {
               className: "material-icons",
               innerHTML: this.trailingIcon
            }, this.buttonNode, "last");
         }
         
      },

      /**
       * Override the default click handler to create the menu items.
       *
       * @instance
       * @param  {object} evt The click event
       */
      onClick: function aikau_menus_Menu__onClick() {
         // TODO: Only works on second click.
         // 
         // We're probably going to need to have some kind of event indicating when the 
         // widget is added to the live DOM. At the moment it's not possible to render
         // the button/menu correctly because it relies on nested elements. We can't
         // create the element on postCreate because it is not part of the live DOM.
         // 

         if (!this._menuItemsCreated && this.widgets)
         {
            var menuNode = domConstruct.create("ul", {
               className: "mdl-menu mdl-js-menu mdl-js-ripple-effect",
               "for": this.id
            }, this.domNode, "after");
            

            this.createChildren({
               widgets: this.widgets,
               targetNode: menuNode
            });
            this._menuItemsCreated = true;

            /* global componentHandler */
            componentHandler.upgradeElement(menuNode);
         }
      }
   });
});