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
 * Extends the standard [inline property editor]{@link module:alfresco/renderers/InlineEditProperty} to 
 * change the edit text box to be a select menu. The select menu is rendered by a
 * [DojoSelect widget]{@link module:alfresco/forms/controls/DojoSelect} and this module accepts the same 
 * [optionsConfig]{@link module:alfresco/forms/controls/BaseFormControl#optionsConfig} as it does.
 *
 * @module alfresco/renderers/InlineEditSelect
 * @extends module:alfresco/renderers/InlineEditProperty
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/renderers/InlineEditProperty",
        "alfresco/forms/controls/DojoSelect"], 
        function(declare, InlineEditProperty, DojoSelect) {

   return declare([InlineEditProperty], {

      /**
       * Overrides the [inherited function]{@link module:alfresco/renderers/InlineEditProperty#getPrimaryFormWidget}
       * to return a [select form control]{@link module:alfresco/forms/controls/DojoSelect}.
       *
       * @instance
       * @returns {object} The widget for editing.
       */
      getPrimaryFormWidget: function alfresco_renderers_InlineEditSelect__getPrimaryFormWidget() {
         return {
            name: "alfresco/forms/controls/DojoSelect",
            config: {
               name: this.postParam,
               optionsConfig: this.optionsConfig,
               _convertStringValuesToBooleans: true,
               additionalCssClasses: "hiddenlabel",
               label: this.message(this.editLabel)
            }
         };
      }
   });
});