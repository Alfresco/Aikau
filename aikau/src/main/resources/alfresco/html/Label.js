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
 * This module has been somewhat unfortunately named as it creates an HTML <span> element rather than
 * an HTML <label> element. The name is intended to reflect the intended use within a page rather than
 * the underlying implementation. This widget can be used to "label" other widgets on the page. It can
 * also be configured with a [subscriptionTopic]{@link module:alfresco/html/Label#subscriptionTopic}
 * to dynamically update its displayed value as events occur on the page.
 *
 * @example <caption>Basic configuration:</caption>
 * {
 *   name: "alfresco/html/Label",
 *   config: {
 *     label: "Look at this!"
 *   }
 * }
 *
 * @example <caption>Dynamic configuration (updates the label to show the "display.me" property from the published payload):</caption>
 * {
 *   name: "alfresco/html/Label",
 *   config: {
 *     label: "Look at this!"
 *     subscriptionTopic: "UPDATE_LABEL",
 *     subscriptionPayloadProperty: "display.me"
 *   }
 * }
 * 
 * @module alfresco/html/Label
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Label.html",
        "alfresco/core/Core",
        "dojo/_base/lang",
        "dojo/dom-construct"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, lang, domConstruct) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {

      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/Label.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/Label.properties"}],
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/Label.css"}]
       */
      cssRequirements: [{cssFile:"./css/Label.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,

      /**
       * The label to display.
       * 
       * @instance
       * @type {string}
       * @default
       */
      label: "",

      /**
       * This is an optional topic that can be subscribed that when published will update the
       * displayed label.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.2
       */
      subscriptionTopic: null,

      /**
       * This is the property in any payload published on the 
       * [subscriptionTopic]{@link module:alfresco/html/Label#subscriptionTopic} to be
       * used for the updated display.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.46
       */
      subscriptionPayloadProperty: "label",

      /**
       * @instance
       */
      postMixInProperties: function alfresco_html_Label__postMixInProperties() {
         this.label = this.message(this.label);
         if (this.subscriptionTopic && lang.trim(this.subscriptionTopic) !== "")
         {
            this.alfSubscribe(this.subscriptionTopic, lang.hitch(this, this.onLabelUpdate));
         }
      },

      /**
       * This function is called when the [subscriptionTopic]{@link module:alfresco/html/Label#subscriptionTopic}
       * is published. It will then set the 
       * [subscriptionPayloadProperty]{@link module:alfresco/html/Label#subscriptionPayloadProperty} from the
       * payload as the new label.
       * 
       * @instance
       * @param {object} payload The details of the label update
       */
      onLabelUpdate: function alfresco_html_Label__onLabelUpdate(payload) {
         var update = lang.getObject(this.subscriptionPayloadProperty, false, payload);
         if (update !== null && typeof update !== "undefined")
         {
            // NOTE: It's not safe to simply set the innerHTML attribute here, and it is also
            //       not possible to simply encode the update (because it might contain characters
            //       that we do not want to encode). However, we do want to prevent XSS style attacks
            //       so the following mechanism allows us to do this.
            domConstruct.empty(this.labelNode);
            var textNode = document.createTextNode(update);
            this.labelNode.appendChild(textNode);
         }
      }
   });
});