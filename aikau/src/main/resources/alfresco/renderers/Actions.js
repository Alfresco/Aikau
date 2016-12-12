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
 * @extends module:aikau/core/BaseWidget
 * @mixes dijit/_HasDropDown
 * @mixes module:alfresco/renderers/_ActionsMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "dijit/_HasDropDown",
        "alfresco/renderers/_ActionsMixin",
        "alfresco/buttons/AlfButton",
        "alfresco/menus/AlfMenuGroups",
        "alfresco/menus/AlfMenuGroup",
        "dijit/Menu",
        "dojo/dom-class",
        "dojo/_base/event",
        "dojo/_base/lang",
        "dojo/keys"],
        function(declare, BaseWidget, _HasDropDown, _ActionsMixin, AlfButton, 
                 AlfMenuGroups, AlfMenuGroup, Menu, domClass, Event, lang, keys) {

   return declare([BaseWidget, _HasDropDown, _ActionsMixin], {
      
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
       * The label to display to as the actions renderer.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.46
       */
      label: "alf.renderers.Actions.menuLabel",

      /**
       * This will hold a reference to the [button]{@link module:alfresco/buttons/AlfButton} that when
       * clicked will display a drop-down menu containing the available actions. This should not be 
       * referenced by extending widgets as it may not always be available depending upon how implementation 
       * of widget changes.
       * 
       * @instance
       * @type {object}
       * @default
       * @since 1.0.62
       */
      _button: null,

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_Actions__createWidgetDom() {
         this.domNode = document.createElement("div");
         this.domNode.classList.add("alfresco-renderers-Actions");
      },

      /**
       * Ensures that the [menu]{@link module:alfresco/renderers/Actions#_menu} is destroyed.
       *
       * @instance
       * @param  {boolean} preserveDom Indicates whether or not the DOM should be preserved.
       * @since 1.0.46
       */
      destroy: function alfresco_renderers_Actions__destroy(/*jshint unused:false*/ preserveDom) {
         this.inherited(arguments);
         if (this._menu)
         {
            this._menu.destroyRecursive();
         }
      },

      /**
       * Handles key press events on the actions renderer and opens the menu if 
       * 
       * @instance
       * @param  {object} evt The key press event
       * @since 1.0.46
       */
      onKeyPress: function alfresco_renderers_Actions__onKeyPress(evt) {
         if (evt && (evt.charOrCode === keys.ENTER || evt.charCode === keys.SPACE))
         {
            Event.stop(evt);
            this._menu._scheduleOpen(this.domNode, null, null, this.domNode);
         }
      },

      /**
       * Sets the local appropriate [label]{@link module:alfresco/renderers/Actions#label}.
       * 
       * @instance
       * @since 1.0.46
       */
      postMixInProperties: function alfresco_renderers_Actions__postMixInProperties() {
         this.inherited(arguments);
         this.label = this.message(this.label);
      },

      /**
       * Overrides the default to create a popup containing a group containing all the actions
       * for the current item.
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_Actions__postCreate() {
         this.inherited(arguments);

         // Handle display on hover configuration...
         if (this.onlyShowOnHover === true)
         {
            domClass.add(this.domNode, "hover-only");
         }
         else
         {
            // No action
         }

         this._button = this.createWidget({
            name: "alfresco/buttons/AlfButton",
            config: {
               additionalCssClasses: "call-to-action",
               label: this.message("alf.renderers.Actions.menuLabel"),
               publishTopic: "NO_OP"
            }
         });
         this._button.placeAt(this.domNode);
         this._buttonNode = this._button.domNode;
         this._aroundNode = this._button.domNode;
      }
   });
});
