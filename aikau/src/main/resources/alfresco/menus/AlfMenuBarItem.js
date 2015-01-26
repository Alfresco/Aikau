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
 * @module alfresco/menus/AlfMenuBarItem
 * @extends external:dijit/MenuBarItem
 * @mixes module:alfresco/menus/_AlfMenuItemMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/MenuBarItem",
        "alfresco/menus/_AlfMenuItemMixin",
        "alfresco/core/Core",
        "dojo/dom-construct",
        "dojo/dom-class",
        "service/constants/Default"],
        function(declare, MenuBarItem, _AlfMenuItemMixin, AlfCore, domConstruct, domClass, AlfConstants) {

   /**
    * Currently this extends the default Dojo implementation of a MenuBarItem without making any changes. Despite
    * it not providing any additional value-add yet it should still be used such that changes can be applied
    * without needing to modify page definition files.
    */
   return declare([MenuBarItem, _AlfMenuItemMixin, AlfCore], {

      /**
       * A DOM node that can optionally be created to display an icon.
       *
       * @instance
       * @type {object}
       * @default null
       */
      iconNode: null,

      /**
       * Sets the label of the menu item that represents the popup and creates a new alfresco/menus/AlfMenuGroups
       * instance containing all of the widgets to be displayed in the popup. Ideally the array of widgets should
       * be instances of alfresco/menus/AlfMenuGroup (where instance has its own list of menu items). However, this
       * widget should be able to accommodate any widget.
       *
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuBarItem__postCreate() {
         domClass.add(this.containerNode, "alf-menu-bar-label-node");
         if ((this.iconClass && this.iconClass != "dijitNoIcon") ||
             this.iconImage != null)
         {
            this.iconNode = domConstruct.create("img", {
               className: this.iconClass,
               src: require.toUrl("alfresco/menus") + "/css/images/transparent-20.png",
               alt: this.message(this.iconAltText),
               title: this.message(this.iconAltText),
               tabIndex: 0,
               style: {
                  display: "inline-block"
               }
            }, this.focusNode, "first");
            if (this.label)
            {
               domClass.add(this.containerNode, this.labelWithIconClass);
            }
         }

         // If set, publish the topic when the item is rendered. Used for a default item.
         if (this.publishOnRender)
         {
            this.alfPublish(this.publishTopic, this.publishPayload, this.publishGlobal, this.parentScope);
         }

         this.setupIconNode();
         this.inherited(arguments);
      }
   });
});