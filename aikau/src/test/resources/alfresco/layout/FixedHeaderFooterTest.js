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
 * This is a unit test for the FixedHeaderFooter widget
 *
 * @author Martin Doyle
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert"],
        function(module, defineSuite, assert) {

   /* global document*/
   defineSuite(module, {
      name: "FixedHeaderFooter tests",
      testPage: "/FixedHeaderFooter#currentItem=10",

      "Total height is correct": function() {
         return this.remote.findById("HEADER_FOOTER")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 300, "Height not as per widget config");
            });
      },

      "Header initially has no height": function() {
         return this.remote.findByCssSelector(".alfresco-layout-FixedHeaderFooter__header")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 0, "Header should not have had any height");
            });
      },

      "Footer initially has no height": function() {
         return this.remote.findByCssSelector(".alfresco-layout-FixedHeaderFooter__footer")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, 0, "Footer should not have had any height");
            });
      },

      "Content offset should be zero": function() {
         return this.remote.findByCssSelector(".alfresco-layout-FixedHeaderFooter__content")
            .getPosition()
            .then(function(position) {
               assert.equal(position.y, 0, "Content should be at top of page");
            });
      },

      "Reveal header": function() {
         return this.remote.findById("SHOW_HEADER_label")
            .click()
         .end()
         
         .findByCssSelector(".alfresco-layout-FixedHeaderFooter__header")
            .getSize()
            .then(function(size) {
               assert.notEqual(size.height, 0, "Header should now have height");
            });
      },

      "Reveal footer": function() {
         return this.remote.findById("SHOW_FOOTER_label")
            .click()
         .end()
         
         .findByCssSelector(".alfresco-layout-FixedHeaderFooter__footer")
            .getSize()
            .then(function(size) {
               assert.notEqual(size.height, 0, "Footer should now have height");
            });
      },

      "Content offset should be increased": function() {
         return this.remote.findByCssSelector(".alfresco-layout-FixedHeaderFooter__content")
            .getPosition()
            .then(function(position) {
               // NOTE: "top" takes margin of 10 into consideration...
               assert.notEqual(position.y, 10, "Content should no longer be at top of page");
            });
      },

      "Only content is scrollable": function() {
         function nodeOverflows(selector) {
            var node = document.querySelector(selector);
            return node.scrollHeight > node.offsetHeight;
         }

         return this.remote.execute(nodeOverflows, ["#HEADER_FOOTER .alfresco-layout-FixedHeaderFooter__header"])
            .then(function(overflows) {
               assert.isFalse(overflows, "Header is not same height as its content");
            })

         .execute(nodeOverflows, ["#HEADER_FOOTER .alfresco-layout-FixedHeaderFooter__content"])
            .then(function(overflows) {
               assert.isTrue(overflows, "Content is not overflowing");
            })

         .execute(nodeOverflows, ["#HEADER_FOOTER .alfresco-layout-FixedHeaderFooter__footer"])
            .then(function(overflows) {
               assert.isFalse(overflows, "Footer is not same height as its content");
            });
      },

      "List has automatically scrolled to correct location": function() {
         // See AKU-330
         // The FixedHeaderFooter widget provides the best way of testing scrolling that is NOT on the
         // main document...
         function getScrollTop(selector) {
            var node = document.querySelector(selector);
            return node.scrollTop;
         }
         return this.remote.execute(getScrollTop, ["#HEADER_FOOTER .alfresco-layout-FixedHeaderFooter__content"])
            .then(function(scrollTop) {
               assert.notEqual(scrollTop, 0, "List did not scroll");
            });
      },

      "Header resize fires resize event": function() {
         return this.remote.findById("SHOW_HEADER_label")
            .click()
         .end()

         .findByCssSelector("#HEADER_TWISTER .label")
            .clearLog()
            .click()
         .end()

         .getLastPublish("ALF_NODE_RESIZED")
            .then(function(payload) {
               assert.property(payload, "node");
               assert.match(payload.node, /^div#HEADER_FOOTER/);
            });
      }
   });

   defineSuite(module, {
      name: "FixedHeaderFooter tests (auto height calculations)",
      testPage: "/AutoHeightFixedHeaderFooter",

      "Check height is calculated": function() {
         var windowHeight;
         return this.remote.findByCssSelector("body")
            .getSize()
            .then(function(size) {
               windowHeight = size.height;
            })
         .end()
         
         .findByCssSelector("#HEADER_FOOTER")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, windowHeight, "Height not calculated correctly");
            });
      },

      "Check auto resizing": function() {
         var windowHeight;
         return this.remote.setWindowSize(null, 1024, 300)
            .findByCssSelector("body")
            .getSize()
            .then(function(size) {
               windowHeight = size.height;
            })
         .end()
         
         .findByCssSelector("#HEADER_FOOTER")
            .getSize()
            .then(function(size) {
               assert.equal(size.height, windowHeight, "Height not calculated correctly");
            });
      }
   });
});