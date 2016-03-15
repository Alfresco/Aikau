/*jshint maxlen:false*/
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
 * A dashlet for use on a dashboard. It can be used in JSON page models if configured with
 * a widgets definition. Otherwise it can be extended to define specific views.
 *
 * By passing in certain pre-supported classes to the additionalCssClasses config property, it's
 * possible add padding to the body. The current available padding classes are smallpad (4px
 * padding), mediumpad (10px padding - recommended) and largepad (16px padding).
 *
 * @example <caption>Sample configuration</caption>
 * {
 *    name: "alfresco/dashlets/Dashlet",
 *    id: "MY_DASHLET",
 *    config: {
 *       additionalCssClasses: "mediumpad",
 *       bodyHeight: 300,                             // Specify the initial height of the body
 *       componentId: "component.valid-dashlet",      // A valid component ID (for Share height persistence)
 *       pubSubScope: "DASHLET_SCOPE_",
 *       title: "My Dashlet",
 *       widgetsForTitleBarActions: [
 *          {
 *             name: "alfresco/html/Label",
 *             config: {
 *                label: "Title-bar actions"
 *             }
 *          }
 *       ],
 *       widgetsForToolbar: [
 *          {
 *             name: "alfresco/html/Label",
 *             config: {
 *                label: "Toolbar"
 *             }
 *          }
 *       ],
 *       widgetsForToolbar2: [
 *          {
 *             name: "alfresco/html/Label",
 *             config: {
 *                label: "Toolbar2"
 *             }
 *          }
 *       ],
 *       widgetsForBody: [
 *          {
 *             name: "alfresco/html/Label",
 *             config: {
 *                label: "Collaboratively administrate empowered markets via plug-and-play networks. Dynamically procrastinate B2C users after installed base *benefits. Dramatically visualize customer directed convergence without revolutionary ROI. Efficiently unleash cross-media information wit*hout *cross-media value. Quickly maximize timely deliverables for real-time schemas. Dramatically maintain clicks-and-mortar solutions without *functional solutions. Completely synergize resource sucking relationships via premier niche markets. Professionally cultivate one-to-one *customer service with robust ideas. Dynamically innovate resource-leveling customer service for state of the art customer service."
 *             }
 *          }
 *       ]
 *    }
 * }
 *  
 * @module alfresco/dashlets/Dashlet
 * @extends external:dijit/_WidgetBase
 * @extends module:alfresco/core/ResizeMixin
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing*
 * @mixes module:alfresco/services/_DashletServiceTopicMixin
 * @author Erik Winlöf
 * @author Martin Doyle
 */
define(["dojo/_base/declare",
      "dijit/_WidgetBase",
      "dijit/_TemplatedMixin",
      "dojo/text!./templates/Dashlet.html",
      "alfresco/core/Core",
      "alfresco/core/CoreWidgetProcessing",
      "alfresco/core/ResizeMixin",
      "alfresco/core/topics",
      "alfresco/services/_DashletServiceTopicMixin",
      "dojo/_base/lang",
      "dojo/_base/array",
      "dojo/dom-construct",
      "dojo/dom-class",
      "dojo/dom-style",
      "jquery",
      "jqueryui"
   ],
   function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing,
      ResizeMixin, topics, _DashletServiceTopicMixin, lang, array, domConstruct, domClass, domStyle, $) {

      return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, ResizeMixin, _DashletServiceTopicMixin], {

         /**
          * Id that will be used to store properties for this dashlet
          * i.e. the dashlet height when using the resizer.
          *
          * @instance
          * @type {string}
          */
         componentId: null,

         /**
          * The base css class to use for this widget
          *
          * @instance
          * @type {string}
          * @default
          */
         baseClass: "alfresco-dashlets-Dashlet",

         /**
          * A second css class for sub classes of this widget to use to be able to target
          * specifics in such dashlets.
          *
          * @instance
          * @type {string}
          * @default
          */
         subClass: "",

         /**
          * The i18n scope to use for this widget
          *
          * @instance
          * @type {string}
          */
         i18nScope: "alfresco.dashlets.Dashlet",

         /**
          * An array of the i18n files to use with this widget.
          *
          * @instance
          * @type {object[]}
          * @default [{i18nFile: "./i18n/Dashlet.properties"}]
          */
         i18nRequirements: [{
            i18nFile: "./i18n/Dashlet.properties"
         }],

         /**
          * An array of the CSS files to use with this widget.
          *
          * @instance cssRequirements {Array}
          * @type {object[]}
          * @default [{cssFile:"./css/Dashlet.css"}]
          */
         cssRequirements: [{
            cssFile: "./css/Dashlet.css"
         }],

         /**
          * The HTML template to use for the widget.
          * @instance
          * @type {String}
          */
         templateString: template,

         /**
          * Config that makes it possible to dynamically update the title.
          * Should be supplied in the format of
          * {
          *    titleConfig: {
          *       topic: "SOME_TOPIC",
          *       attribute: "path.to.topic.payload.attribute"
          *    }
          * }
          *
          * If there is no attribute present the entire payload value will be used as the title.
          *
          * @instance
          * @type {object}
          */
         titleConfig: null,

         /**
          * Widgets to place as title bar actions.
          *
          * @instance
          * @type {object[]}
          */
         widgetsForTitleBarActions: null,

         /**
          * Widgets to place in the first toolbar
          *
          * @instance
          * @type {object[]}
          */
         widgetsForToolbar: null,

         /**
          * Widgets to place in the second toolbar
          *
          * @instance
          * @type {object[]}
          */
         widgetsForToolbar2: null,

         /**
          * Widgets to place in the body
          *
          * @instance
          * @type {object[]}
          */
         widgetsForBody: null,

         /**
          * Explicit height in pixels of the dashlet body
          *
          * @instance
          * @type {number}
          * @default
          */
         bodyHeight: null,

         /**
          * Whether resizing of this dashlet is disabled
          *
          * @type {boolean}
          * @default
          */
         resizeDisabled: false,

         /**
          * Implements the widget life-cycle method to add drag-and-drop upload capabilities to the root DOM node.
          * This allows files to be dragged and dropped from the operating system directly into the browser
          * and uploaded to the location represented by the document list.
          *
          * @instance
          */
         postCreate: function alfresco_dashlets_Dashlet__postCreate() {
            this.processContainer(this.widgetsForTitleBarActions, this.titleBarActionsNode);
            this.processContainer(this.widgetsForToolbar, this.toolbarNode);
            this.processContainer(this.widgetsForToolbar2, this.toolbar2Node);
            if (this.bodyHeight) {
               domStyle.set(this.bodyNode, "height", this.bodyHeight + "px");
            }
            this.processContainer(this.widgetsForBody, this.bodyWidgetsNode);
            if (this.componentId && !this.resizeDisabled) {
               // Only make it resizable if a componentId has been provided, otherwise it will not be persisted correctly
               $(this.bodyNode).resizable({
                  handles: {
                     "s": this.resizeNode
                  },
                  resize: lang.hitch(this, this.onResize),
                  stop: lang.hitch(this, this.onResizeEnd)
               });
            } else {
               domClass.add(this.domNode, this.baseClass + "--no-resize");
            }
         },

         /**
          * Creates the widgets inside a container
          *
          * @instance
          * @param widgets The widgets to create
          * @param container The container to place the widgets in
          */
         processContainer: function alfresco_dashlets_Dashlet__processContainer(widgets, container) {
            var hasWidgets = widgets && widgets.length,
               containerNode = container;
            hasWidgets && this.processWidgets(lang.clone(widgets), container);
            while (containerNode !== this.domNode) {
               domClass[hasWidgets ? "add" : "remove"](containerNode, this.baseClass + "--has-widgets");
               containerNode = containerNode.parentNode;
            }
         },

         /**
          * Make some of the i18n keys available for the template
          *
          * @instance
          */
         postMixInProperties: function alfresco_dashlets_Dashlet__postMixInProperties() {
            // construct our I18N labels ready for template
            this.label = {};
            array.forEach(["title"], lang.hitch(this, function(key) {
               this.label[key] = this.message(key);
               if (this.title) {
                  this.label[key] = this.title;
               }
            }));
            this.alfSubscribe(this.storeDashletHeightTopic + "_FAILURE", lang.hitch(this, this.onHeightStorageError));
         },

         /**
          * Handle errors that occur while storing the dashlet height
          *
          * @instance
          * @param {Object} payload The payload from the publishing of the failure topic
          * @fires module:alfresco/core/topics#DISPLAY_NOTIFICATION
          */
         onHeightStorageError: function(payload) {
            this.alfServicePublish(topics.DISPLAY_NOTIFICATION, {
               message: "Error occurred while storing dashlet height"
            }, true);
            this.alfLog("error", "Error storing dashlet height:\n\"" + payload.response.message + "\"");
         },

         /**
          * Handle resize events
          * 
          * @instance
          * @param {object} evt The resize event object
          * @param {object} ui The data about the resize
          */
         onResize: function alfresco_layout_AlfSideBarContainer__onResize( /*jshint unused:false*/ evt, /*jshint unused:false*/ ui) {
            this.bodyHeight = this.bodyNode.clientHeight;
            this.alfPublishResizeEvent(this.bodyNode);
         },

         /**
          * Calls [resizeHandler]{@link module:alfresco/layout/AlfSideBarContainer#resizeHandler} and then
          * saves the new width as a user preference.
          * 
          * @instance
          * @param {object} evt The resize event
          * @param {object} ui The data about the resize
          */
         onResizeEnd: function alfresco_layout_AlfSideBarContainer__onResizeEnd(evt, ui) {
            this.onResize(evt, ui);
            this.alfPublish(this.storeDashletHeightTopic, {
               componentId: this.componentId,
               alfResponseTopic: this.pubSubScope + this.storeDashletHeightTopic,
               height: this.bodyHeight
            }, true);
         }
      });
   });