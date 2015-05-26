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
 * The most basic representation of an item dragged from a [DragAndDropItems]{@link module:alfresco/dnd/DragAndDropItems}
 * widget and dropped onto a [DragAndDropTargetControl]{@link module:alfresco/form/controls/DragAndDropTargetControl} it
 * renders the [propertyToRender]{@link module:alfresco/dnd/DroppedItem#propertyToRender} (which defaults to "name")
 * attribute of the value of the dropped item.
 * 
 * @module alfresco/dnd/DroppedItem
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/DroppedItem.html",
        "alfresco/core/Core",
        "dojo/_base/lang"], 
        function(declare, _Widget, _Templated, template, AlfCore, lang) {
   
   return declare([_Widget, _Templated, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/DroppedItem.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * This is the dot-notation property of the dropped item value that should be displayed
       * for the dropped item.
       *
       * @instance
       * @type {string}
       * @default "name"
       */
      propertyToRender: "name",

      /**
       * @instance
       */
      setValue: function alfresco_dnd_DroppedItem__setValue(value) {
         this.value = value;
         if (this.value)
         {
            var displayValue = lang.getObject(this.propertyToRender || "name", false, this.value);
            if (displayValue)
            {
               // If a display value is found then check to see if it is an NLS key, and then
               // encode it just to be on the safe side...
               displayValue = this.encodeHTML(this.message(displayValue));
            }
            this.labelNode.innerHTML = displayValue;
         }
      }
   });
});