/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * @module alfresco/services/LightboxService
 * @extends module:alfresco/core/Core
 * @author Kevin Roast
 */
define(["dojo/_base/declare",
        "alfresco/core/Core",
        "dojo/_base/lang"],
        function(declare, AlfCore, lang) {
   
   return declare([AlfCore], {
      
      /**
       * Declare the dependencies on "legacy" JS files that this is wrapping.
       * 
       * @instance
       * @type {String[]}
       */
      nonAmdDependencies: ["/js/lightbox.js"],

      /**
       * Sets up the subscriptions for the LightboxService
       * 
       * @instance
       * @param {array} args Constructor arguments
       */
      constructor: function alfresco_services_LightboxService__constructor(args) {
         lang.mixin(this, args);
         this.alfSubscribe("ALF_DISPLAY_LIGHTBOX", lang.hitch(this, "onDisplayLightbox"));
      },
      
      /**
       * Displays a lightbox for given image
       * 
       * @instance
       * @param {object} payload The details of the image.
       */
      onDisplayLightbox: function alfresco_services_LightboxService__onDisplayLightbox(payload) {
         var src = lang.getObject("src", false, payload),
             title = lang.getObject("title", false, payload);
         if (!src)
         {
            this.alfLog("warn", "No lightbox 'src' href provided: " + payload);
         }
         else
         {
            // call the non-AMD Lightbox JS to perform the actual work of displaying the image in a lightbox
            Alfresco.Lightbox.show({
               src: src,
               title: title
            });
         }
      }
   });
});