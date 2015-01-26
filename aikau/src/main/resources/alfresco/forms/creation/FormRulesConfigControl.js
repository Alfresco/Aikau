/**
 * Copyright (C) 2005-2013 Alfresco Software Limited.
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
 * @module alfresco/forms/creation/FormRulesConfigControl
 * @extends module:alfresco/forms/controls/MultipleEntryFormControl
 * @author Dave Draper
 */
define(["alfresco/forms/controls/MultipleEntryFormControl",
        "dojo/_base/declare",
        "alfresco/forms/creation/FormRulesConfigCreator"], 
        function(MultipleEntryFormControl, declare, FormRulesConfigCreator) {
   
   return declare([MultipleEntryFormControl], {
      
      /**
       * @instance
       */
      getWidgetConfig: function alfresco_forms_creation_FormRulesConfigControl__getWidgetConfig() {
         // NOTE: It's important to pass on the pubSubScope to ensure topics get scoped.
         return {
            id : this.generateUuid(),
            name: this.name,
            value: this.value,
            pubSubScope: this.pubSubScope
         };
      },
      
      /**
       * @instance
       */
      createFormControl: function alfresco_forms_creation_FormRulesConfigControl__createFormControl(config, domNode) {
         return new FormRulesConfigCreator(config);
      }
   });
});