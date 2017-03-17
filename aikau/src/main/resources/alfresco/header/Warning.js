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
 * This is a generic banner warning that can be used to display warning and error messages
 * to the user. The banner can contain multiple warning messages with different levels. The 
 * level of the warning indicates the image that will be used. It is also possible to configure
 * each warning to have a subscription topic that can be used to control dynamically control
 * the visibility of the warning. The payload published on the subscription topic should contain
 * a boolean attribute called "value" that indicates whether or not the warning should be displayed
 * or hidden.
 *
 * @example <caption>Basic single warning</caption>
 * {
 *   name: "alfresco/header/Warning",
 *   config: {
 *     warnings: [
 *       {
 *         message: "You have been warned",
 *         level: 1
 *       }
 *     ]
 *   }
 * }
 *
 * @example <caption>Multiple warnings with subscription topics</caption>
 * {
 *   name: "alfresco/header/Warning",
 *   config: {
 *     warnings: [
 *       {
 *         message: "First warning",
 *         level: 1,
 *         subscriptionTopic: "WARNING_1_VISIBILITY"
 *       },
 *       {
 *         message: "Second warning",
 *         level: 1,
 *         subscriptionTopic: "WARNING_2_VISIBILITY"
 *       }
 *     ]
 *   }
 * }
 * 
 * @module alfresco/header/Warning
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Warning.html",
        "alfresco/core/Core",
        "dojo/dom-class",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/dom-construct"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, domClass, array, lang, domConstruct) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/LicenseWarning.css"}]
       */
      cssRequirements: [{cssFile:"./css/Warning.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * This should be set to an array of objects defined the warnings to be displayed.
       * Each object should contain a message and a severity level.
       *
       * @instance
       * @type {array}
       * @default
       */
      warnings: null,

      /**
       * This attribute is used to track the visibility status of all the warnings that are configured
       * with a subscriptionTopic attribute. When all warnings are hidden then the overall widget will
       * also be hidden.
       *
       * @instance
       * @type {object}
       * @default
       * @since 1.0.32
       */
      _dynamicWarnings: null,

      /**
       * @instance
       */
      postCreate: function alfresco_header_Warning__postCreate() {
         domClass.add(this.domNode, "alfresco-header-Warning--hidden");
         if (this.warnings)
         {
            this._dynamicWarnings = {};
            array.forEach(this.warnings, lang.hitch(this, this.addMessage));
            if (this.warnings.length > 0)
            {
               domClass.remove(this.domNode, "alfresco-header-Warning--hidden");
            }
         }
      },
      
      /**
       * Adds a message to be displayed
       *
       * @instance
       * @param {string} message The message to add
       * @param {number} index The index of the message
       * @param {number} level The severity of the message
       */
      addMessage: function alfresco_header_Warning__addMessage(item, /*jshint unused:false*/ index) {
         var outer = domConstruct.create("div", {
            "class": "alfresco-header-Warning__info"
         }, this.warningsNode);
         domConstruct.create("span", {
            "class": "alfresco-header-Warning__image alfresco-header-Warning__level" + item.level
         }, outer);
         domConstruct.create("span", {
            innerHTML: item.message
         }, outer);

         if (item.subscriptionTopic)
         {
            this.alfSubscribe(item.subscriptionTopic, lang.hitch(this, this.updateVisibility, outer, item.subscriptionTopic));
            this._dynamicWarnings[item.subscriptionTopic] = false;
         }
         else
         {
            // At least one warning does not have a subscription topic, this means that the overall
            // warning block should always be displayed...
            this._forceDisplay = true;
         }
      },
      
      /**
       * Adds a warning message.
       *
       * @instance
       * @param {string} warning The warning message to add
       * @param {number} index The index to add
       */
      addWarning: function alfresco_header_Warning__addWarning(warning, index) {
         this.addMessage({
            message: warning,
            index: index,
            level: 1
         });
      },
      
      /**
       * Adds an error message
       *
       * @instance
       * @param {string} error The error message to add
       * @param {number} index The index to add
       */
      addError: function alfresco_header_Warning__addError(error, index) {
         this.addMessage({
            message: error,
            index: index,
            level: 3
         });
      },

      /**
       * If a warning is configured with a subscriptionTopic attribute then this function will be
       * called each time that topic is published and will update the visibility of that warning 
       * according to the payload provided. If all of the warnings are hidden then the overall
       * widget will also be hidden.
       *
       * @instance
       * @param {element} warningNode This is the DOM element for the warning being updated
       * @param {string} subscriptionTopic This is the topic subscribed to for the warning being updated.
       * @param {object} payload This is the payload published on the subscriptionTopic. It is expected to
       * contain a "value" attribute
       * @since 1.0.32
       */
      updateVisibility: function alfresco_header_Warning__updateVisibility(warningNode, subscriptionTopic, payload) {
         this._dynamicWarnings[subscriptionTopic] = payload.value;
         if (payload.value)
         {
            domClass.remove(warningNode, "alfresco-header-Warning__info--hidden");
         }
         else
         {
            domClass.add(warningNode, "alfresco-header-Warning__info--hidden");
         }

         var visibleDynamicWarnings = false;
         for (var key in this._dynamicWarnings)
         {
            if (this._dynamicWarnings.hasOwnProperty(key))
            {
               visibleDynamicWarnings = visibleDynamicWarnings || this._dynamicWarnings[key];
            }
         }
         if (visibleDynamicWarnings || this._forceDisplay)
         {
            domClass.remove(this.domNode, "alfresco-header-Warning--hidden");
         }
         else
         {
            domClass.add(this.domNode, "alfresco-header-Warning--hidden");
         }
      }
   });
});