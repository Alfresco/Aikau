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
 * An extension of the native Dijit control, that permits altering some inherited
 * code, in order to fix bugs and/or add features.
 *
 * @module alfresco/forms/controls/TextBoxControl
 * @extends external:dijit/form/ValidationTextBox
 * @author Martin Doyle
 * @since 1.0.45
 */
define(["alfresco/core/Core", 
        "dijit/form/ValidationTextBox", 
        "dojo/_base/declare"], 
        function(Core, ValidationTextBox, declare) {

   // We only want to run this once
   var supportsPlaceholder = document.createElement("input").placeholder === "";

   return declare([ValidationTextBox], {

      /**
       * Whether to enable autocomplete on the textbox. Further details available against the
       * [alfresco/forms/controls/TextBox property]{@link module:alfresco/forms/controls/TextBox#autocomplete}.
       *
       * @instance
       * @type {string}
       * @default
       */
      autocomplete: null,

      /**
       * Run after the widget has been created.
       *
       * @instance
       * @override
       */
      postCreate: function alfresco_forms_controls_TextBoxControl__postCreate() {
         this.inherited(arguments);
         if(this.autocomplete) {
            this.textbox && this.textbox.setAttribute("autocomplete", this.autocomplete);
         }
      },

      /**
       * If we can use native placeholder, use it instead of the Dojo one.
       *
       * @instance
       * @override
       * @param {string} placeholderValue The placeholder value.
       */
      _setPlaceHolderAttr: function alfresco_forms_controls_TextBoxControl___setPlaceHolderAttr(placeholderValue) {
         if (supportsPlaceholder) {
            this.textbox.placeholder = placeholderValue;
         } else {
            this.inherited(arguments);
         }
      }
   });
});