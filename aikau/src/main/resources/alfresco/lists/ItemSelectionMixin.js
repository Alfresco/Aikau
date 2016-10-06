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
 * This module should be mixed into renderers that wish to be able to either display selected state or that
 * can be clicked to change selected state. This is mixed into both the [Selector]{@link module:alfresco/renderers/Selector}
 * and [Thumbnail]{@link module:alfresco/renderers/Thumbnail} renderers.
 * 
 * @module alfresco/lists/ItemSelectionMixin
 * @author Dave Draper
 * @since 1.0.40
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/topics",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/_base/event"], 
        function( declare, Core, topics, _AlfDocumentListTopicMixin, lang, array, domClass, event) {
   
   return declare([Core, _AlfDocumentListTopicMixin], {
      
      /**
       * The dot-notation property in the currentItem that uniquely idenfities that item. This defaults
       * to "nodeRef" as the most likely use case is for working with Nodes but this can be configured
       * to a different value.
       *
       * @instance
       * @type {string}
       * @default
       */
      itemKey: "nodeRef",

      /**
       * Indicates whether the subscriptions made by 
       * [createItemSelectionSubscriptions]{@link module:alfresco/lists/ItemSelectionMixin#createItemSelectionSubscriptions}
       * and the publications made by [select]{@link module:alfresco/lists/ItemSelectionMixin#select} and 
       * [deselect]{@link module:alfresco/lists/ItemSelectionMixin#deselect} should be made on the global scope.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      publishGlobal: null,

      /**
       * Indicates whether the subscriptions made by 
       * [createItemSelectionSubscriptions]{@link module:alfresco/lists/ItemSelectionMixin#createItemSelectionSubscriptions}
       * and the publications made by [select]{@link module:alfresco/lists/ItemSelectionMixin#select} and 
       * [deselect]{@link module:alfresco/lists/ItemSelectionMixin#deselect} should be made on the parent scope.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      publishToParent: null,

      /**
       * This indicates whether or not the mixing widget should subscribe to item selection events. This
       * attribute is inspected by the [createItemSelectionSubscriptions]{@link module:alfresco/lists/ItemSelectionMixin#createItemSelectionSubscriptions}
       * function to determine whether to bind the 
       * [documentSelectionTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#documentSelectionTopic}
       * to the [onItemSelection]{@link module:alfresco/lists/ItemSelectionMixin#onItemSelection} function.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      updateOnSelection: true,

      /**
       * The CSS class to apply to the root DOM node of the widget
       *
       * @instance
       * @type {string}
       * @default
       */
      selectedCssClass: "alfresco-lists-ItemSelectionMixin--selected",

      /**
       * This indicates whether or not clicking on the widget mixed by this module will trigger it's selection
       * (it might be preferred to just update the CSS classes on selection rather than actually enabling
       * item selection).
       *
       * @instance
       * @type {boolean}
       * @default
       */
      selectOnClick: true,

      /**
       * If [updateOnSelection]{@link module:alfresco/lists/ItemSelectionMixin#updateOnSelection} is configured to be
       * true then this will setup the necessary subscriptions for item selection handling. Each time items are selected
       * [onItemSelection]{@link module:alfresco/lists/ItemSelectionMixin#onItemSelection} will be called.
       * 
       * @instance
       * @listens module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#documentSelectionTopic
       */
      createItemSelectionSubscriptions: function alfresco_lists_ItemSelectionMixin__createItemSelectionSubscriptions() {
         // Set up a subscription to handle file selection events, these will be along the lines of
         // select all, select none, invert, etc. Each individual selector will respond to these
         // events...
         if (this.updateOnSelection)
         {
            this.alfSubscribe(this.documentSelectionTopic, lang.hitch(this, this.onItemSelection), this.getSelectionPublishGlobal(), this.getSelectionPublishToParent());
            this.alfSubscribe(this.documentDeselectedTopic, lang.hitch(this, this.onIndividualItemSelection, false), this.getSelectionPublishGlobal(), this.getSelectionPublishToParent());
            this.alfSubscribe(this.documentSelectedTopic, lang.hitch(this, this.onIndividualItemSelection, true), this.getSelectionPublishGlobal(), this.getSelectionPublishToParent());
         }
      },

      /**
       * Returns whether or not selection subscriptions and publications should be made globally. By default
       * this returns [publishGlobal]{@link module:alfresco/renderers/_PublishPayloadMixin#publishGlobal}.
       *
       * @instance
       * @overridable
       * @return {boolean} A boolean indicating whether or not to publish and subscribe to selection topics globally.
       */
      getSelectionPublishGlobal: function alfresco_lists_ItemSelectionMixin__getSelectionPublishGlobal() {
         return this.publishGlobal;
      },

      /**
       * Returns whether or not selection subscriptions and publications should be made globally. By default
       * this returns [publishToParent]{@link module:alfresco/renderers/_PublishPayloadMixin#publishToParent}.
       *
       * @instance
       * @overridable
       * @return {boolean}  A boolean indicating whether or not to publish and subscribe to selection topics to the parent scope.
       */
      getSelectionPublishToParent: function alfresco_lists_ItemSelectionMixin__getSelectionPublishToParent() {
         return this.publishToParent;
      },

      /**
       * Handles the individual selection or deselection of an object.
       * 
       * @instance
       * @param {boolean} select  Indicates if this is a selection action
       * @param {object}  payload The payload containing the details of the item selected
       * @param {boolean} [payload.selfProcessing=false] Indicates whether or not to only respond to requests initiated from the current instance
       * @param {object}  [payload.requester=null] The instance that originated this request
       * @param {object}  [payload.value] The item to be selected or deselected
       */
      onIndividualItemSelection: function alfresco_lists_ItemSelectionMixin__onIndividualItemSelection(select, payload) {
         if (!payload.selfProcessing || payload.requester === this)
         {
            var a = lang.getObject(this.itemKey, false, payload.value);
            var b = lang.getObject(this.itemKey, false, this.currentItem);
            var match = ((a || a === 0) && a === b);
            if (match)
            {
               if (select)
               {
                  domClass.add(this.domNode, this.selectedCssClass);
               }
               else
               {
                  domClass.remove(this.domNode, this.selectedCssClass);
               }
            }
         }
      },

      /**
       * Handles selection request events for the following values: "selectAll", "selectNone",
       * "selectInvert", "selectFolders" & "selectDocuments". All other selection requests are
       * ignored.
       * 
       * @instance
       * @param {object} payload The details of the selection request.
       */
      onItemSelection: function alfresco_lists_ItemSelectionMixin__onItemSelection(payload) {
         // jshint maxcomplexity:false
         if (payload)
         {
            if (payload.value === "selectAll")
            {
               // Select regardless of current status...
               this.select();
            }
            else if (payload.value === "selectNone")
            {
               // De-select regardless of current status...
               this.deselect();
            }
            else if (payload.value === "selectInvert")
            {
               // Invert the current status
               // See AKU-1093 - it is important to indicate that selection should only be handled by
               // if the ultimate subscriber is the same as the publisher, this ensures that invertion
               // does not occur multiple times on a single request.
               if (domClass.contains(this.domNode, this.selectedCssClass))
               {
                  this.deselect(true);
               }
               else
               {
                  this.select(true);
               }
            }
            else if (payload.value === "selectFolders" && this.currentItem && this.currentItem.jsNode)
            {
               // Select if the current item is a container
               if (this.currentItem.jsNode.isContainer)
               {
                  this.select();
               }
               else
               {
                  this.deselect();
               }
            }
            else if (payload.value === "selectDocuments" && this.currentItem && this.currentItem.jsNode)
            {
               // Select if the current item is NOT a container
               if (this.currentItem.jsNode.isContainer)
               {
                  this.deselect();
               }
               else
               {
                  this.select();
               }
            }
            else if (payload.selectedItems)
            {
               // Check to see if the list of selected items contains the item that this instance has
               // renderered.
               array.some(payload.selectedItems, function(item) {
                  var a = lang.getObject(this.itemKey, false, item);
                  var b = lang.getObject(this.itemKey, false, this.currentItem);
                  var match = ((a || a === 0) && a === b);
                  if (match) {
                     domClass.add(this.domNode, this.selectedCssClass);
                  }
                  return match;
               }, this);
            }
         }
      },
      
      /**
       * Updates the CSS classes to indicate that the item has been selected and publishes 
       * [the topic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#documentSelectedTopic}
       * to indicate that an item has been selected.
       * 
       * @instance
       * @param {boolean} [selfProcessing=false] Indicates whether or not the subscriber should only handle publications made by itself
       * @fires module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#documentSelectedTopic
       */
      select: function alfresco_lists_ItemSelectionMixin__select(selfProcessing) {
         domClass.add(this.domNode, this.selectedCssClass);
         this.alfPublish(this.documentSelectedTopic, {
            value: this.currentItem,
            requester: this,
            selfProcessing: selfProcessing
         }, this.getSelectionPublishGlobal(), this.getSelectionPublishToParent());
      },
      
      /**
       * Updates the CSS classes to indicate that the item has been de-selected and publishes 
       * [the topic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#documentDeselectedTopic}
       * to indicate that an item has been de-selected.
       * 
       * @instance
       * @param {boolean} [selfProcessing=false] Indicates whether or not the subscriber should only handle publications made by itself
       * @fires module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#documentDeselectedTopic
       */
      deselect: function alfresco_lists_ItemSelectionMixin__deselect(selfProcessing) {
         domClass.remove(this.domNode, this.selectedCssClass);
         this.alfPublish(this.documentDeselectedTopic, {
            value: this.currentItem,
            requester: this,
            selfProcessing: selfProcessing
         }, this.getSelectionPublishGlobal(), this.getSelectionPublishToParent());
      },
      
      /**
       * If [selectOnClick]{@link module:alfresco/lists/ItemSelectionMixin#selectOnClick} is configured to be
       * true then this will call either [deselect]{@link module:alfresco/lists/ItemSelectionMixin#deselect}
       * or [select]{@link module:alfresco/lists/ItemSelectionMixin#select} (depending upon the current
       * state).
       * 
       * @instance
       */
      onSelectionClick: function alfresco_lists_ItemSelectionMixin__onSelectionClick(evt) {
         if (this.selectOnClick)
         {
            evt && event.stop(evt);
            if (domClass.contains(this.domNode, this.selectedCssClass))
            {
               // De-select if currently selected...
               this.deselect();
            }
            else
            {
               // Select if currently not selected...
               this.select();
            }
         }
      }
   });
});