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
 * <p>This is the root module for all Aikau forms. It is intended to work with widgets that extend the
 * [BaseFormControl]{@link module:alfresco/forms/controls/BaseFormControl} and handles setting and 
 * getting there values as well as creating and controlling the behaviour of buttons that can be
 * used to publish the overall value of the controls that the form contains.</p>
 *
 * <p>By default forms will show error messages against any fields that contain invalid data when the 
 * form is first displayed. If you'd prefer to give the user a chance to enter or change the data before
 * validation errors are displayed then this can be achieved by configuring the 
 * [showValidationErrorsImmediately]{@link module:alfresco/forms/Form#showValidationErrorsImmediately}
 * to be false.</p>
 * 
 * <p>It is also possible to setup a form to automatically publish itself whenever its values change,
 * and optionally to also do so if any of its values are invalid. If the 
 * [autoSavePublishTopic]{@link module:alfresco/forms/Form#autoSavePublishTopic} is specified, 
 * then the OK and Cancel buttons are automatically hidden.</p>
 *
 * <p>Configuration can be provided to create rules that display one or more [warnings]{@link module:alfresco/forms/Form#warnings}
 * based on the changing values of fields in the forms. The [position of the warnings]{@link module:alfresco/forms/Form#warningsPosition}
 * can be configured to either be at "top" or "bottom" of the form.</p>
 * 
 * <p><b>PLEASE NOTE:</b> If you want to layout your form controls in a specific manner (e.g. in a horizontal 
 * line or within tabs) then you should use dedicated form control layout widgets such as 
 * [ControlRow]{@link module:alfresco/forms/ControlRow} or
 * [TabbedControls]{@link module:alfresco/forms/TabbedControls} as the basic layout widgets 
 * do not provide all the required functionality.</p>
 * 
 * @example <caption>Example configuration for auto-publishing (including invalid) form:</caption>
 * {
 *    name: "alfresco/forms/Form",
 *    config: {
 *       autoSavePublishTopic: "AUTOSAVE_FORM",
 *       autoSavePublishGlobal: true,
 *       autoSaveOnInvalid: true,
 *       widgets: [
 *          {
 *             name: "alfresco/forms/controls/TextBox",
 *             config: {
 *                name: "control",
 *                label: "Autosave form control (even invalid)",
 *                requirementConfig: {
 *                   initialValue: true
 *                }
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @example <caption>Example configuration for form that does not show validation errors on initial display:</caption>
 * {
 *    name: "alfresco/forms/Form",
 *    config: {
 *       okButtonPublishTopic: "SAVE_FORM",
 *       okButtonLabel: "Save",
 *       showValidationErrorsImmediately: false,
 *       widgets: [
 *          {
 *             name: "alfresco/forms/controls/TextBox",
 *             config: {
 *                name: "control",
 *                label: "Name",
 *                requirementConfig: {
 *                   initialValue: true
 *                }
 *             }
 *          }
 *       ]
 *    }
 * }
 *
 * @example <caption>Example configuration for form with additional buttons:</caption>
 * {
 *    name: "alfresco/forms/Form",
 *    config: {
 *       okButtonPublishTopic: "SAVE_FORM",
 *       okButtonLabel: "Save",
 *       showValidationErrorsImmediately: false,
 *       widgets: [
 *          {
 *             name: "alfresco/forms/controls/TextBox",
 *             config: {
 *                name: "control",
 *                label: "Name",
 *                requirementConfig: {
 *                   initialValue: true
 *                }
 *             }
 *          }
 *       ],
 *       widgetsAdditionalButtons: [
 *          {
 *             name: "alfresco/buttons/AlfButton",
 *             config: {
 *                label: "Button 1 (includes form values)",
 *                publishTopic: "CUSTOM_TOPIC_1",
 *                publishPayload: {
 *                   additional: "data"
 *                } 
 *             }
 *          },
 *          {
 *             name: "alfresco/buttons/AlfButton",
 *             config: {
 *                updatePayload: false,
 *                label: "Button 1 (does not include form values)",
 *                publishTopic: "CUSTOM_TOPIC_2",
 *                publishPayload: {
 *                   only: "data"
 *                } 
 *             }
 *          }
 *       ]
 *    }
 * }
 * 
 * @module alfresco/forms/Form
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @mixes module:alfresco/documentlibrary/_AlfHashMixin
 * @mixes module:alfresco/forms/controls/utilities/RulesEngineMixin
 * @pageSafe
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/form/Form",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/topics",
        "alfresco/documentlibrary/_AlfHashMixin",
        "alfresco/forms/controls/utilities/RulesEngineMixin",
        "dojo/text!./templates/Form.html",
        "dojo/io-query",
        "alfresco/header/Warning",
        "alfresco/util/hashUtils",
        "dojo/_base/lang",
        "alfresco/buttons/AlfButton",
        "dojo/_base/array",
        "dijit/registry",
        "dojo/Deferred",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/_base/event",
        "dojo/on",
        "jquery"], 
        function(declare, _Widget, _Templated, Form, AlfCore, CoreWidgetProcessing, topics, _AlfHashMixin, RulesEngineMixin, 
                 template, ioQuery, Warning, hashUtils, lang, AlfButton, array, registry, Deferred, domConstruct, domClass, 
                 Event, on, $) {
   
   return declare([_Widget, _Templated, AlfCore, CoreWidgetProcessing, _AlfHashMixin, RulesEngineMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfDialog.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Form.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Form.css"}]
       */
      cssRequirements: [{cssFile:"./css/Form.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * @instance
       * @type {object}
       * @default
       */
      _form: null,
      
      /**
       * @instance
       * @type {object[]}
       * @default
       */
      widgets: null,
      
      /**
       * The URL that the form will be posted to
       * 
       * @instance
       * @type {string}
       * @default
       */
      postUrl: "",
      
      /**
       * @instance
       * @type {boolean}
       * @default
       */
      convertFormToJsonString: false,

      /**
       * <p>Should the first field in the form be focused when the form is loaded?</p>
       *
       * <p><strong>NOTE:</strong> If more than one form on a page has this setting,
       * then the order in which the fields are focused cannot be guaranteed.</p>
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.49
       */
      firstFieldFocusOnLoad: false,

      /**
       * This will be instantiated as an array and used to keep track of any controls that report themselves as being
       * in an invalid state. The "OK" button for submitting the form should only be enabled when this list is empty.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      invalidFormControls: null,
      
      /**
       * A reference to the "OK" button for the form.
       * TODO: It should be possible to configure alternative labels for the button
       * 
       * @instance
       * @type {object}
       * @default
       */
      okButton: null,
      
      /**
       * A reference to the "Cancel" button for the form.
       * TODO: It should be possible to configure alternative labels for the button.
       * 
       * @instance
       * @type {object}
       * @default
       */
      cancelButton: null,
      
      /**
       * Indicates that the a new pubSubScope should be generated for this widget so that it's
       * form controls will be scoped to only communicate with this instance and not "pollute"
       * any other forms that may also be on the page.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      scopeFormControls: true,
      
      /**
       * Indicates whether or not to create buttons for this form.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      displayButtons: true,
      
      /**
       * This should be set to a specific topic that can be published on to set the value of the form.
       * The default value is null (e.g. setting via publication will not be possible unless a topic
       * is explictly configured). The [setValueTopicGlobalScope]{@link module:alfresco/forms/Form#setValueTopicGlobalScope}
       * and [setValueTopicParentScope]{@link module:alfresco/forms/Form#setValueTopicParentScope} should 
       * also be set accordingly.
       * 
       * @instance
       * @type {string}
       * @default
       */
      setValueTopic: null,

      /**
       * This indicates whether any [setValueTopic]{@link module:alfresco/forms/Form#setValueTopic} subscription
       * should be made globally.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      setValueTopicGlobalScope: true,

      /**
       * This indicates whether any [setValueTopic]{@link module:alfresco/forms/Form#setValueTopic} subscription
       * should be made to the parent scope.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      setValueTopicParentScope: false,

      /**
       * Indicates that any validation errors that are present on the fields contained within the form will be 
       * shown immediately when the form is displayed. Validation will still occur if this is configured to be
       * false (so it will not be possible to submit an invalid form).
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      showValidationErrorsImmediately: true,

      /**
       * When using the optional auto-saving capability (configured by setting an [autoSavePublishTopic]{@link module:alfresco/forms/Form#autoSavePublishTopic})
       * the form will typically need to wait until page setup is complete before allowing automatic saving to commence. However,
       * if a form (configured to auto-save) is dynamically created after the page has been loaded (e.g. when created within a
       * dialog for example) then it this should be configured to be false (otherwise auto-save will not occur)
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      waitForPageWidgets: true,

      /**
       * <p>Can be configured to display one or more banners on the form based on the changing value of fields
       * within the form. The configuration is almost identical to that of the 
       * [visibilityConfig]{@link module:alfresco/forms/controls/BaseFormControl#visibilityConfig} in form fields
       * except that a "message" attribute should also be included that will be displayed when the rules 
       * are evaluated to be true.</p>
       * <p>The default position for the warnings is at the top of the form but it is possible to move the
       * warnings to the bottom of the form by configuring
       * [warningsPosition]{@link module:alfresco/forms/Form#warningsPosition} to be "bottom".
       * </p>
       *
       * @example <caption>Example configuration for warning displayed when "FIELD1" is set</caption>
       * warnings: [
       *   {
       *     message: "Warning 1: Field 1 is not blank",
       *     initialValue: true,
       *     rules: [
       *       {
       *         targetId: "FIELD1",
       *         isNot: [""]
       *       }
       *     ]
       *   }
       * ]
       *
       * @instance
       * @type {object[]}
       * @default
       * @since 1.0.32
       */
      warnings: null,

      /**
       * This is the position that any [warnings]{@link module:alfresco/forms/Form#warnings} will be placed. 
       * There are two options available which are "top" (the default) and "bottom". Extending widgets may provide
       * alternative positions.
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.32
       */
      warningsPosition: "top",

      /**
       * This is an optional topic that can be provided to allow other widgets to trigger the submission of 
       * the form. This was added to support requirements of the
       * [FormsRuntimeService]{@link module:alfresco/services/FormsRuntimeService} and in particular the
       * [Transitions]{@link module:alfresco/forms/controls/Transitions} control.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.86
       */
      formSubmissionTriggerTopic: null,

      /**
       * @instance
       * @listens module:alfresco/core/topics#GET_FORM_VALUE_DEPENDENT_OPTIONS
       */
      postCreate: function alfresco_forms_Form__postCreate() {
         // A form is configured to auto-save updates we want to be sure that it doesn't start saving until the 
         // use has actually made any changes. Therefore we want to wait until all the widgets are properly setup
         // before we allow autosaving to commence. However, when the form is included directly on a page (e.g. it is
         // not part of a dialog, etc) then we want to wait until the page has completed being setup, as this publications
         // are queued up until this occurs.
         if (this.waitForPageWidgets === true)
         {
            this.pageWidgetsReadySubcription = this.alfSubscribe(topics.PAGE_WIDGETS_READY, lang.hitch(this, function() {
               this.alfUnsubscribe(this.pageWidgetsReadySubcription);
               this._readyToAutoSave = true;
            }), true);
         }
         else
         {
            this._readyToAutoSave = true;
         }

         // Setup some arrays for recording the valid and invalid widgets...
         this.invalidFormControls = [];
         
         // Generate a new pubSubScope if required...
         if (this.scopeFormControls === true && this.pubSubScope === "")
         {
            this.pubSubScope = this.generateUuid();
         }

         // If requested in the configuration, the value of a form can be set via a publication,
         // however to avoid generating subscriptions unnecessarily the subscription is only
         // set if explicitly requested. Global scope is intentionally used for the subscription
         if (this.setValueTopic)
         {
            this.alfSubscribe(this.setValueTopic, lang.hitch(this, this.setValue), this.setValueTopicGlobalScope, this.setValueTopicParentScope);
         }

         // Create a subscription that allows fields within the form to request options with a payload
         // that is augmented with the value of the form...
         this.alfSubscribe(topics.GET_FORM_VALUE_DEPENDENT_OPTIONS, lang.hitch(this, this.getFormValueDependantOptions));

         // Create any configured warnings...
         this.createWarnings();

         // When any of these topics are published, submit the form
         if (this.publishValueSubscriptions && this.publishValueSubscriptions.length) {
            array.forEach(this.publishValueSubscriptions, function(subscriptionTopic) {
               this.alfSubscribe(subscriptionTopic, lang.hitch(this, this.submitOkButton));
            }, this);
         }
         
         this._form = new Form({
            id: this.generateUuid()
         }, this.formNode);
         
         // Set up the handlers for form controls reporting themselves as valid or invalid
         // following user update...
         this.alfSubscribe("ALF_INVALID_CONTROL", lang.hitch(this, this.onInvalidField));
         this.alfSubscribe("ALF_VALID_CONTROL", lang.hitch(this, this.onValidField));

         if (this.displayButtons === true)
         {
            // Create the buttons for the form...
            this.createButtons();
         }

         // See AKU-1049 - check for any "late" registered fields. This triggers republication
         // of values, but only occurs if the fields are added to the DOM after form setup 
         // has completed. This addresses the case where wrappers - in particular TabbedControls
         // - are used in a form
         on(this.domNode, "ALF_FIELD_ADDED_TO_FORM", lang.hitch(this, function(evt) {
            evt && Event.stop(evt);
            if (this._formSetupComplete)
            {
               array.forEach(this._form.getChildren(), function(entry) {
                  if (typeof entry.publishValue === "function")
                  {
                     entry.publishValue();
                  }
               });
            }
         }));

         // Add the widgets to the form...
         // The widgets should automatically inherit the pubSubScope from the form to scope communication
         // to this widget. However, this widget will need to be assigned with a pubSubScope... 
         if (this.widgets)
         {
            array.forEach(this.widgets, function(widget) {
               if (widget && widget.config)
               {
                  widget.config.showValidationErrorsImmediately = this.showValidationErrorsImmediately;
                  if (widget.config.pubSubScope)
                  {
                     this.alfLog("warn", "It is not recommended to set a pubSubScope attribute on a form control nested within a form, the value of the form control will not be included in the published form value", this, widget);
                  }
               }
            }, this);

            this.processWidgets(this.widgets, this._form.domNode, "FIELDS");
         }

         // Setup subscriptions for the re-enablement of the OK button if necessary
         if(this.okButton && this.okButtonDisableOnPublish && this.okButtonEnablementTopics && this.okButtonEnablementTopics.length) {
            array.forEach(this.okButtonEnablementTopics, function(topic) {
               this.setupOkButtonEnablementSubscription(topic);
            }, this);
         }

         if (this.formSubmissionTriggerTopic && this.okButton)
         {
            this.alfSubscribe(this.formSubmissionTriggerTopic, lang.hitch(this, function() {
               this.okButton.onClick();
            }));
         }
      },

      /**
       * This function is called to process any [warning configuration]{@link module:alfresco/forms/Form#warnings} 
       * and create a [warning widget]{@link module:alfresco/header/Warning} to display those warnings.
       *
       * @instance
       * @since 1.0.32
       */
      createWarnings: function alfresco_forms_Form_createWarnings() {
         var warnings = [];
         array.forEach(this.warnings, lang.hitch(this, this.processWarnings, warnings));
         this.createWidget({
            id: this.id + "_WARNINGS",
            name: "alfresco/header/Warning",
            config: {
               warnings: warnings
            }
         }).placeAt((this.warningsPosition === "top" ? this.warningsTopNode : this.warningsBottomNode));

         if (warnings.length > 0)
         {
            domClass.remove(this.warningsPosition === "top" ? this.warningsTopNode : this.warningsBottomNode, "alfresco-forms-Form__warnings--hidden");
         }
      },

      /**
       * Processes an individal warning configuration for the form from the  
       * [array of warnings]{@link module:alfresco/forms/Form#warnings} that have been configured.
       * 
       * @instance
       * @since 1.0.32
       * @param {object[]} warnings An array of warnings to push the current warning data into
       * @param {object} warningConfig The configuration for the warning
       * @param {number} index The index of the configuration in the complete array of banners
       */
      processWarnings: function alfresco_forms_Form__processWarnings(warnings, warningConfig, index) {
         if (warningConfig.message)
         {
            // Define a unique function name for handling rules evaluation for this banner 
            // (this is going to be passed to the rule config processing as a callback and we're
            // going to create the function in a moment)... prefixing with "alf" should ensure
            // that no-one creates a similarly named function...
            var fName = "alfUpdateBanner" + index;

            // Generate a unique subscription topic, this is then added to the banner configuration
            // and will be used to publish information on whether or not the banner should be displayed
            // as rules are evaluated...
            var subscriptionTopic = this.generateUuid();
            warningConfig.subscriptionTopic = subscriptionTopic;
            this[fName] = lang.hitch(this, this.updateWarnings, warningConfig);
            this.processConfig(fName, warningConfig);

            // Add the specific warning information into the array to be returned (we want to create
            // a single Warning widget, not lots of them)...
            warnings.push({
               subscriptionTopic: subscriptionTopic,
               message: warningConfig.message,
               level: 1
            });
         }
         else
         {
            this.alfLog("warn", "Warning configuration for the form was missing a 'message' to display in the warning", warningConfig, this);
         }
      },

      /**
       * This function is called whenever warning rules have evaluated to indicate a change in visibility
       * for a particular warning.
       * 
       * @instance
       * @since 1.0.32
       * @param {object} warningConfig The configuration for the warning
       * @param {boolean} status Indicates whether or not the warning should be displayed or not
       */
      updateWarnings: function alfresco_forms_Form__updateWarnings(warningConfig, status) {
         this.alfPublish(warningConfig.subscriptionTopic, {
            value: status
         });
      },

      /**
       * Handles the reporting of an invalid field. This will disable the "OK" button if it has
       * been created to prevent users from attempting to submit invalid data.
       * 
       * @instance
       * @param {object} payload The published details of the invalid field.
       */
      onInvalidField: function alfresco_forms_Form__onInvalidField(payload) {
         var alreadyCaptured = array.some(this.invalidFormControls, function(item) {
            return item === payload.fieldId;
         });
         if (!alreadyCaptured)
         {
            this.invalidFormControls.push(payload.fieldId);
         }
         if (this.okButton)
         {
            this.okButton.set("disabled", "true");
         }
         this.publishFormValidity();
      },

      /**
       * Published the current form validity. This is done as a courtesy for other
       * widgets that might be dependant up the current state of the form.
       *
       * @instance
       */
      publishFormValidity: function alfresco_forms_Form__publishFormValidity() {
         var isValid = this.invalidFormControls.length === 0,
             autoSavePayload;

         this.alfPublish("ALF_FORM_VALIDITY", {
            valid: isValid,
            invalidFormControls: this.invalidFormControls
         });

         if(this._formSetupComplete === true && 
            this._readyToAutoSave === true &&
            this.autoSavePublishTopic && 
            typeof this.autoSavePublishTopic === "string" && 
            (isValid || this.autoSaveOnInvalid)) {

            autoSavePayload = lang.mixin(this.autoSavePublishPayload || {}, {
               alfValidForm: isValid
            });

            $.extend(true, autoSavePayload, this.getValue());

            this.alfPublish(this.autoSavePublishTopic, autoSavePayload, this.autoSavePublishGlobal);
         }
      },
      
      /**
       * Handles the reporting of a valid field. If the field was previously recorded as being
       * invalid then it is removed from the [invalidFormControls]{@link module:alfresco/forms/Form#invalidFormControls}
       * attribute and it was the field was the only field in error then the "OK" button is 
       * enabled. 
       * 
       * @instance
       * @param {object} payload The published details of the field that has become valid
       */
      onValidField: function alfresco_forms_Form__onValidField(payload) {
         this.invalidFormControls = array.filter(this.invalidFormControls, function(item) {
            return item !== payload.fieldId;
         });
         if (this.okButton)
         {
            this.okButton.set("disabled", this.invalidFormControls.length > 0);
            // See AKU-275: This is required to ensure that the actual "disabled" attribute is set correctly
            this.okButton.domNode.firstChild.firstChild.setAttribute("disabled", this.invalidFormControls.length > 0);
         }
         this.publishFormValidity();

         // Update the publishPayload of the "OK" button so that when it is clicked
         // it will provide the current form data...
         var formValue = this.getValue();
         array.forEach(this.additionalButtons, function(button) {
            if (!button.updatePayload)
            {
               // No action required, leave the payload as is
            }
            else if (button._alfOriginalButtonPayload)
            {
               var newPayload = {};
               lang.mixin(newPayload, button._alfOriginalButtonPayload, formValue);
               button.publishPayload = newPayload;
            }
            else
            {
               button.publishPayload = formValue;
            }
         });

         if (this.widgetProcessingComplete) {
            this.publishValidValue();
         }
      },

      /**
       * This topic will be published when the form contains valid data
       *
       * @instance
       * @type {string}
       * @default
       */
      validFormValuesPublishTopic: null,

      /**
       * The payload of validFormValuesPublishTopic. If left as null the form's value will be dispatched.
       *
       * @instance
       * @type {object}
       * @default
       */
      validFormValuesPublishPayload: null,

      /**
       * Set to true if a the validFormValuesPublishTopic shall be globally published.
       *
       * @instance
       * @type {string}
       * @default
       */
      validFormValuesPublishGlobal: false,

      /**
       * If set to true the form will fire an event when it has been processed (as long as all values are valid)
       *
       * @instance
       * @type {boolean}
       * @default
       */
      validFormValuesPublishOnInit: false,

      /**
       * Indicates whether or not the "OK" button should be displayed or not.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      showOkButton: true,
      
      /**
       * Indicates whether or not the "Cancel" button should be displayed or not.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      showCancelButton: true,
      
      /**
       * The label that will be used for the "OK" button. This value can either be an explicit
       * localised value or an properties key that will be used to retrieve a localised value.
       * 
       * @instance
       * @type {string}
       * @default
       */
      okButtonLabel: "form.button.ok.label",
      
      /**
       * Additional CSS clases to apply to the confirmation button on the form. This defaults to
       * have the "call-to-action" style, but this can be overridden as required.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.33
       */
      okButtonClass: "call-to-action",

      /**
       * @instance 
       * @type {string}
       * @default
       */
      okButtonPublishTopic: null,
      
      /**
       * @instance
       * @type {object}
       * @default
       */
      okButtonPublishPayload: null,
      
      /**
       * @instance 
       * @type {string}
       * @default
       */
      okButtonPublishGlobal: null,

      /**
       * The label that will be used for the "OK" button after a publish. It will return to the configured label
       * after [okButtonPublishRevertSecs]{@link module:alfresco/forms/Form#okButtonPublishRevertSecs} seconds
       * (but also see [okButtonDisableOnPublish]{@link module:alfresco/forms/Form#okButtonDisableOnPublish}).
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.44
       */
      okButtonPublishedLabel: "form.button.ok.label.published",

      /**
       * <p>When the OK button has been pushed, the label will changed to the [published-label]{@link module:alfresco/forms/Form#okButtonPublishedLabel}
       * and will also disable if [okButtonDisableOnPublish]{@link module:alfresco/forms/Form#okButtonDisableOnPublish} is set to true. Unless the
       * [okButtonEnablementTopics property]{@link module:alfresco/alfresco/forms/Form#okButtonEnablementTopics} has been provided, both changes will
       * automatically be reverted after this property's value in seconds has passed.</p>
       *
       * <p>See [this comment from UX]{link https://issues.alfresco.com/jira/browse/AKU-683?focusedCommentId=425326&page=com.atlassian.jira.plugin.system.issuetabpanels:comment-tabpanel#comment-425326} for the reason for this property.</p>
       *
       * @instance
       * @type {number}
       * @default
       * @since 1.0.44
       */
      okButtonPublishRevertSecs: 0,

      /**
       * Whether to disable the OK button after a publish. If this is set to true then the
       * [published-label]{@link module:alfresco/forms/Form#okButtonPublishedLabel} will
       * remain in-place until the button is re-enabled by use of either the
       * [okButtonEnablementTopics]{@link module:alfresco/alfresco/forms/Form#okButtonEnablementTopics}
       * or [okButtonReenableSecs]{@link module:alfresco/alfresco/forms/Form#okButtonReenableSecs}
       * properties.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.44
       */
      okButtonDisableOnPublish: false,

      /**
       * If [okButtonDisableOnPublish]{@link module:alfresco/forms/Form#okButtonDisableOnPublish} has been set to true
       * and this property is provided then the button will remain disabled until one of these topics has been published
       * (scoped as necessary). The array should contain either strings for unconditional re-enablement if that topic
       * is published or [rule objects]{@link module:alfresco/util/objectUtils#Rules} with an additional topic attribute
       * that defines the topic aname to conditionally subscribe to.
       *
       * @instance
       * @type {string[]|object[]}
       * @default
       * @since 1.0.44
       */
      okButtonEnablementTopics: null,

      /**
       * If any of these topics are published then publish this form using the
       * [okButtonPublishTopic]{@link module:alfresco/forms/Form#okButtonPublishTopic}.
       * One may often wish to use [topics.ENTER_KEY_PRESSED]{@link module:alfresco/core/topics#ENTER_KEY_PRESSED}
       * as a value in this array, to cause the form to submit when ENTER is pressed.
       *
       * @instance
       * @type {string[]}
       * @default
       * @since 1.0.49
       */
      publishValueSubscriptions: null,

      /**
       * The label that will be used for the "Cancel" button. This value can either be an explicit
       * localised value or an properties key that will be used to retrieve a localised value.
       *
       * @instance
       * @type {string}
       * @default
       */
      cancelButtonLabel: "form.button.cancel.label",
      
      /**
       * @instance
       * @type {string}
       * @default
       */
      cancelButtonPublishTopic: null,
      
      /**
       * @instance
       * @type {object}
       * @default
       */
      cancelButtonPublishPayload: null,

      /**
       * @instance
       * @type {object}
       * @default
       */
      cancelButtonPublishGlobal: null,
      
      /**
       * <p>If this is not null, then the form will auto-publish on this topic whenever a form's
       * values change. This setting overrides (and removes) the form buttons so that they are 
       * no longer displayed. Auto-saving will <strong>not</strong> occur if the form is in an
       * invalid state unless [autoSaveOnInvalid]{@link module:alfresco/forms/Form#autoSaveOnInvalid}
       * is configured to be true.</p>
       * 
       * <p><strong>PLEASE NOTE:</strong> If the form is being dynamically created after page load has completed 
       * (e.g. if the form is being displayed in a dialog for example) then in order for auto-saving to occur 
       * it will also be necessary to configure the 
       * [waitForPageWidgets]{@link module:alfresco/forms/Form#waitForPageWidgets} attribute to be false.</p>
       * 
       * @instance 
       * @type {string}
       * @default
       */
      autoSavePublishTopic: null,
      
      /**
       * Additional data to be published on the 
       * [autoSavePublishTopic]{@link module:alfresco/forms/Form#autoSavePublishTopic} 
       * along with the form value.
       * 
       * @instance
       * @type {object}
       * @default
       */
      autoSavePublishPayload: null,
      
      /**
       * Indicates that the [autoSavePublishTopic]{@link module:alfresco/forms/Form#autoSavePublishTopic}
       * should be published on the global scope.
       * 
       * @instance 
       * @type {string}
       * @default
       */
      autoSavePublishGlobal: null,

      /**
       * When [autoSavePublishTopic]{@link module:alfresco/forms/Form#autoSavePublishTopic} is
       * configured this attribute can be set to true to indicate that publishing should also occur
       * when the form contains invalid values. If this is enabled, then the publish payload will 
       * have an additional alfFormInvalid property, which will be set to true.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      autoSaveOnInvalid: false,
      
      /**
       * This can be configured with details of additional buttons to be included with the form.
       * Any button added will have the publishPayload set with the form value. 
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      widgetsAdditionalButtons: null,
      
      /**
       * If more than just "OK" and "Cancel" buttons are required then this can be configured to be 
       * an array of configurations for extra buttons to be displayed. The payload of these buttons will
       * always be augmented with the form values.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      additionalButtons: null,
      
      /**
       * When this is set to true the current URL hash fragment will be used to initialise the form value
       * and when the form is submitted the hash fragment will be updated with the form value. If you intend
       * to use hashing it is recommended that the [okButtonPublishTopic]{@link module:alfresco/forms/Form#okButtonPublishTopic}
       * does not directly result in submission of data, but rather submission of data is triggered by changes
       * to the hash.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      useHash: false,

      /**
       * When this is set to true the URL hash fragment will be updated when the form is published.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      setHash: false,
      
      /**
       * This attribute is used to indicate whether or not the form has completed setting up all of the controls it has been 
       * configured with.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      _formSetupComplete: false,

      /**
       * This function is called when [useHash]{@link module:alfresco/forms/Form#useHash} is set to true
       * and the OK button is clicked to publish the form data. It will take the value of the form and
       * use it to set a hash fragment.
       * 
       * @instance
       * @param {object} payload The form data to set
       */
      setHashFragment: function alfresco_forms_Form__setHashFragment(payload) {
         // Make sure to remove the alfTopic from the payload (this will always be assigned on publications
         // but is not actually part of the form data)...
         this.alfCleanFrameworkAttributes(payload, true);
         
         // Make sure that only the controls with names listed in hashVarsForUpdate are set on the URL hash...
         var updatedHash = {};
         this.payloadContainsUpdateableVar(payload, true, updatedHash);

         var currHash = hashUtils.getHash();
         lang.mixin(currHash, updatedHash);
         var hashString = ioQuery.objectToQuery(currHash);

         // Publish so that the NavigationService can set the hash fragment...
         this.alfPublish("ALF_NAVIGATE_TO_PAGE", {
            url: hashString,
            type: "HASH"
         }, true);
      },

      /**
       * Overrides the implementation from [_AlfHashMixin]{@link module:alfresco/documentlibrary/_AlfHashMixin}
       * which was written to publish Document Library specific topics. This version responds to the hash change
       * by setting the form value.
       * 
       * @instance
       * @param {object} payload The publication topic.
       */
      onHashChange: function alfresco_forms_Form__onHashChange(hashString) {
         if (this.useHash === true)
         {
            var currHash = ioQuery.queryToObject(hashString);
            var updatedFormValue = {};
            this.doHashVarUpdate(currHash, true, updatedFormValue);
            this.setValue(updatedFormValue);
         }
      },

      /**
       * Creates the buttons for the form. This can be overridden to change the buttons that are displayed.
       * 
       * @instance
       */
      createButtons: function alfresco_forms_Form__createButtons() {
         if (this.showOkButton === true && !this.autoSavePublishTopic)
         {
            var onButtonClass = this.okButtonClass ? this.okButtonClass : "";
            this.okButton = new AlfButton({
               pubSubScope: this.pubSubScope,
               label: this.message(this.okButtonLabel),
               additionalCssClasses: "confirmationButton " + onButtonClass,
               publishTopic: this.okButtonPublishTopic,
               publishPayload: this.okButtonPublishPayload,
               publishGlobal: this.okButtonPublishGlobal,
               iconClass: this.okButtonIconClass
            }, this.okButtonNode);

            // Handle any post-publish actions
            if (this.okButtonPublishTopic && lang.trim(this.okButtonPublishTopic))
            {
               this.alfSubscribe(this.okButtonPublishTopic, lang.hitch(this, this.onOkButtonPublish), this.okButtonPublishGlobal);
            }
            else if (this.useHash === true && this.setHash === true)
            {
               this.alfLog("warn", "A form is configured to use the browser hash fragment, but has no okButtonPublishTopic set", this);
            }
         }
         else
         {
            domConstruct.destroy(this.okButtonNode);
         }
         
         if (this.showCancelButton === true && !this.autoSavePublishTopic)
         {
            this.cancelButton = new AlfButton({
               pubSubScope: this.pubSubScope,
               label: this.message(this.cancelButtonLabel),
               additionalCssClasses: "cancelButton",
               publishTopic: this.cancelButtonPublishTopic,
               publishPayload: this.cancelButtonPublishPayload,
               publishGlobal: this.cancelButtonPublishGlobal,
               iconClass: this.cancelButtonIconClass
            }, this.cancelButtonNode);
         }
         else
         {
            domConstruct.destroy(this.cancelButtonNode);
         }
         
         // If there are any other additional buttons to add, then process them here...
         if (this.widgetsAdditionalButtons !== null)
         {
            this.additionalButtons = [];
            this.processWidgets(this.widgetsAdditionalButtons, this.buttonsNode, "BUTTONS");
         }
         else
         {
            this.additionalButtons = registry.findWidgets(this.buttonsNode);
         }

         // Iterate over all the buttons and make a copy of the original button payload (before any value is
         // applied to it). This is required since it is possible for values to be removed from the payload
         // so the original payload needs to be used rather than the payload as it was after the previous update
         // (e.g. a field has become disabled since the last payload update and is configured to not have its value
         // included when it is hidden, therefore we need to ensure its previous value is NOT included in the payload)
         array.forEach(this.additionalButtons, function(button) {
            if (button.publishPayload && button.updatePayload)
            {
               button._alfOriginalButtonPayload = lang.clone(button.publishPayload);
            }
         });
      },

      /**
       * Execute a form publish as defined by the OK button.
       *
       * @instance
       * @since 1.0.49
       */
      submitOkButton: function alfresco_forms_Form__submitOkButton() {
         if(!this.okButton) 
         {
            this.alfLog("warn", "Cannot submit OK button as button not defined");

            // See AKU-1116
            // If no buttons can be found then the likely scenario is that we are within
            // a form dialog. Therefore emit a custom event requesting that the form be
            // submitted...
            on.emit(this.domNode, "onFormSubmit", {
               bubbles: true,
               cancelable: true
            });
         }
         else 
         {
            this.okButton.activate();
         }
      },
      
      /**
       * Makes a call to the [validate]{@link module:alfresco/forms/Form#validate} function to check the initial
       * state of the form.
       * 
       * @instance
       */
      allWidgetsProcessed: function alfresco_forms_Form__allWidgetsProcessed(widgets, processWidgetsId) {
         // If additional button configuration has been processed, then get a reference to ALL the buttons...
         if (processWidgetsId === "BUTTONS")
         {
            this.additionalButtons = registry.findWidgets(this.buttonsNode);
         }
         else
         {
            // Called only when processing the form controls, not when there are additional buttons...
            if (this.useHash)
            {
               var currHash = hashUtils.getHash();
               var updatedFormValue = {};
               this.doHashVarUpdate(currHash, true, updatedFormValue);
               this.setValue(updatedFormValue, true);
            }
            else
            {
               this.setValue(this.value || {}, true);
            }
            
            // Create an object that we're going to use to check off all the form controls as they report their
            // initial value...
            var rollCallObject = {
               count: widgets.length
            };
            
            // Once all the controls have been added to the form we're going to ask them each to
            // publish their initial value. However, in order to ensure that we don't publish before
            // their value has completely initialised (e.g. if a control with options has not been set
            // an initial value it may want to set the first option it has as the current value) which
            // may only complete after the widget has been created but BEFORE it has been placed into
            // the document. Value initialization occurs after being added to the document to avoid
            // potential XSS attacks.
            array.forEach(widgets, function(widget) {
               if (widget.publishValue && typeof widget.publishValue === "function")
               {
                  // Create a Deferred object and pass it to the widget, this *should* (if the function
                  // has not been foolishly overridden!) detect the Deferred object and only resolve it
                  // when value initialization is complete...
                  var deferred = new Deferred();
                  deferred.then(lang.hitch(widget, widget.publishValue)).then(lang.hitch(this, this.onRollCall, rollCallObject));
                  widget.publishValue(deferred);
               }
            }, this);
         }
      },

      /**
       * This function is used to register the successful setup of all the form controls. As each form control is added
       * to the page it will publish its value and after the value is published this function will "check it off" from 
       * an overall count of all the expected controls. This is done as a final check so that we can be absolutely sure
       * that everything is complete before we allow validation or auto-saving to commence.
       *
       * @instance
       * @param  {object} rollCallObject An object containing a simple count of all the form controls yet to register themselves
       */
      onRollCall: function alfresco_forms_Form__onRollCall(rollCallObject) {
         rollCallObject.count--;
         if (rollCallObject.count === 0)
         {
            this.validate();

            // If requested publish a topic now that the form has been initially processed
            if (this.validFormValuesPublishOnInit) {
               this.publishValidValue();
            }
            this._formSetupComplete = true;

            // If configured, focus the first field in the form
            if (this.firstFieldFocusOnLoad) {
               // Use setTimeout to allow other synchronous processes to complete first, as this
               // has a much greater chance of successfully focusing on the field
               setTimeout(lang.hitch(this, this.focus));
            }
         }
      },
      
      /**
       * Update all the button payloads with the supplied values
       * @instance
       */
      updateButtonPayloads: function alfresco_forms_Form__updateButtonPayloads(values) {
         array.forEach(this.additionalButtons, function(button) {
            if (!button.updatePayload)
            {
               // No action required. Leave the payload as is.
            }
            else if (button._alfOriginalButtonPayload)
            {
               var payload = {};
               lang.mixin(payload, button._alfOriginalButtonPayload, values);
               button.publishPayload = payload;
            }
            else
            {
               button.publishPayload = values;
            }
         });
      },

      /**
       * Focuses on the first field in the form.
       *
       * @instance
       */
      focus: function alfresco_forms_Form__focus() {
         if (this._form)
         {
            var children = this._form.getChildren();
            if (children.length > 0 && children[0].wrappedWidget && typeof children[0].focus === "function")
            {
               children[0].focus();
            }
         }
      },

      /**
       * @instance
       * @return {object}
       */
      getValue: function alfresco_forms_Form__getValue() {
         var values = {};
         if (this._form)
         {
            array.forEach(this._form.getChildren(), function(entry) {
               if (typeof entry.addFormControlValue === "function")
               {
                  entry.addFormControlValue(values);
               }
            });
         }
         this.alfLog("log", "Returning form values: ", values);
         this.updateButtonPayloads(values);
         return values;
      },
      
      /**
       * @instance
       * @param {object} values The values to set
       * @param {boolean} initialization Indicates whether this call is part of the initialization of the containing form
       */
      setValue: function alfresco_forms_Form__setValue(values, initialization) {
         this.alfLog("log", "Setting form values: ", values);
         if (values && values instanceof Object)
         {
            if (this._form)
            {
               array.forEach(this._form.getChildren(), function(entry) {
                  if (typeof entry.updateFormControlValue === "function")
                  {
                     entry.updateFormControlValue(values, initialization);
                  }
                  if (typeof entry.publishValue === "function")
                  {
                     entry.publishValue();
                  }
               });
            }
            this.validate();

            this.updateButtonPayloads(this.getValue());
         }
      },
      
      /**
       * @instance
       * @returns {boolean}
       */
      validate: function alfresco_forms_Form__validate() {
         this.alfLog("log", "Validating form", this._form);
         array.forEach(this._form.getChildren(), function(widget) {
            if (typeof widget.validateFormControlValue === "function")
            {
               widget.validateFormControlValue();
            }
         });

         // The form is valid if there are no invalid form controls...
         return this.invalidFormControls.length === 0;
      },

      /**
       * @instance
       */
      publishValidValue: function alfresco_forms_Form__publishValidValue() {
         // The form is valid if there are no invalid form controls...
         if (this.invalidFormControls.length === 0 && this.validFormValuesPublishTopic)
         {
            var payload = this.validFormValuesPublishPayload;
            if (!payload)
            {
               payload = this.getValue();
            }
            this.alfPublish(this.validFormValuesPublishTopic, payload, this.validFormValuesPublishGlobal);
         }
      },

      /**
       * This function is used to forward on options requests from controls contained within the form. It
       * can be used by setting the "publishTopic" in the "optionsConfig" to be
       * [GET_FORM_VALUE_DEPENDENT_OPTIONS]{@link module:alfresco/core/topics#GET_FORM_VALUE_DEPENDENT_OPTIONS}.
       * The "publishPayload" in the "optionsConfig" should contain a "publishTopic" attribute that the 
       * request should ultimately be forwarded on to. The reason to use this topic is that the forwarded
       * payload will be updated to include the current form value. This makes it possible for options to
       * be generated that are dependant upon changing form values.
       * 
       * @instance
       * @param  {object} payload The payload requesting the options.
       * @since 1.0.39
       */
      getFormValueDependantOptions: function alfresco_forms_Form__getFormValueDependantOptions(payload) {
         if (payload.publishTopic && payload.publishTopic !== topics.GET_FORM_VALUE_DEPENDENT_OPTIONS)
         {
            var currentValue = this.getValue();
            
            var clonedPayload = lang.clone(payload);
            if (clonedPayload.publishPayloadModifiers)
            {
               // Set the current value in order to support the "processInstanceTokens" modifier... 
               this.value = currentValue;
               this.processObject(clonedPayload.publishPayloadModifiers, clonedPayload);
               delete clonedPayload.publishPayloadModifiers;
            }

            // Mix the current value into the payload...
            lang.mixin(clonedPayload, currentValue);
            this.alfServicePublish(payload.publishTopic, clonedPayload);
         }
      },

      /**
       * If an [okButtonPublishTopic]{@link module:alfresco/forms/Form#okButtonPublishTopic} has been provided
       * then this function will be run after it has been published.
       *
       * @instance
       * @param {object} payload The published payload
       * @since 1.0.44
       */
      onOkButtonPublish: function alfresco_forms_Form__onOkButtonPublish(payload) {

         // Set the hash fragment with the form contents...
         if (this.useHash === true && this.setHash === true) {
            this.setHashFragment(payload);
         }

         // Change the button label if auto-revert or disable-on-publish are set
         if (this.okButtonPublishRevertSecs > 0 || this.okButtonDisableOnPublish) {
            this.okButton.set("label", this.message(this.okButtonPublishedLabel));
         }

         // If we should disable on publish then do so
         if (this.okButtonDisableOnPublish) {
            this.okButton.set("disabled", true);
         }

         // Unless there are enablement topics, automatically revert changes to the OK button
         if ((!this.okButtonEnablementTopics || !this.okButtonEnablementTopics.length) && this.okButtonPublishRevertSecs > 0) {
            setTimeout(lang.hitch(this, this.reenableOkButton), this.okButtonPublishRevertSecs * 1000);
         }
      },

      /**
       * Setup the subscription(s) to re-enable the OK button after it's been disabled on submission.
       *
       * @instance
       * @param {string|module:alfresco/util/objectUtils#Rules} topic The raw topic name to subscribe to, or a Rules object with an additional
       *                                                              topic attribute that defines the name of the topic to subscribe to
       * @param {string|string[]} [is] The possible value/values that will re-enable the OK button if matching the specified attribute
       * @param {string|string[]} [isNot] The disallowed value/values that will re-enable the OK button if the attribute does not match it/them
       */
      setupOkButtonEnablementSubscription: function alfresco_forms_Form__setupOkButtonEnablementSubscription(topic) {
         var topicName,
            rulesObj;
         if (typeof topic === "string") {
            topicName = topic;
            rulesObj = {};
         } else {
            topicName = topic.topic;
            rulesObj = lang.clone(topic);
            delete rulesObj.topic;
         }
         this.alfConditionalSubscribe(topicName, rulesObj, lang.hitch(this, this.reenableOkButton));
      },

      /**
       * Re-enable the OK button after it's been [disabled by publishing]{@link module:alfresco/forms/Form#okButtonDisableOnPublish}.
       * Calls the [onValidField]{@link module:alfresco/forms/Form#onValidField} method to ensure that validation rules are maintained.
       *
       * @instance
       * @since 1.0.44
       */
      reenableOkButton: function alfresco_forms_Form__reenableOkButton() {
         this.okButton.set("label", this.message(this.okButtonLabel));
         this.onValidField();
      }
   });
});
