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
 * <p>This widget provides the means to progressively reveal it's contents via a "twisty" arrow. When
 * the user clicks (or actions via keyboard) the widget label it will reveal or hide the widgets that
 * it contains.</p>
 * 
 * @module alfresco/layout/Twister
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes external:dijit/_OnDijitClickMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreWidgetProcessing
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
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
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, AlfCore, CoreWidgetProcessing, template,  
                 lang, array, domConstruct, domClass, domStyle, domAttr, event) {
   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, AlfCore, CoreWidgetProcessing], {

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
       * Should the generated twister use a heading or div for it's heading?
       *
       * @instance
       * @type {number}
       * @default null
       */
      headingLevel: null,

      /**
       * @instance
       */
      postMixInProperties: function alfresco_layout_Twister__postMixInProperties() {
         if (this.label != null)
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
         if (this.label != null && this.label !== "")
         {
            if (this.additionalCssClasses != null)
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
               this.createTwister(this.filterPrefsName);
            }
         }
         else
         {
            this.alfLog("error", "A twister was configured without a 'lable' attribute, so it will not be rendered", this);
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
         array.forEach(widgets, lang.hitch(this, function(widget, index) {
            widget.placeAt(this.contentNode);
         }), this);
      },

      /**
       * 
       *
       * @instance
       * @type {string}
       * @default "alfresco-layout-Twister-open"
       */
      CLASS_OPEN: "alfresco-layout-Twister-open",
      
      /**
       * 
       *
       * @instance
       * @type {string}
       * @default "alfresco-layout-Twister-closed"
       */
      CLASS_CLOSED: "alfresco-layout-Twister-closed",

      /**
       * Creates a "disclosure twister" UI control from existing mark-up.
       *
       * @instance
       * @param {string} twisterName Twister name under which to save it's collapsed state via preferences
       */
      createTwister: function alfresco_layout_Twister__createTwister(twisterName) {
         // // MNT-11316 fix, populate Alfresco.util.createTwister.collapsed if required 
         // if (Alfresco.util.createTwister.collapsed === undefined)
         // {
         //    var preferences = new Alfresco.service.Preferences();
         //    if (Alfresco.service.Preferences.COLLAPSED_TWISTERS)
         //    {
         //       Alfresco.util.createTwister.collapsed = Alfresco.util.findValueByDotNotation(preferences.get(), Alfresco.service.Preferences.COLLAPSED_TWISTERS) || "";
         //    }
         //    else
         //    {
         //       Alfresco.util.createTwister.collapsed = "";
         //    }
         // }

         // See if panel should be collapsed via value stored in preferences
         // var collapsedPrefs = Alfresco.util.arrayToObject(Alfresco.util.createTwister.collapsed.split(",")),
         //     isCollapsed = !!collapsedPrefs[p_filterName];

         var isCollapsed = false;

         // Initial State
         domClass.add(this.labelNode, isCollapsed ? this.CLASS_CLOSED : this.CLASS_OPEN);
         domStyle.set(this.contentNode, "display", isCollapsed ? "none" : "block");

         if (this.widgets)
         {
            this.processWidgets(this.widgets);
         }
      },

      /**
       * Handles requests to twist the twister open or closed.
       *
       * @instance
       * @param {object} evt The click or keyboard event triggering the twist
       */
      onTwist: function alfresco_layout_Twister__onTwist(evt)
         {
            // Update UI to new state
            var collapse = domClass.contains(this.labelNode, this.CLASS_OPEN);
            domClass.toggle(this.labelNode, this.CLASS_OPEN);
            domClass.toggle(this.labelNode, this.CLASS_CLOSED);
            domStyle.set(this.contentNode, "display", collapse ? "none" : "block");

            // if (p_obj.filterName)
            // {
            //    // Save to preferences
            //    var fnPref = collapse ? "add" : "remove",
            //       preferences = new Alfresco.service.Preferences();
            //    preferences[fnPref].call(preferences, Alfresco.service.Preferences.COLLAPSED_TWISTERS, p_obj.filterName);
            // }
            // Stop the event propogating any further (ie into the parent element)
            event.stop(evt);
         }
   });
});