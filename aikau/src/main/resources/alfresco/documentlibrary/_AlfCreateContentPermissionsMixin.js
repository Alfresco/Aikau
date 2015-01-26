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
 * This mixin provides helper functions that can be used to determine whether or not a the user has
 * permission to create new content at the currently rendered context (e.g. the current location
 * being shown in a document list)
 * 
 * @module alfresco/documentlibrary/_AlfCreateContentPermissionsMixin
 * @extends module:alfresco/core/Core
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/on",
        "dojo/_base/lang",
        "dijit/popup"], 
        function(declare, AlfCore, on, lang, popup) {
   
   return declare([AlfCore], {

      /**
       * The permission string for the widget. This is what will be evaluated against the current users permissions.
       * This is given a default value of "CreateChildren" which assumes that content can be created but this should
       * be set during instantiation based on the current user permissions for the current context.
       * 
       * @instance
       * @type {string}
       * @default "CreateChildren"
       */
      permission: "CreateChildren",
      
      /**
       * Sets the widget as either enabled or disabled based on the value returned by calling
       * the [hasPermission]{@link module:alfresco/documentlibrary/_AlfCreateContentPermissionMixin#hasPermission}
       * function.
       * 
       * @instance
       * @param {object} payload The details of the selected files.
       */
      onUserAcess: function alfresco_documentlibrary__AlfCreateContentPermissionsMixin__onUserAcess(payload) {
         if (payload && payload.userAccess && typeof this.permission == "string")
         {
            // Disable the menu bar popup if the user doesn't have permission to create content...
            this.set('disabled', !this.hasPermission(this.permission, payload.userAccess));
         }
      },
      
      /**
       * Checks whether or not the current user has permission to create content.
       * 
       * @instance
       * @param {string} permissionString The permission string for the widget being evaluated
       * @param {object} userAccess The user access data
       */
      hasPermission: function alfresco_documentlibrary__AlfCreateContentPermissionsMixin__hasPermission(permissionString, userAccess) {
         // Initially assume that the user has permission...
         var hasPermission = true,
             widgetPermissions, orPermissions, permissionTokens, permission, orMatch, shallMatch;
         
         // Comma-separation indicates "AND"
         widgetPermissions = permissionString.split(",");
         for (var i = 0; i < widgetPermissions.length; i++)
         {
            // Pipe-separation is a special case and indicates an "OR" match. The matched permission is stored in "activePermission" on the widget.
            if (widgetPermissions[i].indexOf("|") !== -1)
            {
               orMatch = false;
               orPermissions = widgetPermissions[i].split("|");
               for (var j = 0, jj = orPermissions.length; j < jj; j++)
               {
                  permissionTokens = orPermissions[j].split(":");
                  permission = permissionTokens[0];
                  shallMatch = permissionTokens.length == 2 ? permissionTokens[1] == "true" : true;
                  if ((userAccess[permission] && shallMatch) || (!userAccess[permission] && !shallMatch))
                  {
                     orMatch = true;
                     break;
                  }
               }
               if (!orMatch)
               {
                  hasPermission = false;
                  break;
               }
            }
            else
            {
               permissionTokens = widgetPermissions[i].split(":");
               permission = permissionTokens[0];
               shallMatch = permissionTokens.length == 2 ? permissionTokens[1] == "true" : true;
               if ((userAccess[permission] && !shallMatch) || (!userAccess[permission] && shallMatch))
               {
                  hasPermission = false;
                  break;
               }
            }
         }
         return hasPermission;
      },
      
      /**
       * Disable the menu if the filter is not a path. This should always be processed before the 
       * [onUserAccess]{@link module:alfresco/documentlibrary/_AlfCreateContentPermissionMixin#onUserAccess} function because
       * it's the change in filter that will result in the change of user access data.
       * 
       * @instance
       * @param {object} payload The details of the selected files.
       */
      onFilterChange: function alfresco_documentlibrary__AlfCreateContentPermissionsMixin__onFilterChange(payload) {
         var path = lang.getObject("path", false, payload);
         this.set('disabled', (path == null));
      } 
   });
});