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
 * This should be mixed into any widgets or services that need to be able to have additional widgets
 * be added to them. 
 * 
 * @module alfresco/core/DynamicWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/DynamicWidgetProcessingTopics",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(declare, AlfCore, DynamicWidgetProcessingTopics, lang, array) {
   
   return declare([AlfCore, DynamicWidgetProcessingTopics], {
      
      /**
       * @instance
       */
      postCreate: function alfresco_core_DynamicWidgetProcessing__postCreate() {
         this.alfSubscribe(this.dynamicallyAddWidgetTopic, lang.hitch(this, "processDynamicUpdates"))
         this.inherited(arguments);
      },
      
      /**
       * Processes a request to add a new widget. The following attributes are required.
       * <ul>
       * <li>"targetId" - the id of the widget to be added to
       * <li>"widgets" - the widgets to add
       * <li>"targetNode" - the DOM node name to target, defaults to "domNode"
       * <li>"targetPosition" - either "first" or "last", defaults to "first"
       * </ul>
       * @instance
       * @param {object} payload The payload received on the updateTopic
       */
      processDynamicUpdates: function alfresco_core_DynamicWidgetProcessing__processDynamicUpdates(payload) {
         if (!lang.exists("targetId", payload))
         {
            this.alfLog("warn", "A request made to add widgets dynamically but a 'targetId' attribute was not provided", payload);
         }
         else if (!lang.exists("widgets", payload))
         {
            this.alfLog("warn", "A request made to add widgets dynamically but a 'widgets' attribute was not provided", payload);
         }
         else if (payload.targetId == this.id)
         {
            var targetPosition = (typeof payload.targetPosition === "number") ? payload.targetPosition : null;
            array.forEach(payload.widgets, lang.hitch(this, "addWidgetDynamically", payload.targetId, targetPosition));
         }
      },
      
      /**
       * Dynamically adds a widget.
       * 
       * @instance
       * @param {string} targetId The attribute name of the widget to add the widgets to
       * @param {string} targetPosition The position at which to add the widget to the DOM node (e.g. first or last)
       * @param {object} widget The widget to add
       * @param {integer} index The index of the widget
       */
      addWidgetDynamically: function alfresco_core_DynamicWidgetProcessing__addWidgetDynamically(targetId, targetPosition, widget, index) {
         if (typeof widget.placeAt !== "function")
         {
            this.alfLog("error", "Widget has no 'placeAt' function so cannot be dynamically added", widget);
         }
         else
         {
            widget.placeAt(targetId, targetPosition);
         }
      }
   });
});