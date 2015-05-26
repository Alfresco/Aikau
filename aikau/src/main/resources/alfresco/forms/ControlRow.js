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
 * This module provides a way in which [form controls]{@link module:alfresco/forms/controls/BaseFormControl}
 * can be horizontally aligned within a [form]{@link module:alfresco/forms/Form}. It extends the
 * [horizontal widgets layout widget]{@link module:alfresco/layout/HorizontalWidgets} to gain the layout, dimensions
 * and resizing capabilities and aliases the expected functions to iterate over all the
 * [form controls]{@link module:alfresco/forms/controls/BaseFormControl} that it may have processed.
 * 
 * @module alfresco/forms/ControlRow
 * @extends module:alfresco/layout/HorizontalWidgets
 * @author Dave Draper
 */
define(["alfresco/layout/HorizontalWidgets",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class"], 
        function(HorizontalWidgets, declare, lang, array, domConstruct, domClass) {
   
   return declare([HorizontalWidgets], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/ControlRow.css"}]
       */
      cssRequirements: [{cssFile:"./css/ControlRow.css"}],

      /**
       * This is the size of margin (in pixels) that will appear to the left of every widget added. 
       *
       * @instance
       * @type {number}
       * @default null
       */
      widgetMarginLeft: 0,

      /**
       * This is the size of margin (in pixels) that will appear to the right of every widget added. 
       *
       * @instance
       * @type {number}
       * @default null
       */
      widgetMarginRight: 30,

      /**
       * The title to display above the row of form controls. This can be used to break up groups of 
       * form controls.
       *
       * @instance
       * @type {string}
       * @default null
       */
      title: null,

      /**
       * Extends the [inherited function]{@link module:alfresco/layout/HorizontalWidgets#postMixInProperties} to
       * ensure that the title is translated.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_forms_ControlRow__postMixInProperties() {
         this.inherited(arguments);
         if (this.title && lang.trim(this.title) !== "")
         {
            this.title = this.message(this.title);
         }
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/layout/HorizontalWidgets#postCreate} to add
       * in a field set label if configured.
       * 
       * @instance
       */
      postCreate: function alfresco_forms_ControlRow__postCreate() {
         this.inherited(arguments);
         domClass.add(this.domNode, "alfresco-forms-ControlRow");
         var hasDescription = false;
         if (this.description && lang.trim(this.description) !== "")
         {
            hasDescription = true;
            this.description = this.message(this.description);
            domConstruct.create("div", {
               innerHTML: this.description,
               className: "description border"
            }, this.domNode, "first");
         }
         if (this.title && lang.trim(this.title) !== "")
         {
            domConstruct.create("div", {
               innerHTML: this.title,
               className: "title" + (hasDescription ? "" : " border")
            }, this.domNode, "first");
         }
      },

      /**
       * Iterates over the array of processed widgets and adds the value of each to the supplied object
       *
       * @instance
       * @param {object} values The object to set with the values from each form control
       */
      addFormControlValue: function alfresco_forms_ControlRow__addFormControlValue(values) {
         array.forEach(this._processedWidgets, lang.hitch(this, this.addChildFormControlValue, values));
      },

      /**
       * 
       * @instance
       * @param {object} values The object to set with the value of the supplied widget
       * @param {object} widget The widget to get the value from
       * @param {number} index The index of the widget
       */
      addChildFormControlValue: function alfresco_forms_ControlRow__addChildFormControlValue(values, widget, /*jshint unused:false*/ index) {
         if (typeof widget.addFormControlValue === "function")
         {
            widget.addFormControlValue(values);
         }
      },

      /**
       * 
       * @instance
       * @param {object} values The object to set the each form control value from
       */
      updateFormControlValue: function alfresco_forms_ControlRow__addFormControlValue(values) {
         array.forEach(this._processedWidgets, lang.hitch(this, this.updateChildFormControlValue, values));
      },

      /**
       * 
       * @instance
       * @param {object} values The object to set with the value of the supplied widget
       * @param {object} widget The widget to get the value from
       * @param {number} index The index of the widget
       */
      updateChildFormControlValue: function alfresco_forms_ControlRow__updateChildFormControlValue(values, widget, /*jshint unused:false*/ index) {
         if (typeof widget.addFormControlValue === "function")
         {
            widget.updateFormControlValue(values);
         }
      },

      /**
       * Iterates over the child form controls and validates each one.
       * 
       * @instance
       */
      validateFormControlValue: function alfresco_forms_ControlRow__validateFormControlValue() {
         array.forEach(this._processedWidgets, lang.hitch(this, this.validateChildFormControlValue));
      },

      /**
       *
       * @instance
       * @param {object} widget The widget to validate
       * @param {number} index The index of the widget to validate
       */
      validateChildFormControlValue: function alfresco_forms_ControlRow__validateChildFormControlValue(widget, /*jshint unused:false*/ index) {
         if (typeof widget.validateFormControlValue === "function")
         {
            widget.validateFormControlValue();
         }
      },

      /**
       * Iterates over the child form controls and publishes the value of each one.
       * 
       * @instance
       * @param {Deferred} [deferred] A deferred object can optionally be passed. This will only be resolved as widget value
       */
      publishValue: function alfresco_forms_ControlRow__publishValue(deferred) {
         array.forEach(this._processedWidgets, lang.hitch(this, this.publishChildValue, deferred));
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
      publishChildValue: function alfresco_forms_ControlRow__publishChildValue(deferred, widget, /*jshint unused:false*/ index) {
         if (typeof widget.publishValue === "function")
         {
            widget.publishValue(deferred);
         }
      }
   });
});