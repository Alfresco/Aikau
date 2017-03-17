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
define(["alfresco/forms/controls/BaseFormControl",
        "alfresco/forms/controls/utilities/TextBoxValueChangeMixin",
        "alfresco/forms/controls/utilities/IconMixin",
        "dojo/_base/declare",
        "alfresco/forms/controls/TextBoxControl",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(BaseFormControl, TextBoxValueChangeMixin, IconMixin, declare, TextBoxControl, lang, domClass) {
   
   return declare([BaseFormControl, TextBoxValueChangeMixin, IconMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {Array}
       */
      cssRequirements: [{cssFile:"./css/TextBox.css"}],

      /**
       * <p>Whether to enable autocomplete on the textbox. Be aware that this can cause issues in two ways. Firstly, change events are not
       * reliably fired by browsers when they autofill fields. Secondly, it may cause problems if set to true on textbox sub-components which
       * would normally verify user-inputs and control them. The default (null) will leave the autocomplete as "off", as per the Dojo defaults.</p>
       *
       * <p><strong>NOTE:</strong> Although one would normally override this with a setting of "on", consideration should be given to instead
       * using a more suitable HTML5-accepted value, such as "username" or "email". A full list of the possible values can be found on
       * the [WHATWG reference page]{@link https://html.spec.whatwg.org/multipage/forms.html#autofill} and further explanation of many of them
       * is available on the [MDN input page]{@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input}.</p>
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.45
       */
      autocomplete: null,

      /**
       * The placeholder to be used (will use native HTML5 if available).
       * 
       * @instance
       * @type {string}
       * @default
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
            autocomplete: this.autocomplete,
            placeHolder: placeHolder,
            iconClass: this.iconClass
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_TextBox__createFormControl(config, /*jshint unused:false*/ domNode) {
         var textBox = new TextBoxControl(config);
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