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
 * @module alfresco/node/MetadataGroups
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/MetadataGroups.html",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "alfresco/layout/Twister",
        "alfresco/node/Metadata",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, 
                 /*jshint unused:false*/ Twister, /*jshint unused:false*/ Metadata,
                 lang, array, domConstruct, domClass, domStyle) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/MetadataGroups.css"}]
       */
      cssRequirements: [{cssFile:"./css/MetadataGroups.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,
      
      /**
       * 
       * @instance
       * @type {object]}
       * @default null
       */
      metadata: null,

      /**
       * 
       * @isntance
       * @param {object} group A single grouping of metadata properties to render 
       */
      addMetadata: function alfresco_node_MetadataGroups__addMetadata(widgets, metadata) {
         widgets.push({
            name: "alfresco/node/Metadata",
            config: {
               label: metadata.label || "",
               widgets: [
                  {
                     name: metadata.name,
                     config: metadata.config
                  }
               ]
            }
         });
      },

      /**
       * 
       * @isntance
       * @param {object} group A single grouping of metadata properties to render 
       */
      addMetadataGroup: function alfresco_node_MetadataGroups__addMetadataGroup(group) {
         if (group.title)
         {
            var widgets = [];
            array.forEach(group.widgets, lang.hitch(this, this.addMetadata, widgets));

            // TODO: Create the twister
            var groupNode = domConstruct.create("div", {}, this.domNode);
            this.createWidget({
               name: "alfresco/layout/Twister",
               config: {
                  label: group.title,
                  widgets: widgets
               }
            }, groupNode);
         }
      },

      /**
       * Processes the widgets into the content node.
       * 
       * @instance
       */
      postCreate: function alfresco_node_MetadataGroups__postCreate() {
         if (this.metadata)
         {
            array.forEach(this.metadata, lang.hitch(this, this.addMetadataGroup));
         }
      }
   });
});