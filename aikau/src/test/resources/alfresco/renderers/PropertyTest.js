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
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!assert",
        "intern/dojo/node!leadfoot/keys"],
        function(module, defineSuite, assert, keys) {

   defineSuite(module, {
      name: "Property Tests",
      testPage: "/Property",

      // See AKU-1166
      "Title attribute is added": function() {
         return this.remote.findByCssSelector("#BASIC_ITEM_0[title]");
      },

      "Check standard property is rendered correctly": function() {
         return this.remote
            .findByCssSelector("#BASIC_ITEM_0 .value")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "TestSök <img ='><svg onload=\"window.hacked=true\"'>");
            });
      },

      "No XSS attacks were successful": function() {
         return this.remote.execute(function() {
               return window.hacked;
            })
            .then(function(hacked) {
               assert.isFalse(!!hacked);
            });
      },

      "Check prefixed/suffixed property is rendered correctly": function() {
         return this.remote.findByCssSelector("#PREFIX_SUFFIX_ITEM_0 .value")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "(TestSök <img ='><svg onload=\"window.hacked=true\"'>)");
            });
      },

      "Check new line property is rendered correctly": function() {
         return this.remote.findByCssSelector("#NEW_LINE_ITEM_0")
            .getComputedStyle("display")
            .then(function(result) {
               assert(result === "block", "New line not applied");
            });
      },

      "Check standard warning is rendered correctly": function() {
         return this.remote.findByCssSelector("#WARN1_ITEM_0 .value")
            .getVisibleText()
            .then(function(resultText) {
               assert.equal(resultText, "No property for: \"missing\"", "Standard warning not rendered correctly");
            });
      },

      "Check explicit warning is rendered correctly": function() {
         return this.remote.findByCssSelector("#WARN2_ITEM_0 .value")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "No description", "Explicit warning not rendered correctly: " + resultText);
            });
      },

      "Check hover property is hidden": function() {
         return this.remote.findByCssSelector(".alfresco_logging_DebugLog")
            .then(element => {
               this.remote.moveMouseTo(element);
            })
         .end()

         .findByCssSelector("#HOVER_ITEM_0 .inner")
            .isDisplayed()
            .then(function(result) {
               assert(result === false, "Hover displayed unexpectedly");
            });
      },

      "Check hover property is displayed": function() {
         return this.remote.findByCssSelector("#LIST table tbody tr td")
            .then(element => {
               this.remote.moveMouseTo(element);
            })
         .end()

         .findByCssSelector("#HOVER_ITEM_0 .value")
            .isDisplayed()
            .then(function(result) {
               assert(result === true, "Hover displayed unexpectedly");
            });
      },

      "Check label is rendered correctly": function() {
         return this.remote.findByCssSelector("#LABEL_ITEM_0 .label")
            .getVisibleText()
            .then(function(resultText) {
               assert(resultText === "Label:", "Label not rendered correctly: " + resultText);
            });
      },

      "Property is truncated when too long for max-width": function() {
         return this.remote.execute(function() {
               var property = document.getElementById("MAX_LENGTH_ITEM_0"),
                  truncated = property.clientWidth < property.scrollWidth;
               return truncated;
            })
            .then(function(truncated) {
               assert.isTrue(truncated, "Long property not truncated properly");
            })
         .end()

         .findById("MAX_LENGTH_ITEM_0")
            .then(function(elem) {
               return elem.getSize();
            })
            .then(function(size) {
               assert.equal(size.width, 300, "Long property width incorrect");
            })
         .end()

         .screenie(); // For visual verification of ellipsis if required
      },

      "Truncated property displays full text on focus": function() {
         return this.remote.findById("MAX_LENGTH_ITEM_0")
            .then(element => {
               element.type(""); // Focus on element

               this.remote.end()
                  .findByCssSelector(".dijitTooltip")
                  .isDisplayed()
                  .then(function(result) {
                     assert.isTrue(result, "Full-text hover was not revealed on focus");
                  });
            });
      },

      "Truncated property hides full text on blur": function() {
         return this.remote.findById("MAX_LENGTH_ITEM_0")
            .then(element => {
               element.type([keys.SHIFT, keys.TAB]); // Focus away from element

               this.remote.end()
                  .findByCssSelector(".dijitTooltip")
                  .isDisplayed()
                  .then(function(result) {
                     assert.isFalse(result, "Full-text hover was not hidden on blur");
                  });
            });
      },

      "Truncated property displays full text on mouseover": function() {
         return this.remote.findById("MAX_LENGTH_ITEM_0")
            .moveMouseTo()
         .end()

         .findByCssSelector(".dijitTooltip")
            .isDisplayed()
            .then(function(result) {
               assert.isTrue(result, "Full-text hover was not revealed on mouse over");
            });
      },

      "Truncated property hides full text on mouseout": function() {
         return this.remote.findByCssSelector("body")
            .moveMouseTo(0, 0)
            .then(() => {
               this.remote.end()
                  .findByCssSelector(".dijitTooltip")
                  .isDisplayed()
                  .then(function(result) {
                     assert.isFalse(result, "Full-text hover was not hidden on mouse out");
                  });
            });
      }
   });
});