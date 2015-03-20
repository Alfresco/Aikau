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
 * @module alfresco/dnd/DragAndDropFormControlTarget
 * @extends module:alfresco/dnd/DragAndDropNestedTarget
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/dnd/DragAndDropNestedTarget",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dijit/registry"], 
        function(declare, DragAndDropNestedTarget, lang, array, registry) {
   
   return declare([DragAndDropNestedTarget], {
      
      /**
       * The property of the form control to use as the label in the options list. This defaults
       * to the parameter name assigned to the form control.
       *
       * @instance
       * @type {string}
       * @default "name"
       */
      labelProperty: "config.name",

      /**
       * The property of the form control to use as the value in the options list. This defaults
       * to the parameter fieldId assigned to the form control.
       *
       * @instance
       * @type {string}
       * @default "fieldId"
       */
      valueProperty: "config.fieldId",

      /**
       * This function is called after a new item is dropped onto the page.
       *
       * @instance
       */
      onItemsUpdated: function alfresco_dnd_DragAndDropFormControlTarget__onItemsUpdated() {
         this.inherited(arguments);

         // Get all the available form controls in the drop target...
         var allFields = [];
         var nodes = this.previewTarget.getAllNodes();
         array.forEach(nodes, function(node) {
            // Get the widgets for the node...
            var widget = registry.byNode(node);
            if (widget && typeof widget.getValue === "function")
            {
               var value = widget.getValue();
               var optionLabel = lang.getObject(this.labelProperty, false, value);
               var optionValue = lang.getObject(this.valueProperty, false, value);
               if (optionLabel && optionValue)
               {
                  allFields.push({
                     label: optionLabel,
                     value: optionValue
                  });
               }
               else
               {
                  this.alfLog("log", "Value and label properties are not set on form control yet so cannot be added as an option", this, value);
               }
               
               widget.formControlOptions = allFields;
            }
         }, this);
      }
   });
});