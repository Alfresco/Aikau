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
 * This widget is used to wrap dropped items in a [DragAndDropTarget]{@link module:alfresco/dnd/DragAndDropTarget}.
 * It provides a drag handle (for re-ordering or dragging to other targets) as well as edit and
 * delete buttons. It is also reponsible for managing the state of the item that it represents as well
 * as rendering the a representation of that item.
 * 
 * @module alfresco/dnd/DroppedItemWrapper
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/DroppedItemWrapper.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/renderers/_PublishPayloadMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "alfresco/dnd/Constants",
        "dojo/Deferred",
        "dojo/dom-construct",
        "dojo/dom-style",
        "jquery"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, _PublishPayloadMixin,
                 lang, array, on, Constants, Deferred, domConstruct, domStyle, $) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, _PublishPayloadMixin], {
      
      /**
       * The array of file(s) containing internationalised strings.
       *
       * @instance
       * @type {object}
       * @default [{i18nFile: "./i18n/DroppedItemWrapper.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/DroppedItemWrapper.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/DroppedItemWrapper.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * This is the value that the wrapper represents.
       *
       * @instance
       * @type {object}
       * @default
       */
      value: null,

      /**
       * The name of the file to use for the move up image. This is expected to be in the css/images relative path
       * of the widget.
       *
       * @instance
       * @type {string}
       * @default
       */
      upImg: "move-up.png",
      
      /**
       * The name of the file to use for the move down image. This is expected to be in the css/images relative path
       * of the widget.
       *
       * @instance
       * @type {string}
       * @default
       */
      downImg: "move-down.png",
      
      /**
       * The name of the file to use for the edit image. This is expected to be in the css/images relative path
       * of the widget.
       *
       * @instance
       * @type {string}
       * @default
       */
      editImg: "edit-16.png",
      
      /**
       * The name of the file to use for the delete image. This is expected to be in the css/images relative path
       * of the widget.
       *
       * @instance
       * @type {string}
       * @default
       */
      deleteImg: "trashcan-16.png",

      /**
       * The message to display as alt text for the move up image. This will also be displayed as a title on the
       * image.
       *
       * @instance
       * @type {string}
       * @default
       */
      upAltText: "droppedItemWrapper.up.alt.text",
      
      /**
       * The message to display as alt text for the move down image. This will also be displayed as a title on the
       * image.
       *
       * @instance
       * @type {string}
       * @default
       */
      downAltText: "droppedItemWrapper.down.alt.text",
      
      /**
       * The message to display as alt text for the delete image. This will also be displayed as a title on the
       * image.
       *
       * @instance
       * @type {string}
       * @default
       */
      deleteAltText: "droppedItemWrapper.delete.alt.text",
      
      /**
       * The message to display as alt text for the edit image. This will also be displayed as a title on the
       * image.
       *
       * @instance
       * @type {string}
       * @default
       */
      editAltText: "droppedItemWrapper.edit.alt.text",

      /**
       * This controls whether or not the edit button is displayed. By default it is not and this should only be 
       * configured to be true when using a [modelling service]{@link module:alfresco/dnd/DragAndDropTarget#useModellingService}
       * that is configured to provide edit configuration for the item.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      showEditButton: false,

      /**
       * Sets up images and translations for alt text and titles.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_dnd_DroppedItemWrapper__postMixInProperties() {
         this.upAltText = this.encodeHTML(this.message(this.upAltText));
         this.downAltText = this.encodeHTML(this.message(this.downAltText));
         this.deleteAltText = this.encodeHTML(this.message(this.deleteAltText));
         this.editAltText = this.encodeHTML(this.message(this.editAltText));
         this.upImageSrc = require.toUrl("alfresco/dnd/css/images/" + this.upImg);
         this.downImageSrc = require.toUrl("alfresco/dnd/css/images/" + this.downImg);
         this.editImageSrc = require.toUrl("alfresco/dnd/css/images/" + this.editImg);
         this.deleteImageSrc = require.toUrl("alfresco/dnd/css/images/" + this.deleteImg);
      },

      /**
       * @instance
       */
      postCreate: function alfresco_dnd_DroppedItemWrapper__postCreate() {
         if (this.showEditButton === false)
         {
            domStyle.set(this.editNode, "display", "none");
         }

         if (this.label)
         {
            this.labelNode.innerHTML = this.encodeHTML(this.message(this.label));

            // Save the label as part of the overall value so that it is not lost when an enclosing
            // widget is edited. See AKU-318
            if (this.value)
            {
               this.value.label = this.label;
               this.value.type = this.type;
            }
         }
         if (this.widgets !== null && this.widgets !== undefined)
         {
            this.processWidgets(this.widgets, this.controlNode);
         }
      },

      /**
       * This is an extension point for handling the completion of calls to [processWidgets]{@link module:alfresco/core/Core#processWidgets}
       *
       * @instance
       * @param {Array} widgets An array of all the widgets that have been processed
       */
      allWidgetsProcessed: function alfresco_dnd_DroppedItemWrapper__allWidgetsProcessed(widgets) {
         array.forEach(widgets, lang.hitch(this, this.setWidgetValue));
         this._renderedWidgets = widgets;
      },

      /**
       * Sets the value of the supplied widget with the current value.
       *
       * @instance
       * @param {object} widget The widget to set the value of.
       */
      setWidgetValue: function alfresco_dnd_DroppedItemWrapper__setWidgetValue(widget) {
         if (widget && typeof widget.setValue === "function")
         {
            widget.setValue(this.value);
         }
      },

      /**
       * Returns the current value of the item.
       *
       * @instance
       * @returns {object} The value represented by the dropped item.
       */
      getValue: function alfresco_dnd_DroppedItemWrapper__getValue() {
         return this.value;
      },

      /**
       * Emits a custom a event to indicate that the widget should be deleted.
       * TODO: Should this prompt the user with a confirmation dialog?
       * 
       * @instance
       * @param {object} evt The click event that triggers the delete.
       */
      onItemDelete: function alfresco_dnd_DroppedItemWrapper__onItemDelete(/* jshint unused:false */ evt) {
         on.emit(this.domNode, Constants.deleteItemEvent, {
            bubbles: true,
            cancelable: true,
            targetWidget: this
         });
         this.alfPublish(Constants.itemDeletedTopic, {
            item: this.getValue()
         });
      },

      /**
       * Publishes a request to get the configuration model for the current item. This request is expected to 
       * be handled by a [DndModellingService]{@link module:alfresco/services/DragAndDropModellingService}.
       * 
       * @instance
       * @param {object} evt The click event that triggers the delete.
       */
      onItemEdit: function alfresco_dnd_DroppedItemWrapper__onItemEdit(/* jshint unused:false */ evt) {
         var promise = new Deferred();
         promise.then(lang.hitch(this, this.onEditConfig, this.value));
         this.alfPublish(Constants.requestWidgetsForConfigTopic, {
            value: this.value,
            promise: promise
         });
      },

      /**
       * Handles the data provided by a [DndModellingService]{@link module:alfresco/services/DragAndDropModellingService}
       * requested when the user edits the current item. This will request the creation of a new dialog to display 
       * the form widgets expected to have been provided in the resolved promise.
       * 
       * @param {object} item The current item being edited.
       * @param {promise} resolvedPromise A resolved promise that is expected to contain a widgets array
       */
      onEditConfig: function alfresco_dnd_DroppedItemWrapper__onEditConfig(item, resolvedPromise) {
         if (resolvedPromise.widgets)
         {
            var subscriptionTopic = this.generateUuid();
            var subscriptionHandle = this.alfSubscribe(subscriptionTopic, lang.hitch(this, this.onEditSave));

            var clonedItem = lang.clone(item);
            var payloadMixin = {
               subscriptionHandle: subscriptionHandle
            };
            $.extend(true, payloadMixin, clonedItem);

            // Set the current item for processing purposes...
            this.currentItem = {
               item: clonedItem,
               subscriptionTopic: subscriptionTopic,
               payloadMixin: payloadMixin,
               widgets:resolvedPromise.widgets
            };

            // Generate a payload and publish it...
            var publishPayload = this.generatePayload(this.editPublishPayload, this.currentItem, null, this.editPublishPayloadType, this.editPublishPayloadItemMixin, this.editPublishPayloadModifiers);
            this.currentItem = {};
            this.alfPublish(this.editPublishTopic, publishPayload, this.editPublishGlobal, this.editPublishToParent);
         }
         else
         {
            this.alfLog("warn", "Wigets were not provided in the resolved promise", item, resolvedPromise, this);
         }
      },

      /**
       * This is the topic that is published when a request is made to edit the value of the item
       * represented by this wrapper. The default behaviour is to request that a dialog be displayed.
       *
       * @instance
       * @type {string}
       * @default
       */
      editPublishTopic: "ALF_CREATE_FORM_DIALOG_REQUEST",

      /**
       * Indicates whether the edit publication should be published globally.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      editPublishGlobal: true,

      /**
       * Indicates whether edit publications should be published on the parent scope.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      editPublishToParent: false,

      /**
       * This is the payload that will be published when a request is made to edit the value of the 
       * item represented by this wrapper. If required the 
       *
       * @instance
       * @type {object}
       */
      editPublishPayload: {
         dialogId: "ALF_DROPPED_ITEM_CONFIGURATION_DIALOG",
         dialogTitle: "{item.name}",
         formSubmissionTopic: "{subscriptionTopic}",
         formSubmissionPayloadMixin: "{payloadMixin}",
         contentWidth: "600px",
         contentHeight: "700px",
         fixedWidth: true,
         formValue: "{item}",
         widgets: "{widgets}"
      },

      /**
       * This is the type of payload defined by the 
       * [editPublishPayload]{@link module:alfresco/dnd/DroppedItemWrapper#editPublishPayload}. By 
       * default this is set to "PROCESS" indicating that the payload contains tokens to be substituted.
       *
       * @instance
       * @type {string}
       * @default
       */
      editPublishPayloadType: "PROCESS",

      /**
       * This indicates whether ot not the payload should have the "currentItem" attribute mixed into it.
       * By default this is set to false.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      editPublishPayloadItemMixin: false,

      /**
       * This defines any processor functions that should be used to process the 
       * [editPublishPayload]{@link module:alfresco/dnd/DroppedItemWrapper#editPublishPayload}. These will
       * only be applied if the [editPublishPayloadType]{@link module:alfresco/dnd/DroppedItemWrapper#editPublishPayloadType}
       * is configured to be "PROCESS" (which is the default behaviour).
       *
       * @instance
       * @type {string[]}
       * @default ["processCurrentItemTokens"]
       */
      editPublishPayloadModifiers: ["processCurrentItemTokens"],

      /**
       * Handles submission of the dialog requested when the user edits the value of the widget.
       * This will mix the published value into the current value (rather than overwriting it)
       * and then destroy and previously rendered widgets and re-create them using the updated value.
       *
       * @instance
       * @param {object} payload The updated value for the item.
       */
      onEditSave: function alfresco_dnd_DroppedItemWrapper__onEditSave(payload) {
         if (payload.subscriptionHandle)
         {
            this.alfUnsubscribe(payload.subscriptionHandle);
            delete payload.subscriptionHandle;
         }
         this.alfCleanFrameworkAttributes(payload, true);

         // We should consider whether we actually want to mixin in the updated value
         // or just override it completely. It depends on whether or not we want to be
         // able to remove data.
         $.extend(true, this.value, payload);
         // this.value = lang.clone(payload);
         on.emit(this.domNode, Constants.itemSavedEvent, {
            bubbles: true,
            cancelable: true,
            targetWidget: this
         });

         if (this._renderedWidgets)
         {
            array.forEach(this._renderedWidgets, function(widget) {
               if (typeof widget.destroy === "function")
               {
                  widget.destroy();
               }
            });
            domConstruct.empty(this.controlNode);
            this.postCreate();
         }
      },

      /**
       * Moves the item up one place.
       * 
       * @instance
       */
      onItemUp: function alfresco_dnd_DroppedItemWrapper__onItemUp() {
         var currentIndex = $(this.domNode).index();
         if (currentIndex !== 0)
         {
            var previousItem = $(this.domNode.parentNode).children().eq(currentIndex -1);
            $(this.domNode).after($(previousItem));

            on.emit(this.domNode, Constants.reorderItemsEvent, {
               bubbles: true,
               cancelable: true,
               targetWidget: this,
               oldIndex: currentIndex,
               newIndex: currentIndex - 1 
            });
         }
      },

      /**
       * Moves the item down one place.
       * 
       * @instance
       */
      onItemDown: function alfresco_dnd_DroppedItemWrapper__onItemDown() {
         var currentIndex = $(this.domNode).index();
         var itemCount = $(this.domNode.parentNode).children().length;
         if (currentIndex !== itemCount - 1)
         {
            var nextItem = $(this.domNode.parentNode).children().eq(currentIndex + 1);
            $(this.domNode).before($(nextItem));

            // NOTE: Potential alternative animation, not sure about it though...
            // $(this.domNode).slideUp(300, function () {
            //    $(this).insertAfter(nextItem).slideDown(300);
            // });

            on.emit(this.domNode, Constants.reorderItemsEvent, {
               bubbles: true,
               cancelable: true,
               targetWidget: this,
               oldIndex: currentIndex,
               newIndex: currentIndex + 1 
            });
         }
      }
   });
});