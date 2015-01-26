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
 * <p>This renderer generates a [menu bar]{@link module:alfresco/menus/AlfMenuBar} containing a 
 * [drop-down menu]{@link module:alfresco/menus/AlfMenuBarPopup} of [menu items]{@link module:alfresco/menus/AlfMenuItem}
 * representing an action set.</p>
 * 
 * <p>This module was written to intially support Alfresco document and folder actions as generated for a 
 * individual nodes but has since been expanded to support custom actions. The majority of the action handling
 * code is done by the [_ActionsMixin]{@link module:alfresco/renderers/_ActionsMixin}</p>
 * 
 * @module alfresco/renderers/ContextActions
 * @extends module:alfresco/menus/AlfContextMenu
 * @mixes module:alfresco/documentlibrary/_AlfDocumentListTopicMixin
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/menus/AlfContextMenu",
        "alfresco/renderers/_ActionsMixin",
        "alfresco/menus/AlfMenuGroup"],
        function(declare, AlfMenuBar, _ActionsMixin, AlfMenuGroup) {

   return declare([AlfMenuBar, _ActionsMixin], {

      /**
       * Overrides the default to add a group containing all the actions for the current item.
       * 
       * @instance
       */
      postCreate: function alfresco_renderers_ContextActions__postCreate() {
         this.inherited(arguments);

         // Create a group to hold all the actions...
         this.actionsGroup = new AlfMenuGroup({});
         
         // Add all the actions...
         this.addActions();

         // Add the group to the child...
         this._contextMenu.addChild(this.actionsGroup);
      }
   });
});