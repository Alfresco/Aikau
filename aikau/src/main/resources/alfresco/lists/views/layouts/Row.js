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
 * Use this widget to render a row of [cells]{@link module:alfresco/lists/views/layouts/Cell}
 * 
 * @module alfresco/lists/views/layouts/Row
 * @extends module:alfresco/core/BaseWidget
 * @mixes module:alfresco/core/_ConstructedWidgetMixin
 * @mixes module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @mixes module:alfresco/lists/views/layouts/_LayoutMixin
 * @mixes module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/BaseWidget",
        "alfresco/core/_ConstructedWidgetMixin",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin",
        "alfresco/lists/views/layouts/_LayoutMixin",
        "alfresco/documentlibrary/_AlfDndDocumentUploadMixin",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/on"], 
        function(declare, BaseWidget, _ConstructedWidgetMixin, _MultiItemRendererMixin, _LayoutMixin, 
                 _AlfDndDocumentUploadMixin, lang, domConstruct, on) {

   return declare([BaseWidget, _ConstructedWidgetMixin, _MultiItemRendererMixin, _LayoutMixin, _AlfDndDocumentUploadMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Row.css"}]
       */
      cssRequirements: [{cssFile:"./css/Row.css"}],
      
      /**
       * Overriden flag inherited from {@link module:alfresco/core/CoreWidgetProcessing} to always create all rows in a detached DOM tree.
       * 
       * @instance
       * @type {boolean}
       * @default true
       * @since 1.0.6x
       */
      defaultToDetachedWidgetCreation: true,
      
      /**
       * Any additional CSS classes that should be applied to the rendered DOM element.
       *
       * @instance
       * @type {string}
       * @default
       */
      additionalCssClasses: null,

      /**
       * Overrides the [mixed in default]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#dndUploadHighLightImage}
       * to use the smaller image.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.42
       */
      dndUploadHighlightImage: "elipse-cross.png",

      /**
       * Overrides the [mixed in default]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#dndUploadText}
       * to hide the upload message.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.42
       */
      dndUploadHighlightText: "",

      /**
       * Overrides the 
       * [default mixed in configuration]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#suppressDndUploading}
       * to suppress upload highlighting by default.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.42
       */
      suppressDndUploading: true,
    
      /**
       * Indicates that a "zebra striping" style should be applied (e.g. odd and even rows being different
       * colours). 
       *
       * @instance
       * @type {boolean}
       * @default
       */
      zebraStriping: false,
      
      /**
       * Builds the DOM structure.
       * 
       * @instance buildDOMStructure
       */
      buildDOMStructure : function alfresco_lists_views_layouts_Row__buildDOMStructure(rootNode) {
          var nodeProps = this._buildDOMNodeProperties();
          
          nodeProps.className += " ";
          nodeProps.className += "alfresco-lists-views-layouts-Row";
          nodeProps.tabindex = "0";
    
          this.containerNode = this.domNode = domConstruct.create("tr", nodeProps, rootNode);
          this._setupWidgetInfo();
      },
      
      /**
       * Sets up the DOM events.
       * 
       * @instance setupEvents
       */
      setupEvents : function alfresco_lists_views_layouts_Row__setupEvents() {
          this.own(on(this.domNode, "click", lang.hitch(this, this.onFocusClick)));
      },

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * 
       * @instance postCreate
       */
      postCreate: function alfresco_lists_views_layouts_Row__postCreate() {
         if (this.widgets)
         {
            if (this.widgetModelModifiers !== null)
            {
               this.processObject(this.widgetModelModifiers, this.widgets);
            }
            this.processWidgets(this.widgets, this.containerNode);
         }

         if (this.hasUploadPermissions() === true)
         {
            this.addUploadDragAndDrop(this.domNode);
            this._currentNode = this.currentItem.node;
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