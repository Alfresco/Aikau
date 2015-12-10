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
 * <p>This mixin can be used to wrap HTML elements in a widget with an anchor element that allows users
 * to use the browser context-menu to copy or open the link in a new tab or window. This works around
 * the fact that all Aikau navigation is achieved via publishing requests to be handled by the 
 * [Navigation Service]{@link module:alfresco/services/NavigationService}.</p>
 * <p>This should be mixed into a widget and then the [makeAnchor]{@link module:alfresco/navigation/_HtmlAnchorMixin#makeAnchor}
 * function should be called by the postCreate function (or any function called after the widgets DOM
 * has been created). In order for this to work the [getAnchorTargetSelectors]{@link module:alfresco/navigation/_HtmlAnchorMixin#getAnchorTargetSelectors}
 * should be overridden to return an array of the CSS selectors needed to identify the elements to be wrapped
 * with an anchor element.</p>
 *
 * @module alfresco/navigation/_HtmlAnchorMixin
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 * @author Martin Doyle
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/services/_NavigationServiceTopicMixin",
        "alfresco/util/urlUtils",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/dom-construct",
        "dojo/query",
        "dojo/NodeList",
        "dojo/NodeList-manipulate"], 
        function(declare, AlfCore, _NavigationServiceTopicMixin, urlUtils, AlfConstants, lang, array, domConstruct, query /*, NodeList, NodeListManipulate*/) {
   
   return declare([AlfCore, _NavigationServiceTopicMixin], {

      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/_HtmlAnchorMixin.css"}]
       */
      cssRequirements: [{cssFile:"./css/_HtmlAnchorMixin.css"}],

      /**
       * When set to true, the resulting anchor(s) will be removed from the page tab-order by setting their tabindex to -1.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      excludeFromTabOrder: true,

      /**
       * The title text to put on the generated link(s).
       *
       * @instance
       * @type {string}
       * @default
       */
      label: null,

      /**
       * When set to true, all of the direct children of this widget's root node will be wrapped in a single anchor,
       * when [makeAnchor()]{@link module:alfresco/navigation/_HtmlAnchorMixin#makeAnchor} is called.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.40
       */
      wrapAllChildren: false,

      /**
       * When a targetUrl is specified we want to wrap menu item labels in <a> elements to allow the browsers context menu
       * to access the URL (most commonly used for opening a page in a new tab). However, we aren't going to allow the browser
       * to process the link as we still want it to go via the NavigationService...
       *
       * @instance
       * @param {string} url The URL configured
       * @param {string} type The target configured
       */
      makeAnchor: function alfresco_navigation__HtmlAnchorMixin__makeAnchor(url, type) {
         var anchorUrl = urlUtils.convertUrl(url, type);
         anchorUrl && this._addAnchors(anchorUrl);
      },

      /**
       * This function is called for any menu item with a targetUrl. By default it addresses the known menu items DOM structures
       * of the AlfMenuItem and AlfMenuBarItem. However, it can be extended or updated to handle the DOM structure of additional
       * menu widgets.
       * 
       * @instance
       * @param {string} url The URL to use for the anchor
       */
      _addAnchors: function alfresco_navigation__HtmlAnchorMixin__addAnchors(url) {

         // Setup and create the anchor
         var anchorAttrs = {
            className: "alfresco-navigation-_HtmlAnchorMixin",
            href: url
         };
         if (this.label) {
            anchorAttrs.title = this.message(this.label);
         }
         if (this.excludeFromTabOrder) {
            anchorAttrs.tabIndex = "-1";
         }
         var anchor = domConstruct.create("A", anchorAttrs);

         // Create anchor(s) based upon wrapAllChildren setting
         if (this.wrapAllChildren) {
            this.domNode.appendChild(anchor);
            while (this.domNode.firstChild !== anchor) {
               anchor.appendChild(this.domNode.firstChild);
            }
         } else {
            array.forEach(this.getAnchorTargetSelectors(), function(selector) {
               query(selector, this.domNode).wrapInner(anchor);
            }, this);
         }
      },

      /**
       * This function should be overridden to provide an array of the CSS selectors to use to identify
       * the elements to wrap in an anchor. By default this will return an empty array.
       *
       * @instance
       * @returns {array}
       */
      getAnchorTargetSelectors: function alfresco_navigation__HtmlAnchorMixin__getAnchorTargetSelectors() {
         return [];
      }
   });
});