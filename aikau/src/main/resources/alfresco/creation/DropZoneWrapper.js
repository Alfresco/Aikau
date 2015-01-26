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
 * @module alfresco/creation/DropZoneWrapper
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/DropZoneWrapper.html",
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
      cssRequirements: [{cssFile:"./css/DropZoneWrapper.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/DropZoneWrapper.properties"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * @instance
       * @type {string}
       * @default ""
       */
      moduleName: "<not set>",
      
      /**
       * @instance
       */
      postCreate: function alfresco_creation_DropZoneWrapper__postCreate() {
         if (this.widgets != null)
         {
            this.processWidgets(this.widgets, this.controlNode);
         }
      },

      /**
       * Sets the a reference to the wrapper on each child widget.
       *
       * @instance
       * @param {element} rootNode The DOM node where the widget should be created.
       * @param {object} widgetConfig The configuration for the widget to be created
       * @param {number} index The index of the widget configuration in the array that it was taken from
       */
      processWidget: function alfresco_creation_DropZoneWrapper__processWidget(rootNode, widgetConfig, index) {
         if (widgetConfig != null && widgetConfig.config != null)
         {
            widgetConfig.config._dropZoneWrapperId = this.fieldId;
         }
         this.inherited(arguments);
      },
      
      /**
       * Emits a custom a "onWidgetDelete" event to indicate that the widget should be deleted.
       * 
       * @instance
       * @param {object} evt The click event that triggers the delete.
       */
      onWidgetDelete: function alfresco_creation_DropZoneWrapper__onWidgetDelete(evt) {
         on.emit(this.domNode, "onWidgetDelete", {
            bubbles: true,
            cancelable: true,
            widgetToDelete: this
         });
      }
   });
});