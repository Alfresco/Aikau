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
 * <p>This module can be mixed into other modules to generate [menu items]{@link module:alfresco/menus/AlfMenuItem}
 * representing Alfresco document or folder actions generated for a specific node or an entirely custom action
 * list. It exists as mixin to support multipe ways of rendering actions (e.g. either in a menu bar or in a
 * context menu)</p>.
 *
 * @module alfresco/renderers/_ActionsMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "alfresco/core/ObjectProcessingMixin",
        "alfresco/menus/AlfMenuItem",
        "dojo/_base/array",
        "dojo/_base/lang",
        "service/constants/Default",
        "alfresco/core/ArrayUtils",
        "alfresco/core/JsNode"],
        function(declare, AlfCore, CoreWidgetProcessing, _AlfDocumentListTopicMixin, _PublishPayloadMixin, ObjectProcessingMixin, 
                 AlfMenuItem, array, lang, AlfConstants, AlfArray, JsNode) {

   return declare([AlfCore, CoreWidgetProcessing, _AlfDocumentListTopicMixin, _PublishPayloadMixin, ObjectProcessingMixin], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/_ActionsMixin.css"}]
       */
      cssRequirements: [{cssFile: "./css/_ActionsMixin.css"}],

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/_ActionsMixin.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/_ActionsMixin.properties"}],

      /**
       * Indicates whether or not actions should be filtered according to the
       * [allowedActions array]{@link module:alfresco/renderers/Actions#allowedActions}.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      filterActions: false,

      /**
       *  Array containing a list of allowed actions
       *  This is used to filter out actions that the actions API returns, but haven't yet been implemented.
       *  TODO: Remove this once all actions have been implemented by the actions service.
       *  Currently - all actions of type link and pagelink should work.
       *
       * @instance
       * @type {array}
       * @default null
       */
      allowedActions: null,

      /**
       * A stringified array containing a list of allowed actions. This has been added to support token replacement
       * within JSON models. It will override any [allowedActions]{@link module:alfresco/renderers/_ActionsMixin#allowedActions}
       * configuration.
       *
       * @instance
       * @type {array}
       * @default null
       */
      allowedActionsString: null,

      /**
       * Handles parsing of [allowedActionsString]{@link module:alfresco/renderers/_ActionsMixin#allowedActionsString} if configured
       * to override [allowedActions]{@link module:alfresco/renderers/_ActionsMixin#allowedActions}.
       * 
       * @instance
       */
      postCreate: function alfresco_renderers__ActionsMixin__postCreate() {
         this.inherited(arguments);
         if (this.allowedActionsString)
         {
            try
            {
               this.allowedActions = JSON.parse(this.allowedActionsString);
            }
            catch(e)
            {
               // Ignore bad configuration
               this.alfLog("warn", "A non-parsable 'allowedActionsString' was configured", this, this.allowedActionsString);
            }
         }
      },

      /**
       * This is array of actions to render if no customActions are defined or no actions are found in the
       * currentItem. The list of actions does not currently reflect all the actions that will eventually be available,
       * additional actions will be added in future releases as support is provided for them.
       *
       * @instance
       * @type {object[]}
       */
      widgetsForActions: [
         {
            name: "alfresco/renderers/actions/UploadNewVersion"
         }
      ],


      /**
       * Add the actions provided by the current item.
       *
       * @instance
       */
      addActions: function alfresco_renderers__ActionsMixin__addActions() {
         // Iterate over the actions to create a menu item for each of them...
         if (this.customActions && this.customActions.length > 0)
         {
            array.forEach(this.customActions, lang.hitch(this, this.addAction));
         }
         else if (this.currentItem.actions && this.currentItem.actions.length > 0)
         {
            array.forEach(this.currentItem.actions, lang.hitch(this, this.addAction));
         }
         else if (this.widgetsForActions)
         {
            // Provide default actions based on sensible defaults evaluated based on the 
            // current item to be actioned...

            // TODO: We probably want to avoid rendering all the actions until the menu is opened...
            var actions = [];
            array.forEach(this.widgetsForActions, function(action) {
               if (action && action.name)
               {
                  require([action.name], function(config) {
                     if (config)
                     {
                        // TODO: A potential future improvement here would be to allow replacement
                        //       or augmentation of the default renderFilters.
                        actions.push({
                           name: "alfresco/menus/AlfMenuItem",
                           config: config
                        });
                     }
                  });
               }
            }, this);
            this.processWidgets(actions);
         }
      },

      allWidgetsProcessed: function alfresco_renderers__ActionsMixin__allWidgetsProcessed(widgets) {
         array.forEach(widgets, function(widget) {
            this.actionsGroup.addChild(widget);
         }, this);
      },

      /**
       *
       * @instance
       * @param {object} action The configuration for the action to add
       * @param (integer} index The index of the action
       */
      addAction: function alfresco_renderers__ActionsMixin__addAction(action, /*jshint unused:false*/index) {
         if (this.filterActions === false || AlfArray.arrayContains(this.allowedActions, action.id))
         {
            this.alfLog("log", "Adding action", action);

            // If there is a node object then create the corresponding jsNode object - this is required for 
            // label processing below
            if (!this.currentItem.jsNode && this.currentItem.node)
            {
               this.currentItem.jsNode = new JsNode(this.currentItem.node);
            }

            // Some Share actions have variable labels, most notably the simple workflow actions, and these should
            // be processed to ensure that they are rendered correctly.
            if (action.label)
            {
               action.label = this.processTokens(action.label, this.currentItem);
            }

            var payload = (action.publishPayload) ? action.publishPayload : {document: this.currentItem, action: action};
            var menuItem = new AlfMenuItem({
               label: action.label,
               iconImage: AlfConstants.URL_RESCONTEXT + "components/documentlibrary/actions/" + action.icon + "-16.png",
               type: action.type,
               pubSubScope: this.pubSubScope,
               parentPubSubScope: this.parentPubSubScope,
               publishTopic: action.publishTopic || this.singleDocumentActionTopic,
               publishPayload: this.generatePayload(payload, this.currentItem, null, action.publishPayloadType, action.publishPayloadItemMixin, action.publishPayloadModifiers),
               publishGlobal: this.publishGlobal,
               publishToParent: this.publishToParent
            });
            this.actionsGroup.addChild(menuItem);
         }
         else
         {
            this.alfLog("log", "Skipping action as it's missing from whitelist: " + action);
         }
      }
   });
});