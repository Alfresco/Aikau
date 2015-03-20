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
 * @module alfresco/forms/controls/MultipleEntryElement
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/core/Core",
        "dojo/text!./templates/MultipleEntryElement.html",
        "alfresco/core/ValueDisplayMapMixin",
        "alfresco/forms/PublishForm",
        "dojo/dom-class",
        "alfresco/forms/controls/TextBox"], 
        function(declare, _Widget, _Templated, CoreWidgetProcessing, AlfCore, template, ValueDisplayMapMixin, PublishForm, domClass) {
   
   return declare([_Widget, _Templated, CoreWidgetProcessing, AlfCore, ValueDisplayMapMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/MultipleEntryElement.css"}],
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      i18nRequirements: [{i18nFile: "./i18n/MultipleEntryElement.properties"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * The element configuration should be passed as a construction argument. It should provide a key
       * and a value to use for rendering the element.
       * 
       * @instance
       * @default null
       */
      elementConfig: null,
      
      /**
       * @instance
       */
      constructor: function alfresco_forms_controls_MultipleEntryElement__constructor(args) {
         declare.safeMixin(this, args);
         this.determineKeyAndValue();
      },
      
      /**
       * This is the default function for determining the unique key to identify the the element amongst its
       * peers. This function will most likely need to be overridden by extending classes that handle more
       * complex data types. 
       * 
       * @instance
       */
      determineKeyAndValue: function alfresco_forms_controls_MultipleEntryElement__determineKeyAndValue() {
         this.alfLog("log", "DetermineKeyAndValue", this);
         
         if (this.elementConfig !== null && this.elementConfig !== undefined)
         {
            // We're going to make sure that each element has a unique id. If the supplied configuration
            // does not include an id then we're going to create one now...
            if (this.elementConfig.fieldId === null || this.elementConfig.fieldId === undefined || this.elementConfig.fieldId === "") 
            {
               this.elementConfig.fieldId = this.generateUuid();
            }
            this.fieldId = this.elementConfig.fieldId;
            this.elementValue = this.elementConfig;
         }
         else
         {
            this.fieldId = this.generateUuid();
            this.elementValue = {};
            this.elementValue.fieldId = this.fieldId;
         }
      },

      /**
       * Calls the createReadDisplay and createEditDisplay functions to setup the edit and read modes for the element.
       * Those functions should be overridden directly to alter the appearance of the element.
       * 
       * @instance
       */
      postCreate: function alfresco_forms_controls_MultipleEntryElement__postCreate() {
         this.elementValue = this.getValue();
         this.createReadDisplay();
      },
      
      /**
       * The attribute to use from the value as the read only display. Defaults to "value".
       *
       * @instance
       * @type {string}
       * @default "value"
       */
      readDisplayAttribute: "value",

      /**
       * The default read display simply shows the value of the element.
       * 
       * @instance
       */
      createReadDisplay: function alfresco_forms_controls_MultipleEntryElement__createReadDisplay() {
         var hasReadDisplay = this.readDisplayAttribute !== null && this.readDisplayAttribute !== undefined;
         var attribute =  hasReadDisplay ? this.readDisplayAttribute : "value";
         var readDisplay = this.encodeHTML(this.elementValue[attribute]);
         readDisplay = this.mapValueToDisplayValue(readDisplay);
         this.readDisplay.innerHTML = readDisplay;
      },
      
      /**
       * A reference to the form widget that will be used to hold the controls for configuring
       * the rule definition.
       * 
       * @instance
       * @type {object}
       * @default null
       */
      form: null,
      
      /**
       * Creates a text box to capture the element value
       * @instance
       */
      createEditDisplay: function alfresco_forms_controls_MultipleEntryElement__createEditDisplay() {
         if (this.form === null || this.form === undefined)
         {
            // Create the form required
            var widgets = [
               {
                  name: "alfresco/forms/PublishForm",
                  assignTo: "form",
                  config: {
                     widgets: this.getFormWidgets()
                  }
               }
            ];
            this.processWidgets(widgets, this.editDisplay);   
            // The element is always created from the base widgets which does not actually provide any values
            // so it is important that the values are set afterwards...
            this.setFormValue(this.elementValue);
         }
         this.form.validate();
      },

      /**
       * Sets the value of the internal form.
       * 
       * @instance
       */
      setFormValue: function alfresco_forms_controls_MultipleEntryElement__setFormValue(value) {
         this.form.setValue(this.elementValue);
      },
      
      /**
       * Returns the widgets to be used in the form created for edit mode.
       * 
       * @instance
       * @returns {object[]}
       */
      getFormWidgets: function alfresco_forms_controls_MultipleEntryElement__getFormWidgets() {
         if (this.widgets)
         {
            return this.widgets;
         }
         else
         {
            return [
               {
                  // This is the hidden id and needs to be included to ensure that the id is persisted.
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     name: "fieldId",
                     label: "fieldId",
                     value: this.elementValue.fieldId,
                     visibilityConfig: {
                        initialValue: false
                     }
                  }
               },
               {
                  name: "alfresco/forms/controls/TextBox",
                  config: {
                     name: "value",
                     label: "multi.element.value.label",
                     description: "multi.element.value.description",
                     value: this.elementValue.value,
                     requirementConfig: {
                        initialValue: true
                     }
                  }
               }
            ];
         }
      },
      
      /**
       * Switches the visibility of the edit and read displays.
       * 
       * @instance
       * @param {boolean} switchToEdit Indicates whether or not to switch into edit mode
       * @param {boolean} saveChanges Indicates whether or not state changes should be saved.
       */
      editMode: function alfresco_forms_controls_MultipleEntryElement__editMode(switchToEdit, saveChanges) {
         if (switchToEdit)
         {
            this.createEditDisplay();
            domClass.remove(this.editDisplay, "hide");
            domClass.add(this.readDisplay, "hide");
         }
         else
         {
            // TODO: We should consider preventing exiting validation of edit mode (there are issues with this though,
            //       it's possible that the user may want to accept an entry that is invalid if it can be made valid
            //       via another entry.
            if (saveChanges)
            {
               // If the changes should be saved then the value from the form should be retrieved.
               this.elementValue = this.getValue();
            }
            this.createReadDisplay();
            domClass.add(this.editDisplay, "hide");
            domClass.remove(this.readDisplay, "hide");
         }
      },
      
      /**
       * @instance
       * @returns {object}
       */
      getValue: function alfresco_forms_controls_MultipleEntryElement__getValue() {
         var value = {};
         if (this.form !== null && this.form !== undefined) 
         {
            value = this.form.getValue();
         }
         else
         {
            value = this.elementValue;
         }
         return value; 
      },
      
      /**
       * Calls the "validate" function on form (if it exists) and returns the result.
       * 
       * @instance
       * @returns {boolean}
       */
      validate: function alfresco_forms_controls_MultipleEntryElement__validate() {
         var valid = true;
         if (this.form)
         {
            valid = this.form.validate();
         }
         return valid;
      }
   });
});