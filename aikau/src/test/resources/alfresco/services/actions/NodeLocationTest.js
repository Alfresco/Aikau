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
      name: "Node Location Tests",
      testPage: "/NodeLocation",

      "Locate (in Share) site node": function() {
         return this.remote.findByCssSelector("#SITE_NODE_DEFAULT_label")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.equal(payload.url, "/aikau/page/site/site1/documentlibrary#path=%2Fsome%2Frandom%2Fpath", "Unexpected location");
            });
      },

      "Locate (in Share) repo node": function() {
         return this.remote.findByCssSelector("#NODE_DEFAULT_label")
            .click()
            .end()
            .getLastPublish("ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.equal(payload.url, "/aikau/page/repository#path=%2Fanother%2Frandom%2Fpath", "Unexpected location");
            });
      },

      "Locate (in Aikau) site node": function() {
         return this.remote.findByCssSelector("#SITE_NODE_CUSTOM_label")
            .click()
            .end()
            .getLastPublish("CUSTOM_ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.equal(payload.url, "/aikau/page/site/site1/dp/ws/document-libarary#path=%2Fsome%2Frandom%2Fpath", "Unexpected location");
            });
      },

      "Locate (in Aikau) repo node": function() {
         return this.remote.findByCssSelector("#NODE_CUSTOM_label")
            .click()
            .end()
            .getLastPublish("CUSTOM_ALF_NAVIGATE_TO_PAGE")
            .then(function(payload) {
               assert.equal(payload.url, "/aikau/page/dp/ws/repo#path=%2Fanother%2Frandom%2Fpath", "Unexpected location");
            });
      }
   });
});