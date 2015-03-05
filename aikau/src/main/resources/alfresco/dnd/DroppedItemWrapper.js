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
 * @module alfresco/dnd/DroppedItemWrapper
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/DroppedItemWrapper.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "alfresco/dnd/Constants",
        "dojo/Deferred",
        "dojo/dom-construct",
        "jquery"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, lang, array, on, 
                 Constants, Deferred, domConstruct, $) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
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
       * @default null
       */
      value: null,

      /**
       * @instance
       */
      postCreate: function alfresco_dnd_DroppedItemWrapper__postCreate() {
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
       * Emits a custom a "onWidgetDelete" event to indicate that the widget should be deleted.
       * TODO: Should this prompt the user with a confirmation dialog?
       * 
       * @instance
       * @param {object} evt The click event that triggers the delete.
       */
      onWidgetDelete: function alfresco_dnd_DroppedItemWrapper__onWidgetDelete(/* jshint unused:false */ evt) {
         on.emit(this.domNode, Constants.deleteItemEvent, {
            bubbles: true,
            cancelable: true,
            widgetToDelete: this
         });
      },

      /**
       * Publishes a request to get the configuration model for the current item. This request is expected to 
       * be handled by a [DndModellingService]{@link module:alfresco/services/DragAndDropModellingService}.
       * 
       * @instance
       * @param {object} evt The click event that triggers the delete.
       */
      onWidgetEdit: function alfresco_dnd_DroppedItemWrapper__onWidgetEdit(/* jshint unused:false */ evt) {
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

            this.alfPublish("ALF_CREATE_FORM_DIALOG_REQUEST", {
               dialogId: "ALF_DROPPED_ITEM_CONFIGURATION_DIALOG",
               dialogTitle: item.name,
               formSubmissionTopic: subscriptionTopic,
               formSubmissionPayloadMixin: {
                  subscriptionHandle: subscriptionHandle
               },
               formValue: item,
               widgets: resolvedPromise.widgets
            }, true);
         }
         else
         {
            this.alfLog("warn", "Wigets were not provided in the resolved promise", item, resolvedPromise, this);
         }
      },

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
         delete payload.alfTopic;

         // We should consider whether we actually want to mixin in the updated value
         // or just override it completely. It depends on whether or not we want to be
         // able to remove data.
         $.extend(true, this.value, payload);

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
      }
   });
});