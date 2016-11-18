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
 * <p><b>This widget is in the "aikau" package and does not adhere to the backwards compatibility standards
 * of the "alfresco" package. The code in this package is intended to form the basis of the next major release
 * of Aikau and will remain in an unstable state until ready for release. Please evaluate and feedback on this
 * module but do not rely on it in production!</b></p>
 *
 * @module aikau/menus/CreateContentMenuItem
 * @extends module:aikau/menus/MenuItem
 * @author Dave Draper
 * @since 1.0.96
 */
define(["dojo/_base/declare",
        "aikau/menus/MenuItem",
        "alfresco/documentlibrary/_AlfCreateContentMenuItemMixin",
        "alfresco/documentlibrary/_AlfCreateContentPermissionsMixin",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang",
        "dojo/dom-class"], 
        function(declare, MenuItem, _AlfCreateContentMenuItemMixin, _AlfCreateContentPermissionsMixin,
                 _AlfDocumentListTopicMixin, lang, domClass) {
   
   return declare([MenuItem, _AlfCreateContentMenuItemMixin, _AlfCreateContentPermissionsMixin, _AlfDocumentListTopicMixin], {

      /**
       * @instance
       */
      postCreate: function aikau_menus_CreateContentMenuItem__postCreate() {
         this.alfSubscribe(this.hashChangeTopic, lang.hitch(this, this.onFilterChange));
         this.alfSubscribe(this.userAccessChangeTopic, lang.hitch(this, this.onUserAcess));
         this.alfSubscribe(this.metadataChangeTopic, lang.hitch(this, this.onCurrentNodeChange));
         this.inherited(arguments);
      },
   
      /**
       * @instance
       * @param {object} payload The payload published on the filter topic
       */
      filter: function aikau_menus_CreateContentMenuItem__filter(payload) {
         if (this.hasPermission(this.permission, payload.userAccess))
         {
            domClass.add(this.domNode, "hidden");
         }
         else
         {
            domClass.add(this.domNode, "hidden");
         }
      }
   });
});