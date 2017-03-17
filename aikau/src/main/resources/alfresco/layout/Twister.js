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
 * <p>This widget provides the means to dynamically reveal and hide its contents by clicking on its label. The 
 * open or closed state is indicated by a "twister" icon. The widget can be configured to render any other widget
 * model as its contents. The twister can be configured to be intially open or closed by setting the 
 * [initiallyOpen]{@link module:alfresco/layout/Twister#initiallyOpen} attribute to true (for open) or false (for closed).</p>
 * 
 * <p>It is also possible for the open or closed state to be stored to a users personal preferences. This can be done 
 * by configuring a [preferenceName]{@link module:alfresco/layout/Twister#preferenceName} attribute
 * and ensuring that the [PreferenceService]{@link module:alfresco/services/PreferenceService} (or equivilant) is included
 * on the page. A single [preferenceName]{@link module:alfresco/layout/Twister#preferenceName} can be 
 * shared between multiple widgets but this will result in all those twisters being in the same state when the page loads.
 * Using user preferences will override whatever [initiallyOpen]{@link module:alfresco/layout/Twister#initiallyOpen} 
 * attribute has been configured.</p>
 *
 * <p>It is also possible to configure an optional [headingLevel]{@link module:alfresco/layout/Twister#headingLevel} to improve
 * the overall accessibility of the page containing the twisters. The level provided should be a number between 1 and 6
 * and will control the HTML element that is used for the twister label (e.g. 1 will render an H1 element, etc).</p>
 *
 * @example <caption>Example twister that is initially closed</caption>
 * {
 *   name: "alfresco/layout/Twister",
 *   config: {
 *     label: "Initially Closed Twister",
 *     headingLevel: 3,
 *     initiallyOpen: false,
 *     widgets: [
 *       {
 *         id: "LOGO1",
 *         name: "alfresco/logo/Logo"
 *       }
 *     ]
 *   }
 * }
 *
 * @example <caption>Example twister that uses user preferences to control the open/closed state</caption>
 * {
 *   name: "alfresco/layout/Twister",
 *   config: {
 *     label: "Twister State Based on User Preference",
 *     preferenceName: "Twister1",
 *     widgets: [
 *       {
 *         id: "LOGO1",
 *         name: "alfresco/logo/Logo"
 *       }
 *     ]
 *   }
 * }
 * 
 * @module alfresco/layout/Twister
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dijit/_OnDijitClickMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @mixes module:alfresco/services/_PreferenceServiceTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "alfresco/services/_PreferenceServiceTopicMixin",
        "alfresco/core/Core",
        "alfresco/core/CoreWidgetProcessing",
        "dojo/text!./templates/Twister.html",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/dom-attr",
        "dojo/_base/event"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _PreferenceServiceTopicMixin, AlfCore, CoreWidgetProcessing, 
                 template, lang, array, domConstruct, domClass, domStyle, domAttr, event) {
   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, AlfCore, CoreWidgetProcessing, _PreferenceServiceTopicMixin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/Twister.css"}]
       */
      cssRequirements: [{cssFile:"./css/Twister.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The CSS class applied when the twister is opened (and removed when closed).
       *
       * @instance
       * @type {string}
       * @default
       */
      CLASS_OPEN: "alfresco-layout-Twister--open",
      
      /**
       * The CSS class applied when the twister is closed (and removed when opened).
       *
       * @instance
       * @type {string}
       * @default
       */
      CLASS_CLOSED: "alfresco-layout-Twister--closed",

      /**
       * Should the generated twister use a heading or div for it's heading?
       *
       * @instance
       * @type {number}
       * @default
       */
      headingLevel: null,

      /**
       * The initial open/closed state of the twister. This value could be overridden by a previously stored user preference
       * if a [preferenceName]{@link module:alfresco/layout/Twister#preferenceName} is configured and the 
       * [PreferenceService]{@link module:alfresco/services/PreferenceService} is included on the page.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      initiallyOpen: true,

      /**
       * The preference name to use for storing and retrieving the users preferred open/closed state for this twister.
       * In order for this preference to be used it will also be necessary to ensure that the 
       * [PreferenceService]{@link module:alfresco/services/PreferenceService} is included on the page.
       * 
       * @instance
       * @type {string}
       * @default
       */
      preferenceName: null,

      /**
       * This is the prefix that will be applied to all preferences. It can be optionally configured to a different value
       * but this is typically not necessary. One possible reason to change the prefix would be to allow user preferences
       * to be split across different client implementations.
       * 
       * @instance
       * @type {string}
       * @default
       */
      preferencePrefix: "org.alfresco.share.twisters.",
      
      /**
       * The width to make the twister. Units such as "px" should be included. By default all available
       * horizontal width will be used.
       *
       * @instance
       * @type {string}
       * @default
       */
      width: "auto",

      /**
       * @instance
       */
      postMixInProperties: function alfresco_layout_Twister__postMixInProperties() {
         if (this.label)
         {
            this.label = this.encodeHTML(this.message(this.label));
         }
      },

      /**
       * Processes any widgets defined in the configuration for this instance.
       * 
       * @instance
       */
      postCreate: function alfresco_layout_Twister__postCreate() {
         if (this.width)
         {
            domStyle.set(this.domNode, "width", this.width);
         }

         if (this.label)
         {
            if (this.additionalCssClasses)
            {
               domClass.add(this.domNode, this.additionalCssClasses);
            }

            // If an invalid heading label has been provided then we will be kind and generate a warning
            // but remove the invalid setting so that the twister still rendered without a header element
            if(this.headingLevel && (isNaN(this.headingLevel) || this.headingLevel < 1 || this.headingLevel > 6))
            {
               this.alfLog("warn", "A heading must have a numeric level from 1 to 6, level has been reset", this);
               this.headingLevel = null;
            }
            
            if(this.headingLevel)
            {
               domConstruct.create("h" + this.headingLevel, {
                  innerHTML: this.label
               }, this.labelNode);

               this.createTwister(this.filterPrefsName);
            }
            else
            {
               domAttr.set(this.labelNode, "innerHTML", this.label);
               this.createTwister();
            }
         }
         else
         {
            this.alfLog("error", "A twister was configured without a 'label' attribute, so it will not be rendered", this);
            domStyle.set(this.domNode, "display", "none");
         }
      },
      
      /**
       * Iterates over the processed widgets and adds each one to the content node.
       * 
       * @instance
       * @param {object[]} widgets The widgets that were created.
       */
      allWidgetsProcessed: function alfresco_layout_Twister__allWidgetsProcessed(widgets) {
         array.forEach(widgets, lang.hitch(this, function(widget) {
            widget.placeAt(this.contentNode);
         }), this);

         if (this.preferencePrefix && this.preferenceName)
         {
            this.alfPublish(this.getPreferenceTopic, {
               preference: this.preferencePrefix + this.preferenceName,
               callback: this.onSetTwistState,
               callbackScope: this
            });
         }
      },

      /**
       * Creates a "disclosure twister" UI control from existing mark-up.
       *
       * @instance
       */
      createTwister: function alfresco_layout_Twister__createTwister() {
         // Initial State
         domClass.add(this.labelNode, this.initiallyOpen ? this.CLASS_OPEN : this.CLASS_CLOSED);
         domStyle.set(this.contentNode, "display", this.initiallyOpen ? "block" : "none");

         if (this.widgets)
         {
            this.processWidgets(this.widgets);
         }
      },

      /**
       * 
       * @instance
       * @param  {boolean} value Whether or not the twister should be opened or closed.
       */
      onSetTwistState: function alfresco_layout_Twister_onSetTwistState(open) {
         if (open === true)
         {
            domClass.add(this.labelNode, this.CLASS_OPEN);
            domClass.remove(this.labelNode, this.CLASS_CLOSED);
            domStyle.set(this.contentNode, "display", "block");
         }
         else if (open === false)
         {
            domClass.remove(this.labelNode, this.CLASS_OPEN);
            domClass.add(this.labelNode, this.CLASS_CLOSED);
            domStyle.set(this.contentNode, "display", "none");
         }
         else
         {
            // Don't do anything on unexpected values...
         }
      },

      /**
       * Handles requests to twist the twister open or closed.
       *
       * @instance
       * @param {object} evt The click or keyboard event triggering the twist
       */
      onTwist: function alfresco_layout_Twister__onTwist(evt) {
         // Update UI to new state
         var open = domClass.contains(this.labelNode, this.CLASS_CLOSED);
         this.onSetTwistState(open);

         if (this.preferencePrefix && this.preferenceName)
         {
            this.alfPublish(this.setPreferenceTopic, {
               preference: this.preferencePrefix + this.preferenceName,
               value: open
            });
         }

         // Stop the event propogating any further (ie into the parent element)
         event.stop(evt);
      }
   });
});