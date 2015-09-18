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
 * @author Dave Draper
 */
define(["intern!object",
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function(registerSuite, assert, require, TestCommon) {

registerSuite(function(){
   var browser;

   return {
      name: "Avatar Thumbnail Tests",

      setup: function() {
         browser = this.remote;
         return TestCommon.loadTestWebScript(this.remote, "/AvatarThumbnail", "Avatar Thumbnail Tests").end();
      },

      beforeEach: function() {
         browser.end();
      },

      "Image src is correct": function() {
         return browser.findByCssSelector("#ADMIN_THUMBNAIL .inner img")
            .getAttribute("src")
            .then(function(src) {
               assert.match(src, /\/aikau\/proxy\/alfresco\/slingshot\/profile\/avatar\/silly%25userid\/thumbnail\/avatar/, "Avatar thumbnail src incorrect");
            });
      },

      "Publishes topic when clicked": function() {
         return browser.findByCssSelector("#GUEST_THUMBNAIL .inner")
            .click()
            .getLastPublish("ALF_DISPLAY_NOTIFICATION", true, "Did not publish correct topic when clicked")
            .then(function(payload) {
               assert.propertyVal(payload, "message", "You clicked on the guest thumbnail", "Did not publish correct payload");
            });
      },

      "Post Coverage Results": function() {
         TestCommon.alfPostCoverageResults(this, browser);
      }
   };
   });
});
