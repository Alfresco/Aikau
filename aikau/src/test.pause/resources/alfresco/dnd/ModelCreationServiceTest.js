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
        "intern/chai!assert",
        "require",
        "alfresco/TestCommon"],
        function(module, defineSuite, assert, require, TestCommon) {

   defineSuite(module, {
      name: "DND Model Creation Service Tests",
      testPage: "/modelling-creation-service-testing",

      "Drive the creation service": function() {
         return this.remote.findByCssSelector("#DRIVE_THE_SERVICE_label")
            .click()
            .end()
            .findAllByCssSelector(TestCommon.topicSelector("ALF_DND_MODEL_LIBRARIES", "publish", "last"))
            .then(null, function() {
               assert(false, "Library data not exported");
            });
      },

      "Find NLS properties": function() {
         return this.remote.findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "nls"))
            .getVisibleText()
            .then(function(text) {
               assert(text.indexOf("test.prefix.widget.title=baa") !== -1, "Title not translated");
               assert(text.indexOf("test.prefix.widget.label=moo") !== -1, "Label not translated");
               assert(text.indexOf("test.prefix.widget.description=woof") !== -1, "Label not translated");
               assert(text.indexOf("test.prefix.widget.unitsLabel=oink") !== -1, "Label not translated");
            });
      },

      "Check for unnecessary NLS properties": function() {
         return this.remote.findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "nls"))
            .getVisibleText()
            .then(function(text) {
               assert(text.indexOf("test.prefix.widget.noTranslation") === -1, "Unexpected NLS property found");
            });
      },

      "Find functions": function() {
         return this.remote.findByCssSelector(TestCommon.pubSubDataValueCssSelector("last", "js"))
            .getVisibleText()
            .then(function(text) {
               assert(text.indexOf("function getTestModelConfig()") !== -1, "Could not find widgets config function");
               assert(text.indexOf("function getTestModelNestedConfig()") !== -1, "Could not find nested widgets config function");
               assert(text.indexOf("function getTestModelDisplay()") !== -1, "Could not find display widgets config function");
               assert(text.indexOf("function getDefaultTestModelModel()") !== -1, "Could model creation function");
            });
      }
   });
});