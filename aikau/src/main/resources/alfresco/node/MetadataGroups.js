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
 * This widget provides a way in which the metadata from a given node can be displayed in 
 * one or more groups. Each group should be provided with its own title along with a
 * "widgets" array defining all the metadata properties to be rendered in that group. This
 * allows complete control over what metadata properties are displayed, the order that they
 * are displayed and the renderer to display their values. The most basic read-only value
 * renderer used is most likely to be the [Property]{@link module:alfresco/renderers/Property}
 * widget.
 *
 * @example <caption>Basic configuration of a single group rendering two properties</caption>
 * {
 *   name: "alfresco/node/MetadataGroups",
 *   config: {
 *     groups: [
 *       {
 *         title: "Audio Details",
 *         widgets: [
 *           {
 *             label: "Artist",
 *             name: "alfresco/renderers/Property",
 *             config: {
 *               propertyToRender: "node.properties.audio:artist"
 *             }
 *           },
 *           {
 *             label: "Genre",
 *             name: "alfresco/renderers/Property",
 *             config: {
 *               propertyToRender: "node.properties.audio:genre"
 *             }
 *           }
 *         ]
 *       }
 *     ]
 *   }
 * }
 * 
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
       * An array of groups of metadata to be rendered.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      groups: null,

      /**
       * When a specific [width]{@link module:alfresco/node/MetadataGroups#width} is configured then this atttribute
       * can be used to define what ratio the width of the label should be to the width of the value. This should be
       * a percentage figure (the % symbol should not be included) between 1 and 99.
       *
       * @instance
       * @type {number}
       * @default
       */
      labelToValueRatio: 30,

      /**
       * Indicates whether or not each group should be separated by a standard horizontal border line. Defaults
       * to false.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      separated: false,

      /**
       * An optional width of the displayed metadata groups. If not configured then the width will be that of
       * the standard [Twister]{@link module:alfresco/layout/Twister} which is defined by the 
       * "@sidebar-component-width" LESS variable. This is expected to be a value in pixels (the "px" units
       * suffix should not be included).
       *
       * @instance
       * @type {number}
       * @default
       */
      width: "initial",

      /**
       * Constructs a new [metadata item]{@link module:alfresco/node/Metadata} for the metadata configuration
       * provided and then adds it to the supplied array.
       * 
       * @instance
       * @param {string} idPrefix The identifier of the parent to use as a prefix
       * @param {object[]} widgets An array to add the new metadata widget to
       * @param {object} group A single grouping of metadata properties to render 
       */
      addMetadata: function alfresco_node_MetadataGroups__addMetadata(idPrefix, widgets, metadata) {
         var id = (idPrefix && metadata.id) ? (idPrefix + "_"  + metadata.id) : null;
         widgets.push({
            id: id,
            name: "alfresco/node/Metadata",
            config: {
               labelWidth: this._labelWidth,
               valueWidth: this._valueWidth,
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
       * Calls the [addMetadata]{@link module:alfresco/node/MetadataGroups#addMetadata} for each
       * "widgets" attribute defined in the group to construct the individual
       * [metadata item widget]{@link module:alfresco/node/Metadata} and then creates a single
       * [twister]{@link module:alfresco/layout/Twister} containing all the requested metadata
       *
       * @instance
       * @param {object} group A single grouping of metadata properties to render 
       */
      addMetadataGroup: function alfresco_node_MetadataGroups__addMetadataGroup(group) {
         if (group.title)
         {
            var id = (this.id && group.id) ? (this.id + "_" + group.id) : null;

            var widgets = [];
            array.forEach(group.widgets, lang.hitch(this, this.addMetadata, id, widgets));

            var additionalCssClasses = this.separated ? "separated" : "";
            
            var groupNode = domConstruct.create("div", {}, this.domNode);
            this.createWidget({
               id: id,
               name: "alfresco/layout/Twister",
               config: {
                  width: this.width,
                  additionalCssClasses: additionalCssClasses,
                  label: group.title,
                  widgets: widgets
               }
            }, groupNode);
         }
      },

      /**
       * Processes any custom width values to ensure that labels and values of each 
       * [metadata item]{@link module:alfresco/node/Metadata} have the correct widths
       * according to the configured [labelToValueRatio]{@link module:alfresco/node/MetadataGroups#labelToValueRatio}.
       * It then iterates over the configured [groups]{@link module:alfresco/node/MetadataGroups#groups} and calls the
       * [addMetadataGroup]{@link module:alfresco/node/MetadataGroups#addMetadataGroup} to add each group
       * into a [twister]{@link module:alfresco/layout/Twister}.
       * 
       * @instance
       */
      postCreate: function alfresco_node_MetadataGroups__postCreate() {
         if (this.width)
         {
            domStyle.set(this.domNode, "width", this.width);
            if (this.labelToValueRatio)
            {
               var ratio = parseInt(this.labelToValueRatio, 10);
               if (isNaN(ratio) || ratio < 1 || ratio > 99) {
                  this._labelWidth = "49%";
                  this._valueWidth = "49%";
               }
               else
               {
                  // Need to give the elements some breathing room so we need to knockoff a %...
                  this._labelWidth = (ratio - 1) + "%";
                  this._valueWidth = (100 - ratio - 1) + "%";
               }
            }
         }
         if (this.groups)
         {
            array.forEach(this.groups, lang.hitch(this, this.addMetadataGroup));
         }
      }
   });
});