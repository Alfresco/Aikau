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
 * @module aikauTesting/widgets/ObjectProcessingMixinButton
 * @extends module:alfresco/buttons/AlfButton
 * @mixes module:alfresco/core/ObjectProcessingMixin
 * @author Martin Doyle
 * @since 1.0.39
 */
define(["alfresco/buttons/AlfButton", 
        "alfresco/core/ObjectProcessingMixin", 
        "dojo/_base/declare"], 
        function(AlfButton, ObjectProcessingMixin, declare) {

   return declare([AlfButton, ObjectProcessingMixin], {

      /**
       * Button label
       *
       * @instance
       * @override
       * @type {string}
       * @default
       */
      label: "Generate and publish recursive payload",

      /**
       * Run after properties have been mixed into the instance
       *
       * @instance
       * @override
       */
      postMixInProperties: function() {
         this.inherited(arguments);
      },

      /**
       * Handles click events to publish a generated payload
       *
       * @instance
       * @param {object} evt The click event
       */
      onClick: function alfresco_buttons_AlfButton__onClick(evt) {

         // Publish generated payload
         var payload = this.processObject([], this._createRecursiveObject());
         this.alfPublish("GENERATED", payload, true);

         // Stop the event
         if (evt) {
            evt.stopPropagation();
         }
      },

      /**
       * Create a recursive test object
       *
       * @instance
       * @returns {object} A simple recursive object
       */
      _createRecursiveObject: function() {
         var obj1 = {
               foo: "bar"
            },
            obj2 = {
               hey: "you",
               obj1: obj1
            };
         obj1.obj2 = obj2;
         return obj2;
      }
   });
});