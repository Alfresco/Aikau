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
        "alfresco/TestCommon",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, TestCommon, keys) {

   defineSuite(module, {
      name: "SVGImage Tests",
      testPage: "/SVGImage",

      "SVG is rendered": function() {
         return this.remote.findByCssSelector("#IMAGE1 svg");
      },

      "Image with actions publish on click": function() {
         return this.remote.findById("IMAGE1")
            .click()
            .end()

         .getLastPublish("IMAGE1_TOPIC");
      },

      "Image with actions can be tabbed to and actioned": function() {
         return this.remote.findByCssSelector("body").end().tabToElement("#IMAGE1")
            .clearLog()
            .pressKeys(keys.ENTER)
            .end()

         .getLastPublish("IMAGE1_TOPIC");
      },

      "Dimensions can be set": function() {
         return this.remote.findByCssSelector("#IMAGE1 .alfresco-html-SVGImage__svg")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 600);
            });
      }
   });
});