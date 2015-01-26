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
 * @module alfresco/creation/WidgetDragWrapper
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/WidgetDragWrapper.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/on",
        "dijit/registry",
        "dojo/_base/lang",
        "dojo/_base/array"], 
        function(declare, _Widget, _Templated, template, AlfCore, CoreWidgetProcessing, on, registry, lang, array) {
   
   return declare([_Widget, _Templated, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/WidgetDragWrapper.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/WidgetDragWrapper.properties"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * @instance
       */
      postCreate: function alfresco_creation_WidgetDragWrapper__postCreate() {
         if (this.widgets != null)
         {
            this.processWidgets(this.widgets, this.controlNode);
         }
      },
      
      /**
       * Emits a custom a "onWidgetDelete" event to indicate that the widget should be deleted.
       * 
       * @instance
       * @param {object} evt The click event that triggers the delete.
       */
      onWidgetDelete: function alfresco_creation_WidgetDragWrapper__onWidgetDelete(evt) {
         on.emit(this.domNode, "onWidgetDelete", {
            bubbles: true,
            cancelable: true,
            widgetToDelete: this
         });
      },
      
      /**
       * @instance
       * @returns {object[]} An array of widget definitions from the nested widget (and its sub-widgets).
       */
      getWidgetDefinitions: function alfresco_creation_WidgetDragWrapper__getWidgetDefinitions() {
         // Get all the widgets defined with the DropZone to get any widget
         // definitions that they define...
         var widgets = registry.findWidgets(this.controlNode);
         var widgetDefs = [];
         array.forEach(widgets, lang.hitch(this, "getSubWidgetDefinitions", widgetDefs));
         return widgetDefs;
      },
      
      /**
       * @instance
       * @param {object[]} widgetDefs The array of widget definitions to add to
       * @param {object} widget The current widget to inspect for widget defintions
       * @param {number} index The index of the current widget to inspect.
       */
      getSubWidgetDefinitions: function alfresco_creation_WidgetDragWrapper__getSubWidgetDefinitions(widgetDefs, widget, index) {
         if (typeof widget.getWidgetDefinitions === "function")
         {
            var defs = widget.getWidgetDefinitions();
            if (defs != null && defs.length > 0)
            {
               array.forEach(defs, function(def, i) {
                  widgetDefs.push(def);
               });
            }
         }
      }
   });
});