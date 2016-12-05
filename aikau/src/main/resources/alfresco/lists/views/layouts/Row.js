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
 * @extends external:dijit/_WidgetBase
 * @mixes module:alfresco/lists/views/layouts/_MultiItemRendererMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @mixes module:alfresco/lists/views/layouts/_LayoutMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/lists/views/layouts/_MultiItemRendererMixin",
        "alfresco/core/Core",
        "alfresco/renderers/_PublishPayloadMixin",
        "alfresco/lists/views/layouts/_LayoutMixin",
        "alfresco/documentlibrary/_AlfDndDocumentUploadMixin",
        "dojo/dom-class",
        "dojo/_base/event",
        "dojo/_base/lang"], 
        function(declare, _WidgetBase, _TemplatedMixin, _MultiItemRendererMixin, AlfCore, _PublishPayloadMixin,
                 _LayoutMixin, _AlfDndDocumentUploadMixin, domClass, event, lang) {

   return declare([_WidgetBase, _MultiItemRendererMixin, _TemplatedMixin, AlfCore, _PublishPayloadMixin, _LayoutMixin, _AlfDndDocumentUploadMixin], {
      
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
       * Builds the DOM model for the widget.
       * 
       * @instance
       * @since 1.0.NEXT
       */
      buildRendering: function alfresco_lists_views_layouts_Row__buildRendering() {
         if (this.templateString)
         {
            this.inherited(arguments);
         }
         else
         {
            this.containerNode = this.domNode = document.createElement("tr");
            this.domNode.classList.add("alfresco-lists-views-layouts-Row");
            this.domNode.setAttribute("tabindex", "0");
            this._attach(this.domNode, "onclick", lang.hitch(this, this.onFocusClick));
         }
      },
      
      /**
       * @instance
       * @since 1.0.NEXT
       */
      postMixInProperties : function alfresco_lists_views_layouts_Row__postMixInProperties() {
          // this widget (as all Aikau widgets) can be configured with countless config attributes
          // _applyAttributes causes significant overhead since it processes all "as if" they can be mapped to DOM
          // most Aikau widgets would probably do good to prevent that
          // those that extend Dojo/Dijit widgets may want to provide a reduced set
          this._paramsOriginal = this.params;
          this.params = null;
          
          this.inherited(arguments);
      },

      /**
       * Calls [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       * 
       * @instance postCreate
       */
      postCreate: function alfresco_lists_views_layouts_Row__postCreate() {
         // restore params for anyone that needs it later
         this.params = this._paramsOriginal;
         delete this._paramsOriginal;
          
         domClass.add(this.domNode, this.additionalCssClasses ? this.additionalCssClasses : "");
         if (this.widgets)
         {
            if (this.widgetModelModifiers !== null)
            {
               this.processObject(this.widgetModelModifiers, this.widgets);
            }
            // this.processWidgets(this.widgets, this.containerNode);
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