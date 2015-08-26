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
 * <p>This renderer generates a [menu bar]{@link module:alfresco/menus/AlfMenuBar} containing a 
 * [drop-down menu]{@link module:alfresco/menus/AlfMenuBarPopup} of [menu items]{@link module:alfresco/menus/AlfMenuItem}
 * representing an action set.</p>
 * 
 * <p>Actions are either derived from the "actions" attribute on the "currentItem" (which is typically populated through
 * a REST API call to Share and it should be noted that calls to the Repository REST APIs will not include actions), or
 * are defined by the [customActions]{@link module:alfresco/renderers/_ActionsMixin#customActions} and
 * [widgetsForActions]{@link module:alfresco/renderers/_ActionsMixin#widgetsForActions} attributes.</p>
 *
 * <p>[Custom actions]{@link module:alfresco/renderers/_ActionsMixin#customActions} take precedence over all other actions
 * and the [widgetsForActions]{@link module:alfresco/renderers/_ActionsMixin#widgetsForActions} attribute will only be
 * used when neither [customActions]{@link module:alfresco/renderers/_ActionsMixin#customActions} or "actions" on the
 * "currentItem" can be found. The purpose of the [widgetsForActions]{@link module:alfresco/renderers/_ActionsMixin#widgetsForActions}
 * is to provide a set of default actions that are rendered based on the metadata of a node. The default set of actions
 * can be replaced through configuration if required.</p>
 *
 * <p>It is possible to filter actions by configuring the [filterActions]{@link module:alfresco/renderers/_ActionsMixin#filterActions}
 * to true and then providing either an [allowedActions]{@link module:alfresco/renderers/_ActionsMixin#allowedActions} array
 * or [allowedActionsString]{@link module:alfresco/renderers/_ActionsMixin#allowedActionsString} string. Filtering only
 * applied to actions on defined on the "currentItem" or in the 
 * [customActions]{@link module:alfresco/renderers/_ActionsMixin#customActions} array.</p>
 *
 * <p>It is also possible to merge all types of actions by configured the 
 * [mergeActions]{@link module:alfresco/renderers/_ActionsMixin#mergeActions} attribute to be true</p>
 *
 * @example <caption>Example of filtering currentItem actions</caption>
 * {
 *   name: "alfresco/renderers/Actions",
 *   config: {
 *     filterActions: true,
 *     allowedActions: [
 *       "folder-manage-rules",
 *        "folder-download",
 *        "folder-view-details"
 *     ]
 *   }
 * }
 * 
 * @example <caption>Example of merging a custom action with currentItem actions (hiding all widgetsForActions)</caption>
 * {
 *   name: "alfresco/renderers/Actions",
 *   config: {
 *     mergeActions: true,
 *     customActions: [
 *       {
 *         id: "CUSTOM",
 *         label: "Custom Action",
 *         publishTopic: "CUSTOM_ACTION_TOPIC",
 *         publishPayloadType: "CURRENT_ITEM",
 *         type: "javascript"
 *       },
 *     ],
 *     widgetsForActions: []
 *   }
 * }
 *
 * @example <caption>Example of overriding widgetsForActions</caption>
 * {
 *   name: "alfresco/renderers/Actions",
 *   config: {
 *     widgetsForActions: [
 *       {
 *         name: "alfresco/renderers/actions/ManageAspects"
 *       }
 *     ]
 *   }
 * }
 * 
 * @module alfresco/renderers/Actions
 * @extends module:alfresco/menus/AlfMenuBar
 * @mixes module:alfresco/renderers/_ActionsMixin
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
       * @default
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
            id: this.id + "_GROUP",
            pubSubScope: this.pubSubScope,
            parentPubSubScope: this.parentPubSubScope
         });
         
         // Create a menu popup to hold the group...
         this.actionsMenu = new AlfMenuBarPopup({
            id: this.id + "_MENU",
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