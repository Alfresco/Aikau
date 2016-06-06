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
 * This a form control that wraps the [TinyMCE editor]{@link module:alfresco/editors/TinyMCE}.
 *
 * @module alfresco/forms/controls/TinyMCE
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/BaseFormControl",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/_base/lang"], 
        function(declare, BaseFormControl, CoreWidgetProcessing, lang) {
   
   return declare([BaseFormControl, CoreWidgetProcessing], {
      
      /**
       * This indicates whether or not the [TinyMCE editor]{@link module:alfresco/editors/TinyMCE}
       * should automatically resize to consume the available space.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.47
       */
      autoResize: false,

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
            contentChangeHandler: this.onEditorValueChange,
            autoResize: this.autoResize,
            editorConfig: this.editorConfig
         };
      },
      
      /**
       * Builds the configured [editor model]{@link module:alfresco/forms/controls/TinyMCE#widgetsForEditor}.
       * 
       * @instance
       */
      createFormControl: function alfresco_forms_controls_TinyMCE__createFormControl(config) {
         if (!this.widgetsForEditor || !this.widgetsForEditor[0])
         {
            this.alfLog("warn", "There is no 'widgetsForEditor' model defined, using default", this);
            this.widgetsForEditor = [
               {
                  name: "alfresco/editors/TinyMCE"
               }
            ];
         }
      
         // Clone the default model and mixin in the configured configuration into the declared model...
         var editorWidgets = lang.clone(this.widgetsForEditor);
         var declaredConfig = lang.getObject("0.config", true, editorWidgets);
         lang.mixin(declaredConfig, config);
         
         // Create the widget
         var editor = this.createWidget(editorWidgets[0]);
         return editor;
      },

      /**
       * This is a custom validator for this specific form control. It is necessary in order to support
       * the ability to check for the TinyMCE editor being empty as text (rather than as HTML).
       * 
       * @instance
       * @param {object} validationConfig The configuration for this validator
       * @since 1.0.70
       */
      textContentRequired: function alfresco_forms_controls_TinyMCE__textContentRequired(validationConfig) {
         var isValid = true;

         try
         {
            if (this.wrappedWidget && this.wrappedWidget.editor)
            {
               var textContent = this.wrappedWidget.editor.getContent({format: "text"});
               if (lang.trim(textContent) === "")
               {
                  isValid = false;
               }
            }
         }
         catch(e)
         {
            // NOTE: Development/testing experience has shown the requirement to wrap this code in a
            //       try/catch block to handle occasional TinyMCE errors. These errors do not present
            //       a problem to the validation flow (as it will typically repeat) but can throw the
            //       whole validation management out of whack if the exception is not captured here.
         }
         
         this.reportValidationResult(validationConfig, isValid);
      },

      /**
       * TinyMCE requires that the editor DOM element is in the document rather than in a fragment
       * so we delay initialising the editor until it is placed into the document.
       *
       * @instance
       */
      placeWidget: function alfresco_forms_controls_TinyMCE__placeWrappedWidget() {
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
         this.wrappedWidget.editor.on("keyup", lang.hitch(this, this.onEditorValueChange));
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
      alfDisabled: function alfresco_forms_controls_TinyMCE__alfDisabled(/*jshint unused:false*/ status) {
         this.inherited(arguments);
         if (this.wrappedWidget)
         {
            this.wrappedWidget.setDisabled(this._disabled);
         }
      },

      /**
       * This is the default model for creating the editor to be displayed. It provides a way in which
       * the default editor can be extended and used within the standard form control. The main reason 
       * for wanting to use a customized version of the [default TinyMCE editor]{@link module:alfresco/editors/TinyMCE} is
       * to provide custom callbacks for plugins. 
       * 
       * @instance
       * @type {object[]}
       * @since 1.0.66
       */
      widgetsForEditor: [
         {
            name: "alfresco/editors/TinyMCE"
         }
      ]
   });
});