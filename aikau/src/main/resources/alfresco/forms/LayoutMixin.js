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
 * This module can be mixed into modules that extend layout controls such as 
 * [AlfTabContainer]{@link module:alfresco/layout/AlfTabContainer} to create layout widgets that can
 * be used in forms. It aliases the functions that a [Form]{@link module:alfresco/forms/Form} expects
 * to find in immediate descendent widgets and makes the necessary calls to its children. By default
 * the children are expected to be found in the 
 * [_processedWidgets]{@link module:alfresco/core/CoreWidgetProcessing#_processedWidgets} attribute
 * but if this is not the case then the 
 * [getFormLayoutChildren]{@link module:alfresco/forms/LayoutMixin#getFormLayoutChildren} should be overridden
 * to return the form controls that the layout widget contains.
 * 
 * @module alfresco/forms/LayoutMixin
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["alfresco/core/Core",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/when"], 
        function(AlfCore, declare, lang, array, when) {
   
   return declare([AlfCore], {
      
      /**
       * Iterates over the child form controls and updates their visibility status
       *
       * @instance
       * @param {boolean} status The boolean value to change the visibility state to.
       * @since 1.0.83
       */
      alfVisible: function alfresco_forms_LayoutMixin__alfVisible(status) {
         when(this.getFormLayoutChildren(), lang.hitch(this, function(children) {
            array.forEach(children, function(child) {
               if (typeof child.alfVisible === "function")
               {
                  child.alfVisible(status);
               }
            }, this);
         }));
      },

      /**
       * Iterates over the child form controls and updates their requirement status
       *
       * @instance
       * @param {boolean} status The boolean value to change the requirement state to
       * @since 1.0.83
       */
      alfRequired: function alfresco_forms_LayoutMixin__alfRequired(status) {
         when(this.getFormLayoutChildren(), lang.hitch(this, function(children) {
            array.forEach(children, function(child) {
               if (typeof child.alfRequired === "function")
               {
                  child.alfRequired(status);
               }
            }, this);
         }));
      },

      /**
       * Iterates over the child form controls and updates their disablement status
       *
       * @instance
       * @param {boolean} status The boolean status to set the disablity state of the field to.
       * @since 1.0.83
       */
      alfDisabled: function alfresco_forms_LayoutMixin__alfDisabled(status) {
         when(this.getFormLayoutChildren(), lang.hitch(this, function(children) {
            array.forEach(children, function(child) {
               if (typeof child.alfDisabled === "function")
               {
                  child.alfDisabled(status);
               }
            }, this);
         }));
      },

      /**
       * Sets up the rules for groups visibility, requirement and disablement.
       *
       * @instance
       * @param {boolean} status The boolean status to set the disablity state of the field to.
       * @since 1.0.83
       */
      postMixInProperties: function alfresco_forms_LayoutMixin__postMixInProperties() {
         this.inherited(arguments);
         this.processConfig("alfVisible", this.visibilityConfig);
         this.processConfig("alfRequired", this.requirementConfig);
         this.processConfig("alfDisabled", this.disablementConfig);
      },

      /**
       * Iterates over the array of processed widgets and adds the value of each to the supplied object
       *
       * @instance
       * @param {object} values The object to set with the values from each form control
       */
      addFormControlValue: function alfresco_forms_LayoutMixin__addFormControlValue(values) {
         when(this.getFormLayoutChildren(), lang.hitch(this, function(children) {
            array.forEach(children, lang.hitch(this, this.addChildFormControlValue, values));
         }));
      },

      /**
       * 
       * @instance
       * @param {object} values The object to set with the value of the supplied widget
       * @param {object} widget The widget to get the value from
       * @param {number} index The index of the widget
       */
      addChildFormControlValue: function alfresco_forms_LayoutMixin__addChildFormControlValue(values, widget, /*jshint unused:false*/ index) {
         if (typeof widget.addFormControlValue === "function")
         {
            widget.addFormControlValue(values);
         }
      },

      /**
       * Returns the children to iterate over. Each child is expected to be a form control.
       *
       * @instance
       * @return {object[]} An array of the form controls to iterate over.
       */
      getFormLayoutChildren: function alfresco_forms_LayoutMixin__getFormLayoutChildren() {
         return this.getProcessedWidgets();
      },

      /**
       * Iterates over the child form controls and publishes the value of each one.
       * 
       * @instance
       * @param {Deferred} [deferred] A deferred object can optionally be passed. This will only be resolved as widget value
       */
      publishValue: function alfresco_forms_LayoutMixin__publishValue(deferred) {
         when(this.getFormLayoutChildren(), lang.hitch(this, function(children) {
            array.forEach(children, lang.hitch(this, this.publishChildValue, deferred));
         }));
      },

      /**
       * This is called by the [publishValue]{@link module:alfresco/forms/ControlRow#publishValue} function for each
       * of the child form controls in the row and calls its 
       * [publishValue]{@link module:alfresco/forms/controls/BaseFormControl#publishValue} function.
       * 
       * @instance
       * @param {Deferred} [deferred] A deferred object can optionally be passed. This will only be resolved as widget value
       * @param {object} widget The widget to validate
       * @param {number} index The index of the widget to validate
       */
      publishChildValue: function alfresco_forms_LayoutMixin__publishChildValue(deferred, widget, /*jshint unused:false*/ index) {
         if (typeof widget.publishValue === "function")
         {
            widget.publishValue(deferred);
         }
      },

      /**
       * 
       * @instance
       * @param {object} values The object to set the each form control value from
       * @param {boolean} initialization Indicates whether this call is part of the initialization of the containing form
       */
      updateFormControlValue: function alfresco_forms_LayoutMixin__addFormControlValue(values, initialization) {
         when(this.getFormLayoutChildren(), lang.hitch(this, function(children) {
            array.forEach(children, lang.hitch(this, this.updateChildFormControlValue, values, initialization));
         }));
      },

      /**
       * 
       * @instance
       * @param {object} values The object to set with the value of the supplied widget
       * @param {boolean} initialization Indicates whether this call is part of the initialization of the containing form
       * @param {object} widget The widget to get the value from
       * @param {number} index The index of the widget
       */
      updateChildFormControlValue: function alfresco_forms_LayoutMixin__updateChildFormControlValue(values, initialization, widget, /*jshint unused:false*/ index) {
         if (typeof widget.addFormControlValue === "function")
         {
            widget.updateFormControlValue(values, initialization);
         }
      },

      /**
       * Iterates over the child form controls and validates each one.
       * 
       * @instance
       */
      validateFormControlValue: function alfresco_forms_LayoutMixin__validateFormControlValue() {
         when(this.getFormLayoutChildren(), lang.hitch(this, function(children) {
            array.forEach(children, lang.hitch(this, this.validateChildFormControlValue));
         }));
      },

      /**
       *
       * @instance
       * @param {object} widget The widget to validate
       * @param {number} index The index of the widget to validate
       */
      validateChildFormControlValue: function alfresco_forms_LayoutMixin__validateChildFormControlValue(widget, /*jshint unused:false*/ index) {
         if (typeof widget.validateFormControlValue === "function")
         {
            widget.validateFormControlValue();
         }
      }
   });
});