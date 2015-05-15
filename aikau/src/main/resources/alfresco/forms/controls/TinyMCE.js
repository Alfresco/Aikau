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
 * This a form control that wraps the [TinyMCE editor]{@link module:alfresco/editors/TinyMCE}.
 *
 * @module alfresco/forms/controls/TinyMCE
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "alfresco/editors/TinyMCE"], 
        function(BaseFormControl, declare, TinyMCE) {
   
   return declare([BaseFormControl], {
      
      /**
       * Returns the configuration to use for the widget.
       *
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_TinyMCE__getWidgetConfig() {
         return {
            id : this.generateUuid(),
            name: this.name,
            initialContent: this.value,
            initiallyDisabled: (this.disablementConfig && this.disablementConfig.initialValue === true),
            immediateInit: false,
            contentChangeScope: this,
            contentChangeHandler: this.onEditorValueChange
         };
      },
      
      /**
       * Creates a new instance of the [TinyMCE editor]{@link module:alfresco/editors/TinyMCE}.
       * 
       * @instance
       */
      createFormControl: function alfresco_forms_controls_TinyMCE__createFormControl(config) {
         var editor = new TinyMCE(config);
         return editor;
      },

      /**
       * TinyMCE requires that the editor DOM element is in the document rather than in a fragment
       * so we delay initialising the editor until it is placed into the document.
       *
       * @instance
       */
      placeWidget: function alfresco_forms_controls_BaseFormControl__placeWrappedWidget() {
         this.inherited(arguments);
         this.wrappedWidget.init();
      },

      /**
       * Overrides to prevent any action from occurring. Editor value change handlers are passed in
       * the configuration of the TinyMCE editor creation.
       * 
       * @instance
       */
      setupChangeEvents: function alfresco_forms_controls_TinyMCE__setupChangeEvents() {
         // No action.
      },

      /**
       * This is the aspect handler hitched in the [setupChangeEvents]{@link module:alfresco/forms/controls/TinyMCE#setupChangeEvents}
       * function and retrieves the current value of the [TinyMCE editor]{@link module:alfresco/editors/TinyMCE}
       * and calls the [onValueChangeEvent]{@link module:alfresco/forms/controls/BaseFormControl#onValueChangeEvent}
       * function with it.
       * 
       * @instance
       */
      onEditorValueChange: function alfresco_forms_controls_TinyMCE__onEditorValueChange(/*jshint unused:false*/ evt) {
         var value = this.wrappedWidget.getValue();
         this.onValueChangeEvent(this.name, this.lastValue, value);
         this.lastValue = value;
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/forms/controls/BaseFormControl#alfDisabled}
       * to make the TinyMCE editor disabled.
       * 
       * @instance
       * @param {boolean} status Indicates the current status
       */
      alfDisabled: function alfresco_forms_controls_BaseFormControl__alfDisabled(/*jshint unused:false*/ status) {
         this.inherited(arguments);
         if (this.wrappedWidget)
         {
            this.wrappedWidget.setDisabled(this._disabled);
         }
      }
   });
});