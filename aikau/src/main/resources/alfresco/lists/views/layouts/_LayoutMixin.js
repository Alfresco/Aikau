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
 * This mixin module extends [CoreWidgetProcessing]{@link module:alfresco/core/CoreWidgetProcessing} to provide
 * some additional identification processing for widgets in the alfresco/lists/layouts package. This is necessary to ensure
 * that an "id" attribute can be given to an widget in the alfresco/renderers package and for that attribute to be
 * updated to include the index of the current item. This is required because the renderers and list layout controls
 * are typically used when iterating over multiple items and Aikau ensures that each widget has a unique "id". Therefore
 * in order to be able to use unique identifiers within a page model it is necessary to update the "id" on each iteration
 * to prevent duplications.
 * 
 * @module alfresco/lists/views/layouts/_LayoutMixin
 * @extends module:aikau/core/ChildProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/ChildProcessing"], 
        function(declare, ChildProcessing) {
   
   return declare([ChildProcessing], {

      /**
       * Extends the [inherited function]{@link module:alfresco/core/CoreWidgetProcessing#processWidgetConfig}
       * to update the widget id (if configured) so that it is appended with "_ITEM_<index>" (where <index> is the
       * index of the current item being iterated over).
       *
       * @instance
       * @param {object} widget The widget configuration build configuration for
       * @return {object} The arguments that can be used when instantiating the widget configuration processed
       */
      processWidgetConfig: function alfresco_lists_views_layouts__LayoutMixin__processWidgetConfig(widget) {
         if (widget.id)
         {
            widget.id = widget.id + "_ITEM_" + this.currentItem.index;
         }
         return this.inherited(arguments);
      }
   });
});