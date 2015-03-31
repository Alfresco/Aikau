/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 */
define(["alfresco/core/ProcessWidgets",
        "dijit/_OnDijitClickMixin",
        "dojo/text!./templates/VerticalReveal.html",
        "dojo/_base/declare",
        "dojo/_base/lang",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/_base/array"], 
        function(ProcessWidgets, _OnDijitClickMixin, template, declare, lang, domConstruct, domClass, domStyle, array) {
   
   return declare([ProcessWidgets, _OnDijitClickMixin], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/VerticalWidgets.css"}]
       */
      cssRequirements: [{cssFile:"./css/VerticalReveal.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {string}
       */
      templateString: template,

      /**
       *
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
       *
       * 
       * @instance
       */
      postMixInProperties: function alfresco_layout_VerticalReveal__postMixInProperties() {
         if (this.toggleLabel == null)
         {
            // In the postCreate we'll hide the toggle node...
         }
         else
         {
            this.toggleLabel = this.message(this.toggleLabel);
         }
      },

      /**
       *
       * 
       * @instance
       */
      postCreate: function alfresco_layout_VerticalReveal__postCreates() {
         // Set a boolean flag to record when the child widgets get processed so that we only process them once...
         this._processedWidgetsToReveal = false;
         
         if (this.toggleLabel == null)
         {
            domClass.add(this.toggleNode, "hidden");
         }
         this.alfSubscribe(this.subscriptionTopic, lang.hitch(this, this.onDisplayToggle));

         if (this.initiallyRevealed === true && this.widgets)
         {
            this.processWidgets(this.widgets, this.containerNode);
            this._processedWidgetsToReveal = true;
         }
      },

      /**
       * 
       *
       * @instance
       */
      onDisplayToggle: function alfresco_layout_VerticalReveal__onDisplayToggle() {
         if (this._processedWidgetsToReveal === false && this.widgets)
         {
            this.processWidgets(this.widgets, this.containerNode);
            this._processedWidgetsToReveal = true;
         }
         var maxHeight = domStyle.get(this.contentNode, "maxHeight"),
            isExpanded = !isNaN(maxHeight) && maxHeight > 0;
         if (isExpanded) {
            domStyle.set(this.contentNode, "maxHeight", 0);
         } else {
            domStyle.set(this.contentNode, "maxHeight", this.contentNode.scrollHeight + "px");
         }
      }
   });
});