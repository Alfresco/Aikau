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
 * @module alfresco/forms/controls/RadioButtons
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/RadioButton.html",
        "dojo/text!./templates/RadioButtons.html",
        "alfresco/core/Core",
        "dijit/form/RadioButton",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class"], 
        function(BaseFormControl, declare, _Widget, _Templated, RadioButtonTemplate, RadioButtonsTemplate, 
                 AlfCore, DojoRadioButton, lang, array, domConstruct, domClass) {
   
   // TODO: This should probably be moved to it's own module
   var RadioButton = declare([_Widget, _Templated, AlfCore], {
      
      /**
       * @instance
       * @type {string}
       */
      templateString: RadioButtonTemplate,
      
      /**
       * @instance
       */
      _radioButton: null,
      
      /**
       * @instance
       */
      postCreate: function alfresco_forms_controls_RadioButtons_RadioButton__postCreate() {
         this._radioButton = new DojoRadioButton({name: this.name, value: this.value});
         this._radioButton.placeAt(this._radioButtonNode);
         this._labelNode.innerHTML = this.encodeHTML(this.message(this.label));
      }
   });

   // TODO: This should probably be moved to it's own module
   var RadioButtons = declare([_Widget, _Templated, AlfCore], {
      
      /**
       * @instance
       * @type {string}
       */
      templateString: RadioButtonsTemplate,
      
      /**
       * @instance
       * @type {object[]}
       * @default null
       */
      options: null,
      
      /**
       * @instance
       */
      optionToWidget: null,
      
      /**
       * @instance
       */
      control: null,
      
      /**
       * @instance
       */
      currentValue: null,
      
      /**
       * @instance
       */
      lastValue: null,
      
      /**
       * @instance
       */
      postCreate: function alfresco_forms_controls_RadioButtons_RadioButtons__postCreate() {
         // Create an object to map each option value to the RadioButton that represents it...
         this.optionToWidget = {};
         if (this.options && this.options instanceof Array)
         {
            array.forEach(this.options, function(option) {
               if (typeof option.label === "string" && typeof option.value === "string")
               {
                  this.addOption(option);
               }
               else
               {
                  this.alfLog("log", "An option provided for a RadioButton was either missing a value or label", option);
               }
            }, this);
         }
         this.setValue(this.value);
      },
      
      /**
       * @instance
       * @param {object} option The option to add
       */
      addOption: function alfresco_forms_controls_RadioButtons_RadioButtons__addOption(option) {
         // Create and add a new RadioButton and record a reference to it...
         option.name = this.name; // Add the name to create the radio button "group" (TODO: Is this necessary for our purpose?)
         var rb = new RadioButton(option);
         rb.placeAt(this.containerNode);
         this.optionToWidget[option.value] = rb;
         rb._radioButton.on("change", lang.hitch(this, this.onButtonChange, rb));
      },

      /**
       * @instance
       * @param {object} radioButton The individual Radio Button that has changed state
       * @param {boolean} isChecked Indicates whether or not the button has been checked or not.
       */
      onButtonChange: function alfresco_forms_controls_RadioButtons_RadioButtons__onButtonChange(radioButton, isChecked) {
         if (isChecked)
         {
            this.currentValue = radioButton.value;
            this.control.formControlValueChange(this.name, this.lastValue, this.currentValue);
            this.control.validate();
         }
         else
         {
            this.lastValue = radioButton.value;
         }
      },
      
      /**
       * @instance
       */
      removeOption: function alfresco_forms_controls_RadioButtons_RadioButtons__removeOption(option) {
         if (typeof option.value === "string")
         {
            // Destroy the widget...
            var rb = this.optionToWidget[option.value];
            // TODO: Need to connect various events - such as when the radiobutton is selected
            //       We will need to capture the overall value of the widget.
            rb.destroy();
         }
      },
      
      /**
       * 
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function alfresco_forms_controls_RadioButtons_RadioButtons__setValue(value) {
         if (this.optionToWidget && (this.optionToWidget[value] === false || this.optionToWidget[value]))
         {
            this.optionToWidget[value]._radioButton.set("checked", true);
         }
      },

      /**
       * @instance
       */
      getValue: function alfresco_forms_controls_RadioButtons_RadioButtons__getValue() {
         for (var key in this.optionToWidget) {
            if (this.optionToWidget.hasOwnProperty(key))
            {
               var selected =  this.optionToWidget[key]._radioButton.get("checked");
               if (selected)
               {
                  return this.optionToWidget[key]._radioButton.getValue();
               }
            }
         }
      }
   });
   
   return declare([BaseFormControl], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/RadioButtons.css"}]
       */
      cssRequirements: [{cssFile:"./css/RadioButtons.css"}],

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_RadioButtons__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.id + "_CONTROL",
            name: this.name,
            options: this.options || [],
            control: this
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_RadioButtons__createFormControl(config) {
         // Create the inner class that we've defined above. The reason for doing this is that it
         // provides the standard widget API that the BaseFormControl is expecting...
         domClass.add(this.domNode, "alfresco-forms-controls-RadioButtons");
         return new RadioButtons(config);
      },

      /**
       * Sets the checked value of the RadioButtons.
       * 
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function alfresco_forms_controls_RadioButtons__setValue(value) {
         if (this.deferValueAssigment)
         {
            this.inherited(arguments);
         }
         else
         {
            if (this.wrappedWidget)
            {
               this.wrappedWidget.setValue(value);
            }
         }
      }
   });
});