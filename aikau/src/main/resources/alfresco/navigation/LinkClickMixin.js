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
 * @module alfresco/navigation/LinkClickMixin
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/services/_NavigationServiceTopicMixin
 * @author Dave Draper
 * @since 1.0.50
 */
define(["dojo/_base/declare",
        "alfresco/services/_NavigationServiceTopicMixin"], 
        function(declare, _NavigationServiceTopicMixin) {
   
   return declare([_NavigationServiceTopicMixin], {

      /**
       * Indicates whether or not a middle-button mouse click on the link should result in the link
       * being opened in a new browser tab. If this is configured to be true then the a "target" attribute
       * of "NEW" will be configured on the payload.
       * 
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.50
       */
      newTabOnMiddleMouseClick: false,

      /**
       * For [navigation topics]{@link module:alfresco/services/_NavigationServiceTopicMixin#navigateToPageTopic}
       * the click action is checked for a middle mouse click action if the payload does not request that the
       * navigation target is a new browser tab then it will be added. No change will be made if 
       * [newTabOnMiddleMouseClick]{@link module:alfresco/navigation/LinkClickMixin#newTabOnMiddleMouseClick}
       * is not configured to be true.
       * 
       * @instance
       * @param {object} evt The link click event
       * @param {string} publishTopic The topic to be published as a result of the click
       * @param {object} publishPayload The payload to be published as a result of the click
       * @since 1.0.50
       */
      checkForMiddleClick: function alfresco_navigation_LinkClickMixin__checkForMiddleClick(evt, publishTopic, publishPayload) {
         if (this.newTabOnMiddleMouseClick && publishTopic === this.navigateToPageTopic) 
         {
            if ((evt.which === 2 || (evt.which === 1 && evt.ctrlKey)) && publishPayload.target !== this.newTarget)
            {
               publishPayload.target = this.newTarget;
            }
            else if (evt.which === 1 && publishPayload.target !== this.currentTarget)
            {
               publishPayload.target = this.currentTarget;
            }
         }
      }
   });
});