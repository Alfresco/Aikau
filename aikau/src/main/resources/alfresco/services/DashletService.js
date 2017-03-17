/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * This service supports the alfresco/dashlets/Dashlet widget and provides the ability
 * to store and retrieve the height of the Dashlet.
 *
 * @module alfresco/services/DashletService
 * @extends module:alfresco/services/BaseService
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/services/_DashletServiceTopicMixin
 * @author Martin Doyle
 */

define(["service/constants/Default",
        "alfresco/services/BaseService",
        "alfresco/core/CoreXhr",
        "alfresco/services/_DashletServiceTopicMixin",
        "dojo/_base/declare",
        "dojo/_base/lang"],
        function(AlfConstants, BaseService, AlfCoreXhr, _DashletServiceTopicMixin, declare, lang) {

   return declare([BaseService, AlfCoreXhr, _DashletServiceTopicMixin], {

      /**
       * @instance
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_DashletService__registerSubscriptions() {
         this.alfSubscribe(this.storeDashletHeightTopic, lang.hitch(this, this.storeDashletHeight), true);
      },

      /**
       * Store the height of the specified dashlet
       *
       * @instance
       * @param {Object} payload The payload
       * @param {string} payload.componentId The component ID of the dashlet
       * @param {int} payload.height The height of the dashlet to be stored
       */
      storeDashletHeight: function alfresco_services_DashletService__storeDashletHeight(payload) {
         this.serviceXhr({
            url: AlfConstants.URL_SERVICECONTEXT + "modules/dashlet/config/" + encodeURIComponent(payload.componentId),
            method: "POST",
            alfTopic: payload.alfResponseTopic,
            data: {
               height: payload.height
            }
         });
      }
   });
});