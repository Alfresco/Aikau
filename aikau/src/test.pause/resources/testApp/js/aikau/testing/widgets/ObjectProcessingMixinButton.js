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
       * The current item to act upon
       *
       * @instance
       * @override
       * @type {object}
       * @default
       * @since 1.0.68
       */
      currentItem: null,

      /**
       * The type of test being run (i.e. what should this button do). Value
       * should be one of "RECURSIVE", "ARRAY" or "NESTED_ARRAY".
       *
       * @instance
       * @type {string}
       * @default
       * @since 1.0.68
       */
      testType: null,

      /**
       * Run after properties have been mixed into the instance
       *
       * @instance
       * @override
       */
      postMixInProperties: function() {
         this.inherited(arguments);
         this.currentItem = {
            foo: {
               bar: ["A", "B", "C"]
            },
            bar: ["A", "B", "C"]
         };
      },

      /**
       * Handles click events to publish a generated payload
       *
       * @instance
       * @param {object} evt The click event
       */
      onClick: function alfresco_buttons_AlfButton__onClick(evt) {

         // Build the payload
         var payload;
         switch (this.testType) {
            case "RECURSIVE":
               payload = this.processObject([], this._createRecursiveObject());
               break;
            case "ARRAY":
               payload = this.processObject(["processCurrentItemTokens"], {
                  val: "{bar}"
               });
               break;
            case "NESTED_ARRAY":
               payload = this.processObject(["processCurrentItemTokens"], {
                  val: "{foo.bar}"
               });
               break;
            case "HASH":
               payload = this.processObject(["processHashTokens"], {
                  val: "{hashName}"
               });
               break;
            case "MESSAGE":
               payload = this.processObject(["processMessageTokens"], {
                  val: "{propertyName}"
               });
               break;
            default:
               throw new Error("Unsupported test type (" + this.testType + ")");
               break;
         }

         // Publish generated payload
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
               foo: "bar",
               wibble: ["A", "B", "C"]
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