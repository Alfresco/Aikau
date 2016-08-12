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
 * @module alfresco/menus/AlfMenuBarSelectItems
 * @extends module:alfresco/menus/AlfMenuBarSelect
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBarSelect",
        "alfresco/core/topics",
        "dojo/dom-class",
        "dojo/_base/lang",
        "dojo/on",
        "dojo/_base/event"], 
        function(declare, AlfMenuBarSelect, topics, domClass, lang, on, event) {
   
   return declare([AlfMenuBarSelect], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfMenuBarSelectItems.properties"}]
       * @since 1.0.59
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfMenuBarSelectItems.properties"}],
   
      /**
       * Sets an initial iconClass. This ensures that the iconNode is created.
       * 
       * @instance
       * @type {string} 
       * @default
       */
      iconClass: "alf-noneselected-icon",
         
      /**
       * @instance
       * @type {number} 
       * @default
       */
      _NONE: 0,

      /**
       * @instance
       * @type {number} 
       * @default
       */
      _SOME: 1,

      /**
       * @instance
       * @type {number} 
       * @default
       */
      _ALL: 2,
      
      /**
       * @instance
       * @type {number} 
       * @default
       */
      _UNKNOWN: 3,
      
      /**
       * Keeps track of the items selected (either none, some or all)
       * 
       * @instance
       * @type {number} 
       * @default
       */
      _itemsSelected: 0,
      
      /**
       * The topic that the widget will listen to.
       * @instance
       * @type {string}
       * @default
       */
      notificationTopic: topics.DOCUMENT_SELECTION_UPDATE,

      /**
       * Extends the inherited implementation to set up the listener for clicks on the iconNode
       * 
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuBarSelectItems__postCreate() {
         this.inherited(arguments);
         if (this.iconNode)
         {
            this.iconNode.setAttribute("alt", this.message("menubarselectitems.none.selected"));
            on(this.iconNode, "click", lang.hitch(this, this.handleIconClick));
         }
      },
      
      /**
       * 
       * @instance
       */
      handleIconClick: function alfresco_menus_AlfMenuBarSelectItems__handleIconClick(evt) {
         this.alfLog("log", "Icon node clicked");
         
         if (this.get("disabled"))
         {
            // No action required - the widget is disabled...
         }
         else
         {
            // Close the popup if it's open...
            this.closePopupMenu();
            if (this._itemsSelected === this._NONE)
            {
               // Select all...
               this.renderAllSelected();
               this.alfPublish(this.notificationTopic, { value: "selectAll" });
            }
            else if (this._itemsSelected === this._SOME)
            {
               // Select all...
               this.renderAllSelected();
               this.alfPublish(this.notificationTopic, { value: "selectAll" });
            }
            else if (this._itemsSelected === this._ALL)
            {
               // Select none...
               this.renderNoneSelected();
               this.alfPublish(this.notificationTopic, { value: "selectNone" });
            }
            else
            {
               // Select none...
               this.renderNoneSelected();
               this.alfPublish(this.notificationTopic, { value: "selectNone" });
            }
            event.stop(evt); // Prevent the click event from going any further...
            domClass.remove(this.domNode, "dijitMenuItemSelected"); // Ensure that the menu bar item isn't marked as selected
         }
      },
      
      /**
       * 
       * @instance
       * @pararm {object} payload The payload from the publication on the selection topic
       */
      handleSelection: function alfresco_menus_AlfMenuBarSelectItems__handleSelection(payload) {
         this.alfLog("log", "Selection detected", payload);
         
         if (payload)
         {
            // Default support is provided for "selectAll" and "selectNone" values (this function
            // could be extended to support additional values) so that the overall label/icon responds
            // to menu item clicks (and not just external selection events).
            if (payload.value === "selectAll")
            {
               this.renderAllSelected();
            }
            else if (payload.value === "selectNone")
            {
               this.renderNoneSelected();
            }
            else  
            {
               // Try to work out how many items have been selected.
               this.determineSelection(payload);
            }
         }
         domClass.remove(this.domNode, "dijitMenuItemSelected"); // Ensure that the menu bar item isn't marked as selected
      },
      
      /**
       * This function relies on the supplied payload argument having both an 'availableItemCount' attribute
       * and a'selectedItemCount' attribute, but it can be overridden for custom handling of how to render
       * the icon for the menu.
       * 
       * @instance
       * @param {object} payload
       */
      determineSelection: function alfresco_menus_AlfMenuBarSelectItems__determineSelection(payload) {
         var available = parseInt(payload.availableItemCount, 10);
         var selected = parseInt(payload.selectedItemCount, 10);
         if ((available || available === 0) && 
             (selected || selected === 0)) 
         {
            // If no value is provided the selected items indicator is calculated based
            // on available and selected item counts...
            if (selected === 0)
            {
               this.renderNoneSelected();
            }
            else if (available > selected)
            {
               this.renderSomeSelected();
            }
            else if (available === selected)
            {
               this.renderAllSelected();
            }
            else
            {
               this.alfLog("warn", "Couldn't work out how many were selected");
               this._itemsSelected = this._UNKNOWN;
            }
         }
         else
         {
            this.alfLog("warn", "Invalid item selection requested", payload, this);
         }
      },
      
      /**
       * @instance
       */
      renderAllSelected: function alfresco_menus_AlfMenuBarSelectItems__renderAllSelected() {
         if (this.iconNode)
         {
            domClass.remove(this.iconNode, this._currentIconClass);
            this._currentIconClass = "alf-allselected-icon";
            domClass.add(this.iconNode, this._currentIconClass);
            this.iconNode.setAttribute("alt", this.message("menubarselectitems.all.selected"));
         }
         this._itemsSelected = this._ALL;
      },
      
      /**
       * @instance
       */
      renderSomeSelected: function alfresco_menus_AlfMenuBarSelectItems__renderSomeSelected() {
         if (this.iconNode)
         {
            domClass.remove(this.iconNode, this._currentIconClass);
            this._currentIconClass = "alf-someselected-icon";
            domClass.add(this.iconNode, this._currentIconClass);
            this.iconNode.setAttribute("alt", this.message("menubarselectitems.some.selected"));
         }
         this._itemsSelected = this._SOME;
      },
      
      /**
       * @instance
       */
      renderNoneSelected: function alfresco_menus_AlfMenuBarSelectItems__renderNoneSelected() {
         if (this.iconNode)
         {
            domClass.remove(this.iconNode, this._currentIconClass);
            this._currentIconClass = "alf-noneselected-icon";
            domClass.add(this.iconNode, this._currentIconClass);
            this.iconNode.setAttribute("alt", this.message("menubarselectitems.none.selected"));
         }
         this._itemsSelected = this._NONE;
      }
   });
});