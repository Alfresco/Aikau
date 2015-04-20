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
 * @module aikauTesting/mockservices/CommentsListMockService
 * @extends module:alfresco/core/Core
 * @author Martin Doyle
 */
define(["alfresco/core/Core",
      "dojo/_base/array",
      "dojo/_base/declare",
      "dojo/_base/lang"
   ],
   function(AlfCore, array, declare, lang) {

      return declare([AlfCore], {

         /**
          * The comments as HTML strings
          *
          * @type {string[]}
          */
         _comments: null,

         /**
          * The template for a new comment
          *
          * @instance
          * @type {Object}
          */
         _commentTemplate: {
            "url": "api/comment/node/workspace\/SpacesStore\/4fd42b12-361a-4e02-a1da-9131e6fa074d",
            "nodeRef": "workspace://SpacesStore/4fd42b12-361a-4e02-a1da-9131e6fa074d",
            "name": "4fd42b12-361a-4e02-a1da-9131e6fa074d",
            "title": "",
            "content": null, // [Comment HTML]
            "author": {
               "username": "admin",
               "firstName": "Administrator",
               "lastName": ""
            },
            "createdOn": "Apr 17 2015 14:41:59 GMT+0100 (BST)",
            "modifiedOn": "Apr 17 2015 14:41:59 GMT+0100 (BST)",
            "createdOnISO": "2015-04-17T14:41:59.375+01:00",
            "modifiedOnISO": "2015-04-17T14:41:59.375+01:00",
            "isUpdated": false,
            "permissions": {
               "edit": true,
               "delete": true
            }
         },

         /**
          * The template for a comments get-request's response
          *
          * @instance
          * @type {Object}
          */
         _responseTemplate: {
            "nodePermissions": {
               "create": true,
               "edit": true,
               "delete": true
            },
            "total": 0, // [Num comments]
            "pageSize": 10,
            "startIndex": 0,
            "itemCount": 0, // [Num comments]
            "items": null // [Comments]
         },

         /**
          * Constructor
          *
          * @instance
          * @param {array} args The constructor arguments.
          */
         constructor: function alfresco_testing_mockservices_CommentsListMockService__constructor(args) {
            declare.safeMixin(this, args);
            this._comments = [];
            this.alfSubscribe("ALF_CRUD_GET_ALL", lang.hitch(this, this._getComments));
            this.alfSubscribe("ALF_CRUD_CREATE", lang.hitch(this, this._createComment));
         },

         /**
          * Build a create response
          *
          * @instance
          * @param {string} comment The comment HTML
          * @returns  {object} The response
          */
         _buildCreateResponse: function alfresco_testing_mockservices_CommentsListMockService___buildCreateResponse(comment) {
            return lang.mixin({}, this._commentTemplate, {
               content: comment
            });
         },

         /**
          * Build a get response
          *
          * @instance
          * @returns  {object} The response
          */
         _buildGetResponse: function alfresco_testing_mockservices_CommentsListMockService___buildGetResponse() {
            var response = lang.mixin({}, this._responseTemplate, {
               items: []
            });
            array.forEach(this._comments, function(nextComment) {
               var commentObj = lang.mixin({}, this._commentTemplate, {
                  content: nextComment
               });
               response.total++;
               response.itemCount++;
               response.items.push(commentObj);
            }, this);
            return response;
         },

         /**
          * Handle comment creation
          *
          * @instance
          * @param    {object} payload The publish payload
          */
         _createComment: function alfresco_testing_mockservices_CommentsListMockService___createComment(payload) {
            this._comments.push(payload.content);
            this.alfPublish(payload.pubSubScope + "ALF_DOCLIST_RELOAD_DATA");
         },

         /**
          * Handle a get request
          *
          * @instance
          * @param    {object} payload The payload for the get request
          */
         _getComments: function alfresco_testing_mockservices_CommentsListMockService___getComments(payload) {
            this.alfPublish(payload.alfResponseTopic + "_SUCCESS", {
               requestConfig: payload,
               response: this._buildGetResponse()
            });
         }

         // POST
         //          content: "<p>Hello. This is my first comment.</p>"
         // pubSubScope: "516a3546-3bcb-4c2a-89a0-1b4773335d23"
      });
   });