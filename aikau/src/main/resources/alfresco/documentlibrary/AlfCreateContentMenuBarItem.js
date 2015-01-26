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
 * This is a customization of the standard [menu bar item]{@link module:alfresco/menus/AlfMenuBarItem} that
 * mixes in the ability to determine whether or not the current user has the ability to create content 
 * at the current rendered location. This was created for use in the document library (for the "Upload" button
 * but is applicable for use anywhere where user access rights need to be verified.
 * 
 * @module alfresco/documentlibrary/AlfCreateContentMenuBarItem
 * @extends module:alfresco/menus/AlfMenuBarItem
 * @mixes module:alfresco/documentlibrary/_AlfCreateContentPermissionsMixin
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBarItem",
        "alfresco/documentlibrary/_AlfCreateContentPermissionsMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang"], 
        function(declare, AlfMenuBarItem, _AlfCreateContentPermissionsMixin, _AlfDocumentListTopicMixin, lang) {
   
   return declare([AlfMenuBarItem, _AlfCreateContentPermissionsMixin, _AlfDocumentListTopicMixin], {
      
      /**
       * Extends the [superclass function]{@link module:alfresco/menus/AlfMenuBarItem#postCreate} to subscribe to
       * the [userAccessChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#userAccessChangeTopic}
       * topic which is handled by [onUserAcess]{@link module:alfresco/documentlibrary/_AlfCreateContentPermissionsMixin#onUserAcess}
       * and [hashChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#hashChangeTopic} which is
       * handled by [onFilterChange]{@link module:alfresco/documentlibrary/_AlfCreateContentPermissionsMixin#onFilterChange}
       * @instance
       */
      postCreate: function alfresco_documentlibrary_AlfCreateContentMenuBarItem__postCreate() {
         this.alfSubscribe(this.userAccessChangeTopic, lang.hitch(this, this.onUserAcess));
         this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.onFilterChange));
         this.inherited(arguments);
      }
   });
});