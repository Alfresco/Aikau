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
 * This is a BETA quality widget and not guaranteed for production use.
 *
 * @module alfresco/layout/VerticalReveal
 * @extends module:alfresco/core/ProcessWidgets
 * @mixes external:dojo/_OnDijitClickMixin
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["alfresco/core/ProcessWidgets",
        "dijit/_OnDijitClickMixin", 
        "dojo/text!./templates/VerticalReveal.html", 
        "dojo/_base/declare", 
        "dojo/_base/lang", 
        "dojo/Deferred", 
        "dojo/dom-construct", 
        "dojo/dom-class", 
        "dojo/dom-style"], 
        function(ProcessWidgets, _OnDijitClickMixin, template, declare, lang, Deferred, domConstruct, domClass, domStyle) {

   return declare([ProcessWidgets, _OnDijitClickMixin], {

      /**
       * An array of the CSS files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/VerticalWidgets.css"}]
       */
      cssRequirements: [{cssFile: "./css/VerticalReveal.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       * The root class for this widget
       *
       * @instance
       * @type {string}
       */
      rootClass: "alfresco-layout-VerticalReveal",

      /**
       * The label for the manual toggle
       *
       * @instance
       * @type {string}
       * @default null
       */
      toggleLabel: null,

      /**
       * The topic to publish in order to reveal or hide the child widgets
       *
       * @instance
       * @type {string}
       * @default "ALF_VERTICAL_REVEAL"
       */
      subscriptionTopic: "ALF_VERTICAL_REVEAL",

      /**
       * Indicates whether or not the contained widgets should be initially revealed or not. Defaults
       * to false.
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      initiallyRevealed: false,

      /**
       * Will be resolved once the widgets have been processed
       *
       * @instance
       * @type {object}
       */
      _widgetProcessingDeferred: null,

      /**
       * Called when the child widgets have been processed
       *
       * @instance
       * @override
       * @param {Array} widgets An array of all the widgets that have been processed
       */
      allWidgetsProcessed: function alfresco_layout_VerticalReveal__allWidgetsProcessed( /*jshint unused:false*/ widgets) {
         this._widgetProcessingDeferred.resolve();
      },

      /**
       * Widget has been created, but not sub-widgets
       *
       * @instance
       * @override
       */
      postCreate: function alfresco_layout_VerticalReveal__postCreate() {
         if (this.toggleLabel) {
            domClass.add(this.domNode, this.rootClass + "--has-toggle");
         }
         this.alfSubscribe(this.subscriptionTopic, lang.hitch(this, this._onDisplayToggle));
         if (this.initiallyRevealed === true) {
            this._processWidgets();
         }
      },

      /**
       * Properties have been mixed into this widget instance.
       *
       * @instance
       * @override
       */
      postMixInProperties: function alfresco_layout_VerticalReveal__postMixInProperties() {
         if (this.toggleLabel) {
            this.toggleLabel = this.message(this.toggleLabel);
         }
         this.inherited(arguments);
      },

      /**
       * Handle requests to toggle the contents visibility
       *
       * @instance
       */
      _onDisplayToggle: function alfresco_layout_VerticalReveal___onDisplayToggle() {
         this._processWidgets().then(lang.hitch(this, function() {
            var maxHeight = this.contentNode.style.maxHeight, // domStyle.get returns 0 instead of "none"
               isExpanded = maxHeight === "none" || (typeof maxHeight === "number" && maxHeight > 0);
            if (isExpanded) {
               domClass.remove(this.contentNode, "content--has-transition");
               domStyle.set(this.contentNode, "maxHeight", this.contentNode.scrollHeight + "px");
               domClass.add(this.contentNode, "content--has-transition");
               setTimeout(lang.hitch(this, function() {
                  domStyle.set(this.contentNode, "maxHeight", 0);
               }), 0);
            } else {
               domStyle.set(this.contentNode, "maxHeight", this.contentNode.scrollHeight + "px");
               setTimeout(lang.hitch(this, function() {
                  domStyle.set(this.contentNode, "maxHeight", "none");
               }), 1000);
            }
         }));
      },

      /**
       * Process the widgets to be displayed
       *
       * @instance
       * @returns {object} A promise, that will be resolved when the widgets have been processed
       */
      _processWidgets: function alfresco_layout_VerticalReveal___processWidgets() {
         if (!this._widgetProcessingDeferred) {
            this._widgetProcessingDeferred = new Deferred();
            if (this.widgets) {
               this.processWidgets(this.widgets, this.containerNode);
            } else {
               this._widgetProcessingDeferred.resolve();
            }
         }
         return this._widgetProcessingDeferred.promise;
      }
   });
});