/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * An abstract view for the Alfresco Share document list. It can be used in JSON page models if
 * configured with a widgets definition. Otherwise it can be extended to define specific views
 *
 * @module alfresco/dashlets/Dashlet
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing*
 * @abstract
 * @author Erik Winlöf
 */
define(["dojo/_base/declare",
   "dijit/_WidgetBase",
   "dijit/_TemplatedMixin",
   "dojo/text!./templates/Dashlet.html",
   "alfresco/core/Core",
   "alfresco/core/CoreWidgetProcessing",
   "dojo/_base/lang",
   "dojo/_base/array",
   "dojo/dom-construct",
   "dojo/dom-class",
   "dojo/dom-style",
   "dijit/registry"],
      function(declare, _WidgetBase, _TemplatedMixin, template,
               AlfCore, CoreWidgetProcessing, lang, array, domConstruct, domClass, domStyle, registry) {

         return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing], {

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
             * @default "alfresco-dashlets-Dashlet"
             */
            baseClass: "alfresco-dashlets-Dashlet",

            /**
             * A second css class for sub classes of this widget to use to be able to target
             * specifics in such dashlets.
             *
             * @instance
             * @type {string}
             * @default ""
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
            i18nRequirements: [{i18nFile: "./i18n/Dashlet.properties"}],

            /**
             * An array of the CSS files to use with this widget.
             *
             * @instance cssRequirements {Array}
             * @type {object[]}
             * @default [{cssFile:"./css/Dashlet.css"}]
             */
            cssRequirements: [{cssFile:"./css/Dashlet.css"}],

            /**
             * We use the DashletResizer to handle the resizing.
             *
             * @instance
             * @type {array}
             */
            nonAmdDependencies: ["/js/share.js"],

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
             * The container that holds the title.
             * Will be populated by dojo.
             *
             * @instance
             * @type {HTMLElement}
             */
            titleNode: null,

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
             * The container that holds the title bar action widgets.
             * Will be populated by dojo.
             *
             * @instance
             * @type {HTMLElement}
             */
            titleBarActionsNode: null,

            /**
             * The container that holds the first toolbar widgets.
             * Will be populated by dojo.
             *
             * @instance
             * @type {HTMLElement}
             */
            toolbarNode: null,

            /**
             * The container that holds the title second tollbar widgets.
             * Will be populated by dojo.
             *
             * @instance
             * @type {HTMLElement}
             */
            toolbar2Node: null,

            /**
             * The container that holds the body widgets.
             * Will be populated by dojo.
             *
             * @instance
             * @type {HTMLElement}
             */
            bodyNode: null,

            /**
             * Explicit height in pixels of the dashlet body, if such has been set before, i.e. from being resized.
             *
             * @instance
             * @type {number}
             */
            bodyHeight: null,

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
               this.processContainer(this.widgetsForBody, this.bodyNode);
               if (this.componentId)
               {
                  // Only make it resizable if a componentId has been provided,
                  // otherwise it will not be persisted correctly
                  new Alfresco.widget.DashletResizer(this.domNode.parentNode.id, this.componentId);
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
               if (widgets != null && widgets.length > 0)
               {
                  this.processWidgets(lang.clone(widgets), container);
                  domClass.add(container, this.baseClass + '--widgets');
               }
               else
               {
                  domClass.remove(container, this.baseClass + '--widgets');
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
            }

         });
      }
);