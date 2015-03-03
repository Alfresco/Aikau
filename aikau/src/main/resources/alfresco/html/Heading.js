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
 * @module alfresco/html/Heading
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Richard Smith
 * @example <caption>Sample configuration</caption>
 * {
 *    name: "alfresco/html/Heading",
 *    config: {
 *       level: 2, // This will produce an <h2> element
 *       label: "Headings are good for screen readers", // This could be a fixed label or an i18m msg call
 *       isHidden: true // This heading is hidden accessibly
 *    }
 * }
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Heading.html",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/dom-construct",
        "dojo/dom-attr",
        "dojo/query"],
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, lang, domClass, domConstruct, domAttr, domQuery) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/Heading.css"}]
       */
      cssRequirements: [{cssFile:"./css/Heading.css"}],

      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The optional id to assign to the generated heading
       * 
       * @instance
       * @type {String}
       * @default null
       */
      headingId: null,

      /**
       * The level of heading to generate
       * 
       * @instance
       * @type {number}
       * @default 1
       */
      level: 1,

      /**
       * The heading text to display
       * 
       * @instance
       * @type {String}
       * @default ""
       */
      label: "",

      /**
       * Should the heading be hidden (accessibly)?
       * 
       * @instance
       * @type {Boolean}
       * @default false
       */
      isHidden: false,

      /**
       * Class to use when isHidden = true
       * 
       * @instance
       * @type {string}
       * @default "hiddenAccessible"
       */
      _hiddenAccessibleClass: "hiddenAccessible",

      /**
       * Any additional css classes to add.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      additionalCssClasses: null,

      /**
       * @instance
       */
      postCreate: function alfresco_html_Heading__postCreate() {
         if (isNaN(this.level) || this.level < 1 || this.level > 6 || !this.label)
         {
            this.alfLog("error", "A heading must have a numeric level from 1 to 6 and must have a label", this);
         }
         else
         {
            var heading = domConstruct.create("h" + this.level, {
               innerHTML: this.encodeHTML(this.message(this.label))
            }, this.headingNode);

            if (this.headingId)
            {
               domAttr.set(heading, "id", this.headingId);
            }
         }

         if (this.isHidden)
         {
            domClass.add(this.domNode, this._hiddenAccessibleClass);
         }
         else if (this.additionalCssClasses)
         {
            domClass.add(this.domNode, this.additionalCssClasses);
         }
      },
      
      /**
       * @instance
       */
      postMixInProperties: function alfresco_html_Label__postMixInProperties() {
         if (this.subscriptionTopic != null && lang.trim(this.subscriptionTopic) !== "")
         {
            this.alfSubscribe(this.subscriptionTopic, lang.hitch(this, this.onHeadingUpdate));
         }
      },

      /**
       * 
       * @instance
       * @param {object} payload The details of the label update
       */
      onHeadingUpdate: function alfresco_html_Heading__onHeadingUpdate(payload) {
         var update = lang.getObject("label", false, payload);
         if (update != null)
         {
            var headingNodes = domQuery("h"+this.level, this.headingNode);
            if (headingNodes && headingNodes.length === 1)
            {
               headingNodes[0].textContent = update;
            }
         }
      }
   });
});