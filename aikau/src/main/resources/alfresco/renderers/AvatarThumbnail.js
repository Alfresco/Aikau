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
 * <p>This extends the standard [thumbnail widget]{@link module:alfresco/renderers/Thumbnail} to render user avatar
 * thumbnails. By default, it has no click action, however it is possible to specify a custom publishTopic which
 * will then render the thumbnail clickable. For more information, please see the example below.</p>
 * 
 * <p>The Alfresco REST APIs greatly vary in the attribute that user names are assigned to so it is important when
 * using this widget to set the [userNameProperty]{@link module:alfresco/renderers/AvatarThumbnail#userNameProperty}
 * for the context in which the thumbnail is to be used. If the REST API supports it you should also look to set the
 * [imageTitleProperty]{@link module:alfresco/renderers/Thumbnail#imageTitleProperty} to the full name of the user</p>
 *
 * @example <caption>Example configuration to set a specific user name and title properties:</caption>
 * {
 *    "name": "alfresco/renderers/AvatarThumbnail",
 *    "config": {
 *       "userNameProperty": "user",
 *       "imageTitleProperty": "displayName"
 *    }
 * }
 * 
 * @example <caption>Example configuration with click/publish:</caption>
 * {
 *    name: "alfresco/renderers/AvatarThumbnail",
 *    id: "GUEST_THUMBNAIL",
 *    config: {
 *       currentItem: {
 *          userName: "guest"
 *       },
 *       publishTopic: topics.DISPLAY_NOTIFICATION,
 *       publishPayload: {
 *          message: "You clicked on the guest thumbnail"
 *       },
 *       publishGlobal: true
 *    }
 * }
 *
 * @module alfresco/renderers/AvatarThumbnail
 * @extends module:alfresco/renderers/Thumbnail
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Thumbnail",
        "dojo/dom-style",
        "dojo/_base/array",
        "dojo/_base/event",
        "dojo/_base/lang"], 
        function(declare, Thumbnail, domStyle, array, event, lang) {

   return declare([Thumbnail], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/AvatarThumbnail.css"}]
       */
      cssRequirements: [{cssFile:"./css/AvatarThumbnail.css"}],
      
      /**
       * Adds the "alfresco-renderers-AvatarThumbnail" CSS class the main DOM node defined in the template
       * 
       * @instance
       * @type {string}
       * @default
       */
      customClasses: "alfresco-renderers-AvatarThumbnail",
      
      /**
       * The name of the group image to use. 
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.75
       */
      groupImage: "group-64.png",

      /**
       * A dot-notation property of the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}
       * that can be used to determine whether or not it represents a group. This property is then matched against
       * the values in the [groupValues]{@link module:alfresco/renderers/AvatarThumbnail#groupValues}.
       * 
       * @instance
       * @type {string}
       * @default
       * @since 1.0.75
       */
      groupProperty: null,

      /**
       * An array of the values that the [groupProperty]{@link module:alfresco/renderers/AvatarThumbnail#groupProperty}
       * of the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} can match to indicate that
       * it represents group (rather than a user).
       * 
       * @instance
       * @type {string[]}
       * @default
       * @since 1.0.75
       */
      groupValues: null,

      /**
       * A property indicating whether or not the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}
       * represents a group or not. This can be determined by configuring the
       * [groupProperty]{@link module:alfresco/renderers/AvatarThumbnail#groupProperty} and
       * [groupValues]{@link module:alfresco/renderers/AvatarThumbnail#groupValues} attributes, but it can be set
       * directly if required.
       *
       * @instance
       * @type {boolean}
       * @default
       * @since 1.0.75
       */
      isGroup: false,

      /**
       * Use the to set the attribute in the currentItem object that maps to the user name of the 
       * of the user that should have their avatar displayed. This is used in the generated
       * [thumbnailUrlTemplate]{@link module:alfresco/renderers/AvatarThumbnail#thumbnailUrlTemplate}
       * to define the URL to retrieve the thumbnail from. Be aware that the default 
       * [thumbnailUrlTemplate]{@link module:alfresco/renderers/AvatarThumbnail#thumbnailUrlTemplate}
       * will support user nodeRef values as well as user names.
       * 
       * @instance
       * @type {string}
       * @default
       */
      userNameProperty: "userName",

      /**
       * Sets a URL template for retrieving the user avatar thumbnail if one has not been configured. 
       * It is possible to explicitly set a 
       * [thumbnailUrlTemplate]{@link module:alfresco/renderers/AvatarThumbnail#thumbnailUrlTemplate}
       * which will stop the default from being set, but it is simpler to just configure the 
       * [userNameProperty]{@link module:alfresco/renderers/AvatarThumbnail#userNameProperty} instead.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_AvatarThumbnail__postMixInProperties() {
         if (!this.thumbnailUrlTemplate)
         {
            // See AKU-509 - make sure that the user name is encoded to ensure that the image can be loaded...
            this.currentItem[this.userNameProperty] = encodeURIComponent(this.currentItem[this.userNameProperty]);
            this.thumbnailUrlTemplate = "slingshot/profile/avatar/{" + this.userNameProperty + "}/thumbnail/avatar";
         }
         
         this.inherited(arguments);

         if (this.groupProperty && this.groupValues && this.groupValues.length)
         {
            var groupPropertyValue = lang.getObject(this.groupProperty, false, this.currentItem);
            this.isGroup = array.some(this.groupValues, function(value) {
               return value === groupPropertyValue;
            });
         }
         if (this.isGroup)
         {
            this.thumbnailUrl = require.toUrl("alfresco/renderers/css/images/" + this.groupImage);
         }
      },

      /**
       * Called after widget has been created.
       *
       * @instance
       */
      postCreate: function alfresco_renderers_AvatarThumbnail__postCreate(){
         this.inherited(arguments);
         this.publishTopic && domStyle.set(this.frameNode, "cursor", "pointer");
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/renderers/Thumbnail#onLinkClick} to prevent
       * click actions from having any effect unless a publishTopic has been specified.
       * 
       * @param  {object} evt The click event
       */
      onLinkClick: function alfresco_renderers_AvatarThumbnail__onLinkClick(evt) {
         evt && event.stop(evt);
         this.publishTopic && this.alfPublish(this.publishTopic, this.getGeneratedPayload(), this.publishGlobal, this.publishToParent);
      }
   });
});