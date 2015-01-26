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
 * <p>This module is used by the [AlfDropDownMenu]{@link module:alfresco/menus/AlfDropDownMenu} to wrap
 * any widgets placed into a menu where the widget structure does not match the required DOM fragment
 * for a [menu item]{@link module:alfresco/menus/AlfMenuItem}. This widget is then able to delegate 
 * user actions such as click and focus to prevent errors and ensure that keyboard navigation of menus
 * continues to work correctly.</p>
 *
 * @module alfresco/menus/AlfMenuItemWrapper
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dojo/_Contained
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "dijit/_Contained",
        "dojo/text!./templates/AlfMenuItemWrapper.html",
        "alfresco/core/Core",
        "dojo/dom-construct"], 
        function(declare, _WidgetBase, _TemplatedMixin, _Contained, template, AlfCore, domConstruct) {
   
   /**
    * This class has been created to act as the main container for the popup referenced by "alfresco/menus/AlfMenuBarPopup".
    * It currently just acts as a container object but is intended to allow instances of "alfresco/menus/AlfMenuGroup" to be
    * added into a menu bar popup.
    */
   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {
      
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
       * @default [{cssFile:"./css/AlfMenuItemWrapper.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfMenuItemWrapper.css"}],
      
      /**
       * The item to be wrapped.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      item: null,
      
      /**
       * Add the assigned item (the thing that is to be wrapped) to the appropriate DOM node in the HTML template. 
       * 
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuItemWrapper__postCreate() {
         if (this.item)
         {
            domConstruct.place(this.item.domNode, this._itemNode);
         }
      },
      
      /**
       * This function is implemented to indicate whether or not the wrapped item can be focused. It is focusable if
       * the item has a focus function that can be called.
       * 
       * @instance
       * @returns {boolean} true if there is a wrapped item and it has a focus function.
       */
      isFocusable: function  alf_menus_AlfMenuItemWrapper__isFocusable() {
         var focusable = (this.item && this.item.focus);
         this.alfLog("log", "Item Wrapper focusable?", focusable);
         return focusable;
      },

      /**
       * This function is implemented to delegate the handling of focus events to the wrapped item.
       * 
       * @instance
       */
      focus: function alfresco_menus_AlfMenuItemWrapper__focus() {
         this.alfLog("log", "Item Wrapper focus");
         if (this.item && this.item.focus)
         {
            this.item.focus();
         }
      },
      
      /**
       * This function is implemented to delegate the handling of item focus events to the wrapped item. This
       * was added as a result of ALF-19367 because the omitted function was resulting in an error being generated
       * in IE.
       * 
       * @instance
       * @param {object} arg The argument to pass on
       */
      _onItemFocus: function alfresco_menus_AlfMenuItemWrapper___onItemFocus(arg) {
         if (typeof this.item._onItemFocus === "function")
         {
            this.item._onItemFocus(arg);
         }
      },
      
      /**
       * This function is implemented to delegate the handling of _setSelected calls to the wrapped item.
       * 
       * @instance
       * @param {boolean} Indicates whether ot not the item is selected
       */
      _setSelected: function alfresco_menus_AlfMenuItemWrapper___setSelected(selected) {
         this.alfLog("log", "Item Wrapper _setSelected", selected);
         if (this.item && this.item._setSelected)
         {
            this.item._setSelected(selected);
         }
      },
      
      /**
       * This function is implemented to delegate the handling of onClick calls to the wrapped item.
       * 
       * @instance
       * @param {object} evt The click event
       */
      onClick: function alfresco_menus_AlfMenuItemWrapper__onClick(evt){
         this.alfLog("log", "Item Wrapper onClick", evt);
         if (this.item && typeof this.item.onClick == "function")
         {
            this.item.onClick(evt);
         }
      }
   });
});