/**
 * Copyright (C) 2005-2016 Alfresco Software Limited.
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
 * This mixin can be used for widgets that support mouse clicks and provides the ability to support 
 * clicks with the middle mouse button or the control key depressed to open navigation requests
 * in a new browser tab.
 *
 * @module alfresco/navigation/LinkClickMixin
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/services/_NavigationServiceTopicMixin
 * @author Dave Draper
 * @since 1.0.50
 */
define(["dojo/_base/declare",
        "alfresco/services/_NavigationServiceTopicMixin",
        "dojo/has"], 
        function(declare, _NavigationServiceTopicMixin, has) {
   
   return declare([_NavigationServiceTopicMixin], {

      /**
       * Indicates whether or not a middle-button or control key depresssed mouse click on the link should 
       * result in the link being opened in a new browser tab. If this is configured to be true then the a "target" 
       * attribute of "NEW" will be configured on the payload.
       * 
       * @instance
       * @type {boolean}
       * @default
       */
      newTabOnMiddleOrCtrlClick: false,

      /**
       * The default navigation target to use in 
       * [processMiddleOrCtrlClick]{@link module:alfresco/navigation/LinkClickMixin#processMiddleOrCtrlClick}
       * if a middle click or control-click is not detected.
       *
       * @instance
       * @type {string}
       * @default
       */
      defaultNavigationTarget: "CURRENT",

      /**
       * For [navigation topics]{@link module:alfresco/services/_NavigationServiceTopicMixin#navigateToPageTopic}
       * the click action is checked for a middle mouse click or control key depressed mouse click if the payload 
       * does not request that the navigation target is a new browser tab then it will be added. No change will be 
       * made if [newTabOnMiddleOrCtrlClick]{@link module:alfresco/navigation/LinkClickMixin#newTabOnMiddleOrCtrlClick}
       * is not configured to be true.
       * 
       * @instance
       * @param {object} evt The link click event
       * @param {string} publishTopic The topic to be published as a result of the click
       * @param {object} publishPayload The payload to be published as a result of the click
       */
      processMiddleOrCtrlClick: function alfresco_navigation_LinkClickMixin__processMiddleOrCtrlClick(evt, publishTopic, publishPayload) {
         if (this.newTabOnMiddleOrCtrlClick && publishTopic === this.navigateToPageTopic) 
         {
            var middleButton = evt.button === 1,
               leftButton = evt.button === 0,
               ctrlKey = has("mac") ? evt.metaKey : evt.ctrlKey;
            if (middleButton || (leftButton && ctrlKey))
            {
               publishPayload.target = this.newTarget;
            }
            else if (leftButton && publishPayload.target !== this.currentTarget)
            {
               publishPayload.target = this.defaultNavigationTarget || this.currentTarget;
            }
         }
      }
   });
});