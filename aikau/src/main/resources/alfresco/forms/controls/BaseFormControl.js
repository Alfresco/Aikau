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
 * <p>This should be extended by all form controls in order to provide a consistent look and feel. It wraps
 * a standard widget (which can be provided by JavaScript toolkits other than Dojo) or multiple widgets
 * and creates the name, description and units labels are appropriate. It also provides the capability for
 * form controls to communicate with each other and dynamically update their appearance and behaviour 
 * through configured rules (e.g. to allow progressive disclosure, etc through configuration).</p>
 *
 * @example <caption>Example configuration for a required TextBox control:</caption>
 * {
 *     name: "alfresco/forms/controls/TextBox",
 *     config: {
 *        fieldId: "DISTANCE",
 *        label: "Distance",
 *        description: "Enter the distance travelled",
 *        unitsLabel: "miles",
 *        name: "distance",
 *        value: "0",
 *        requirementConfig: {
 *           initialValue: true
 *        }
 *     }
 * }
 * 
 * @example <caption>Example configuration for Select control:</caption>
 * {
 *     name: "alfresco/forms/controls/Select",
 *     config: {
 *        fieldId: "COLOUR",
 *        label: "Colour",
 *        description: "Select a colour from the list",
 *        name: "colour",
 *        value: "RED",
 *        optionsConfig: {
 *           fixed: [
 *              { label: "Red", value: "RED" },
 *              { label: "Green", value: "GREEN" },
 *              { label: "Blue", value: "BLUE" }
 *           ]
 *        }
 *     }
 * }
 *
 * @example <caption>Example configuration for a hidden TextBox that can be dynamically revealed:</caption>
 * {
 *     name: "alfresco/forms/controls/TextBox",
 *     config: {
 *        fieldId: "AGE",
 *        label: "How old are you?",
 *        description: "Enter the distance travelled",
 *        placeHolder: "Age...",
 *        unitsLabel: "years",
 *        name: "age",
 *        visibilityConfig: {
 *           initialValue: false,
 *           rules: [
 *              {
 *                 targetId": "SHOW_AGE",
 *                 is: ["true"]
 *              }
 *           ]
 *        }
 *     }
 * }
 * 
 * @module alfresco/forms/controls/BaseFormControl
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dojo/_FocusMixin
 * @mixes module:alfresco/forms/controls/FormControlValidationMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 * @Richard Smith
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_FocusMixin",
        "alfresco/core/Core",
        "alfresco/forms/controls/FormControlValidationMixin",
        "dojo/text!./templates/BaseFormControl.html",
        "alfresco/core/ObjectTypeUtils",
        "alfresco/core/ArrayUtils",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-style",
        "dojo/dom-class",
        "dijit/Tooltip",
        "dojo/dom-attr",
        "dojo/query",
        "dojo/dom-construct",
        "dojo/Deferred",
        "jquery"], 
        function(declare, _Widget, _Templated, _FocusMixin, AlfCore, FormControlValidationMixin, template, ObjectTypeUtils, 
                 arrayUtils, lang, array, domStyle, domClass, Tooltip, domAttr, query, domConstruct, Deferred, $) {

   return declare([_Widget, _Templated, _FocusMixin, AlfCore, FormControlValidationMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/BaseFormControl.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/BaseFormControl.properties"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * This will be set to the form control that the user will actually interact with (e.g. a text box, check box, etc).
       * 
       * @instance
       * @type {object}
       * @default null
       */
      wrappedWidget: null,

      /**
       * A scope for prefixing all publication and subscription topics. This is so that form controls can be used
       * and not interfere incorrectly with each other.
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      pubSubScope: "",
      
      /**
       * The widget to instantiate.
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      type: "",

      /**
       * This used to uniquely identify the form field. If not explicitly defined in the instantiation
       * configuration then a new UUID will be generated for it. It is important to have an id attribute
       * that is NOT used as the widgetId (to allow duplications - which the dijit/registry would otherwise
       * reject) and to have a value that can be used as a reference that will be unaffected by changes
       * (e.g. when configuring a form field dynamically with the application).
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      fieldId: "",
      
      /**
       * The label identifying the data to provide. The value supplied will be checked against the available
       * scoped NLS resources to attempt to translate message keys into localized values.
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      label: "",
      
      /**
       * A label for showing units measurements (e.g. "milliseconds", "MB", etc). The value supplied will be 
       * checked against the available scoped NLS resources to attempt to translate message keys into localized values.
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      unitsLabel: "",
      
      /**
       * A description of the field. This will appear in a tooltip by default. The value supplied will be 
       * checked against the available scoped NLS resources to attempt to translate message keys into localized values.
       * 
       * @instance
       * @type {string}
       * @default ""
       */
      description: "",
      
      /**
       * The value to submit as the name for the data captured by this field when the form is submitted.
       * 
       * @instance
       * @type {string}
       */
      name: "", 

      /**
       * The value to submit as the value of the field when the form is submitted.
       *  
       * @instance
       * @type {string}
       * @default ""
       */
      value: "",
      
      /**
       * The list of static options (TODO: We need to provide support for dynamic options via XHR or callback).
       * 
       * @instance
       * @type {array}
       * @default null
       */
      options: null,
      
      /**
       * By default if a field is hidden or disabled then it's value should not be posted. This allows multiple controls
       * representing the same data to be used together with visibility/disablement rules so that only one control's value]
       * is submitted. This variable has no direct effect on this widget but can be used by other widgets such as the 
       * [form]{@link module:alfresco/forms/Form}. Intentionally hidden fields should override the default value so 
       * that they are always submitted.
       *
       * @instance
       * @type {boolean}
       * @default true
       */
      postWhenHiddenOrDisabled: true,

      /**
       * By default all fields will have their value when a parent [form]{@link module:alfresco/forms/Form} has its value set
       * but in certain cases it may be desirable for fields to not have a data update when they are hidden or disabled. This
       * will be the case when multiple fields are being used to represent the same data but through progressive disclosure
       * only one field is displayed at a time. By overriding this variable a field can request not to have it's value updated
       * when it is hidden or disabled.
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      noValueUpdateWhenHiddenOrDisabled: false,
      
      /**
       * Sometimes multiple form controls might be used to represent a single post parameter. For example a set of radio
       * buttons might present a set of options for a parameter where the last radio button progressively reveals a 
       * text box for entering a custom value. In that case the radio buttons form control is superceded by the revealed
       * text box. By setting this attribute to an array containing the values that prevent the form control value being
       * included in the form post it is possible to define that behaviour
       *
       * @instance
       * @type {array}
       * @default null
       */
      noPostWhenValueIs: null,

      /**
       * The default visibility status is always true (this can be overridden by extending controls).
       * 
       * @instance
       * @type {boolean}
       * @default true
       */
      _visible: true,
      
      /**
       * Used to toggle visibility of the field.
       * 
       * @instance
       * @param {boolean} status The boolean value to change the visibility state to.
       */
      alfVisible: function alfresco_forms_controls_BaseFormControl__alfVisible(status) {
         this.alfLog("log", "Change visibility status for '" + this.fieldId + "' to: " + status);
         this._visible = status;
         if (this.containerNode)
         {
            var display = status ? "" : "none";
            domStyle.set(this.containerNode, {
               display: display
            });
         }
      },
      
      /**
       * The default requirement status is always false (this can be overridden by extending controls).
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      _required: false,
      
      /**
       * Used to toggle the requirement state of the field.
       * 
       * @instance
       * @param {boolean} status The boolean value to change the requirement state to
       */
      alfRequired: function alfresco_forms_controls_BaseFormControl__alfRequired(status) {
         this.alfLog("log", "Change requirement status for '" + this.fieldId + "' to: " + status, {});
         this._required = status;
         if (this._requirementIndicator)
         {
            if (this._required === true)
            {
               domClass.add(this._requirementIndicator, "required");
            }
            else
            {
               domClass.remove(this._requirementIndicator, "required");
            }
            
            // When requirement state is changed we need to re-validate the widget
            this.validate();
         }
      },
      
      /**
       * The default disabled status is always false  (this can be overridden by extending controls).
       * 
       * @instance
       * @type {boolean}
       */
      _disabled: false,
      
      /**
       * Controls the disability status of the field.
       * 
       * @instance
       * @param {boolean} status The boolean status to set the disablity state of the field to.
       */
      alfDisabled: function alfresco_forms_controls_BaseFormControl__alfDisabled(status) {
         this.alfLog("log", "Change disablement status for '" + this.fieldId + "' to: " + status);
         this._disabled = status;
         if (this.wrappedWidget && typeof this.wrappedWidget.set === "function")
         {
            this.wrappedWidget.set("disabled", status);
         }
      },
      
      /**
       * Defines the visibility behaviour of the widget. It is possible for the widget to dynamically be hidden
       * or displayed based on the value of one or more other widgets. See [processConfig]{@link module:alfresco/forms/controls/BaseFormControl#processConfig}
       * for the structure to use when configuring the rules</p>
       *
       * @instance
       * @type {object}
       * @default
       */
      visibilityConfig: null,
      
      /**
       * Defines the visibility behaviour of the widget. It is possible for the widget to dynamically be required
       * to have a value provided based on the value of one or more other widgets. See [processConfig]{@link module:alfresco/forms/controls/BaseFormControl#processConfig}
       * for the structure to use when configuring the rules</p>
       *
       * @instance
       * @type {object}
       * @default
       */
      requirementConfig: null,
      
      /**
       * Defines the visibility behaviour of the widget. It is possible for the widget to dynamically be disabled
       * or enabled based on the value of one or more other widgets. See [processConfig]{@link module:alfresco/forms/controls/BaseFormControl#processConfig}
       * for the structure to use when configuring the rules</p>
       *
       * @instance
       * @type {object}
       * @default
       */
      disablementConfig: null,
      
      /**
       * Defines an array of rules for auto-setting the value of the widget. Each element in the array is configured
       * in the same way as the [visibilityConfig]{@link module:alfresco/forms/controls/BaseFormControl#visibilityConfig},
       * [requirementConfig]{@link module:alfresco/forms/controls/BaseFormControl#requirementConfig} or 
       * [disablementConfig]{@link module:alfresco/forms/controls/BaseFormControl#disablementConfig} in that it should
       * declare a "targetId" attribute (that maps to the "fieldId" of another widget in the same form) and
       * either a "is" or "isNot" array of values of that field to evaluate against. In addition it also needs to 
       * set "rulePassValue" and "ruleFailValue" attributes that are the values that will be set on successful or
       * unsuccessful evaluation of the rule.
       *
       * @instance
       * @type {array}
       * @default null
       */
      autoSetConfig: null,

      /**
       * @instance
       */
      constructor: function alfresco_forms_controls_BaseFormControl__constructor(args) {
         declare.safeMixin(this, args);
         
         if (!this.fieldId)
         {
            this.fieldId = this.generateUuid();
         }
         
         // We want to defer value assignment until the widget has been placed into the document, so 
         // we set this flag to indicate that value assignment will be deferred and then create an array
         // to capture all the deferred values...
         this.deferValueAssigment = true;
         this.deferredValueAssignments = [];

         // Setup the rules for controlling visibility, requirement and disablement...
         // NOTE: The reason for the "alf_" prefix is that we need to make sure that the functions cannot corrupt attribute
         //       accessors functionality. This is particularly relevant to the "alfDisabled". Originally a function called
         //       "disabled" was created and this caused focus events to occur inadvertently.
         this.processConfig("alfVisible", this.visibilityConfig);
         this.processConfig("alfRequired", this.requirementConfig);
         this.processConfig("alfDisabled", this.disablementConfig);

         // Iterate over the autoSetConfig rules...
         array.forEach(this.autoSetConfig, lang.hitch(this, this.processAutoSetConfiguration));

         // Setup the options handling...
         this.processOptionsConfig(this.optionsConfig);
         
         if (this.validationConfig && typeof this.validationConfig.regex === "string")
         {
            this.validationConfig.regExObj = new RegExp(this.validationConfig.regex);
         }
      },

      /**
       * Called for each entry in the [autoSetConfig]{@link module:alfresco/forms/controls/BaseFormControl#autoSetConfig}
       * array. The [autoSetValue]{@link module:alfresco/forms/controls/BaseFormControl#autoSetValue}
       * function will be passed each time the rules are evaluated with the evaluation result and the 
       * pass and fail evaluation values to set.
       *
       * @instance
       * @param {object} config The configuration for the current autoset value
       * @param {number} index The index of the configuration in the original array
       */
      processAutoSetConfiguration: function alfresco_forms_controls_BaseFormControl__processAutoSetConfiguration(config, index) {
         if (config.rulePassValue || config.ruleFailValue)
         {
            var instanceVar = "alfAutoSet___" + index;
            this[instanceVar] = lang.hitch(this, this.autoSetValue, config.rulePassValue, config.ruleFailValue);

            // Process the configuration...
            this.processConfig(instanceVar, config);
         }
         else
         {
            this.alfLog("warn", "An autoset configuration element was provided without both 'rulePassValue' and 'ruleFailValue' attribute", config, this);
         }
      },

      /**
       * This function is called whenever an autoset configuration rules array is evaluated. It
       * sets the widget value depending upon whether or not the rule evaluated successfully or not.
       *
       * @instance
       * @param {object} passValue The value to set if hasPassedRule is true
       * @param {object} failValue The value to set if hasPassedRule is false
       * @param {boolean} hasPassedRule Indicated whether or not evaluation of the rules were successful
       */
      autoSetValue: function alfresco_forms_controls_BaseFormControl__autoSetValue(passValue, failValue, hasPassedRule) {
         if (hasPassedRule === true)
         {
            this.setValue(passValue);
         }
         else
         {
            this.setValue(failValue);
         }
      },
      
      /**
       * <p>Processes the configuration for defining options and their update behaviour. This configuration is different to
       * the visibility/requirement/disablement rules so needs to be handled separately. The configuration can be defined
       * in the following structure:<p>
       * <p><pre>"optionsConfig": {
       *    "changesTo": [{
       *       "targetId": "someId",
       *    }],
       *    "updateTopics": [
       *       {
       *          "topic": "someTopic",
       *          "global": true
       *       }
       *    ],
       *    "publishTopic": "ALF_GET_FORM_CONTROL_OPTIONS",
       *    "publishPayload": {
       *       "url": AlfConstants.PROXY_URI + "api/groups",
       *       "itemsAttribute": "data",
       *       "labelAttribute": "displayName",
       *       "valueAttribute": "fullName"
       *    },
       *    "callback": "functionName",
       *    "fixed": [
       *       { "label": "Option1", "value": "Value1"},
       *       { "label": "Option2", "value": "Value2"}
       *    ]
       *  }</pre></p>
       *  <p>The precendence for setting options is as follows:<ul>
       *  <li>requestTopic</li>
       *  <li>callback</li>
       *  <li>fixed</li>
       *  </ul>e.g. if a "requestTopic" is provided then any "fixed" options will be ignored.</p>
       *  
       * @instance
       * @param {object} config
       */
      processOptionsConfig: function alfresco_forms_controls_BaseFormControl__processOptionsConfig(config) {
         if (config)
         {
            // Create update subscriptions based on the requested changes to other fields in the form...
            // We're going to do some helpful checking of the configuration to aid development rather
            // than just ignoring invalid configuration...
            var changesTo = lang.getObject("changesTo", false, config);
            if (changesTo)
            {
               if (ObjectTypeUtils.isArray(changesTo))
               {
                  // We're using an additional topic prefix here which is the pattern used for publications
                  // within the form...
                  // TODO: Make the string an instance variable?
                  array.forEach(config.changesTo, lang.hitch(this, this.createOptionsChangesTo, config));
               }
               else
               {
                  this.alfLog("warn", "The supplied 'changesTo' attribute for '" + this.fieldId + "' was not an Array");
               }
            }
            // Create update subcriptions based on topics published that are external to the form. This allows
            // the options to respond to "global" events rather than just changes within the form itself.
            var updateTopics = lang.getObject("updateTopics", false, config);
            if (updateTopics)
            {
               if (ObjectTypeUtils.isArray(updateTopics))
               {
                  array.forEach(config.updateTopics, lang.hitch(this, this.createOptionsSubscriptions, config));
               }
               else
               {
                  this.alfLog("warn", "The supplied 'updateTopics' attribute for '" + this.fieldId + "' was not an Array");
               }
            }
            
            // Generate the initial set of options in the following precedence...
            // 1) PubSub Config
            // 2) Callback function
            // 3) Fixed options
            var pubSub = lang.getObject("publishTopic", false, config),
                callback = lang.getObject("callback", false, config),
                fixed = lang.getObject("fixed", false, config);
            if (pubSub)
            {
               this.getPubSubOptions(config);
            }
            else if (callback)
            {
               this.processCallbackOptions(callback, config);
            }
            else if (fixed)
            {
               this.processFixedOptions(fixed);
            }
         }
      },

      /**
       * Handle configuration requests that options be generated through a function call...
       * Note that we're not explicitly handling scope here, it's expected that a hitch call will be
       * used if a scope is required. It is also possible to set the callback as a string which will
       * be matched against a function of the current scope.
       * 
       * @param {Function} callback The function to call to get the options for the control
       * @param {object} config The full options configuration
       */
      processCallbackOptions: function alfresco_forms_controls_BaseFormControl__processCallbackOptions(callback, config) {
         if (typeof callback === "function")
         {
            this.pendingOptions = callback(config);
         }
         else if (ObjectTypeUtils.isString(callback) && typeof this[callback] === "function")
         {
            this.pendingOptions = this[callback](config);
         }
         else
         {
            this.alfLog("warn", "The supplied 'callback' attribute for '" + this.fieldId + "' was not a Function");
         }
      },

      /**
       * Processes fixed options for the form control.
       * 
       * @param  {array} fixed The fixe options to apply to the form control.
       */
      processFixedOptions: function alfresco_forms_controls_BaseFormControl__processFixedOptions(fixed) {
         // Handle configuration that specifies a fixed configuration...
         if (ObjectTypeUtils.isArray(fixed))
         {
            this.pendingOptions = fixed;
         }
         else
         {
            this.alfLog("log", "The supplied fixed options attribute for '" + this.fieldId + "' was not an Array");
         }
      },
      
      /**
       * This is a simple function that is used to convert label message keys into the appropriate
       * translated message.
       * 
       * @instance
       * @param {object} option The option configuration
       * @param {number} index The index of the option
       */
      processOptionLabel: function alfresco_forms_controls_BaseFormControl__processOptionLabel(option, index) {
         // Get the option label and value attributes...
         // These are the values to look up in each item of the the options data array...
         // They default to "label" and "value" if not specified
         var labelAttribute = this.optionsConfig.labelAttribute ? this.optionsConfig.labelAttribute : "label";
         var valueAttribute = this.optionsConfig.valueAttribute ? this.optionsConfig.valueAttribute : "value";
         if (option[labelAttribute])
         {
            option.label = this.message(option[labelAttribute]);
         }
         else if (option[valueAttribute])
         {
            option.label = option[valueAttribute];
         }
         else
         {
            this.alfLog("warn", "An option was provided with neither label nor value", option, this);
         }
      },
      
      /**
       * Creates the subscription to the supplied topic information. All topics are handled by the 
       * updateOptions function.
       * 
       * @instance
       * @param {object} optionsConfig The overriding options config object
       * @param {object} subscription The details of the subscription to create
       * @param {number} index The index of the topic
       */
      createOptionsChangesTo: function alfresco_forms_controls_BaseFormControl__createOptionsChangesTo(optionsConfig, subscription, index) {
         if (subscription.targetId)
         {
            // Create the subscription...
            var topic = "_valueChangeOf_" + subscription.targetId,
                global = subscription.global || false;
            this.alfSubscribe(topic, lang.hitch(this, this.updateOptions, optionsConfig), global);
         }
         else
         {
            this.alfLog("warn", "No 'targetId' defined in subscription config", subscription, optionsConfig, this);
         }
         
      },
      
      /**
       * Creates the subscription to the supplied topic information. All topics are handled by the 
       * updateOptions function.
       * 
       * @instance
       * @param {object} optionsConfig The overriding options config object
       * @param {object} subscription The details of the subscription to create
       * @param {number} index The index of the topic
       */
      createOptionsSubscriptions: function alfresco_forms_controls_BaseFormControl__createOptionsSubscriptions(optionsConfig, subscription, index) {
         if (subscription.topic)
         {
            // Create the subscription...
            var global = subscription.global || false;
            this.alfSubscribe(subscription.topic, lang.hitch(this, this.updateOptions, optionsConfig), global);
         }
         else
         {
            this.alfLog("warn", "No 'topic' defined in subscription config", subscription, optionsConfig, this);
         }
      },
      
      /**
       * This is a built-in options callback that attempts to retrieve options from a publication event 
       * where it is assumed that the publication payload. An example of using this function can be found in
       * the [getFormWidgets]{@link module:alfresco/forms/creation/FormRulesConfigCreatorElement#getFormWidgets}
       * function of the [FormRulesConfigCreatorElement module]{@link module:alfresco/forms/creation/FormRulesConfigCreatorElement}
       * 
       * @instance
       * @param {object} optionsConfig The configuration for options handling defined for the current control
       * @param {object} payload The publication payload
       */
      getOptionsFromPublication: function alfresco_forms_controls_BaseFormControl__getOptionsFromPublication(optionsConfig, payload) {
         var options = lang.getObject("options", false, payload);
         if (options && ObjectTypeUtils.isArray(options))
         {
            return options;
         }
         else
         {
            return [];
         }
      },

      /**
       * This function is called when an rule triggering options reload occurs (e.g. the value of another relevant field in the 
       * form has been changed).
       * 
       * @instance
       * @param {object} optionsConfig The overriding options config object
       * @param {object} payload The publication payload
       */
      updateOptions: function alfresco_forms_controls_BaseFormControl__onUpdateOptions(optionsConfig, payload) {
         this.alfLog("log", "OPTIONS CONFIG: Field '" + this.fieldId + "' is handling value change of field'" + payload.name);
         if (optionsConfig.publishTopic)
         {
            this.getPubSubOptions(optionsConfig);
         }
         else if (optionsConfig.callback)
         {
            // Make the callback for setting the options. The callback can either be a function or
            // a String. If it is a String then it is assumed to be the name of a function in the 
            // widget so will be checked.
            if (typeof optionsConfig.callback === "function")
            {
               this.setOptions(optionsConfig.callback(optionsConfig, payload, this));
            }
            else if (typeof optionsConfig.callback === "string" && typeof this[optionsConfig.callback] === "function")
            {
               this.setOptions(this[optionsConfig.callback](optionsConfig, payload, this));
            }
            else
            {
               this.alfLog("log", "The supplied 'callback' attribute for '" + this.fieldId + "' was neither a String nor a function");
            }
         }
      },
      
      /**
       * This gets set to the temporary subscription handle that is created whenever options are dynamically requested
       * by publishing on a configured topic. This information needs to be be maintained as a widget instance variable
       * in order for the temporary subscription to be removed and prevent potential memory leaks.
       *
       * @instance
       * @type {object}
       * @default null
       */
      _pubSubOptionsHandle: null,

      /**
       * Sets up a new subscription for options changes and then publishes a request to get those options.
       *
       * @instance
       * @param {string} config The configuration to use for retrieving options via Pub/Sub
       */
      getPubSubOptions: function alfresco_forms_controls_BaseFormControl__getPubSubOptions(config) {
         // Publish a topic to get the currently available options based on the current value...
         if (config.publishTopic)
         {
            var responseTopic = this.generateUuid();
            var payload = config.publishPayload;
            if (!payload)
            {
               payload = {};
            }
            payload.responseTopic = responseTopic;
            this._pubSubOptionsHandle = this.alfSubscribe(responseTopic, lang.hitch(this, this.onPubSubOptions), true);
            this.alfPublish(config.publishTopic, payload, true);
         }
         else
         {
            this.alfLog("warn", "A request was made to obtain form control options via PubSub, but no 'publishTopic' attribute was provided", config, this);
         }
      },

      /**
       * This is hitched to the subscription set up in the [getPubSubOptions]{@link module:alfresco/forms/controls/BaseFormControl#getPubSubOptions}
       * function and simply unsubscribes the from the topic generated when requesting the options.
       *
       * @instance
       * @param {object} payload The published information
       */
      onPubSubOptions: function alfresco_forms_controls_BaseFormControl__onPubSubOptions(payload) {
         this.alfUnsubscribeSaveHandles([this._pubSubOptionsHandle]);
         if (payload.options)
         {
            this.setOptions(payload.options);
         }
         else
         {
            this.alfLog("warn", "No 'options' attribute published in payload for pubSub options", payload, this);
         }
      },

      /**
       * This is called to set the latest options.
       * 
       * @instance
       * @type {object}
       */
      setOptions: function alfresco_forms_controls_BaseFormControl__setOptions(options) {
         this.alfLog("log", "Setting options for field '" + this.fieldId + "'", options);
         if (this.deferValueAssigment)
         {
            this.pendingOptions = options;
         }
         else
         {
            var value = this.value;
            this.options = options;
            if (this.wrappedWidget)
            {
               var currentOptions = this.wrappedWidget.get("options");
               if (currentOptions && typeof this.wrappedWidget.removeOption === "function")
               {
                  // Remove all the current options...
                  array.forEach(currentOptions, lang.hitch(this, this.removeOption));
               }
               if (typeof this.wrappedWidget.addOption === "function")
               {
                  // Add all the new options...
                  array.forEach(options, lang.hitch(this, this.addOption));
               }
            }
            this.setOptionsValue(value, options);
         }
      },

      /**
       * Sets the value if there are options to select from
       *
       * @instance
       * @param {object} value The value to attempt to set from the available options
       * @param {array} options The options to choose from
       */
      setOptionsValue: function alfresco_forms_controls_BaseFormControl__setOptionsValue(value, options) {
         var optionsContainsValue = array.some(options, function(option) {
            return option.value === value;
         });
         
         if (optionsContainsValue)
         {
            // Reset the option...
            this.setValue(value);
            this.value = value;
         }
         else if (options && options.length > 0)
         {
            this.setValue(options[0].value);
            this.value = options[0].value;
         }
      },
      
      /**
       * Removes an option from the wrapped widet.
       * 
       * @instance
       * @param {object} option The option to remove
       * @param {number} index The index of the option to remove
       */
      removeOption: function alfresco_forms_controls_BaseFormControl__removeOption(option, index) {
         // jshint unused:false
         this.wrappedWidget.removeOption(option);
      },
      
      /**
       * Adds a new option to the wrapped widget.
       * 
       * @instance 
       * @param {object} option The option to add
       * @param {number} index The index of the option to add
       */
      addOption: function alfresco_forms_controls_BaseFormControl__addOption(option, index) {
         this.processOptionLabel(option, index);
         this.wrappedWidget.addOption(option);
      },
      
      /**
       * <p>This function is reused to process the configuration for the visibility, disablement and requirement attributes of the form
       * control. The format for the rules is as follows:</p>
       * <p><pre>"visibilityConfig": {
       *    "initialValue": true,
       *    "rules": [
       *       {
       *          "targetId": "fieldId1",
       *          "is": ["a", "b", "c"],
       *          "isNot": ["d", "e", "f"]
       *       }
       *    ],
       *    "callbacks": {
       *          "id": "functionA"
       *    }
       * }</pre></p>
       * <p>This structure applied to the following attributes:<ul>
       * <li>[visibilityConfig]{@link module:alfresco/forms/controls/BaseFormControl#visibilityConfig}</li>
       * <li>[requirementConfig]{@link module:alfresco/forms/controls/BaseFormControl#requirementConfig}</li>
       * <li>[disablementConfig]{@link module:alfresco/forms/controls/BaseFormControl#disablementConfig}</li></ul></p>
       *  
       * @mmethod processConfig
       * @param {string} attribute
       * @param {object} config
       */
      processConfig: function alfresco_forms_controls_BaseFormControl__processConfig(attribute, config) {
         
         if (config)
         {
            // Set the initial value...
            if (typeof config.initialValue !== "undefined")
            {
               this[attribute](config.initialValue);
            }
            
            // Process the rule subscriptions...
            if (typeof config.rules !== "undefined")
            {
               this.processRulesConfig(attribute, config.rules);
            }
            else if (typeof config.rules !== "undefined")
            {
               // Debug output when instantiation data is incorrect. Only log when some data is defined but isn't an object.
               // There's no point in logging messages for unsupplied data - just incorrectly supplied data.
               this.alfLog("log", "The rules configuration for attribute '" + attribute + "' for property '" + this.fieldId + "' was not an Object");
            }
            
            // Process the callback subscriptions...
            if (typeof config.callbacks === "object")
            {
               this._processCallbacksConfig(attribute, config.callbacks);
            }
            else if (typeof config.callbacks !== "undefined")
            {
               // Debug output when instantiation data is incorrect. Only log when some data is defined but isn't an object.
               // There's no point in logging messages for unsupplied data - just incorrectly supplied data.
               this.alfLog("log", "The callback configuration for attribute '" + attribute + "' for property '" + this.fieldId + "' was not an Object");
            }
         }
      },
      
      /**
       * This holds all the data about rules that need to be processed for the various attributes of the widget. By default this
       * will handle rules for visibility, requirement and disability.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      _rulesEngineData: null,
      
      /**
       * This function sets up the subscriptions for processing rules relating to attributes.
       * 
       * @instance
       * @param {string} attribute E.g. visibility, editability, requirement
       * @param {object} rules
       */
      processRulesConfig: function alfresco_forms_controls_BaseFormControl__processRulesConfig(attribute, rules) {
         // TODO: Implement rules for handling changes in validity (each type could have rule type of "isValid"
         //       and should subscribe to changes in validity. The reason for this would be to allow changes
         //       on validity. Validity may change asynchronously from value as it could be performed via a 
         //       remote request.

         // Set up the data structure that will be required for processing the rules for the target property changes...
         if (!this._rulesEngineData)
         {
            // Ensure that the rulesEngineData object has been created
            this._rulesEngineData = {};
         }
         if (typeof this._rulesEngineData[attribute] === "undefined")
         {
            // Ensure that the rulesEngineData object has specific information about the form control attribute...
            this._rulesEngineData[attribute] = {};
         }
         array.forEach(rules, lang.hitch(this, this.processRule, attribute));
      },

      /**
       * This function processes an individual attribute rule (e.g. to change the visibility, disablement or
       * requirement status).
       * 
       * @instance
       * @param {string} attribute The attribute that the rule effects (e.g. visibility)
       * @param {object} rule The rule to process.
       * @param {number} index The index of the rule.
       */
      processRule: function alfresco_forms_controls_BaseFormControl__processRule(attribute, rule, index) {
         if (rule.targetId)
         {
            if (typeof this._rulesEngineData[attribute][rule.targetId] === "undefined")
            {
               this._rulesEngineData[attribute][rule.targetId] = {};
            }
            
            // Set the rules to be processed for the current rule...
            // NOTE: Previous rules can be potentically overridden here...
            this._rulesEngineData[attribute][rule.targetId].rules = rule;
            
            // Subscribe to changes in the relevant property...
            this.alfSubscribe("_valueChangeOf_" + rule.targetId, lang.hitch(this, this.evaluateRules, attribute));
         }
         else
         {
            this.alfLog("warn", "The following rule is missing a 'name' attribute", rule, this);
         }
      },
      
      /**
       * This function evaluates all the rules configured for a particular attribute (e.g. "visibility") for the 
       * current form control. It is triggered whenever one of the other fields configured as part of a rule changes, 
       * but ALL the rules are evaluated for that attribute.
       * 
       * @instance
       * @param {string} attribute
       * @param {object} payload The publication posted on the topic that triggered the rule
       */
      evaluateRules: function alfresco_forms_controls_BaseFormControl__evaluateRules(attribute, payload) {
         
         this.alfLog("log", "RULES EVALUATION('" + attribute + "'): Field '" + this.fieldId + "'");

         // Set the current value that triggered the evaluation of rules...
         this._rulesEngineData[attribute][payload.fieldId].currentValue = payload.value;

         // Make the assumption that the current status is true (i.e. the rule is PASSED). This is done so that
         // we can AND the value against the result of each iteration (we can also stop processing the rules once
         // the rule is negated...
         var status = true;
         
         // The exception to the above comment is when NO rules are configured - in that case we leave the status
         // as false by default
         var hasProps = false;
         
         // jshint forin:false
         for (var key in this._rulesEngineData[attribute])
         {
            // Need this assignment to "prove" there are properties (this approach is used for compatibility with older
            // browsers)...
            hasProps = true;
            
            // Keep processing rules until the rule status is negated...
            if (status)
            {
               var currentValue = this._rulesEngineData[attribute][key].currentValue;
               var validValues = this._rulesEngineData[attribute][key].rules.is;
               var invalidValues = this._rulesEngineData[attribute][key].rules.isNot;
               
               // Assume that its NOT valid value (we'll only do the actual test if its not set to an INVALID value)...
               // UNLESS there are no valid values specified (in which case any value is valid apart form those in the invalid list)
               var isValidValue = typeof validValues === "undefined" || validValues.length === 0;

               // Initialise the invalid value to be false if no invalid values have been declared (and only check values if defined)...
               var isInvalidValue = typeof invalidValues !== "undefined" && invalidValues.length > 0;
               if (isInvalidValue)
               {
                  // Check to see if the current value is set to an invalid value (i.e. a value that negates the rule)
                  isInvalidValue = array.some(invalidValues, lang.hitch(this, this.ruleValueComparator, currentValue));
               }
               
               // Check to see if the current value is set to a valid value...
               if (!isInvalidValue && typeof validValues !== "undefined" && validValues.length > 0)
               {
                  isValidValue = array.some(validValues, lang.hitch(this, this.ruleValueComparator, currentValue));
               }
               
               // The overall status is true (i.e. the rule is still passing) if the current status is true and the
               // current value IS set to a valid value and NOT set to an invalid value
               status = status && isValidValue && !isInvalidValue;
            }
         }
         
         // This last AND ensures that we negate the rule if there were no rules to process...
         status = status && hasProps;
         this[attribute](status);
         return status;
      },
      
      /**
       * The default comparator function used for comparing a rule value against the actual value of a field.
       * Note that the target value is expected to be an object from the arrays (assigned to the  "is" or "isNot"
       * attribute) and by default the "value" attribute of those objects are compared with the current value
       * of the field. It is possible to override this comparator to allow a more complex comparison operation.
       * 
       * It's important to note that values are compared as strings. This is done to ensure that booleans can 
       * be compared. This is important as it should be possible to construct rules dynamically and values
       * should be entered as text.
       * 
       * @instance
       * @param {object} currentValue The value currently
       * @param {object} targetValue The value to compare against
       */
      ruleValueComparator: function alfresco_forms_controls_BaseFormControl(currentValue, targetValue) {
         this.alfLog("log", "Comparing", currentValue, targetValue);

         // If both values aren't null then compare the .toString() output, if one of them is null
         // then it doesn't really matter whether or not we get the string output for the value or not
         if (currentValue != null && targetValue.value != null)
         {
            return currentValue.toString() === targetValue.value.toString();
         }
         else
         {
            // return currentValue == targetValue.value; // Commented out because I think this is wrong (shouldn't have .value)
            return currentValue === targetValue;
         }
      },
      
      /**
       * The payload of property value changing publications should have the following attributes... 
       *    1) The name of the property that has changed ("name")
       *    2) The old value of the property that has changed ("oldValue")
       *    3) The new value of the property that has changed ("value")
       *  Callbacks should take the following arguments (nameOfChangedProperty, oldValue, newValue, callingObject, attribute)
       *  
       *  @instance
       *  @param {string} attribute
       *  @param {object} callbacks
       */
      _processCallbacksConfig: function alfresco_forms_controls_BaseFormControl___processCallbacksConfig(attribute, callbacks) {
         var _this = this;
         for (var key in callbacks) {
            if (typeof callbacks[key] === "function")
            {
               // Subscribe using the supplied function (this will only be possible when form controls are created
               // dynamically from widgets (rather than in configuration)...
               _this.alfSubscribe("_valueChangeOf_" + key, function(payload) {
                  var status = callbacks[payload.name](payload.name, payload.oldValue, payload.value, _this, attribute);
                  _this[attribute](status);
               });
            }
            else if (typeof callbacks[key] === "string" &&
                     typeof _this[callbacks[key]] === "function")
            {
               // Subscribe using a String reference to a function defined in this widget...
               _this.alfSubscribe(_this.pubSubScope + "_valueChangeOf_" + key, function(payload) {
                  var status = _this[callbacks[payload.name]](payload.name, payload.oldValue, payload.value, _this, attribute);
                  _this[attribute](status);
               });
            }
            else
            {
               // Log a message if the callback supplied isn't actually a function...
               this.alfLog("log", "The callback for property '" + _this.name + "' for handling changes to property '" + key + "' was not a function or was not a String that references a local function");
            }
         }
      },
      
      /**
       * The local image to use for a validation in progress indicator.
       * 
       * @instance
       * @type {string}
       * @default "ajax_anim.gif"
       */
      validationInProgressImg: "ajax_anim.gif",

      /**
       * The alt-text label to use for the validation in progress indicator
       * 
       * @instance
       * @type {string}
       * @default "validation.inprogress.alttext"
       */
      validationInProgressAltText: "validation.inprogress.alttext",

      /**
       * Processes the image source for indicating validation is in progress and its alt-text label.
       *
       * @instance
       */
      postMixInProperties: function alfresco_forms_controls_BaseFormControl__postMixInProperties() {
         // Store the initial value to ensure that when the page is added to the document is configured
         // correctly, the value can be set with the intended value (as opposed to what the wrapped widget
         // thinks it should be)...
         this.initialValue = this.value;

         if (!this.validationInProgressImgSrc)
         {
            this.validationInProgressImgSrc = require.toUrl("alfresco/forms/controls") + "/css/images/" + this.validationInProgressImg;
         }
         this.validationInProgressAltText = this.message(this.validationInProgressAltText);
      },

      /**
       * The topic whose publication should trigger the setting of the control value from payload.value
       * 
       * @instance
       * @type {string}
       * @default null
       */
      valueSubscriptionTopic: null,

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_forms_controls_BaseFormControl__postCreate() {
         this.initialConfig = this.getWidgetConfig();
         
         // Use the _disabled property if not already set...
         if (typeof this.initialConfig.disabled === "undefined") 
         {
            this.initialConfig.disabled = this._disabled;
         }

         if (this.additionalCssClasses)
         {
            domClass.add(this.domNode, this.additionalCssClasses);
         }

         this.wrappedWidget = this.createFormControl(this.initialConfig);
         
         // Check to see if the widget is "promised" or is expected to be returned immediately. If promised then
         // the "then" function needs to be hitched to the "onPromisedWidget" so that setup can be completed once it
         // has been delivered...
         if (this.isPromisedWidget && typeof this.wrappedWidget.then === "function")
         {
            this.wrappedWidget.then(lang.hitch(this, this.onPromisedWidget));
         }
         else
         {
            this.completeWidgetSetup();
         }

         if (this.valueSubscriptionTopic)
         {
            this.alfSubscribe(this.valueSubscriptionTopic, lang.hitch(this, this.valueSubscribe));
         }
      },
      
      /**
       * This should be overridden when the [createFormControl function]{@link module:alfresco/forms/controls/BaseFormControl#createFormControl}
       * will return a Promise (that is a widget that will be created asynchronously rather than returned immediately. This allows
       * processing of the control to be deferred until it has been loaded. This will typically be needed when it is not possible
       * to pre-load the required JavaScript files into the cache.
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      isPromisedWidget: false,
      
      /**
       * This function is called when [isPromisedWidget]{@link module:alfresco/forms/controls/BaseFormControl#isPromisedWidget} is set to true.
       * It is the function that is hitched to the "then" function of the returned promise and is called when the promise is resolved (e.g.
       * when the widget has been created).
       * 
       * @instance
       * @param {object} promisedWidget The widget that was promised.
       */
      onPromisedWidget: function alfresco_forms_controls_BaseFormControl__onPromisedWidget(promisedWidget) {
         this.wrappedWidget = promisedWidget;
         this.completeWidgetSetup();
      },
      
      /**
       * Handles adding the wrapped widget into the DOM model provided by the template. By default this assumes that
       * the widget is a Dojo widget and calls it's  "placeWidget" function.
       * 
       * @instance
       */
      placeWidget: function alfresco_forms_controls_BaseFormControl__placeWrappedWidget() {
         if (this.wrappedWidget && typeof this.wrappedWidget.placeAt === "function")
         {
            this.wrappedWidget.placeAt(this._controlNode);
         }
         else
         {
            this.alfLog("warn", "The wrapped widget has no 'placeAt' function - perhaps the 'placeWidget' function should be overridden?", this);
         }
      },
      
      /**
       * This function is set as a callback when the widget is not immediately added to the main document.
       * It is used as a safety check to prevent scripts from being injected into the page (setting a value
       * on a node before it is added into the page will cause it to execute when rendered, but setting once
       * it has been included in the initial rendering will not cause any problems.
       *
       * @instance
       * @param {object} payload This is expected to be an empty object or null.
       */
      onWidgetAddedToDocument: function alfresco_forms_controls_BaseFormControl__onWidgetAddedToDocument(payload) {
         if ($.contains(document.body, this.domNode))
         {
            this.alfUnsubscribe(this.widgetProcessingCompleteSubscription);
            
            // Update the flag to indicate that we're no longer deferring value assignment, this needs to be
            // done before setting the initial value or processing all the deferred values as otherwise they'll 
            // just get added to the end of the deferred value array!
            this.deferValueAssigment = false;
            
            if (this.pendingOptions)
            {
               this.options = this.pendingOptions;
               this.setOptions(this.options);
            }

            this.setValue(this.initialValue);
            delete this.initialValue;

            // Iterate over all the deferred value assignments, arguably we could just process the last deferred
            // value, however it may be necessary to ensure that the intended flow of processing is maintained
            // (e.g. there may be rules configured to set or update other fields based on one of the values)
            array.forEach(this.deferredValueAssignments, function(deferred) {
               deferred.resolve();
            });
            delete this.deferredValueAssignments;

            // Set up the events that indicate a change in value...
            this.setupChangeEvents();

            // Set the initial visibility, requirement and disablement...
            this.alfVisible(this._visible);
            this.alfRequired(this._required);
            this.alfDisabled(this._disabled);
            
            // Set the label...
            var widgetId = lang.getObject("id", false, this.wrappedWidget);
            if (this.label && lang.trim(this.label) !== "")
            {
               this._labelNode.innerHTML = this.encodeHTML(this.message(this.label));
               if (widgetId)
               {
                  domAttr.set(this._labelNode, "for", this.wrappedWidget.id);
               }
            }
            else
            {
               domStyle.set(this._titleRowNode, {display: "none"});
            }

            // Set the description...
            if (this.description && lang.trim(this.description) !== "")
            {
               this._descriptionNode.innerHTML = this.encodeHTML(this.message(this.description));
            }
            else
            {
               domStyle.set(this._descriptionRowNode, {display: "none"});
            }
            
            // Set the units label...
            if (this.unitsLabel && this.unitsLabel !== "")
            {
               this._unitsNode.innerHTML = this.encodeHTML(this.message(this.unitsLabel));
            }
            else
            {
               // Hide the units node if there are no units to display...
               domStyle.set(this._unitsNode, { display: "none"});
            }
            
            // Set the error message for validation...
            if (this.validationConfig && typeof this.validationConfig.errorMessage === "string")
            {
               // TODO: This message might not make much sense if it is just missing data for a required field...
               this._validationMessage.innerHTML = this.encodeHTML(this.message(this.validationConfig.errorMessage));
            }

            // Fix for missing label on validation input
            var validationInput = query("input.dijitValidationIcon.dijitValidationInner", this._controlNode);
            if(validationInput && validationInput.length > 0 && widgetId)
            {
               var validationInputId = this.wrappedWidget.id + "_validationInput";

               // Add 'id' to the input
               domAttr.set(validationInput[0], "id", validationInputId);

               // Create a label for the input
               domConstruct.create("label", {
                  innerHTML: this.message("validation.control.invalid"),
                  "for": validationInputId,
                  "class": "hiddenAccessible"
               }, validationInput[0], "before");
            }

            // If we've promised a value publication then resolve it now...
            // This has been added so that enclosing forms can publish the initialised value of the form control
            if (this.deferredValuePublication)
            {
               this.deferredValuePublication.resolve();
            }

            this.validate();
         }
         else
         {
            // No action yet. Don't unsubscribe.
         }
      },

      /**
       * Adds the widget into the current DOM fragment and then sets up subscriptions on widget processing complete
       * publications as we want to wait the most recently requested widget processing to complete (which in all likelihood
       * should be the request that caused the creation of this widget. The callback function will set the 
       * value of the form control making sure that the widget has been added to the document as we only set the 
       * once it's part of the document to ensure that no unsafe value (e.g. an XSS attack) can be
       * executed as part of the initial page rendering.
       *
       * @instance
       */
      completeWidgetSetup: function alfresco_forms_controls_BaseFormControl__completeWidgetSetup() {
         this.placeWidget();
         this.widgetProcessingCompleteSubscription = this.alfSubscribe("ALF_WIDGET_PROCESSING_COMPLETE", lang.hitch(this, this.onWidgetAddedToDocument), true);
      },

      /**
       * Whenever a widgets value changes we need to publish the details out to the other form controls (that exist in the
       * same scope) so that they can modify their appearance/behaviour as necessary). This function sets up the default events 
       * that indicate that a wigets value has changed. This function can be overridden to handle non-Dojo widgets or when 
       * multiple widgets represent a single control. 
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_BaseFormControl__setupChangeEvents() {
         if (this.wrappedWidget)
         {
            if (this.wrappedWidget.watch)
            {
               // TODO: Do we need to do anything with the watch handle when the widget is destroyed?
               this.wrappedWidget.watch("value", lang.hitch(this, this.onValueChangeEvent));
            } 
            else
            {
               this.alfLog("warn", "No watch method found on wrapped widget", this);
            }
         }
      },
      
      /**
       * Handles the change in value for the current form control by publishing the details of the change and calling the
       * validate function to check that the new value is acceptable.
       * 
       * @instance
       * @param {string} name
       * @param {string} oldValue
       * @param {string} value
       */
      onValueChangeEvent: function alfresco_forms_controls_BaseFormControl__onValueChangeEvent(name, oldValue, value) {
         this.formControlValueChange(name, oldValue, value);
         this.validate();
      },
      
      /**
       * This gets the value currently assigned to the wrapped widget. It assumes the widget has a single "value"
       * attribute that can be retrieved (i.e. it assumes a Dojo widget). Any extending classes that do not use
       * Dojo widgets (or use multiple widgets) should override this implementation to return the correct value.
       * 
       * @instance
       * @returns {object} The current value of the field.
       */
      getValue: function alfresco_forms_controls_BaseFormControl__getValue() {
         var value = null;
         if (this.wrappedWidget)
         {
            try
            {
               value = this.wrappedWidget.getValue();
            }
            catch(e)
            {
               this.alfLog("log", "An exception was thrown retrieving the value for field: '" + this.fieldId + "'");
            }
         }
         value = this.convertStringValuesToBoolean(value);
         return value;
      },

      /**
       * Indicates whether or not string values should be converted to a boolean value if possible. This is checked
       * during [getValue]{@link module:alfresco/forms/controls/BaseFormControl#getValue} and
       * [setValue]{@link module:alfresco/forms/controls/BaseFormControl#setValue} to handle value conversion in and out
       * of the widget. This attribute should be honoured if overriding those functions.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      _convertStringValuesToBooleans: false,

      /**
       * If the supplied argument is a string then this will convert that value into a boolean. Conversion will only
       * take place if the string is either "true" or "false" otherwise the supplied value will be returned. This conversion
       * will only take place if [_convertStringValuesToBooleans]{@link module:alfresco/forms/controls/BaseFormControl#convertStringValuesToBoolean}
       * is set to true (which is not the default value).
       *
       * @instance
       * @param {object} value
       * @returns {object}
       */
      convertStringValuesToBoolean: function alfresco_forms_controls_BaseFormControl__convertStringValuesToBoolean(value) {
         if (this._convertStringValuesToBooleans === true && ObjectTypeUtils.isString(value))
         {
            if (value.toLowerCase() === "true")
            {
               value = true;
            }
            else if (value.toLowerCase() === "false")
            {
               value = false;
            }
         }
         return value;
      },

      /**
       * 
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function alfresco_forms_controls_BaseFormControl__setValue(value) {
         if (this.deferValueAssigment)
         {
            // If we're not quite ready to start setting values, then we should defer
            // updating the value until we are. We determine that we're ready to set
            // a value by the existence of the deferredValueAssignments attribute..
            var deferred = new Deferred();
            deferred.then(lang.hitch(this, this.setValue, value));
            this.deferredValueAssignments.push(deferred);
         }
         else
         {
            this.alfLog("log", "Setting field: '" + this.fieldId + "' with value: ", value);
            if (this.wrappedWidget && typeof this.wrappedWidget.setValue === "function")
            {
               if (this._convertStringValuesToBooleans === true && typeof value === "boolean")
               {
                  value = value.toString();
               }
               this.value = value; // This is stored for ensuring dynamic options retain the correct value

               // If there are no options, then the current value will be retained, but if their are options
               // and the new value is not among them then the first available option will be selected instead
               this.setOptionsValue(value, this.optionsValue);
               this.wrappedWidget.setValue(value);
            }
         }
      },

      /**
       * This function is hitched when a 'valueSubscriptionTopic' attribute is set on the control. It takes an
       * inbound payload and if it contains a value property it is applied to the control through the setValue 
       * function.
       *
       * @instance
       * @param {object} payload
       */
      valueSubscribe: function alfresco_forms_controls_BaseFormControl__valueSubscribe(payload) {
         var value = lang.getObject("value", false, payload);
         if (value != null)
         {
            this.setValue(value);
         }
         else
         {
            this.alfLog("warn", "Attempt made to set form control value by subscription with an inapproriate payload", this);
         }
      },

      /**
       * This function publishes the current value of the widget. It is provided so that enclosing forms can publish
       * all of its controls values to process all rules.
       * 
       * @instance
       * @param {Deferred} [deferred] A deferred object can optionally be passed. This will only be resolved as widget value
       * initialization completes.
       */
      publishValue: function alfresco_forms_controls_BaseFormControl__publishValue(deferred) {
         this.alfLog("log", "Publishing value for field: '" + this.fieldId + "'");
         if (!deferred)
         {
            // Make sure that the published value is correct. We can't trust that the wrapped widget
            // won't be spuriously returning the wrong value (this will happen with select boxes that
            // set their value as options are added) before initialization is completed. If the 
            // "initialValue" variable still exists then this indicates that the initialization is not
            // yet complete. It will be removed when initialization completes and from that moment on
            // we can rely on the value returned by the "getValue" function.
            var value;
            if (typeof this.initialValue === "undefined")
            {
               value = this.getValue();
            }
            else
            {
               value = this.initialValue;
            }
            if (this.wrappedWidget)
            {
               this.alfPublish("_valueChangeOf_" + this.fieldId, {
                  fieldId: this.fieldId,
                  name: this.name,
                  oldValue: value,
                  value: value
               });
            }
         }
         else
         {
            // If passed a deferred object then save it for resolving once the widget is added to 
            // the document...
            this.deferredValuePublication = deferred;
         }
      },
      
      /**
       * This function is called whenever the value of the wrapped form widget changes. It publishes the details of the change
       * so that other form widgets can update their status based on the value.
       * 
       * @instance
       * @param {string} attributeName
       * @param {object} oldValue
       * @param {object} value
       */
      formControlValueChange: function alfresco_forms_controls_BaseFormControl__formControlValueChange(attributeName, oldValue, value) {
         this.alfPublish("_valueChangeOf_" + this.fieldId, {
            fieldId: this.fieldId,
            name: this.name,
            oldValue: oldValue,
            value: value
         });
      },
      
      /**
       * 
       * @instance
       * @param {object} config
       */
      createFormControl: function alfresco_forms_controls_BaseFormControl__createFormControl(config) {
         // Extension point
      },
      
      /**
       * 
       * @instance
       * @returns {object} The configuration for the form control.
       */
      getWidgetConfig: function alfresco_forms_controls_BaseFormControl__getWidgetConfig() {
         // This is a method that is expected to be overridden. We won't even assume that the widget configuration
         // will be standard Dojo configuration because we might be instantiated a custom or 3rd party library widget.
         return {};
      },
      
      /**
       * 
       * @instance
       */
      startup: function alfresco_forms_controls_BaseFormControl__startup() {
         
      },
      
      /**
       * This will hold all of the configuration for validation. It is initialised in the constructor.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      validationConfig: null,
      
      /**
       * This function validates the current widget value.
       * 
       * @instance
       * @returns {boolean} A value indicating whether or not validation passed successfully or not.
       */
      validate: function alfresco_forms_controls_BaseFormControl__validate() {
         if (this.deferValueAssigment)
         {
            // Do nothing until final value has been assigned
         }
         else if (this.validationConfig && ObjectTypeUtils.isArray(this.validationConfig))
         {
            this.startValidation();
         }
         else
         {
            var isValid = this.processValidationRules();
            if (isValid)
            {
               this.alfPublish("ALF_VALID_CONTROL", {
                  name: this.name,
                  fieldId: this.fieldId
               });
               this.hideValidationFailure();
            }
            else
            {
               this.alfPublish("ALF_INVALID_CONTROL", {
                  name: this.name,
                  fieldId: this.fieldId
               });
               this.showValidationFailure();
            }
         }
      },
      
      /**
       * This function defines the default validation processing. It should be overridden by extending form controls
       * that do not use the default rules. This function rather than the "validate" function should be overridden
       * because this function simply indicates whether or not the control is valid but the "validate" function 
       * controls the rendering of error messages and publication of related events.
       *
       * The rules are only processed if the field is visible and enabled because only those fields have their values
       * included in the overall form value (e.g. invisible fields won't be submitted so it doesn't matter if their
       * contents is invalid)
       * 
       * @instance
       * @returns {boolean} Indicates whether or not the validation rules were passed successfully
       */
      processValidationRules: function alfresco_forms_controls_BaseFormControl__processValidationRules() {
         var valid = true;
         if (this._visible && !this._disabled)
         {
            // Things to validate against are...
            // 1) Does the widget have a value if it is required
            var value = this.getValue();
            
            this.alfLog("log", "Validating: '" + this.fieldId + "' with value:", value);
            
            var passedRequiredTest = true,
                passedRegExpTest = true; // Assume valid starting point.
            
            // Check that a value has been specified if this is a required field...
            var valueIsEmptyArray = ObjectTypeUtils.isArray(value) && value.length === 0;
            passedRequiredTest = !(this._required && ((!value && value !== 0 && value !== false) || valueIsEmptyArray));
            
            // Check if any specified regular expression is passed...
            if (this.validationConfig)
            {
               if (typeof this.validationConfig.regExObj !== "undefined" && this.validationConfig.regExObj instanceof RegExp)
               {
                  passedRegExpTest = this.validationConfig.regExObj.test(value);
               }
            }
            
            // 3) Does the widget value satisfy a callback function
            // 4) Does the widget value satisfy a remote validation request
            
            // TODO: Need to output an appropriate error message.
            valid = passedRequiredTest && passedRegExpTest;
         }
         else
         {
            // No action required if field is invisible or disabled
         }
         return valid;
      },
      
      /**
       * By default this simply adds the "validation-error" and "display" classes to the _validationIndicator
       * and _validationMessage DOM nodes respectively. However, the code has been broken out into a separate function
       * to support extending classes that may provide alternative HTML templates or wish to render errors
       * differently.
       * 
       * @instance
       */
      showValidationFailure: function alfresco_forms_controls_BaseFormControl__showValidationFailure() {
         domClass.add(this._validationIndicator, "validation-error");
         domClass.add(this._validationMessage, "display");
      },
      
      /**
       * By default this simply removes the "validation-error" and "display" classes to the _validationIndicator
       * and _validationMessage DOM nodes respectively. However, the code has been broken out into a separate function
       * to support extending classes that may provide alternative HTML templates or wish to render errors
       * differently.
       * 
       * @instance
       */
      hideValidationFailure: function alfresco_forms_controls_BaseFormControl__hideValidationFailure() {
         domClass.remove(this._validationIndicator, "validation-error");
         domClass.remove(this._validationMessage, "display");
      },

      /**
       * This function is called from a [form]{@link module:alfresco/forms/Form} when it needs to get the 
       * values from all the controls that it contains. The current control will only add its value to the
       * supplied object if appropriate.
       *
       * @instance
       * @param {object} values The object to update with the current value of the control
       */
      addFormControlValue: function alfresco_forms_controls_BaseFormControl__addFormControlValue(values) {
         // Only include field values if the control is NOT hidden or disabled
         // unless specifically requested by the configuration. This allows
         // multiple controls to represent a single field but also allows intentionally
         // hidden fields to still have data submitted
         var hidden = this._visible !== undefined && this._visible === false;
         var disabled = this._disabled !== undefined && this._disabled === true;
         var noPostWhenHiddenOrDisabled = this.postWhenHiddenOrDisabled !== undefined && this.postWhenHiddenOrDisabled === false;
         if ((hidden || disabled) && noPostWhenHiddenOrDisabled)
         {
            // Don't set the value (line below is just to allow debug point to be set)
         }
         else if (this.noPostWhenValueIs && arrayUtils.arrayContains(this.noPostWhenValueIs, this.getValue()))
         {
            // Don't set the value if the noPostIfValueIs array contains the current value.
         }
         else
         {
            // Process dot-notation property names...
            lang.setObject(this.get("name"), this.getValue(), values);
         }
      },

      /**
       * This function is called from a [form]{@link module:alfresco/forms/Form} when it needs to set the 
       * values from all the controls that it contains. The current control will be updated if appropriate.
       *
       * @instance
       * @param {object} values The object to set the each form control value from
       */
      updateFormControlValue: function alfresco_forms_controls_BaseFormControl__updateFormControlValue(values) {
         var hidden = this._visible !== undefined && this._visible === false;
         var disabled = this._disabled !== undefined && this._disabled === true;
         var noUpdateWhenHiddenOrDisabled = this.noValueUpdateWhenHiddenOrDisabled !== undefined && this.noValueUpdateWhenHiddenOrDisabled === true;
         if ((hidden || disabled) && noUpdateWhenHiddenOrDisabled)
         {
            // Don't set the value as the field is hidden or disabled and has requested that it not be updated
            // in these circumstances. The typical reason for this is that multiple controls represent a single
            // field and it is not the displayed control so shouldn't be updated to preserve its default value.
         }
         else
         {
            var v = lang.getObject(this.get("name"), false, values);
            if (v !== undefined)
            {
               this.setValue(v);
            }
         }
      },

      /**
       * This function is called from a [form]{@link module:alfresco/forms/Form} when it needs to validate the 
       * all the controls that it contains.
       *
       * @instance
       */
      validateFormControlValue: function alfresco_forms_controls_BaseFormControl__validateFormControlValue() {
         if (this.publishValue && typeof this.publishValue === "function")
         {
            this.validate();
         }
      }
   });
});
