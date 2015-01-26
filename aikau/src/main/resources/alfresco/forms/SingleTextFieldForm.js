/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * <p>This extends the basic [form]{@link module:alfresco/forms/Form} to provide a simple single text entry
 * form. It was originally written to support the basic search requests. One of the key features is that
 * it listens for the user hitting the enter key when focus is on the text field so that it is not necessary
 * for them to explicitly tab to or click on the "OK" button.</p>
 * 
 * @module alfresco/forms/SingleTextFieldForm
 * @extends module:alfresco/forms/Form
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/Form",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/on",
        "alfresco/forms/controls/DojoValidationTextBox"], 
        function(declare, Form, lang, domClass, on, DojoValidationTextBox) {
   
   return declare([Form], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/SingleTextFieldForm.css"}]
       */
      cssRequirements: [{cssFile:"./css/SingleTextFieldForm.css"}],

      /**
       * Override the default attribute to hide the cancel button
       * 
       * @instance
       * @type {boolean}
       * @default false
       */
      showCancelButton: false,

      /**
       * This is the icon class to pass onto the text field.
       *
       * @instance
       * @type {string}
       * @default null
       */
      textBoxIconClass: null,

      /**
       * This can be set to a string of additional CSS classes to apply to the text field
       *
       * @instance
       * @type {string}
       * @default null
       */
      textBoxCssClasses: null,

      /**
       * Can be set to provide a label for the text box
       *
       * @instance
       * @type {string}
       * @default null
       */
      textBoxLabel: null,

      /**
       * This is the 'name' of the text field that will be used as an attribute in the form value
       * published on clicking on the "OK" button or hitting the enter key
       *
       * @instance
       * @type {string}
       * @default null
       */
      textFieldName: null,
      
      /**
       * Overridden to set the "widgets" attribute to be a single text box.
       *
       * @instance
       */
      postMixInProperties: function alfresco_forms_SingleTextFieldForm__postMixInProperties() {
         this.widgets = [
            {
               name: "alfresco/forms/controls/DojoValidationTextBox",
               assignTo: "entryField",
               config: {
                  label: (this.textBoxLabel != null) ? this.message(this.textBoxLabel) : "",
                  name: this.textFieldName,
                  requirementConfig: {
                     initialValue: true
                  },
                  iconClass: (this.textBoxIconClass != null) ? this.textBoxIconClass : "",
                  additionalCssClasses: (this.textBoxCssClasses != null) ? this.textBoxCssClasses : ""
               }
            }
         ];
      },

      /**
       * Extended to add an additional CSS class to the widget DOM to ensure that the modules CSS is applied
       * 
       * @instance
       */
      postCreate: function alfresco_forms_SingleTextFieldForm__postCreate() {
         domClass.add(this.domNode, "alfresco-forms-SingleTextFieldForm");
         this.inherited(arguments);
      },

      /**
       * Extended to connect keyup events (when the key is enter) to click the 
       * submit button
       *
       * @instance
       * @param {array} widgets The widgets instantiated
       */
      allWidgetsProcessed: function alfresco_forms_SingleTextFieldForm__allWidgetsProcessed(widgets) {
         this.inherited(arguments);
         on(this.entryField, "keyup", lang.hitch(this, function(evt) {
            if (evt.keyCode == 13)
            {
               if (this.okButton && this.okButton.get("disabled") === false)
               {
                  this.okButton.onClick();
               }
            }
         }));
      }
   });
});