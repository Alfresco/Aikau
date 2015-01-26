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
 * Extends the [AlfMenuGroup]{@link module:alfresco/menus/AlfMenuGroup} to ensure that only [AlfCheckableMenuItems]{@link module:alfresco/menus/AlfCheckableMenuItem}
 * are added to the group.
 * 
 * @module alfresco/documentlibrary/AlfViewSelectionGroup
 * @extends module:alfresco/menus/AlfMenuGroup
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfMenuGroup",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "alfresco/menus/AlfCheckableMenuItem",
        "dojo/_base/lang"], 
        function(declare, AlfMenuGroup, _AlfDocumentListTopicMixin, AlfCheckableMenuItem, lang) {
   
   return declare([AlfMenuGroup, _AlfDocumentListTopicMixin], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/AlfViewSelectionGroup.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/AlfViewSelectionGroup.properties"}],
      
      /**
       * The default label for the view selection group. 
       * @instance
       * @type {string}
       * @default "view-selection.group.label"
       */
      label: "view-selection.group.label",
      
      /**
       * @instance
       */
      postCreate: function alfresco_documentlibrary_AlfViewSelectionGroup__postCreate() {
         this.alfSubscribe(this.selectionMenuItemTopic, lang.hitch(this, this.addViewSelectionMenuItem));
         this.inherited(arguments);
      },
      
      /**
       * Adds a new menu item to the group. Checks that the menu item is an instance of "alfresco/menus/AlfCheckableMenuItem" and
       * will not add the menu item if it is not.
       * 
       * @instance
       * @param {Object} menuItem The menu item to add.
       */
      addViewSelectionMenuItem: function alfresco_documentlibrary_AlfViewSelectionGroup__addViewSelectionMenuItem(payload) {
         if (payload == null || !payload.menuItem.isInstanceOf(AlfCheckableMenuItem))
         {
            this.alfLog("warn", "A request was made to register a view selection menu item that was not an instance of 'alfresco/documentlibrary/AlfCheckableMenuItem'", payload.menuItem);
         }
         else
         {
            this.addChild(payload.menuItem);
         }
      }
   });
});