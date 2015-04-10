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
 * @module alfresco/pickers/SingleItemPicker
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 * @author David Webster
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/ObjectProcessingMixin",
        "dojo/text!./templates/SingleItemPicker.html",
        "dojo/_base/lang",
        "dojo/_base/array",
        "alfresco/core/NodeUtils"],
        function(declare, _WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, 
                 ObjectProcessingMixin, template, lang, array, NodeUtils) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, ObjectProcessingMixin], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/SingleItemPicker.css"}]
       */
      cssRequirements: [{cssFile:"./css/SingleItemPicker.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       *
       * @instance
       */
      postCreate: function alfresco_pickers_SingleItemPicker__postCreate() {
         if (this.requestItemsTopic)
         {
            var pubSubScope = this.generateUuid();
            var requestTopic = pubSubScope + "ALF_SINGLE_PICKER_ITEMS_REQUEST";
            var successTopic = requestTopic + "_SUCCESS";
            var failureTopic = requestTopic + "_FAILURE";

            // If a requestItemsTopic attribute has been defined then we're going to publish a request
            // to get the items to display. By convention we will expect a publication in response containing
            // the results of the request which we need to subscribe to...
            this.alfSubscribe(successTopic, lang.hitch(this, "onItemsLoadSuccess"), true);
            this.alfSubscribe(failureTopic, lang.hitch(this, "onItemsLoadFailure"), true);

            // Publish the request for the items...
            this.alfPublish(this.requestItemsTopic, {
               alfResponseTopic: requestTopic
            }, true);
         }
      },

      /**
       * Handles the response of requests for the items to display.
       *
       * @instance
       * @param {object} payload The published details of the successfully loaded items.
       */
      onItemsLoadSuccess: function alfresco_pickers_SingleItemPicker__onItemsLoadSuccess(payload) {
         this.alfLog("log", "Items loaded", payload);

         if (!payload || !payload.response)
         {
            this.alfLog("warn", "The response for a request for SingleItemPicker items did not contain a 'response' attribute", payload, this);
         }
         else
         {
            // Iterate of the items and convert each item into a widget definition and add it to the
            var widgets = [];
            array.forEach(payload.response, lang.hitch(this, this.addItemWidgetConfig, widgets));

            var config = [
               {
                  name: "alfresco/menus/AlfVerticalMenuBar",
                  config: {
                     widgets: widgets
                  }
               }
            ];
            this.processWidgets(config, this.itemsNode);
         }
      },

      /**
       * Creates the configuration for a single item to be added to the overall AlfVerticalMenuBar item. Currently
       * this is incorrectly coded to assume that site data has been provided (whereas this should actually be a
       * much more abstract method and there should be a "SingleSitePicker" that extends this instance). This
       * will create an AlfMenuBarItem for the site that will publish a request to display an Explorer picker
       * when selected.
       *
       * @instance
       * @param {object[]} widgets The array of widgets to add the item widget to
       * @param {object} item The item to convert into a widget
       * @param {number} index The index of the item to add
       * @todo Hard coded to site data. See comment in method description about generalising code.
       */
      addItemWidgetConfig: function alfresco_pickers_SingleItemPicker__addItemWidgetConfig(widgets, item, /*jshint unused:false*/ index) {
         var siteNodeRef = NodeUtils.processNodeRef(item.node.substring(item.node.indexOf("workspace"))).nodeRef;

         // Generate the widget model for the sub-picker...
         // We're going to clone the defined "widgetsForSubPicker" configuration to prevent
         // pollution of values and then hi-jack the current item object to create an object
         // with the current siteNodeRef being handled (making sure to restore it later)...
         var widgetsForSubPicker = lang.clone(this.widgetsForSubPicker);
         this.currentItem = {
            siteNodeRef: siteNodeRef
         };
         this.processObject(["processCurrentItemTokens"], widgetsForSubPicker);

         var config = {
            name: "alfresco/menus/AlfMenuBarItem",
            config: {
               label: item.title,
               title: item.title,
               iconClass: "alf-sites-icon", // hard-coded sites Icon.
               publishTopic: "ALF_ADD_PICKER",
               publishPayload: {
                  currentPickerDepth: this.currentPickerDepth,
                  picker: widgetsForSubPicker
               }
            }
         };
         widgets.push(config);
      },

      /**
       *
       * @instance
       */
      widgetsForSubPicker: [
         {
            name: "alfresco/pickers/DocumentListPicker",
            config: {
               siteMode: true,
               libraryRoot: "{siteNodeRef}",
               nodeRef: "{siteNodeRef}",
               path: "/"
            }
         }
      ],

      /**
       * Handles failures to obtain the items to display.
       *
       * @instance
       * @param {object} payload The published details of the successfully loaded items.
       */
      onItemsLoadFailure: function alfresco_pickers_SingleItemPicker__onItemsLoadFailure(payload) {
         this.alfLog("error", "An error occurred trying to retrieve the items to display", payload, this);
      },

      /**
       * Handles the user clicking on a specific item.
       *
       * @instance
       */
      onItemSelected: function alfresco_pickers_SingleItemPicker__onItemSelected() {
         // TODO: Implement item selected function. This is only relevant for hardcoded options
         //       HOWEVER, maybe the menu item should publish a topic that this subscribes to so that this can
         //       be a more useful override??
      }
   });
});