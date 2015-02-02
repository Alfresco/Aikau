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
 * This renders a drop-down select menu using a wrapped [DojoSelect]{@link module:alfresco/forms/controls/Select}
 * widget that when changed will publish information about the change in value for the current rendered item.
 * 
 * @module alfresco/renderers/PublishingDropDownMenu
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
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
        "dojo/dom-class"], 
        function(declare, _WidgetBase, _TemplatedMixin, _PublishPayloadMixin, template, AlfCore, ObjectTypeUtils, Select, lang, domClass) {

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
       * @default null
       */
      publishTopic: null,

      /**
       * This will be set to reference the [DojoSelect]{@link module:alfresco/forms/controls/Select} that is 
       * wrapped by this widget.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      _dropDownWidget: null,

      /**
       * This is the options config that will be passed onto the wrapped [DojoSelect]{@link module:alfresco/forms/controls/Select}
       * widget.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      optionsConfig: null,

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
            var value = lang.getObject(this.propertyToRender, false, this.currentItem);

            // Set up the values needed to handle the pub/sub events coming out of the wrapped dropdown...
            var uuid = this.generateUuid();
            var fieldId = "DROPDOWN";
            var subscriptionTopic = uuid + "_valueChangeOf_" + fieldId;

            // Create the widget...
            this._dropDownWidget = new Select({
               pubSubScope: uuid,
               fieldId: fieldId,
               value: value,
               optionsConfig: this.optionsConfig
            }, this.dropDownNode);

            // Create the subscription AFTER the widget has been instantiated so that we don't 
            // uncessarily process the setup publications which are intended to be processed by 
            // other controls in the same scoped form...
            this.alfSubscribe(subscriptionTopic, lang.hitch(this, "onPublishChange"), true);
            
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

         if (this.publishTopic !== null)
         {
            var updatePayload = this.generatePayload(this.publishPayload, this.currentItem, payload, this.publishPayloadType, this.publishPayloadItemMixin);

            // Hide any previously displayed warning image and show the processing image...
            domClass.remove(this.processingNode, "hidden");
            domClass.add(this.warningNode, "hidden");
            domClass.add(this.successNode, "hidden");

            // Genereate a uuid for the response to ensure we only provide an update for our request...
            var responseTopic = this.generateUuid();
            this._updateSuccessHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, "onChangeSuccess"), false);
            this._updateFailureHandle = this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, "onChangeFailure"), false);
            updatePayload.responseTopic = responseTopic;

            // Request to make the update...
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
         this.alfUnsubscribeSaveHandles([this._updateSuccessHandle,this._updateFailureHandle]);
         domClass.add(this.processingNode, "hidden");
         domClass.remove(this.successNode, "hidden");
         this.alfLog("log", "Update request success", payload);
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
         this.alfUnsubscribeSaveHandles([this._updateSuccessHandle,this._updateFailureHandle]);
         domClass.add(this.processingNode, "hidden");
         domClass.remove(this.warningNode, "hidden");
         this.alfLog("log", "Update request success", payload);
      }
   });
});