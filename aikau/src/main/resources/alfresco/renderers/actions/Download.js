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
 * for the "Download" action.</p>
 * 
 * @module alfresco/renderers/actions/Download
 * @author Dave Draper
 * @since 1.0.43
 */
define(["alfresco/core/topics"],
       function(topics) {

   return  {
      id: "DOWNLOAD",
      label: "actions.download",
      iconClass: "alf-doclib-action alf-download-icon",
      publishTopic: topics.DOWNLOAD,
      publishPayloadType: "CONFIGURED",
      publishPayloadItemMixin: true,
      publishPayload: {},
      publishGlobal: true,
      renderFilterMethod: "ALL",
      renderFilter: [
         {
            property: "node.contentURL",
            values: [],
            renderOnAbsentProperty: true,
            negate: true
         }
      ]
   };
});