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
 * for the "Upload New Version" action. The main thing this provides is the "renderFilters" configuration that can be
 * used to determine whether or not the action should be displayed based on the attributes of the "currentItem" (e.g. the Node)
 * that the action is to be used against.</p>
 * <p>It should be possible to upload a new version of a Node when the following is true:
 * <ul><li>The Node is NOT locked (unless the current user owns the lock)</li>
 * <li>The Node is NOT a working copy (unless the current user is the working copy owner)</li>
 * <li>The Node is NOT locked where the type of lock is "NODE_LOCK"</li>
 * </ul>
 * 
 * @module alfresco/renderers/actions/UploadNewVersion
 * @author Dave Draper
 */
define(["service/constants/Default"],
       function(AlfConstants) {

   return  {
      label: "actions.upload-new-version.label", // TODO: Localization
      iconClass: "alf-upload-new-version-icon",
      publishTopic: "ALF_SHOW_UPLOADER",
      publishPayloadType: "CURRENT_ITEM", // TODO: Need to make sure this is correct
      publishPayload: {
         
      },
      publishGlobal: true,
      renderFilterMethod: "ALL",
      renderFilters: [
         // Replacing: evaluator.doclib.action.upload
         // TODO: Browser user-agent filter to only render for browsers that support upload

         {
            // Any of the following can be true:
            // 1) Node is NOT locked and is NOT the workingCopy and does NOT have a cm:locktype property set to "NODE_LOCK"
            // 2) The node is locked BUT the lock owner is the current user
            // 3) The node is a working copy BUT the working copy owner is the current user
            // 4) The node is not a container
            renderFilterMethod: "ANY",
            renderFilters: [
               {
                  renderFilterMethod: "ALL",
                  renderFilter: [
                     {
                        property: "node.isContainer",
                        values: [false]
                     },
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