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
 * @module alfresco/renderers/LockedBanner
 * @extends module:alfresco/renderers/Banner
 * @mixes module:alfresco/core/UrlUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/Banner",
        "alfresco/core/UrlUtils",
        "service/constants/Default"], 
        function(declare, Banner, UrlUtils, AlfConstants) {

   return declare([Banner, UrlUtils], {
      
      /**
       * An array of the i18n files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{i18nFile: "./i18n/LockedBanner.properties"}]
       */
      i18nRequirements: [{i18nFile: "./i18n/LockedBanner.properties"}],
      
      /**
       * Set up the attributes to be used when rendering the template.
       * 
       * @instance
       */
      postMixInProperties: function alfresco_renderers_Banner__postMixInProperties() {
         
         var properties = this.currentItem.jsNode.properties,
             bannerUser = properties.lockOwner || properties.workingCopyOwner,
             bannerLink = this.generateUserLink(this, bannerUser),
             nodeTypePrefix = "details.banner.";
         if (this.currentItem.isContainer)
         {
            nodeTypePrefix += "folder."
         }

         // Working Copy handling...
         if (this.currentItem.workingCopy && bannerUser.userName === AlfConstants.USERNAME)
         {
            this.bannerMessage = this.message(nodeTypePrefix + (this.currentItem.workingCopy.isWorkingCopy ? "editing" : "lock-owner"));
         }
         else if (this.currentItem.workingCopy)
         {
            this.bannerMessage = this.message(nodeTypePrefix + "locked", bannerLink);
         }
      }
   });
});