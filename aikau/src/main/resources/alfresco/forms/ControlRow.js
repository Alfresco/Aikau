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
 * <p>This module provides a way in which [form controls]{@link module:alfresco/forms/controls/BaseFormControl}
 * can be horizontally aligned within a [form]{@link module:alfresco/forms/Form}. It extends the
 * [horizontal widgets layout widget]{@link module:alfresco/layout/HorizontalWidgets} to gain the layout, dimensions
 * and resizing capabilities and aliases the expected functions to iterate over all the
 * [form controls]{@link module:alfresco/forms/controls/BaseFormControl} that it may have processed.</p>
 * <p>When using this widget in a dialog you should make sure to configure it to have
 * a [fixedWidth]{@link module:alfresco/dialogs/AlfDialog#fixedWidth} - this can also be configured in the
 * when using the [DialogService]{@link module:alfresco/services/DialogService}.</p>
 *
 * @example <caption>Example control row with a title and description</caption>
 * {
 *   name: "alfresco/forms/ControlRow",
 *   config: {
 *      title: "About",
 *      description: "Essential information about the user",
 *      widgets: [
 *        {
 *          name: "alfresco/forms/controls/TextBox",
 *          config: {
 *            name: "name",
 *            label: "Name"
 *          }
 *        },
 *        {
 *          name: "alfresco/forms/controls/TextArea",
 *          config: {
 *            name: "address",
 *            label: "Address"
 *          }
 *        }
 *      ]
 *   }
 * }
 * 
 * @module alfresco/forms/ControlRow
 * @extends module:alfresco/layout/HorizontalWidgets,
 * @mixes module:alfresco/forms/LayoutMixin
 * @author Dave Draper
 */
define(["alfresco/layout/HorizontalWidgets",
        "alfresco/forms/LayoutMixin",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class"], 
        function(HorizontalWidgets, LayoutMixin, declare, lang, array, domConstruct, domClass) {
   
   return declare([HorizontalWidgets, LayoutMixin], {
      
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
       * @default
       */
      widgetMarginLeft: 0,

      /**
       * This is the size of margin (in pixels) that will appear to the right of every widget added. 
       *
       * @instance
       * @type {number}
       * @default
       */
      widgetMarginRight: 30,

      /**
       * The title to display above the row of form controls. This can be used to break up groups of 
       * form controls.
       *
       * @instance
       * @type {string}
       * @default
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
         // Before calling inherited (which will process the widgets), ensure
         // they are populated with the showValidationErrorsImmediately value
         if (this.widgets) {
            array.forEach(this.widgets, function(widget) {
               if (widget && widget.config) {
                  widget.config.showValidationErrorsImmediately = this.showValidationErrorsImmediately;
               }
            }, this);
         }
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
      }
   });
});