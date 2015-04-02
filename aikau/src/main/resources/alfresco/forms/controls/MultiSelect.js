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
 * @module alfresco/forms/controls/MultiSelect
 * @extends external:dijit/_TemplatedMixin
 * @extends external:dijit/_WidgetBase
 * @author Martin Doyle
 */
define([
      "dijit/_TemplatedMixin",
      "dijit/_WidgetBase",
      "dojo/_base/declare",
      "dojo/dom-construct",
      "dojo/text!./templates/MultiSelect.html"
   ],
   function(_TemplatedMixin, _WidgetBase, declare, domConstruct, template) {

      return declare([_WidgetBase, _TemplatedMixin], {

         /**
          * An array of the CSS files to use with this widget.
          *
          * @instance
          * @type {object[]}
          * @default [{cssFile:"./css/MultiSelect.css"}]
          */
         cssRequirements: [{
            cssFile: "./css/MultiSelect.css"
         }],

         /**
          * The HTML template to use for the widget.
          *
          * @override
          * @instance
          * @type {String}
          */
         templateString: template,

         /**
          * Placeholder text to use if no items are selected and no search string is present
          *
          * @type {string}
          */
         placeholder: null,

         /**
          * Constructor
          *
          * @override
          * @instance
          */
         constructor: function() {
            window.alfMs = this;
         },

         /**
          * Set the value of the control
          *
          * @instance
          * @param    {string} newValue The new value
          */
         setValue: function(newValue) {
            // NOOP
         }

      });
   }
);