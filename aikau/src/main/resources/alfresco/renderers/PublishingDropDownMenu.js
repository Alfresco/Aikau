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
 * This renders a drop-down select menu using a wrapped [Select]{@link module:alfresco/forms/controls/Select}
 * widget that when changed will publish information about the change in value for the current rendered item.
 *
 * @module alfresco/renderers/PublishingDropDownMenu
 * @extends module:aikau/core/BaseWidget
 * @mixes external:dijit/_OnDijitClickMixin
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "aikau/core/BaseWidget",
        "dijit/_OnDijitClickMixin",
        "alfresco/renderers/_PublishPayloadMixin",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/forms/controls/Select",
        "dojo/_base/lang",
        "dojo/dom-class"],
        function(declare, BaseWidget, _OnDijitClickMixin, _PublishPayloadMixin, ObjectTypeUtils, 
                 Select, lang, domClass) {

   return declare([BaseWidget, _OnDijitClickMixin, _PublishPayloadMixin], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/PublishingDropDownMenu.css"}]
       */
      cssRequirements: [{cssFile:"./css/PublishingDropDownMenu.css"}],

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/PublishingDropDownMenu.properties"}],

      /**
       * Optional override for the title text to be displayed when hovering over the cancel "button"
       *
       * @instance
       * @type {String}
       */
      cancelPublishLabel: null,

      /**
       * This is the topic that will be published on when the drop-down menu value is changed.
       *
       * @instance
       * @type {string}
       * @default
       */
      publishTopic: null,

      /**
       * This will be set to reference the [Select]{@link module:alfresco/forms/controls/Select} that is
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
       * This is the dot-property that will be evaluated on the current item being rendered to determine whether or not
       * the wrapped [select]{@link module:alfresco/forms/controls/Select} widget should be disabled. The value of the 
       * evaluated property is expected to be a boolean (or it will be evalutated as a "truthy"/"falsy" value, e.g. 0
       * would be false and 1 would be true, the empty string false, any other string true, etc).
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.35
       */
      disablementProperty: null,

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.101
       */
      createWidgetDom: function alfresco_renderers_PublishingDropDownMenu__createWidgetDom() {
         this.containerNode = this.domNode = document.createElement("div");
         this.domNode.classList.add("alfresco-renderers-PublishingDropDownMenu");

         this.processingNode = document.createElement("div");
         this.processingNode.classList.add("indicator");
         this.processingNode.classList.add("processing");
         this.processingNode.classList.add("hidden");
         this.processingNode.setAttribute("tabindex", "0");
         this.processingNode.setAttribute("title", this.cancelPublishLabel);
         this._attach(this.processingNode, "ondijitclick", lang.hitch(this, this.onChangeCancel));
         
         this.warningNode = document.createElement("div");
         this.warningNode.classList.add("indicator");
         this.warningNode.classList.add("warning");
         this.warningNode.classList.add("hidden");
         
         this.successNode = document.createElement("div");
         this.successNode.classList.add("indicator");
         this.successNode.classList.add("success");
         this.successNode.classList.add("hidden");

         this.dropDownNode = document.createElement("div");

         this.domNode.appendChild(this.processingNode);
         this.domNode.appendChild(this.warningNode);
         this.domNode.appendChild(this.successNode);
         this.domNode.appendChild(this.dropDownNode);
      },

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

            var isDisabled = this.disablementProperty && lang.getObject(this.disablementProperty, false, this.currentItem);

            // Create the widget...
            this._dropDownWidget = new Select({
               id: this.id + "_SELECT",
               additionalCssClasses: this.additionalCssClasses || "",
               pubSubScope: uuid,
               fieldId: fieldId,
               value: this.value,
               optionsConfig: this.optionsConfig,
               disablementConfig: {
                  initialValue: isDisabled
               }
            }, this.dropDownNode);

            // Create the subscription AFTER the widget has been instantiated so that we don't
            // unnecessarily process the setup publications which are intended to be processed by
            // other controls in the same scoped form...
            this.alfSubscribe(subscriptionTopic, lang.hitch(this, this.onPublishChange), true);

            if(this.additionalCssClasses)
            {
               domClass.add(this.domNode, this.additionalCssClasses);
            }
         }
         else
         {
            this.alfLog("warn", "Property for PublishingDropDown renderer does not exist:", this);
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
            this._updateSuccessHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onChangeSuccess));
            this._updateFailureHandle = this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, this.onChangeFailure));
            this._updateCancelHandle = this.alfSubscribe(responseTopic + "_CANCEL", lang.hitch(this, this.onChangeCancel));

            updatePayload.responseTopic = responseTopic;

            // Update the title text of the cancel button
            this.processingNode.title = this.cancelPublishLabel || this.message("alf.renderers.PublishingDropDownMenu.cancelUpdate", this.value);

            // Request to make the update...
            this._reponsePending = true;
            this.alfPublish(this.publishTopic, updatePayload);
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
      onChangeCancel: function alfresco_renderers_PublishingDropDownMenu__onChangeCancel(payload) {
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