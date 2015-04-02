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
      "dojo/_base/lang",
      "dojo/dom-construct",
      "dojo/dom-style",
      "dojo/dom-class",
      "dojo/on",
      "dojo/text!./templates/MultiSelect.html"
   ],
   function(_TemplatedMixin, _WidgetBase, declare, lang, domConstruct, domStyle, domClass, on, template) {

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
          * The root class of this widget
          *
          * @protected
          * @instance
          * @type {string}
          */
         rootClass: "alfresco-forms-controls-MultiSelect",

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
          * Widget template has been turned into a DOM
          *
          * @override
          * @instance
          */
         buildRendering: function() {
            this.inherited(arguments);
            this.width && domStyle.set(this.domNode, "width", this.width);
         },

         /**
          * Widget has been created, but possibly not sub-widgets
          *
          * @override
          * @instance
          */
         postCreate: function() {
            this.inherited(arguments);
            this.own(on(this.searchBox, "focus", lang.hitch(this, this._onSearchFocus)));
            this.own(on(this.searchBox, "blur", lang.hitch(this, this._onSearchBlur)));
         },

         /**
          * Widget and sub-widgets have been created
          *
          * @override
          * @instance
          */
         startup: function() {
            this.inherited(arguments);
         },

         /**
          * Set the value of the control
          *
          * @instance
          * @param    {string[]} newValues The new values
          */
         setValue: function(newValue) {
            /*jshint unused:false*/
            // NOOP
         },

         _onSearchBlur: function() {
            domClass.remove(this.domNode, this.rootClass + "--focused");
         },

         _onSearchChange: function() {
            this.offScreenSearch.innerHTML = this.searchBox.value;
            var contentWidth = this.offScreenSearch.offsetWidth;
            domStyle.set(this.searchBox, "width", (contentWidth + 10) + "px");
         },

         _onSearchFocus: function() {
            domClass.add(this.domNode, this.rootClass + "--focused");
         },

         _onSearchKeyUp: function() {
            this._onSearchChange();
         }
      });
   }
);