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
 * @module alfresco/menus/AlfDropDownMenu
 * @extends external:dijit/DropDownMenu
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/DropDownMenu",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/menus/AlfMenuItemWrapper",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/_base/event",
        "dojo/on"], 
        function(declare, DropDownMenu, AlfCore, CoreWidgetProcessing, AlfMenuItemWrapper, array, domClass, event, on) {
   
   return declare([DropDownMenu, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AlfDropDownMenu.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfDropDownMenu.css"}],
      
      /**
       * Updates the default template with some additional CSS class information and then processes
       * the widgets supplied.
       * 
       * @instance
       */
      postCreate: function alfresco_menus_AlfDropDownMenu__postCreate() {
         
         this.inherited(arguments);
         
         // Add a custom class to the container node (this has been done to prevent us overriding the default
         // template unnecessarily and risk losing updates)...
         domClass.add(this.containerNode.parentNode, "alf-dropdown-menu");
         
         // Process all the widgets which in this case will become menu items...
         if (this.widgets)
         {
            this.processWidgets(this.widgets);
         }
      },
      
      /**
       * Callback implementation following instantiation of all of the widgets defined in by the "widgets"
       * instance property. 
       * 
       * @instance
       * @param {array} widgets An array of the instantiated widgets (as defined by the widgets instance property).
       */
      allWidgetsProcessed: function alfresco_menus_AlfDropDownMenu__allWidgetsProcessed(widgets) {
         var _this = this;
         array.forEach(widgets, function(widget, i) {
             // Add the widget to the drop down menu...
            _this.addChild(widget);
         });
      },
      
      /**
       * 
       * @instance
       * @param {object} widget The widget to add as the new child
       * @param {integer} insertIndex The index at which to insert the child
       */
      addChild: function alfresco_menus_AlfDropDownMenu__addChild(widget, insertIndex) {
         
         if (widget.domNode.tagName.toUpperCase() != "TR")
         {
            // If the entry is not a table row then we will wrap it within one (provided by the
            // AlfMenuItemWrapper widget) such that the menu item is rendered correctly within the
            // menu.
            var itemToAdd = new AlfMenuItemWrapper({pubSubScope: widget.pubSubScope, item: widget });
            
            // Call the super class function with NEW arguments...
            this.inherited(arguments, [itemToAdd, insertIndex]);
         }
         else
         {
            // The element is a table row so we're going to assume that this is ok. However, if the
            // row does not contain 4 cells (or does not provide cells that span 4 column) then the
            // rendering could look "odd". This is because the default Dojo menu item is a table row
            // containing 4 columns.
            this.inherited(arguments);
         }
         this.setFirstAndLastMarkerClasses();
      },
      
      /**
       * This extends the super class implementation to allow keyboard navigation to traverse groups. If the
       * current focused child is the last element in the current group then the first item in the next group
       * will be focused (rather than iterating back around to the first item in the current group).
       * 
       * @instance
       */
      focusNext: function alfresco_menus_AlfDropDownMenu__focusNext() {
         
         var groupParent = this.getParent();
         if (domClass.contains(this.focusedChild.domNode, "last-focusable-entry"))
         {
            this.alfLog("log", "Focus first in next group");
            var nextSibling = groupParent._getSiblingOfChild(this, 1);
            while (nextSibling && typeof nextSibling.hasChildren === "function" && !nextSibling.hasChildren())
            {
               nextSibling = groupParent._getSiblingOfChild(nextSibling, 1);
            }
            if (nextSibling && typeof nextSibling.focusFirstChild === "function")
            {
               // Find a sibling that has a child to try and focus!
               nextSibling.focusFirstChild();
            }
            else
            {
               // Focus the first child of the first group that has children...
               groupParent._getFirstFocusableChild().focusFirstChild();
            }
         }
         else 
         {
            this.alfLog("log", "Focus next in current group");
            this.inherited(arguments);
         }
      },
      
      /**
       * This extends the super class implementation to allow keyboard navigation to traverse groups. If the
       * current focused child is the first element in the current group then the last item in the previous group
       * will be focused (rather than iterating back around to the last item in the current group).
       * 
       * @instance
       */
      focusPrev: function alfresco_menus_AlfDropDownMenu__focusPrev() {
         
         // Set up sensible variables for the various contexts...
         var groupParent = this.getParent(); 

         if (domClass.contains(this.focusedChild.domNode, "first-focusable-entry"))
         {
            this.alfLog("log", "Focus last in previous group");
            
            // The user is navigating up from the first entry in the group...
            // If this is the first group then we need to move to the LAST entry in the LAST group
            // Otherwise we need to move to the FIRST entry in the NEXT group...
            // Get my previous sibling...
            var previousSibling = groupParent._getSiblingOfChild(this, -1);
            while (previousSibling && typeof previousSibling.hasChildren === "function" && !previousSibling.hasChildren())
            {
               previousSibling = groupParent._getSiblingOfChild(previousSibling, -1);
            }
            if (previousSibling && typeof previousSibling.focusLastChild === "function")
            {
               // Focus on the last child of the previous sibling...
               previousSibling.focusLastChild();
            }
            else
            {
               // Focus the last child of the last group that has children...
               groupParent._getLastFocusableChild().focusLastChild();
            }
         }
         else
         {
            this.alfLog("log", "Focus previous in group");
            this.inherited(arguments);
         }
      },
      
      /**
       * Extends the default implementation to call the "setFirstAndLastMarkerClasses" classes after
       * the child has been removed.
       * 
       * @instance
       * @param {object} widget The child to remove
       */
      removeChild: function alfresco_menus_AlfDropDownMenu__removeChild(widget) {
         this.inherited(arguments);
         this.setFirstAndLastMarkerClasses();
      },
      
      /**
       * This function sets the class "first-focusable-entry" to the first child widget that is focusable and
       * "last-focusable-entry" to the last child widget that is focusable (the same child can be both). The purpose
       * of these markers is to help keyboard users to navigate between multiple groups in a menu.
       * 
       * It also adds "first-entry" and "last-entry" as well for use in styling.
       * 
       * @instance
       */
      setFirstAndLastMarkerClasses: function alfresco_menus_AlfDropDownMenu__setFirstAndLastMarkerClasses() {
         
         var noOfChildren = this.getChildren().length;
         if (noOfChildren > 0)
         {
            // Remove any previous first/last class markers...
            array.forEach(this.getChildren(), function(child, index) {
               domClass.remove(child.domNode, "first-focusable-entry");
               domClass.remove(child.domNode, "last-focusable-entry");
            });
            
            // Add the "first-focusable-entry" marker class to the first child that is focusable...
            array.some(this.getChildren(), function(child){
               if (child.isFocusable())
               {
                  domClass.add(child.domNode, "first-focusable-entry");
                  return true;
               }
            });

            // Add the "last-focusable-entry" marker class to the last child that is focusable...
            var index = noOfChildren - 1,
                children = this.getChildren(),
                setLast = false;
            while (index >= 0 && !setLast)
            {
               if (children[index].isFocusable())
               {
                  domClass.add(children[index].domNode, "last-focusable-entry");
                  setLast = true;
               }
               index--;
            }
            
            // Add the "first-entry" and "last-entry" markers (these can be used for styling purposes, e.g.
            // not underlining the last menu item, etc
            domClass.add(children[0].domNode, "first-entry");
            domClass.add(children[noOfChildren-1].domNode, "last-entry");
         }
      }
   });
});