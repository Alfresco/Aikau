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
 * This is a more complex representation of an item dragged from a [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems}
 * widget and dropped onto a [DragAndDropTargetControl]{@link module:alfresco/form/controls/DragAndDropTargetControl} it
 * renders the widgets defined by the value of the item.
 * 
 * @module alfresco/dnd/DroppedItemWidgets
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/DroppedItemWidgets.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/lang",
        "alfresco/forms/controls/TextBox"], 
        function(declare, _Widget, _Templated, template, AlfCore, CoreWidgetProcessing, lang) {
   
   return declare([_Widget, _Templated, AlfCore, CoreWidgetProcessing], {
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * @instance
       * @param {object} value
       */
      setValue: function alfresco_dnd_DroppedItemWidgets__setValue(value) {
         this.value = value;

         // It's assumed that the value should be the widgets
         var widgets = lang.clone(this.value);
         this.processWidgets([widgets], this.widgetsNode);
      }
   });
});