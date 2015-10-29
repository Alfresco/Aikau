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
 * <p>This module provides the configuration that can be used for rendering a [menu item]{@link module:alfresco/menus/AlfMenuItem}
 * for the "Manage Aspects" action. The main thing this provides is the "renderFilters" configuration that can be
 * used to determine whether or not the action should be displayed based on the attributes of the "currentItem" (e.g. the Node)
 * that the action is to be used against.</p>
 * <p>It should be possible to upload a new version of a Node when the following is true:
 * <ul><li>The current user does not have WRITE access on the Node</li>
 * <li>The Node is NOT locked</li>
 * <li>The Node is NOT a working copy</li>
 * </ul>
 * </p>
 * 
 * @module alfresco/renderers/actions/ManageAspects
 * @author Dave Draper
 */
define([],
       function() {

   return  {
      id: "MANAGE_ASPECTS",
      label: "actions.manage-aspects.label",
      iconClass: "alf-doclib-action alf-manage-aspects-icon",
      publishTopic: "ALF_MANAGE_ASPECTS_REQUEST",
      publishPayloadType: "CONFIGURED",
      publishPayloadItemMixin: true,
      publishPayload: {},
      publishGlobal: true,
      renderFilterMethod: "ALL",
      renderFilters: [
         
         // All of the following MUST be true:
         // 1) The current user needs to have Write permission on the node
         // 2) The node must not be locked
         // 3) The node must not be a working copy
         {
            renderFilter: [
               {
                  property: "node.permissions.user.Write",
                  values: [true]
               },
               {
                  property: "node.isLocked",
                  values: [false]
               },
               {
                  property: "node.aspects",
                  contains: ["cm:workingcopy"],
                  negate: true
               }
            ]
         }
      ]
   };
});