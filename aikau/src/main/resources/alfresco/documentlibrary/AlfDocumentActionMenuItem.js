/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * This is a customization of the [AlfFilteringMenuItem]{@link module:alfresco/menus/AlfFilteringMenuItem} that
 * filters the configured document library action based on whether or not the current user has permission to
 * use them.
 * 
 * @module alfresco/documentlibrary/AlfDocumentActionMenuItem
 * @extends module:alfresco/menus/AlfFilteringMenuItem
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfFilteringMenuItem",
        "alfresco/documentlibrary/_AlfDocumentListTopicMixin",
        "dojo/_base/lang",
        "dojo/dom-class",
        "dojo/_base/array"], 
        function(declare, AlfFilteringMenuItem, _AlfDocumentListTopicMixin, lang, domClass, array) {
   
   return declare([AlfFilteringMenuItem, _AlfDocumentListTopicMixin], {

      /**
       * Set the i18n scope so that labels are picked up from the wrapped toolbar message scope.
       * 
       * @instance
       * @type {string}
       * @default "Alfresco.DocListToolbar"
       */
      i18nScope: "Alfresco.DocListToolbar",
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance cssRequirements {Array}
       * @type {object[]}
       * @default [{cssFile:"./css/AlfDocumentActionMenuItem.css"}]
       */
      cssRequirements: [{cssFile:"./css/AlfDocumentActionMenuItem.css"}],
      
      /**
       * Extends the [superclass function]{@link module:alfresco/menus/AlfFilteringMenuItem#postCreate} to set 
       * the [filterTopic]{@link module:alfresco/menus/AlfFilteringMenuItem#filterTopic} attribute and set 
       * the "toolbar" CSS class on the parent node which "tricks" legacy action configuration into showing
       * the correct icon.
       * 
       * @instance
       */
      postCreate: function alfresco_menus__AlfDocumentActionMenuItem__postCreate() {
         this.filterTopic = this.selectedDocumentsChangeTopic;
         this.inherited(arguments);
         domClass.add(this.iconNode.parentNode, "toolbar");
         domClass.add(this.iconNode, "alf-document-action-menu-item");
      },
      
      /**
       * This implements the filter function extension point to check the current menu items configuration
       * against the user permissions and aspects as provided in the publication payload. This code is based
       * on the second half of the "onSelectedFilesChanged" function from the "toolbar.js" file. It should 
       * be kept in-sync with any updates made to that file. 
       * 
       * @instance
       * @param {object} payload The payload published on the filter topic 
       */
      filter: function alfresco_menus_AlfDocumentActionMenuItem__filter(payload) {
         this.alfLog("log", "Filtering request received: ", payload);
         
         // Defaulting to show
         var hide = false,
             i, ii;
         if (payload && payload.userAccess && payload.commonAspects && payload.allAspects)
         {
            if (this.permission != "")
            {
               var actionPermissions = this.permission.split(",");
               for (i = 0, ii = actionPermissions.length; i < ii; i++)
               {
                  // Disable if the user doesn't have ALL the permissions
                  if (!payload.userAccess[actionPermissions[i]])
                  {
                     hide = true;
                     break;
                  }
               }
            }
            
            // Check required aspects.
            // Disable if any node DOES NOT have ALL required aspects
            if (this.hasAspect != "")
            {
               var hasAspects = this.hasAspect.split(",");
               for (i = 0, ii = hasAspects.length; i < ii; i++)
               {
                  if (array.indexOf(payload.commonAspects, hasAspects[i]) == -1)
                  {
                     hide = true;
                     break;
                  }
               }
            }
            
            // Check forbidden aspects.
            // Disable if any node DOES have ANY forbidden aspect
            if (this.notAspect != "")
            {
               var notAspects = this.notAspect.split(",");
               for (i = 0, ii = notAspects.length; i < ii; i++)
               {
                  if (array.indexOf(payload.allAspects, notAspects[i]) != -1)
                  {
                     hide = true;
                     break;
                  }
               }
            }
         }
         
         // Hide the menu item if disabled and 
         if (hide)
         {
            this.hide();
         }
         else
         {
            this.show();
         }
      }
   });
});