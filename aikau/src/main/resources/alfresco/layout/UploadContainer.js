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
 * <p>Extends the [VerticalWidgets]{@link module:alfresco/layout/VerticalWidgets} to mixin in the
 * [_AlfDndDocumentUploadMixin]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin}
 * on order to provide a simple way the user can drag-and-drop a file anywhere within the browser
 * view port to upload to the current displayed location. This relies on the current location 
 * being defined by a widget such as the 
 * [AlfDocumentList]{@link module:alfresco/documentlibrary/AlfDocumentList} also being present in 
 * the page that will set the current location to upload to. It also relies on the 
 * [UploadService]{@link module:alfresco/services/UploadService} being present on the page to 
 * process the upload requests.</p>
 * <p>If the widget is not intended to be used to contain all the widgets on the page then
 * [fullScreenDndHighlight]{@link module:alfresco/layout/UploadContainer#fullScreenDndHighlight}
 * can be configured to be false and the drag-and-drop upload highlight will only be applied
 * to the area containing the child widgets. Alternatively a
 * [proxyDragAndDropNode]{@link module:alfresco/layout/UploadContainer#proxyDragAndDropNode}
 * selector query can be provided to place the overlay over another node on the screen. This can 
 * be provided either as a string or as an array of strings and the first visible element found 
 * will be used.</p>
 * 
 * @module alfresco/layout/UploadContainer
 * @extends module:alfresco/layout/VerticalWidgets
 * @mixes module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin
 * @author Dave Draper
 * @since 1.0.42
 */
define(["dojo/_base/declare",
        "alfresco/layout/VerticalWidgets",
        "alfresco/documentlibrary/_AlfDndDocumentUploadMixin",
        "dojo/_base/array",
        "dojo/dom-geometry",
        "dojo/dom-style",
        "dojo/query",
        "dojo/window"], 
        function(declare, VerticalWidgets, _AlfDndDocumentUploadMixin, array, domGeom, domStyle, query, win) {
   
   return declare([VerticalWidgets, _AlfDndDocumentUploadMixin], {
      
      /**
       * This indicates whether or not the drag-and-drop highlight should fully consume the browser
       * view port. This can be overridden if this layout widget does not occupy the entire page.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      fullScreenDndHighlight: true,

      /**
       * This can be set to a CSS selector or an array of css selectors to find another element in the 
       * DOM on which to apply the overlay node. The use-case for this attribute is to allow the user 
       * to drop a file anywhere on the page but for the overlay to be applied to a 
       * [document list]{@link module:alfresco/documentlibrary/AlfDocumentList}. Note that the CSS 
       * selector query will highlight the first visible item found, so if it is an array it will be the 
       * first visible item or if any selector produces mroe than one result it will be the first found.
       * 
       * @instance
       * @type {string|string[]}
       * @default
       */
      proxyDragAndDropNode: null,

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_layout_UploadContainer__postCreate() {
         this.inherited(arguments);
         this.subscribeToCurrentNodeChanges(this.domNode);
         this.addUploadDragAndDrop(this.domNode);
      },

      /**
       * <p>If a [proxyDragAndDropNode]{@link module:alfresco/layout/UploadContainer#proxyDragAndDropNode}
       * selectory query has been provided that yields a single result then the 
       * [overlay node]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#dragAndDropOverlayNode}
       * will be placed directly over that target.</p>
       * <p>If [fullScreenDndHighlight]{@link module:alfresco/layout/UploadContainer#fullScreenDndHighlight} is
       * configured to be false then the drag-and-drop upload highlight is fixed to fill the browser view port.</p>
       * <p>If neither a [proxyDragAndDropNode]{@link module:alfresco/layout/UploadContainer#proxyDragAndDropNode}
       * is provided or [fullScreenDndHighlight]{@link module:alfresco/layout/UploadContainer#fullScreenDndHighlight}
       * is configured to be false then the 
       * [default]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#setDndHighlightDimensions}
       * overlay dimensions will be .</p>
       * 
       * @instance
       * @param {object} [targetNode] An optional node to use instead of the 
       * [dragAndDropNode]{@link module:alfresco/documentlibrary/_AlfDndDocumentUploadMixin#dragAndDropNode}
       * @since 1.0.56
       */
      setDndHighlightDimensions: function alfresco_layout_UploadContainer__setDndHighlightDimensions(/*jshint unused:false*/ targetNode) {

         // proxyDragAndDropNode can be an array of strings or a comma-separated list
         if (this.proxyDragAndDropNode && !Array.isArray(this.proxyDragAndDropNode))
         {
            this.proxyDragAndDropNode = this.proxyDragAndDropNode.split(",");
         }

         // if the proxyDragAndDropNode is an array with items
         if (Array.isArray(this.proxyDragAndDropNode) && this.proxyDragAndDropNode.length > 0)
         {
            var targetProxyNode;
            array.some(this.proxyDragAndDropNode, function(proxyNodeId) {
               // A node id could, disappointingly, match several items
               var foundProxyNodes = query(proxyNodeId);
               return array.some(foundProxyNodes, function(proxyNode) {
                  // If the offsetHeight of the node is not 0, it is visible and therefore it becomes the target
                  if (proxyNode.offsetHeight !== 0)
                  {
                     targetProxyNode = proxyNode;
                     return true;
                  }
               }, this);
            }, this);

            this.inherited(arguments, [targetProxyNode]);
         }
         else if (this.fullScreenDndHighlight)
         {
            var viewPortDimensions = win.getBox();
            domStyle.set(this.dragAndDropOverlayNode, {
               position: "fixed",
               height: viewPortDimensions.h + "px",
               width: viewPortDimensions.w + "px",
               top: 0,
               left: 0,
               boxSizing: "border-box"
            });
         }
         else
         {
            this.inherited(arguments);
         }
      }
   });
});