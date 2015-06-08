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
 * @module alfresco/lists/views/layouts/_LayoutMixin
 * @extends module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/CoreWidgetProcessing"], 
        function(declare, CoreWidgetProcessing) {
   
   return declare([CoreWidgetProcessing], {

      /**
       * Extends the [inherited function]{@link module:alfresco/core/CoreWidgetProcessing#processWidgetConfig}
       * to update the widget id (if configured) so that it is appended with "_ITEM_<index>" (where <index> is the
       * index of the current item being iterated over).
       *
       * @instance
       * @param {object} widget The widget configuration build configuration for
       * @return {object} The arguments that can be used when instantiating the widget configuration processed
       */
      processWidgetConfig: function alfresco_lists_views_layouts_Cell__processWidgetConfig(widget) {
         if (widget.id)
         {
            widget.id = widget.id + "_ITEM_" + this.currentItem.index;
         }
         return this.inherited(arguments);
      }
   });
});