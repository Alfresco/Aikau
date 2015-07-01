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
 * This service supports the alfresco/dashlets/Dashlet widget and provides the ability
 * to store and retrieve the height of the Dashlet.
 *
 * @module alfresco/services/DashletService
 * @extends module:alfresco/core/Core
 * @mixes module:alfresco/core/CoreXhr
 * @mixes module:alfresco/core/UrlUtils
 * @mixes module:alfresco/core/NotificationUtils
 * @author Martin Doyle
 */

define([
      "service/constants/Default",
      "alfresco/core/Core",
      "alfresco/core/CoreXhr",
      "alfresco/services/_DashletServiceTopicMixin",
      "dojo/_base/declare",
      "dojo/_base/lang"
   ],
   function(AlfConstants, AlfCore, AlfCoreXhr, _DashletServiceTopicMixin, declare, lang) {

      return declare([AlfCore, AlfCoreXhr, _DashletServiceTopicMixin], {

         /**
          * Constructor
          *
          * @instance
          * @param {Object[]} [args] Constructor arguments
          */
         constructor: function alfresco_services_DashletService__constructor(args) {
            declare.safeMixin(this, args);
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