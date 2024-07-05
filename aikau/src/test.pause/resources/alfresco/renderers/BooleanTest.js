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
 * The purpose of this test is to ensure that keyboard accessibility is possible between the header and the
 * main table. It should be possible to use the tab/shift-tab keys to navigate along the headers (and the enter/space key
 * to make requests for sorting) and then the cursor keys to navigate around the table itself.
 *
 * @author Dave Draper
 */
define(["module",
        "alfresco/defineSuite",
        "intern/chai!expect"],
        function(module, defineSuite, expect) {

   defineSuite(module, {
      name: "Boolean Tests",
      testPage: "/Boolean",

      "Check there are 60 cells as described in the model": function() {
         return this.remote.findAllByCssSelector("span.alfresco-renderers-Property")
            .then(function(booleans) {
               expect(booleans).to.have.length(60, "There should be 60 cells rendered");
            });
      },

      "Row one, column one should say 'Yes'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(1) td:first-of-type")
            .getVisibleText()
            .then(function(result1) {
               expect(result1).to.equal("Yes");
            });
      },

      "Row one, column two should say 'True'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(1) td:nth-of-type(2)")
            .getVisibleText()
            .then(function(result2) {
               expect(result2).to.equal("True");
            });
      },

      "Row two, column one should say 'Yes'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(2) td:first-of-type")
            .getVisibleText()
            .then(function(result3) {
               expect(result3).to.equal("Yes");
            });
      },

      "Row two, column two should say 'True'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(2) td:nth-of-type(2)")
            .getVisibleText()
            .then(function(result4) {
               expect(result4).to.equal("True");
            });
      },

      "Row three, column one should say 'Yes'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(3) td:first-of-type")
            .getVisibleText()
            .then(function(result5) {
               expect(result5).to.equal("Yes");
            });
      },

      "Row three, column two should say 'True'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(3) td:nth-of-type(2)")
            .getVisibleText()
            .then(function(result6) {
               expect(result6).to.equal("True");
            });
      },

      "Row four, column one should say 'Yes'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(4) td:first-of-type")
            .getVisibleText()
            .then(function(result7) {
               expect(result7).to.equal("Yes");
            });
      },

      "Row four, column two should say 'True'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(4) td:nth-of-type(2)")
            .getVisibleText()
            .then(function(result8) {
               expect(result8).to.equal("True", "");
            });
      },

      "Row five, column one should say 'No'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(5) td:first-of-type")
            .getVisibleText()
            .then(function(result9) {
               expect(result9).to.equal("No");
            });
      },

      "Row five, column two should say 'False'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(5) td:nth-of-type(2)")
            .getVisibleText()
            .then(function(result10) {
               expect(result10).to.equal("False");
            });
      },

      "Row six, column one should say 'No'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(6) td:first-of-type")
            .getVisibleText()
            .then(function(result11) {
               expect(result11).to.equal("No");
            });
      },

      "Row six, column two should say 'False'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(6) td:nth-of-type(2)")
            .getVisibleText()
            .then(function(result12) {
               expect(result12).to.equal("False");
            });
      },

      "Row seven, column one should say 'No'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(7) td:first-of-type")
            .getVisibleText()
            .then(function(result13) {
               expect(result13).to.equal("No");
            });
      },

      "Row seven, column two should say 'False'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(7) td:nth-of-type(2)")
            .getVisibleText()
            .then(function(result14) {
               expect(result14).to.equal("False");
            });
      },

      "Row eight, column one should say 'No'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(8) td:first-of-type")
            .getVisibleText()
            .then(function(result15) {
               expect(result15).to.equal("No");
            });
      },

      "Row eight, column two should say 'False'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(8) td:nth-of-type(2)")
            .getVisibleText()
            .then(function(result16) {
               expect(result16).to.equal("False");
            });
      },

      "Row nine, column one should say 'Unknown'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(9) td:first-of-type")
            .getVisibleText()
            .then(function(result17) {
               expect(result17).to.equal("Unknown");
            });
      },

      "Row nine, column two should say 'Unknown'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(9) td:nth-of-type(2)")
            .getVisibleText()
            .then(function(result18) {
               expect(result18).to.equal("Unknown");
            });
      },

      "Row ten, column one should say 'Unknown'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(10) td:first-of-type")
            .getVisibleText()
            .then(function(result19) {
               expect(result19).to.equal("Unknown");
            });
      },

      "Row ten, column two should say 'Unknown'": function() {
         return this.remote.findByCssSelector("tr.alfresco-lists-views-layouts-Row:nth-of-type(10) td:nth-of-type(2)")
            .getVisibleText()
            .then(function(result20) {
               expect(result20).to.equal("Unknown");
            });
      }
   });
});