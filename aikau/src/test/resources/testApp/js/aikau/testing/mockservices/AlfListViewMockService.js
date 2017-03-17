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
 * @module aikauTesting/mockservices/AlfListViewMockService
 * @extends module:alfresco/core/Core
 * @author Martin Doyle
 */
define(["alfresco/core/Core",
      "dojo/_base/declare",
      "dojo/_base/lang"
   ],
   function(AlfCore, declare, lang) {

      return declare([AlfCore], {

         /**
          * The responses to subscribe and publish
          *
          * @type {Array}
          */
         responses: {
            "GET_ERROR_LIST_DATA": {
               items: [null]
            },
            "GET_EMPTY_LIST_DATA": {
               items: []
            },
            "GET_FAILING_LIST_DATA": {
               wibble: []
            },
            "GET_LIST_DATA": {
               items: [{
                  name: "Tinky Winky"
               }, {
                  name: "Dipsy"
               }, {
                  name: "Laa-Laa"
               }, {
                  name: "Po"
               }]
            },
         },

         /**
          * Constructor
          *
          * @instance
          * @param {array} args The constructor arguments.
          */
         constructor: function alfresco_testing_mockservices_AlfListViewMockService__constructor(args) {
            /*jshint loopfunc:true*/
            declare.safeMixin(this, args);
            for (var topic in this.responses) {
               if (this.responses.hasOwnProperty(topic)) {
                  this.alfSubscribe(topic, lang.hitch(this, function(payload) {
                     this.alfPublish(payload.alfResponseTopic + "_SUCCESS", {
                        response: this.responses[payload.alfResponseTopic]
                     });
                  }));
               }
            }
         }
      });
   });