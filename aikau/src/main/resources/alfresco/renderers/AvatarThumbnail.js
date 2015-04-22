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
 * <p>This extends the standard [thumbnail widget]{@link module:alfresco/renderers/Thumbnail} to render user avatar
 * thumbnails. In this current implementation click events are suppressed, however in the future this widget is likely
 * to be enhanced to support configurable previews or navigation actions.</p>
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
 * @module alfresco/renderers/AvatarThumbnail
 * @extends module:alfresco/renderers/Thumbnail
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Thumbnail",
        "dojo/_base/event"], 
        function(declare, Thumbnail, event) {

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
       * @default "alfresco-renderers-AvatarThumbnail"
       */
      customClasses: "alfresco-renderers-AvatarThumbnail",
      
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
       * @default "userName"
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
      postMixInProperties: function alfresco_renderers_Thumbnail__postMixInProperties() {
         if (!this.thumbnailUrlTemplate)
         {
            this.thumbnailUrlTemplate = "slingshot/profile/avatar/{" + this.userNameProperty + "}/thumbnail/avatar";
         }
         this.inherited(arguments);
      },

      /**
       * Overrides the [inherited function]{@link module:alfresco/renderers/Thumbnail#onLinkClick} to prevent
       * click actions from having any effect. In the future this is likely to be updated to support previewing
       * the user data or navigating to a configurable user details page.
       * 
       * @param  {object} evt The click event
       */
      onLinkClick: function alfresco_renderers_AvatarThumbnail__onLinkClick(evt) {
         evt && event.stop(evt);
      }
   });
});