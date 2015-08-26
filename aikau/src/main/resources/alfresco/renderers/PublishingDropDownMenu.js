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
 * This renders a drop-down select menu using a wrapped [Select]{@link module:alfresco/forms/controls/Select}
 * widget that when changed will publish information about the change in value for the current rendered item.
 *
 * @module alfresco/renderers/PublishingDropDownMenu
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase",
        "dijit/_TemplatedMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "dojo/text!./templates/PublishingDropDownMenu.html",
        "alfresco/core/Core",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/forms/controls/Select",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/on"],
        function(declare, _WidgetBase, _TemplatedMixin, _PublishPayloadMixin, template, AlfCore, ObjectTypeUtils, 
                 Select, lang, domClass, on) {

   return declare([_WidgetBase, _TemplatedMixin, AlfCore, _PublishPayloadMixin], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/PublishingDropDownMenu.css"}]
       */
      cssRequirements: [{cssFile:"./css/PublishingDropDownMenu.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * This is the topic that will be published on when the drop-down menu value is changed.
       *
       * @instance
       * @type {string}
       * @default
       */
      publishTopic: null,

      /**
       * This will be set to reference the [DojoSelect]{@link module:alfresco/forms/controls/Select} that is
       * wrapped by this widget.
       *
       * @instance
       * @type {object}
       * @default
       */
      _dropDownWidget: null,

      /**
       * This is the options config that will be passed onto the wrapped [DojoSelect]{@link module:alfresco/forms/controls/Select}
       * widget.
       *
       * @instance
       * @type {object}
       * @default
       */
      optionsConfig: null,

      /**
       * Indicates that requests will be cancelled when in flight.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      cancelOnEscape: true,

      /**
       * If [cancelOnEscape]{@link module:alfresco/renderers/PublishingDropDownMenu#cancelOnEscape} is 
       * configured to be true and the escape key is used to attempt to cancel an action, then this
       * topic will be published. Note that this does not actually cancel anything itself, the operation
       * is entirely reliant upon a subscribring widget or service being able to cancel whatever action
       * is pending (e.g. cancelling an XHR request).
       *
       * @instance
       * @type {string}
       * @default
       */
      cancellationPublishTopic: null,

      /**
       * The payload that will be published on the 
       * [cancellationPublishTopic]{@link module:alfresco/renderers/PublishingDropDownMenu#cancellationPublishTopic}
       * topic.
       *
       * @instance
       * @type {string}
       * @default
       */
      cancellationPublishPayload: null,

      /**
       * Indicates whether or not the payload published on the 
       * [cancellationPublishTopic]{@link module:alfresco/renderers/PublishingDropDownMenu#cancellationPublishTopic}
       * topic will be published globally.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      cancellationPublishGlobal: false,

      /**
       * Indicates whether or not the payload published on the 
       * [cancellationPublishTopic]{@link module:alfresco/renderers/PublishingDropDownMenu#cancellationPublishTopic}
       * topic will be published on the parent scope.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      cancellationPublishToParent: false,

      /**
       * Sets the type of payload to be published on the 
       * [cancellationPublishTopic]{@link module:alfresco/renderers/PublishingDropDownMenu#cancellationPublishTopic}
       * topic.
       * 
       * @instance
       * @type {string}
       * @default
       */
      cancellationPublishPayloadType: null,

      /**
       * Indicates whether or not the payload published on the 
       * [cancellationPublishTopic]{@link module:alfresco/renderers/PublishingDropDownMenu#cancellationPublishTopic}
       * topic should have the current item value mixed into it.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      cancellationPublishPayloadItemMixin: true,

      /**
       * Defines any modifying functions that should be applied to the payload to be published on the 
       * [cancellationPublishTopic]{@link module:alfresco/renderers/PublishingDropDownMenu#cancellationPublishTopic}
       * topic. These are only used when the 
       * [cancellationPublishPayloadType]{@link module:alfresco/renderers/PublishingDropDownMenu#cancellationPublishPayloadType}
       * is configured to be "PROCESS"
       * 
       * @instance
       * @type {string[]}
       * @default
       */
      cancellationPublishPayloadModifiers: null,

      /**
       *
       * @instance
       */
      postCreate: function alfresco_renderers_PublishingDropDownMenu__postCreate() {
         if (ObjectTypeUtils.isString(this.propertyToRender) &&
             ObjectTypeUtils.isObject(this.currentItem) &&
             lang.exists(this.propertyToRender, this.currentItem))
         {
            // Get the value of the property to render...
            this.value = lang.getObject(this.propertyToRender, false, this.currentItem);

            // Set up the values needed to handle the pub/sub events coming out of the wrapped dropdown...
            var uuid = this.generateUuid();
            var fieldId = "DROPDOWN";
            var subscriptionTopic = uuid + "_valueChangeOf_" + fieldId;

            // Create the widget...
            this._dropDownWidget = new Select({
               id: this.id + "_SELECT",
               additionalCssClasses: this.additionalCssClasses || "",
               pubSubScope: uuid,
               fieldId: fieldId,
               value: this.value,
               optionsConfig: this.optionsConfig
            }, this.dropDownNode);

            // Create the subscription AFTER the widget has been instantiated so that we don't
            // unnecessarily process the setup publications which are intended to be processed by
            // other controls in the same scoped form...
            this.alfSubscribe(subscriptionTopic, lang.hitch(this, this.onPublishChange), true);

            if(this.additionalCssClasses)
            {
               domClass.add(this.domNode, this.additionalCssClasses);
            }

            if (this.cancelOnEscape === true)
            {
               on(document, "keyup", lang.hitch(this, this.onKeyUp));
            }
         }
         else
         {
            this.alfLog("warn", "Property for PublishingDropDown renderer does not exist:", this);
         }
      },

      /**
       * When [cancelOnEscape]{@link module:alfresco/renderers/PublishingDropDownMenu#cancelOnEscape} is
       * configured to be true and the escape key is pressed whilst an update request is in flight then
       * it will be cancelled.
       *
       * @instance
       * @param  {object} evt The key up event
       */
      onKeyUp: function alfresco_renderers_PublishingDropDownMenu__onKeyUp(evt) {
         if (evt.keyCode === 27)
         {
            if (this.cancellationPublishTopic && this._reponsePending === true)
            {
               var payload = this.generatePayload(this.cancellationPublishPayload, 
                                                  this.currentItem, 
                                                  null, 
                                                  this.cancellationPublishPayloadType, 
                                                  this.cancellationPublishPayloadItemMixin, 
                                                  this.cancellationPublishPayloadModifiers);
               this.alfPublish(this.cancellationPublishTopic, payload, this.cancellationPublishGlobal, this.cancellationPublishToParent);
            }
            this.onChangeCancel();
         }
      },

      /**
       *
       * @instance
       * @param {object} payload The information about the change in value.
       */
      onPublishChange: function alfresco_renderers_PublishingDropDownMenu__onPublishChange(payload) {
         this.alfLog("log", "Drop down property changed", payload);

         if (this.publishTopic !== null && !this._resetInProgress)
         {
            var updatePayload = this.generatePayload(this.publishPayload, this.currentItem, payload, this.publishPayloadType, this.publishPayloadItemMixin, this.publishPayloadModifiers);

            // Get the selected value, this will only be confirmed on publication success
            this._updatedValue = payload.value;

            // Hide any previously displayed warning image and show the processing image...
            domClass.remove(this.processingNode, "hidden");
            domClass.add(this.warningNode, "hidden");
            domClass.add(this.successNode, "hidden");

            // Genereate a uuid for the response to ensure we only provide an update for our request...
            var responseTopic = this.generateUuid();
            this._updateSuccessHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onChangeSuccess), false);
            this._updateFailureHandle = this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, this.onChangeFailure), false);
            this._updateCancelHandle = this.alfSubscribe(responseTopic + "_CANCEL", lang.hitch(this, this.onChangeCancel), false);

            updatePayload.responseTopic = responseTopic;

            // Request to make the update...
            this._reponsePending = true;
            this.alfPublish(this.publishTopic, updatePayload, false);
         }
         else
         {
            this.alfLog("warn", "A drop-down property was changed but there is no 'publishTopic' defined to publish on", this);
         }
      },

      /**
       * This function is called whenever the request to update the value is completed successfully. It will hide the
       * processing image and display the success image.
       *
       * @instance
       * @param {object} payload
       */
      onChangeSuccess: function alfresco_renderers_PublishingDropDownMenu__onChangeSuccess(payload) {
         this.alfUnsubscribeSaveHandles([this._updateSuccessHandle,this._updateFailureHandle, this._updateCancelHandle]);
         domClass.add(this.processingNode, "hidden");
         domClass.remove(this.successNode, "hidden");
         this.alfLog("log", "Update request success", payload);

         // Update with the successfully applied value...
         this.value = this._updatedValue;
         this._reponsePending = false;
      },

      /**
       * This function is called whenever the request to update the value fails. It will hide the
       * processing image and display the warning image.
       *
       * TODO: Ideally this should include a popup failure message
       * TODO: The CoreXhr standard failure dialog should be prevented from being displayed
       *
       * @instance
       * @param {object} payload
       */
      onChangeFailure: function alfresco_renderers_PublishingDropDownMenu__onChangeFailure(payload) {
         this.alfUnsubscribeSaveHandles([this._updateSuccessHandle,this._updateFailureHandle, this._updateCancelHandle]);
         domClass.add(this.processingNode, "hidden");
         domClass.remove(this.warningNode, "hidden");
         this.alfLog("log", "Update request failed", payload);

         // Reset the value on failure...
         this._resetInProgress = true;
         this._dropDownWidget.setValue(this.value);
         this._resetInProgress = false;
         this._reponsePending = false;
      },

      /**
       * This function is called whenever the request to update the value is cancelled. It hides the processing image
       * and doesn't display anything else.
       *
       */
      onChangeCancel: function alfresco_renderers_PublishingDropDownMenu__onChangeFailure(payload) {
         this.alfUnsubscribeSaveHandles([this._updateSuccessHandle, this._updateFailureHandle, this._updateCancelHandle]);
         domClass.add(this.processingNode, "hidden");
         this.alfLog("log", "Update request cancelled", payload);

         // Reset the value on cancellation...
         this._resetInProgress = true;
         this._dropDownWidget.setValue(this.value);
         this._resetInProgress = false;
         this._reponsePending = false;
      }
   });
});