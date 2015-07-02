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
 *           }
 *        ]
 *     }
 *  }
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
 *           }
 *        ]
 *     }
 *  }
 * 
 * @module alfresco/forms/Form
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @mixes module:alfresco/documentlibrary/_AlfHashMixin
 * @pageSafe
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/form/Form",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/documentlibrary/_AlfHashMixin",
        "dojo/text!./templates/Form.html",
        "dojo/io-query",
        "dojo/hash",
        "dojo/_base/lang",
        "alfresco/buttons/AlfButton",
        "dojo/_base/array",
        "dijit/registry",
        "dojo/Deferred",
        "dojo/dom-construct"], 
        function(declare, _Widget, _Templated, Form, AlfCore, CoreWidgetProcessing, _AlfHashMixin, template, 
                 ioQuery, hash, lang, AlfButton, array, registry, Deferred, domConstruct) {
   
   return declare([_Widget, _Templated, AlfCore, CoreWidgetProcessing, _AlfHashMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfDialog.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Form.properties"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * @instance
       * @type {object}
       * @default null
       */
      _form: null,
      
      /**
       * @instance
       * @type {object[]}
       * @default null
       */
      widgets: null,
      
      /**
       * The URL that the form will be posted to
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      postUrl: "",
      
      /**
       * @instance
       * @type {boolean}
       * @default false
       */
      convertFormToJsonString: false,
      
      /**
       * This will be instantiated as an array and used to keep track of any controls that report themselves as being
       * in an invalid state. The "OK" button for submitting the form should only be enabled when this list is empty.
       * 
       * @instance
       * @type {object[]}
       * @default null
       */
      invalidFormControls: null,
      
      /**
       * A reference to the "OK" button for the form.
       * TODO: It should be possible to configure alternative labels for the button
       * 
       * @instance
       * @type {object}
       * @default null
       */
      okButton: null,
      
      /**
       * A reference to the "Cancel" button for the form.
       * TODO: It should be possible to configure alternative labels for the button.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      cancelButton: null,
      
      /**
       * Indicates that the a new pubSubScope should be generated for this widget so that it's
       * form controls will be scoped to only communicate with this instance and not "pollute"
       * any other forms that may also be on the page.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      scopeFormControls: true,
      
      /**
       * Indicates whether or not to create buttons for this form.
       *
       * @instance
       * @type {boolean}
       * @default true
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
       * @default null
       */
      setValueTopic: null,

      /**
       * This indicates whether any [setValueTopic]{@link module:alfresco/forms/Form#setValueTopic} subscription
       * should be made globally.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      setValueTopicGlobalScope: true,

      /**
       * This indicates whether any [setValueTopic]{@link module:alfresco/forms/Form#setValueTopic} subscription
       * should be made to the parent scope.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      setValueTopicParentScope: false,

      /**
       * Indicates that any validation errors that are present on the fields contained within the form will be 
       * shown immediately when the form is displayed. Validation will still occur if this is configured to be
       * false (so it will not be possible to submit an invalid form).
       * 
       * @instance
       * @type {boolean}
       * @default true
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
       * @default true
       */
      waitForPageWidgets: true,

      /**
       * @instance
       */
      postCreate: function alfresco_forms_Form__postCreate() {
         // A form is configured to auto-save updates we want to be sure that it doesn't start saving until the 
         // use has actually made any changes. Therefore we want to wait until all the widgets are properly setup
         // before we allow autosaving to commence. However, when the form is included directly on a page (e.g. it is
         // not part of a dialog, etc) then we want to wait until the page has completed being setup, as this publications
         // are queued up until this occurs.
         if (this.waitForPageWidgets === true)
         {
            this.pageWidgetsReadySubcription = this.alfSubscribe("ALF_WIDGETS_READY", lang.hitch(this, function() {
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
         
         // If requested in the configuration, the value of a form can be set via a publication,
         // however to avoid generating subscriptions unnecessarily the subscription is only
         // set if explicitly requested. Global scope is intentionally used for the subscription
         if (this.setValueTopic)
         {
            this.alfSubscribe(this.setValueTopic, lang.hitch(this, this.setValue), this.setValueTopicGlobalScope, this.setValueTopicParentScope);
         }

         // Generate a new pubSubScope if required...
         if (this.scopeFormControls === true && this.pubSubScope === "")
         {
            this.pubSubScope = this.generateUuid();
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

         // Add the widgets to the form...
         // The widgets should automatically inherit the pubSubScope from the form to scope communication
         // to this widget. However, this widget will need to be assigned with a pubSubScope... 
         if (this.widgets)
         {
            array.forEach(this.widgets, function(widget) {
               if (widget && widget.config)
               {
                  widget.config.showValidationErrorsImmediately = this.showValidationErrorsImmediately;
               }
            }, this);

            this.processWidgets(this.widgets, this._form.domNode);
         }
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
            }, this.getValue());
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
            if (button._alfOriginalButtonPayload)
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
       * @default null
       */
      validFormValuesPublishTopic: null,

      /**
       * The payload of validFormValuesPublishTopic. If left as null the form's value will be dispatched.
       *
       * @instance
       * @type {object}
       * @default null
       */
      validFormValuesPublishPayload: null,

      /**
       * Set to true if a the validFormValuesPublishTopic shall be globally published.
       *
       * @instance
       * @type {string}
       * @default false
       */
      validFormValuesPublishGlobal: false,

      /**
       * If set to true the form will fire an event when it has been processed (as long as all values are valid)
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      validFormValuesPublishOnInit: false,

      /**
       * Indicates whether or not the "OK" button should be displayed or not.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      showOkButton: true,
      
      /**
       * Indicates whether or not the "Cancel" button should be displayed or not.
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      showCancelButton: true,
      
      /**
       * The label that will be used for the "OK" button. This value can either be an explicit
       * localised value or an properties key that will be used to retrieve a localised value.
       * 
       * @instance
       * @type {string}
       * @default "form.button.ok.label"
       */
      okButtonLabel: "form.button.ok.label",
      
      /**
       * @instance 
       * @type {string}
       * @default null
       */
      okButtonPublishTopic: null,
      
      /**
       * @instance
       * @type {object}
       * @default null
       */
      okButtonPublishPayload: null,
      
      /**
       * @instance 
       * @type {string}
       * @default null
       */
      okButtonPublishGlobal: null,

      /**
       * The label that will be used for the "Cancel" button. This value can either be an explicit
       * localised value or an properties key that will be used to retrieve a localised value.
       *
       * @instance
       * @type {string}
       * @default "form.button.cancel.label"
       */
      cancelButtonLabel: "form.button.cancel.label",
      
      /**
       * @instance
       * @type {string}
       * @default null
       */
      cancelButtonPublishTopic: null,
      
      /**
       * @instance
       * @type {object}
       * @default null
       */
      cancelButtonPublishPayload: null,

      /**
       * @instance
       * @type {object}
       * @default null
       */
      cancelButtonPublishGlobal: null,
      
      /**
       * If this is not null, then the form will auto-publish on this topic whenever a form's
       * values change. This setting overrides and will remove the OK and Cancel buttons. If the form
       * is being dynamically created after page load has completed (e.g. if the form is being displayed in 
       * a dialog for example) then in order for auto-saving to occur it will also be necessary to configure 
       * the [waitForPageWidgets]{@link module:alfresco/forms/Form#waitForPageWidgets} attribute to be false.
       * 
       * @instance 
       * @type {string}
       * @default null
       */
      autoSavePublishTopic: null,
      
      /**
       * The payload to publish (will be the form's values if not specified)
       * 
       * @instance
       * @type {object}
       * @default null
       */
      autoSavePublishPayload: null,
      
      /**
       * @instance 
       * @type {string}
       * @default null
       */
      autoSavePublishGlobal: null,

      /**
       * Whether, when autoSavePublish is enabled (i.e. autoSavePublishTopic is not null),
       * to also publish when the form contains invalid values. If this is enabled, then
       * the publish payload will have an additional alfFormInvalid property, which will
       * be set to true.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      autoSaveOnInvalid: false,
      
      /**
       * This can be configured with details of additional buttons to be included with the form.
       * Any button added will have the publishPayload set with the form value. 
       * 
       * @instance
       * @type {object[]}
       * @default null
       */
      widgetsAdditionalButtons: null,
      
      /**
       * If more than just "OK" and "Cancel" buttons are required then this can be configured to be 
       * an array of configurations for extra buttons to be displayed. The payload of these buttons will
       * always be augmented with the form values.
       *
       * @instance
       * @type {object[]}
       * @default null
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
       * @default false
       */
      useHash: false,

      /**
       * When this is set to true the URL hash fragment will be updated when the form is published.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      setHash: false,
      
      /**
       * This attribute is used to indicate whether or not the form has completed setting up all of the controls it has been 
       * configured with.
       *
       * @instance
       * @type {boolean}
       * @default false
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
         delete payload.alfTopic;
         delete payload.alfPublishScope;
         delete payload.alfCallerName;
         
         // Make sure that only the controls with names listed in hashVarsForUpdate are set on the URL hash...
         var updatedHash = {};
         this.payloadContainsUpdateableVar(payload, true, updatedHash);

         var currHash =  ioQuery.queryToObject(hash());
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

            // If useHash is set to true then set up a subcription on the publish topic for the OK button which will
            // set the hash fragment with the form contents...
            if (this.useHash === true && this.setHash === true)
            {
               if (this.okButtonPublishTopic &&
                   lang.trim(this.okButtonPublishTopic) !== "")
               {
                  this.alfSubscribe(this.okButtonPublishTopic, lang.hitch(this, this.setHashFragment), this.okButtonPublishGlobal);
               }
               else
               {
                  this.alfLog("warn", "A form is configured to use the browser hash fragment, but has no okButtonPublishTopic set", this);
               }
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
            this.__creatingButtons = true;
            this.processWidgets(this.widgetsAdditionalButtons, this.buttonsNode);
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
            if (button.publishPayload)
            {
               button._alfOriginalButtonPayload = lang.clone(button.publishPayload);
            }
         });
      },
      
      /**
       * Makes a call to the [validate]{@link module:alfresco/forms/Form#validate} function to check the initial
       * state of the form.
       * 
       * @instance
       */
      allWidgetsProcessed: function alfresco_forms_Form__allWidgetsProcessed(widgets) {
         // If additional button configuration has been processed, then get a reference to ALL the buttons...
         if (this.__creatingButtons === true)
         {
            this.additionalButtons = registry.findWidgets(this.buttonsNode);
            this.__creatingButtons = false;
         }
         else
         {
            // Called only when processing the form controls, not when there are additional buttons...
            if (this.useHash)
            {
               var currHash = ioQuery.queryToObject(hash());
               var updatedFormValue = {};
               this.doHashVarUpdate(currHash, true, updatedFormValue);
               this.setValue(updatedFormValue);
            }
            else
            {
               this.setValue(this.value);
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
         }
      },
      
      /**
       * Update all the button payloads with the supplied values
       * @instance
       */
      updateButtonPayloads: function alfresco_forms_Form__updateButtonPayloads(values) {
         array.forEach(this.additionalButtons, function(button) {
            if (button._alfOriginalButtonPayload)
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
            if (children.length > 0 && children[0].wrappedWidget && typeof children[0].wrappedWidget.focus === "function")
            {
               children[0].wrappedWidget.focus();
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
       */
      setValue: function alfresco_forms_Form__setValue(values) {
         this.alfLog("log", "Setting form values: ", values);
         if (values && values instanceof Object)
         {
            if (this._form)
            {
               array.forEach(this._form.getChildren(), function(entry) {
                  if (typeof entry.updateFormControlValue === "function")
                  {
                     entry.updateFormControlValue(values);
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
         array.forEach(this._processedWidgets, function(widget) {
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
      }
   });
});