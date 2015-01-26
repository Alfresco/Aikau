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
 * A class that wraps an iframe
 *
 * @module alfresco/integration/IFrame
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 *
 * @author Erik Winlöf
 */
define(["dojo/_base/declare",
   "dijit/_WidgetBase",
   "dijit/_TemplatedMixin",
   "dojo/text!./templates/IFrame.html",
   "alfresco/core/Core",
   "alfresco/core/CoreWidgetProcessing",
   "alfresco/core/ResizeMixin",
   "alfresco/core/DomElementUtils",
   "dojo/_base/lang",
   "dojo/dom-attr",
   "dojo/dom-style"],
      function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, CoreWidgetProcessing, ResizeMixin, DomElementUtils, lang, domAttr, domStyle) {

         return declare([_WidgetBase, _TemplatedMixin, AlfCore, CoreWidgetProcessing, ResizeMixin, DomElementUtils], {

            /**
             * The base css class to use for this widget
             *
             * @instance
             * @type {string}
             * @default "alfresco-integration-IFrame"
             */
            baseClass: "alfresco-integration-IFrame",

            /**
             * The iframe element (will be set by dojo)
             * @instance
             * @type {HTMLElement}
             */
            iFrameNode: null,

            /**
             * The element showing the messages
             * @instance
             * @type {HTMLElement}
             */
            messagesNode: null,

            /**
             * The messages to show when src is set to null
             *
             * @instance
             * @type {Array}
             */
            messages: [],

            /**
             * This topic will be subscribed to for new src information
             *
             * @instance
             * @type {string}
             */
            srcTopic: null,

            /**
             * The src url to display in the iframe
             *
             * @instance
             * @type {null|string}
             * @default null
             */
            src: null,

            /**
             * The width in pixels of the chart. A null value indicates 100%
             *
             * @instance
             * @type {number|null|string}
             * @default "100%"
             */
            width: "100%",

            /**
             * The initial static height in pixels.
             *
             * @instance
             * @type {number}
             * @default 600
             */
            height: 600,

            /**
             * If height is required to change it can be set to a calculated value instead based on the Dom.
             * Config shall be set to match the expectation of the config attribute of
             * [DomElementUtils]{@link module:alfresco/core/DomElementUtils}'s resolveDomCalculation method.
             */
            heightConfig: null,

            /**
             * An array of the CSS files to use with this widget.
             *
             * @instance cssRequirements {Array}
             * @type {object[]}
             * @default [{cssFile:"./css/Chart.css"}]
             */
            cssRequirements: [
               {cssFile:"./css/IFrame.css"}
            ],

            /**
             * The HTML template to use for the widget.
             *
             * @instance
             * @type {string}
             */
            templateString: template,

            /**
             * Subscribes to the data topic
             *
             * @instance
             */
            postMixInProperties: function alfresco_integration_IFrame__postMixInProperties() {
               if (this.srcTopic) {
                  this.alfSubscribe(this.srcTopic, lang.hitch(this, this._setSrc));
               }
            },

            /**
             * Sets up topic subscriptions and makes sure the chart is resized when the window is resized.
             *
             * @instance
             */
            postCreate: function alfresco_integration_IFrame__postCreate() {
               this._setSrc(this.src);
               var messageEl;
               for (var i = 0, il = this.messages.length; i < il; i++) {
                  messageEl = document.createElement('div');
                  messageEl.appendChild(document.createTextNode(this.messages[i]));
                  this.messagesNode.appendChild(messageEl);
               }
               // Update the height as the window changes...
               if (this.heightConfig) {
                  this.alfSetupResizeSubscriptions(this._onResize, this);
               }
            },

            _onResize: function(){
               this._setHeight();
            },

            /**
             *
             * @param src
             * @private
             */
            _setSrc: function alfresco_integration_IFrame___setSrc(src)  {
               if (src != null) {
                  this._setHeight();
                  domAttr.set(this.iFrameNode, "src", src);
                  domStyle.set(this.iFrameNode, "display", "");
                  domStyle.set(this.messagesNode, "display", "none");
               }
               else
               {
                  domStyle.set(this.iFrameNode, "display", "none");
                  if (this.message) {
                     domStyle.set(this.messagesNode, "display", "");
                  }
               }
            },

            /**
             *
             * @param height
             * @private
             */
            _setHeight: function alfresco_integration_IFrame___setHeight(height) {
               if (height == null) {
                  height = this.height;
                  if (this.heightConfig != null) {
                     height = this.resolveDomCalculation(this.heightConfig);
                  }
               }
               domAttr.set(this.iFrameNode, "height", height);
            }

         });
      }
);