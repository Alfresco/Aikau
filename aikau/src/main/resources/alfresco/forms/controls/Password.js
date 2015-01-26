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
 * This is a specialization of the [DojoValidationTextBox]{@link module:alfresco/forms/controls/DojoValidationTextBox}
 * that sets the widget type to be of type "password". It should be used for capturing user password entry where the
 * password entered should not be visible.
 * 
 * @module alfresco/forms/controls/Password
 * @extends module:alfresco/forms/controls/DojoValidationTextBox
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/forms/controls/DojoValidationTextBox"], 
        function(declare, DojoValidationTextBox) {
   
   return declare([DojoValidationTextBox], {
      
      /**
       * Extends the [inherited function]{@link module:alfresco/forms/controls/DojoValidationTextBox#getWidgetConfig}
       * to make the text box of type "password".
       *
       * @instance
       */
      getWidgetConfig: function alfresco_forms_controls_DojoValidationTextBox__getWidgetConfig() {
         var config = this.inherited(arguments);
         config.type = "password";
         return config;
      }
   });
});