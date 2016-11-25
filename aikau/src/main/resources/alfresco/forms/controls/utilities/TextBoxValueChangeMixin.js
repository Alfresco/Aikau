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
 * This mixin should be used by any text box type form control that wants to perform validation
 * on each key press rather than waiting for focus to move away from the form control.
 * 
 * @module alfresco/forms/controls/utilities/TextBoxValueChangeMixin
 * @author Dave Draper
 */
define(["alfresco/core/topics",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/keys"], 
        function(topics, declare, lang, keys) {

   return declare([], {

      /**
       * The topic to publish on when the ENTER key is pressed (optional).
       *
       * @instance
       * @type {string}
       * @default module:alfresco/core/topics#ENTER_KEY_PRESSED
       * @since 1.0.49
       */
      publishTopicOnEnter: topics.ENTER_KEY_PRESSED,

      /**
       * This will be set to the last known value of the text box before the current keyup event.
       * 
       * @instance
       * @type {string}
       * @default
       */
      _oldValue: null,
      
      /**
       * This is used as a temporary buffer variable to keep track of changes to the old value. 
       * 
       * @instance
       * @type {string}
       * @default
       */
      __oldValue: null,

      /**
       * Handle key-up events.
       *
       * @instance
       * @param {object} evt Dojo-normalised event object
       * @since 1.0.49
       */
      handleKeyUp: function alfresco_forms_controls_utilities_TextBoxValueChangeMixin__handleKeyUp(evt) {
         // On key up events indicate that the user has changed the field, this means that 
         // error messages can be displayed without relying on focus being lost
         this._hadUserUpdate = true;
         
         if (this.publishTopicOnEnter && evt.keyCode === keys.ENTER) 
         {
            this.alfPublish(this.publishTopicOnEnter, {
               fieldId: this.id
            });
            evt.preventDefault();
         } 
         else 
         {
            this._oldValue = this.__oldValue; // Set the old value as the last buffer...
            this.__oldValue = this.getValue(); // Make the last buffer the current value being set

            // See AKU-1121 - only validate on actual changes...
            if (this._oldValue !== this.__oldValue)
            {
               this.alfLog("log", "keyup - OLD value: " + this._oldValue + ", NEW value: " + this.getValue());
               this.formControlValueChange(this.name, this._oldValue, this.getValue());
               this.validate();
            }
         }
      },

      /**
       * Fires a change event if necessary.
       *
       * @instance
       * @param {string} name The name of the changing property
       * @param {*} oldValue The old value
       * @param {*} newValue The new value
       * @since 1.0.49
       */
      fireChangeEvent: function alfresco_forms_controls_utilities_TextBoxValueChangeMixin__fireChangeEvent(name, oldValue, newValue) {
         if (oldValue !== newValue && newValue !== this.__oldValue) {
            this.onValueChangeEvent(name, oldValue, newValue);
         }
      },

      /**
       * Overrides the default change events to use blur events on the text box. This is done so that we can validate
       * on every single keypress. However, we need to keep track of old values as this information is not readily
       * available from the text box itself.
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_utilities_TextBoxValueChangeMixin__setupChangeEvents() {
         if (this.wrappedWidget)
         {
            this.wrappedWidget.on("keyup", lang.hitch(this, this.handleKeyUp));
            // Paste event is called before the pasted value is applied to the source element - we use a setTimeout
            // to catch the value on the next time around the browser event loop. This is a little messy but works
            // consistently on all supported browsers.
            this.wrappedWidget.on("paste", lang.hitch(this, function() {
               setTimeout(lang.hitch(this, function() {
                  this.handleKeyUp({keyCode:0});
               }), 0);
            }));
            if (typeof this.wrappedWidget.watch === "function")
            {
               this.own(this.wrappedWidget.watch("value", lang.hitch(this, this.fireChangeEvent)));
            } 
         }
      }
   });
});