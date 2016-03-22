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
 * <p>This module was created to address the situation where a widget might want to create multiple
 * sets of widgets but process the results in different ways. The [CoreWidgetProcessing mixin]{@link module:alfresco/core/CoreWidgetProcessing}
 * was created in such a way that it would allow individual functions to be easily overridden to
 * customize the widget creation process, and it was originally thought that a widget would
 * only have one child widget construct. However, during subsequent development it was established that
 * a widget might want to construct different sets of child widgets in a different way but it was only possible
 * to override the widget process in one way. This module solves that problem by allowing a widget to always 
 * construct children in the standard. An example of its use can be found in the [AlfDocumentListView]{@link module:alfresco/lists/views/AlfListView#renderNoDataDisplay}.
 *
 * @module alfresco/core/WidgetsCreator
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/lang"],
        function(declare, AlfCore, CoreWidgetProcessing, lang) {

   return declare([AlfCore, CoreWidgetProcessing], {

      /**
       * The widgets to create.
       * 
       * @instance
       * @type {array}
       * @default
       */
      widgets: null,

      /**
       * An optional callback function to call when all the widgets have been created. It is not
       * possible to pass a scope so a hitched (or bound) function should be supplied.
       * 
       * @instance
       * @type {function}
       * @default
       */
      callback: null,

      /**
       * Creates a new instance of the module.
       *
       * @instance
       */
      constructor: function alfresco_core_WidgetsCreator__constructor(args) {
         lang.mixin(this, args);
      },

      /**
       * This function is called to create the widgets. An optional rootNode argument can
       * be passed to provide a destination for the created widgets. If a caller argument
       * is provided then key data from it will be extracted for the creation of the widgets
       * (such as pubSubScope, dataScope, etc).
       * 
       * @instance
       * @param {element} rootNode The node to bind the root widgets to
       * @param {object} [caller] The calling widget or service.
       */
      buildWidgets: function alfresco_core_WidgetsCreator__buildWidgets(rootNode, caller) {
         if (caller)
         {
            // If a caller has passed itself then we want to extract all the core data that
            // would otherwise be extracted in CoreWidgetProcessing...
            this.pubSubScope = caller.pubSubScope;
            this.parentPubSubScope = caller.parentPubSubScope;
            this.dataScope = caller.dataScope;
            this.currentItem = caller.currentItem;
            this.currentMetadata = caller.currentMetadata;
            this.groupMemberships = caller.groupMemberships;
         }
         this.processWidgets(this.widgets, rootNode);
      },

      /**
       * This will call the [callback function]{@link module:alfresco/core/WidgetsCreator#callback}
       * if one has been configured.
       *
       * @instance
       * @param {Array} widgets An array of all the widgets that have been processed
       */
      allWidgetsProcessed: function alfresco_core_WidgetsCreator__allWidgetsProcessed(widgets) {
         if (typeof this.callback === "function")
         {
            this.callback(widgets);
         }
      }
   });
});