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
 * Use this widget to render a row of [cells]{@link module:alfresco/lists/views/layouts/Cell}
 * 
 * @module alfresco/lists/views/layouts/Row
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Row.html",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/dom-class"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, _MultiItemRendererMixin, AlfCore, CoreWidgetProcessing, domClass) {

   return declare([_WidgetBase, _TemplatedMixin, _MultiItemRendererMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Row.css"}]
       */
      cssRequirements: [{cssFile:"./css/Row.css"}],
      
      /**
       * The HTML template to use for the widget.
       * 
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * Any additional CSS classes that should be applied to the rendered DOM element.
       *
       * @instance
       * @type {string}
       * @default  null
       */
      additionalCssClasses: null,

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * 
       * @instance postCreate
       */
      postCreate: function alfresco_lists_views_layouts_Row__postCreate() {
         domClass.add(this.domNode, this.additionalCssClasses ? this.additionalCssClasses : "");
         if (this.widgets)
         {
            if (this.widgetModelModifiers !== null)
            {
               this.processObject(this.widgetModelModifiers, this.widgets);
            }
            this.processWidgets(this.widgets, this.containerNode);
         }
      },

      /**
       * Focuses the domNode. This has been added to support the dijit/_KeyNavContainer functions mixed into 
       * the [document library views]{@link module:alfresco/lists/views/AlfListView} to 
       * allow easier keyboard navigation.
       * 
       * @instance
       */
      focus: function alfresco_lists_views_layouts_Row__focus() {
         this.domNode.focus();
      }
   });
});