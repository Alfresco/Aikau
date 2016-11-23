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
 * This mixin module provides a [function]{@link module:alfresco/core/WidgetsOverrideMixin#applyWidgetOverrides}
 * for overriding the default widget model to be generated. This function provides a consistent way in which 
 * new widgets can be added, removed, replaced and updated.
 * 
 * @module alfresco/core/WidgetsOverrideMixin
 * @author Dave Draper
 * @since 1.0.97
 */
define(["dojo/_base/declare",
        "alfresco/core/ObjectTypeUtils",
        "jquery"], 
        function(declare, ObjectTypeUtils, $) {
   
   return declare(null, {
      
      /**
       * Iterates over the supplied array of widgets until one with the supplied target id is found. The index
       * of the widget within the supplied array is then returned.
       *
       * @instance
       * @param  {object[]} widgets  An array of widgets to iterate over
       * @param  {string}   targetId The target ID to match
       * @return {number} The index of the widget in the array or -1 if it could not be found.
       */
      findWidgetToOverride: function alfresco_core_WidgetsOverrideMixin__findWidgetToOverride(widgets, targetId) {
         var existingWidgetIndex = -1;
         if (ObjectTypeUtils.isArray(widgets))
         {
            widgets.some(function(currentWidget, index) {
               if (currentWidget.id === targetId)
               {
                  existingWidgetIndex = index;
               }
               return existingWidgetIndex !== -1;
            }, this);
         }
         return existingWidgetIndex;
      },

      /**
       * Applies the supplied overrides to the supplied widgets model. Each element in the overrides array should
       * define how it should be applied to the widgets array. Given the starting widgets array:
       *
       * @example <caption>This is the default widgets model to be updated in the following examples</caption>
       * [
       *   {
       *     id: "WIDGET_1",
       *     name: "alfresco/forms/controls/TextBox",
       *     config: {
       *       fieldId: "NAME",
       *       label: "Name",
       *       description: "Enter your name",
       *       name: "name"
       *     }
       *   },
       *   {
       *     id: "WIDGET_2",
       *     name: "alfresco/forms/controls/NumberSpinner",
       *     config: {
       *       fieldId: "AGE",
       *       label: "Age",
       *       description: "How old are you?",
       *       name: "age"
       *     }
       *   }
       * ]
       *
       * @example <caption>Insert a widget at the start of the model using a <b>targetPosition</b> of <b>"START"</b></caption>
       * [
       *   {
       *     id: "ADDRESS",
       *     targetPosition: "START",
       *     name: "alfresco/forms/controls/TextBox",
       *     config: {
       *       fieldId: "ADDRESS",
       *       label: "Address",
       *       description: "Where do you live?",
       *       name: "address"
       *     }
       *   }
       * ]
       * 
       * @example <caption>Insert a widget at the end of the model using a <b>targetPosition</b> of <b>"END"</b></caption>
       * [
       *   {
       *     id: "ADDRESS",
       *     targetPosition: "END",
       *     name: "alfresco/forms/controls/TextBox",
       *     config: {
       *       fieldId: "ADDRESS",
       *       label: "Address",
       *       description: "Where do you live?",
       *       name: "address"
       *     }
       *   }
       * ]
       *
       * @example <caption>Insert a widget before another widget using by using a <b>targetPosition</b> of <b>"BEFORE"</b> and providing a <b>targetId</b></caption>
       * [
       *   {
       *     id: "ADDRESS",
       *     targetId: "WIDGET_2"
       *     targetPosition: "BEFORE",
       *     name: "alfresco/forms/controls/TextBox",
       *     config: {
       *       fieldId: "ADDRESS",
       *       label: "Address",
       *       description: "Where do you live?",
       *       name: "address"
       *     }
       *   }
       * ]
       *
       * @example <caption>Insert a widget after another widget using by using a <b>targetPosition</b> of <b>"AFTER"</b> and providing a <b>targetId</b></caption>
       * [
       *   {
       *     id: "ADDRESS",
       *     targetId: "WIDGET_1"
       *     targetPosition: "AFTER",
       *     name: "alfresco/forms/controls/TextBox",
       *     config: {
       *       fieldId: "ADDRESS",
       *       label: "Address",
       *       description: "Where do you live?",
       *       name: "address"
       *     }
       *   }
       * ]
       *
       * @example <caption>Remove a widget using using the <b>remove</b> attribute with the <b>id</b> of the widget to remove.</caption>
       * [
       *   {
       *     id: "WIDGET_2",
       *     remove: true
       *   }
       * ]
       *
       * @example <caption>Replace a widget using the <b>replace</b> attribute with the <b>id</b> of the widget to replace.</caption>
       * [
       *   {
       *     id: "WIDGET_2",
       *     replace: true,
       *     name: "alfresco/forms/controls/TextArea",
       *     config: {
       *       fieldId: "ADDRESS",
       *       label: "Location",
       *       name: "address"
       *     }
       *   }
       * ]
       *
       * @example <caption>Merge new configuration into an existing widget <b>id</b></caption>
       * [
       *   {
       *     id: "WIDGET_1",
       *     name: "alfresco/forms/controls/TextArea",
       *     config: {
       *       name: "Who are you?"
       *     }
       *   }
       * ]
       *
       * @instance
       * @param {object[]} widgets The default widgets
       * @param {object[]} overrides The overrides to apply
       */
      applyWidgetOverrides: function alfresco_core_WidgetsOverrideMixin__applyWidgetOverrides(widgets, overrides) {
         var existingWidgetIndex;

         if (ObjectTypeUtils.isArray(widgets) && ObjectTypeUtils.isArray(overrides))
         {
            overrides.forEach(function(override) {
               // jshint maxcomplexity:false
               if (override.targetPosition === "START")
               {
                  // Place the override widget as the first entry...
                  widgets.unshift(override);
               }
               else if (override.targetPosition === "END")
               {
                  // Place the override widget as the last entry...
                  widgets.push(override);
               }
               else if (override.targetId)
               {
                  // Find the target widget...
                  existingWidgetIndex = this.findWidgetToOverride(widgets, override.targetId);
                  if (existingWidgetIndex !== -1)
                  {
                     if (typeof override.targetPosition === "undefined" || override.targetPosition === "BEFORE")
                     {
                        // Place the override widget before the target
                        widgets.splice(existingWidgetIndex, 0, override);
                     }
                     else if (override.targetPosition === "AFTER")
                     {
                        // Place the override widget after the target
                        widgets.splice(existingWidgetIndex + 1, 0, override);
                     }
                     else
                     {
                        this.alfLog("warn", "An override widget has a target, but an unknown position", override, this);
                     }
                  }
                  else
                  {
                     this.alfLog("warn", "Could not find widget with requested targetId", override.targetId, this);
                  }
               }
               else if (override.id)
               {
                  // Find the target widget...
                  existingWidgetIndex = this.findWidgetToOverride(widgets, override.id);
                  if (existingWidgetIndex !== -1)
                  {
                     if (override.remove)
                     {
                        // Remove the widget (if it exists)
                        widgets.splice(existingWidgetIndex, 1);
                     }
                     else if (override.replace)
                     {
                        // Replace the widget (if it exists)
                        widgets[existingWidgetIndex] = override;
                     }
                     else
                     {
                        // Merge into the widget (if it exists)
                        $.extend(true, widgets[existingWidgetIndex], override);
                     }
                  }
                  else
                  {
                     this.alfLog("warn", "Could not find widget with requested id", override.targetId, this);
                  }
               }
            }, this);
         }
         else
         {
            this.alfLog("warn", "Invalid arguments provided for overriding widgets, two arrays were expected", widgets, overrides, this);
         }
      }
   });
});