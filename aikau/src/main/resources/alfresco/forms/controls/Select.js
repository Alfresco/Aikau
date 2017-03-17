/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * <p>This control uses the standard Dojo Select control to provide a normal dropdown control.</p>
 *
 * <p>It's possible to constrain the width of the dropdown to the width of the control (for long
 * options), by using the forceWidth config option set to true. Additionally, long options can be
 * forced to remain on one line and then be truncated (with an ellipsis) by using forceWidth and
 * truncate options both set to true in the config.</p>
 * 
 * @module alfresco/forms/controls/Select
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "dijit/form/Select",
        "dijit/focus",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-class",
        "dojo/dom-attr",
        "dojo/dom-style",
        "dojo/aspect"], 
        function(BaseFormControl, declare, Select, focusUtil, lang, array, domClass, domAttr, domStyle, aspect) {

    /**
    * This is a customization of the default dijit/form/Select implementation to support
    * AKU-467, specifically letting forceWidth truncate option values.
    */
   var CustomSelect = declare([Select], {

      /**
       * Overridden to allow forceWidth to work according to the
       * requirements of AKU-467
       * 
       * @instance
       * @override
       */
      openDropDown: function alfresco_forms_controls_Select_CustomSelect__openDropDown() {
         this.inherited(arguments);
         if (this.forceWidth && this.truncate) {
            var dropdown = this.dropDown.domNode;
            if (dropdown) {
               var definedWidth = parseInt(dropdown.style.width, 10);
               if (!isNaN(definedWidth)) {
                  domClass.add(dropdown, "truncate");
                  domStyle.set(dropdown, {
                     maxWidth: definedWidth + "px"
                  });
               }
            }
         }
      },

      /**
       * Overridden to ensure the label is always set in full in the
       * title attribute when truncating the options
       *
       * @instance
       * @override
       * @param {Object} option The option object
       * @returns {Object} An appropriate menu item
       */
      _getMenuItemForOption: function(option) {
         var menuItem = this.inherited(arguments);
         if (this.truncate && this.forceWidth && option.label) {
            menuItem.domNode.title = option.label;
         }
         return menuItem;
      }
   });
   
  return declare([BaseFormControl], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Select.css"}]
       */
      cssRequirements: [{cssFile:"./css/Select.css"}],

      /**
       * Adds a new option to the wrapped widget.
       *
       * @instance
       * @override
       * @param {object} option The option to add
       * @param {number} index The index of the option to add
       */
      addOption: function alfresco_forms_controls_Select__addOption(option, /*jshint unused:false*/ index) {
         // Dijit Select widget does not support empty values! https://bugs.dojotoolkit.org/ticket/9973
         if (option.value === "") {
            this.alfLog("error", "Attempted to add option with empty value", option);
         } else {
            this.inherited(arguments);
         }
      },

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_Select__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.id + "_CONTROL",
            name: this.name,
            forceWidth: this.forceWidth,
            truncate: this.truncate
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_Select__createFormControl(config) {
         var select = new CustomSelect(config);
         
         this.additionalCssClasses = this.additionalCssClasses || "";

         // See AKU-353: Update the created Select menu so that its popup menu DOM node also contains any
         // configured additionalCssClasses and update each option DOM node so that it's value is available via
         // CSS selector.
         var handle = aspect.after(select, "openDropDown", lang.hitch(this, function(returnVal, /*jshint unused:false*/ originalArgs) {
            handle.remove();
            if (this.additionalCssClasses && lang.exists("wrappedWidget.dropDown._popupWrapper", this))
            {
               domClass.add(this.wrappedWidget.dropDown._popupWrapper, this.additionalCssClasses);
            }

            array.forEach(this.wrappedWidget.dropDown.getChildren(), function(child, index) {
               domAttr.set(child.domNode, "data-value", this.options[index].value);
            }, this);
         }));
         domClass.add(this.domNode, "alfresco-forms-controls-Select " + this.additionalCssClasses);
         return select;
      },

      /**
       * Extends the inherited function to ensure that each option label is encoded to prevent potential
       * XSS attacks.
       * 
       * @instance
       * @param {object} option The option configuration
       * @param {number} index The index of the option
       */
      processOptionLabel: function alfresco_forms_controls_Select__processOptionLabel(option, /*jshint unused:false*/ index) {
         this.inherited(arguments);
         if (option.label)
         {
            option.label = this.encodeHTML(option.label);
         }
      }
   });
});