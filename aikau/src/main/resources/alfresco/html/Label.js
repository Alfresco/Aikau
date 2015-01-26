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
        "dojo/dom-class"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, AlfCore, lang, domClass) {
   
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
       * @default "title.label"
       */
      label: "",

      /**
       * Any additional classes to add.
       * 
       * @instance
       * @type {string}
       * @default null
       */
      additionalCssClasses: null,

      /**
       * 
       * @instance
       */
      postCreate: function alfresco_html_Label__postCreate() {
         if (this.additionalCssClasses != null)
         {
            domClass.add(this.domNode, this.additionalCssClasses);
         }
      },

      /**
       * @instance
       */
      postMixInProperties: function alfresco_html_Label__postMixInProperties() {
         this.label = this.message(this.label);

         if (this.subscriptionTopic != null && lang.trim(this.subscriptionTopic) !== "")
         {
            this.alfSubscribe(this.subscriptionTopic, lang.hitch(this, "onLabelUpdate"));
         }
      },

      /**
       * 
       * @instance
       * @param {object} payload The details of the label update
       */
      onLabelUpdate: function alfresco_html_Label__onLabelUpdate(payload) {
         var update = lang.getObject("label", false, payload);
         if (update != null)
         {
            this.labelNode.innerHTML = update;
         }
      }
   });
});