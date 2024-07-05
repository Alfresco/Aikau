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
      name: "AlfGalleryViewSlider Preferences Tests",
      testPage: "/AlfGalleryViewSlider",

      "Default config uses preference": function() {
         return this.remote.findByCssSelector("body").end()
            .getLastPublish("GS1_ALF_DOCLIST_SET_GALLERY_COLUMNS")
            .then(function(payload) {
               assert.propertyVal(payload, "value", 3, "Incorrect column value set");
            });
      },

      "Preference overrides config": function() {
         return this.remote.findByCssSelector("body").end()
            .getLastPublish("GS2_ALF_DOCLIST_SET_GALLERY_COLUMNS")
            .then(function(payload) {
               assert.propertyVal(payload, "value", 7, "Incorrect column value set");
            });
      },

      "Config overrides default (when no preferences available)": function() {
         return this.remote.findByCssSelector("body").end()
            .getLastPublish("GS3_ALF_DOCLIST_SET_GALLERY_COLUMNS")
            .then(function(payload) {
               assert.propertyVal(payload, "value", 10, "Incorrect column value set");
            });
      },

      "Default used with invalid config (string) when no preferences available": function() {
         return this.remote.findByCssSelector("body").end()
            .getLastPublish("GS4_ALF_DOCLIST_SET_GALLERY_COLUMNS")
            .then(function(payload) {
               assert.propertyVal(payload, "value", 4, "Incorrect column value set");
            });
      },

      "Default used with invalid config (null) when no preferences available": function() {
         return this.remote.findByCssSelector("body").end()
            .getLastPublish("GS5_ALF_DOCLIST_SET_GALLERY_COLUMNS")
            .then(function(payload) {
               assert.propertyVal(payload, "value", 4, "Incorrect column value set");
            });
      }
   });
});