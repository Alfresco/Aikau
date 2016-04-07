/*globals Alfresco*/
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
 * @module alfresco/services/LightboxService
 * @extends module:alfresco/services/BaseService
 * @author Kevin Roast
 */
define(["dojo/_base/declare",
        "alfresco/services/BaseService",
        "dojo/_base/lang"],
        function(declare, BaseService, lang) {
   
   return declare([BaseService], {
      
      /**
       * An array of the CSS files to use with this widget.
       * 
       * @instance
       * @type {object[]}
       * @default [{cssFile:"./css/LightboxService.css"}]
       */
      cssRequirements: [{cssFile:"./css/LightboxService.css"}],

      /**
       * Declare the dependencies on "legacy" JS files that this is wrapping.
       * 
       * @instance
       * @type {String[]}
       */
      nonAmdDependencies: ["/js/lib/3rd-party/lightbox/0.1/lightbox.js"],
      
      /**
       * If a service needs to act upon its post-mixed-in state before registering subscriptions then
       * this is where it should be done. It is comparable to postMixInProperties in a widget in the
       * class lifecycle.
       * 
       * @instance
       */
      initService: function alfresco_services_LightboxService__initService() {
         
         Alfresco.AikauLightbox.init({
            loadingImage: require.toUrl("alfresco/services/css/images/loading.gif"),
            closeButton: require.toUrl("alfresco/services/css/images/close.gif")
         });
      },

      /**
       * Sets up the subscriptions for the LightboxService
       * 
       * @instance
       * @since 1.0.32
       */
      registerSubscriptions: function alfresco_services_LightboxService__registerSubscriptions() {
         
         this.alfSubscribe("ALF_DISPLAY_LIGHTBOX", lang.hitch(this, this.onDisplayLightbox));
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
            Alfresco.AikauLightbox.show({
               src: src,
               title: title
            });
         }
      }
   });
});