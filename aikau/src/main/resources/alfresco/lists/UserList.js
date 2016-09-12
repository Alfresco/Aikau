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
 *
 * @module alfresco/lists/UserList
 * @extends module:alfresco/lists/AlfFilteredList
 * @author Dave Draper
 * @since 1.0.86
 */
define(["dojo/_base/declare",
        "alfresco/lists/AlfFilteredList",
        "alfresco/core/topics",
        "dojo/_base/array",
        "dojo/_base/lang",
        "dojo/Deferred",
        "dojo/dom-class",
        "dojo/when"],
        function(declare, AlfFilteredList, topics, array, lang, Deferred, domClass, when) {

   return declare([AlfFilteredList], {

      /**
       * An array of the i18n files to use with this widget.
       *
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/UserList.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/UserList.properties"}],

      /**
       * This will be populated with the array of the users that the current user is following. It
       * is used to augment the loaded data so that it is possible to indicate which users are being
       * followed.
       * 
       * @instance
       * @type {object[]}
       * @default
       */
      followedUsers: null,

      /**
       * This is the topic that is set as a success topic to be published on when publishing
       * requests for the users that are being followed by the current user.
       * 
       * @instance
       * @type {string}
       * @default
       */
      followedUsersSuccessTopic: null,

      /**
       * Overrides the [default value]{@link module:alfresco/lists/AlfList#loadDataPublishTopic}
       * to make a request to [get users]{@link module:alfresco/core/topics#GET_USERS}.
       *
       * @instance
       * @type {string}
       * @default
       */
      loadDataPublishTopic: topics.GET_USERS,

      /**
       * This is reset to a promise before users are loaded and is resolved when the users being
       * followed by the current user have been loaded.
       * 
       * @intance
       * @type {Deferred}
       * @default
       */
      _followedUsersPromise: null,

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfList#loadData} to publish
       * a request to retrieve the users that the current user is following.
       * 
       * @instance
       * @param {object} [parameters] An optional parameters object providing information about the data to load
       * @fires module:alfresco/core/topics#GET_FOLLOWED_USERS
       */
      loadData: function alfresco_lists_UserList__loadData(/*jshint unused:false*/parameters) {
         this._followedUsersPromise = new Deferred();
         this.alfServicePublish(topics.GET_FOLLOWED_USERS, {
            alfSuccessTopic: this.followedUsersSuccessTopic
         });
         this.inherited(arguments);
      },

      /**
       * Run after widget created
       *
       * @instance
       * @override
       * @since 1.0.48
       */
      postCreate: function alfresco_lists_UserList__postCreate() {
         domClass.add(this.domNode, "alfresco-lists-UserList");
         this.followedUsersSuccessTopic = this.generateUuid();
         this.alfSubscribe(this.followedUsersSuccessTopic, lang.hitch(this, this.onFollowedUserResults));
         this.inherited(arguments);
      },

      /**
       * Updates the [followedUsers]{@link module:alfresco/lists/UserList#followedUsers} with the loaded
       * data.
       * 
       * @instance
       * @param {object} response The response from the request
       * @param {object} originalRequestConfig The configuration passed on the original request
       */
      onFollowedUserResults: function alfresco_lists_UserList__onFollowedUserResults(response, /*jshint unused:false*/ originalRequestConfig) {
         this.followedUsers = response.response.people || [];
         this._followedUsersPromise.resolve(this.followedUsers);
      },

      /**
       * This extends the [inherited function]{@link module:alfresco/lists/AlfList#processLoadedData} to merge the
       * [followed user]{@link module:alfresco/lists/UserList#followedUsers} data.
       *
       * @instance
       * @param {object} response The original response.
       */
      processLoadedData: function alfresco_lists_UserList__processLoadedData(/*jshint unused:false*/ response) {
         array.forEach(this.currentData.items, function(user) {
            // Default that the current user is NOT being followed, this will be overridden
            // if it turns out that the user is being followed...
            user.following = false;
            array.some(this.followedUsers, function(followedUser) {
               if (user.userName === followedUser.userName)
               {
                  // If the userName attributes match then update the following state...
                  user.following = true;
               }
               // Returning the following state allows loops to exit early once a followed user has been determined...
               return user.following;
            }, this);
         }, this);

         this.inherited(arguments);
      },

      /**
       * Extends the [inherited function]{@link module:alfresco/lists/AlfList#renderView} to ensure that
       * data is available about the users being followed by the current user.
       * 
       * @instance
       */
      renderView: function alfresco_lists_UserList__renderView() {
         // var followedUsers = this.getFollowedUsers();
         if (this._followedUsersPromise.isResolved())
         {
            this.inherited(arguments);
         }
         else
         {
            when(this._followedUsersPromise, lang.hitch(this, this.renderView));
         }
      },

      /**
       * Overrides the [default filters]{@link module:alfresco/lists/AlfFilteredList#widgetsForFilters} as 
       * there should be no filters for user lists unless explicitly configured.
       *
       * @instance
       * @type {object[]}
       * @default
       */
      widgetsForFilters: null
   });
});
