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
 * An input control that offers the functionality of radio-buttons or checkboxes (depending
 * on [the mode]{@link module:alfresco/forms/controls/PushButtonsControl#multiMode}, rendered as a
 * single control with push-button options.
 *
 * @module alfresco/forms/controls/PushButtonsControl
 * @extends external:dijit/_WidgetBase
 * @mixes external:dijit/_TemplatedMixin
 * @mixes external:dijit/_FocusMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/ObjectProcessingMixin
 * @author Martin Doyle
 * @since 1.0.44
 */
define(["alfresco/core/Core", 
        "alfresco/core/ObjectProcessingMixin", 
        "dijit/_FocusMixin", 
        "dijit/_TemplatedMixin", 
        "dijit/_WidgetBase", 
        "dojo/_base/array", 
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/dom-class", 
        "dojo/dom-construct", 
        "dojo/dom-style", 
        "dojo/on", 
        "dojo/text!./templates/PushButtonsControl.html"], 
        function(Core, ObjectProcessingMixin, _FocusMixin, _TemplatedMixin, _WidgetBase, array, declare, lang, domClass, domConstruct, domStyle, on, template) {

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
          * The ID of this control
          *
          * @instance
          * @type {string}
          * @default
          */
         id: null,

         /**
          * <p>The maximum number of choices selectable by the user. This will always
          * be one in single-item mode. Attempts to select an item once this limit
          * has been reached will result in the oldest selection being deselected.
          * If the value is 0 (the default), then there will be no forced limit on
          * the number of choices in multi-item mode.</p>
          *
          * <p><strong>NOTE:</strong> The accessibility of this control relies on
          * the fact that, underneath, it's backed by either radio buttons or
          * checkboxes. The use of this property can make checkboxes behave like
          * radio buttons, and so its accessibility could be affected.</p>
          *
          * @instance
          * @type {number}
          * @default
          * @since 1.0.65
          */
         maxChoices: 0,

         /**
          * Maximum number of buttons on a line (zero means no limit)
          *
          * @instance
          * @type {number}
          * @default
          */
         maxLineLength: 0,

         /**
          * The minimum padding to apply to the side of the buttons. This is
          * ignored on fixed-width controls.
          *
          * @instance
          * @type {number}
          * @default
          */
         minPadding: 50,

         /**
          * Whether to run the control in multi-value mode (i.e. behave like
          * checkboxs rather than the default radio-buttons behaviour).
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
          * Disable line-wrap on the labels if set to true.
          *
          * @instance
          * @type {boolean}
          * @default
          */
         noWrap: false,

         /**
          * Local store of the current control options, as an ordered
          * collection of option objects.
          *
          * @instance
          * @type {object[]}
          * @readonly
          * @default
          */
         opts: null,

         /**
          * The gap (margin) to have between buttons, expressed as a percentage
          * of the total width of the control.
          *
          * @instance
          * @type {number}
          * @default
          */
         percentGap: 1,

         /**
          * A FIFO queue of selections that is active only in multi-item mode when
          * maxChoices is not zero, and will be used to deselect oldest selections
          * when the maxChoices is exceeeded.
          *
          * @instance
          * @type {Object[]}
          * @default
          * @since 1.0.65
          */
         selections: null,

         /**
          * When the simple layout is selected control of the layout of buttons is surrendered
          * to the default behaviour. This means that buttons are not of equal widths and 
          * will fill the available space as best they can. Enabling this feature disables
          * [width]{@link module:alfresco/forms/controls/PushButtonsControl#width},
          * [percentGap]{@link module:alfresco/forms/controls/PushButtonsControl#percentGap},
          * [noWrap]{@link module:alfresco/forms/controls/PushButtonsControl#noWrap} and
          * [maxLineLength]{@link module:alfresco/forms/controls/PushButtonsControl#maxLineLength}.
          * 
          * @instance
          * @type {boolean}
          * @default
          * @since 1.0.72
          */
         simpleLayout: false,

         /**
          * The total width of the control in pixels. Zero indicates that
          * the control should take as much space as needed.
          *
          * @instance
          * @type {number}
          * @default
          */
         width: 0,

         /**
          * Constructor
          *
          * @instance
          */
         constructor: function() {
            this.opts = [];
            this.selections = [];
         },

         /**
          * Widget has been created (but not necessarily sub-widgets)
          *
          * @instance
          * @override
          */
         postCreate: function alfresco_forms_controls_PushButtonsControl__postCreate() {
            this.inherited(arguments);
            if (this.multiMode) {
               domClass.add(this.domNode, this.rootClass + "--multi-mode");
            }
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
            var optionAlreadyExists = array.some(this.opts, function(opt) {
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
                  type: this.multiMode ? "checkbox" : "radio",
                  value: option.value
               }, this.domNode),
               labelNode = domConstruct.create("label", {
                  "for": optionId, // Quoted because reserved word
                  className: this.rootClass + "__label"
               }, this.domNode),
               labelContentNode = domConstruct.create("div", {
                  className: this.rootClass + "__label__content"
               }, labelNode);

            // Add the label content (just text initially)
            var labelText = (option.label || option.name || option.value);
            labelContentNode.textContent = labelText;
            labelNode.setAttribute("title", labelText);

            // Setup change-listener
            var changeListener = on(inputNode, "change", lang.hitch(this, this._onInputChanged));
            this.own(changeListener);

            // Put the new option into the options-map
            this.opts.push({
               id: optionId,
               inputNode: inputNode,
               labelNode: labelNode,
               labelContentNode: labelContentNode,
               changeListener: changeListener,
               option: option
            });

            // Resize the buttons
            this.resize();
         },

         /**
          * Get the current options
          *
          * @instance
          * @override
          * @returns {object[]} The current options
          */
         getOptions: function alfresco_forms_controls_PushButtonsControl__getOptions() {
            return array.map(this.opts, function(opt) {
               return opt.option;
            });
         },

         /**
          * Get the current value(s) of this control
          *
          * @instance
          * @returns {object[]} The currently selected options
          */
         getValue: function alfresco_forms_controls_PushButtonsControl__getValue() {
            var values = [];
            array.forEach(this.opts, function(opt) {
               opt.inputNode.checked && values.push(opt.option.value);
            }, this);
            return this.multiMode ? values : values[0];
         },

         /**
          * Remove the selected option from the control.
          *
          * @instance
          * @param {object} option The option to be removed
          */
         removeOption: function alfresco_forms_controls_PushButtonsControl__removeOption(option) {

            // Remove the option
            this.opts = array.filter(this.opts, function(opt) {
               return opt.option !== option;
            });

            // Resize the buttons
            this.resize();
         },

         /**
          * Resize the control
          *
          * @instance
          */
         resize: function alfresco_forms_controls_PushButtonsControl__resize() {

            if (this.simpleLayout)
            {
               domClass.add(this.domNode, "alfresco-forms-controls-PushButtonsControl--simple-layout");
            }
            else
            {
               // Set overall control width
               domStyle.set(this.domNode, "width", isNaN(this.width) ? this.width : this.width + "px");
            
               // Set the width of each button
               var buttonsPerLine = this.maxLineLength ? Math.min(this.maxLineLength, this.opts.length) : this.opts.length;
               var gapsPerLine = buttonsPerLine - 1;
               var availButtonPercent = 100 - (gapsPerLine * this.percentGap);
               var buttonWidthPercent = availButtonPercent / buttonsPerLine;
               
               array.forEach(this.opts, function(opt, buttonIndex) {
                  var indexInRow = buttonIndex % buttonsPerLine;
                  var lastInRow = indexInRow + 1 === buttonsPerLine;
                  var isFirstRow = buttonIndex < buttonsPerLine;
                  domStyle.set(opt.labelNode, {
                     width: buttonWidthPercent + "%",
                     marginTop: isFirstRow ? 0 : this.percentGap + "%",
                     marginRight: lastInRow ? 0 : this.percentGap + "%",
                     whiteSpace: this.noWrap ? "nowrap" : "normal"
                  });
               }, this);

               // If width not hard-coded, set the width of the control based on the content plus padding
               if (!this.width) 
               {
                  var maxLabelWidth = 0;
                  array.forEach(this.opts, function(opt) {
                     maxLabelWidth = Math.max(maxLabelWidth, opt.labelContentNode.scrollWidth);
                  });
                  var minLineLength = (maxLabelWidth + this.minPadding) * buttonsPerLine / (availButtonPercent / 100);
                  domStyle.set(this.domNode, "width", Math.ceil(minLineLength) + "px");
               }
            }
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
               this.alfLog("warn", "setValue() not completed as invalid value passed to PushButtonsControl (" + value + ")");
               return;
            }

            // Make sure value is/isn't an array as appropriate
            var valueIsArray = value.constructor === Array;
            if (!this.multiMode && valueIsArray) {
               this.alfLog("warn", "setValue() not completed as value for single-value mode must not be array (value=" + JSON.stringify(value) + ")");
               return;
            }

            // Make sure the maxChoices value prevents setting too many values
            if (valueIsArray && this.maxChoices && value.length > this.maxChoices) {
               this.alfLog("warn", "setValue() not completed as number of values (" + value.length + ") exceeds max-choices setting (" + this.maxChoices + ")");
               return;
            }

            // Get valid values and normalise value to an array
            var validValues = array.map(this.opts, function(opt) {
                  return opt.option.value;
               }, this),
               valuesToUse = value;
            if (!valueIsArray) {
               valuesToUse = [value];
            }

            // Check that all new values are valid
            var hasInvalidValues = array.some(valuesToUse, function(nextValueToUse) {
               return !validValues.some(function(nextValidValue) {
                  return nextValidValue === nextValueToUse;
               });
            });
            if (hasInvalidValues) {
               this.alfLog("warn", "setValue() not completed as supplied value " + JSON.stringify(value) + " does not match current option values: " + JSON.stringify(validValues));
               return;
            }

            // Set the values (and if we're in multi-mode then we deselect the other values)
            array.forEach(this.opts, function(opt) {
               var checkedBefore = opt.inputNode.checked;
               if (this.multiMode) {
                  opt.inputNode.checked = false;
               }
               if (array.indexOf(valuesToUse, opt.option.value) !== -1) {
                  opt.inputNode.checked = true;
               }
               if (opt.inputNode.checked !== checkedBefore) {
                  on.emit(opt.inputNode, "change", {
                     bubbles: true,
                     cancelable: true
                  });
               }
            }, this);
         },

         /**
          * Fires when the value is changed.
          *
          * @instance
          * @param {Object} evt The change event
          * @since 1.0.65
          */
         _onInputChanged: function alfresco_forms_controls_PushButtonsControl___onInputChanged(evt) {
            var input = evt.target,
               isSelected = input.checked,
               nodeToDeselect;
            if (this.multiMode && this.maxChoices) {
               var newSelections = this.selections.slice();
               if (isSelected) {
                  newSelections.push(input);
                  if (newSelections.length > this.maxChoices) {
                     nodeToDeselect = newSelections.shift();
                     nodeToDeselect.checked = false;
                     on.emit(nodeToDeselect, "change", {
                        bubbles: true,
                        cancelable: true
                     });
                  }
               } else {
                  newSelections = newSelections.filter(function(selectedNode) {
                     return selectedNode !== input;
                  });
               }
               this.selections = newSelections;
            }
            this._changeAttrValue("value", this.getValue());
         }
      });
   }
);