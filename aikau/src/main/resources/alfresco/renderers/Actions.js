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
 * <p>This renderer generates a [menu bar]{@link module:alfresco/menus/AlfMenuBar} containing a 
 * [drop-down menu]{@link module:alfresco/menus/AlfMenuBarPopup} of [menu items]{@link module:alfresco/menus/AlfMenuItem}
 * representing an action set.</p>
 * 
 * <p>This module was written to intially support Alfresco document and folder actions as generated for a 
 * individual nodes but has since been expanded to support custom actions. The majority of the action handling
 * code is done by the [_ActionsMixin]{@link module:alfresco/renderers/_ActionsMixin}</p>
 * 
 * @module alfresco/renderers/Actions
 * @extends module:alfresco/menus/AlfMenuBar
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBar",
        "alfresco/renderers/_ActionsMixin",
        "alfresco/menus/AlfMenuBarPopup",
        "alfresco/menus/AlfMenuGroup",
        "alfresco/menus/AlfMenuItem",
        "dojo/dom-class"],
        function(declare, AlfMenuBar, _ActionsMixin, AlfMenuBarPopup, AlfMenuGroup, AlfMenuItem, domClass) {

   return declare([AlfMenuBar, _ActionsMixin], {

      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Actions.css"}]
       */
      cssRequirements: [{cssFile:"./css/Actions.css"}],

      /**
      * The array of file(s) containing internationalised strings.
      *
      * @instance
      * @type {object}
      * @default [{i18nFile: "./i18n/Actions.properties"}]
      */
      i18nRequirements: [{i18nFile: "./i18n/Actions.properties"}],

      /**
       * Indicates that this should only be displayed when the item (note: NOT the renderer) is
       * hovered over.
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      onlyShowOnHover: false,

      /**
       * Overrides the default to create a popup containing a group containing all the actions
       * for the current item.
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_Actions__postCreate() {
         this.inherited(arguments);

         // Add a class to tie this to the CSS selectors for this widget...
         domClass.add(this.domNode, "alfresco-renderers-Actions");

         // Handle display on hover configuration...
         if (this.onlyShowOnHover === true)
         {
            domClass.add(this.domNode, "hover-only");
         }
         else
         {
            // No action
         }

         // Create a group to hold all the actions...
         this.actionsGroup = new AlfMenuGroup({
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.parentPubSubScope
         });
         
         // Create a menu popup to hold the group...
         this.actionsMenu = new AlfMenuBarPopup({
            label:  this.message("alf.renderers.Actions.menuLabel"),
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.parentPubSubScope
         });
         this.actionsMenu.popup.addChild(this.actionsGroup);
         
         // Add all the actions...
         this.addActions();

         this._menuBar.addChild(this.actionsMenu);
         this._menuBar.placeAt(this.containerNode);
      }
   });
});