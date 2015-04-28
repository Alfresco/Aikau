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
 * This module represents a single item to be rendered by the [AlfDetailedView]{@link module:alfresco/documentlibrary/views/AlfDetailedView}
 * module. For performance reasons, it has been hard-coded into a specific template and with custom widget information, to avoid needing to use
 * multiple layout widgets to achieve the same effect. For that reason, this module is unsuitable for extending.
 *
 * @module alfresco/documentlibrary/views/AlfDetailedViewItem
 * @extends module:alfresco/lists/views/layouts/Row
 * @author Martin Doyle
 */
define(["alfresco/lists/views/layouts/Row",
        "alfresco/renderers/Selector", 
        "dojo/_base/array", 
        "dojo/_base/lang", 
        "dojo/_base/declare", 
        "dojo/dom-class", 
        "dojo/text!./templates/AlfDetailedViewItem.html"], 
        function(Row, Selector, array, lang, declare, domClass, template) {

      return declare([Row], {

         /**
          * An array of the CSS files to use with this widget.
          *
          * @instance
          * @type {object[]}
          * @default [{cssFile:"./css/AlfDetailedViewItem.css"}]
          */
         cssRequirements: [{
            cssFile: "./css/AlfDetailedViewItem.css"
         }],

         /**
          * The HTML template to use for the widget.
          *
          * @instance
          * @type {String}
          */
         templateString: template,

         /**
          * Function run after widget created.
          *
          * @instance
          */
         postCreate: function alfresco_documentlibrary_views_AlfDetailedViewItem__postCreate() {

            // Don't break the chain
            this.inherited(arguments);

            // Handle conditional elements
            if (this.currentItem.workingCopy && this.currentItem.workingCopy.isWorkingCopy) {
               domClass.add(this.domNode, "alfresco-documentlibrary-views-AlfDetailedViewItem--working-copy");
            }

            // Build the widgets
            array.forEach(this.widgetsAndAttachPoints, function(widgetConfig) {

               // Create an instance of the config (so we can modify it)
               var configInstance = lang.clone(widgetConfig),
                  attachPointName = configInstance._attachPoint,
                  attachPoint = this[attachPointName],
                  renderWidget = !configInstance._render || configInstance._render.call(this, this.currentItem),
                  newWidget;

               // Make sure we should render this widget
               if (renderWidget) {

                  // Remove the "custom" properties on the widget config
                  delete configInstance._attachPoint;
                  delete configInstance._render;

                  // Create the widget
                  newWidget = this.createWidget(configInstance, attachPoint);

                  // Add an appropriate class to the widget
                  domClass.add(newWidget.domNode, "detail-item__" + attachPointName);

               } else {

                  // Remove the unused dom node
                  attachPoint.parentNode.removeChild(attachPoint);
               }
            }, this);
         },

         /**
          * A map of widget configs to be applied to attach points, where the key is the attach point and the value is the configuration for the widget.
          *
          * @protected
          * @type {Object}
          */
         widgetsAndAttachPoints: [{
            _attachPoint: "selector",
            name: "alfresco/renderers/Selector",
            config: {
               publishGlobal: false,
               publishToParent: true
            }
         }, {
            _attachPoint: "indicators",
            name: "alfresco/renderers/Indicators"
         }, {
            _attachPoint: "thumbnail",
            name: "alfresco/renderers/Thumbnail",
            config: {
               showDocumentPreview: true,
               publishGlobal: false,
               publishToParent: true
            }
         }, {
            _attachPoint: "lockedBanner",
            name: "alfresco/renderers/LockedBanner"
         }, {
            _attachPoint: "name",
            name: "alfresco/renderers/InlineEditPropertyLink",
            config: {
               propertyToRender: "node.properties.cm:name",
               postParam: "prop_cm_name",
               renderSize: "large"
            }
         }, {
            _attachPoint: "title",
            _render: function(item) {
               return item.node.properties["cm:title"];
            },
            name: "alfresco/renderers/InlineEditProperty",
            config: {
               propertyToRender: "node.properties.cm:title",
               postParam: "prop_cm_title",
               renderedValuePrefix: "(",
               renderedValueSuffix: ")"
            }
         }, {
            _attachPoint: "version",
            _render: function(item) {
               return !item.node.isContainer && !(item.workingCopy && item.workingCopy.isWorkingCopy);
            },
            name: "alfresco/renderers/Version",
            config: {
               onlyShowOnHover: true
            }
         }, {
            _attachPoint: "date",
            name: "alfresco/renderers/Date"
         }, {
            _attachPoint: "size",
            _render: function(item) {
               return !item.node.isContainer;
            },
            name: "alfresco/renderers/Size"
         }, {
            _attachPoint: "description",
            name: "alfresco/renderers/InlineEditProperty",
            config: {
               propertyToRender: "node.properties.cm:description",
               postParam: "prop_cm_description",
               warnIfNotAvailable: true,
               warnIfNoteAvailableMessage: "no.description.message"
            }
         }, {
            _attachPoint: "tags",
            _render: function(item) {
               return !(item.workingCopy && item.workingCopy.isWorkingCopy);
            },
            name: "alfresco/renderers/Tags",
            config: {
               propertyToRender: "node.properties.cm:taggable",
               postParam: "prop_cm_taggable",
               warnIfNotAvailable: true,
               warnIfNoteAvailableMessage: "no.tags.message"
            }
         }, {
            _attachPoint: "category",
            _render: function(item) {
               return item.node.properties["cm:categories"];
            },
            name: "alfresco/renderers/Category"
         }, {
            _attachPoint: "favourite",
            _render: function(item) {
               return !(item.workingCopy && item.workingCopy.isWorkingCopy);
            },
            name: "alfresco/renderers/Favourite"
         }, {
            _attachPoint: "like",
            _render: function(item) {
               return !(item.workingCopy && item.workingCopy.isWorkingCopy);
            },
            name: "alfresco/renderers/Like"
         }, {
            _attachPoint: "comments",
            _render: function(item) {
               return !(item.workingCopy && item.workingCopy.isWorkingCopy);
            },
            name: "alfresco/renderers/Comments",
            config: {
               subscriptionTopic: "ALF_GET_COMMENTS_SUCCESS",
               publishTopic: "ALF_REVEAL_COMMENTS",
               publishPayload: {}
            }
         }, {
            _attachPoint: "quickShare",
            _render: function(item) {
               return !item.node.isContainer && !(item.workingCopy && item.workingCopy.isWorkingCopy);
            },
            name: "alfresco/renderers/QuickShare"
         }, {
            _attachPoint: "commentsReveal",
            name: "alfresco/layout/VerticalReveal",
            config: {
               subscriptionTopic: "ALF_REVEAL_COMMENTS",
               widgets: [{
                  name: "alfresco/renderers/CommentsList"
               }]
            }
         }, {
            _attachPoint: "actions",
            name: "alfresco/renderers/Actions",
            config: {
               publishGlobal: false,
               publishToParent: true
            }
         }]
      });
   });