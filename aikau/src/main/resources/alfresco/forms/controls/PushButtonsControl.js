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
 * An input control that offers the functionality of radio-buttons or checkboxes (depending
 * on [the mode]{@link module:alfresco/forms/controls/PushButtonsControl#multiMode}, rendered as a
 * single control with push-button options.
 *
 * @example <caption>Sample configuration:</caption>
 * {
 *    name: "alfresco/forms/controls/PushButtons",
 *    id: "CAN_BUILD",
 *    config: {
 *       name: "canbuild",
 *       label: "Can build",
 *       description: "Can we build it?",
 *       width: 500,
 *       optionsConfig: {
 *          fixed: [
 *             {
 *                label: "Yes",
 *                value: true
 *             },
 *             {
 *                label: "No",
 *                value: false
 *             }
 *          ]
 *       }
 *    }
 * }
 *
 * @module alfresco/forms/controls/PushButtonsControl
 * @extends external:dijit/_WidgetBase
 * @mixes external:dijit/_TemplatedMixin
 * @mixes external:dijit/_FocusMixin
 * @mixes alfresco/core/Core
 * @mixes alfresco/core/ObjectProcessingMixin
 * @author Martin Doyle
 * @since 1.0.44
 */
define([
      "alfresco/core/Core",
      "alfresco/core/ObjectProcessingMixin",
      "dijit/_FocusMixin",
      "dijit/_TemplatedMixin",
      "dijit/_WidgetBase",
      "dojo/_base/array",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "dojo/dom-construct",
      "dojo/dom-style",
      "dojo/on",
      "dojo/text!./templates/PushButtonsControl.html"
   ],
   function(Core, ObjectProcessingMixin, _FocusMixin, _TemplatedMixin, _WidgetBase, array, declare, lang, domConstruct, domStyle, on, template) {
      /*jshint devel:true*/

      return declare([_WidgetBase, _TemplatedMixin, _FocusMixin, Core, ObjectProcessingMixin], {

         /**
          * An array of the CSS files to use with this widget.
          *
          * @instance
          * @type {object[]}
          * @default [{cssFile:"./css/PushButtonsControl.css"}]
          */
         cssRequirements: [{
            cssFile: "./css/PushButtonsControl.css"
         }],

         /**
          * The root class of this widget
          *
          * @instance
          * @type {string}
          */
         rootClass: "alfresco-forms-controls-PushButtonsControl",

         /**
          * The HTML template to use for the widget.
          *
          * @override
          * @instance
          * @type {String}
          */
         templateString: template,

         /**
          * The height of the control. Can be specified either as a number,
          * which is assumed to be in pixels, or as a CSS dimension
          * string.
          *
          * @instance
          * @type {number|string}
          * @default
          */
         height: 50,

         /**
          * The ID of this control
          *
          * @instance
          * @type {string}
          * @default
          */
         id: null,

         /**
          * Whether to run the control in multi-value mode (i.e. like a checkbox).
          *
          * @instance
          * @type {boolean}
          * @default
          */
         multiMode: false,

         /**
          * The name of this control in the form
          *
          * @instance
          * @type {string}
          * @default
          */
         name: null,

         /**
          * Local store of the current control options, where the generated
          * UUID of the input element is the key and the value is an object
          * containing details of the option.
          *
          * @instance
          * @type {object}
          * @readonly
          * @default
          */
         opts: null,

         /**
          * The total width of the control. Can be specified either as a
          * number, which is assumed to be in pixels, or as a CSS dimension
          * string.
          *
          * @instance
          * @type {number|string}
          * @default
          */
         width: "auto",

         /**
          * Constructor
          *
          * @instance
          */
         constructor: function() {
            this.opts = {};
         },

         /**
          * Start up the widget
          *
          * @instance
          * @override
          */
         startup: function alfresco_forms_controls_PushButtonsControl__startup() {
            this.inherited(arguments);
            this.resize();
         },

         /**
          * Add an option to the control.
          *
          * @instance
          * @param {object} option The option to be added
          */
         addOption: function alfresco_forms_controls_PushButtonsControl__addOption(option) {

            // Duplicate values are unsupported
            var optionAlreadyExists = array.some(this._getOpts(), function(opt) {
               return opt.option.value === option.value;
            });
            if (optionAlreadyExists) {
               this.alfLog("error", "Attempted to add option with duplicate value: ", option);
               return;
            }

            // Setup the DOM structure
            var optionId = this.id + "_" + this.generateUuid(),
               inputNode = domConstruct.create("input", {
                  name: this.name,
                  id: optionId,
                  className: this.rootClass + "__input",
                  type: this.multiMode ? "checkbox" : "radio"
               }, this.domNode),
               labelNode = domConstruct.create("label", {
                  "for": optionId, // Quoted because reserved word
                  className: this.rootClass + "__label"
               }, this.domNode);

            // Add the label content (just text initially)
            var labelContent = document.createTextNode(option.label || option.name || option.value);
            labelNode.appendChild(labelContent);

            // Setup change-listener
            var changeListener = on(inputNode, "change", lang.hitch(this, this.onValueChanged));
            this.own(changeListener);

            // Put the new option into the options-map
            this.opts[optionId] = {
               id: optionId,
               inputNode: inputNode,
               labelNode: labelNode,
               changeListener: changeListener,
               option: option
            };
         },

         /**
          * Get the current value(s) of this control
          *
          * @instance
          * @returns {object[]} The currently selected options
          */
         getValue: function alfresco_forms_controls_PushButtonsControl__getValue() {
            var values = [];
            array.forEach(this._getOpts(), function(opt) {
               opt.inputNode.checked && values.push(opt.option.value);
            }, this);
            return this.multiMode ? values : values[0];
         },

         /**
          * Fires when the value is changed.
          *
          * @instance
          */
         onValueChanged: function alfresco_forms_controls_PushButtonsControl__onValueChanged() {
            this._changeAttrValue("value", this.getValue());
         },

         /**
          * Remove the selected option from the control.
          *
          * @instance
          * @param {object} option The option to be removed
          */
         removeOption: function alfresco_forms_controls_PushButtonsControl__removeOption(option) {
            array.forEach(this._getOpts(), function(opt) {
               if (opt.option === option) {
                  delete this.opts[opt.id];
               }
            }, this);
         },

         /**
          * Resize the control
          *
          * @instance
          */
         resize: function alfresco_forms_controls_PushButtonsControl__resize() {
            domStyle.set(this.domNode, "lineHeight", isNaN(this.height) ? this.height : this.height + "px");
         },

         /**
          * <p>Set the value of the control. When not in [multi-value mode]{@link module:alfresco/forms/controls/PushButtonControl#multiMode},
          * the value must should be a single value, rather than an array.</p>
          * 
          * <p>All values in the array must be valid values for the control's
          * current options, or this function will do nothing.</p>
          *
          * @instance
          * @param {*} value The value to be set
          */
         setValue: function alfresco_forms_controls_PushButtonsControl__setValue(value) {

            // Discard null, undefined and empty-string values
            if (value === null || typeof value === "undefined") {
               this.alfLog("warn", "Invalid value passed to PushButtonsControl (" + value + ")");
               return;
            }

            // Make sure value is/isn't an array as appropriate
            var valueIsArray = value.constructor === Array;
            if (!this.multiMode && valueIsArray) {
               this.alfLog("error", "Value for single-value mode must not be array (value=" + JSON.stringify(value) + ")");
               return;
            }

            // Get valid values and normalise value to an array
            var opts = this._getOpts(),
               validValues = array.map(opts, function(opt) {
                  return opt.option.value;
               }, this),
               valuesToUse = value;
            if (!valueIsArray) {
               valuesToUse = [value];
            }

            // Check that all new values are valid
            var hasInvalidValues = array.some(valuesToUse, function(nextValue) {
               return array.indexOf(validValues, nextValue) === -1;
            });
            if (hasInvalidValues) {
               this.alfLog("error", "Supplied value " + JSON.stringify(value) + " does not match current option values: " + JSON.stringify(validValues));
               return;
            }

            // Set the values (and if we're in multi-mode then we deselect
            // the other values)
            array.forEach(opts, function(opt) {
               if (this.multiMode) {
                  opt.inputNode.checked = false;
               }
               if (array.indexOf(valuesToUse, opt.option.value) !== -1) {
                  opt.inputNode.checked = true;
               }
            }, this);

            // Fire a value-changed event
            this.onValueChanged();
         },

         /**
          * This internal function is a helper function used to coerce
          * the options map into an array of options objects.
          *
          * @instance
          * @returns {object[]} The option objects
          */
         _getOpts: function alfresco_forms_controls_PushButtonsControl___getOpts() {
            return array.map(Object.keys(this.opts), function(optionId) {
               return this.opts[optionId];
            }, this);
         }
      });
   }
);