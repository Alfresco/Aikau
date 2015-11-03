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
 * for the "Delete" action.</p>
 * 
 * @module alfresco/renderers/actions/Delete
 * @author Dave Draper
 * @since 1.0.34
 */
define(["alfresco/core/topics",
        "service/constants/Default"],
       function(topics, AlfConstants) {

   return  {
      id: "DELETE",
      label: "actions.delete",
      iconClass: "alf-doclib-action alf-delete-icon",
      publishTopic: topics.DELETE_CONTENT,
      publishPayloadType: "CONFIGURED",
      publishPayloadItemMixin: true,
      publishPayload: {},
      publishGlobal: true,
      renderFilterMethod: "ALL",
      renderFilters: [
         
         // All of the following MUST be true:
         // 1) The user must have write permission on the node
         // 2) The node must NOT have the sys:undeleteable aspect
         // 3) They must own the lock or working copy if applicable
         {
            renderFilter: [
               {
                  property: "node.permissions.user.Write",
                  values: [true]
               }
            ]
         },
         {
            renderFilter: [
               {
                  property: "node.aspects",
                  contains: ["sys:undeletable","hwf:hybridWorkflow"],
                  negate: true
               }
            ]
         },
         {
            // Any of the following can be true:
            // 1) Node is NOT locked and is NOT the workingCopy and does NOT have a cm:locktype property set to "NODE_LOCK"
            // 2) The node is locked BUT the lock owner is the current user
            // 3) The node is a working copy BUT the working copy owner is the current user
            renderFilterMethod: "ANY",
            renderFilters: [
               {
                  renderFilterMethod: "ALL",
                  renderFilter: [
                     {
                        property: "node.isLocked",
                        values: [false]
                     },
                     {
                        property: "node.aspects",
                        contains: ["cm:workingcopy"],
                        negate: true
                     },
                     {
                        property: "node.properties.cm:lockType",
                        values: ["NODE_LOCK"],
                        negate: true
                     }
                  ]
               },
               {
                  renderFilterMethod: "ALL",
                  renderFilter: [
                     {
                        property: "node.isLocked",
                        values: [true]
                     },
                     {
                        property: "node.properties.cm:lockOwner",
                        values: [AlfConstants.USERNAME]
                     } 
                  ]
               },
               {
                  renderFilterMethod: "ALL",
                  renderFilter: [  
                     {
                        property: "node.aspects",
                        contains: ["cm:workingcopy"]
                     },
                     {
                        property: "node.properties.cm:workingCopyOwner.userName",
                        values: [AlfConstants.USERNAME]
                     }
                  ]
               }
            ]
         }
      ]
   };

   
});