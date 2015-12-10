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
 * @mixes external:dijit/_TemplatedMixin
 * @mixes external:dijit/_OnDijitClickMixin
 * @mixes module:alfresco/navigation/_HtmlAnchorMixin
 * @mixes module:alfresco/services/_NavigationServiceTopicMixin
 * @mixes module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "dijit/_TemplatedMixin",
        "dijit/_OnDijitClickMixin",
        "alfresco/navigation/_HtmlAnchorMixin",
        "alfresco/services/_NavigationServiceTopicMixin",
        "dojo/text!./templates/Title.html",
        "dojo/_base/lang",
        "alfresco/core/Core",
        "alfresco/core/topics",
        "alfresco/enums/urlTypes",
        "dojo/dom-class",
        "dojo/dom-style",
        "dojo/has"], 
        function(declare, _WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _HtmlAnchorMixin, _NavigationServiceTopicMixin, 
                 template, lang, AlfCore, topics, urlTypes, domClass, domStyle, has) {
   
   return declare([_WidgetBase, _TemplatedMixin, _OnDijitClickMixin, _HtmlAnchorMixin, _NavigationServiceTopicMixin, AlfCore], {
      
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
       * This is the prefix to apply before the [label]{@link module:alfresco/header/Title#label} when
       * setting the browser window title. It defaults to a standard Alfresco prefix but should be 
       * overridden if required. The browser title will only be set when [setBrowserTitle]{@link module:alfresco/header/Title#setBrowserTitle}
       * is set to true.
       * 
       * @instance
       * @type {string}
       * @default
       */
      browserTitlePrefix: "Alfresco",

      /**
       * @instance
       * @type {string}
       * @default
       */
      label: null,
      
      /**
       * Indicates whether or not the browser window title should be updated
       *
       * @instance
       * @type {boolean}
       * @default
       */
      setBrowserTitle: false,

      /**
       * This is the URL to navigate to when the title is clicked.
       * 
       * @instance
       * @type {string}
       * @default
       */
      targetUrl: null,
      
      /**
       * Indicates how the target URL should be handled.
       *
       * @instance
       * @type {string}
       * @default [PAGE_RELATIVE]{@link module:alfresco/enums/urlTypes#PAGE_RELATIVE}
       * @since 1.0.32
       */
      targetUrlType: urlTypes.PAGE_RELATIVE,

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

            if (this.setBrowserTitle === true)
            {
               document.title = this.browserTitlePrefix + " \u00bb " + this.label; // Set the browser title
            }
         
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
         
         if (this.maxWidth) {
            this.textNode.title = this.label;
            domClass.add(this.textNode, "has-max-width");
            domStyle.set(this.textNode, {
               maxWidth: this.maxWidth
            });
         }
         if (this.targetUrl)
         {
            this.makeAnchor(this.targetUrl, this.targetUrlType);
         }
         this.alfSubscribe(topics.UPDATE_PAGE_TITLE, lang.hitch(this, this.updatePageTitle));
      },

      /**
       * Returns an array containing the selector that identifies the span to wrap in an anchor.
       * This overrides the [mixed in function]{@link module:alfresco/navigation/_HtmlAnchorMixin}
       * that just returns an empty array.
       *
       * @instance
       * @since 1.0.32
       */
      getAnchorTargetSelectors: function alfresco_header_Title__getAnchorTargetSelectors() {
         return [".alfresco-header-Title__text"];
      },

      /**
       * Handles click events when a [targetUrl]{@link module:alfresco/header/Title#targetUrl} has
       * been provided.
       *
       * @instance
       * @param {object} evt The click event
       * @since 1.0.32
       */
      onClick: function alfresco_header_Title__onClick(evt) {
         var targetUrlLocation = this.targetUrlLocation;
         if (has("mac") && evt.metaKey)
         {
            targetUrlLocation = "NEW";
         }

         if (this.targetUrl)
         {
            // Stop the event (to prevent the browser processing <a> elements
            evt.preventDefault();
            evt.stopPropagation();

            // Handle URLs...
            this.alfPublish("ALF_NAVIGATE_TO_PAGE", { url: this.targetUrl,
                                                      type: this.targetUrlType,
                                                      target: targetUrlLocation});
         }
         else
         {
            this.alfLog("error", "An alfresco/header/Title was clicked but did not define a 'targetUrl' attribute", evt);
         }
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