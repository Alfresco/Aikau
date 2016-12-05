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
 * Use this widget to render a single cell within a [Row]{@link module:alfresco/lists/views/layouts/Row}
 * 
 * @module alfresco/lists/views/layouts/Cell
 * @extends external:dijit/_WidgetBase
 * @mixes external:dijit/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/lists/views/layouts/_LayoutMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "alfresco/core/Core",
        "alfresco/lists/views/layouts/_LayoutMixin",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/dom-attr"], 
        function(declare, _WidgetBase, _TemplatedMixin, AlfCore, _LayoutMixin, domClass, domStyle, domAttr) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, _LayoutMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Cell.css"}]
       */
      cssRequirements: [{cssFile:"./css/Cell.css"}],
      
      /**
       * Any additional CSS classes that should be applied to the rendered DOM element.
       *
       * @instance
       * @type {string}
       * @default
       */
      additionalCssClasses: null,

      /**
       * The number of columns that this cell should span. Defaults to null (indicating that
       * a colspan attribute will not be set on the rendered DOM element).
       *
       * @instance
       * @type {number}
       * @default
       */
      colspan: null,

      /**
       * The width to set the cell. This should include units, e.g. "100px" for 100 pixels.
       *
       * @instance
       * @type {string}
       * @default
       */
      width: null,

      /**
       * Builds the DOM model for the widget.
       * 
       * @instance
       * @since 1.0.NEXT
       */
      buildRendering: function alfresco_lists_views_layouts_Cell__buildRendering() {
         if (this.templateString)
         {
            this.inherited(arguments);
         }
         else
         {
            this.containerNode = this.domNode = document.createElement("td");
            this.domNode.classList.add("alfresco-lists-views-layouts-Cell");
         }
      },
      
      /**
       * @instance
       * @since 1.0.NEXT
       */
      postMixInProperties : function alfresco_lists_views_layouts_Cell__postMixInProperties() {
          // this widget (as all Aikau widgets) can be configured with countless config attributes
          // _applyAttributes causes significant overhead since it processes all "as if" they can be mapped to DOM
          // most Aikau widgets would probably do good to prevent that
          // those that extend Dojo/Dijit widgets may want to provide a reduced set
          var paramsOriginal = this.params;
          this.params = null;
          
          this.inherited(arguments);
      },

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * 
       * @instance
       */
      postCreate: function alfresco_lists_views_layouts_Cell__postCreate() {
         // restore params for anyone that needs it later
         this.params = this._paramsOriginal;
         delete this._paramsOriginal;
          
         if (this.colspan)
         {
            domAttr.set(this.domNode, "colspan", this.colspan);
         }
         if (this.width)
         {
            domStyle.set(this.domNode, "width", this.width);
         }
         if(this.additionalCssClasses)
         {
            domClass.add(this.domNode, this.additionalCssClasses);
         }
         if (this.widgets)
         {
            // this.processWidgets(this.widgets, this.containerNode);
            this.createChildren({
               widgets: this.widgets,
               targetNode: this.containerNode
            });
         }
      }
   });
});