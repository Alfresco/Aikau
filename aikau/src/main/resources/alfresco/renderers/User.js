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
 * This renderer can be used for rendering a clickable display of the user where the display name
 * and user name are derived from splitting the 
 * [propertyToRender]{@link module:alfresco/renderers/Property#propertyToRender} on the "|"
 * delimitter. 
 * 
 * @module alfresco/renderers/User
 * @extends alfresco/renderers/PropertyLink
 * @author Dave Draper
 * @since 1.0.86
 */
define(["dojo/_base/declare",
        "alfresco/renderers/PropertyLink",
        "dojo/_base/lang"], 
        function(declare, PropertyLink, lang) {

   return declare([PropertyLink], {

      /**
       * Overrides the [inherited attribute]{@link module:alfresco/renderers/PropertyLink#useCurrentItemAsPayload}
       * so that the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem} is not used as
       * the published payload by default.
       *
       * @instance
       * @type {boolean}
       * @default
       */
      useCurrentItemAsPayload: false,

      /**
       * The property within the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}
       * to set the user name.
       *
       * @instance
       * @type {string}
       * @default
       */
      userNameProperty: "userName",

      /**
       * The property within the [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}
       * to set the display name.
       *
       * @instance
       * @type {string}
       * @default
       */
      displayNameProperty: "displayName",

      /**
       * Extends the [inherited function]{@link module:alfresco/renderers/Property#getRenderedProperty}
       * to establish the userName and displayName from the tokenised value. If the value supplied is
       * not delimited by "|" it is set as both the userName and displayName. The 
       * [displayNameProperty]{@link module:alfresco/renderers/User#displayNameProperty} and
       * [userNameProperty]{@link module:alfresco/renderers/User#userNameProperty} are set in the
       * [currentItem]{@link module:alfresco/core/CoreWidgetProcessing#currentItem}.
       * 
       * @instance
       * @param {string} property The name of the property to render
       * @returns {string} The rendered property
       */
      getRenderedProperty: function alfresco_renderers_Property__getRenderedProperty(property) {
         var displayName = property;
         var userName = property;
         if (property)
         {
            var tokens = property.split("|");
            if (tokens.length > 1)
            {
               userName = tokens[0];
               displayName = tokens[1];

               if (tokens.length === 3)
               {
                  displayName += (" " + tokens[2]);
               }
            }
         }

         lang.setObject(this.userNameProperty, userName, this.currentItem);
         lang.setObject(this.displayNameProperty, displayName, this.currentItem);
         return this.inherited(arguments, [displayName]);
      }
   });
});