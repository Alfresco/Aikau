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
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/services/_NavigationServiceTopicMixin",
        "service/constants/Default",
        "dojo/_base/lang",
        "dojo/_base/array",
        "dojo/query",
        "dojo/NodeList",
        "dojo/NodeList-manipulate"], 
        function(declare, AlfCore, _NavigationServiceTopicMixin, AlfConstants, lang, array, query, NodeList, NodeListManipulate) {
   
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
       * When a targetUrl is specified we want to wrap menu item labels in <a> elements to allow the browsers context menu
       * to access the URL (most commonly used for opening a page in a new tab). However, we aren't going to allow the browser
       * to process the link as we still want it to go via the NavigationService...
       *
       * @instance
       * @param {string} url The URL configured
       * @param {string} type The target configured
       */
      makeAnchor: function alfresco_navigation__HtmlAnchorMixin__makeAnchor(url, type) {
         if (url != null)
         {
            // The following code is based on the NavigationService, it should possibly be abstracted to a mixin
            // to prevent future maintenance issues, but given this is "non-functional" code it's not important at the moment.
            // We want to build a URL to set as the "href" attribute of the <a> element.
            var anchorUrl;
            if (typeof type == "undefined" ||
                type == null ||
                type === "" ||
                type == this.sharePageRelativePath)
            {
               anchorUrl = AlfConstants.URL_PAGECONTEXT + url;
            }
            else if (type == this.contextRelativePath)
            {
               anchorUrl = AlfConstants.URL_CONTEXT + url;
            }
            else if (type == this.fullPath)
            {
               anchorUrl = url;
            }
            // Add the anchor elements...
            this._addAnchors(anchorUrl);
         }
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
         array.forEach(this.getAnchorTargetSelectors(), function(selector, index) {
            dojo.query(selector, this.domNode).wrapInner("<a tabIndex='-1' class='alfresco-navigation-_HtmlAnchorMixin' title='" + this.label + "' href='" + url + "'></a>");
         }, this);
         // dojo.query("td.dijitMenuItemLabel", this.domNode).wrapInner("<a class='alfresco-menus-_AlfMenuItemMixin' href='" + url + "'></a>");
         // dojo.query("span.alf-menu-bar-label-node", this.domNode).wrapInner("<a class='alfresco-menus-_AlfMenuItemMixin' href='" + url + "'></a>");
         // dojo.query("span.alfresco-renderers-PropertyLink", this.domNode).wrapInner("<a class='alfresco-menus-_AlfMenuItemMixin' href='" + url + "'></a>");
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