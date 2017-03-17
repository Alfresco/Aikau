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
 * @module aikauTesting/mockservices/ActivitySummaryMockService
 * @extends module:alfresco/core/Core
 * @author Martin Doyle
 */
define(["alfresco/core/Core",
      "dojo/_base/declare",
      "dojo/_base/lang",
      "dojo/text!./responseTemplates/ActivitySummary/activity.json"
   ],
   function(AlfCore, declare, lang, activityJson) {

      return declare([AlfCore], {

         /**
          * Constructor
          *
          * @instance
          */
         constructor: function alfresco_testing_mockservices_ActivitySummaryMockService__constructor() {
            this.alfSubscribe("RETRIEVE_ACTIVITY", lang.hitch(this, this._retrieveActivity));
         },

         /**
          * Retrieve the sample data
          *
          * @instance
          */
         _retrieveActivity: function alfresco_testing_mockservices_ActivitySummaryMockService___retrieveActivity() {
            this.alfPublish("ACTIVITY_RETRIEVED", {
               activities: JSON.parse(activityJson)
            });
         }
      });
   });