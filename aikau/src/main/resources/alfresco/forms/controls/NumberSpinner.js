/**
 * Copyright (C) 2005-2014 Alfresco Software Limited.
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
 * @module alfresco/forms/controls/NumberSpinner
 * @extends module:alfresco/forms/controls/BaseFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/BaseFormControl",
        "dojo/_base/declare",
        "dijit/form/NumberSpinner",
        "dojo/_base/lang"], 
        function(BaseFormControl, declare, NumberSpinner, lang) {
   
   return declare([BaseFormControl], {
      
      /**
       * This is the amount the value will be changed when using the "spin" controls
       * 
       * @instance
       * @type {number}
       * @default 1
       */
      delta: 1,

      /**
       * This is the minimum allowed number
       *
       * @instance
       * @type {number}
       * @default 0
       */
      min: null,

      /**
       * This is the maximum allowed number
       *
       * @instance
       * @type {number}
       * @default null
       */
      max: null,

      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_NumberSpinner__getWidgetConfig() {
         // Return the configuration for the widget
         return {
            id : this.generateUuid(),
            name: this.name,
            value: this.value,
            smallDelta: this.delta,
            constraints: {
               min: this.min,
               max: this.max,
               places: 0
            }
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_controls_NumberSpinner__createFormControl(config, domNode) {
         return new NumberSpinner(config);
      }
   });
});