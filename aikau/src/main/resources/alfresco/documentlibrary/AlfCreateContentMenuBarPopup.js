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
 * This is a customization of the standard [menu bar item]{@link module:alfresco/menus/AlfMenuBarPopup} that
 * mixes in the ability to determine whether or not the current user has the ability to create content 
 * at the current rendered location. This was created for use in the document library (for the "Create..." menu
 * but is applicable for use anywhere where user access rights need to be verified.
 * 
 * @module alfresco/documentlibrary/AlfCreateContentMenuBarPopup
 * @extends module:alfresco/menus/AlfMenuBarPopup
 * @mixes module:alfresco/documentlibrary/_AlfCreateContentPermissionsMixin
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuBarPopup",
        "alfresco/documentlibrary/_AlfCreateContentPermissionsMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare, AlfMenuBarPopup, _AlfCreateContentPermissionsMixin, _AlfDocumentListTopicMixin, lang, domClass) {
   
   return declare([AlfMenuBarPopup, _AlfCreateContentPermissionsMixin, _AlfDocumentListTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfCreateContentMenuBarPopup.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfCreateContentMenuBarPopup.properties"}],
      
      /**
       * Sets a default label key for the menu bar popup
       * 
       * @instance
       * @type {string} 
       * @default "default.label"
       */
      label: "default.label",
      
      /**
       * Sets a default icon class for the menu bar popup
       * 
       * @instance
       * @type {string}
       * @default "alf-create-icon"
       */
      iconClass: "alf-create-icon",
      
      /**
       * Extends the [superclass function]{@link module:alfresco/menus/AlfMenuBarPopup#postCreate} to subscribe to
       * the [userAccessChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#userAccessChangeTopic}
       * topic which is handled by [onUserAcess]{@link module:alfresco/documentlibrary/_AlfCreateContentPermissionsMixin#onUserAcess}
       * and [hashChangeTopic]{@link module:alfresco/documentlibrary/_AlfDocumentListTopicMixin#hashChangeTopic} which is
       * handled by [onFilterChange]{@link module:alfresco/documentlibrary/_AlfCreateContentPermissionsMixin#onFilterChange}
       * @instance
       */
      postCreate: function alfresco_documentlibrary_AlfCreateContentMenuBarPopup__postCreate() {
         this.alfSubscribe(this.userAccessChangeTopic, lang.hitch(this, this.onUserAcess));
         this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.onFilterChange));
         this.inherited(arguments);
      }
   });
});