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
        "dojo/text!./templates/InlineEditProperty.html",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/on",
        "dojo/dom-class",
        "dojo/html",
        "dojo/dom-attr",
        "dojo/keys",
        "dojo/_base/event",
        "dojo/query",
        "service/constants/Default",
        "alfresco/forms/Form",
        "alfresco/forms/controls/DojoValidationTextBox",
        "alfresco/forms/controls/HiddenValue"], 
        function(declare, Property, _OnDijitClickMixin, CoreWidgetProcessing, _PublishPayloadMixin, KeyboardNavigationSuppressionMixin,
                 template, lang, array, on, domClass, html, domAttr, keys, event, query) {

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
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
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

         // Localize the labels and alt-text...
         this.saveLabel = this.message(this.saveLabel);
         this.cancelLabel = this.message(this.cancelLabel);

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
      },

      /**
       * Gets the form widget that will be rendered as the edit field. By default this will 
       * return a [validation textbox]{@link module:alfresco/forms/controls/DojoValidationTextBox}
       * but can be overridden to return alternative form controls.
       * 
       * @instance
       */
      getPrimaryFormWidget: function alfresco_renderers_InlineEditProperty__getPrimaryFormWidget() {
         return {
            name: "alfresco/forms/controls/DojoValidationTextBox",
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
         if (this.formWidget === null)
         {
            var uuid = this.generateUuid();
            this.alfSubscribe(uuid + "ALF_FORM_VALIDITY", lang.hitch(this, this.onFormValidityChange), true);
            var primaryFormWidget = this.getPrimaryFormWidget();
            var autoSetFields = this.processHiddenDataRules();
            lang.setObject("config.fieldId", "PRIMARY_FIELD", primaryFormWidget);
            this.formWidget = this.createWidget({
               name: "alfresco/forms/Form",
               config: {
                  pubSubScope: uuid,
                  showOkButton: false,
                  showCancelButton: false,
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
       * This handles publications from the form used by this widget to determine whether
       * or the edit field is invalid or not. If the form is in an invalid state then the
       * "Save" link will be disabled.
       *
       * @instance
       * @param {object} payload The details of the updated form validity
       */
      onFormValidityChange: function alfresco_renderers_InlineEditProperty__onFormValidityChange(payload) {
         this.alfLog("log", "Form validity changed", payload);
         if (payload.valid === true)
         {
            this.isSaveAllowed = true;
            domClass.remove(this.saveLinkNode, "disabled");
         }
         else
         {
            this.isSaveAllowed = false;
            domClass.add(this.saveLinkNode, "disabled");
         }
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
            lang.setObject(this.postParam, this.decodeHTML(this.originalRenderedValue), o);
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
      onSave: function alfresco_renderers_InlineEditProperty__onSave(evt) {
         /*jshint unused:false*/
         if (this.isSaveAllowed === true)
         {
            var responseTopic = this.generateUuid();
            var payload = lang.clone(this.getGeneratedPayload(false, null));
            payload.alfResponseTopic = responseTopic;
            this._saveSuccessHandle = this.alfSubscribe(responseTopic + "_SUCCESS", lang.hitch(this, this.onSaveSuccess), true);
            this._saveFailureHandle = this.alfSubscribe(responseTopic + "_FAILURE", lang.hitch(this, this.onSaveFailure), true);
            this.updateSaveData(payload);
            this.alfPublish(this.publishTopic, payload, true);
            // TODO: Set some sort of indicator to show that a save operation is in flight?
         }
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
         this.originalRenderedValue = this.encodeHTML(this.getFormWidget().getValue()[this.postParam]);
         this.renderedValue = this.mapValueToDisplayValue(this.originalRenderedValue);

         // If requested, update the currentItem with the updated value. This is done in the
         // case where the currentItem might be subsequently used elsewhere (e.g. in a 
         // form, etc)
         if (this.refreshCurrentItem === true)
         {
            lang.setObject(this.propertyToRender, this.originalRenderedValue, this.currentItem);
         }
         
         this.renderedValue = this.generateRendering(this.renderedValue);
         html.set(this.renderedValueNode, this.renderedValue);
         domClass.remove(this.renderedValueNode, "hidden");
         domClass.add(this.editNode, "hidden");
         this.updateCssClasses();
         this.renderedValueNode.focus();
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