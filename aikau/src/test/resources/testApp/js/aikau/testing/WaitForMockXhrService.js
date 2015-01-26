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
 * @module aikauTesting/WaitForMockXhrService
 * @extends module:alfresco/core/ProcessWidgets
 * @author Dave Draper
 */
define(["dojo/_base/declare",
        "alfresco/core/ProcessWidgets",
        "dojo/_base/lang"], 
        function(declare, ProcessWidgets, lang) {
   
   return declare([ProcessWidgets], {
      
      /**
       * Processes the widgets into the content node.
       * 
       * @instance
       */
      postCreate: function alfresco_testing_WaitForMockXhrService__postCreate() {
         this.alfSubscribe("ALF_MOCK_XHR_SERVICE_READY", lang.hitch(this, this.processWidgets, this.widgets, this.containerNode));
      }
   });
});