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
 * This widget can be used to render a title for a page in a large font. It will also set the
 * title of the browser window when [setBrowserTitle]{@link module:alfresco/header/Title#setBrowserTitle}
 * is configured to be true. It subscribes to the "ALF_UPDATE_PAGE_TITLE" topic in order support the
 * requests to dynamically re-render the title with a new value.
 * 
 * @module alfresco/header/Title
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dojo/text!./templates/Title.html",
        "dojo/_base/lang",
        "alfresco/core/Core",
        "service/constants/Default",
        "dojo/dom-class",
        "dojo/dom-style"], 
        function(declare, _WidgetBase, _TemplatedMixin, template, lang, AlfCore, AlfConstants, domClass, domStyle) {
   
   return declare([_WidgetBase, _TemplatedMixin, AlfCore], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/Title.css"}]
       */
      cssRequirements: [{cssFile:"./css/Title.css"}],
      
      /**
       * The HTML template to use for the widget.
       * @instance
       * @type {String}
       */
      templateString: template,
      
      /**
       * @instance
       * @type {string}
       */
      label: null,
      
      /**
       * This is the URL to navigate to when the title is clicked.
       * 
       * @instance
       * @type {string}
       */
      targetUrl: null,
      
      /**
       * Indicates whether or not the browser window title should be updated
       *
       * @instance
       * @type {boolean}
       * @default false
       */
      setBrowserTitle: false,

      /**
       * This is the prefix to apply before the [label]{@link module:alfresco/header/Title#label} when
       * setting the browser window title. It defaults to a standard Alfresco prefix but should be 
       * overridden if required. The browser title will only be set when [setBrowserTitle]{@link module:alfresco/header/Title#setBrowserTitle}
       * is set to true.
       * 
       * @instance
       * @type {string}
       * @default "Alfresco"
       */
      browserTitlePrefix: "Alfresco",

      /**
       * It's important to perform label encoding before buildRendering occurs (e.g. before postCreate)
       * to ensure that an unencoded label isn't set and then replaced. 
       * 
       * @instance
       */
      postMixInProperties: function alfresco_header_Title__postMixInProperties() {
         if (this.label)
         {
            var label = this.label ? this.label : "";
            this.label = this.encodeHTML(this.message(label));
         }
         if (this.browserTitlePrefix)
         {
            this.browserTitlePrefix = this.encodeHTML(this.message(this.browserTitlePrefix));
         }
      },
      
      /**
       * @instance
       */
      postCreate: function alfresco_header_Title__postCreate() {
         this.textNode.innerHTML = this.label;
         if (this.setBrowserTitle === true)
         {
            document.title = this.browserTitlePrefix + " \u00bb " + this.label; // Set the browser title
         }
         if (this.maxWidth) {
            this.textNode.title = this.label;
            domClass.add(this.textNode, "has-max-width");
            domStyle.set(this.textNode, {
               maxWidth: this.maxWidth
            });
         }
         if (this.targetUrl)
         {
            this.textNode.href = AlfConstants.URL_PAGECONTEXT + this.targetUrl;
         }
         this.alfSubscribe("ALF_UPDATE_PAGE_TITLE", lang.hitch(this, "updatePageTitle"));
      },
      
      /**
       * Handles requests to update the page title.
       * 
       * @instance
       * @param {object} payload The payload published on the update title topic
       */
      updatePageTitle: function alfresco_header_Title__updatePageTitle(payload) {
         if (payload && payload.title)
         {
            var title = this.message(payload.title);
            this.textNode.innerHTML = this.encodeHTML(title);
            document.title = this.browserTitlePrefix + " \u00bb " + title; // Set the browser title
         }
      }
   });
});