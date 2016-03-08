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
 * <p>This module provides the configuration that can be used for rendering a
 * [menu item]{@link module:alfresco/menus/AlfMenuItem} for the "Change Type" action.</p>
 * 
 * @module alfresco/renderers/actions/ChangeType
 * @author Dave Draper
 * @since 1.0.58
 */
define(["alfresco/core/topics"],
       function(topics) {

   return  {
      id: "CHANGE_TYPE",
      label: "actions.change-type",
      iconClass: "alf-doclib-action alf-change-type-icon",
      publishTopic: topics.CHANGE_TYPE_REQUEST,
      publishPayloadType: "PROCESS",
      publishPayloadModifiers: ["processCurrentItemTokens"],
      publishPayload: {
         documents: [{
            node: {
               nodeRef: "{node.nodeRef}"
            }
         }],
         copy: true
      },
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