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
 * @module alfresco/menus/AlfMenuBarPopup
 * @extends external:dijit/PopupMenuBarItem
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @mixes module:alfresco/core/CoreRwd
 * @mixes module:alfresco/menus/_AlfPopupCloseMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/PopupMenuBarItem",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/CoreRwd",
        "alfresco/menus/_AlfPopupCloseMixin",
        "dojo/dom-construct",
        "dojo/dom-class",
        "alfresco/menus/AlfMenuGroups"], 
        function(declare, PopupMenuBarItem, AlfCore, CoreWidgetProcessing, AlfCoreRwd, _AlfPopupCloseMixin, domConstruct, domClass) {
   
   return declare([PopupMenuBarItem, AlfCore, CoreWidgetProcessing, AlfCoreRwd, _AlfPopupCloseMixin], {
      
      /**
       * The scope to use for i18n messages.
       * 
       * @instance
       * @type {string}
       * @default "org.alfresco.Menus"
       */
      i18nScope: "org.alfresco.Menus",
      
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
       * @instance
       * @type {string}
       * @default ""
       */
      iconAltText: "",

      /**
       * If an optional iconSrc is provided, the menu icon will be rendered using that image instead of
       * the transparent one.
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      iconSrc: "",
      
      /**
       * This CSS class is added to the container node when an icon is to be included with the label. By
       * default it simply makes room for the icon - but this can be overridden.
       * 
       * @instance
       * @type {string}
       * @default "alf-menu-bar-popup-label-node"
       */
      labelWithIconClass: "alf-menu-bar-popup-label-node",
      
      /**
       * It's important to perform label encoding before buildRendering occurs (e.g. before postCreate)
       * to ensure that an unencoded label isn't set and then replaced. 
       * 
       * @instance
       */
      postMixInProperties: function alfresco_menus_AlfMenuBarPopup__postMixInProperties() {
         if (this.label)
         {
            this.label = this.encodeHTML(this.message(this.label));
         }
         if (this.title)
         {
            this.title = this.encodeHTML(this.message(this.title));
         }
         this.inherited(arguments);
      },
      
      /**
       * Sets the label of the menu item that represents the popup and creates a new alfresco/menus/AlfMenuGroups
       * instance containing all of the widgets to be displayed in the popup. Ideally the array of widgets should
       * be instances of alfresco/menus/AlfMenuGroup (where instance has its own list of menu items). However, this
       * widget should be able to accommodate any widget.
       * 
       * @instance
       */
      postCreate: function alfresco_menus_AlfMenuBarPopup__postCreate() {
         if (this.iconClass && this.iconClass !== "dijitNoIcon")
         {
            this.iconNode = domConstruct.create("img", { 
               className: this.iconClass, 
               src: (this.iconSrc ? this.iconSrc : require.toUrl("alfresco/menus") + "/css/images/transparent-20.png"),
               title: this.message(this.iconAltText),
               alt: this.message(this.iconAltText),
               tabIndex: 0
            }, this.focusNode, "first");
            if (this.label)
            {
               domClass.add(this.containerNode, this.labelWithIconClass);
            }
         }
         if (this.showArrow)
         {
            // Add in the "arrow" image to indicate a drop-down menu. We do this with DOM manipulation
            // rather than overriding the default template for such a minor change. This means that we
            // have some protection against changes to the template in future Dojo releases.
            domConstruct.create("span", { className: "alf-menu-arrow",
                                          innerHTML: "&#9662;"}, this.focusNode);
         }
         this.inherited(arguments);
         
         // A class in the hierarchy (PopupMenuItem) is expecting a "popup" attribute that contains the
         // dropdown menu item. We are going to construct this from the widgets provided.
         this.createWidget({
            name: "alfresco/menus/AlfMenuGroups",
            assignTo: "popup",
            config: {
               widgets: this.widgets
            }
         });
         
         // Call the method provided by the _AlfPopupCloseMixin to handle popup close events...
         this.registerPopupCloseEvent();
      }
   });
});