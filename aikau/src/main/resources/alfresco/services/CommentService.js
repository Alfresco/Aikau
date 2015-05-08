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
 * <p>This service is used to retrieve comments from an Alfresco Repository and has been created to 
 * primarily service the [CommentsList]{@link module:alfresco/renderers/CommentsList}. It is required
 * in order to normalise the JSON response returned on the comments API. The 
 * [CrudService]{@link module:alfresco/renderers/CrudService} is currently used to service create, update and
 * delete comment requests, but this service may be updated in the future to handle those operations directly.</p>
 * 
 * @module alfresco/services/CommentService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "alfresco/core/CoreXhr",
        "dojo/_base/lang",
        "dojo/_base/array",
        "service/constants/Default"],
        function(declare, AlfCore, CoreXhr, lang, array, AlfConstants) {
   
   return declare([AlfCore, CoreXhr], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/CommentService.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/CommentService.properties"}],
      
      /**
       * Sets up the subscriptions for the CommentService
       * 
       * @instance 
       * @param {array} args The constructor arguments.
       */
      constructor: function alfresco_services_CommentService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_GET_COMMENTS", lang.hitch(this, this.onGetComments));
      },
      
      /**
       * 
       * 
       * @instance
       * @param {object} payload
       */
      onGetComments: function alfresco_services_CommentService__onGetComments(payload) {
         var reverse = payload.sortAscending === true;
         var pageSize = payload.pageSize || 10;
         var startIndex = 0;
         if (payload.page)
         {
            startIndex = (payload.page - 1) * pageSize;
         }
         var url = AlfConstants.URL_SERVICECONTEXT + "/sanitize/response?items=items&attribute=content&ws=/api/node/" + payload.nodeRef + "/comments%3Freverse=" + reverse + "%26startIndex=" + startIndex + "%26pageSize=" + pageSize;
         this.serviceXhr({
            url: url,
            alfTopic: payload.alfResponseTopic || null,
            method: "GET",
            successCallback: this.onCommentsRetrieved,
            callbackScope: this
         });
      },

      /**
       * This is the success callback function that is used when retrieving comments. It updates each comment object to
       * ensure that it contains a "displayName" attribute which can be used for the 
       * [imageTitleProperty]{@link module:alfresco/renderers/Thumbnail#imageTitleProperty} of a 
       * [AvatarThumbnail]{@link module:alfresco/renderers/AvatarThumbnail}.
       *
       * @instance
       * @param {object} response The object returned from the successful XHR request
       * @param {object} requestConfig The original configuration passed when the request was made
       */
      onCommentsRetrieved: function alfresco_services_CommentService__onCommentsRetrieved(response, requestConfig) {
         array.forEach(response.items, lang.hitch(this, this.updateComment));
         response.totalRecords = response.total;
         if (requestConfig.alfTopic)
         {
            this.alfPublish(requestConfig.alfTopic + "_SUCCESS", response);
         }
      },

      /**
       * The comments API does not include the display name for the comment author. Instead it provides the 
       * first and last names as two separate attributes. This function updates a comment to create a displayName
       * attribute that is the combination of the first and last name attributes.
       *
       * @instance
       * @param {object} comment The comment to update
       */
      updateComment: function alfresco_services_CommentService__updateComment(comment) {
         if (comment && comment.author)
         {
            comment.author.displayName = comment.author.firstName + " " + comment.author.lastName;
         }
      }
   });
});
