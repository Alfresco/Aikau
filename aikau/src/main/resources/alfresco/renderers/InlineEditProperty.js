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
 * <p>Extends the standard (read-only) [property renderer]{@link module:alfresco/renderers/Property} to provide
 * the ability to edit and save changes to the property. The edit view is rendered by a
 * [DojoValidationTextBox widget]{@link module:alfresco/forms/controls/DojoValidationTextBox} and this module accepts the same 
 * [validationConfig]{@link module:alfresco/forms/controls/BaseFormControl#validationConfig} as it does.</p>
 * <p>When an edit is completed and saved a publication will be made and that should be defined using the standard
 * "publishTopic", "publishPayload" and related publication attributes. However, for convenience it is assumed that the typical
 * use case will be for editing the properties of nodes and so if the "publishTopic" attribute is configured as null then
 * the publication will automatically be set up to result in saving node properties (however, it will be necessary to make
 * sure that the [CrudService]{@link module:alfresco/services/CrudService} is included on the page to service those requests).</p> 
 * 
 * @module alfresco/renderers/InlineEditProperty
 * @extends module:alfresco/renderers/Property
 * @mixes external:dojo/_OnDijitClickMixin
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @mixes module:alfresco/renderers/_PublishPayloadMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Property", 
        "dijit/_OnDijitClickMixin",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/renderers/_PublishPayloadMixin",
        "alfresco/lists/KeyboardNavigationSuppressionMixin",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/Deferred",
        "dojo/dom-class",
        "dojo/dom-attr",
        "dojo/keys",
        "dojo/_base/event",
        "dojo/query",
        "service/constants/Default",
        "alfresco/forms/Form",
        "alfresco/forms/controls/DojoValidationTextBox",
        "alfresco/forms/controls/HiddenValue"], 
        function(declare, Property, _OnDijitClickMixin, CoreWidgetProcessing, _PublishPayloadMixin, KeyboardNavigationSuppressionMixin,
                 lang, array, Deferred, domClass, domAttr, keys, event, query) {

   return declare([Property, _OnDijitClickMixin, CoreWidgetProcessing, _PublishPayloadMixin, KeyboardNavigationSuppressionMixin], {
      
      /**
       * The array of file(s) containing internationalised strings.
       *
       * @instance
       * @type {object}
       * @default [{i18nFile: "./i18n/InlineEditProperty.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/InlineEditProperty.properties"}],

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/InlineEditProperty.css"}]
       */
      cssRequirements: [{cssFile:"./css/InlineEditProperty.css"}],
      
      /**
       * This is the message or message key that will be used for the cancel link text.
       *
       * @instance
       * @type {string}
       * @default
       */
      cancelLabel: "inline-edit.cancel.label",

      /**
       * This is the message or message key that will be used for the alt text attribute on the edit icon
       *
       * @instance
       * @type {string}
       * @default
       */
      editAltText: "inline-edit.edit.altText",

      /**
       * This is the message or message key that will be used for the label attribute on the edit label
       *
       * @instance
       * @type {string}
       * @default
       */
      editLabel: "inline-edit.edit.label",

      /**
       * Whether the widget should be put into edit mode when rendered value is clicked.
       *
       * @type  {boolean}
       */
      editOnClickRenderedValue: true,

      /**
       * An optional array of topics to be subscribed to that can trigger editing. The typical use case is when
       * another widget (a [PublishAcing]{@link module:alfresco/renderers/PublishAction} for example) is provided
       * that when clicked will toggle editing of the property. The current caveat is that the payload published
       * must be the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} of this widget. This
       * would be achieved by setting a 
       * [publishPayloadType]{@link module:alfresco/renderers/_PublishPayloadMixin#publishPayloadType} of
       * "CURRENT_ITEM" and for both widgets (the publisher and the subscriber) rendering the same item.
       * 
       * @instance
       * @type {string[]}
       * @default
       * @since 1.0.72
       */
      editSubscriptionsTopics: null,

      /**
       * References the widget used for editing. Created by calling the 
       * [getFormWidget]{@link module:alfresco/renderers/InlineEditProperty#getFormWidget}
       * for the first time.
       * 
       * @instance
       * @type {object}
       * @default
       */
      formWidget: null,

      /**
       * <p>In certain circimstances it may be necessary to submit additional data along with that
       * provided by the main edit control. This configuration property should take the form:</p>
       * <p><pre>hiddenDataRules: [
       *   {
       *     name: "customProperties",
       *     rulePassValue: "hiddenData",
       *     ruleFailValue: "",
       *     is: ["includeHiddenData"]
       *   }
       * ]</pre></p>
       *
       * @instance
       * @type {array}
       * @default
       */
      hiddenDataRules: null,

      /**
       * The is the name of the parameter that will be used to persist changes to the property
       * @instance
       * @type {string}
       * @default
       */
      postParam: null,
      
      /**
       * The value configured will be used to look up a property for the item being rendered to 
       * determine whether or not to render the edit controls. If this is configured to be null 
       * then the edit controls will always be rendered.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.31
       */
      permissionProperty: null,

      /**
       * Indicates whether or not the currentItem should be updated following a successful
       * save event.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      refreshCurrentItem: false,

      /**
       * This is the message or message key that will be used for save link text.
       *
       * @instance
       * @type {string}
       * @default
       */
      saveLabel: "inline-edit.save.label",

      /**
       * If configured to be false then "Save" and "Cancel" actions will not be displayed when editing
       * the property. It will still be possible to save changes by using the ENTER key.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.47
       */
      showOkCancelActions: true,

      /**
       * The source file for the image to use to display when an item is being updated. This will
       * typically only be displayed when an XHR request is made to retrieve the latest data for
       * the item being edited.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.83
       */
      updateInProgressImgSrc: null,

      /**
       * The alt text label to use for the update in progress indicator.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.83
       */
      updateInProgressAltText: "inline-edit.update-in-progress.altText",

      /**
       * The alt text label to use for the update in progress indicator when the 
       * [updateInProgressItemLabelProperty]{@link module:alfresco/renderers/InlineEditProperty#updateInProgressItemLabelProperty}
       * does not match a value in the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.83
       */
      updateInProgressNoLabelAltText: "inline-edit.update-in-progress.no-label.altText",

      /**
       * The property to to retrieve from the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}
       * to insert into the [updateInProgressAltText]{@link module:alfresco/renderers/InlineEditProperty#updateInProgressAltText}
       * that identifies the overall item being updated (rather than just the individual property that is being changed).
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.83
       */
      updateInProgressItemLabelProperty: "displayName",

      /**
       * Overrides [the inherited function]{@link module:aikau/core/BaseWidget#createWidgetDom}
       * to construct the DOM for the widget using native browser capabilities.
       *
       * @instance
       * @since 1.0.100
       */
      createWidgetDom: function alfresco_renderers_InlineEditProperty__createWidgetDom() {
         // jshint maxstatements:false
         this.domNode = document.createElement("span");
         this.renderedValueClassArray.forEach(function(className) {
            this.domNode.classList.add(className);
         }, this);

         this.domNode.classList.add("alfresco-renderers-InlineEditProperty");
         
         var labelSpan = document.createElement("span");
         labelSpan.classList.add("label");
         labelSpan.textContent = this.label;
         this.domNode.appendChild(labelSpan);

         this.renderedValueNode = document.createElement("span");
         this.renderedValueNode.classList.add("inlineEditValue");
         this.renderedValueClassArray.forEach(function(className) {
            this.renderedValueNode.classList.add(className);
         }, this);
         this.renderedValueNode.setAttribute("tabindex", "0");
         this.renderedValueNode.innerHTML = this.renderedValue;
         this._attach(this.renderedValueNode, "onkeypress", lang.hitch(this, this.onKeyPress));
         this._attach(this.renderedValueNode, "ondijitclick", lang.hitch(this, this.onClickRenderedValue));
         this.domNode.appendChild(this.renderedValueNode);

         this.editNode = document.createElement("span");
         this.editNode.classList.add("editor");
         this.editNode.classList.add("hidden");
         this._attach(this.editNode, "onkeypress", lang.hitch(this, this.onValueEntryKeyPress));
         this._attach(this.editNode, "onclick", lang.hitch(this, this.suppressFocusRequest));

         this.formWidgetNode = document.createElement("span");
         this.editNode.appendChild(this.formWidgetNode);
         this.domNode.appendChild(this.editNode);

         this.editIconNode = document.createElement("img");
         this.editIconNode.classList.add("editIcon");
         this.editIconNode.setAttribute("src", this.editIconImageSrc);
         this.editIconNode.setAttribute("alt", this.editAltText);
         this.editIconNode.setAttribute("title", this.editAltText);
         this._attach(this.editIconNode, "ondijitclick", lang.hitch(this, this.onEditClick));
         this.domNode.appendChild(this.editIconNode);

         var progressNode = document.createElement("img");
         progressNode.classList.add("alfresco-renderers-InlineEditProperty__progress");
         progressNode.setAttribute("src", this.updateInProgressImgSrc);
         progressNode.setAttribute("alt", this.updateInProgressAltText);
         this.domNode.appendChild(progressNode);
      },

      /**
       * The topic to publish when a property edit should be persisted. For convenience it is assumed that document
       * or folder properties are being edited so this function is called whenever a 'publishTopic' attribute
       * has not been set. The defaults are to publish on the "ALF_CRUD_CREATE" topic which will publish a payload
       * to be processed by the [CrudService]{@link module:alfresco/services/CrudService} that should result in a
       * POST a request being made to the Repository form processor.
       *
       * @instance
       * @type {string}
       */
      setDefaultPublicationData: function alfresco_renderers_InlineEditProperty__setDefaultPublicationData() {
         this.publishTopic = "ALF_CRUD_CREATE";
         this.publishPayloadType = "PROCESS";
         this.publishPayloadModifiers = ["processCurrentItemTokens"];
         this.publishPayloadItemMixin = false;
         this.publishPayload = {
            url: "api/node/{jsNode.nodeRef.uri}/formprocessor",
            noRefresh: true
         };
      },

      /**
       * This extends the inherited function to set the [postParam]{@link module:alfresco/renderers/InlineEditProperty#postParam]
       * attribute based on the [propertyToRender]{@link module:alfresco/renderers/InlineEditProperty#propertyToRender] if 
       * provided. It is expected that these will be different because the properties WebScript that this widget will use
       * by default to persist changes takes just the name of the property but this is expected to be nested within the
       * [currentItem]{@link module:alfresco/lists/views/layouts/_MultiItemRendererMixin#currentItem}.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_InlineEditProperty__postMixInProperties() {
         this.inherited(arguments);
         
         // NOTE: We're just re-using the same progress indicator as used for forms validation here,
         //       although this could be updated in the future to be something else...
         if (!this.updateInProgressImgSrc)
         {
            this.updateInProgressImgSrc = require.toUrl("alfresco/forms/controls/css/images/ajax_anim.gif");
         }
         var itemLabel = lang.getObject(this.updateInProgressItemLabelProperty, false, this.currentItem);
         if (itemLabel)
         {
            this.updateInProgressAltText = this.message(this.updateInProgressAltText, {
               0: itemLabel
            });
         }
         else
         {
            this.updateInProgressAltText = this.message(this.updateInProgressNoLabelAltText);
         }

         // If no topic has been provided then assume the default behaviour of editing document/folder properties
         if (!this.publishTopic)
         {
            this.setDefaultPublicationData();
         }

         if (this.propertyToRender && !this.postParam)
         {
            this.postParam = this.propertyToRender;
         }
         else
         {
            this.alfLog("warn", "Property to render attribute has not been set", this);
         }

         if (!this.editIconImageSrc)
         {
            this.editIconImageSrc = require.toUrl("alfresco/renderers/css/images/edit-16.png");
         }

         if (this.renderedValue)
         {
            this.editAltText = this.message(this.editAltText, {
               0: this.renderedValue
            });
         }
         else
         {
            this.editAltText = this.message("inline-edit.edit.altTextNoValue");
         }
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/renderers/Property#postCreate} to
       * check the [permissionProperty]{@link module:alfresco/renderers/InlineEditProperty#permissionProperty}
       * to determine whether or not the current user actually has permission to edit the current item. If
       * the user does not have permission then then edit controls will be hidden (and keyboard shortcuts suppressed).
       *
       * @instance
       */
      postCreate: function alfresco_renderers_InlineEditProperty__postCreate() {
         this.inherited(arguments);

         if (!this.showOkCancelActions)
         {
            domClass.add(this.domNode, "alfresco-renderers-InlineEditProperty--hide-save-cancel-actions");
         }

         if (this.permissionProperty)
         {
            var hasEditPermission = lang.getObject(this.permissionProperty, false, this.currentItem);
            if (!hasEditPermission)
            {
               domClass.add(this.editIconNode, "disabled");
               this._disableEdit = true;
            }
         }

         // See AKU-997...
         if (this.editSubscriptionsTopics)
         {
            array.forEach(this.editSubscriptionsTopics, lang.hitch(this, function(topic) {
               this.alfSubscribe(topic, lang.hitch(this, function(payload) {
                  if (payload === this.currentItem)
                  {
                     this.onEditClick();
                  }
               }));
            }));
         }
      },

      /**
       * Gets the form widget that will be rendered as the edit field. By default this will 
       * return a [textbox]{@link module:alfresco/forms/controls/TextBox}
       * but can be overridden to return alternative form controls.
       * 
       * @instance
       */
      getPrimaryFormWidget: function alfresco_renderers_InlineEditProperty__getPrimaryFormWidget() {
         return {
            name: "alfresco/forms/controls/TextBox",
            config: {
               name: this.postParam,
               validationConfig: this.validationConfig,
               requirementConfig: this.requirementConfig,
               additionalCssClasses: "hiddenlabel",
               label: this.message(this.editLabel)
            }
         };
      },

      /**
       * In certain circimstances it may be necessary to submit additional data along with that
       * provided by the main edit control. This function processes configurable hidden data rules
       * that generates an array of [hidden form controls]{@link module:alfresco/forms/controls/HiddenValue}
       * that are configured with [autoSetConfig]{@link module:alfresco/forms/controls/BaseFormControl#autoSetConfig}
       * that is derived from the [hiddenDataRules]{@link module:alfresco/renderers/InlineEditProperty#hiddenDataRules}.
       * 
       * @instance
       */
      processHiddenDataRules: function alfresco_renderers_InlineEditProperty__processHiddenDataRules() {
         var additionalFormWidgets = [];
         if (this.hiddenDataRules)
         {
            array.forEach(this.hiddenDataRules, lang.hitch(this, this.processHiddenDataRule, additionalFormWidgets));
         }
         return additionalFormWidgets;
      },

      /**
       * Called for each entry in the [hiddenDataRules]{@link module:alfresco/renderers/InlineEditProperty#hiddenDataRules}
       * configuration to add a new [hidden form control]{@link module:alfresco/forms/controls/HiddenValue} definition
       * into the supplied array.
       * 
       * @instance
       * @param {array} additionalFormWidgets The array to add additional form widgets into
       * @param {object} rule The current hidden data rule to process.
       */
      processHiddenDataRule: function alfresco_renderers_InlineEditProperty__processHiddenDataRule(additionalFormWidgets, rule) {
         additionalFormWidgets.push({
            name: "alfresco/forms/controls/HiddenValue",
            config: {
               name: rule.name,
               value: "",
               autoSetConfig: [
                  {
                     rulePassValue: rule.rulePassValue,
                     ruleFailValue: rule.ruleFailValue,
                     rules: [{
                        targetId: "PRIMARY_FIELD",
                        is: rule.is,
                        isNot: rule.isNot
                     }]
                  }
               ]
            }
         });
      },

      /**
       * Gets the edit widget (creating it the first time it is requested).
       *
       * @instance
       * @returns {object} The widget for editing.
       */
      getFormWidget: function alfresco_renderers_InlineEditProperty__getFormWidget() {
         if (!this.formWidget)
         {
            var uuid = this.generateUuid();
            var saveTopic = "_SAVE";
            var cancelTopic = "_CANCEL";
            this.alfSubscribe(uuid + saveTopic, lang.hitch(this, this.onSave), true);
            this.alfSubscribe(uuid + cancelTopic, lang.hitch(this, this.onCancel), true);
            var primaryFormWidget = this.getPrimaryFormWidget();
            var autoSetFields = this.processHiddenDataRules();
            lang.setObject("config.fieldId", "PRIMARY_FIELD", primaryFormWidget);
            this.formWidget = this.createWidget({
               name: "alfresco/forms/Form",
               config: {
                  additionalCssClasses: "alfresco-forms-Form--single-line",
                  pubSubScope: uuid,
                  okButtonLabel: this.message(this.saveLabel),
                  cancelButtonLabel: this.message(this.cancelLabel),
                  cancelButtonPublishTopic: cancelTopic,
                  okButtonPublishTopic: saveTopic,
                  showOkButton: this.showOkCancelActions,
                  showCancelButton: this.showOkCancelActions,
                  widgets: [primaryFormWidget].concat(autoSetFields)
               }
            }, this.formWidgetNode);
            // NOTE: This line is specifically required to support Firefox, for some reason the standard
            //       key handling is being suppressed, this was uncovered on the move from Dojo 1.9.0 to
            //       both 1.9.6 and then 1.10.4
            query(".alfresco-forms-controls-BaseFormControl .control input", this.formWidget.domNode).on("keypress", lang.hitch(this, this.onValueEntryKeyPress));
         }
         return this.formWidget;
      },

      /**
       * Since 1.0.62 this function is never called and performs no action. The action labels were removed
       * and the buttons from the [Form]{@link module:alfresco/forms/Form} are now displayed instead and 
       * the [Form]{@link module:alfresco/forms/Form} automatically takes care of button enablement.
       *
       * @instance
       * @param {object} payload The details of the updated form validity
       * @deprecated Since 1.0.62 - This function no longer performs any action.
       */
      onFormValidityChange: function alfresco_renderers_InlineEditProperty__onFormValidityChange() {
         // No action.
      },

      /**
       * This function is called whenever the user clicks on the rendered value. It checks an overridable
       * instance variable (editOnClickRenderedValue), to see whether it should then launch into edit mode.
       *
       * @instance
       * @param {object} evt Dojo-normalised event
       */
      onClickRenderedValue: function alfresco_renderers_InlineEditProperty__onClickRenderedValue(evt) {
         this.editOnClickRenderedValue && this.onEditClick(evt);
      },

      /**
       * This function is called whenever the user clicks on the edit icon. It hides the display DOM node
       * and shows the edit DOM nodes.
       * 
       * @instance
       */
      onEditClick: function alfresco_renderers_InlineEditProperty__onEditClick(evt) {
         if (!this._disableEdit)
         {
            this.suppressContainerKeyboardNavigation(true);
            var formWidget = this.getFormWidget();
            var o = {};
            var formValue = this.originalRenderedValue;
            if (formValue !== null && 
                typeof formValue !== "undefined" && 
                typeof formValue.toString === "function")
            {
               formValue = this.decodeHTML(formValue.toString());
            }
            else
            {
               formValue = "";
            }
            lang.setObject(this.postParam, formValue, o);
            formWidget.setValue(o);
            domClass.toggle(this.renderedValueNode, "hidden");
            domClass.toggle(this.editNode, "hidden");
            formWidget.focus(); // Focus on the input node so typing can occur straight away
            evt && event.stop(evt);
         }
      },
      
      /**
       * @instance
       */
      onSave: function alfresco_renderers_InlineEditProperty__onSave(formPayload) {
         /*jshint unused:false*/
         domClass.add(this.domNode, "alfresco-renderers-InlineEditProperty--updating");

         var responseTopic = this.generateUuid();
         var payload = lang.clone(this.getGeneratedPayload(false, null));
         payload.alfResponseTopic = responseTopic;
         this._saveSuccessHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onSaveSuccess), true);
         this._saveFailureHandle = this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, this.onSaveFailure), true);
         this.updateSaveData(payload);
         this.alfPublish(this.publishTopic, payload, true);
      },

      /**
       * Updates the supplied payload with the current form value.
       *
       * @instance
       * @param {object} payload The save payload to update.
       */
      updateSaveData: function alfresco_renderers_InlineEditProperty__getSaveData(payload) {
         lang.mixin(payload, this.getFormWidget().getValue());
      },

      /**
       * Called following successful save attempts. This will update the read-only display using the requested save
       * data.
       * 
       * @instance
       * @param {object} payload The success payload
       */
      onSaveSuccess: function alfresco_renderers_InlineEditProperty__onSaveSuccess(payload) {
         /*jshint unused:false*/
         this.alfUnsubscribeSaveHandles([this._saveSuccessHandle, this._saveFailureHandle]);

         this.alfLog("log", "Property '" + this.propertyToRender + "' successfully updated for node: ", this.currentItem);
         
         var formValue = this.getFormWidget().getValue()[this.postParam];
         if (formValue !== null && 
             typeof formValue !== "undefined" && 
             typeof formValue.toString === "function")
         {
            this.originalRenderedValue = this.encodeHTML(formValue.toString());
         }
         else
         {
            this.originalRenderedValue = "";
         }
         
         this.renderedValue = this.mapValueToDisplayValue(formValue);

         // If requested, update the currentItem with the updated value. This is done in the
         // case where the currentItem might be subsequently used elsewhere (e.g. in a 
         // form, etc)
         if (this.refreshCurrentItem === true)
         {
            this.updateCurrentItem(payload).then(lang.hitch(this, this.reRenderProperty));
         }
         else
         {
            this.reRenderProperty();
         }
      },

      /**
       * This function is called from [onSaveSuccess]{@link module:alfresco/renderers/InlineEditProperty#onSaveSuccess}
       * to re-render the property after an edit has successfully been saved.
       * 
       * @instance
       * @param {object} payload The success payload
       * @since 1.0.83
       */
      reRenderProperty: function alfresco_renderers_InlineEditProperty__reRenderProperty() {
         this.renderedValue = this.generateRendering(this.renderedValue);
         this.renderedValueNode.textContent = this.renderedValue;
         domClass.remove(this.renderedValueNode, "hidden");
         domClass.add(this.editNode, "hidden");
         this.updateCssClasses();
         this.renderedValueNode.focus();

         domClass.remove(this.domNode, "alfresco-renderers-InlineEditProperty--updating");
      },

      /**
       * This function is called from [onSaveSuccess]{@link module:alfresco/renderers/InlineEditProperty#onSaveSuccess}
       * when [refreshCurrentItem]{@link module:alfresco/renderers/InlineEditProperty#refreshCurrentItem} is true
       * and allows the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} to be updated
       * with the latest data following the update.
       * 
       * @instance
       * @param {object} payload The success payload
       * @returns {object} A promise of the udpate that by default is immediately resolved.
       * @since 1.0.83
       * @overridable
       */
      updateCurrentItem: function alfresco_renderers_InlineEditProperty__updateCurrentItem(/*jshint unused:false*/ payload) {
         var d = new Deferred();
         lang.setObject(this.propertyToRender, this.originalRenderedValue, this.currentItem);
         d.resolve();
         return d;
      },

      /**
       * Called following a failed save attempt. Cancels the edit mode.
       * TODO: Issues an error message
       * 
       * @instance
       * @param {object} payload The success payload
       */
      onSaveFailure: function alfresco_renderers_InlineEditProperty__onSaveFailure(payload) {
         /*jshint unused:false*/
         this.alfUnsubscribeSaveHandles([this._saveSuccessHandle, this._saveFailureHandle]);
         this.alfLog("warn", "Property '" + this.propertyToRender + "' was not updated for node: ", this.currentItem);
         this.onCancel();
      },
      
      /**
       * Called when a user cancels out of edit mode. Returns the read-only display to its original state
       * before editing began.
       *
       * @instance
       */
      onCancel: function alfresco_renderers_InlineEditProperty__onCancel() {
         this.suppressContainerKeyboardNavigation(false);

         domClass.remove(this.renderedValueNode, "hidden");
         domClass.add(this.editNode, "hidden");
         
         // Reset the input field...
         this.getFormWidget().setValue(this.renderedValue);
         this.renderedValueNode.focus();
      }
   });
});