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
 * This module has been created to be used by the [MetadataGroups]{@link module:alfresco/node/MetadataGroups}
 * widget to render a single metadata property with a [label]{@link module:alfresco/node/Metadata#label} and a 
 * value renderer. The value renderer should be defined by the [widgets]{@link module:alfresco/node/Metadata#widgets}
 * array. The most basic value renderer is expected to be the [Property]{@link module:alfresco/renderers/Property}
 * widget.
 * 
 * @module alfresco/node/Metadata
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Metadata.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/dom-style"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, domStyle) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/Metadata.css"}]
       */
      cssRequirements: [{cssFile:"./css/Metadata.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * The label for the metadata property. An attempt will be made to find a localized version
       * of the configured label so providing NLS property keys is acceptable.
       *
       * @instance
       * @type {string}
       * @default
       */
      label: null,

      /**
       * An optional width for the metadata labels. Units should be included. 
       *
       * @instance
       * @type {string}
       * @default
       */
      labelWidth: null,

      /**
       * An optional width for the metadata values. Units should be included. 
       *
       * @instance
       * @type {string}
       * @default
       */
      valueWidth: null,

      /**
       * The widgets to use to render the metadata value.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgets: null,

      /**
       * Process the configured [label]{@link module:alfresco/node/Metadata#label} to ensure
       * that a label is defined and attempt to find a localized version of that label.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_node_Metadata__postMixInProperties() {
         if (!this.label)
         {
            this.label = "";
         }
         this.label = this.message(this.label);
      },

      /**
       * Processes the widgets into the content node.
       * 
       * @instance
       */
      postCreate: function alfresco_node_Metadata__postCreate() {
         if (this.labelWidth)
         {
            domStyle.set(this.labelNode, "width", this.labelWidth);
         }
         if (this.valueWidth)
         {
            domStyle.set(this.valueNode, "width", this.valueWidth);
         }
         this.processWidgets(this.widgets, this.valueNode);
      }
   });
});