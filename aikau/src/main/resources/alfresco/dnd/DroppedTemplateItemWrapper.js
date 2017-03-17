/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * Extends the [DroppedNestingItemWrapper]{@link module:alfresco/dnd/DroppedNestingItemWrapper}
 * to provide support for templates - where a template is a model that can expose nested internal
 * attributes for external configuration.
 * 
 * @module alfresco/dnd/DroppedTemplateItemWrapper
 * @extends module:alfresco/dnd/DroppedNestingItemWrapper
 * @author Dave Draper
 * @since 1.0.49
 */
define(["dojo/_base/declare",
        "alfresco/dnd/DroppedNestingItemWrapper"], 
        function(declare, DroppedItemWrapper) {
   
   return declare([DroppedItemWrapper], {
      
      /**
       * Sets the value of the supplied widget with the current value.
       *
       * @instance
       * @param {object} widget The widget to set the value of.
       */
      setWidgetValue: function alfresco_dnd_DroppedNestingItemWrapper__setWidgetValue(widget) {
         if (widget && typeof widget.setValue === "function")
         {
            if (!this.value._alfTemplateName && this.value.name)
            {
               this.value._alfTemplateName = this.value.name;
               delete this.value.name;
               delete this.value.isTemplate;
            }
            widget.setValue(this.value);
         }
      }
   });
});