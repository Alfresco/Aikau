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
 * <p>This is the basic text box form control. It extends the [BaseFormControl]
 * {@link module:alfresco/forms/controls/BaseFormControl} and supports the standard
 * form control configuration. It addition it supports the additional configuration 
 * attribute [placeHolder]{@link module:alfresco/forms/controls/TextBox#placeHolder} 
 * that can be used to assign place holder text when no value has been specified.</p>
 * <p>The following additionalCssClasses are built in and can be included if required:</p>
 * <ul>
 * <li><strong>biggerBolder</strong>: The TextBox is rendered with a bigger, bold font</li>
 * <li><strong>radius</strong>: The TextBox is given radius corners</li>
 * </ul>
 * 
 * @module alfresco/forms/controls/TextBox
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @mixes module:alfresco/forms/controls/utilities/TextBoxValueChangeMixin
 * @mixes module:alfresco/forms/controls/utilities/IconMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/TextBox",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/MdlTextBox.html",
        "alfresco/core/Core"], 
        function(declare, TextBox, _WidgetBase, _TemplatedMixin, template, Core) {

   var InnerTextBox = declare([_WidgetBase, _TemplatedMixin, Core], {
      
      /**
       * @instance
       * @type {string}
       */
      templateString: template,
      
      postMixInProperties: function aikau_forms_controls_MdlTextBox_Textbox__postMixInProperties() {
         this.id = this.id ? (this.id + "_INNER") : this.generateUuid();
      },

      /**
       * 
       * @instance
       * @param {object} value The value to set.
       */
      setValue: function aikau_forms_controls_MdlTextBox_Textbox__setValue(value) {
         this.inputNode.value = value;
      },

      /**
       * @instance
       */
      getValue: function aikau_forms_controls_MdlTextBox_Textbox__getValue() {
         return this.inputNode.value;
      }
   });
   
   return declare([TextBox], {
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_TextBox__createFormControl(config, /*jshint unused:false*/ domNode) {
         var textBox = new InnerTextBox(config);
         return textBox;
      },

      setupChangeEvents: function alfresco_forms_controls_TextBox__setupChangeEvents() {
         this.inherited(arguments);
         /* global componentHandler */
         componentHandler.upgradeElement(this.wrappedWidget.domNode);
      }
   });
});