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
 * @extends module:aikau/core/BaseWidget
 * @mixes module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @mixes module:alfresco/lists/views/layouts/_LayoutMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "alfresco/lists/views/layouts/_LayoutMixin",
        "alfresco/documentlibrary/_AlfDndDocumentUploadMixin",
        "dojo/dom-class",
        "dojo/_base/event",
        "dojo/_base/lang"], 
        function(declare, BaseWidget, _MultiItemRendererMixin, _PublishPayloadMixin, _LayoutMixin, 
                 _AlfDndDocumentUploadMixin, domClass, event, lang) {

   return declare([BaseWidget, _MultiItemRendererMixin, _PublishPayloadMixin, _LayoutMixin, _AlfDndDocumentUploadMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Row.css"}]
       */
      cssRequirements: [{cssFile:"./css/Row.css"}],
      
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
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.100
       */
      createWidgetDom: function alfresco_lists_views_layouts_Row__createWidgetDom() {
         this.containerNode = this.domNode = document.createElement("tr");
         this.domNode.classList.add("alfresco-lists-views-layouts-Row");
         this.domNode.setAttribute("tabindex", "0");
         this._attach(this.domNode, "onclick", lang.hitch(this, this.onFocusClick));
      },

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
            this.createChildren({
               widgets: this.widgets,
               targetNode: this.containerNode
            });
         }

         if (this.hasUploadPermissions() === true)
         {
            this.addUploadDragAndDrop(this.domNode);
            this._currentNode = this.currentItem.node;
         }

         if (this.publishTopic)
         {
            domClass.add(this.domNode, "alfresco-lists-views-layouts-Row--supports-click");
         }
      },

      /**
       * Focuses the domNode. This has been added to support the dijit/_KeyNavContainer functions mixed into 
       * the [document library views]{@link module:alfresco/lists/views/AlfListView} to 
       * allow easier keyboard navigation.
       * 
       * @instance
       */
      focus: function alfresco_lists_views_layouts_Row__focus(evt) {
         this.domNode.focus();

         if (this.publishTopic)
         {
            var payload = this.generatePayload(this.publishPayload || {}, 
                                               this.currentItem, 
                                               null, 
                                               this.publishPayloadType, 
                                               this.publishPayloadItemMixin, 
                                               this.publishPayloadModifiers);
            this.alfPublish(this.publishTopic, payload, this.publishGlobal, this.publishToParent, this.publishScope);
            if (evt && typeof evt.preventDefault === "function")
            {
               event.stop(evt);
            }
         }
      }
   });
});