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
      name: "Metadata Groups Test",
      testPage: "/NodeMetadata",

      "Check that both default and custom groups have been created": function() {
         return this.remote.findAllByCssSelector(".alfresco-node-MetadataGroups")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Unexpected number of widgets was created");
            });
      },

      "Check that both twisters are created": function() {
         return this.remote.findAllByCssSelector("#DEFAULTS .alfresco-layout-Twister")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Unexpected number of Twisters created in defaults group");
            })
            .end()
            .findAllByCssSelector("#CUSTOM .alfresco-layout-Twister")
            .then(function(elements) {
               assert.lengthOf(elements, 2, "Unexpected number of Twisters created in custom group");
            });
      },

      "Check that the expected number of renderers are present": function() {
         return this.remote.findAllByCssSelector(".alfresco-renderers-Property")
            .then(function(elements) {
               assert.lengthOf(elements, 11, "Unexepected number of renderers found");
            });
      },

      "Check that twister label is localized": function() {
         return this.remote.findByCssSelector("#DEFAULTS_AUDIO > .label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Audio Details", "The twister label was not localized");
            });
      },

      "Check that the property label is localized": function() {
         return this.remote.findByCssSelector("#DEFAULTS_AUDIO_ARTIST .alfresco-node-Metadata__label")
            .getVisibleText()
            .then(function(text) {
               assert.equal(text, "Artist", "The property label was not localized");
            });
      },

      "Measure custom label width": function() {
         return this.remote.findByCssSelector("#CUSTOM_AUDIO_ARTIST .alfresco-node-Metadata__label")
            .getSize()
            .then(function(size) {
               // Expected size is 179... allowing some tolerance here because I'm so generous
               assert(size.width > 174, "Custom label width ratio not applied correctly");
               assert(size.width < 184, "Custom label width ratio not applied correctly");
            });
      },

      "Measure custom value width": function() {
         return this.remote.findByCssSelector("#CUSTOM_AUDIO_ARTIST .alfresco-node-Metadata__value")
            .getSize()
            .then(function(size) {
               // Expected size is 271... allowing some tolerance here because I'm so generous
               assert(size.width > 266, "Custom value width ratio not applied correctly");
               assert(size.width < 276, "Custom value width ratio not applied correctly");
            });
      }
   });
});