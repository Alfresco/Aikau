/**
 * Copyright (C) 2005-2017 Alfresco Software Limited.
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
 * @module aikauTesting/mockservices/MultiSelectMockService
 * @extends module:alfresco/core/Core
 * @author Martin Doyle
 */
define(["alfresco/core/Core",
      "dojo/_base/array",
      "dojo/_base/declare",
      "dojo/_base/lang"
   ],
   function(AlfCore, array, declare, lang) {

      return declare([AlfCore], {

         /**
          * Mock list of items with long labels
          * (Taken from the "Celestial Emporium of Benevolent Knowledge")
          *
          * @type {object[]}
          */
         _celestialCategories: [{
            name: "Those that belong to the emperor",
            label: "Those that belong to the emperor",
            value: "CAT_01"
         }, {
            name: "Embalmed ones",
            label: "Embalmed ones",
            value: "CAT_02"
         }, {
            name: "Those that are trained",
            label: "Those that are trained",
            value: "CAT_03"
         }, {
            name: "Suckling pigs",
            label: "Suckling pigs",
            value: "CAT_04"
         }, {
            name: "Mermaids (or Sirens)",
            label: "Mermaids (or Sirens)",
            value: "CAT_05"
         }, {
            name: "Fabulous ones",
            label: "Fabulous ones",
            value: "CAT_06"
         }, {
            name: "Stray dogs",
            label: "Stray dogs",
            value: "CAT_07"
         }, {
            name: "Those that are included in this classification",
            label: "Those that are included in this classification",
            value: "CAT_08"
         }, {
            name: "Those that tremble as if they were mad",
            label: "Those that tremble as if they were mad",
            value: "CAT_09"
         }, {
            name: "Innumerable ones",
            label: "Innumerable ones",
            value: "CAT_10"
         }, {
            name: "Those drawn with a very fine camel hair brush",
            label: "Those drawn with a very fine camel hair brush",
            value: "CAT_11"
         }, {
            name: "Et cetera",
            label: "Et cetera",
            value: "CAT_12"
         }, {
            name: "Those that have just broken the flower vase",
            label: "Those that have just broken the flower vase",
            value: "CAT_13"
         }, {
            name: "Those that, at a distance, resemble flies",
            label: "Those that, at a distance, resemble flies",
            value: "CAT_14"
         }],

         /**
          * A self-incrementing response delay that permits easy replication of a race-condition bug
          *
          * @type {number}
          * @default
          */
         _responseDelayMs: 250,

         /**
          * Constructor
          *
          * @instance
          * @param {array} args The constructor arguments.
          */
         constructor: function alfresco_testing_mockservices_MultiSelectMockService__constructor(args) {
            declare.safeMixin(this, args);
            this.alfSubscribe("ALF_RETRIEVE_CELESTIAL_CATEGORIES", lang.hitch(this, this._getCelestialCategories));
         },

         /**
          * Handle comment creation
          *
          * @instance
          * @param    {object} payload The publish payload
          */
         _getCelestialCategories: function alfresco_testing_mockservices_MultiSelectMockService___getCelestialCategories(payload) {
            setTimeout(lang.hitch(this, function() {
               this.alfPublish(payload.alfResponseTopic || payload.responseTopic, {
                  response: this._celestialCategories
               }, false, false, payload.alfResponseScope);
            }), (this._responseDelayMs += 50));
         }
      });
   });