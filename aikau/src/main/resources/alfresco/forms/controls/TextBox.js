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
 * This is the basic text box form control. It extends the [BaseFormControl]
 * {@link module:alfresco/forms/controls/BaseFormControl} and supports the standard
 * form control configuration. It addition it supports the additional configuration 
 * attribute [placeHolder]{@link module:alfresco/forms/controls/TextBox#placeHolder} 
 * that can be used to assign place holder text when no value has been specified.
 * 
 * @module alfresco/forms/controls/TextBox
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @mixes module:alfresco/forms/controls/utilities/TextBoxValueChangeMixin
 * @mixes module:alfresco/forms/controls/utilities/IconMixin
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "alfresco/forms/controls/utilities/TextBoxValueChangeMixin",
        "alfresco/forms/controls/utilities/IconMixin",
        "dojo/_base/declare",
        "dijit/form/ValidationTextBox",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(BaseFormControl, TextBoxValueChangeMixin, IconMixin, declare, ValidationTextBox, lang, domClass) {
   
   return declare([BaseFormControl, TextBoxValueChangeMixin, IconMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/TextBox.css"}],

      /**
       *
       * @instance
       * @type {string}
       * @default null
       */
      placeHolder: null,

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_TextBox__getWidgetConfig() {
         // Return the configuration for the widget
         var placeHolder = (this.placeHolder) ? this.message(this.placeHolder) : "";
         return {
            id : this.generateUuid(),
            name: this.name,
            placeHolder: placeHolder,
            iconClass: this.iconClass
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_TextBox__createFormControl(config, /*jshint unused:false*/ domNode) {
         var textBox = new ValidationTextBox(config);
         // Handle adding classes
         var additionalCssClasses = "";
         if (this.additionalCssClasses)
         {
            additionalCssClasses = this.additionalCssClasses;
         }
         domClass.add(this.domNode, "alfresco-forms-controls-TextBox " + additionalCssClasses);
         this.addIcon(textBox);
         return textBox;
      }
   });
});