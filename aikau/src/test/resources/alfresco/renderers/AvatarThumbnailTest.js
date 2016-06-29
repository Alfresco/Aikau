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
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "Avatar Thumbnail Tests",
      testPage: "/AvatarThumbnail",

      "Image src is correct": function() {
         return this.remote.findByCssSelector("#ADMIN_THUMBNAIL .alfresco-renderers-Thumbnail__image")
            .getAttribute("src")
            .then(function(src) {
               assert.match(src, /\/aikau\/proxy\/alfresco\/slingshot\/profile\/avatar\/silly%25userid\/thumbnail\/avatar/, "Avatar thumbnail src incorrect");
            });
      },

      "Publishes topic when clicked": function() {
         return this.remote.findByCssSelector("#GUEST_THUMBNAIL .alfresco-renderers-Thumbnail__frame")
            .click()
            .getLastPublish("ALF_DISPLAY_NOTIFICATION", true, "Did not publish correct topic when clicked")
            .then(function(payload) {
               assert.propertyVal(payload, "message", "You clicked on the guest thumbnail", "Did not publish correct payload");
            });
      },

      "Group item has correct URL": function() {
         return this.remote.findByCssSelector("#GROUP_THUMBNAIL .alfresco-renderers-Thumbnail__image")
            .getAttribute("src")
            .then(function(src) {
               assert.include(src, "/alfresco/renderers/css/images/group-64.png");
            });
      }
   });
});