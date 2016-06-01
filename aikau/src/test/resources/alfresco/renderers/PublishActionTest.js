/*jshint browser:true*/
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
 * @author Martin Doyle
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   defineSuite(module, {
      name: "PublishAction Tests",
      testPage: "/PublishAction",

      "Validate initial page state": function() {
         return this.remote.execute(function() {
            return window.bodyClicked;
         }).then(function(bodyClicked) {
            assert.isFalse(bodyClicked);
         });
      },

      "Actions have correct images": function() {
         return this.remote.findByCssSelector("#DEFAULT .alfresco-renderers-PublishAction__image")
            .getAttribute("src")
            .then(function(src) {
               assert.include(src, "alfresco/renderers/css/images/add-icon-16.png", "Default icon incorrect");
            })
            .end()

         .findByCssSelector("#CUSTOM_WITH_PAYLOAD .alfresco-renderers-PublishAction__image")
            .getAttribute("src")
            .then(function(src) {
               assert.include(src, "alfresco/renderers/css/images/edit-16.png", "Custom icon incorrect");
            })
            .end()

         .findByCssSelector("#CUSTOM_IMAGE .alfresco-renderers-PublishAction__image")
            .getAttribute("src")
            .then(function(src) {
               assert.include(src, "/aikau/images/app-logo-48.png", "Custom image URL incorrect");
            });
      },

      "Default action publishes correct topic": function() {
         return this.remote.findById("DEFAULT")
            .clearLog()
            .click()
            .end()

         .getLastPublish("PUBLISH_ACTION_DEFAULT");
      },

      "Clicking on action with custom icon publishes payload correctly": function() {
         return this.remote.findById("CUSTOM_WITH_PAYLOAD")
            .clearLog()
            .click()
            .end()

         .getLastPublish("PUBLISH_ACTION_CUSTOM_WITH_PAYLOAD")
            .then(function(payload) {
               assert.propertyVal(payload, "editMode", true);
            });
      },

      "Action with custom image publishes correct topic": function() {
         return this.remote.findById("CUSTOM_IMAGE")
            .clearLog()
            .click()
            .end()

         .getLastPublish("PUBLISH_ACTION_CUSTOM_IMAGE");
      },

      "Action clicks do not bubble upwards": function() {
         return this.remote.execute(function() {
               return window.bodyClicked;
            })
            .then(function(bodyClicked) {
               assert.isFalse(bodyClicked);
            });
      },

      "Hidden when not hovered over": function() {
         return this.remote.findByCssSelector("#PUBLISH_ACTION_ITEM_0 .alfresco-renderers-PublishAction__image")
            .isDisplayed()
            .then(function(displayed) {
               assert.isFalse(displayed);
            });
      },

      "Displayed when hovered over": function() {
         return this.remote.findByCssSelector("#PROP_CELL_ITEM_0 .inner .value")
            .moveMouseTo()
         .end()

         .findByCssSelector("#PUBLISH_ACTION_ITEM_0 .alfresco-renderers-PublishAction__image")
            .isDisplayed()
            .then(function(displayed) {
               assert.isTrue(displayed);
            });
      }
   });
});