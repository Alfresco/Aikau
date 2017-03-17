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
 * @module aikauTesting/core/NotificationUtilsInstance
 * @extends external:dijit/_WidgetBase
 * @mixes external:dojo/_TemplatedMixin
 * @mixes module:alfresco/core/Core
 * @mixes module:alfresco/core/NotificationUtils
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "dijit/_WidgetBase", 
        "alfresco/core/Core",
        "alfresco/core/NotificationUtils",
        "dojo/text!./templates/NotificationUtilsInstance.html"], 
        function(declare, _Widget, AlfCore, NotificationUtils) {
   
   return declare([_Widget, AlfCore, NotificationUtils], {
      
      /**
       * 
       * @instance postCreate
       */
      postCreate: function aikauTesting_core_NotificationUtilsInstance__postCreate() {
         this.displayMessage("Test Notification");
         this.displayPrompt({
            title: "Test Title",
            textContent: "Test Prompt"
         });
      }
   });
});