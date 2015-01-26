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
 * This widget can be used to group menu items within a popup menu such as an [AlfMenuBarPopup]{@link module:alfresco/menus/AlfMenuBarPopup}
 * or a [AlfCascadingMenu]{@link module:alfresco/menus/AlfCascadingMenu}. When an item is added to any [AlfMenuGroups]{@link module:alfresco/menus/AlfMenuGroups}
 * popup such as in those widgets then a new instance will automatically be wrapped any child widget that is not in a group.
 * 
 * @module alfresco/menus/AlfMenuGroup
 * @extends module:alfresco/menus/AlfDropDownMenu
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreRwd
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dojo/text!./templates/AlfMenuGroup.html",
        "alfresco/core/Core",
        "alfresco/menus/AlfDropDownMenu",
        "alfresco/core/CoreRwd",
        "dojo/_base/event",
        "dojo/dom-style",
        "dojo/dom-class",
        "dojo/keys",
        "dijit/popup",
        "dojo/string"], 
        function(declare, template, AlfCore, AlfDropDownMenu, CoreRwd, event, domStyle, domClass, keys, popup, string) {
   
   return declare([AlfDropDownMenu, AlfCore, CoreRwd], {
      
      // TODO: There's an argument that this should actually extend (rather than wrap) the DropDownMenu to avoid needing to delegate the functions
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfMenuGroup.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfMenuGroup.css"}],
      
      /**
       * The label for the group. If this is left as the empty string then the group label node will be
       * hidden completely. The value assigned to label can either be an i18n property key or a value
       * but an attempt will be made to look up the assigned value in the available i18n keys.
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      label: "",
      
      /**
       * @instance
       */
      constructor: function alfresco_menus_AlfMenuGroup__constructor(args) {
         this.templateString = string.substitute(template, { ddmTemplateString: AlfDropDownMenu.prototype.templateString});
      },
      
      
      /**
       * Sets the group label and creates a new alfresco/menus/AlfDropDownMenu to contain the items 
       * in the group.
       * 
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuGroup__postCreate() {
         
         if (this.label == "")
         {
            // If there is no label for the title then hide the title node entirely...
            domStyle.set(this._groupTitleNode, "display", "none");
         }
         else
         {
            // Make sure that an attempt is made to get the localized label...
            this.label = this.message(this.label);
            this._groupTitleNode.innerHTML = this.encodeHTML(this.label);
         }

         if(this.additionalCssClasses)
         {
            domClass.add(this._containerNode, this.additionalCssClasses);
         }

         // Setup the Drop down menu as normal...
         this.inherited(arguments);
      },
      
      /**
       * 
       * @instance
       */
      isFocusable: function alfresco_menus_AlfMenuGroup__isFocusable() {
         return this.hasChildren();
      },
      
      /**
       * Overrides the inherited function in order to address the additional Alfesco object
       * placed in the chain between the Dojo menu objects. 
       * 
       * @instance
       * @param {object} evt
       */
      _onRightArrow: function(/*Event*/ evt){
         if(this.focusedChild && this.focusedChild.popup && !this.focusedChild.disabled)
         {
             // This first block is identical to that of the inherited function...
             this.alfLog("log", "Open cascading menu");
             this._moveToPopup(evt);
         }
         else 
         {
            // Find the top menu and focus next in it...
            this.alfLog("log", "Try and find a menu bar in the stack and move to next");
            var menuBarAncestor = this.findMenuBarAncestor(this.getParent());
            if (menuBarAncestor)
            {
               this.alfLog("log", "Go to next item in menu bar");
               menuBarAncestor.focusNext()
            }
         }
      },
      
      /**
       * Overrides the inherited function in order to address the additional Alfesco object
       * placed in the chain between the Dojo menu objects. 
       * 
       * @instance
       * @param {object} evt
       */
      _onLeftArrow: function(evt) {
         if(this.getParent().parentMenu && !this.getParent().parentMenu._isMenuBar)
         {
            this.alfLog("log", "Close cascading menu");
            this.getParent().parentMenu.focusChild(this.getParent().parentMenu.focusedChild);
            popup.close(this.getParent());
         }
         else
         {
            var menuBarAncestor = this.findMenuBarAncestor(this.getParent());
            if (menuBarAncestor)
            {
               this.alfLog("log", "Focus previous item in menu bar");
               menuBarAncestor.focusPrev();
            }
            else
            {
               evt.stopPropagation();
               evt.preventDefault();
            }
         }
      },
      
      /**
       * This function will work up the stack of menus to find the first menu bar in the stack. This 
       * is required because of the additional grouping capabilities that have been added to the basic
       * Dojo menu widgets. In the core Dojo code the "parentMenu" attribute is used to work up the stack
       * but not all widgets in the Alfresco menu stack have this attribute (and it was not possible to
       * set it correctly during the widget processing phase). 
       * 
       * @instance
       * @return Either null if a menu bar cannot be found or a menu bar widget.
       */
      findMenuBarAncestor: function alfresco_menus_AlfMenuGroup__findMenuBarAncestor(currentMenu) {
         var reachedMenuTop = false;
         while (!reachedMenuTop && !currentMenu._isMenuBar)
         {
            if (currentMenu.parentMenu)
            {
               // The current menu item has a parent menu item - assign it as the current menu...
               currentMenu = currentMenu.parentMenu;
            }
            else
            {
               // Go up the widget stack until we either run out of ancestors or find another parent menu...
               var parent = currentMenu.getParent();
               while (parent && !parent.parentMenu)
               {
                  parent = parent.getParent();
               }
               if (parent && parent.parentMenu)
               {
                  currentMenu = parent.parentMenu;
               }
               reachedMenuTop = (parent == null);
            }
         }
         var menuBar = (currentMenu._isMenuBar) ? currentMenu : null;
         return menuBar;
      },

      /**
       * Added to support use in context menus
       *
       * @instance
       * @param {boolean} bool 
       */
      _setSelected: function alfresco_menus_AlfMenuGroup___setSelected(bool) {
         this._selected = true;
      }
   });
});