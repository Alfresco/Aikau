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
 * <p>The _PublishPayloadMixin should be mixed into all modules that perform publications. It provides a consistent
 * way of generating the payload body. There are several different ways of generating a payload which include the
 * following:</p>
 * <ul><li>configured payload</li>
 * <li>the current item</li>
 * <li>the configured payload processed through one or more modifier functions</li>
 * <li>a new payload built from properties in the current item or a triggering publication payload</li>
 * <li>any of the above with the current item "mixed in"</li></ul></p>
 *
 * @example <caption>Standard configured payload</caption>
 * {
 *   name: "alfresco/menus/AlfMenuItem",
 *   config: {
 *     label: "Configured payload",
 *     publishTopic: "CUSTOM_TOPIC",
 *     publishPayloadType: "CONFIGURED",
 *     publishPayload: {
 *       value: "one"
 *     }
 *   }
 * }
 *
 * @example <caption>Standard configured payload with current item mixed in</caption>
 * {
 *   name: "alfresco/menus/AlfMenuItem",
 *   config: {
 *     label: "Configured payload with current item data",
 *     publishTopic: "CUSTOM_TOPIC",
 *     publishPayloadType: "CONFIGURED",
 *     publishPayload: {
 *       value: "one"
 *     },
 *     publishPayloadItemMixin: true
 *   }
 * }
 *
 * @example <caption>Current item payload</caption>
 * {
 *   name: "alfresco/menus/AlfMenuItem",
 *   config: {
 *     label: "Current item as payload",
 *     publishTopic: "CUSTOM_TOPIC",
 *     publishPayloadType: "CURRENT_ITEM"
 *   }
 * }
 *
 * @example <caption>Processed payload using values from current item</caption>
 * {
 *   name: "alfresco/menus/AlfMenuItem",
 *   config: {
 *     label: "Configured payload with current item data",
 *     publishTopic: "CUSTOM_TOPIC",
 *     publishPayloadType: "PROCESS",
 *     publishPayload: {
 *       value: "{value.on.currentItem}"
 *     },
 *     publishPayloadModifiers: ["processCurrentItemTokens"]
 *   }
 * }
 *
 * @example <caption>Build payload (using data from both the currentItem and the received payload)</caption>
 * {
 *   name: "alfresco/menus/AlfMenuItem",
 *   config: {
 *     label: "Configured payload with current item data",
 *     publishTopic: "CUSTOM_TOPIC",
 *     publishPayloadType: "BUILD",
 *     publishPayload: {
 *       shortName: {
 *         alfType: "item",
 *         alfProperty: "shortName"
 *       },
 *       visibility: {
 *         alfType: "payload",
 *         alfProperty: "value"
 *      }
 *    }
 * }
 *
 * @module alfresco/renderers/_PublishPayloadMixin
 * @extends alfresco/core/ObjectProcessingMixin
 * @auther Dave Draper
 * @author Richard Smith
 * @author Martin Doyle
 */
define(["dojo/_base/declare",
        "alfresco/core/ObjectProcessingMixin",
        "dojo/_base/lang",
        "alfresco/core/ObjectTypeUtils"],
        function(declare, ObjectProcessingMixin, lang, ObjectTypeUtils) {

   return declare([ObjectProcessingMixin], {

      /**
       * The default payload types
       *
       * @instance
       * @readonly
       * @enum {string}
       */
      PayloadTypes: {
         CONFIGURED: "CONFIGURED",
         CURRENT_ITEM: "CURRENT_ITEM",
         PROCESS: "PROCESS",
         BUILD: "BUILD"
      },

      /**
       * Whether to publish the topic globally
       *
       * @instance
       * @type {boolean}
       * @default
       */
      publishGlobal: false,

      /**
       * The payload to publish when this menu item is selected
       *
       * @instance
       * @type {object}
       * @default
       */
      publishPayload: null,

      /**
       * Whether to mix the current item into the generated payload
       *
       * @instance 
       * @type {boolean}
       * @default
       */
      publishPayloadItemMixin: false,

      /**
       * An array of modifier functions to apply when the type is
       * [PROCESS]{@link module:alfresco/renderers/_PublishPayloadMixin#PayloadTypes}
       *
       * @instance
       * @type {string[]}
       * @default
       */
      publishPayloadModifiers: null,

      /**
       * The type of payload to generate. When specified, should comprise one or more of the default values defined by
       * [the PayloadTypes enum]{@link module:alfresco/renderers/_PublishPayloadMixin#PayloadTypes}
       *
       * @instance
       * @type {module:alfresco/renderers/_PublishPayloadMixin#PayloadTypes}
       * @default
       */
      publishPayloadType: null,

      /**
       * Whether to publish the topic using the parent pubSubScope
       *
       * @instance
       * @type {boolean}
       * @default
       */
      publishToParent: false,

      /**
       * The topic to publish when this menu item is selected
       *
       * @instance
       * @type {string}
       * @default
       */
      publishTopic: null,

      /**
       * This variable references payloads generated by calls to
       * [getGeneratedPayload]{@link module:alfresco/renderers/_PublishPayloadMixin#getGeneratedPayload}.
       *
       * @instance
       * @type {object}
       * @default
       */
      _generatedPayload: null,

      /**
       * This function will retrieve the generated payload (and will generate it if this is the first time that it
       * has been requested).
       *
       * @instance
       * @param {boolean} [regenerate] If this is passed as true then any previously generated payload will be regenerated.
       * @param {object} [receivedPayload] A payload that has been received that triggers the generation.
       * @returns {object} The generated payload.
       */
      getGeneratedPayload: function alfresco_renderers__PublishPayloadMixin__generatePayload(regenerate, receivedPayload) {
         if (this._generatedPayload === null || regenerate === true || receivedPayload !== null)
         {
            this._generatedPayload = this.generatePayload(this.publishPayload, this.currentItem, receivedPayload, this.publishPayloadType, this.publishPayloadItemMixin, this.publishPayloadModifiers);
         }
         return this._generatedPayload;
      },

      /**
       * Generates the payload based on the supplied attributes.
       *
       * @instance
       * @param {object} configuredPayload The configured payload
       * @param {object} currentItem The current item
       * @param {object} receivedPayload A payload that may have been received to trigger the request to generate a new payload (set as null if not applicable)
       * @param {string} [payloadType] The type of payload to generate (one of "CONFIGURED", "CURRENT_ITEM", "PROCESS" or "BUILD")
       * @param {boolean} [mixinCurrentItem] Whether to mixin the current item into the generated payload
       * @param {Array} publishPayloadModifiers An array of modifier functions to apply when the type is "PROCESS"
       * @returns {object} The generated payload
       */
      generatePayload: function alfresco_renderers__PublishPayloadMixin__generatePayload(configuredPayload, currentItem, receivedPayload, payloadType, mixinCurrentItem, publishPayloadModifiers) {
         var generatedPayload = null;
         switch (payloadType || "CONFIGURED")
         {
            case "CONFIGURED":
               // No payload type has been configured, or has been set to the default of "CONFIGURED" - just use the payload as is
               generatedPayload = configuredPayload;

               break;
            case "CURRENT_ITEM":
               // Use the current item as the payload...
               generatedPayload = currentItem;

               break;
            case "PROCESS":
               // Clone the configured payload so as not to "pollute" the statically defined value...
               generatedPayload = lang.clone(configuredPayload);

               // The configured payload should be process the payload using the modifier functions
               this.processObject(publishPayloadModifiers, generatedPayload);

               break;
            case "BUILD":
               // Clone the configured payload so as not to "pollute" the statically defined value...
               generatedPayload = lang.clone(configuredPayload);

               // Build the payload using the "alfType" and "alfProperty" keywords...
               generatedPayload = this.buildPayload(generatedPayload, currentItem, receivedPayload);

               break;
         }

         // Mixin the current item into the payload if required...
         if (mixinCurrentItem === true)
         {
            if (this.currentItem !== null)
            {
               lang.mixin(generatedPayload, currentItem);
            }
            else
            {
               this.alfLog("warn", "A request was made to mix the 'currentItem' into the publish payload, but no 'currentItem' has been defined", this);
            }
         }
         return generatedPayload;
      },

      /**
       * <p>This function is used to process configurable payloads. If a publishPayload property is available on the configuration
       * object it iterates over the first-level of attributes of the defined payload and checks to see if the
       * attribute is an object featuring both 'alfType' and 'alfProperty' properties. If the attribute does match this
       * criteria then the payload will be processed to attempt to retrieve the defined 'alfProperty' from a specific
       * type. Currently two types are supported:
       * <ul><li>'item' which indicates the property is of the item object</li>
       * <li>'payload' which indicates the property is of the payload object</li></ul><p>
       * <p>A defReturn attribute provides the option for the default return to be defined should there be no
       * publishPayload provided on the configuration object.</p>
       *
       * @instance
       * @param {object} configuredPayload The configured payload - this is used to generate a new payload
       * @param {object} currentItem The current item
       * @param {object} receivedPayload The payload that triggered the request to generate a new payload
       * @returns {object} The payload to be published
       */
      buildPayload: function alfresco_renderers__PublishPayloadMixin__buildPayload(configuredPayload, currentItem, receivedPayload) {
         if (configuredPayload !== null)
         {
            // Copy the original to grab data from...
            for (var key in configuredPayload)
            {
               if (configuredPayload.hasOwnProperty(key))
               {
                  configuredPayload[key] = this.processValue(configuredPayload[key], configuredPayload, currentItem, receivedPayload);
               }
            }
            return configuredPayload;
         }
      },

      /**
       * Called from [buildPayload]{@link module:alfresco/renderers/_PublishPayloadMixin#buildPayload} on requests
       * to build a new payload item.
       *
       * @instance
       * @param {object} configuredPayload The configured payload - this is used to generate a new payload
       * @param {object} currentItem The current item
       * @param {object} receivedPayload The payload that triggered the request to generate a new payload
       * @returns {object} The processed value.
       */
      processValue: function alfresco_renderers__PublishPayloadMixin__processValue(value, configuredPayload, currentItem, receivedPayload) {
         // Catch null values (typeof null === "object")
         if (value !== null && ObjectTypeUtils.isObject(value))
         {
            if (value.alfType !== undefined && value.alfProperty !== undefined)
            {
               var type = value.alfType;
               var property = value.alfProperty;

               if (type === "item" && currentItem)
               {
                  value = lang.getObject(property, false, currentItem);
               }
               else if (type === "payload" && receivedPayload)
               {
                  value = lang.getObject(property, false, receivedPayload);
               }
               else
               {
                  this.alfLog("warn", "A payload was defined with 'alfType' and 'alfProperty' attributes but the 'alfType' attribute was neither 'item' nor 'payload' (which are the only supported types), or the target object was null", this);
               }
            }
            else
            {
               // If it isn't a property we can build, does it contain one we can?
               for (var nestedKey in value)
               {
                  if (value.hasOwnProperty(nestedKey))
                  {
                     value[nestedKey] = this.processValue(value[nestedKey], configuredPayload, currentItem, receivedPayload);
                  }
               }
            }
         }
         return value;
      }
   });
});